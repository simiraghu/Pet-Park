import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ImageBackground,
  Linking,
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
  localStorage,
  consolepro,
  apifuntion,
} from '../../Provider/utilslib/Utils';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Share from 'react-native-share';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';

const Account = () => {
  const {goBack, navigate} = useNavigation();
  const [logoutmodel, setLogoutModel] = useState(false);
  const [isPageTypeValue, setisPageTypeValue] = useState('');
  const [bring_type, setBring_type] = useState('');
  const [about_us_content, setAbout_us_content] = useState('');
  const [terms_and_condition_content, setTerms_and_condition_content] =
    useState('');
  const [privacy_policy, setPrivacy_policy] = useState('');
  const [payment_policy_content, setPayment_policy_content] = useState('');
  const [rateApp, setRateApp] = useState('');
  const [shareApp, setShareApp] = useState('');
  const [userDetails, setUserDetails] = useState('');
  const [socialData, setSocialData] = useState(null);
  const [appleId, setAppleId] = useState(null);
  const [googleID, setgoogleID] = useState(null);
  const [isHideShow, setIsHideShow] = useState(true);

  const {t} = useTranslation();

  const language = useSelector(state => state.register.language);

  const isVideo = uri => {
    return (
      uri &&
      (uri.endsWith('.mp4') || uri.endsWith('.mov') || uri.endsWith('.avi'))
    );
  };

  // Get Type ===========>>>

  const getType = async () => {
    const type = await localStorage.getItemString('PlanAPet');
    const bringType = await localStorage.getItemString('bring_type');
    consolepro.consolelog(bringType, '<<Bringtype');
    console.log(type, '<<<<<<type');
    setisPageTypeValue(type);
    setBring_type(bringType);
  };

  // Get user details ======>>>

  useFocusEffect(
    useCallback(() => {
      const getUserDetails = async () => {
        const user_array = await localStorage.getItemObject('user_array');
        const keep_me_signed_in = await localStorage.getItemString(
          'keep_me_signed_in',
        );
        const social_data = await localStorage.getItemObject('socialdata');
        consolepro.consolelog('Social data >>>>', social_data);
        setSocialData(social_data);
        setAppleId(user_array?.apple_id);
        setgoogleID(user_array?.google_id);
        consolepro.consolelog(keep_me_signed_in, '<<Keep me signed in');
        consolepro.consolelog(user_array, '<<USERARRAy');
        setUserDetails(user_array);
      };

      getUserDetails();
      getType();
    }, []),
  );

  consolepro.consolelog('Google ID========>>', googleID);
  consolepro.consolelog('Apple ID========>>', appleId);

  // get content url ---------
  const API_URL = config.baseURL + 'get_content?language_id=' + config.language;

  //--------rate us ------------------
  const rate_app = () => {
    console.log('I am in rate app ');
    console.log(rateApp, 'rateappURL');
    Linking.openURL(rateApp).catch(err =>
      alert('Please check for the Google Play Store'),
    );
  };

  // share app ---------------
  const shareappbtn = async () => {
    console.log(shareApp);
    let shareOptions = {
      message: shareApp,
      failOnCancel: false,
    };
    console.log(shareOptions, 'share Option');
    await Share.open(shareOptions);
  };

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
              // about us -----
              var aboutUs_URL = '';
              if (data[i].content_type === 0) {
                aboutUs_URL = data[i].content_url;
                setAbout_us_content(aboutUs_URL);
                consolepro.consolelog('Line 45', aboutUs_URL);
              }

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

              // rate app ------
              // for ios
              var rateAppURL = '';
              if (data[i]?.content_type === 3) {
                if (config.device_type == 'ios') {
                  rateAppURL = data[i]?.content_english[config.language];
                  setRateApp(rateAppURL);
                }
              }

              consolepro.consolelog(rateApp, '<<Rate');
              // for android
              if (data[i]?.content_type === 4) {
                if (config.device_type == 'android') {
                  rateAppURL = data[i]?.content_english[config.language];
                  setRateApp(rateAppURL);
                }
              }

              // share app -------
              var shareAppUrl = '';
              if (data[i]?.content_type === 5) {
                shareAppUrl = data[i]?.content_english[config.language];
                setShareApp(shareAppUrl);
                consolepro.consolelog(shareApp, '<<SHARE APP');
              }

              var paymentPolicyUrl = '';
              if (data[i]?.content_type === 6) {
                paymentPolicyUrl = data[i].content_url;
                setPayment_policy_content(paymentPolicyUrl);
                consolepro.consolelog(
                  'Payment Policy =========>>',
                  paymentPolicyUrl,
                );
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

  useFocusEffect(
    useCallback(() => {
      if (config.device_type == 'ios') {
        setTimeout(() => {
          GetContent();
        }, 1200);
      } else {
        GetContent();
      }
    }, []),
  );

  const payment_hide_or_show = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const user_id = user_array?.user_id;

      const API_URL = config.baseURL + 'get_payment_status';

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success === true) {
            consolepro.consolelog(res, '<<<Payment status');
            config.razorpay_key_id = res?.statusArr?.razorpay_key_id;
            config.razorpay_secret_key = res?.statusArr?.razorpay_secret_key;
            if (res?.statusArr?.status == 0) {
              setIsHideShow(true); // Show payment feature
            } else {
              setIsHideShow(false); // Hide payment feature
            }
          } else {
            consolepro.consolelog(
              'Payment status API returned success = false',
            );
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<<<<< API error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<<<<< Try-Catch error');
    }
  };

  useFocusEffect(
    useCallback(() => {
      payment_hide_or_show();
    }, []),
  );

  consolepro.consolelog(
    'Show OverAll Count******',
    config.show_overall_chat_count,
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View
          style={{
            width: (mobileW * 90) / 100,
            alignSelf: 'center',
            marginTop: (mobileH * 3.5) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => goBack()}
            activeOpacity={0.8}
            style={{
              width: (mobileW * 12) / 100,
              height: (mobileW * 12) / 100,
            }}>
            <Image
              source={localimag.icon_goBack}
              style={{
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
                tintColor: '#405757',
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
            />
          </TouchableOpacity>
        </View>

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          contentContainerStyle={{
            paddingBottom: (mobileH * 18) / 100,
          }}
          keyboardShouldPersistTaps="handled">
          <View
            style={{
              //marginTop: (mobileH * 0.5) / 100,
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: Colors.headingColor,
                fontSize: (mobileW * 6.5) / 100,
                fontFamily: Font.FontSemibold,
              }}>
              {t('account_txt')}
            </Text>
            <Text
              style={{
                color: Colors.headingColor,
                fontSize: (mobileW * 3.5) / 100,
                fontFamily: Font.FontMedium,
              }}>
              {t('yourprofile_txt')}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              // isPageTypeValue === 'PlanAPet'
              //   ? navigate('WithoutPetProfile')
              //   : navigate('UpdateProfileNew')
              bring_type == 0
                ? navigate('UpdateProfileNew')
                : navigate('WithoutPetProfile')
            }
            style={{
              marginTop: (mobileH * 1) / 100,
              width: (mobileW * 90) / 100,
              height: (mobileH * 10) / 100,
              borderRadius: (mobileW * 3) / 100,
              backgroundColor: Colors.themeColor,
              paddingHorizontal: (mobileW * 3) / 100,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <TouchableOpacity activeOpacity={1}>
              <View
                style={{
                  // backgroundColor: 'blue',
                  // alignSelf: 'flex-start',
                  borderRadius: (mobileW * 30) / 100,
                  overflow: 'hidden',
                }}>
                <Image
                  source={
                    userDetails?.user_image && !isVideo(userDetails.user_image)
                      ? {uri: config.img_url + userDetails?.user_image}
                      : localimag.icon_profile_user
                  }
                  style={{
                    width: (mobileH * 5.5) / 100,
                    height: (mobileH * 5.5) / 100,
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                />
              </View>

              {bring_type == 0 && (
                <View
                  style={{
                    // backgroundColor: 'blue',
                    alignSelf: 'flex-start',
                    borderRadius: (mobileW * 30) / 100,
                    overflow: 'hidden',
                    position: 'absolute',
                    right: 0,
                  }}>
                  <Image
                    source={
                      userDetails?.pet_images?.length > 0
                        ? {
                            uri:
                              config.img_url +
                              (userDetails.pet_images[0].type === 2
                                ? userDetails.pet_images[0].pet_thumbnail
                                : userDetails.pet_images[0].image),
                          }
                        : localimag?.icon_add_pet_photo
                    }
                    style={{
                      width: (mobileW * 4) / 100,
                      height: (mobileW * 4) / 100,
                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      ],
                    }}
                  />
                </View>
              )}
            </TouchableOpacity>

            <View
              style={{
                width: (mobileW * 64) / 100,
                marginLeft: (mobileW * 3) / 100,
              }}>
              <Text
                style={{
                  fontSize: (mobileW * 3.7) / 100,
                  fontFamily: Font.FontRegular,
                  color: Colors.whiteColor,
                  textAlign: config.language == 1 ? 'left' : 'left',
                }}>
                {userDetails?.name}
              </Text>
              <Text
                style={{
                  fontSize: (mobileW * 2.7) / 100,
                  fontFamily: Font.FontRegular,
                  color: Colors.whiteColor,
                  textAlign: config.language == 1 ? 'left' : 'left',
                }}>
                {userDetails?.mobile}
              </Text>
            </View>

            <Image
              style={{
                marginRight: (mobileW * 3) / 100,
                height: (mobileW * 4) / 100,
                width: (mobileW * 4) / 100,
                transform: [config.language == 1 ? {scaleX: 1} : {scaleX: -1}],
              }}
              source={localimag.icon_goBack}></Image>
          </TouchableOpacity>

          <View
            style={{
              marginVertical: (mobileH * 2) / 100,
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: Colors.themeColor,
                fontSize: (mobileW * 3) / 100,
                fontFamily: Font.FontMedium,
              }}>
              {t('Manageyourconnectexperiencesandaccountsettings_txt')}
            </Text>
          </View>

          {/* change language */}

          <TouchableOpacity
            onPress={() => {
              navigate('ChangeLanguage');
            }}
            activeOpacity={0.8}
            style={styles.mainViewStyle}>
            <View style={styles.viewStyle}>
              <Image
                style={[
                  styles.frontImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  },
                ]}
                source={localimag.icon_changelanguage}></Image>

              <Text style={styles.textStyle}>{t('changeLanguage_txt')}</Text>
            </View>

            <View style={styles.backViewStyle}>
              <Text
                style={[
                  styles.textStyle,
                  {
                    fontSize: (mobileW * 2.8) / 100,
                  },
                ]}>
                {language == 0
                  ? 'English'
                  : language == 1
                  ? 'Arabic'
                  : 'Chinese'}
              </Text>
              <Image
                style={[
                  styles.backImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: 1} : {scaleX: -1},
                    ],
                  },
                ]}
                source={localimag.icon_goBack}></Image>
            </View>
          </TouchableOpacity>

          {/* change country */}

          <TouchableOpacity
            onPress={() => {
              navigate('ChangeCountry');
            }}
            activeOpacity={0.8}
            style={styles.mainViewStyle}>
            <View style={[styles.viewStyle, {width: (mobileW * 50) / 100}]}>
              <Image
                style={[
                  styles.frontImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  },
                ]}
                source={localimag.icon_change_country}></Image>

              <Text style={styles.textStyle}>{t('change_country_txt')}</Text>
            </View>

            <View style={styles.backViewStyle}>
              <Text
                style={[
                  styles.textStyle,
                  {
                    fontSize: (mobileW * 2.8) / 100,
                  },
                ]}>
                {userDetails?.country_name && userDetails?.country_name}
              </Text>
              <Image
                style={[
                  styles.backImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: 1} : {scaleX: -1},
                    ],
                  },
                ]}
                source={localimag.icon_goBack}></Image>
            </View>
          </TouchableOpacity>

          {/* Subscription History */}
          {!isHideShow && (
            <TouchableOpacity
              onPress={() => {
                navigate('SubscriptionHistory');
              }}
              activeOpacity={0.8}
              style={styles.mainViewStyle}>
              <View style={[styles.viewStyle, {width: (mobileW * 50) / 100}]}>
                <Image
                  style={[
                    styles.frontImageStyle,
                    {
                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      ],
                    },
                    {
                      width: (mobileW * 5.5) / 100,
                      height: (mobileW * 5.5) / 100,
                    },
                  ]}
                  source={localimag.icon_subscription}></Image>

                <Text style={styles.textStyle}>
                  {t('subscription_history_txt')}
                </Text>
              </View>

              <View style={styles.backViewStyle}>
                <Image
                  style={[
                    styles.backImageStyle,
                    {
                      transform: [
                        config.language == 1 ? {scaleX: 1} : {scaleX: -1},
                      ],
                    },
                  ]}
                  source={localimag.icon_goBack}></Image>
              </View>
            </TouchableOpacity>
          )}

          {/* settings */}

          <TouchableOpacity
            onPress={() => {
              navigate('SettingScreen');
            }}
            activeOpacity={0.8}
            style={styles.mainViewStyle}>
            <View style={styles.viewStyle}>
              <Image
                style={[
                  styles.frontImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                    height: (mobileW * 5.5) / 100,
                    width: (mobileW * 5.5) / 100,
                  },
                ]}
                source={localimag.icon_accountSettings}></Image>

              <Text style={styles.textStyle}>{t('settings_txt')}</Text>
            </View>

            <View style={styles.backViewStyle}>
              <Image
                style={[
                  styles.backImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: 1} : {scaleX: -1},
                    ],
                  },
                ]}
                source={localimag.icon_goBack}></Image>
            </View>
          </TouchableOpacity>

          {/* change password */}

          {!(googleID || appleId) && (
            <TouchableOpacity
              onPress={() => {
                navigate('ChangePassword');
              }}
              activeOpacity={0.8}
              style={styles.mainViewStyle}>
              <View style={styles.viewStyle}>
                <Image
                  style={[
                    styles.frontImageStyle,
                    {
                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      ],
                      height: (mobileW * 5.5) / 100,
                      width: (mobileW * 5.5) / 100,
                    },
                    {tintColor: Colors.themeColor2},
                  ]}
                  source={localimag.icon_lock}></Image>

                <Text style={styles.textStyle}>{t('change_password_txt')}</Text>
              </View>

              <View style={styles.backViewStyle}>
                <Image
                  style={[
                    styles.backImageStyle,
                    {
                      transform: [
                        config.language == 1 ? {scaleX: 1} : {scaleX: -1},
                      ],
                    },
                  ]}
                  source={localimag.icon_goBack}></Image>
              </View>
            </TouchableOpacity>
          )}

          {/* contact us */}

          <TouchableOpacity
            onPress={() => {
              navigate('ContactUs');
            }}
            activeOpacity={0.8}
            style={styles.mainViewStyle}>
            <View style={styles.viewStyle}>
              <Image
                style={[
                  styles.frontImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                    height: (mobileW * 5.5) / 100,
                    width: (mobileW * 5.5) / 100,
                  },
                ]}
                source={localimag.icon_accountContactUs}></Image>

              <Text style={styles.textStyle}>{t('contactUs_txt')}</Text>
            </View>

            <View style={styles.backViewStyle}>
              <Image
                style={[
                  styles.backImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: 1} : {scaleX: -1},
                    ],
                  },
                ]}
                source={localimag.icon_goBack}></Image>
            </View>
          </TouchableOpacity>

          {/* About us */}

          <TouchableOpacity
            onPress={() => {
              navigate('ContentPage', {
                pagename: t('about_us_txt'),
                contentpage: 1,
                content_data: about_us_content,
              });
            }}
            activeOpacity={0.8}
            style={styles.mainViewStyle}>
            <View style={styles.viewStyle}>
              <Image
                style={[
                  styles.frontImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                    height: (mobileW * 5.5) / 100,
                    width: (mobileW * 5.5) / 100,
                  },
                  {tintColor: Colors.themeColor2},
                ]}
                source={localimag.icon_about_us}></Image>

              <Text style={styles.textStyle}>{t('about_us_txt')}</Text>
            </View>

            <View style={styles.backViewStyle}>
              <Image
                style={[
                  styles.backImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: 1} : {scaleX: -1},
                    ],
                  },
                ]}
                source={localimag.icon_goBack}></Image>
            </View>
          </TouchableOpacity>

          {/* priacy policy */}

          <TouchableOpacity
            onPress={() => {
              navigate('ContentPage', {
                pagename: t('privacyPolicy_txt'),
                contentpage: 1,
                content_data: privacy_policy,
              });
            }}
            activeOpacity={0.8}
            style={styles.mainViewStyle}>
            <View style={styles.viewStyle}>
              <Image
                style={[
                  styles.frontImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                    height: (mobileW * 5.5) / 100,
                    width: (mobileW * 5.5) / 100,
                  },
                ]}
                source={localimag.icon_privacyPolicy}></Image>

              <Text style={styles.textStyle}>{t('privacyPolicy_txt')}</Text>
            </View>

            <View style={styles.backViewStyle}>
              <Image
                style={[
                  styles.backImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: 1} : {scaleX: -1},
                    ],
                  },
                ]}
                source={localimag.icon_goBack}></Image>
            </View>
          </TouchableOpacity>

          {/* terms & conditions */}

          <TouchableOpacity
            onPress={() => {
              navigate('ContentPage', {
                pagename: t('termsAndConditions_txt'),
                contentpage: 2,
                content_data: terms_and_condition_content,
              });
            }}
            activeOpacity={0.8}
            style={styles.mainViewStyle}>
            <View style={styles.viewStyle}>
              <Image
                style={[
                  styles.frontImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                    height: (mobileW * 5.5) / 100,
                    width: (mobileW * 5.5) / 100,
                  },
                ]}
                source={localimag.icon_termsConditions}></Image>

              <Text style={styles.textStyle}>
                {t('termsAndConditions_txt')}
              </Text>
            </View>

            <View style={styles.backViewStyle}>
              <Image
                style={[
                  styles.backImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: 1} : {scaleX: -1},
                    ],
                  },
                ]}
                source={localimag.icon_goBack}></Image>
            </View>
          </TouchableOpacity>

          {/* Payment Policy  */}

          {!isHideShow && (
            <TouchableOpacity
              onPress={() => {
                navigate('ContentPage', {
                  pagename: t('payment_policy_txt'),
                  contentpage: 2,
                  content_data: payment_policy_content,
                });
              }}
              activeOpacity={0.8}
              style={styles.mainViewStyle}>
              <View style={styles.viewStyle}>
                <Image
                  style={[
                    styles.frontImageStyle,
                    {
                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      ],
                      height: (mobileW * 5.5) / 100,
                      width: (mobileW * 5.5) / 100,
                    },
                  ]}
                  source={localimag.icon_paymeny_policy}></Image>

                <Text style={styles.textStyle}>{t('payment_policy_txt')}</Text>
              </View>

              <View style={styles.backViewStyle}>
                <Image
                  style={[
                    styles.backImageStyle,
                    {
                      transform: [
                        config.language == 1 ? {scaleX: 1} : {scaleX: -1},
                      ],
                    },
                  ]}
                  source={localimag.icon_goBack}></Image>
              </View>
            </TouchableOpacity>
          )}

          {/* faq */}

          <TouchableOpacity
            onPress={() => {
              navigate('FandQ');
            }}
            activeOpacity={0.8}
            style={styles.mainViewStyle}>
            <View style={styles.viewStyle}>
              <Image
                style={[
                  styles.frontImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                    height: (mobileW * 5.5) / 100,
                    width: (mobileW * 5.5) / 100,
                  },
                  {
                    tintColor: Colors.themeColor2,
                  },
                ]}
                source={localimag.icon_fandq}></Image>

              <Text style={styles.textStyle}>{t('fandq_txt')}</Text>
            </View>

            <View style={styles.backViewStyle}>
              <Image
                style={[
                  styles.backImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: 1} : {scaleX: -1},
                    ],
                  },
                ]}
                source={localimag.icon_goBack}></Image>
            </View>
          </TouchableOpacity>

          {/* rate app */}

          <TouchableOpacity
            onPress={() => {
              rate_app();
            }}
            activeOpacity={0.8}
            style={styles.mainViewStyle}>
            <View style={styles.viewStyle}>
              <Image
                style={[
                  styles.frontImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                    height: (mobileW * 5.5) / 100,
                    width: (mobileW * 5.5) / 100,
                  },
                  {tintColor: Colors.themeColor2},
                ]}
                source={localimag.icon_rate_app}></Image>

              <Text style={styles.textStyle}>{t('rate_app_txt')}</Text>
            </View>

            <View style={styles.backViewStyle}>
              <Image
                style={[
                  styles.backImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: 1} : {scaleX: -1},
                    ],
                  },
                ]}
                source={localimag.icon_goBack}></Image>
            </View>
          </TouchableOpacity>

          {/* share app */}

          <TouchableOpacity
            onPress={() => {
              shareappbtn();
            }}
            activeOpacity={0.8}
            style={styles.mainViewStyle}>
            <View style={styles.viewStyle}>
              <Image
                style={[
                  styles.frontImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                    height: (mobileW * 5.5) / 100,
                    width: (mobileW * 5.5) / 100,
                  },
                  {tintColor: Colors.themeColor2},
                ]}
                source={localimag.icon_share_app}></Image>

              <Text style={styles.textStyle}>{t('share_app_txt')}</Text>
            </View>

            <View style={styles.backViewStyle}>
              <Image
                style={[
                  styles.backImageStyle,
                  {
                    transform: [
                      config.language == 1 ? {scaleX: 1} : {scaleX: -1},
                    ],
                  },
                ]}
                source={localimag.icon_goBack}></Image>
            </View>
          </TouchableOpacity>

          {/* Logout */}

          <TouchableOpacity
            onPress={() => {
              setLogoutModel(true);
            }}
            activeOpacity={0.8}
            style={{
              width: (mobileW * 50) / 100,
              height: (mobileH * 4) / 100,
              alignSelf: 'center',
              marginTop: (mobileH * 5) / 100,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.homeCardbackgroundColor,
              borderRadius: (mobileW * 1.5) / 100,
              borderWidth: (mobileW * 0.2) / 100,
              borderColor: Colors.darkGreenColor,
              alignSelf: 'flex-end',
              marginRight: (mobileW * 5) / 100,
            }}>
            <Text
              style={{
                fontSize: (mobileW * 3.3) / 100,
                color: Colors.darkGreenColor,
                fontFamily: Font.FontSemibold,
              }}>
              {t('logout_txt')}
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>

        {/* ----- Logout Model ------------------- */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={logoutmodel}
          requestClose={() => {
            setLogoutModel(false);
            localStorage.removeItem('PlanAPet');
          }}>
          <TouchableOpacity
            onPress={() => {
              setLogoutModel(false);
            }}
            activeOpacity={1}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#00000090',
            }}>
            <View
              style={{
                width: (mobileW * 65) / 100,
                paddingVertical: (mobileH * 1.5) / 100,
                borderRadius: (mobileW * 3) / 100,
                backgroundColor: Colors.whiteColor,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => setLogoutModel(false)}
                activeOpacity={0.8}
                style={{
                  alignSelf: 'flex-end',
                }}>
                <Image
                  source={localimag.icon_crossIcon}
                  style={{
                    right: (mobileW * 2) / 100,
                    width: (mobileW * 5) / 100,
                    height: (mobileW * 5) / 100,
                    tintColor: '#dbd7d7',
                  }}
                />
              </TouchableOpacity>

              <Image
                source={localimag.icon_logoutModal}
                style={{
                  width: (mobileW * 15) / 100,
                  height: (mobileW * 15) / 100,
                  resizeMode: 'contain',
                  marginTop: (-mobileH * 1) / 100,
                }}
              />
              <Text
                style={{
                  width: (mobileW * 50) / 100,
                  color: Colors.themeColor,
                  fontSize: (mobileW * 5) / 100,
                  fontFamily: Font.FontSemibold,
                  textAlign: 'center',
                  marginTop: (mobileH * 1) / 100,
                }}>
                {t('areyousure_txt')}
              </Text>
              <Text
                style={{
                  width: (mobileW * 50) / 100,
                  color: Colors.darkGreenColor,
                  fontSize: (mobileW * 3) / 100,
                  fontFamily: Font.FontSemibold,
                  textAlign: 'center',
                }}>
                {t('youwanttologout_txt')}
              </Text>

              <View
                style={{
                  width: (mobileW * 55) / 100,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: (mobileH * 1.5) / 100,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setLogoutModel(false);
                  }}
                  activeOpacity={0.8}
                  style={{
                    height: (mobileH * 4.5) / 100,
                    width: (mobileW * 26.5) / 100,
                    backgroundColor: Colors.cancleColor,
                    borderRadius: (mobileW * 2) / 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: (mobileW * 3.5) / 100,
                      fontFamily: Font.FontMedium,
                      color: Colors.whiteColor,
                    }}>
                    {t('cancelmedia')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setLogoutModel(false);
                    // localStorage.clear();
                    localStorage.removeItem('user_array');
                    localStorage.removeItem('password');
                    localStorage.removeItem('otp');
                    localStorage.removeItem('token');
                    localStorage.removeItem('bring_type');
                    localStorage.removeItem('latitude');
                    localStorage.removeItem('longitude');
                    localStorage.removeItem('add_location');
                    localStorage.removeItem('socialdata');
                    setTimeout(() => {
                      navigate('WelcomeScreen');
                    }, 300);
                  }}
                  style={{
                    height: (mobileH * 4.5) / 100,
                    width: (mobileW * 26.5) / 100,
                    backgroundColor: Colors.themeColor_1,
                    borderRadius: (mobileW * 2) / 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: (mobileW * 3.5) / 100,
                      fontFamily: Font.FontSemibold,
                      color: Colors.whiteColor,
                    }}>
                    {t('logout_txt')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  mainViewStyle: {
    width: (mobileW * 90) / 100,
    height: (mobileH * 5) / 100,
    backgroundColor: Colors.whiteColor,
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginBottom: (mobileH * 1) / 100,
    borderRadius: (mobileW * 1) / 100,
    flexDirection: 'row',
    paddingHorizontal: (mobileW * 4) / 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.themeColor,
  },
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (mobileW * 60) / 100,
  },
  backImageStyle: {
    marginLeft: (mobileW * 2) / 100,
    height: (mobileW * 3) / 100,
    width: (mobileW * 3) / 100,
    tintColor: '#405757',
  },
  backViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    marginLeft: (mobileW * 3) / 100,
    fontSize: (mobileW * 3.2) / 100,
    color: '#092626',
    fontFamily: Font.FontMedium,
    textAlign: config.language == 1 ? 'left' : 'left',
  },
  frontImageStyle: {
    height: (mobileW * 6.5) / 100,
    width: (mobileW * 6.5) / 100,
  },
});
