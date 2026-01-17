import {
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {localimag} from '../Provider/Localimage';
import {
  apifuntion,
  Colors,
  config,
  consolepro,
  Font,
  Lang_chg,
  mobileH,
  mobileW,
  msgProvider,
  localStorage,
} from '../Provider/utilslib/Utils';
import InputField from '../Components/InputField';
import CommonButton from '../Components/CommonButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonBlackButton from '../Components/CommonBlackButton';
import {InputWithIcon} from '../Components/InputWithIcon';
import {validation} from '../Provider/Messageconsolevalidationprovider/Validation_provider';
import {useTranslation} from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import i18next from '../Services/i18next';
import {useDispatch, useSelector} from 'react-redux';
import {setLanguage} from '../Redux/Slice/RegisterSlice';
import {language_set} from '../Provider/Language_provider';
import {useFocusEffect} from '@react-navigation/native';
import {SocialLogin} from '../Provider/Apicallingprovider/SocialLoginProvider';
import {SafeAreaView} from 'react-native-safe-area-context';

const EmailLogin = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [secureText, setSecureText] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const [isLanguageModal, setIsLanguageModal] = useState(false);
  const [languages, setLanguages] = useState([
    {label: 'English', value: 0},
    {label: 'Arabic', value: 1},
    {label: 'Chinese', value: 2},
  ]);

  const [isChangeLanguage, setIsChangeLanguage] = useState(0);

  const dispatch = useDispatch();

  const {t} = useTranslation();

  const language = useSelector(state => state.register?.language);

  const SetLanguage = val => {
    config.language = val;
  };

  useLayoutEffect(() => {
    setInitialState();
  }, []);

  const setInitialState = () => {
    setIsChangeLanguage(language);
  };

  const updateLanguage = value => {
    if (value === language) return; // prevent re-update

    if (value == 0) {
      SetLanguage(0);
      i18next.changeLanguage('en');
      dispatch(setLanguage(0));
      config.language = 0;
      language_set(0);
    }

    if (value == 1) {
      SetLanguage(1);
      i18next.changeLanguage('ar');
      dispatch(setLanguage(1));
      config.language = 1;
      language_set(1);
    }

    if (value == 2) {
      SetLanguage(2);
      i18next.changeLanguage('ch');
      dispatch(setLanguage(2));
      config.language = 2;
      language_set(2);
    }
  };

  useEffect(() => {
    const getKeepMeSignedInDetails = async () => {
      const keep_me_signed_in = await localStorage.getItemString(
        'keep_me_signed_in',
      );
      const password = await localStorage.getItemString('keep_password');
      const email = await localStorage.getItemString('email');

      console.log({keep_me_signed_in, email, password}); // Add log here

      if (keep_me_signed_in?.trim() == 'true') {
        setEmail(email);
        setPassword(password);
        setIsChecked(true);
      }
    };

    getKeepMeSignedInDetails();
  }, []);

  // Login ===============

  const handleLogin = async () => {
    Keyboard.dismiss();
    try {
      if (!email) {
        msgProvider.toast(t('emptyEmail'), 'bottom');
        return false;
      }

      if (email && email.trim().length <= 0) {
        msgProvider.toast(t('emptyEmail'), 'bottom');
        return false;
      }

      if (email) {
        const trimmedEmail = email.trim();
        const isValidEmail = config.emailvalidation;
        if (isValidEmail.test(trimmedEmail) !== true) {
          msgProvider.toast(t('validEmail'), 'bottom');
          return false;
        }
      }

      if (!password) {
        msgProvider.toast(t('emptyPassword'), 'bottom');
        return false;
      }

      if (password && password.trim().length < 6) {
        msgProvider.toast(t('lengthPassword'), 'bottom');
        return false;
      }

      const data = new FormData();

      data.append('email', email);
      data.append('password', password);
      data.append('device_type', config.device_type);
      data.append('player_id', config.player_id_me);
      data.append('login_type', config.login_type);

      consolepro.consolelog(data, '<<Data');

      const API_URL = config.baseURL + 'login_by_email';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            localStorage.setItemObject('user_array', res?.userDataArray);
            localStorage.setItemString('password', password);
            localStorage.setItemString(
              'bring_type',
              String(res?.userDataArray?.bring_type),
            );
            localStorage.setItemString('token', res?.token);
            if (isChecked) {
              localStorage.setItemString('keep_me_signed_in', 'true');
              localStorage.setItemString('email', email);
              localStorage.setItemString('keep_password', password);
            }
            consolepro.consolelog(res, '<<<REs');
            if (res?.userDataArray?.profile_completed == 1) {
              setTimeout(() => {
                navigation.replace('FriendshipHome');
                setEmail(null);
                setPassword(null);
              }, 500);
            } else {
              setTimeout(() => {
                navigation.replace('HomeScreen');
                setEmail(null);
                setPassword(null);
              }, 500);
            }
          } else {
            msgProvider.alert(
              t('information_txt'),
              res?.msg[config.language],
              false,
            );
            return false;
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Erro');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Line 38');
    }
  };

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
        <KeyboardAwareScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={Platform.OS === 'android' ? 80 : 0} // Important for Android
          enableOnAndroid={true}
          contentContainerStyle={{
            paddingBottom: (mobileW * 5) / 100,
            flexGrow: 1, // This allows the scroll view to grow and become scrollable
          }}>
          <View
            style={{
              height: (mobileH * 75) / 100,
              width: mobileW,
              // backgroundColor: 'blue',
              borderBottomEndRadius: (mobileW * 10) / 100,
              borderBottomLeftRadius: (mobileW * 10) / 100,
              overflow: 'hidden',
            }}>
            <ImageBackground
              source={localimag.icon_email_login_back}
              style={{
                height: (mobileH * 75) / 100,
                width: mobileW,
              }}>
              {/* --------- back -------- */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: (mobileW * 5) / 100,
                  marginTop: (mobileW * 5) / 100,
                  zIndex: 1000, // Needed for proper dropdown rendering
                }}>
                {/* Back Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={{
                    width: (mobileW * 10) / 100,
                    height: (mobileW * 10) / 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={localimag.icon_back_arrow}
                    style={{
                      width: (mobileW * 5.5) / 100,
                      height: (mobileW * 5.5) / 100,
                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      ],
                    }}
                  />
                </TouchableOpacity>

                <View style={{width: (mobileW * 35) / 100}}>
                  <DropDownPicker
                    open={isLanguageModal}
                    value={isChangeLanguage}
                    items={languages}
                    setOpen={setIsLanguageModal}
                    setValue={val => {
                      setIsChangeLanguage(val);
                    }}
                    onChangeValue={val => {
                      if (val !== language) {
                        updateLanguage(val);
                      }
                    }}
                    setItems={setLanguages}
                    style={{
                      backgroundColor: 'transparent',
                      height: (mobileW * 10) / 100,
                      paddingHorizontal: (mobileW * 6) / 100,
                      // marginTop: (mobileW * 2) / 100,
                      borderWidth: 0,
                    }}
                    dropDownDirection="AUTO"
                    placeholder="Language"
                    placeholderStyle={{
                      color: Colors.whiteColor,
                      fontSize: (mobileW * 3) / 100,
                      fontFamily: Font.FontMedium,
                    }}
                    textStyle={{
                      color: Colors.themeColor2,
                      fontSize: (mobileW * 3) / 100,
                      fontFamily: Font.FontMedium,
                    }}
                    labelStyle={{
                      color: Colors.whiteColor,
                      fontSize: (mobileW * 3) / 100,
                      fontFamily: Font.FontMedium,
                    }}
                    dropDownContainerStyle={{
                      backgroundColor: '#fff',
                      paddingVertical: (mobileW * 2) / 100,
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                    ArrowDownIconComponent={() => (
                      <Image
                        source={localimag.icon_dropDown}
                        style={{
                          width: (mobileW * 3) / 100,
                          height: (mobileW * 3) / 100,
                          tintColor: '#fff',
                        }}
                      />
                    )}
                    ArrowUpIconComponent={() => (
                      <Image
                        source={localimag.icon_up_arrow}
                        style={{
                          width: (mobileW * 3) / 100,
                          height: (mobileW * 3) / 100,
                          tintColor: '#fff',
                        }}
                      />
                    )}
                  />
                </View>
              </View>

              {/* ------ login text ----- */}
              <View
                style={{
                  marginLeft: (mobileW * 7) / 100,
                  marginTop: (mobileW * 5) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontBold,
                    fontSize: (mobileW * 6.5) / 100,
                  }}>
                  {/* {Lang_chg.login_with_email[config.language]} */}
                  {t('login_with_email')}
                </Text>

                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontRegular,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {t('welcome_pet_park_txt')}
                </Text>
              </View>

              {/* ----- Input field ----- */}

              <View
                style={{
                  alignSelf: 'center',
                  marginTop:
                    config.language == 1
                      ? (mobileH * 16) / 100
                      : (mobileH * 20) / 100,
                }}>
                {/* --------- Email input -------- */}
                <InputField
                  title={t('email_address_txt')}
                  inputStyle={{width: (mobileW * 85) / 100}}
                  placeholderText={t('enter_your_email_address_txt')}
                  value={email}
                  setValue={setEmail}
                  keyboardType={'email-address'}
                  maxLength={100}
                />

                {/* ------ Password input ----- */}

                <InputWithIcon
                  title={t('password_txt')}
                  iconSource={
                    secureText
                      ? localimag.icon_hide_eye
                      : localimag.icon_eye_open
                  }
                  placeholder={t('enter_your_password')}
                  resizeMode={'contain'}
                  value={password}
                  onIconPress={() => setSecureText(!secureText)}
                  maxLength={16}
                  setValue={setPassword}
                  secureTextEntry={secureText}
                  containerStyle={{width: (mobileW * 85) / 100}}
                />

                {/* -------forgot password ----- */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('ForgotPassword')}
                  style={{alignSelf: 'flex-end'}}>
                  <Text
                    style={{
                      color: Colors.forgotPasswordColor,
                      fontFamily: Font.FontRegular,
                      fontSize: (mobileW * 3) / 100,
                      alignSelf: 'flex-end',
                      marginTop: (mobileW * 1.5) / 100,
                    }}>
                    {t('forgot_password_txt')}
                  </Text>
                </TouchableOpacity>

                {/* --------- Check Box ------- */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsChecked(!isChecked)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'flex-start',
                  }}>
                  <Image
                    source={
                      isChecked
                        ? localimag.icon_filled_checkbox
                        : localimag.icon_empty_checkbox
                    }
                    style={{
                      width: (mobileW * 5) / 100,
                      height: (mobileW * 5) / 100,
                    }}
                  />
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontRegular,
                      fontSize: (mobileW * 4) / 100,
                      marginLeft: (mobileW * 2) / 100,
                    }}>
                    {t('keep_me_signed_in_txt')}
                  </Text>
                </TouchableOpacity>

                {/* ------ Login button ------- */}
                <CommonButton
                  title={t('login_txt')}
                  containerStyle={{marginTop: (mobileW * 4) / 100}}
                  onPress={() => {
                    handleLogin();
                  }}
                />
              </View>
            </ImageBackground>
          </View>

          {/* ------ Bottom container ---- */}
          <View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: (mobileW * 3) / 100,
                }}>
                <View
                  style={{
                    width: (mobileW * 25) / 100,
                    height: (mobileW * 0.5) / 100,
                    backgroundColor: Colors.themeColor2,
                  }}></View>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3.5) / 100,
                    marginHorizontal: (mobileW * 1) / 100,
                  }}>
                  {t('orSigned_in_using')}
                </Text>
                <View
                  style={{
                    width: (mobileW * 25) / 100,
                    height: (mobileW * 0.5) / 100,
                    backgroundColor: Colors.themeColor2,
                  }}></View>
              </View>
            </View>

            {/*  ------ apple google button ------ */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: (mobileW * 5) / 100,
              }}>
              {Platform.OS === 'ios' && (
                <CommonBlackButton
                  title={t('apple_txt')}
                  leftIcon={localimag.icon_apple}
                  containerStyle={{
                    width: (mobileW * 38) / 100,
                    height: (mobileW * 9) / 100,
                  }}
                  onPress={() => Applelogin()}
                />
              )}

              <CommonBlackButton
                title={t('google_txt')}
                leftIcon={localimag.icon_google}
                containerStyle={{
                  width: (mobileW * 38) / 100,
                  height: (mobileW * 9) / 100,
                  marginLeft: (mobileW * 3) / 100,
                }}
                onPress={() => GoogleLogin()}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CreateAccount')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: (mobileW * 4) / 100,
                alignSelf: 'center',

                paddingBottom: (mobileW * 5) / 100,
              }}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 4) / 100,
                }}>
                {t('new_user_txt')}
              </Text>

              <Text
                style={{
                  color: Colors.forgotPasswordColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3.5) / 100,
                  marginLeft: (mobileW * 1) / 100,
                }}>
                {t('register_here_txt')}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EmailLogin;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
});
