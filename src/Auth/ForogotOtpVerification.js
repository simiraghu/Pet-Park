import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {
  config,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  Colors,
  Font,
  consolepro,
  msgProvider,
  apifuntion,
} from '../Provider/utilslib/Utils';
import {useNavigation, useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import OTPTextView from 'react-native-otp-textinput';
import CommonButton from '../Components/CommonButton';
import {validation} from '../Provider/Messageconsolevalidationprovider/Validation_provider';
import CountDown from 'react-native-countdown-component';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const ForgotOtpVerification = ({navigation}) => {
  const [otp, setOtp] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [key, setKey] = useState(0);

  const {params} = useRoute();
  const userId = params?.userId;
  const email = params?.email;

  const {t} = useTranslation();

  consolepro.consolelog(userId, 'UserID');

  // handle otp verify ==========

  const handleVerify = async () => {
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
      data.append('user_id', userId);
      data.append('otp', otp);

      const API_URL = config.baseURL + 'forgot_password_otp_verify';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              navigation.navigate('ResetPassword', {userId});
            }, 500);
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
          consolepro.consolelog(error, '<<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<Error');
    }
  };

  // resend OTP ==========

  const handleResendOTP = async () => {
    try {
      const API_URL = config.baseURL + 'forgot_password_resend_otp';

      const data = new FormData();
      data.append('email', email);

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
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
          consolepro.consolelog(error, '<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<<Error');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {/*---------  header ---------- */}
        <View
          style={{
            width: (mobileW * 90) / 100,
            alignSelf: 'center',
            marginTop: (mobileH * 2) / 100,
          }}>
          {/* --------- back -------- */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              marginTop: (mobileW * 5) / 100,
              // backgroundColor: 'blue',
              alignSelf: 'flex-start',
            }}>
            <Image
              source={localimag.icon_back_arrow}
              style={{
                width: (mobileW * 5.5) / 100,
                height: (mobileW * 5.5) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
            />
          </TouchableOpacity>
        </View>

        {/* ----------------------------- */}

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled">
          <View
            style={{
              marginTop: (mobileH * 4) / 100,
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 6) / 100,
                fontFamily: Font.FontBold,
              }}>
              {t('otp_verification_txt')}
            </Text>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 4) / 100,
                fontFamily: Font.FontRegular,
                marginTop: (mobileH * 0.3) / 100,
              }}>
              {t('pleaseEneterVerificationCode_txt')}
            </Text>

            <View
              style={{
                marginTop: (mobileH * 3.5) / 100,
              }}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontSize: (mobileW * 3.5) / 100,
                  fontFamily: Font.FontSemibold,
                  marginLeft: (mobileW * 1) / 100,
                }}>
                {t('otp_txt')}
              </Text>

              <OTPTextView
                handleTextChange={text => {
                  setOtp(text);
                }}
                containerStyle={{
                  width: (mobileW * 90) / 100,
                  marginTop: (mobileH * 0.5) / 100,
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
                  writingDirection: 'rtl',
                }}
                inputCount={6}
                inputCellLength={1}
                tintColor={Colors.whiteColor}
                offTintColor={Colors.whiteColor}
              />
            </View>

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
                  color: Colors.cancleColor,
                  fontFamily: Font.FontMedium, // Place fontFamily here
                }}
                timeLabelStyle={{
                  color: Colors.cancleColor,
                  fontSize: 1,
                  fontFamily: Font.FontMedium,
                }}
                timeToShow={['M', 'S']}
                timeLabels={{m: '', s: ''}}
                showSeparator={true}
                separatorStyle={{color: Colors.cancleColor}}
                style={{
                  paddingTop: 5.5,
                  paddingBottom: 5.5,
                }}
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
                    textAlign: 'center',
                    color: Colors.cancleColor,
                    fontSize: (mobileW * 3.2) / 100,
                    fontFamily: Font.FontMedium,
                    marginTop: (mobileH * 2) / 100,
                  }}>
                  {t('resendotp_txt')}
                </Text>
              </TouchableOpacity>
            )}

            <CommonButton
              containerStyle={{
                marginTop: (mobileH * 4.5) / 100,
                width: (mobileW * 30) / 100,
                height: (mobileH * 4) / 100,
                alignSelf: 'flex-end',
              }}
              btnTextStyle={{
                fontSize: (mobileW * 3.5) / 100,
              }}
              title={t('submit_txt')}
              onPress={() => handleVerify()}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ForgotOtpVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.themeColor2,
  },
});
