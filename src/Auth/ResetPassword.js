import {
  BackHandler,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
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
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputField from '../Components/InputField';
import CommonButton from '../Components/CommonButton';
import CommonModal from '../Components/CommonModal';
import {InputWithIcon} from '../Components/InputWithIcon';
import {validation} from '../Provider/Messageconsolevalidationprovider/Validation_provider';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const Resetpassword = ({navigation}) => {
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [secureText, setSecureText] = useState(true);
  const [secureText_1, setSecureText_1] = useState(true);

  const [successModal, setSuccessModal] = useState(false);

  const {params} = useRoute();
  const userId = params?.userId;

  const {t} = useTranslation();

  const handleBackPress = useCallback(() => {
    navigation.navigate('Login');
    return true;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => {
        backHandler.remove();
      };
    }, [handleBackPress]),
  );

  const handleResetPassword = async () => {
    try {
      if (!password) {
        msgProvider.toast(t('emptyPassword'), 'bottom');
        return false;
      }

      if (password && password.trim().length <= 0) {
        msgProvider.toast(t('emptyPassword'), 'bottom');
        return false;
      }

      if (password && password.trim().length < 6) {
        msgProvider.toast(t('lengthPassword'), 'bottom');
        return false;
      }

      if (!confirmPassword) {
        msgProvider.toast(t('emptyConfirmPassword'), 'bottom');
        return false;
      }

      if (confirmPassword && confirmPassword.trim().length <= 0) {
        msgProvider.toast(t('emptyConfirmPassword'), 'bottom');
        return false;
      }

      if (confirmPassword && confirmPassword.trim().length < 6) {
        msgProvider.toast(t('lengthOTP'), 'bottom');
        return false;
      }

      if (password !== confirmPassword) {
        msgProvider.toast(t('passwordAndConfrimPasswordEqual'), 'bottom');
        return false;
      }

      const API_URL = config.baseURL + 'reset_password';
      const data = new FormData();

      data.append('user_id', userId);
      data.append('new_password', password);

      consolepro.consolelog(data, '<<DAta');

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<<RES');
            setTimeout(() => {
              setSuccessModal(true);
            }, 700);
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
          consolepro.consolelog(error, '<<ER');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<<ERror');
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
              {t('resetPassword_txt')}
            </Text>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 4) / 100,
                fontFamily: Font.FontRegular,
                marginTop: (mobileH * 0.3) / 100,
              }}>
              {t('toResetYourPassword_txt')}
            </Text>

            {/* input filed view */}

            <View
              style={{
                marginTop: (mobileH * 2) / 100,
              }}>
              {/* new password */}
              {/* <InputField
              keyboardType="default"
              value={password}
              setValue={setPassword}
              maxLength={16}
              placeholderText={Lang_chg.enterANewPassword_txt[config.language]}
              title={Lang_chg.enterANewPassword_txt[config.language]}
              containerStyle={{
                marginTop: (mobileH * 2) / 100,
              }}
              secureText={secureText}
              setSecureText={setSecureText}
            /> */}

              <InputWithIcon
                keyboardType="default"
                value={password}
                setValue={setPassword}
                maxLength={16}
                placeholder={t('enterANewPassword_txt')}
                title={t('enterANewPassword_txt')}
                containerStyle={{
                  marginTop: (mobileH * 2) / 100,
                }}
                secureTextEntry={secureText}
                iconSource={
                  secureText ? localimag.icon_hide_eye : localimag.icon_eye_open
                }
                onIconPress={() => setSecureText(!secureText)}
                iconStyle={{
                  width: (mobileW * 5) / 100,
                  height: (mobileW * 5) / 100,
                }}
              />

              {/* confirm password */}

              <InputWithIcon
                keyboardType="default"
                value={confirmPassword}
                setValue={setConfirmPassword}
                maxLength={16}
                placeholder={t('enter_confirm_password_txt')}
                title={t('confirm_password_txt')}
                containerStyle={{
                  marginTop: (mobileH * 2) / 100,
                }}
                secureTextEntry={secureText_1}
                iconSource={
                  secureText_1
                    ? localimag.icon_hide_eye
                    : localimag.icon_eye_open
                }
                onIconPress={() => setSecureText_1(!secureText_1)}
                iconStyle={{
                  width: (mobileW * 5) / 100,
                  height: (mobileW * 5) / 100,
                }}
              />
            </View>

            {/* ---------- */}

            <CommonButton
              containerStyle={{
                marginTop: (mobileH * 4) / 100,
                width: (mobileW * 30) / 100,
                height: (mobileH * 4) / 100,
                alignSelf: 'flex-end',
              }}
              btnTextStyle={{
                fontSize: (mobileW * 3.5) / 100,
              }}
              title={t('done_txt')}
              onPress={() => {
                handleResetPassword();
              }}
            />
          </View>
        </KeyboardAwareScrollView>

        {/* success modal */}

        <CommonModal
          visible={successModal}
          requestClose={() => setSuccessModal(false)}
          setModalStatus={setSuccessModal}
          message={t('password_saved_successfully')}
          onCrosspress={() => {
            setSuccessModal(false);
            navigation.navigate('EmailLogin');
          }}
          isIconTick={true}
          isIcon={localimag.icon_green_tick}
        />
      </View>
    </SafeAreaView>
  );
};

export default Resetpassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.themeColor2,
  },
});
