import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {localimag} from '../Provider/Localimage';
import {
  Colors,
  config,
  consolepro,
  Font,
  Lang_chg,
  mobileH,
  mobileW,
  msgProvider,
  localStorage,
  apifuntion,
} from '../Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {InputWithIcon} from '../Components/InputWithIcon';
import CommonButton from '../Components/CommonButton';
import CommonModal from '../Components/CommonModal';
import DatePicker from 'react-native-date-picker';
import {validation} from '../Provider/Messageconsolevalidationprovider/Validation_provider';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const PersonalInformation = ({navigation}) => {
  const [isDobEditable, setIsDobEditable] = useState(false);
  const [isGenderEdit, setIsGenderEdit] = useState(false);

  const [email, setEmail] = useState(null);
  const [mobile_number, setMobile_number] = useState(null);
  const [isSavedModal, setIsSavedModal] = useState(false);

  const [isDatePicker, setIsDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateOfBirth, setdateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [socialData, setSocialData] = useState(null);
  const [isEmailEdit, setIsEmailEdit] = useState(true);
  const [googleID, setGoogleID] = useState(null);
  const [appleId, setAppleId] = useState(null);

  const {t} = useTranslation();

  const genderDetails = ['', 'Male', 'Female', 'Other'];

  const get_userDetails = async () => {
    const user_arr = await localStorage.getItemObject('user_array');
    const userId = user_arr?.user_id;

    // setDate(user_arr?.dob);
    setGender(genderDetails?.[user_arr?.gender]);
    setEmail(user_arr?.email);
    setMobile_number(user_arr?.mobile);
    setdateOfBirth(user_arr?.dob);
    consolepro.consolelog(user_arr, '<USEr');
    setAppleId(user_arr?.apple_id);
    setGoogleID(user_arr?.google_id);
  };

  useEffect(() => {
    get_userDetails();
  }, []);

  const setProfileData = async () => {
    const result = await localStorage.getItemObject('socialdata');
    const user_array = await localStorage.getItemObject('user_array');
    console.log({result});

    if (user_array?.google_id || user_array?.apple_id) {
      setEmail(user_array?.email);
      setIsEmailEdit(false);
    }
    if (result != null) {
      const {social_email} = result;

      if (social_email != null) {
        setEmail(social_email);
        setIsEmailEdit(false);
      }

      setSocialData(result);
    }
  };

  useEffect(() => {
    setProfileData();
  }, []);

  // Handle Personal Information ============

  const handlePersonalInformation = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_array');
      const userId = user_arr?.user_id;

      consolepro.consolelog(user_arr, '<UserID');

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

      if (!mobile_number) {
        msgProvider.toast(t('emptyMobileNumber'), 'bottom');
        return false;
      }

      if (mobile_number && mobile_number.trim().length <= 0) {
        msgProvider.toast(t('emptyMobileNumber'), 'bottom');
        return false;
      }

      if (email) {
        const trimmedMobile = mobile_number.trim();
        const isValidMobile = config.mobilevalidation;
        if (isValidMobile.test(trimmedMobile) !== true) {
          msgProvider.toast(t('validMobileNumber'), 'bottom');
          return false;
        }
      }

      const API_URL = config.baseURL + 'add_personal_info';

      const data = new FormData();
      data.append('user_id', userId);
      data.append('email', email);
      data.append('mobile', mobile_number);

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            localStorage.setItemObject('user_array', res?.userDataArray);
            setTimeout(() => {
              setIsSavedModal(true);
            }, 700);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('welcomeScreen');
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
      consolepro.consolelog(error, '<<ERr');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        <View
          style={{
            marginTop: (mobileW * 5) / 100,
            marginHorizontal: (mobileW * 5) / 100,
            flex: 1,
          }}>
          {/* --------back ------ */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.goBack(), setEmail(null), setMobile_number(null);
            }}
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

          {/* -------- heading------- */}

          <View style={{flex: 1}}>
            {/* ------- input fields ------- */}
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingBottom: (mobileH * 10) / 100,
                flex: 1,
              }}
              scrollEnabled={true}>
              <View
                style={{
                  marginHorizontal: (mobileW * 2) / 100,
                  // backgroundColor: 'blue',
                  flex: 1,
                }}>
                <View style={{marginVertical: (mobileW * 5) / 100}}>
                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 6) / 100,
                    }}>
                    {t('personal_information_txt')}
                  </Text>

                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3.5) / 100,
                    }}>
                    {t('personal_information_subheading')}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor: Colors.ColorBlack,
                    borderWidth: (mobileW * 0.3) / 100,
                    paddingHorizontal: (mobileW * 2) / 100,
                    paddingVertical: (mobileW * 1) / 100,
                    borderRadius: (mobileW * 1) / 100,
                  }}>
                  <Image
                    source={localimag.icon_email_box}
                    style={{
                      width: (mobileW * 8) / 100,
                      height: (mobileW * 8) / 100,
                    }}
                  />
                  <TextInput
                    style={{
                      width: (mobileW * 72) / 100,
                      height: (mobileW * 12) / 100,
                      // backgroundColor: 'gray',
                      marginLeft: (mobileW * 2) / 100,
                      // borderLeftColor: Colors.placeholderTextColor,
                      // borderLeftWidth: (mobileW * 0.3) / 100,
                      color: Colors.ColorBlack,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3.5) / 100,
                      paddingHorizontal: (mobileW * 5) / 100,
                      textAlign: config.language == 1 ? 'right' : 'left',
                    }}
                    placeholderTextColor={Colors.placeholderTextColor}
                    placeholder={t('enter_your_email_address_txt')}
                    keyboardType="email-address"
                    maxLength={100}
                    value={email}
                    onChangeText={val => setEmail(val)}
                    editable={false}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor: Colors.ColorBlack,
                    borderWidth: (mobileW * 0.3) / 100,
                    paddingHorizontal: (mobileW * 2) / 100,
                    paddingVertical: (mobileW * 1) / 100,
                    borderRadius: (mobileW * 1) / 100,
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    activeOpacity={0.8}>
                    <Image
                      source={localimag.icon_indian_flag}
                      style={{
                        width: (mobileW * 8) / 100,
                        height: (mobileW * 8) / 100,
                      }}
                    />
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3.5) / 100,
                      }}>{` + 91 `}</Text>
                    <TouchableOpacity activeOpacity={0.5}>
                      <Image
                        source={localimag.icon_down_arrow}
                        style={{
                          width: (mobileW * 3) / 100,
                          height: (mobileW * 3) / 100,
                        }}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>

                  <TextInput
                    style={{
                      width: (mobileW * 62) / 100,
                      height: (mobileW * 12) / 100,
                      // backgroundColor: 'gray',
                      marginLeft: (mobileW * 2) / 100,
                      // borderLeftColor: Colors.placeholderTextColor,
                      // borderLeftWidth: (mobileW * 0.3) / 100,
                      color: Colors.ColorBlack,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3.5) / 100,
                      paddingHorizontal: (mobileW * 3) / 100,
                      textAlign: config.language == 1 ? 'right' : 'left',
                    }}
                    placeholderTextColor={Colors.placeholderTextColor}
                    placeholder={t('enter_your_mobile_num_txt')}
                    keyboardType="numeric"
                    maxLength={15}
                    value={mobile_number}
                    onChangeText={val => setMobile_number(val)}
                    editable={false}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  {/* -------- dob input -------- */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: (mobileW * 3) / 100,
                    }}>
                    <View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.title}>{t('DOB_txt')}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.inputWrapper}
                        onPress={() => {
                          // setIsDatePicker(true);
                        }}
                        activeOpacity={0.8}>
                        <TextInput
                          style={styles.input}
                          placeholder={'01/ 19/10'}
                          value={dateOfBirth}
                          placeholderTextColor={Colors.placeholderTextColor}
                          editable={isDobEditable}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* -------- gender input- -------- */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: (mobileW * 3) / 100,
                    }}>
                    <View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.title}>{t('gender_txt')}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.inputWrapper}
                        onPress={() => {}}
                        activeOpacity={0.8}>
                        <TextInput
                          style={styles.input}
                          // placeholder={'Female'}
                          value={gender}
                          placeholderTextColor={Colors.placeholderTextColor}
                          editable={isGenderEdit}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 2.5) / 100,
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  {t(`dobAndGender_txt`)}
                </Text>

                {/* <CommonButton
                containerStyle={{
                  width: (mobileW * 35) / 100,
                  backgroundColor: Colors.themeColor2,
                  alignSelf: 'flex-end',
                  marginTop: (mobileH * 5) / 100,
                  height: (mobileW * 10) / 100,
                }}
                title={t('save_txt')}
                onPress={() => {
                  handlePersonalInformation();
                }}
              /> */}
              </View>
            </KeyboardAwareScrollView>
          </View>

          <DatePicker
            date={date}
            onDateChange={setDate}
            modal
            open={isDatePicker}
            mode="date"
            dividerColor={Colors.themeColor}
            theme="dark"
            title={t('select_date_of_birth_txt')}
            onCancel={() => setIsDatePicker(false)}
            onConfirm={() => {
              setIsDatePicker(false);
            }}
            buttonColor={Colors.themeColor}
            onStateChange={setDate}
          />
        </View>

        <CommonModal
          visible={isSavedModal}
          message={t('saved_successfully_txt')}
          btnText={t('profile_txt')}
          button={true}
          onCrosspress={() => setIsSavedModal(false)}
          isIconTick={true}
          isIcon={localimag.icon_green_tick}
          onPress={() => {
            setIsSavedModal(false);
            navigation.navigate('Account');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default PersonalInformation;

const styles = StyleSheet.create({
  title: {
    marginBottom: 5,
    fontSize: (mobileW * 3.5) / 100,
    marginTop: (mobileH * 1) / 100,
    fontFamily: Font.FontMedium,
    color: Colors.themeColor2,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.placeholderTextColor,
    borderRadius: (mobileW * 2) / 100,
    paddingHorizontal: (mobileW * 3.5) / 100,
    height: (mobileH * 6) / 100,
    width: (mobileW * 40) / 100,
  },

  input: {
    flex: 1,
    fontSize: (mobileW * 3.5) / 100,
    color: Colors.placeholderTextColor,
    fontFamily: Font.FontMedium,
  },

  icon: {
    width: (mobileW * 3) / 100,
    height: (mobileW * 3) / 100,
  },
});
