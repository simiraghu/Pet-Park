import {
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {localimag} from '../Provider/Localimage';
import {
  apifuntion,
  config,
  consolepro,
  Lang_chg,
  mobileH,
  mobileW,
  localStorage,
  msgProvider,
} from '../Provider/utilslib/Utils';
import CommonButton from '../Components/CommonButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import InputField from '../Components/InputField';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import BannerCarousel from 'react-native-banner-carousel';
import {SafeAreaView} from 'react-native-safe-area-context';

const WishingPetParentUserDetails = ({navigation}) => {
  const {navigate, goBack} = useNavigation();

  const {params} = useRoute();

  const [tags, setTags] = useState([
    {
      id: 0,
      name: '29 Year Old',
    },
    {
      id: 1,
      name: 'Single',
    },
    {
      id: 2,
      name: 'Doctor',
    },
    {
      id: 2,
      name: 'Female',
    },
  ]);
  const reportData = [
    {
      id: 1,
      report_reason: [
        'Nudity or sexual activity',
        'العري أو النشاط الجنسي',
        '裸露或性行为',
      ],
    },
    {
      id: 2,
      report_reason: [
        'Bullying or harassment',
        'التنمر أو المضايقة',
        '欺凌或骚扰',
      ],
    },
    {
      id: 3,
      report_reason: [
        'Suicide, self injury or eating disorders',
        'الانتحار أو إيذاء النفس أو اضطرابات الأكل',
        '自杀、自残或饮食失调',
      ],
    },
    {
      id: 4,
      report_reason: [
        'Voilence, hate or exploition',
        'العنف أو الكراهية أو الاستغلال',
        '暴力、仇恨或剥削',
      ],
    },
    {
      id: 5,
      report_reason: [
        'Selling or promoting restricted items',
        'بيع أو الترويج لعناصر محظورة',
        '销售或宣传受限物品',
      ],
    },
    {
      id: 6,
      report_reason: [
        'Scam, fraud or impersonation',
        'الاحتيال أو انتحال الشخصية',
        '诈骗、欺诈或冒充他人',
      ],
    },
    {
      id: 7,
      report_reason: ['Something else', 'شيء آخر', '其他'],
    },
  ];

  const SHARING_DATA = [
    {
      id: 1,
      share_image: localimag.icon_whatsapp,
      share_app_name: 'WhatsApp',
    },
    {
      id: 2,
      share_image: localimag.icon_share_to,
      share_app_name: 'Share to',
    },
    {
      id: 3,
      share_image: localimag.icon_copy_link,
      share_app_name: 'Copylink',
    },
    {
      id: 4,
      share_image: localimag.icon_send_share,
      share_app_name: 'Send',
    },
    {
      id: 5,
      share_image: localimag.icon_message,
      share_app_name: 'Message',
    },
  ];

  const UNMATCH_REASON = [
    {
      id: 1,
      reason: ['No Reason', 'لا يوجد سبب', '没有理由'],
    },
    {
      id: 2,
      reason: [
        "I'm not interested in this person",
        'لست مهتمًا بهذا الشخص',
        '我对这个人不感兴趣',
      ],
    },
    {
      id: 3,
      reason: [
        'Profile fake, Spam or Spammer',
        'ملف مزيف أو بريد عشوائي أو مرسل بريد عشوائي',
        '虚假资料、垃圾信息或垃圾信息发送者',
      ],
    },
    {
      id: 4,
      reason: ['Inappropriate content', 'محتوى غير لائق', '不当内容'],
    },
    {
      id: 5,
      reason: ['Underage or minor', 'قاصر أو تحت السن القانونية', '未成年人'],
    },
    {
      id: 6,
      reason: ['Something else', 'شيء آخر', '其他原因'],
    },
  ];

  const [slideIndex, setSlideIndex] = useState(0);

  const [showData, setShowData] = useState(false);

  const [data, setData] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopUpMenu, setIsPopUpMenu] = useState(false);
  const [reportProfilePopUp, setReportProfilePopUp] = useState(false);
  const [reportReason, setReportReason] = useState(0);
  const [reportReason_txt, setReportReason_txt] = useState('');
  const [unmatchReason_txt, setUnmatchReason_txt] = useState('');
  const [reportThanksModal, setReportThanksModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [blockedSuccessfully, setBlockedSuccessfully] = useState(false);
  const [isPetModal, setIsPetModal] = useState(false);
  const [unmatchReasonPopup, setUnmatchReasonPopup] = useState(false);
  const [selectUnmatchReason, setSelectUnmatchReason] = useState(0);
  const [isUmatchModal, setIsUmatchModal] = useState(false);
  const [isWoofYesModal, setIsWoofYesModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [isProfileApprovalModal, setIsProfileApprovalModal] = useState(false);
  const [isUserApproved, setIsUserApproved] = useState(false);

  const {t} = useTranslation();

  const onScroll = event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / slideSize);
    setSlideIndex(index);
  };

  const getUserDetails = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL +
        'get_other_user_profile?user_id=' +
        userId +
        '&other_user_id=' +
        params?.other_user_id;

      consolepro.consolelog('API URL ==> ', API_URL);

      apifuntion
        .getApi(API_URL, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');

            let details_arr = res?.user_details;
            // let user_images = details_arr[0]?.user_images;
            setData(details_arr);
            // setuserImgArr([...user_images]);
            setShowData(true);
          } else {
            consolepro.consolelog(res);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res, '<<RES');
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<ERROR');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  const blockUser = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();

      data.append('user_id', userId);
      data.append('other_user_id', params?.other_user_id);

      consolepro.consolelog(data, '<<Data');

      const API_URL = config.baseURL + 'block_user';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            setBlockModal(false);
            setBlockedSuccessfully(true);
          } else {
            consolepro.consolelog(res);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res, '<<RES');
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Erro');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Line 38');
    }
  };

  const reportUser = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();

      let report_reason = [
        'Nudity or sexual activity',
        'العري أو النشاط الجنسي',
        '裸露或性行为',
      ];

      data.append('user_id', userId);
      data.append('other_user_id', params?.other_user_id);

      if (reportReason == 0) {
        data.append('reason', report_reason[config.language]);
      } else {
        data.append('reason', reportReason_txt);
      }

      consolepro.consolelog(data, '<<Data');

      //return false;

      const API_URL = config.baseURL + 'report_user';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            setReportProfilePopUp(false), setReportThanksModal(true);
          } else {
            consolepro.consolelog(res);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res, '<<RES');
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Erro');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Line 38');
    }
  };

  const createMatch = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      if (!message) {
        msgProvider.toast(t('emptyMessage'), 'bottom');
        return false;
      }

      const data = new FormData();

      data.append('user_id', userId);
      data.append('other_user_id', params?.other_user_id);
      data.append('message', message);

      consolepro.consolelog(data, '<<Data');

      //return false;

      const API_URL = config.baseURL + 'create_match';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            setIsPetModal(false);
            navigation.replace('FriendshipHome');
          } else {
            consolepro.consolelog(res);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');

              setTimeout(() => {
                msgProvider.toast(res?.msg[config.language] + '', 'center');
              }, 300);
            } else {
              consolepro.consolelog(res, '<<RES');
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Erro');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Line 38');
    }
  };

  const unMatch = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();

      let unmatch_reason = ['No Reason', 'لا سبب', '没有原因'];

      data.append('user_id', userId);
      data.append('other_user_id', params?.other_user_id);

      if (selectUnmatchReason == 0) {
        data.append('unmatch_reason', unmatch_reason[config.language]);
      } else {
        data.append('unmatch_reason', unmatchReason_txt);
      }

      consolepro.consolelog(data, '<<Data');

      //return false;

      const API_URL = config.baseURL + 'unmatch_user';
      consolepro.consolelog(API_URL, '<<API');

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<REs');
            setUnmatchReasonPopup(false);
            setTimeout(() => {
              navigation.replace('FriendshipHome');
            }, 500);
          } else {
            consolepro.consolelog(res);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');

              setTimeout(() => {
                msgProvider.toast(res?.msg[config.language] + '', 'center');
              }, 300);
            } else {
              consolepro.consolelog(res, '<<RES');
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Erro');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Line 38');
    }
  };

  const likeUserProfile = async other_user_id => {
    try {
      consolepro.consolelog('Other User ID =====>>', other_user_id);
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL +
        'like_user_profile?user_id=' +
        userId +
        '&other_user_id=' +
        other_user_id;
      // return false
      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              setIsWoofYesModal(false);
              navigation.goBack();
            }, 400);
            msgProvider.toast(res?.msg[config.language], 'bottom');
            return false;
          } else {
            consolepro.consolelog(res);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res, '<<RES');
              msgProvider.alert(
                'information_txt',
                res?.msg[config.language],
                false,
              );
              return false;
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<ERROR');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  const dislikeUserProfile = async other_user_id => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL +
        'dislike_user_profile?user_id=' +
        userId +
        '&other_user_id=' +
        other_user_id;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              navigation.goBack();
            }, 400);
            msgProvider.toast(res?.msg[config.language], 'bottom');
            return false;
          } else {
            consolepro.consolelog(res);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res, '<<RES');
              msgProvider.alert(
                'information_txt',
                res?.msg[config.language],
                false,
              );
              return false;
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<ERROR');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  const get_user_approval_status = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL + 'check_user_profile_approve?user_id=' + userId;

      consolepro.consolelog('API URL for approval status ===> ', API_URL);

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<User Approval Status');
            if (res?.approve_flag === 1) {
              setIsUserApproved(true);
              setIsProfileApprovalModal(false);
            } else {
              setIsUserApproved(false);
              setIsProfileApprovalModal(true);
            }
          } else {
            consolepro.consolelog(res, '<<Error in getting approval status');
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Error in getting approval status');
        });
    } catch (error) {
      consolepro.consolelog('Error =======>>', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      get_user_approval_status();
    }, []),
  );

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainView}>
        <>
          {/* -----back---- */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: (mobileW * 5) / 100,
              marginHorizontal: (mobileW * 4) / 100,
              paddingBottom: (mobileW * 2) / 100,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                goBack();
              }}
              style={{
                alignSelf: 'flex-start',
                width: (mobileW * 8) / 100,
                height: (mobileW * 8) / 100,
              }}>
              <Image
                source={localimag.icon_back_arrow}
                style={[
                  {
                    width: (mobileW * 6) / 100,
                    height: (mobileW * 6) / 100,
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  },
                ]}
              />
            </TouchableOpacity>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  paddingHorizontal: (mobileW * 1) / 100,
                  paddingVertical: (mobileW * 1) / 100,
                  borderRadius: (mobileW * 30) / 100,
                  backgroundColor: '#97958a',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Image
                  source={localimag.icon_userLocation}
                  style={{
                    width: (mobileW * 3.2) / 100,
                    height: (mobileW * 3.2) / 100,
                  }}
                />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: Colors.whiteColor,
                    fontSize: (mobileW * 3) / 100,
                    fontFamily: Font.FontSemibold,
                    marginLeft: (mobileW * 1) / 100,
                    flexShrink: 1,
                    maxWidth: (mobileW * 50) / 100,
                  }}>
                  {data?.address}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={!isUserApproved}
                onPress={() => {
                  setIsPopUpMenu(true);
                }}>
                <Image
                  source={localimag.icon_three_dot}
                  style={[
                    {
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                      marginLeft: (mobileW * 3) / 100,
                    },
                    {tintColor: Colors.whiteColor},
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* dislike like */}
          {showData && (
            <>
              {/* {data?.match_status ? ( */}

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={!isUserApproved}
                onPress={() => {
                  dislikeUserProfile(data?.user_id);
                }}
                style={{
                  position: 'absolute',
                  bottom: (mobileH * 12) / 100,
                  zIndex: 10,
                  left: (mobileW * 5) / 100,
                  borderRadius: (mobileW * 30) / 100,
                  overflow: 'hidden',
                  backgroundColor: Colors.cancleColor,
                  padding: (mobileW * 2) / 100,
                }}>
                <Image
                  source={localimag.icon_dislike}
                  style={{
                    width: (mobileW * 10) / 100,
                    height: (mobileW * 10) / 100,
                  }}
                  tintColor={Colors.whiteColor}
                />
              </TouchableOpacity>

              {/* ) : data?.like_status ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsWoofYesModal(true)}
                style={{
                  position: 'absolute',
                  bottom: (mobileW * 3) / 100,
                  zIndex: 10,
                  left: (mobileW * 3) / 100,
                  borderRadius: (mobileW * 30) / 100,
                  overflow: 'hidden',
                  backgroundColor: Colors.WoofYesBtn,
                  padding: (mobileW * 2) / 100,
                }}>
                <Image
                  source={localimag.icon_hand_like}
                  style={{
                    width: (mobileW * 10) / 100,
                    height: (mobileW * 10) / 100,
                  }}
                  tintColor={Colors.whiteColor}
                />
              </TouchableOpacity>
            ) : (
              <View></View> */}
              {/* )
            } */}

              {!data?.match_status && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={!isUserApproved}
                  onPress={() => {
                    consolepro.consolelog(
                      'USer id for liek =========>>',
                      data?.user_id,
                    );
                    likeUserProfile(data?.user_id);
                  }}
                  style={{
                    position: 'absolute',
                    bottom: (mobileH * 12) / 100,
                    zIndex: 10,
                    right: (mobileW * 5) / 100,
                    borderRadius: (mobileW * 30) / 100,
                    overflow: 'hidden',
                    backgroundColor: Colors.WoofYesBtn,
                    padding: (mobileW * 2) / 100,
                  }}>
                  <Image
                    source={localimag.icon_hand_like}
                    style={{
                      width: (mobileW * 10) / 100,
                      height: (mobileW * 10) / 100,
                    }}
                    tintColor={Colors.whiteColor}
                  />
                </TouchableOpacity>
              )}

              <KeyboardAwareScrollView
                showsHorizontalScrollIndicator={false}
                scrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{paddingBottom: (mobileH * 20) / 100}}
                showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    backgroundColor: Colors.themeColor,
                    width: (mobileW * 90) / 100,
                    height: (mobileW * 0.2) / 100,
                    alignSelf: 'center',
                    marginTop: (mobileW * 2) / 100,
                  }}></View>

                {/* ----- profile ------ */}
                {data?.match_message != 'NA' && (
                  <View
                    style={{
                      alignSelf: 'center',
                      marginVertical: (mobileW * 6) / 100,
                    }}>
                    <TouchableOpacity
                      style={{
                        borderRadius: (mobileW * 4) / 100,
                        overflow: 'hidden',
                      }}
                      activeOpacity={1}>
                      <Image
                        source={{uri: config.img_url + data?.pet_image}}
                        style={{
                          width: (mobileW * 90) / 100,
                          height: (mobileW * 38) / 100,
                        }}
                      />
                    </TouchableOpacity>

                    <View
                      style={{
                        backgroundColor: '#FEE9E9',
                        width: (mobileW * 80) / 100,
                        padding: (mobileW * 3) / 100,
                        position: 'absolute',
                        bottom: (-mobileW * 6) / 100,
                        left: 0,
                        borderBottomLeftRadius: (mobileW * 3) / 100,
                        borderTopRightRadius: (mobileW * 3) / 100,
                      }}>
                      <Text
                        style={{
                          color: Colors.cancleColor,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 3) / 100,
                        }}>
                        {data?.match_message}
                      </Text>
                    </View>
                  </View>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: (mobileW * 5) / 100,
                  }}>
                  <View
                    style={{
                      marginHorizontal: (mobileW * 5) / 100,
                      alignSelf: 'flex-start',
                    }}>
                    <View
                      style={{
                        borderRadius: (mobileW * 7) / 100,
                        overflow: 'hidden',
                      }}>
                      <Image
                        source={{
                          uri: config.img_url + data?.user_images[0]?.image,
                        }}
                        style={{
                          width: (mobileW * 13) / 100,
                          height: (mobileW * 13) / 100,
                        }}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      width: (mobileW * 70) / 100,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    {data?.approve_flag == 1 ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: (mobileW * 50) / 100,
                        }}>
                        <Text
                          numberOfLines={2}
                          style={{
                            color: Colors.whiteColor,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 7) / 100,
                            textAlign: 'center',
                            alignSelf: 'center',
                          }}>
                          {data?.name}
                        </Text>
                        <Image
                          source={localimag?.icon_verify}
                          style={{
                            width: (mobileW * 5) / 100,
                            height: (mobileW * 5) / 100,
                            marginLeft: (mobileW * 1) / 100,
                          }}
                        />
                      </View>
                    ) : (
                      <View style={{}}>
                        <Text
                          numberOfLines={2}
                          style={{
                            color: Colors.whiteColor,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 7) / 100,
                            textAlign: 'center',
                            alignSelf: 'center',
                          }}>
                          {data?.name}
                        </Text>

                        {/* <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 2.8) / 100,
                        }}>
                        {`Unverified`}
                      </Text> */}
                      </View>
                    )}
                  </View>
                </View>

                <View
                  style={{
                    width: (mobileW * 90) / 100,
                    height: (mobileH * 30) / 100,
                    alignSelf: 'center',
                    marginTop: (mobileW * 5) / 100,
                  }}>
                  {/* Using BannerCarousel instead of FlatList */}
                  <BannerCarousel
                    autoplay
                    autoplayTimeout={3000}
                    loop
                    index={0}
                    showsPageIndicator={false}
                    pageIndicatorContainerStyle={{
                      width: (mobileW * 0) / 100,
                      height: (mobileH * 0) / 100,
                    }}
                    activePageIndicatorStyle={{
                      width: (mobileW * 0) / 100,
                      height: (mobileH * 0) / 100,
                    }}
                    pageSize={(mobileW * 90) / 100}
                    onPageChanged={index => setSlideIndex(index)}>
                    {data?.user_images?.map((childItem, carouselIndex) => (
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          navigate('VideoPreview', {
                            uri: config.img_url + childItem?.image,
                            type: childItem?.type == 2 ? 1 : 0,
                          });
                        }}>
                        <ImageBackground
                          source={
                            childItem?.type == 2
                              ? {uri: config.img_url + childItem?.thumbnail}
                              : {uri: config.img_url + childItem?.image}
                          }
                          style={{
                            width: (mobileW * 90) / 100,
                            height: (mobileH * 30) / 100,
                            position: 'relative',
                          }}
                          imageStyle={{
                            borderRadius: (mobileW * 4) / 100,
                          }}>
                          <LinearGradient
                            colors={['rgba(0,0,0,0.5)', 'transparent']}
                            style={styles.gradient}
                          />
                          <View
                            style={{
                              marginTop: (mobileH * 1.5) / 100,
                            }}>
                            <View
                              style={{
                                paddingHorizontal: (mobileW * 5) / 100,
                              }}>
                              <Indicator
                                slides={data?.user_images}
                                slideIndex={carouselIndex}
                              />

                              {/* <TouchableOpacity
                              activeOpacity={1}
                              style={{
                                paddingHorizontal: (mobileW * 1) / 100,
                                paddingVertical: (mobileW * 1) / 100,
                                borderRadius: (mobileW * 30) / 100,
                                backgroundColor: '#97958a',
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'flex-end',
                                flexDirection: 'row',
                                marginTop: (mobileW * 5) / 100,
                              }}>
                              <Image
                                source={localimag.icon_userLocation}
                                style={{
                                  width: (mobileW * 3.2) / 100,
                                  height: (mobileW * 3.2) / 100,
                                }}
                              />
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                  color: Colors.whiteColor,
                                  fontSize: (mobileW * 3) / 100,
                                  fontFamily: Font.FontSemibold,
                                  marginLeft: (mobileW * 1) / 100,
                                  flexShrink: 1,
                                  maxWidth: (mobileW * 50) / 100,
                                }}>
                                {data?.address}
                              </Text>
                            </TouchableOpacity> */}
                            </View>
                          </View>

                          <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.5)']}
                            style={styles.gradientBottom}
                          />

                          {childItem?.type == 2 && (
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => {
                                navigate('VideoPreview', {
                                  uri: config.img_url + childItem?.image,
                                  type: childItem?.type == 2 ? 1 : 0,
                                });
                              }}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: [
                                  {translateX: -(mobileW * 2.5) / 100},
                                  {translateY: -(mobileW * 2.5) / 100},
                                ],
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Image
                                source={localimag?.icon_play_icon}
                                style={{
                                  width: (mobileW * 10) / 100,
                                  height: (mobileW * 10) / 100,
                                }}
                              />
                            </TouchableOpacity>
                          )}
                        </ImageBackground>
                      </TouchableOpacity>
                    ))}
                  </BannerCarousel>
                </View>

                <View
                  style={{
                    //marginTop: (mobileH * 0.5) / 100,
                    flexDirection: 'row',
                    alignItems: 'center',
                    zIndex: 5,
                    alignSelf: 'center',
                    marginTop: (mobileW * 3) / 100,
                    flexWrap: 'wrap',
                    gap: (mobileH * 1) / 100,
                  }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      // width: (mobileW * 20) / 100,
                      paddingHorizontal: (mobileW * 2) / 100,
                      height: (mobileH * 3.5) / 100,
                      borderRadius: (mobileW * 30) / 100,
                      backgroundColor: '#97958a',
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: 0.8,
                    }}>
                    <Text
                      style={{
                        color: Colors.whiteColor,
                        fontSize: (mobileW * 2.8) / 100,
                        fontFamily: Font.FontSemibold,
                      }}>
                      {`${data?.user_age} Years Old`}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      paddingHorizontal: (mobileW * 2) / 100,
                      height: (mobileH * 3.5) / 100,
                      borderRadius: (mobileW * 30) / 100,
                      backgroundColor: '#97958a',
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: 0.8,
                      marginLeft: (mobileW * 1.5) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.whiteColor,
                        fontSize: (mobileW * 2.8) / 100,
                        fontFamily: Font.FontSemibold,
                      }}>
                      {data?.relationship_status == 1 ? 'Single' : 'Married'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      paddingHorizontal: (mobileW * 2) / 100,
                      height: (mobileH * 3.5) / 100,
                      borderRadius: (mobileW * 30) / 100,
                      backgroundColor: '#97958a',
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: 0.8,
                      marginLeft: (mobileW * 1.5) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.whiteColor,
                        fontSize: (mobileW * 2.8) / 100,
                        fontFamily: Font.FontSemibold,
                      }}>
                      {data?.occupation}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      paddingHorizontal: (mobileW * 2) / 100,
                      height: (mobileH * 3.5) / 100,
                      borderRadius: (mobileW * 30) / 100,
                      backgroundColor: '#97958a',
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: 0.8,
                      marginLeft: (mobileW * 1.5) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.whiteColor,
                        fontSize: (mobileW * 2.8) / 100,
                        fontFamily: Font.FontSemibold,
                      }}>
                      {data?.gender == 1
                        ? 'Male'
                        : data?.gender == 2
                        ? 'Female'
                        : 'Both'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    marginHorizontal: (mobileW * 8) / 100,
                    //   backgroundColor: 'blue',
                  }}>
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontLight,
                      fontSize: (mobileW * 3.5) / 100,
                      marginTop: (mobileH * 3) / 100,
                    }}>
                    {data?.about}
                  </Text>

                  <View
                    style={{
                      alignSelf: 'center',
                      marginTop: (mobileW * 5) / 100,
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        width: (mobileW * 80) / 100,
                        height: (mobileW * 11) / 100,
                        borderRadius: (mobileW * 10) / 100,
                        backgroundColor: Colors.wishingToParentHeadingColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.FontSemibold,
                          fontSize: (mobileW * 4) / 100,
                        }}>
                        {t('wishingTobePetParent_txt')}
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        //marginTop: (mobileH * 0.5) / 100,
                        flexDirection: 'row',
                        alignItems: 'center',
                        zIndex: 5,
                        alignSelf: 'center',
                        marginTop: (mobileW * 3) / 100,
                        // width: (mobileW * 90) / 100,
                        // alignSelf: 'center',
                        flexWrap: 'wrap',
                        gap: (mobileH * 1) / 100,
                      }}>
                      <TouchableOpacity
                        activeOpacity={1}
                        style={{
                          paddingHorizontal: (mobileW * 2) / 100,
                          height: (mobileH * 3.5) / 100,
                          borderRadius: (mobileW * 30) / 100,
                          backgroundColor: '#97958a',
                          justifyContent: 'center',
                          alignItems: 'center',
                          opacity: 0.8,
                        }}>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontSize: (mobileW * 2.8) / 100,
                            fontFamily: Font.FontSemibold,
                          }}>
                          {data?.pet_gender == 1
                            ? 'Male'
                            : data?.pet_gender == 2
                            ? 'Female'
                            : 'Both'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={1}
                        style={{
                          paddingHorizontal: (mobileW * 2) / 100,
                          height: (mobileH * 3.5) / 100,
                          borderRadius: (mobileW * 30) / 100,
                          backgroundColor: '#97958a',
                          justifyContent: 'center',
                          alignItems: 'center',
                          opacity: 0.8,
                          marginLeft: (mobileW * 1) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontSize: (mobileW * 2.8) / 100,
                            fontFamily: Font.FontSemibold,
                          }}>
                          {data?.vaccination_status == 1
                            ? 'Fully vaccinated'
                            : 'Not vaccinated'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={1}
                        style={{
                          paddingHorizontal: (mobileW * 2) / 100,
                          height: (mobileH * 3.5) / 100,
                          borderRadius: (mobileW * 30) / 100,
                          backgroundColor: '#97958a',
                          justifyContent: 'center',
                          alignItems: 'center',
                          opacity: 0.8,
                          marginLeft: (mobileW * 1) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontSize: (mobileW * 2.8) / 100,
                            fontFamily: Font.FontSemibold,
                          }}>
                          {data?.breed_name[config.language]}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={1}
                        style={{
                          paddingHorizontal: (mobileW * 2) / 100,
                          height: (mobileH * 3.5) / 100,
                          borderRadius: (mobileW * 30) / 100,
                          backgroundColor: '#97958a',
                          justifyContent: 'center',
                          alignItems: 'center',
                          opacity: 0.8,
                          marginLeft: (mobileW * 1) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontSize: (mobileW * 2.8) / 100,
                            fontFamily: Font.FontSemibold,
                          }}>
                          {data?.bring_type == 0
                            ? 'Friendship'
                            : 'Planning for pet'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{height: (mobileW * 28) / 100}}>
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.FontLight,
                          fontSize: (mobileW * 3.8) / 100,
                          marginTop: (mobileW * 2) / 100,
                        }}>
                        {data?.note}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* --------- pop up menu ----- */}
                <Modal
                  // animationType="slide"
                  transparent={true}
                  visible={isPopUpMenu}
                  requestClose={() => setIsPopUpMenu(false)}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsPopUpMenu(false);
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
                        // width: (mobileW * 35) / 100,
                        paddingVertical: (mobileH * 1) / 100,
                        borderRadius: (mobileW * 2) / 100,
                        backgroundColor: Colors.whiteColor,
                        alignItems: 'center',
                        position: 'absolute',
                        right: (mobileW * 6) / 100,
                        top:
                          Platform.OS === 'ios'
                            ? (mobileW * 15) / 100
                            : (mobileW * 6) / 100,
                        paddingHorizontal: (mobileW * 3) / 100,
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setReportProfilePopUp(true), setIsPopUpMenu(false);
                        }}
                        style={{
                          alignSelf: 'flex-start',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: (mobileW * 2) / 100,
                        }}>
                        <View>
                          <Image
                            source={localimag.icon_report_blank}
                            style={{
                              width: (mobileW * 4) / 100,
                              height: (mobileW * 4) / 100,
                            }}
                          />
                        </View>
                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontSemibold,
                            fontSize: (mobileW * 3.5) / 100,
                            marginLeft: (mobileW * 2) / 100,
                          }}>
                          {t('reportProfile_txt')}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setBlockModal(true), setIsPopUpMenu(false);
                        }}
                        style={{
                          alignSelf: 'flex-start',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: (mobileW * 2) / 100,
                        }}>
                        <View>
                          <Image
                            source={localimag.icon_profile_block}
                            style={{
                              width: (mobileW * 4) / 100,
                              height: (mobileW * 4) / 100,
                            }}
                          />
                        </View>
                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontSemibold,
                            fontSize: (mobileW * 3.5) / 100,
                            marginLeft: (mobileW * 2) / 100,
                          }}>
                          {t('block_txt')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>

                {/* report profile modal  */}

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={reportProfilePopUp}
                  requestClose={() => {
                    setReportProfilePopUp(false);
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setReportProfilePopUp(false);
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
                        backgroundColor: Colors.whiteColor,
                        position: 'absolute',
                        bottom: 0,
                        borderTopEndRadius: (mobileW * 3) / 100,
                        borderTopLeftRadius: (mobileW * 3) / 100,
                        // flex: 1
                      }}>
                      <View
                        style={{
                          backgroundColor: Colors.themeColor,
                          height: (mobileH * 7) / 100,
                          width: mobileW,
                          paddingHorizontal: (mobileW * 3) / 100,
                          borderTopEndRadius: (mobileW * 3) / 100,
                          borderTopLeftRadius: (mobileW * 3) / 100,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                          <Text
                            style={{
                              color: Colors.whiteColor,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 6) / 100,
                              textAlign: 'center', // Ensure text is centered
                            }}>
                            {t('report_txt')}
                          </Text>
                        </View>

                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            setReportProfilePopUp(false);
                          }}>
                          <Image
                            source={localimag.icon_cross}
                            style={[
                              {
                                width: (mobileW * 5) / 100,
                                height: (mobileW * 5) / 100,
                              },
                              {tintColor: Colors.whiteColor},
                            ]}
                          />
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          // alignItems: 'center',
                          // justifyContent: 'center',
                          marginTop: (mobileW * 4) / 100,
                          marginHorizontal: (mobileW * 5) / 100,
                          // backgroundColor: 'blue'
                        }}>
                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontSemibold,
                            fontSize: (mobileW * 6) / 100,
                            textAlign: 'center',
                          }}>
                          {t('what_do_you_want_to_report_txt')}
                        </Text>

                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontLight,
                            fontSize: (mobileW * 3.5) / 100,
                            marginTop: (mobileW * 2) / 100,
                          }}>
                          {t('if_someone_immidate_danger_txt')}
                        </Text>

                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontSemibold,
                            fontSize: (mobileW * 4.5) / 100,
                            marginTop: (mobileW * 2) / 100,
                          }}>
                          {t('why_are_you_reporting_this_profile_txt')}
                        </Text>
                      </View>
                      <View
                        style={{backgroundColor: Colors.whiteColor, flex: 1}}>
                        <FlatList
                          data={reportData}
                          style={{marginTop: (mobileW * 2) / 100}}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({item, index}) => (
                            <View
                              style={{
                                marginLeft: (mobileW * 6) / 100,
                                marginTop: (mobileW * 1) / 100,
                              }}>
                              <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                  setReportReason(index);
                                  setReportReason_txt(
                                    item?.report_reason[config.language],
                                  );
                                }}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  alignSelf: 'flex-start',
                                }}>
                                <Image
                                  source={
                                    reportReason === index
                                      ? localimag.icon_filled_checkbox_theme1
                                      : localimag.icon_empty_radio
                                  }
                                  style={{
                                    width: (mobileW * 5) / 100,
                                    height: (mobileW * 5) / 100,
                                  }}
                                />
                                <Text
                                  style={{
                                    color: Colors.themeColor2,
                                    fontFamily: Font.FontMedium,
                                    fontSize: (mobileW * 3.5) / 100,
                                    marginLeft: (mobileW * 2) / 100,
                                  }}>
                                  {item?.report_reason[config.language]}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        />

                        <CommonButton
                          title={t('ok_txt')}
                          containerStyle={{
                            backgroundColor: Colors.themeColor2,
                            marginVertical: (mobileW * 5) / 100,
                            width: (mobileW * 70) / 100,
                          }}
                          onPress={reportUser}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>

                {/*  Report Thanks modal */}

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={reportThanksModal}
                  // requestClose={() => {
                  //   setReportThanksModal(false);
                  // }}
                >
                  <TouchableOpacity
                    // onPress={() => {
                    //   setReportThanksModal(false);
                    // }}
                    activeOpacity={1}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#00000090',
                    }}>
                    <View
                      style={{
                        backgroundColor: Colors.whiteColor,
                        position: 'absolute',
                        bottom: 0,
                        borderTopEndRadius: (mobileW * 3) / 100,
                        borderTopLeftRadius: (mobileW * 3) / 100,
                        width: mobileW,
                      }}>
                      <View
                        style={{flex: 1, backgroundColor: Colors.whiteColor}}>
                        <View
                          style={{
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: (mobileW * 5) / 100,
                            paddingHorizontal: (mobileW * 7) / 100,
                          }}>
                          <View>
                            <Image
                              source={localimag.icon_tick_bold_green}
                              style={{
                                width: (mobileW * 12) / 100,
                                height: (mobileW * 12) / 100,

                                transform: [
                                  config.language == 1
                                    ? {scaleX: -1}
                                    : {scaleX: 1},
                                ],
                              }}
                            />
                          </View>

                          <Text
                            style={{
                              color: Colors.themeColor2,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 6) / 100,
                              marginTop: (mobileW * 2) / 100,
                              textAlign: 'center',
                            }}>
                            {t('thanks_for_letting_use_know')}
                          </Text>

                          <Text
                            style={{
                              color: Colors.themeColor2,
                              fontFamily: Font.FontLight,
                              fontSize: (mobileW * 3.5) / 100,
                              textAlign: 'center',
                            }}>
                            {t('we_use_your_feedback_txt')}
                          </Text>
                        </View>

                        {/* <View style={{marginHorizontal: (mobileW * 10) / 100}}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 4.5) / 100,
                    alignSelf: 'flex-start',
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  {Lang_chg.other_steps_you_can_take[config.language]}
                </Text>

                <View style={{marginTop: (mobileW * 2) / 100}}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={localimag.icon_profile_block}
                      style={{
                        width: (mobileW * 6) / 100,
                        height: (mobileW * 6) / 100,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 4) / 100,
                          marginLeft: (mobileW * 2) / 100,
                        }}>{`Block John's Profile`}</Text>
                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontLight,
                          fontSize: (mobileW * 3) / 100,
                        }}>{`You won't be able to see or contact each other.`}</Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  <Image
                    source={localimag.icon_hide_eye}
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                  />
                  <View>
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 4) / 100,
                        marginLeft: (mobileW * 2) / 100,
                      }}>{`Hide All From John`}</Text>
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontLight,
                        fontSize: (mobileW * 3) / 100,
                      }}>{`Stop seeing from this person`}</Text>
                  </View>
                </View>
              </View> */}

                        <CommonButton
                          title={t('done_txt')}
                          containerStyle={{
                            backgroundColor: Colors.themeColor2,
                            marginVertical: (mobileW * 5) / 100,
                            width: (mobileW * 70) / 100,
                          }}
                          onPress={() => {
                            setReportThanksModal(false);
                            navigation.replace('FriendshipHome');
                          }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>

                {/*  asking block modal  */}

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={blockModal}
                  requestClose={() => {
                    setBlockModal(false);
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setBlockModal(false);
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
                        width: (mobileW * 80) / 100,
                        paddingVertical: (mobileH * 2) / 100,
                        borderRadius: (mobileW * 3) / 100,
                        backgroundColor: Colors.whiteColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontBold,
                          fontSize: (mobileW * 6) / 100,
                        }}>{`${t('block_txt')} ${data?.name}?`}</Text>

                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 4) / 100,
                        }}>{`${data?.name} ${t('willNoLonger_txt')}`}</Text>

                      <View style={{marginTop: (mobileW * 2) / 100}}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View
                            style={{
                              backgroundColor: Colors.themeColor2,
                              width: (mobileW * 2) / 100,
                              height: (mobileW * 2) / 100,
                              borderRadius: (mobileW * 30) / 100,
                            }}></View>
                          <Text
                            style={{
                              color: Colors.themeColor2,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 3) / 100,
                              marginLeft: (mobileW * 1) / 100,
                            }}>
                            {t('seeYourPost_txt')}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: (mobileW * 1) / 100,
                          }}>
                          <View
                            style={{
                              backgroundColor: Colors.themeColor2,
                              width: (mobileW * 2) / 100,
                              height: (mobileW * 2) / 100,
                              borderRadius: (mobileW * 10) / 100,
                            }}></View>
                          <Text
                            style={{
                              color: Colors.themeColor2,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 3) / 100,
                              marginLeft: (mobileW * 1) / 100,
                            }}>
                            {t('tagYou_txt')}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: (mobileW * 1) / 100,
                          }}>
                          <View
                            style={{
                              backgroundColor: Colors.themeColor2,
                              width: (mobileW * 2) / 100,
                              height: (mobileW * 2) / 100,
                              borderRadius: (mobileW * 10) / 100,
                            }}></View>
                          <Text
                            style={{
                              color: Colors.themeColor2,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 3) / 100,
                              marginLeft: (mobileW * 1) / 100,
                            }}>
                            {t('inviteYouToYourGroup_txt')}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: (mobileW * 1) / 100,
                          }}>
                          <View
                            style={{
                              backgroundColor: Colors.themeColor2,
                              width: (mobileW * 2) / 100,
                              height: (mobileW * 2) / 100,
                              borderRadius: (mobileW * 10) / 100,
                            }}></View>
                          <Text
                            style={{
                              color: Colors.themeColor2,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 3) / 100,
                              marginLeft: (mobileW * 1) / 100,
                            }}>
                            {t('startConversationWith_txt')}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: (mobileW * 3) / 100,
                        }}>
                        <CommonButton
                          containerStyle={{
                            width: (mobileW * 35) / 100,
                            backgroundColor: Colors.ColorCancel,
                            height: (mobileW * 10) / 100,
                          }}
                          title={t('cancel_txt')}
                          onPress={() => setBlockModal(false)}
                        />

                        <CommonButton
                          containerStyle={{
                            width: (mobileW * 35) / 100,
                            backgroundColor: Colors.themeColor2,
                            height: (mobileW * 10) / 100,
                            marginLeft: (mobileW * 3) / 100,
                          }}
                          title={t('block_txt')}
                          onPress={blockUser}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>

                {/* blocked modal */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={blockedSuccessfully}
                  // requestClose={() => setBlockedSuccessfully(false)}
                >
                  <TouchableOpacity
                    // onPress={() => {
                    //   setBlockedSuccessfully(false);
                    // }}
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
                        paddingVertical: (mobileH * 1.5) / 100,
                        borderRadius: (mobileW * 3) / 100,
                        backgroundColor: Colors.whiteColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          width: (mobileW * 60) / 100,
                          color: Colors.themeColor2,
                          fontSize: (mobileW * 5.5) / 100,
                          fontFamily: Font.FontBold,
                          textAlign: 'center',
                          marginTop: (mobileH * 1) / 100,
                        }}>
                        {`${t('youBlocked_txt')} ${data?.name}`}
                      </Text>
                      <Text
                        style={{
                          width: (mobileW * 55) / 100,
                          color: Colors.ColorBlack,
                          fontSize: (mobileW * 3) / 100,
                          fontFamily: Font.FontRegular,
                          textAlign: 'center',
                        }}>
                        {`Blocks are profile specific and apply individually. this block won't apply to ${data?.name}'s other profile's, but we'll limit some of the  way that he can interact with you from his other profiles.`}
                      </Text>

                      <View
                        style={{
                          width: (mobileW * 55) / 100,
                          alignItems: 'center',
                          alignSelf: 'center',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          marginTop: (mobileH * 1.5) / 100,
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            setBlockedSuccessfully(false);
                            navigation.replace('FriendshipHome');
                          }}
                          style={{
                            height: (mobileH * 4.5) / 100,
                            width: (mobileW * 30) / 100,
                            backgroundColor: Colors.themeColor2,
                            borderRadius: (mobileW * 5) / 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: (mobileW * 3.5) / 100,
                              fontFamily: Font.FontMedium,
                              color: Colors.whiteColor,
                            }}>
                            {t('ok_txt')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>

                {/* ------ pet modal ----- */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isPetModal}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsPetModal(false);
                    }}
                    activeOpacity={1}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#4C656180',
                    }}>
                    <KeyboardAvoidingView
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                      keyboardVerticalOffset={(mobileW * 1) / 100}>
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.FontSemibold,
                          fontSize: (mobileW * 6.5) / 100,
                          marginLeft: (mobileW * 3) / 100,
                        }}>{`Jojo`}</Text>

                      <View
                        style={{
                          width: (mobileW * 90) / 100,
                          height: (mobileW * 70) / 100,
                          // backgroundColor: 'blue',
                          borderRadius: (mobileW * 7) / 100,
                          overflow: 'hidden',
                        }}>
                        <Image
                          source={require('../Icons/dog_glass.png')}
                          style={{
                            width: (mobileW * 90) / 100,
                            height: (mobileW * 70) / 100,
                            // backgroundColor: 'blue',

                            borderRadius: (mobileW * 5) / 100,
                          }}
                          // resizeMode="contain"
                        />
                      </View>

                      <View>
                        <InputField
                          placeholderText={t('write_a_message_txt')}
                          keyboardType={'default'}
                        />
                        <CommonButton
                          title={t('send_txt')}
                          containerStyle={{
                            backgroundColor: Colors.themeColor2,
                            marginTop: (mobileW * 3) / 100,
                          }}
                          onPress={() => {
                            setIsPetModal(false);
                            setTimeout(() => {
                              navigation.navigate('MatchChat');
                            }, 200);
                          }}
                        />

                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => setIsPetModal(false)}>
                          <Text
                            style={{
                              color: Colors.whiteColor,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 4) / 100,
                              alignSelf: 'center',
                              marginTop: (mobileW * 3) / 100,
                            }}>
                            {t('cancel_txt')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </KeyboardAvoidingView>
                  </TouchableOpacity>
                </Modal>

                {/* --unmatch */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isUmatchModal}
                  requestClose={() => {
                    setIsUmatchModal(false);
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsUmatchModal(false);
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
                        backgroundColor: Colors.whiteColor,
                        paddingHorizontal: (mobileW * 3) / 100,
                        width: (mobileW * 90) / 100,
                        borderRadius: (mobileW * 5) / 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: (mobileW * 6) / 100,
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setIsUmatchModal(false)}
                        style={{alignSelf: 'flex-end'}}>
                        <Image
                          source={localimag.icon_cross}
                          style={{
                            width: (mobileW * 5) / 100,
                            height: (mobileW * 5) / 100,

                            marginTop: (mobileW * 2) / 100,
                            marginLeft: (mobileW * 3) / 100,
                          }}
                        />
                      </TouchableOpacity>
                      <Image
                        source={localimag.icon_unmatch_pop_up}
                        style={{
                          width: (mobileW * 50) / 100,
                          height: (mobileW * 50) / 100,
                        }}
                      />

                      <Text
                        style={{
                          color: Colors.themeColor,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 6) / 100,
                        }}>
                        {t('are_you_sure_txt')}
                      </Text>

                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 3.5) / 100,
                          paddingHorizontal: (mobileW * 6) / 100,
                          textAlign: 'center',
                        }}>
                        {t('unmatch_description_txt')} {data?.name}
                      </Text>

                      <CommonButton
                        containerStyle={{
                          width: (mobileW * 40) / 100,
                          backgroundColor: Colors.themeColor2,
                          borderRadius: (mobileW * 3) / 100,
                          marginTop: (mobileW * 3) / 100,
                        }}
                        title={t('unmatch_txt')}
                        onPress={() => {
                          setIsUmatchModal(false);
                          setUnmatchReasonPopup(true);
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>

                {/* unmatch reason modal */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={unmatchReasonPopup}
                  requestClose={() => {
                    setUnmatchReasonPopup(false);
                    // setSelectUnmatchReason(0);
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setUnmatchReasonPopup(false);
                      setSelectUnmatchReason(0);
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
                        backgroundColor: Colors.whiteColor,
                        position: 'absolute',
                        bottom: 0,
                        borderTopEndRadius: (mobileW * 3) / 100,
                        borderTopLeftRadius: (mobileW * 3) / 100,
                      }}>
                      <View
                        style={{
                          backgroundColor: Colors.themeColor,
                          height: (mobileH * 7) / 100,
                          width: mobileW,
                          paddingHorizontal: (mobileW * 3) / 100,
                          borderTopEndRadius: (mobileW * 3) / 100,
                          borderTopLeftRadius: (mobileW * 3) / 100,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                          <Text
                            style={{
                              color: Colors.whiteColor,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 6) / 100,
                              textAlign: 'center', // Ensure text is centered
                            }}>
                            {t('unmatch_txt')}
                          </Text>
                        </View>

                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            setUnmatchReasonPopup(false);
                            setSelectUnmatchReason(0);
                          }}>
                          <Image
                            source={localimag.icon_cross}
                            style={[
                              {
                                width: (mobileW * 5) / 100,
                                height: (mobileW * 5) / 100,
                              },
                              {tintColor: Colors.whiteColor},
                            ]}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={{backgroundColor: Colors.whiteColor}}>
                        <View
                          style={{
                            // alignItems: 'center',
                            // justifyContent: 'center',
                            marginTop: (mobileW * 4) / 100,
                            marginHorizontal: (mobileW * 5) / 100,
                            // backgroundColor: 'blue'
                          }}>
                          <Text
                            style={{
                              color: Colors.placeholderTextColor,
                              fontFamily: Font.FontRegular,
                              fontSize: (mobileW * 4) / 100,
                            }}>
                            {t('your_reason_is_private_txt')}
                          </Text>
                        </View>

                        <FlatList
                          data={UNMATCH_REASON}
                          style={{marginTop: (mobileW * 2) / 100}}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({item, index}) => (
                            <View
                              style={{
                                marginLeft: (mobileW * 6) / 100,
                                marginTop: (mobileW * 1) / 100,
                              }}>
                              <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                  setSelectUnmatchReason(index);
                                  setUnmatchReason_txt(
                                    item?.reason[config.language],
                                  );
                                }}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  alignSelf: 'flex-start',
                                }}>
                                <Image
                                  source={
                                    selectUnmatchReason === index
                                      ? localimag.icon_filled_checkbox_theme1
                                      : localimag.icon_empty_radio
                                  }
                                  style={{
                                    width: (mobileW * 5) / 100,
                                    height: (mobileW * 5) / 100,
                                  }}
                                />
                                <Text
                                  style={{
                                    color: Colors.themeColor2,
                                    fontFamily: Font.FontMedium,
                                    fontSize: (mobileW * 3.5) / 100,
                                    marginLeft: (mobileW * 2) / 100,
                                  }}>
                                  {item?.reason[config.language]}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        />

                        <CommonButton
                          title={t('ok_txt')}
                          containerStyle={{
                            backgroundColor: Colors.themeColor2,
                            marginVertical: (mobileW * 5) / 100,
                            width: (mobileW * 70) / 100,
                          }}
                          onPress={unMatch}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </KeyboardAwareScrollView>
            </>
          )}
        </>

        {/* Match Modal */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isWoofYesModal}
          requestClose={() => {
            setIsWoofYesModal(false);
          }}>
          <TouchableOpacity
            onPress={() => {
              setIsWoofYesModal(false);
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
                backgroundColor: Colors.whiteColor,
                paddingHorizontal: (mobileW * 3) / 100,
                width: (mobileW * 85) / 100,
                borderRadius: (mobileW * 5) / 100,
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: (mobileW * 6) / 100,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsWoofYesModal(false)}
                style={{alignSelf: 'flex-end'}}>
                <Image
                  source={localimag.icon_cross}
                  style={{
                    width: (mobileW * 5) / 100,
                    height: (mobileW * 5) / 100,

                    marginTop: (mobileW * 2) / 100,
                    marginLeft: (mobileW * 3) / 100,
                  }}
                />
              </TouchableOpacity>

              <Text
                style={{
                  color: Colors.themeColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 6) / 100,
                }}>
                {t('are_you_sure_txt')}
              </Text>

              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3.5) / 100,
                  paddingHorizontal: (mobileW * 6) / 100,
                  textAlign: 'center',
                }}>
                {t('you_want_to_match_with_txt')} {data?.name}
              </Text>

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  likeUserProfile(data?.user_id);
                }}
                style={{
                  width: (mobileW * 38) / 100,
                  height: (mobileH * 5.5) / 100,
                  borderRadius: (mobileW * 30) / 100,
                  backgroundColor: Colors.WoofYesBtn,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.29,
                  shadowRadius: 5.65,
                  elevation: 7,
                  marginTop: (mobileW * 4) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontSize: (mobileW * 3.8) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {t('woof_yes_txt')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const Indicator = ({slides, slideIndex}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        position: 'absolute',
        top: (mobileH * 1) / 100,
        left: (mobileW * 3) / 100,
      }}>
      {slides.map((_, index) => (
        <View
          key={index.toString()}
          style={{
            height: (mobileW * 0.7) / 100,
            width: (mobileW * 10) / 100,
            borderRadius: (mobileW * 1) / 100,
            backgroundColor:
              slideIndex == index ? Colors.ColorPremiumBox : '#a7a39c',
            //backgroundColor: Colors.ColorPremiumBox,
            marginHorizontal: (mobileW * 0.8) / 100,
          }}
        />
      ))}
    </View>
  );
};

export default WishingPetParentUserDetails;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.themeColor2,
  },
});
