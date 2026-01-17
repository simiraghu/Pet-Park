import {
  BackHandler,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
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
  localStorage,
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

const ChangePassword = ({navigation}) => {
  const {goBack, navigate} = useNavigation();
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [secureText, setSecureText] = useState(true);
  const [secureText_1, setSecureText_1] = useState(true);
  const [secureText_2, setSecureText_2] = useState(true);

  const [successModal, setSuccessModal] = useState(false);
  const {params} = useRoute();
  const pageType = params?.type;

  const {t} = useTranslation();

  const handleChangePassword = async () => {
    try {
      if (
        !currentPassword ||
        currentPassword === null ||
        currentPassword === ''
      ) {
        msgProvider.toast(t('emptyCurrentPassword'), 'bottom');
        return false;
      }

      if (!password || password === null || password === '') {
        msgProvider.toast(t('emptynewPassword'), 'bottom');
        return false;
      }

      if (password && password.trim().length < 6) {
        msgProvider.toast(t('lengthPassword'), 'bottom');
        return false;
      }

      if (
        !confirmPassword ||
        confirmPassword === null ||
        confirmPassword === ''
      ) {
        msgProvider.toast(t('emptyConfirmPasswordChange'), 'bottom');
        return false;
      }

      if (confirmPassword && confirmPassword.trim().length < 6) {
        console.log(confirmPassword, 'Confirm password');
        msgProvider.toast(t('lengthPassword'), 'bottom');
        return false;
      }

      if (confirmPassword !== password) {
        msgProvider.toast(t('newAndConfirmPasswordMustEqual'), 'bottom');
        return false;
      }

      if (currentPassword === password && currentPassword === confirmPassword) {
        console.log(
          currentPassword,
          password,
          confirmPassword,
          '<<three of password',
        );
        msgProvider.toast(t('sameAllPassword'), 'bottom');
        return false;
      }

      const API_URL = config.baseURL + 'change_password';

      const data = new FormData();

      const user_arr = await localStorage.getItemObject('user_array');
      const userId = user_arr?.user_id;
      consolepro.consolelog(userId, '<<Userid');

      data.append('user_id', userId);
      data.append('current_password', currentPassword);
      data.append('new_password', password);

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              setSuccessModal(true);
              localStorage.setItemString('password', password);
            }, 700);
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
          consolepro.consolelog(error, '<<<ER');
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
            marginTop: (mobileH * 4) / 100,
          }}>
          <TouchableOpacity
            onPress={() => goBack()}
            activeOpacity={0.8}
            style={{
              width: (mobileW * 5) / 100,
              height: (mobileW * 5) / 100,
            }}>
            <Image
              source={localimag.icon_back_arrow}
              style={{
                width: (mobileW * 5) / 100,
                height: (mobileW * 5) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
            />
          </TouchableOpacity>
        </View>

        {/* ----------------------------- */}

        <KeyboardAwareScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={Platform.OS === 'android' ? 80 : 0} // Important for Android
          enableOnAndroid={true}
          contentContainerStyle={{
            paddingBottom: (mobileW * 15) / 100,
            flexGrow: 1, // This allows the scroll view to grow and become scrollable
          }}>
          <View
            style={{
              marginTop: (mobileH * 2) / 100,
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 5.5) / 100,
                fontFamily: Font.FontBold,
              }}>
              {t('change_password_txt')}
            </Text>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 4) / 100,
                fontFamily: Font.FontRegular,
                marginTop: (mobileH * 0.3) / 100,
              }}>
              {t('toChange_password_txt')}
            </Text>

            {/* input filed view */}

            <View
              style={{
                marginTop: (mobileH * 2) / 100,
              }}>
              {/* ------- current password ----- */}
              <InputWithIcon
                keyboardType="default"
                value={currentPassword}
                setValue={setCurrentPassword}
                maxLength={16}
                placeholder={t('enter_current_password_txt')}
                title={t('current_password_txt')}
                containerStyle={{
                  marginTop: (mobileH * 2) / 100,
                }}
                secureTextEntry={secureText_2}
                setSecureText={secureText_2}
                iconSource={
                  secureText_2
                    ? localimag.icon_hide_eye
                    : localimag.icon_eye_open
                }
                onIconPress={() => setSecureText_2(!secureText_2)}
                iconStyle={{
                  width: (mobileW * 5) / 100,
                  height: (mobileW * 5) / 100,
                }}
              />

              {/* new password */}
              <InputWithIcon
                keyboardType="default"
                value={password}
                setValue={setPassword}
                maxLength={16}
                placeholder={t('enterNewPassword_txt')}
                title={t('new_password_txt')}
                containerStyle={{
                  marginTop: (mobileH * 2) / 100,
                }}
                secureTextEntry={secureText}
                setSecureText={setSecureText}
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
                placeholder={t('enterConfirmNewPassword_txt')}
                title={t('confirmPassword_txt')}
                containerStyle={{
                  marginTop: (mobileH * 2) / 100,
                }}
                secureTextEntry={secureText_1}
                setSecureText={setSecureText_1}
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
                width: (mobileW * 24) / 100,
                height: (mobileH * 4) / 100,
                alignSelf: 'flex-end',
                marginBottom: (mobileW * 2) / 100,
              }}
              btnTextStyle={{
                fontSize: (mobileW * 3.5) / 100,
              }}
              title={t('done_txt')}
              //onPress={() => navigate('Login')}
              onPress={() => handleChangePassword()}
            />
          </View>
        </KeyboardAwareScrollView>

        {/* success modal */}

        <CommonModal
          visible={successModal}
          requestClose={() => setSuccessModal(false)}
          setModalStatus={setSuccessModal}
          onPress={() => {
            setSuccessModal(false);
            navigation.navigate('Account');
          }}
          message={t('password_changed_successfully')}
          onCrosspress={() => {
            setSuccessModal(false);
            navigation.navigate('Account');
          }}
          button={true}
          btnText={t('profile_txt')}
          isIcon={localimag.icon_green_tick}
          isIconTick={true}
        />

        {/* <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          //setSuccessModal(false);
        }}>
        <TouchableOpacity
          //onPress={() => setSuccessModal(false)}
          activeOpacity={1}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000090',
          }}>
          <View
            style={{
              width: (mobileW * 70) / 100,
              paddingVertical: (mobileH * 2) / 100,
              borderRadius: (mobileW * 3) / 100,
              backgroundColor: Colors.whiteColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                alignSelf: 'flex-end',
              }}>
              <Image
                source={localimag.icon_cross}
                style={{
                  width: (mobileW * 5) / 100,
                  height: (mobileW * 5) / 100,
                }}
              />
            </TouchableOpacity>

            <Image
              source={localimag.icon_tick}
              style={{
                width: (mobileW * 15) / 100,
                height: (mobileW * 15) / 100,
                resizeMode: 'contain',
                marginTop: (-mobileH * 1) / 100,
              }}
            />
            <Text
              style={{
                color: Colors.themeColor,
                fontSize: (mobileW * 5) / 100,
                fontFamily: Font.FontSemibold,
                textAlign: 'center',
                marginTop: (mobileH * 1) / 100,
              }}>
              {Lang_chg.passwordSavedSuccesfully_txt[config.language]}
            </Text>

            <CommonButton
              containerStyle={{
                marginTop: (mobileH * 1) / 100,
                width: (mobileW * 30) / 100,
                height: (mobileH * 5) / 100,
              }}
              btnTextStyle={{
                fontSize: (mobileW * 4) / 100,
              }}
              title={Lang_chg.Login_txt[config.language]}
              onPress={() => navigate('Login')}
            />
          </View>
        </TouchableOpacity>
      </Modal> */}
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.themeColor2,
  },
});
