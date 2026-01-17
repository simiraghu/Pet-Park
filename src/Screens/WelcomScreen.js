import {
  BackHandler,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Colors,
  config,
  Font,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  localStorage,
  consolepro,
  apifuntion,
} from '../Provider/utilslib/Utils';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import CommonBlackButton from '../Components/CommonBlackButton';
import {useTranslation} from 'react-i18next';
import {SocialLogin} from '../Provider/Apicallingprovider/SocialLoginProvider';
import {SafeAreaView} from 'react-native-safe-area-context';

const WelcomScreen = ({navigation}) => {
  const handleBackPress = useCallback(() => {
    BackHandler.exitApp();
    return true;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => backHandler.remove();
    }, [handleBackPress]),
  );

  const {t} = useTranslation();
  const {navigate} = useNavigation();

  const [terms_and_condition_content, setTerms_and_condition_content] =
    useState('');
  const [privacy_policy, setPrivacy_policy] = useState('');

  const API_URL = config.baseURL + 'get_content?language_id=' + config.language;
  consolepro.consolelog(API_URL, '<<API');

  // GEt content ---

  const GetContent = async () => {
    try {
      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success === true) {
            var data = res?.content_arr;
            // consolepro.consolelog(data, '<<<data');
            for (let i = 0; i < data.length; i++) {
              // privacy policy ------
              var privacyPolicy_URL = '';
              if (data[i].content_type === 1) {
                privacyPolicy_URL = data[i].content_url;
                setPrivacy_policy(privacyPolicy_URL);
                consolepro.consolelog('Line 63', privacyPolicy_URL);
              }

              // terms and conditions------
              var termsAndConditions_URL = '';
              if (data[i].content_type === 2) {
                termsAndConditions_URL = data[i].content_url;
                setTerms_and_condition_content(termsAndConditions_URL);
                consolepro.consolelog('Line 68', termsAndConditions_URL);
              }
            }
          } else {
            if (res?.details?.active_flag === 0) {
              localStorage.clear();
              localStorage.removeItem('token');
              localStorage.removeItem('user_data');
              localStorage.removeItem('password');
              setTimeout(() => {
                navigate('WelcomeScreen');
              }, 300);
            } else {
              consolepro.consolelog(res, '<<REs');
            }
          }
        })
        .catch(error => consolepro.consolelog(error, '<<<<<<<<<<error'));
    } catch (error) {
      consolepro.consolelog(error, '<<<<<<error');
    }
  };

  useEffect(() => {
    GetContent();
  }, []);

  //-------google login ---------//
  const GoogleLogin = () => {
    SocialLogin.Socialfunction(navigation, 'google', 'google');
  };

  const Applelogin = () => {
    SocialLogin.Socialfunction(navigation, 'apple', 'apple');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainView}>
        {/* -------- Image ------- */}
        <View style={{width: mobileW, height: (mobileH * 50) / 100}}>
          <Image
            source={localimag.icon_welcome_screen_back}
            style={{width: mobileW, height: (mobileH * 50) / 100}}
          />
        </View>

        {/* ------- find pet perfect ------ */}
        <View
          style={{
            alignSelf: 'center',
            marginTop: (mobileW * 2) / 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: Colors.whiteColor,
              fontFamily: Font.FontSemibold,
              fontSize: (mobileW * 7.5) / 100,
            }}>
            {t('find_pet_perfect_txt')}
          </Text>

          {/* ----- companion btn ---- */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: (mobileW * 35) / 100,
              height: (mobileW * 8) / 100,
              backgroundColor: Colors.ColorCompanionBtn,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: Colors.themeColor,
              borderWidth: 1,
              borderRadius: (mobileW * 5) / 100,
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 3.5) / 100,
              }}>
              {t('companion_txt')}
            </Text>
            <Image
              source={localimag.icon_companion}
              style={{
                width: (mobileW * 5) / 100,
                height: (mobileW * 5) / 100,
                marginLeft: (mobileW * 1) / 100,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* --- login buttons ----- */}
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.themeColor,
            borderTopLeftRadius: (mobileW * 10) / 100,
            borderTopRightRadius: (mobileW * 10) / 100,
            marginTop: (mobileW * 3) / 100,
          }}>
          {Platform.OS === 'ios' && (
            <CommonBlackButton
              title={t('continue_with_apple_txt')}
              containerStyle={{marginTop: (mobileW * 5) / 100}}
              leftIcon={localimag.icon_apple}
              leftIconStyle={{
                width: (mobileW * 7) / 100,
                height: (mobileW * 7) / 100,
              }}
              onPress={() => Applelogin()}
            />
          )}
          <CommonBlackButton
            title={t('continue_with_google_txt')}
            containerStyle={{
              marginTop:
                Platform.OS === 'ios'
                  ? (mobileW * 4) / 100
                  : (mobileW * 10) / 100,
              backgroundColor: Colors.whiteColor,
            }}
            leftIcon={localimag.icon_google}
            leftIconStyle={{
              width: (mobileW * 7) / 100,
              height: (mobileW * 7) / 100,
            }}
            btnTextStyle={{color: Colors.themeColor2}}
            onPress={() => GoogleLogin()}
          />

          <View
            style={{
              marginTop:
                Platform.OS === 'ios'
                  ? (mobileW * 4) / 100
                  : (mobileW * 6) / 100,
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <CommonBlackButton
              title={t('mobile_txt')}
              containerStyle={{width: (mobileW * 38) / 100}}
              onPress={() => navigation.navigate('MobileLogin')}
            />

            <CommonBlackButton
              title={t('email_txt')}
              containerStyle={{
                width: (mobileW * 38) / 100,
                marginLeft: (mobileW * 3) / 100,
              }}
              onPress={() => navigation.navigate('EmailLogin')}
            />
          </View>

          {/* -------------- */}
          <View
            style={{
              width: mobileW,
              height: (mobileW * 0.5) / 100,
              marginTop: (mobileW * 5) / 100,
              backgroundColor: Colors.whiteColor,
              marginHorizontal: (mobileW * 5) / 100,
              alignSelf: 'center',
            }}></View>

          {/* ----- terms of service & privacy policy ------ */}
          <View
            style={{
              marginTop: (mobileW * 2) / 100,
              backgroundColor: Colors.themeColor,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontRegular,
                  fontSize: (mobileW * 3.5) / 100,
                }}>
                {t('bysigning_up_agree_to_our')}
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('ContentPage', {
                    pagename: t('termsAndConditions_txt'),
                    contentpage: 2,
                    user_type: 1,
                    content_data: terms_and_condition_content,
                  });
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontRegular,
                    fontSize: (mobileW * 3) / 100,
                    borderBottomColor: Colors.themeColor2,
                    borderBottomWidth: 0.5,
                  }}>
                  {t('term_and_service_txt')}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontRegular,
                  fontSize: (mobileW * 3.5) / 100,
                }}>
                {t('and_txt')}
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('ContentPage', {
                    pagename: t('privacyPolicy_txt'),
                    contentpage: 1,
                    user_type: 1,
                    content_data: privacy_policy,
                  });
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontRegular,
                    fontSize: (mobileW * 3) / 100,
                    marginLeft: (mobileW * 1) / 100,
                    borderBottomColor: Colors.themeColor2,
                    borderBottomWidth: 0.5,
                  }}>
                  {t('privacy_policy')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    height: mobileH,
    backgroundColor: Colors.ColorBlack,
  },
});
