import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
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
import InputField from '../Components/InputField';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonButton from '../Components/CommonButton';
import {InputWithIcon} from '../Components/InputWithIcon';
import DatePicker from 'react-native-date-picker';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import CommonBlackButton from '../Components/CommonBlackButton';
import {validation} from '../Provider/Messageconsolevalidationprovider/Validation_provider';
import {t} from 'i18next';
import moment from 'moment';
import {SafeAreaView} from 'react-native-safe-area-context';

const CreateAccount = ({navigation}) => {
  const [name, setName] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [email, setEmail] = useState(null);
  const [createPassword, setCreatePassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [secureText, setSecureText] = useState(true);
  const [secureText_1, setsecureText_1] = useState(true);
  const [isDatePicker, setIsDatePicker] = useState(false);
  const [date, setDate] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [mobile_number, setMobile_number] = useState(null);
  const [hidePassword, setHidePassword] = useState(false);
  const [emailEdit, setEmailEdit] = useState(true);
  const [nameEdit, setNameEdit] = useState(true);
  const [socaildata, setSocaildata] = useState('');

  const [terms_and_condition_content, setTerms_and_condition_content] =
    useState('');
  const [privacy_policy, setPrivacy_policy] = useState('');

  const {navigate} = useNavigation();

  // handle Create ============>>>

  const setProfileData = async () => {
    const result = await localStorage.getItemObject('socialdata');
    console.log({result});

    if (result != null) {
      const {social_email, social_name} = result;

      if (social_email != null) {
        setEmail(social_email);
        setEmailEdit(false);
        setHidePassword(true);
      }

      if (social_name != null) {
        setName(social_name);
        setNameEdit(false);
        setHidePassword(true);
      }

      setSocaildata(result);
    }
  };

  useEffect(() => {
    setProfileData();
  }, []);

  consolepro.consolelog(nameEdit);

  const handleCreateAccount = async () => {
    try {
      if (!name) {
        msgProvider.toast(t('emptyName'), 'bottom');
        return false;
      }

      if (name && name.trim().length <= 0) {
        msgProvider.toast(t('emptyName'), 'bottom');
        return false;
      }

      if (!date) {
        msgProvider.toast(t('emptyDateOfBirth_txt'), 'bottom');
        return false;
      }

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

      if (!mobile_number || mobile_number === null || mobile_number === '') {
        msgProvider.toast(t('emptyMobileNumber'), 'bottom');
        return false;
      }

      if (
        mobile_number &&
        (mobile_number.trim().length < 7 || mobile_number.trim().length > 15)
      ) {
        msgProvider.toast(t('validMobileNumber'), 'bottom');
        return false;
      }

      if (mobile_number) {
        const isValidMobileNumber = config.mobilevalidation;
        if (isValidMobileNumber.test(mobile_number) !== true) {
          msgProvider.toast(t('validMobileNumber'), 'bottom');
          return false;
        }
      }

      if (!createPassword) {
        msgProvider.toast(t('emptyPassword'), 'bottom');
        return false;
      }

      if (createPassword && createPassword.trim().length < 6) {
        msgProvider.toast(t('lengthPassword'), 'bottom');
        return false;
      }

      if (!confirmPassword) {
        msgProvider.toast(t('emptyConfirmPassword'), 'bottom');
        return false;
      }

      if (confirmPassword !== createPassword) {
        msgProvider.toast(t('newAndConfirmPasswordMustEqual'), 'bottom');
        return false;
      }

      if (!isChecked) {
        msgProvider.toast(t('termAndConditionNotChecked'), 'bottom');
        return false;
      }

      const API_URL = config.baseURL + 'sign_up';
      consolepro.consolelog(API_URL, '<<<<API URL');

      const formatDate = date => {
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
      };

      const formattedDate = formatDate(date);
      consolepro.consolelog(formatDate, '<<Format date');
      const data = new FormData();
      data.append('name', name.trim());
      data.append('dob', formattedDate);
      data.append('email', email.trim());
      data.append('mobile', mobile_number.trim());
      data.append('password', createPassword.trim());
      data.append('user_type', config.user_type);
      data.append('player_id', config.player_id_me);
      data.append('device_type', config.device_type);
      data.append('login_type', config.login_type);

      consolepro.consolelog(data, '<<<<<data');

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            localStorage.setItemString('token', res?.token);
            localStorage.setItemString('password', createPassword);
            // setName(null);
            // setDateOfBirth(null);
            // setEmail(null);
            // setCreatePassword(null);
            // setConfirmPassword(null);
            // setMobile_number(null);
            // setDate(new Date());
            // setIsChecked(false);
            setTimeout(() => {
              navigation.navigate('GetStartedOtp', {
                userId: res?.userDataArray?.user_id,
              });
            }, 500);
          } else {
            msgProvider.alert(
              t('information_txt'),
              res?.msg[config.language],
              false,
            );
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Line 163');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Line 41');
    }
  };

  // Get Content ===========>>

  // get content url ---------

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

  const handleSocialLogin = async () => {
    try {
      if (!mobile_number || mobile_number === null || mobile_number === '') {
        msgProvider.toast(t('emptyMobileNumber'), 'bottom');
        return false;
      }

      if (
        mobile_number &&
        (mobile_number.trim().length < 7 || mobile_number.trim().length > 15)
      ) {
        msgProvider.toast(t('validMobileNumber'), 'bottom');
        return false;
      }

      if (mobile_number) {
        const isValidMobileNumber = config.mobilevalidation;
        if (isValidMobileNumber.test(mobile_number) !== true) {
          msgProvider.toast(t('validMobileNumber'), 'bottom');
          return false;
        }
      }

      if (!isChecked) {
        msgProvider.toast(t('termAndConditionNotChecked'), 'bottom');
        return false;
      }

      const API_URL = config.baseURL + 'sign_up';
      consolepro.consolelog(API_URL, '<<<<API URL');

      const formatDate = date => {
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
      };

      const formattedDate = formatDate(date);
      consolepro.consolelog(formatDate, '<<Format date');
      const data = new FormData();
      data.append('name', name.trim());
      data.append('dob', formattedDate);
      data.append('email', email.trim());
      data.append('mobile', mobile_number.trim());
      data.append('user_type', config.user_type);
      data.append('player_id', config.player_id_me);
      data.append('device_type', config.device_type);
      data.append('login_type', 'google');
      data.append('social_id', socaildata?.social_id);

      consolepro.consolelog(data, '<<<<<data');

      // return false;
      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            localStorage.setItemString('token', res?.token);
            localStorage.setItemObject('user_array', res?.userDataArray);
            navigate('HomeScreen');
          } else {
            msgProvider.alert(
              t('information_txt'),
              res?.msg[config.language],
              false,
            );
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Line 163');
        });
    } catch (error) {
      consolepro.consolelog('Error =====>>', error);
    }
  };

  consolepro.consolelog(socaildata, '<<socaildata');

  useEffect(() => {
    if (config.device_type == 'ios') {
      setTimeout(() => {
        GetContent();
      }, 1200);
    } else {
      GetContent();
    }
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.themeColor2}}>
        <View style={{marginHorizontal: (mobileW * 5) / 100, flex: 1}}>
          {/* -------back------- */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.goBack();
              setName(null);
              setDateOfBirth(null);
              setEmail(null);
              setCreatePassword(null);
              setConfirmPassword(null);
              setDate(new Date());
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

          <KeyboardAwareScrollView
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={Platform.OS === 'android' ? 100 : 0} // Important for Android
            enableOnAndroid={true}
            contentContainerStyle={{
              paddingBottom: (mobileW * 5) / 100,
              flexGrow: 1, // This allows the scroll view to grow and become scrollable
            }}>
            {/* -------- header------- */}
            <View style={{marginTop: (mobileW * 2) / 100}}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontBold,
                  fontSize: (mobileW * 7) / 100,
                }}>
                {t('register_txt')}
              </Text>

              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontRegular,
                  fontSize: (mobileW * 4) / 100,
                }}>
                {t('create_account_txt')}
              </Text>
            </View>

            {/* -------- input field ------ */}
            <View style={{marginTop: (mobileW * 3) / 100}}>
              <InputField
                title={t('name_txt')}
                placeholderText={t('enter_your_name_txt')}
                keyboardType={'default'}
                maxLength={25}
                containerStyle={{marginTop: (mobileW * 3) / 100}}
                value={name}
                setValue={setName}
                editable={nameEdit}
              />

              <InputWithIcon
                title={t('DOB_txt')}
                iconSource={localimag.icon_calendar}
                editable={false}
                placeholder={t('enter_date_of_bith_txt')}
                resizeMode={'contain'}
                onPress={() => setIsDatePicker(true)}
                value={date ? moment(date).format('DD-MM-YYYY') : ''}
                onIconPress={() => setIsDatePicker(true)}
              />

              <InputField
                title={t('email_address_txt')}
                placeholderText={t('enter_your_email_address_txt')}
                keyboardType={'email-address'}
                maxLength={100}
                value={email}
                setValue={setEmail}
                containerStyle={{marginTop: (mobileW * 3) / 100}}
                editable={emailEdit}
              />

              <InputField
                title={t('mobile_number_txt')}
                placeholderText={t('enter_your_mobile_num_txt')}
                keyboardType={'numeric'}
                maxLength={10}
                value={mobile_number}
                setValue={setMobile_number}
                containerStyle={{marginTop: (mobileW * 3) / 100}}
              />
              {!hidePassword && (
                <>
                  <InputWithIcon
                    title={t('create_password_txt')}
                    iconSource={
                      secureText
                        ? localimag.icon_hide_eye
                        : localimag.icon_eye_open
                    }
                    placeholder={t('enter_your_password')}
                    resizeMode={'contain'}
                    value={createPassword}
                    onIconPress={() => setSecureText(!secureText)}
                    maxLength={16}
                    setValue={setCreatePassword}
                    secureTextEntry={secureText}
                  />

                  <InputWithIcon
                    title={t('confirmPassword_txt')}
                    iconSource={
                      secureText_1
                        ? localimag.icon_hide_eye
                        : localimag.icon_eye_open
                    }
                    placeholder={t('enter_confirm_password_txt')}
                    resizeMode={'contain'}
                    value={confirmPassword}
                    onIconPress={() => setsecureText_1(!secureText_1)}
                    maxLength={16}
                    setValue={setConfirmPassword}
                    secureTextEntry={secureText_1}
                  />
                </>
              )}

              {/* --------- Check Box ------- */}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsChecked(prev => !prev)}
                style={{
                  flexDirection: 'row',
                  //alignItems: 'center',
                  marginTop: (mobileH * 2) / 100,
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
                <View
                  style={{
                    marginLeft: (mobileW * 2.5) / 100,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontSize: (mobileW * 3.2) / 100,
                      fontFamily: Font.FontRegular,
                    }}>
                    {t('byContinuingYouAgree_txt')}{' '}
                    <Text
                      onPress={() =>
                        navigate('ContentPage', {
                          pagename: t('termsAndConditions_txt'),
                          contentpage: 2,
                          user_type: 1,
                          content_data: terms_and_condition_content,
                        })
                      }
                      style={{
                        color: Colors.themeColor,
                        fontSize: (mobileW * 3.2) / 100,
                        fontFamily: Font.FontMedium,
                        marginLeft: (mobileW * 2.5) / 100,
                        marginTop: (mobileH * 0.3) / 100,
                      }}>
                      {t('termsOfService')}
                    </Text>
                  </Text>

                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontSize: (mobileW * 3.2) / 100,
                      fontFamily: Font.FontRegular,
                      marginLeft: (mobileW * 2.5) / 100,
                    }}>
                    {`&`}{' '}
                    <Text
                      onPress={() => {
                        navigate('ContentPage', {
                          pagename: t('privacyPolicy_txt'),
                          contentpage: 1,
                          user_type: 1,
                          content_data: privacy_policy,
                        });
                      }}
                      style={{
                        color: Colors.themeColor,
                        fontSize: (mobileW * 3.2) / 100,
                        fontFamily: Font.FontMedium,
                        marginLeft: (mobileW * 2.5) / 100,
                      }}>
                      {t('privacyPolicy_txt')}
                    </Text>
                  </Text>
                </View>
              </TouchableOpacity>

              <CommonButton
                title={t('create_txt')}
                containerStyle={{
                  marginTop: (mobileW * 5) / 100,
                  width: (mobileW * 70) / 100,
                  // marginBottom: (mobileW * 3) / 100,
                }}
                onPress={() => {
                  socaildata?.social_email
                    ? handleSocialLogin()
                    : handleCreateAccount();
                }}
              />

              {/* {Platform.OS === 'ios' && (
              <CommonBlackButton
                title={Lang_chg.continue_with_apple_txt[config.language]}
                containerStyle={{marginTop: (mobileW * 5) / 100}}
                leftIcon={localimag.icon_apple}
                leftIconStyle={{
                  width: (mobileW * 7) / 100,
                  height: (mobileW * 7) / 100,
                }}
              />
            )}
            <CommonBlackButton
              title={Lang_chg.continue_with_google_txt[config.language]}
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
            /> */}
            </View>

            <DatePicker
              date={date || new Date()}
              onDateChange={setDate}
              modal
              open={isDatePicker}
              mode="date"
              dividerColor={Colors.themeColor}
              theme="light"
              title={t('select_date_of_birth_txt')}
              onCancel={() => setIsDatePicker(false)}
              onConfirm={value => {
                setIsDatePicker(false);
                setDate(value);
              }}
              buttonColor={Colors.themeColor}
              onStateChange={setDate}
              maximumDate={new Date()}
            />
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({});
