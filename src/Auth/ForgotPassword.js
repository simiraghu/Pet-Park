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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputField from '../Components/InputField';
import CommonButton from '../Components/CommonButton';
import {validation} from '../Provider/Messageconsolevalidationprovider/Validation_provider';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const Forgotpassword = ({navigation}) => {
  const [email, setEmail] = useState(null);

  const {t} = useTranslation();

  const handleNext = async () => {
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

      const API_URL = config.baseURL + 'forgot_password';

      const data = new FormData();
      data.append('email', email);

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<<RES');
            setTimeout(() => {
              navigation.navigate('ForgotOtpVerification', {
                userId: res?.userDataArray?.user_id,
                email,
              });
            }, 500);
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
          consolepro.consolelog(error, '<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Line');
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
            marginHorizontal: (mobileW * 3) / 100,
          }}>
          {/* --------- back -------- */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.goBack(), setEmail(null);
            }}
            style={{
              marginTop: (mobileW * 5) / 100,
              // backgroundColor: 'blue',
              alignSelf: 'flex-start',
              width: (mobileW * 10) / 100,
              height: (mobileW * 10) / 100,
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
              marginTop: (mobileH * 3) / 100,
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 6) / 100,
                fontFamily: Font.FontBold,
              }}>
              {t('forgotPassword_txt')}
            </Text>

            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 4) / 100,
                fontFamily: Font.FontRegular,
                marginTop: (mobileH * 0.3) / 100,
              }}>
              {t('ifYouHaveForgotten_txt')}
            </Text>

            <View
              style={{
                marginTop: (mobileH * 3) / 100,
              }}>
              {/* Email */}
              <InputField
                keyboardType="email-address"
                value={email}
                setValue={setEmail}
                maxLength={100}
                placeholderText={t('enter_your_email_address_txt')}
                title={t('email_address_txt')}
              />
            </View>

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
              title={t('next_txt')}
              onPress={() => handleNext()}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Forgotpassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.themeColor2,
  },
});
