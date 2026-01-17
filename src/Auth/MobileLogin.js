import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
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
} from '../Provider/utilslib/Utils';
import InputField from '../Components/InputField';
import CommonButton from '../Components/CommonButton';
import CommonBlackButton from '../Components/CommonBlackButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {validation} from '../Provider/Messageconsolevalidationprovider/Validation_provider';
import {useTranslation} from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import i18next from '../Services/i18next';
import {useDispatch, useSelector} from 'react-redux';
import {setLanguage} from '../Redux/Slice/RegisterSlice';
import {language_set} from '../Provider/Language_provider';
import {SocialLogin} from '../Provider/Apicallingprovider/SocialLoginProvider';
import {SafeAreaView} from 'react-native-safe-area-context';

const MobileLogin = ({navigation}) => {
  const [mobileNumber, setMobileNumber] = useState(null);
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

  consolepro.consolelog('player id', config.player_id_me);
  // generate OTP ===================

  const handleGenerateOTP = async () => {
    try {
      if (!mobileNumber) {
        msgProvider.toast(t('emptyMobileNumber'), 'bottom');
        return false;
      }

      if (
        mobileNumber &&
        (mobileNumber.trim().length < 7 || mobileNumber.trim().length > 15)
      ) {
        msgProvider.toast(t('emptyMobileNumber'), 'bottom');
        return false;
      }

      if (mobileNumber) {
        const isValidMobileNumber = config.mobilevalidation;
        if (isValidMobileNumber.test(mobileNumber) !== true) {
          msgProvider.toast(t('emptyMobileNumber'), 'bottom');
          return false;
        }
      }

      const API_URL = config.baseURL + 'check_mobile';

      const data = new FormData();
      data.append('mobile', mobileNumber);
      data.append('device_type', config.device_type);
      data.append('player_id', config.player_id_me);
      data.append('login_type', config.login_type);

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            setTimeout(() => {
              navigation.navigate('OtpVerification', {mobile: mobileNumber});
            }, 500);
          } else {
            if (res?.active_status == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              msgProvider.alert(
                t('information_txt'),
                res?.msg[config.language],
                'bottom',
              );
              return false;
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Line 33');
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
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
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
              width: mobileW,
              height: (mobileH * 75) / 100,
              // backgroundColor: 'blue',
              borderBottomLeftRadius: (mobileW * 10) / 100,
              borderBottomEndRadius: (mobileW * 10) / 100,
              overflow: 'hidden',
            }}>
            {/* ---- background image ------ */}
            <ImageBackground
              source={localimag.icon_email_login_back}
              style={{
                width: mobileW,
                height: (mobileH * 75) / 100,
              }}
              resizeMode="cover">
              <View>
                {/* ------ back ----- */}

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
                      setMobileNumber(null);
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

                {/* ------ login heading -------- */}
                <View
                  style={{
                    marginLeft: (mobileW * 7) / 100,
                    marginTop: (mobileW * 10) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontBold,
                      fontSize: (mobileW * 7) / 100,
                    }}>
                    {t('login_with_mobile_txt')}
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

                {/* ------ generate otp ----- */}
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: (mobileH * 20) / 100,
                    // backgroundColor: 'blue',
                  }}>
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 4.5) / 100,
                    }}>
                    {t('enter_your_mobile_num_txt')}
                  </Text>

                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontRegular,
                      fontSize: (mobileW * 3.8) / 100,
                    }}>
                    {t('we_will_send_verifi_code_txt')}
                  </Text>

                  {/* ------- input field ------ */}
                  <InputField
                    placeholderText={t('enter_your_mobile_num_txt')}
                    inputStyle={{
                      width: (mobileW * 85) / 100,
                      marginTop: (mobileW * 0.5) / 100,
                    }}
                    keyboardType={'numeric'}
                    value={mobileNumber}
                    setValue={setMobileNumber}
                    maxLength={15}
                  />

                  <CommonButton
                    title={t('generate_otp_txt')}
                    containerStyle={{marginTop: (mobileH * 9) / 100}}
                    onPress={() => {
                      handleGenerateOTP();
                    }}
                  />
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* ------- bottom container --- */}
          <View style={{marginTop: (mobileW * 4) / 100}}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                // paddingBottom: (mobileW * 5) / 100,
              }}>
              {Platform.OS === 'ios' && (
                <CommonBlackButton
                  title={t('apple_txt')}
                  leftIcon={localimag.icon_apple}
                  containerStyle={{
                    width: (mobileW * 38) / 100,
                    height: (mobileW * 9) / 100,
                  }}
                  onPress={() => {
                    Applelogin();
                  }}
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
                onPress={() => {
                  GoogleLogin();
                }}
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

export default MobileLogin;

const styles = StyleSheet.create({});
