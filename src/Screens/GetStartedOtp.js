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
  localStorage,
} from '../Provider/utilslib/Utils';
import {useNavigation, useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import OTPTextView from 'react-native-otp-textinput';
import CommonButton from '../Components/CommonButton';
import {validation} from '../Provider/Messageconsolevalidationprovider/Validation_provider';
import CountDown from 'react-native-countdown-component';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const GetStartedOTP = ({navigation}) => {
  const [otp, setOtp] = useState('');
  const {goBack, navigate} = useNavigation();

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [key, setKey] = useState(0);

  const {t} = useTranslation();

  const {params} = useRoute();
  const userId = params?.userId;
  consolepro.consolelog(userId, '<<Userid');

  // OTP Verify ============

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

      data.append('otp', otp);
      data.append('user_id', userId);

      consolepro.consolelog(data, '<<Data');

      const API_URL = config.baseURL + 'otp_verify';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            localStorage.setItemObject('user_array', res?.userDataArray);

            consolepro.consolelog(res, '<<REs');
            setTimeout(() => {
              navigate('HomeScreen', {userId});
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
          consolepro.consolelog(error, '<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Line 26');
    }
  };

  // Resend OTP ========

  const handleResendOTP = async () => {
    try {
      const data = new FormData();

      data.append('user_id', userId);

      consolepro.consolelog(data, '<<Data');

      const API_URL = config.baseURL + 'otp_resend';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            localStorage.setItemObject('user_array', res?.userDataArray);
            consolepro.consolelog(res, '<<REs');
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
      consolepro.consolelog(error, '<<Line 84');
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
          <TouchableOpacity
            onPress={() => goBack()}
            activeOpacity={0.8}
            style={{
              width: (mobileW * 10) / 100,
              height: (mobileW * 10) / 100,
            }}>
            <Image
              source={localimag.icon_back_arrow}
              style={{
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
            />
          </TouchableOpacity>
        </View>

        {/* ----------------------------- */}

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          contentContainerStyle={{
            paddingBottom: (mobileH * 10) / 100,
          }}
          keyboardShouldPersistTaps="handled">
          <View
            style={{
              marginTop: (mobileH * 2) / 100,
            }}>
            <View style={styles.viewStyle}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontSize: (mobileW * 6.5) / 100,
                  fontFamily: Font.FontBold,
                }}>
                {t('otp_verification_Headding_txt')}
              </Text>
            </View>

            <View
              style={{
                marginTop: (mobileH * 1) / 100,
                paddingVertical: (mobileH * 1.5) / 100,
                width: mobileW,
                // backgroundColor: Colors.ColorGrayTransparent,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: Colors.whiteColor,
                  fontSize: (mobileW * 3.5) / 100,
                  fontFamily: Font.FontRegular,
                  lineHeight: (mobileH * 3) / 100,
                }}>
                {t('otphasbeensenttoyouonmobilenumberemailid_txt')}
              </Text>
            </View>

            <View
              style={{
                width: (mobileW * 90) / 100,
                alignSelf: 'center',
                marginTop: (mobileH * 3.5) / 100,
              }}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontSize: (mobileW * 3.5) / 100,
                  fontFamily: Font.FontSemibold,
                  marginLeft: (mobileW * 1) / 100,
                }}>
                {t('enterotp_txt')}
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
                  color: Colors.themeColor2,
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

            <View
              style={{
                width: (mobileW * 90) / 100,

                alignSelf: 'center',
              }}>
              <CommonButton
                containerStyle={{
                  marginTop: (mobileH * 4.5) / 100,
                  width: (mobileW * 28) / 100,
                  height: (mobileH * 5) / 100,
                  alignSelf: 'flex-end',
                }}
                btnTextStyle={{
                  fontSize: (mobileW * 3.5) / 100,
                }}
                title={t('verify_txt')}
                onPress={() => handleVerify()}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default GetStartedOTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.themeColor2,
  },
  viewStyle: {
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
  },
});
