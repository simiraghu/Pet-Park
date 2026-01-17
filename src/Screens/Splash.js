import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  consolepro,
  localimag,
  mobileH,
  mobileW,
  localStorage,
  apifuntion,
  config,
} from '../Provider/utilslib/Utils';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import i18next from 'i18next';
import OneSignal from 'react-native-onesignal';
import {SafeAreaView} from 'react-native-safe-area-context';

global.add_location = 'NA';
global.notification_count = 0;
global.feed_notification_count = 0;
global.shortName = 'NA';

global.details = 'NA';

const Splash = ({navigation}) => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.register.language);

  const [player_id, setPlayer_id] = useState('');
  const [consoleValue, setConsoleValue] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(true);
  var playerId;

  const {t} = useTranslation();

  useLayoutEffect(() => {
    setLanguage();
    changeLayout();
    let timeOut = setTimeout(() => {
      authenticateSession();
    }, 2500);
    return () => clearTimeout(timeOut);
  }, []);

  const OSLog = (message, optionalArg) => {
    if (optionalArg) {
      message = message + JSON.stringify(optionalArg);
    }

    let updatedConsoleValue = consoleValue
      ? `${consoleValue}\n${message}`
      : message;

    setConsoleValue(updatedConsoleValue);
  };

  useEffect(() => {
    OneSignal.setAppId(config.onesignalappid);
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);

    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      consolepro.consolelog('Notification permission response:', response);

      localStorage.setItemString('push_notification', String(response));
    });

    OneSignal.addSubscriptionObserver(event => {
      OSLog('OneSignal: subscription changed:', event);
      setIsSubscribed(event.to.isSubscribed);
    });

    const interval = setInterval(async () => {
      try {
        const state = await OneSignal.getDeviceState();
        if (state?.isSubscribed && state?.userId) {
          clearInterval(interval);
          consolepro.consolelog(state, '<<STATE');
          config.player_id_me = state.userId;
          setPlayer_id(state.userId); // ✅ Update state
        }
      } catch (error) {
        console.log('Error fetching device state:', error);
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  consolepro.consolelog('player id', config.player_id_me);

  // Authentication ===========

  const authenticateSession = async () => {
    const userData = await localStorage.getItemObject('user_array');
    const password = await localStorage.getItemString('password');
    const OTP = await localStorage.getItemString('otp');

    consolepro.consolelog('User _data =>>>>>>>>>>>', userData);
    consolepro.consolelog(OTP, '<<OTP');
    consolepro.consolelog(password, '<<Password');

    if (password) {
      let result = userData;
      consolepro.consolelog('splasedata ======>>', result);
      if (result != null) {
        if (result.login_type == 0) {
          //login-type -> 0 -app, 1 - google, 2- apple
          if (result.otp_verify == 1) {
            let email = result.email;
            var data = new FormData();
            data.append('email', email);
            data.append('password', password);
            data.append('device_type', config.device_type);
            data.append('player_id', playerId);
            data.append('login_type', config.login_type);
            consolepro.consolelog('cc', data);

            const API_URL = config.baseURL + 'login_by_email';
            consolepro.consolelog(API_URL, 'AP');

            apifuntion
              .postApi(API_URL, data, 1)
              .then(res => {
                consolepro.consolelog(res, '<<<<res');
                if (res?.success == true) {
                  const userId = result.user_id;
                  localStorage.setItemString('token', res?.token);
                  localStorage.setItemString(
                    'bring_type',
                    String(res?.userDataArray?.bring_type),
                  );
                  localStorage.setItemObject('user_array', res?.userDataArray);
                  if (res?.userDataArray?.profile_completed == 1) {
                    setTimeout(() => {
                      navigation.navigate('FriendshipHome', {userId});
                    }, 500);
                  } else {
                    setTimeout(() => {
                      navigation.navigate('WelcomeScreen');
                    }, 500);
                  }
                  // navigation.replace('FriendshipHome', {userId});
                } else {
                  // setTimeout(() => {
                  //   msgProvider.alert(
                  //     'information',
                  //     res?.msg[config.language],
                  //     false,
                  //   );

                  //   return false;
                  // }, 300);
                  navigation.navigate('WelcomeScreen');
                }
              })
              .catch(err => {
                consolepro.consolelog(err, '<<<<<err');
                navigation.navigate('WelcomeScreen');
              });
          } else {
            navigation.navigate('WelcomeScreen');
          }
        } else {
          navigation.navigate('WelcomeScreen');
        }
      } else {
        navigation.navigate('WelcomeScreen');
      }
    } else if (OTP) {
      let result = userData;
      consolepro.consolelog('splasedata', result);

      if (result != null) {
        if (result.login_type == 0) {
          //login-type -> 0 -app, 1 - google, 2- apple
          if (result.otp_verify == 1) {
            let mobile = result.mobile;
            var data = new FormData();
            data.append('mobile', mobile);
            data.append('otp', OTP);

            data.append('device_type', config.device_type);
            data.append('player_id', config.player_id);
            data.append('login_type', config.login_type);
            consolepro.consolelog('data', data);

            const API_URL = config.baseURL + 'login_by_mobile';
            consolepro.consolelog(API_URL, 'AP');
            apifuntion
              .postApi(API_URL, data, 1)
              .then(res => {
                consolepro.consolelog(res, '<<<<res');
                if (res?.success == true) {
                  const userId = result.user_id;
                  localStorage.setItemString('token', res?.token);
                  localStorage.setItemString(
                    'bring_type',
                    String(res?.userDataArray?.bring_type),
                  );
                  localStorage.setItemObject('user_array', res?.userDataArray);
                  if (res?.userDataArray?.profile_completed == 1) {
                    setTimeout(() => {
                      navigation.navigate('FriendshipHome', {userId});
                    }, 500);
                  } else {
                    setTimeout(() => {
                      navigation.navigate('WelcomeScreen');
                    }, 500);
                  }
                  navigation.replace('FriendshipHome', {userId});
                } else {
                  setTimeout(() => {
                    msgProvider.alert(
                      'information',
                      res?.msg[config.language],
                      false,
                    );

                    return false;
                  }, 300);
                  navigation.navigate('WelcomeScreen');
                }
              })
              .catch(err => {
                consolepro.consolelog(err, '<<<<<err');
              });
          } else {
            navigation.navigate('WelcomeScreen');
          }
        } else {
          navigation.navigate('WelcomeScreen');
        }
      } else {
        navigation.navigate('WelcomeScreen');
      }
    } else if (userData) {
      const userData = await localStorage.getItemObject('user_array');
      let result = userData;
      consolepro.consolelog('splasedata ======>>', result);
      if (result != null) {
        // navigation.navigate('WelcomeScreen');
        consolepro.consolelog('profile_complete', result?.profile_completed);
        if (result?.profile_completed == 1) {
          consolepro.consolelog('result ====>>', result);
          let id = '';
          if (result.login_type == 2) {
            id = result?.apple_id;
          } else if (result.login_type == 1) {
            id = result?.google_id;
          }
          {
            var data = new FormData();
            data.append('social_email', result.email);
            data.append('social_id', id);
            data.append('device_type', config.device_type);
            data.append('player_id', config.player_id_me);
            data.append(
              'social_type',
              result?.login_type == 1
                ? 'google'
                : result?.login_type == 2
                ? 'apple'
                : 'app',
            );
            data.append('user_type', result.user_type);
            console.log('data', data);

            consolepro.consolelog('Id =========>>', id);
            // return false;
            const url = config.baseURL + 'social_login';

            console.log('url', url);

            apifuntion
              .postApi(url, data, 1)
              .then(res => {
                console.log(res);
                if (res?.success == true) {
                  consolepro.consolelog('res =====>>', res);
                  var user_arr = res?.userDataArray;
                  const userId = res?.userDataArray?.user_id;
                  var jwtToken = res?.token;

                  consolepro.consolelog('Token========>>', jwtToken);
                  localStorage.setItemString('token', jwtToken);

                  localStorage.setItemObject('user_array', user_arr);

                  if (jwtToken != null) {
                    global.token = jwtToken;
                  }

                  if (res?.userDataArray?.profile_completed == 1) {
                    setTimeout(() => {
                      navigation.navigate('FriendshipHome', {userId});
                    }, 500);
                  } else {
                    setTimeout(() => {
                      navigation.navigate('WelcomeScreen');
                      data;
                    }, 500);
                  }
                } else {
                  navigation.navigate('WelcomeScreen');
                }
              })
              .catch(error => {
                console.log('-------- error ------- ' + error);
              });
          }
        } else {
          navigation.navigate('WelcomeScreen');
        }
      } else {
        navigation.navigate('WelcomeScreen');
      }
    } else {
      navigation.navigate('WelcomeScreen');
    }
  };

  const setLanguage = async () => {
    language == 0
      ? i18next.changeLanguage('en')
      : language == 1
      ? i18next.changeLanguage('ar')
      : i18next.changeLanguage('ch');

    config.language = language;
  };

  const changeLayout = async () => {
    if (language == 1) {
      config.textalign = 'right';
      language_set_new(1);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        style={styles.mainView}
        source={localimag?.icon_splash_screen}>
        {/* <LinearGradient
        colors={['#042222', '#85B068']}
        style={{flex: 1}}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            height: mobileH,
          }}>
          <Image
            source={localimag.icon_pomsss_logo}
            style={{
              width: (mobileW * 180) / 100,
              height: (mobileW * 180) / 100,
            }}
          />
        </View>
      </LinearGradient> */}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
});
