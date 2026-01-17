import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {
  apifuntion,
  config,
  consolepro,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  msgProvider,
  localStorage,
} from '../Provider/utilslib/Utils';
import OTPTextView from 'react-native-otp-textinput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonButton from '../Components/CommonButton';
import CommonBlackButton from '../Components/CommonBlackButton';
import {validation} from '../Provider/Messageconsolevalidationprovider/Validation_provider';
import CountDown from 'react-native-countdown-component';
import {useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {dir} from 'i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const OtpVerication = ({navigation}) => {
  const [otp, setOtp] = useState(null);
  const {t} = useTranslation();

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [key, setKey] = useState(0);

  const {params} = useRoute();
  const mobile = params?.mobile;

  // OTP Verify =============

  const handleVerifyAndContinue = async () => {
    try {
      if (!otp) {
        msgProvider.toast(t('emptyOTP'), 'bottom');
        return false;
      }

      if (otp && otp.length < 6) {
        msgProvider.toast(t('lengthOTP'), 'bottom');
        return false;
      }

      const data = new FormData();
      data.append('mobile', mobile);
      data.append('otp', otp);
      data.append('device_type', config.device_type);
      data.append('player_id', config.player_id);
      data.append('login_type', config.login_type);

      consolepro.consolelog(data, '<<DAta');
      const API_URL = config.baseURL + 'login_by_mobile';

      consolepro.consolelog('API url ===> ', API_URL);

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          consolepro.consolelog('<<RES ', res);
          if (res?.success == true) {
            localStorage.setItemObject('user_array', res?.userDataArray);
            localStorage.setItemString('otp', otp);
            localStorage.setItemString(
              'bring_type',
              String(res?.userDataArray?.bring_type),
            );
            localStorage.setItemString('token', res?.token);
            if (res?.userDataArray?.profile_completed == 1) {
              setTimeout(() => {
                navigation.replace('FriendshipHome');
              }, 500);
            } else {
              setTimeout(() => {
                navigation.replace('HomeScreen');
              }, 500);
            }
            setOtp(null);
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
          consolepro.consolelog(error, '<<Line 72');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Error');
    }
  };

  // Resend OTP =================

  const handleResendOTP = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();
      data.append('mobile', mobile);

      const API_URL = config.baseURL + 'resend_otp_mobile';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            localStorage.setItemObject('user_array', res?.userDataArray);
            setOtp(null);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              msgProvider.alert(
                t('information_txt'),
                res?.msg[config.language],
                false,
              );
              return false;
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Line 72');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Line 89');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <KeyboardAwareScrollView
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View>
            <View
              style={{
                backgroundColor: Colors.themeColor2,
                height: (mobileH * 76) / 100,
                borderBottomLeftRadius: (mobileW * 10) / 100,
                borderBottomRightRadius: (mobileW * 10) / 100,
                elevation: (mobileW * 1) / 100,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.5,
                shadowRadius: (mobileW * 3) / 100,
                paddingBottom: (mobileW * 6) / 100,
              }}>
              {/* ------back------ */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.goBack(), setOtp(null);
                }}
                style={{
                  // backgroundColor: 'red',
                  alignSelf: 'flex-start',
                  marginLeft: (mobileW * 4) / 100,
                  marginTop: (mobileW * 5) / 100,
                }}>
                <Image
                  source={localimag.icon_back_arrow}
                  style={{
                    width: (mobileW * 6) / 100,
                    height: (mobileW * 6) / 100,
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                />
              </TouchableOpacity>

              {/*  --------hand lock image -------- */}
              <View>
                <Image
                  source={localimag.icon_hand_lock}
                  style={{width: mobileW, height: (mobileW * 60) / 100}}
                />
              </View>

              {/* -------- otp verification ----- */}

              <View
                style={{alignSelf: 'center', marginTop: (mobileW * 7) / 100}}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontBold,
                    fontSize: (mobileW * 7) / 100,
                  }}>
                  {t('otp_verification_Headding_txt')}
                </Text>

                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontRegular,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {' '}
                  {t('enter_the_otp_sent_to')} {mobile}
                </Text>

                {/* ------- OTP input ------ */}
                <OTPTextView
                  handleTextChange={text => {
                    setOtp(text);
                  }}
                  containerStyle={{
                    width: (mobileW * 90) / 100,
                    marginTop: (mobileH * 3) / 100,
                    flexDirection: config.language == 1 ? 'row-reverse' : 'row',
                  }}
                  textInputStyle={{
                    borderRadius: (mobileW * 1.5) / 100,
                    borderWidth: (mobileW * 0.3) / 100,
                    width: (mobileW * 12) / 100,
                    color: Colors.ColorBlack,
                    alignSelf: 'center',
                    height: (mobileW * 12) / 100,
                    backgroundColor: Colors.whiteColor,
                    textAlign: 'center',
                    writingDirection: 'rtl',
                  }}
                  inputCount={6}
                  inputCellLength={1}
                  tintColor={Colors.whiteColor}
                  offTintColor={Colors.whiteColor}
                />

                {/* ------ resend text ----- */}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: (mobileW * 5) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontRegular,
                      fontSize: (mobileW * 3.5) / 100,
                    }}>
                    {t('didnt_receive_otp')}
                  </Text>
                  {isButtonDisabled ? (
                    <CountDown
                      until={60 * 2}
                      size={(mobileW * 3.3) / 100}
                      onFinish={() => {
                        setIsButtonDisabled(false);
                      }}
                      digitStyle={{
                        backgroundColor: 'transparent',
                        padding: 0,
                        margin: 0,
                      }}
                      digitTxtStyle={{
                        color: Colors.forgotPasswordColor,
                        fontFamily: Font.FontMedium, // Place fontFamily here
                      }}
                      timeLabelStyle={{
                        color: Colors.forgotPasswordColor,
                        fontSize: 1,
                        fontFamily: Font.FontMedium,
                      }}
                      timeToShow={['M', 'S']}
                      timeLabels={
                        config?.language == 1
                          ? {m: 'دقائق', s: 'ثواني'}
                          : config?.language == 2
                          ? {m: '分钟', s: '秒'}
                          : {m: '', s: ''}
                      }
                      showSeparator={true}
                      separatorStyle={{color: Colors.forgotPasswordColor}}
                    />
                  ) : (
                    <TouchableOpacity
                      disabled={isButtonDisabled}
                      activeOpacity={0.8}
                      style={{alignSelf: 'center'}}
                      onPress={() => {
                        setKey(prevKey => prevKey + 1);
                        setIsButtonDisabled(true);
                        handleResendOTP();
                      }}>
                      <Text
                        style={{
                          color: Colors.forgotPasswordColor,
                          fontFamily: Font.FontRegular,
                          fontSize: (mobileW * 3.5) / 100,
                          marginLeft: (mobileW * 1) / 100,
                        }}>
                        {t('resend_txt')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <CommonButton
                  title={t('verify_and_continue')}
                  containerStyle={{marginTop: (mobileW * 3) / 100}}
                  onPress={() => {
                    handleVerifyAndContinue();
                  }}
                />
              </View>
            </View>

            {/* ----- bottom container ------- */}
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
                      backgroundColor: Colors.ColorBlack,
                    }}></View>
                  <Text
                    style={{
                      color: Colors.ColorBlack,
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
                      backgroundColor: Colors.ColorBlack,
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
                  paddingBottom: (mobileW * 5) / 100,
                }}>
                {Platform.OS === 'ios' && (
                  <CommonBlackButton
                    title={t('apple_txt')}
                    leftIcon={localimag.icon_apple}
                    containerStyle={{
                      width: (mobileW * 38) / 100,
                      height: (mobileW * 9) / 100,
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
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default OtpVerication;

const styles = StyleSheet.create({});
