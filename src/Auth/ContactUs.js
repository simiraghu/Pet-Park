import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputField from '../Components/InputField';
import CommonButton from '../Components/CommonButton';
import {
  Colors,
  config,
  consolepro,
  Font,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  msgProvider,
  localStorage,
  apifuntion,
} from '../Provider/utilslib/Utils';
import CommonModal from '../Components/CommonModal';
import {validation} from '../Provider/Messageconsolevalidationprovider/Validation_provider';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const ContactUs = ({navigation}) => {
  const {goBack, navigate} = useNavigation();
  const [name, setName] = useState(null);
  const [mobile, setMobile] = useState(null);
  const [email, setEmail] = useState(null);
  const [description, setDescription] = useState(null);
  const [successModal, setSuccessModal] = useState(false);

  const {t} = useTranslation();

  const handleSubmitBtn = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_array');
      const userId = user_arr?.user_id;

      if (!name) {
        msgProvider.toast(t('emptyName'), 'bottom');
        return false;
      }

      if (name && name.trim().length <= 0) {
        msgProvider.toast(t('emptyName'), 'bottom');
        return false;
      }

      const trimmedName = name.trim();
      if (name && config.Namevalidation.test(trimmedName) !== true) {
        msgProvider.toast(t('validUserName'), 'bottom');
        return false;
      }

      if (!mobile) {
        msgProvider.toast(t('emptyMobileNumber'), 'bottom');
        return false;
      }

      if (mobile) {
        const trimmedMobile = mobile.trim();
        if (config.mobilevalidation.test(trimmedMobile) !== true) {
          msgProvider.toast(t('validMobileNumber'), 'bottom');
          return false;
        }
      }

      if ((mobile && mobile.trim().length < 7) || mobile.trim().length > 15) {
        msgProvider.toast(t('validMobileNumber'), 'bottom');
        return false;
      }

      if (email) {
        const trimmedEmail = email.trim();
        if (email && config.emailvalidation.test(trimmedEmail) !== true) {
          msgProvider.toast(t('validEmail'), 'bottom');
          return false;
        }
      }

      if (!description) {
        msgProvider.toast(t('emptyContactMessage'), 'bottom');
        return false;
      }

      if (description && description.trim().length <= 0) {
        msgProvider.toast(t('emptyContactMessage'), 'bottom');
        return false;
      }

      const API_URL = config.baseURL + 'contact_us';

      const data = new FormData();
      data.append('user_id', userId);
      data.append('name', name);
      data.append('email', email);
      data.append('message', description);

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              setSuccessModal(true);
            }, 700);

            setName(null);
            setEmail(null);
            setMobile(null);
            setDescription(null);
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
          consolepro.consolelog(error, '<<ERr');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Line 118');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View
          style={{
            width: (mobileW * 90) / 100,
            alignSelf: 'center',
            marginTop: (mobileH * 2) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={{
              alignSelf: 'flex-start',
            }}>
            <Image
              source={localimag.icon_back_arrow}
              style={[
                {width: (mobileW * 6) / 100, height: (mobileW * 6) / 100},
                {
                  tintColor: Colors.ColorBlack,
                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                },
              ]}
            />
          </TouchableOpacity>
        </View>
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
              marginTop: (mobileH * 1) / 100,
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: Colors.themeColor2,
                fontSize: (mobileW * 6.5) / 100,
                fontFamily: Font.FontBold,
              }}>
              {t('Contactus')}
            </Text>
          </View>

          <Image
            style={{
              marginTop: (mobileH * 0.5) / 100,
              alignSelf: 'center',
              height: (mobileW * 25) / 100,
              width: (mobileW * 25) / 100,
            }}
            source={localimag.icon_contact_us}></Image>

          <View
            style={{
              marginTop: (mobileH * 1) / 100,
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
            }}>
            {/* Name */}
            <InputField
              keyboardType="default"
              value={name}
              setValue={setName}
              maxLength={50}
              placeholderText={t('enter_your_name_txt')}
              title={t('name_txt')}
              containerStyle={{
                marginTop: (mobileH * 2) / 100,
              }}
              titleStyles={{color: Colors.themeColor2}}
              inputStyle={{
                borderColor: Colors.themeColor2,
                borderWidth: (mobileW * 0.3) / 100,
              }}
            />

            {/* Mobile */}

            <View
              style={{
                marginTop: (mobileH * 2) / 100,
              }}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontSize: (mobileW * 3.5) / 100,
                  fontFamily: Font.FontMedium,
                }}>
                {t('mobile_number_txt')}
              </Text>

              <View
                style={{
                  width: (mobileW * 90) / 100,
                  backgroundColor: Colors.whiteColor,
                  height: (mobileH * 6) / 100,
                  borderRadius: (mobileW * 2) / 100,
                  marginTop: (mobileH * 1) / 100,
                  borderRadius: (mobileW * 2) / 100,
                  paddingHorizontal: (mobileW * 4) / 100,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor: Colors.themeColor2,
                  borderWidth: (mobileW * 0.3) / 100,
                }}>
                {/* <Text
                    style={{
                      color: Colors.placeholderTextColor,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3.5) / 100,
                    }}>
                    +91
                  </Text> */}
                <TextInput
                  placeholderTextColor={Colors.placeholderTextColor}
                  returnKeyLabel="done"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  value={mobile}
                  keyboardType="numeric"
                  style={{
                    width: (mobileW * 79) / 100,
                    height: (mobileH * 6) / 100,
                    color: Colors.placeholderTextColor,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3.5) / 100,
                    // marginLeft: (mobileW * 1) / 100,
                  }}
                  placeholder={t('enter_your_mobile_num_txt')}
                  onChangeText={val => setMobile(val)}
                  maxLength={16}
                  titleStyles={{color: Colors.themeColor2}}
                />
              </View>
            </View>

            {/* Email */}
            <InputField
              keyboardType="email-address"
              value={email}
              setValue={setEmail}
              maxLength={100}
              placeholderText={t('enter_your_email_address_txt')}
              title={`${t('email_txt')} ${t('optional_txt')}`}
              containerStyle={{
                marginTop: (mobileH * 2) / 100,
              }}
              titleStyles={{color: Colors.themeColor2}}
              inputStyle={{
                borderColor: Colors.themeColor2,
                borderWidth: (mobileW * 0.3) / 100,
              }}
            />

            <InputField
              multiline={true}
              keyboardType="default"
              value={description}
              setValue={setDescription}
              maxLength={250}
              title={t('description_txt')}
              containerStyle={{
                marginTop: (mobileH * 2) / 100,
              }}
              inputStyle={{
                height: 110,
                textAlignVertical: 'top',
                borderColor: Colors.themeColor2,
                borderWidth: (mobileW * 0.3) / 100,
              }}
              titleStyles={{color: Colors.themeColor2}}
              placeholderText={t('enteradescriptionhere_txt')}
            />
          </View>
          <View
            style={{
              width: (mobileW * 90) / 100,

              alignSelf: 'center',
            }}>
            <CommonButton
              containerStyle={{
                marginTop: (mobileH * 5) / 100,
                backgroundColor: Colors.themeColor2,
              }}
              btnTextStyle={{
                fontSize: (mobileW * 3.5) / 100,
              }}
              title={t('submit_txt')}
              onPress={() => {
                handleSubmitBtn();
              }}
            />
          </View>
        </KeyboardAwareScrollView>

        <CommonModal
          visible={successModal}
          isIconTick={true}
          isIcon={localimag.icon_green_tick}
          message={t('thankyou_txt')}
          content={t('thank_you_for_submitting_contact_us_txt')}
          button={true}
          btnText={t('profile_txt')}
          onCrosspress={() => setSuccessModal(false)}
          onPress={() => {
            setSuccessModal(false);
            navigate('Account');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
});
