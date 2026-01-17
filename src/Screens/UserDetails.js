import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import CommonModal from '../Components/CommonModal';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {t} from 'i18next';
import * as Progress from 'react-native-progress';
import BannerCarousel from 'react-native-banner-carousel';
import Svg, {G, Line} from 'react-native-svg';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import {addDoc, collection, doc, serverTimestamp} from 'firebase/firestore';
import {fireStoreDB} from '../Config/firebaseConfig';
import {SafeAreaView} from 'react-native-safe-area-context';

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

const UserDetails = ({navigation}) => {
  const [isPopUpMenu, setIsPopUpMenu] = useState(false);
  const [shareProfilePopUp, setShareProfilePopUp] = useState(false);
  const [reportProfilePopUp, setReportProfilePopUp] = useState(false);
  const [reportReason, setReportReason] = useState(0);
  const [reportReason_txt, setReportReason_txt] = useState('');
  const [reportThanksModal, setReportThanksModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [blockedSuccessfully, setBlockedSuccessfully] = useState(false);

  const [bestMemoWithDuskyLike1, setBestMemoWithDuskyLike1] = useState(false);
  const [bestMemoWithDuskyLike2, setBestMemoWithDuskyLike2] = useState(true);
  const [favToyLike, setFavToyLike] = useState(false);

  const videoPlayerRef = useRef(null);
  const [isPlayingArray, setIsPlayingArray] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [isVideoLoadedArray, setIsVideoLoadedArray] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const togglePlayPause = index => {
    setIsPlayingArray(prev => {
      // pause all other videos except this one
      const newArray = prev.map((item, i) => (i === index ? !item : false));
      return newArray;
    });
  };

  const setVideoLoaded = (index, loaded) => {
    setIsVideoLoadedArray(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const newArray = [...safePrev];
      newArray[index] = loaded;
      return newArray;
    });
  };

  const handleVideoEnd = index => {
    setIsPlayingArray(prev => {
      const newArray = [...prev];
      newArray[index] = false;
      return newArray;
    });
  };

  const [message, setMessage] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [data, setData] = useState(null);

  const {params} = useRoute();

  const [showData, setShowData] = useState(false);

  const [slideIndex, setSlideIndex] = useState(0);

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

  const [dogDetails, setDogDetails] = useState([
    {
      id: 0,
      name: 'Female',
    },
    {
      id: 1,
      name: 'Fully Vaccinated',
    },
    {
      id: 2,
      name: 'Maltese',
    },
    {
      id: 2,
      name: 'Friendship',
    },
  ]);

  const [dogActivity, setDogActivity] = useState([
    {
      id: 1,
      image: require('../Icons/friendlinessimage.png'),
      activity: 'Friendliness',
    },
    {
      id: 2,
      image: require('../Icons/activeimage.png'),
      activity: 'Active',
    },
    {
      id: 1,
      image: require('../Icons/activeimage.png'),
      activity: 'Love Seeker',
    },
  ]);

  const [unmatchReason, setUnmatchReason] = useState([
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

  const [isPetModal, setIsPetModal] = useState(false);
  const [isUmatchModal, setIsUmatchModal] = useState(false);

  const [unmatchReasonPopup, setUnmatchReasonPopup] = useState(false);
  const [selectUnmatchReason, setSelectUnmatchReason] = useState(0);
  const [isWoofYesModal, setIsWoofYesModal] = useState(false);
  const [createMatchImage, setcreateMatchImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [user_profile, setUser_profile] = useState(null);
  const [user_name, setUser_name] = useState(null);

  const [unmatchReason_txt, setUnmatchReason_txt] = useState('');

  const [isProfileApprovalModal, setIsProfileApprovalModal] = useState(false);
  const [isUserApproved, setIsUserApproved] = useState(false);

  const {navigate} = useNavigation();

  consolepro.consolelog('User ID ======>>', userId);
  consolepro.consolelog('other user id ======>>', data?.user_id);

  const getUserDetails = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;
      setUserId(userId);
      setUser_name(user_array?.name);
      setUser_profile(user_array?.user_images[0]);
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

  const onScroll = event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / slideSize);
    setSlideIndex(index);
  };

  useEffect(() => {
    getUserDetails();
  }, []);

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

  const sortedIds = [userId, data?.user_id].sort();
  const chatId = sortedIds.join('_');
  const chatRef = doc(fireStoreDB, 'chats', chatId);

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
      data.append('pet_image_id', createMatchImage?.pet_image_id);

      consolepro.consolelog(data, '<<Data');

      // return false;

      const API_URL = config.baseURL + 'create_match';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            setIsPetModal(false);
            handleSendReply();
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

  const handleSendReply = async (type = 0, url = '', isMatch = true) => {
    if (type === 0 && !message) return;

    try {
      const messagesRef = collection(chatRef, 'messages');

      const profilePic = user_profile
        ? user_profile?.type === 2
          ? user_profile?.thumbnail || ''
          : user_profile?.image || ''
        : '';

      const matchUrl = createMatchImage
        ? createMatchImage?.type === 2
          ? createMatchImage?.thumbnail || ''
          : createMatchImage?.image || ''
        : '';

      const messageData = {
        senderId: userId || '',
        senderName: user_name || '',
        profilePic,
        timeStamp: serverTimestamp(),
        type: Number(type),
        match_message: type === 0 ? message : '',
        image_url: '',
        voice_url: '',
        isMatch,
        match_url: matchUrl,
        story_url: '',
        isStory: false,
        isRead: false,
      };

      consolepro.consolelog('Message Data ======>>', messageData);

      await addDoc(messagesRef, messageData);

      setMessage(null);
      Keyboard.dismiss();

      setTimeout(() => {
        navigation.replace('FriendshipHome');
      }, 700);
    } catch (error) {
      console.error('Error sending message:', error);
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

  const getPetImageSource = () => {
    if (!data?.pet_images || data?.pet_images.length == 0) return null;

    for (let i = data?.pet_images.length - 1; i >= 0; i--) {
      const pet = data?.pet_images[i];
      if (pet) {
        if (pet?.type === 2 && pet?.thumbnail) {
          return {uri: config?.img_url + pet?.thumbnail};
        } else if (pet?.image) {
          return {uri: config.img_url + pet?.image};
        }
      }
    }
    return null;
  };

  const isVideoWithThumbnail = () => {
    if (!data?.pet_images || data?.pet_images?.length == 0) return false;

    for (let i = data?.pet_images?.length - 1; i >= 0; i--) {
      const pet = data?.pet_images[i];
      if (pet && pet?.type === 2 && pet?.thumbnail) {
        return true;
      }
    }
    return false;
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
                t('information_txt'),
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

  consolepro.consolelog('Like Status =====>>', data?.like_status);

  const radius = 12;
  const strokeWidth = 2;
  const size = radius * 2 + 5;
  const center = size / 2;
  const angleStep = 360 / 60;

  let totalSegments = 60;
  let progress = 70;

  const getSegmentColor = index => {
    const activeSegments = Math.round((progress / 100) * totalSegments);
    if (index >= activeSegments) return '#2b2b2b';

    // Gradient logic: yellow to green
    const ratio = index / totalSegments;
    if (ratio < 0.25) return '#019686';
    if (ratio < 0.5) return '#019686';
    return '#019686';
  };

  const segments = Array.from({length: totalSegments}).map((_, i) => {
    const angle = angleStep * i - 90;
    const rad = (angle * Math.PI) / 180;
    const x1 = center + (radius - strokeWidth) * Math.cos(rad);
    const y1 = center + (radius - strokeWidth) * Math.sin(rad);
    const x2 = center + radius * Math.cos(rad);
    const y2 = center + radius * Math.sin(rad);

    return (
      <Line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={getSegmentColor(i)}
        strokeWidth={0.99}
        strokeLinecap="round"
      />
    );
  });

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

  consolepro.consolelog('Match Message ======>>', data?.match_message);
  consolepro.consolelog('create match image  ======>>', createMatchImage);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainView}>
        <>
          {/* --------- header ------- */}
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
                navigation.goBack();
              }}
              style={{
                alignSelf: 'flex-start',
                width: (mobileW * 10) / 100,
                height: (mobileW * 10) / 100,
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
                  paddingHorizontal: (mobileW * 2) / 100,
                  paddingVertical: (mobileW * 1) / 100,
                  borderRadius: (mobileW * 30) / 100,
                  backgroundColor: '#97958a',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // alignSelf: 'flex-end',
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
                onPress={() => setIsPopUpMenu(true)}>
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

          {showData && (
            <>
              {/* {data?.match_status ? ( */}

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={!isUserApproved}
                onPress={() => dislikeUserProfile(data?.user_id)}
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

              {/* ) : data?.like_status ? ( */}
              {/* <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsWoofYesModal(true)}
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
            </TouchableOpacity> */}
              {/* ) : (
              <View></View>
            )} */}

              <KeyboardAwareScrollView
                showsHorizontalScrollIndicator={false}
                scrollEnabled={true}
                contentContainerStyle={{
                  paddingBottom: (mobileH * 20) / 100,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                {/* {data?.match_message != 'NA' && (
                <View style={{ paddingHorizontal: (mobileW * 5) / 100 }}>
                  <Text
                    style={{
                      color: '#EBA62C',
                      fontFamily: Font.FontSemibold,
                      fontSize: (mobileW * 4) / 100,
                    }}>
                    {data?.match_message}
                  </Text>
                </View>
              )} */}

                <View
                  style={{
                    backgroundColor: Colors.themeColor,
                    width: (mobileW * 90) / 100,
                    height: (mobileW * 0.2) / 100,
                    alignSelf: 'center',
                    marginTop: (mobileW * 2) / 100,
                  }}></View>

                {/* Message UI */}

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

                {/* ----- profile ------ */}
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

                    <View
                      style={{
                        alignSelf: 'flex-start',
                        borderRadius: (mobileW * 5) / 100,
                        overflow: 'hidden',
                        position: 'absolute',
                        right: 0,
                      }}>
                      <Image
                        source={{
                          uri: config.img_url + data?.pet_images[0]?.image,
                        }}
                        style={{
                          width: (mobileW * 5) / 100,
                          height: (mobileW * 5) / 100,
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

                    {data?.community_id != 'NA' && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          navigate('JoinCommunity', {
                            community_id: data?.community_id,
                          });
                        }}
                        style={{
                          backgroundColor: '#EBA62C',
                          padding: (mobileW * 2) / 100,
                          borderRadius: (mobileW * 50) / 100,
                        }}>
                        <Image
                          source={localimag.icon_community}
                          style={{
                            width: (mobileW * 7) / 100,
                            height: (mobileW * 7) / 100,
                          }}
                          tintColor={Colors.whiteColor}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View
                  style={{alignSelf: 'center', marginTop: (mobileW * 5) / 100}}>
                  <View
                    style={{
                      width: (mobileW * 90) / 100,
                      height: (mobileH * 30) / 100,
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
                                  paddingHorizontal: (mobileW * 2) / 100,
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
                </View>

                {/* ------ dog details --------- */}
                <View
                  style={{
                    marginHorizontal: (mobileW * 5) / 100,
                    marginTop: (mobileW * 3) / 100,
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      // navigate('VideoPreview', {
                      //   uri: config.img_url + data?.pet_images[0]?.image,
                      //   type: data?.pet_images[0]?.type == 2 ? 1 : 0,
                      // });
                    }}
                    style={{
                      borderRadius: (mobileW * 5) / 100,
                      overflow: 'hidden',
                    }}>
                    <View
                      style={{
                        position: 'relative',
                        width: (mobileW * 50) / 100,
                        height: (mobileW * 50) / 100,
                        borderRadius: (mobileW * 5) / 100,
                        overflow: 'hidden',
                        backgroundColor: Colors.whiteColor,
                        marginBottom: (mobileW * 3) / 100,
                      }}>
                      {data?.pet_images[0].type == 2 ? (
                        <>
                          <VideoPlayer
                            source={{
                              uri: config.img_url + data?.pet_images[0]?.image,
                            }}
                            ignoreSilentSwitch="ignore"
                            disableVolume={true}
                            disableBack={true}
                            disableFullscreen={true}
                            disableSeekbar={true}
                            disableTimer={true}
                            disablePlayPause={true}
                            resizeMode="cover"
                            onLoad={() => setVideoLoaded(0, true)}
                            onEnd={() => handleVideoEnd(0)}
                            paused={!isPlayingArray[0]}
                            style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: Colors.whiteColor,
                            }}
                          />

                          {isVideoLoadedArray[0] && (
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => togglePlayPause(0)}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 10,
                              }}>
                              <Image
                                style={{
                                  width: (mobileW * 6) / 100,
                                  height: (mobileW * 6) / 100,
                                }}
                                source={
                                  isPlayingArray[0]
                                    ? localimag.icon_pause
                                    : localimag.icon_play_icon
                                }
                              />
                            </TouchableOpacity>
                          )}
                        </>
                      ) : (
                        <Image
                          source={{
                            uri: config.img_url + data?.pet_images[0].image,
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: (mobileW * 1) / 100,
                          }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>

                  <View style={{marginLeft: (mobileW * 5) / 100}}>
                    <Text
                      style={{
                        color: Colors.whiteColor,
                        fontFamily: Font.FontSemibold,
                        fontSize: (mobileW * 8) / 100,
                      }}>
                      {data?.pet_name}
                    </Text>

                    <Text
                      style={{
                        color: Colors.whiteColor,
                        fontFamily: Font.FontLight,
                        fontSize: (mobileW * 3) / 100,
                      }}>{`${data?.age_range} Years Old`}</Text>
                  </View>
                </View>

                {/* Activity indicator */}

                <View
                  style={{
                    flex: 1,
                    marginTop: (mobileW * 2) / 100,
                    paddingHorizontal: (mobileW * 3) / 100,
                  }}>
                  <FlatList
                    data={data?.behaviors ? Object.entries(data.behaviors) : []}
                    keyExtractor={(_, index) => index.toString()}
                    numColumns={3}
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      gap: (mobileW * 1) / 100,
                    }}
                    renderItem={({item, index}) => {
                      const [key, value] = item;
                      const progress = value; // This is your progress percentage

                      const radius = 15;
                      const strokeWidth = 3;
                      const size = radius * 2 + 5;
                      const center = size / 2;
                      const totalSegments = 60;
                      const angleStep = 360 / totalSegments;

                      const getSegmentColor = index => {
                        const activeSegments = Math.round(
                          (progress / 100) * totalSegments,
                        );
                        if (index >= activeSegments) return '#ffffff';

                        const ratio = index / totalSegments;
                        if (ratio < 0.25) return '#019686';
                        if (ratio < 0.5) return '#019686';
                        return '#019686';
                      };

                      const segments = Array.from({length: totalSegments}).map(
                        (_, i) => {
                          const angle = angleStep * i - 90;
                          const rad = (angle * Math.PI) / 180;
                          const x1 =
                            center + (radius - strokeWidth) * Math.cos(rad);
                          const y1 =
                            center + (radius - strokeWidth) * Math.sin(rad);
                          const x2 = center + radius * Math.cos(rad);
                          const y2 = center + radius * Math.sin(rad);

                          return (
                            <Line
                              key={i}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke={getSegmentColor(i)}
                              strokeWidth={0.99}
                              strokeLinecap="round"
                            />
                          );
                        },
                      );

                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: (mobileW * 2) / 100,
                            width: (mobileW * 30) / 100,
                            flexWrap: 'wrap',
                            // backgroundColor: 'red',
                          }}>
                          <Svg width={size} height={size}>
                            <G>{segments}</G>
                          </Svg>
                          <Text
                            numberOfLines={2}
                            style={{
                              color: Colors.whiteColor,
                              fontFamily: Font.FontLight,
                              fontSize: (mobileW * 3.5) / 100,
                              marginLeft: (mobileW * 1) / 100,
                              flexShrink: 1,
                              flex: 1,
                              textAlign: 'left',
                            }}>
                            {key.replace('_', ' ')}
                          </Text>
                        </View>
                      );
                    }}
                  />
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
                    paddingHorizontal: (mobileW * 3) / 100,
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

                {/* -------- best memory ------ */}
                <View
                  style={{
                    marginHorizontal: (mobileW * 7) / 100,
                    marginTop: (mobileH * 4) / 100,
                  }}>
                  {data?.answers['answer_1'] != 'null' && (
                    <>
                      <View>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 5) / 100,
                          }}>{`${t('bestMemorywith_txt')} ${
                          data?.pet_name
                        }?`}</Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: Colors.themeColor,
                          width: (mobileW * 35) / 100,
                          height: (mobileW * 0.1) / 100,
                          alignSelf: 'flex-end',
                          marginTop: (mobileW * 1) / 100,
                        }}></View>

                      <View style={{marginTop: (mobileW * 3) / 100}}>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontFamily: Font.FontLight,
                            fontSize: (mobileW * 3.5) / 100,
                          }}>
                          {data?.answers['answer_1']}
                        </Text>
                      </View>
                    </>
                  )}

                  {/* ------dog image container ------- */}
                  {data?.pet_images?.[1] && (
                    <View
                      style={{
                        width: (mobileW * 85) / 100,
                        height: (mobileW * 70) / 100,
                        marginTop: (mobileW * 5) / 100,
                        overflow: 'hidden',
                        borderRadius: (mobileW * 5) / 100,
                        backgroundColor: Colors.black,
                      }}>
                      {data?.pet_images[1].type == 2 ? (
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => togglePlayPause(1)}
                          style={{flex: 1}}>
                          <VideoPlayer
                            // ref={videoPlayerRef}
                            source={{
                              uri: config.img_url + data?.pet_images[1].image,
                            }}
                            paused={!isPlayingArray[1]}
                            ignoreSilentSwitch="ignore"
                            disableVolume={true}
                            disableBack={true}
                            disableFullscreen={true}
                            disableSeekbar={true}
                            disableTimer={true}
                            disablePlayPause={true}
                            resizeMode="cover"
                            onLoad={() => setVideoLoaded(1, true)}
                            onEnd={() => {
                              setIsPlayingArray(prev => {
                                const newArray = [...prev];
                                newArray[1] = false;
                                return newArray;
                              });
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: (mobileW * 5) / 100,
                              backgroundColor: Colors.black,
                            }}
                          />

                          {isVideoLoadedArray[1] && (
                            <View
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 10,
                              }}>
                              <Image
                                source={
                                  isPlayingArray[1]
                                    ? localimag.icon_pause
                                    : localimag.icon_play_icon
                                }
                                style={{
                                  width: (mobileW * 10) / 100,
                                  height: (mobileW * 10) / 100,
                                  opacity: 0.8,
                                }}
                              />
                            </View>
                          )}
                        </TouchableOpacity>
                      ) : (
                        <Image
                          source={{
                            uri: config.img_url + data.pet_images[1].image,
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: (mobileW * 5) / 100,
                            resizeMode: 'cover',
                          }}
                        />
                      )}

                      {/* Like Button (common for both image & video) */}
                      <TouchableOpacity
                        onPress={() => {
                          setcreateMatchImage(data.pet_images[1]);
                          setIsPetModal(true);
                        }}
                        disabled={!isUserApproved}
                        activeOpacity={0.8}
                        style={{
                          position: 'absolute',
                          bottom: (mobileW * 5) / 100,
                          right: (mobileW * 3) / 100,
                          backgroundColor: Colors.WoofYesBtn,
                          borderRadius: (mobileW * 30) / 100,
                          padding: (mobileW * 1) / 100,
                          zIndex: 20,
                        }}>
                        <Image
                          source={localimag.icon_hand_like}
                          style={{
                            width: (mobileW * 8) / 100,
                            height: (mobileW * 8) / 100,
                          }}
                          tintColor={Colors.whiteColor}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  {data?.pet_images?.[2] && (
                    <View
                      style={{
                        width: (mobileW * 85) / 100,
                        height: (mobileW * 70) / 100,
                        marginTop: (mobileW * 7) / 100,
                        borderRadius: (mobileW * 5) / 100,
                        overflow: 'hidden',
                        backgroundColor: Colors.black,
                      }}>
                      {data.pet_images[2].type === 2 ? (
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => togglePlayPause(2)} // 👈 Controlled externally
                          style={{flex: 1}}>
                          <VideoPlayer
                            ref={videoPlayerRef}
                            source={{
                              uri: config.img_url + data.pet_images[2].image,
                            }}
                            paused={!isPlayingArray[2]}
                            ignoreSilentSwitch="ignore"
                            disableVolume
                            disableBack
                            disableFullscreen
                            disableSeekbar
                            disableTimer
                            disablePlayPause
                            resizeMode="cover"
                            onLoad={() => setVideoLoaded(2, true)}
                            onEnd={() =>
                              setIsPlayingArray(prev => {
                                const newArr = [...prev];
                                newArr[2] = false;
                                return newArr;
                              })
                            }
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: (mobileW * 5) / 100,
                              backgroundColor: Colors.black,
                            }}
                          />

                          {isVideoLoadedArray[2] && (
                            <View
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 10,
                              }}>
                              <Image
                                source={
                                  isPlayingArray[2]
                                    ? localimag.icon_pause
                                    : localimag.icon_play_icon
                                }
                                style={{
                                  width: (mobileW * 10) / 100,
                                  height: (mobileW * 10) / 100,
                                  opacity: 0.8,
                                }}
                              />
                            </View>
                          )}
                        </TouchableOpacity>
                      ) : (
                        <Image
                          source={{
                            uri: config.img_url + data.pet_images[2].image,
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: (mobileW * 5) / 100,
                            resizeMode: 'cover',
                          }}
                        />
                      )}

                      {/* Like Button */}
                      <TouchableOpacity
                        onPress={() => {
                          setcreateMatchImage(data.pet_images[2]);
                          setIsPetModal(true);
                        }}
                        disabled={!isUserApproved}
                        activeOpacity={0.8}
                        style={{
                          position: 'absolute',
                          bottom: (mobileW * 5) / 100,
                          right: (mobileW * 3) / 100,
                          backgroundColor: Colors.WoofYesBtn,
                          borderRadius: (mobileW * 30) / 100,
                          padding: (mobileW * 1) / 100,
                          zIndex: 20,
                        }}>
                        <Image
                          source={localimag.icon_hand_like}
                          style={{
                            width: (mobileW * 8) / 100,
                            height: (mobileW * 8) / 100,
                          }}
                          tintColor={Colors.whiteColor}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Activities does pet enjoy */}

                  {data?.answers['answer_2'] != 'null' && (
                    <>
                      <View
                        style={{
                          marginTop: (mobileW * 5) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 5) / 100,
                          }}>{`${t('whatActivitiesDoesPetEnjoy_txt')} ${
                          data?.pet_name
                        }${t('enjoyTheMost_txt')}`}</Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: Colors.themeColor,
                          width: (mobileW * 35) / 100,
                          height: (mobileW * 0.1) / 100,
                          alignSelf: 'flex-end',
                          marginTop: (mobileW * 1) / 100,
                        }}></View>

                      <View style={{marginTop: (mobileW * 3) / 100}}>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontFamily: Font.FontLight,
                            fontSize: (mobileW * 3.5) / 100,
                          }}>
                          {data?.answers['answer_2']}
                        </Text>
                      </View>
                    </>
                  )}

                  {/* --------favorite toy or treat ------- */}

                  {data?.answers['answer_3'] != 'null' && (
                    <>
                      <View
                        style={{
                          marginTop: (mobileW * 5) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 5) / 100,
                          }}>{`Favorite Toy Or Treat?`}</Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: Colors.themeColor,
                          width: (mobileW * 35) / 100,
                          height: (mobileW * 0.1) / 100,
                          alignSelf: 'flex-end',
                          marginTop: (mobileW * 1) / 100,
                        }}></View>

                      <View style={{marginTop: (mobileW * 3) / 100}}>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontFamily: Font.FontLight,
                            fontSize: (mobileW * 3.5) / 100,
                          }}>
                          {data?.answers['answer_3']}
                        </Text>
                      </View>

                      {data?.pet_images?.[3] && (
                        <View
                          style={{
                            width: (mobileW * 85) / 100,
                            height: (mobileW * 70) / 100,
                            marginTop: (mobileW * 5) / 100,
                            borderRadius: (mobileW * 5) / 100,
                            overflow: 'hidden',
                            backgroundColor: Colors.black,
                          }}>
                          {data.pet_images[3].type === 2 ? (
                            <TouchableOpacity
                              activeOpacity={1}
                              onPress={() => togglePlayPause(3)}
                              style={{flex: 1}}>
                              <VideoPlayer
                                source={{
                                  uri:
                                    config.img_url + data.pet_images[3].image,
                                }}
                                paused={!isPlayingArray[3]}
                                ignoreSilentSwitch="ignore"
                                disableVolume
                                disableBack
                                disableFullscreen
                                disableSeekbar
                                disableTimer
                                disablePlayPause
                                resizeMode="cover"
                                onLoad={() => setVideoLoaded(3, true)}
                                onEnd={() =>
                                  setIsPlayingArray(prev => {
                                    const newArr = [...prev];
                                    newArr[3] = false;
                                    return newArr;
                                  })
                                }
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: (mobileW * 5) / 100,
                                  backgroundColor: Colors.black,
                                }}
                              />

                              {isVideoLoadedArray[3] && (
                                <View
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 10,
                                  }}>
                                  <Image
                                    source={
                                      isPlayingArray[3]
                                        ? localimag.icon_pause
                                        : localimag.icon_play_icon
                                    }
                                    style={{
                                      width: (mobileW * 10) / 100,
                                      height: (mobileW * 10) / 100,
                                      opacity: 0.8,
                                    }}
                                  />
                                </View>
                              )}
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => {
                                // Navigate to preview on image press
                                const imageUri =
                                  config.img_url + data.pet_images[3].image;
                                // navigate('VideoPreview', {
                                //   uri: imageUri,
                                //   type: 0,
                                // });
                              }}
                              style={{flex: 1}}>
                              <Image
                                source={{
                                  uri:
                                    config.img_url + data.pet_images[3].image,
                                }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: (mobileW * 5) / 100,
                                  resizeMode: 'cover',
                                }}
                              />
                            </TouchableOpacity>
                          )}

                          {/* Like Button */}
                          <TouchableOpacity
                            onPress={() => {
                              setcreateMatchImage(data.pet_images[3]);
                              setIsPetModal(true);
                            }}
                            disabled={!isUserApproved}
                            activeOpacity={0.8}
                            style={{
                              position: 'absolute',
                              bottom: (mobileW * 5) / 100,
                              right: (mobileW * 3) / 100,
                              backgroundColor: Colors.WoofYesBtn,
                              borderRadius: (mobileW * 30) / 100,
                              padding: (mobileW * 1) / 100,
                              zIndex: 20,
                            }}>
                            <Image
                              source={localimag.icon_hand_like}
                              style={{
                                width: (mobileW * 8) / 100,
                                height: (mobileW * 8) / 100,
                              }}
                              tintColor={Colors.whiteColor}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}

                  {/* quirky habits */}

                  {data?.answers['answer_4'] != 'null' && (
                    <>
                      <View
                        style={{
                          marginTop: (mobileW * 5) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 5) / 100,
                          }}>{`${t('whatsOneQuirkyHabitYourPetHas_txt')} ${
                          data?.pet_name
                        } ${t('has_txt')}?`}</Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: Colors.themeColor,
                          width: (mobileW * 35) / 100,
                          height: (mobileW * 0.1) / 100,
                          alignSelf: 'flex-end',
                          marginTop: (mobileW * 1) / 100,
                        }}></View>

                      <View style={{marginTop: (mobileW * 3) / 100}}>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontFamily: Font.FontLight,
                            fontSize: (mobileW * 3.5) / 100,
                          }}>
                          {data?.answers['answer_4']}
                        </Text>
                      </View>

                      {data?.pet_images?.[0] && (
                        <View
                          style={{
                            width: (mobileW * 85) / 100,
                            height: (mobileW * 70) / 100,
                            marginTop: (mobileW * 5) / 100,
                            borderRadius: (mobileW * 5) / 100,
                            overflow: 'hidden',
                            backgroundColor: Colors.black,
                          }}>
                          {data.pet_images[0].type === 2 ? (
                            <TouchableOpacity
                              activeOpacity={1}
                              onPress={() => togglePlayPause(4)}
                              style={{flex: 1}}>
                              <VideoPlayer
                                source={{
                                  uri:
                                    config.img_url + data.pet_images[0].image,
                                }}
                                paused={!isPlayingArray[4]}
                                ignoreSilentSwitch="ignore"
                                disableVolume
                                disableBack
                                disableFullscreen
                                disableSeekbar
                                disableTimer
                                disablePlayPause
                                resizeMode="cover"
                                onLoad={() => setVideoLoaded(4, true)}
                                onEnd={() =>
                                  setIsPlayingArray(prev => {
                                    const newArr = [...prev];
                                    newArr[4] = false;
                                    return newArr;
                                  })
                                }
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: (mobileW * 5) / 100,
                                  backgroundColor: Colors.black,
                                }}
                              />

                              {isVideoLoadedArray[4] && (
                                <View
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 10,
                                  }}>
                                  <Image
                                    source={
                                      isPlayingArray[4]
                                        ? localimag.icon_pause
                                        : localimag.icon_play_icon
                                    }
                                    style={{
                                      width: (mobileW * 10) / 100,
                                      height: (mobileW * 10) / 100,
                                      opacity: 0.8,
                                    }}
                                  />
                                </View>
                              )}
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              activeOpacity={1}
                              // onPress={() => {
                              //   // Navigate to preview on image press
                              //   const imageUri =
                              //     config.img_url + data.pet_images[0].image;
                              //   navigate('VideoPreview', {
                              //     uri: imageUri,
                              //     type: 0,
                              //   });
                              // }}
                              style={{flex: 1}}>
                              <Image
                                source={{
                                  uri:
                                    config.img_url + data.pet_images[0].image,
                                }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: (mobileW * 5) / 100,
                                  resizeMode: 'cover',
                                }}
                              />
                            </TouchableOpacity>
                          )}

                          {/* Like Button */}
                          <TouchableOpacity
                            onPress={() => {
                              setcreateMatchImage(data.pet_images[0]);
                              setIsPetModal(true);
                            }}
                            disabled={!isUserApproved}
                            activeOpacity={0.8}
                            style={{
                              position: 'absolute',
                              bottom: (mobileW * 5) / 100,
                              right: (mobileW * 3) / 100,
                              backgroundColor: Colors.WoofYesBtn,
                              borderRadius: (mobileW * 30) / 100,
                              padding: (mobileW * 1) / 100,
                              zIndex: 20,
                            }}>
                            <Image
                              source={localimag.icon_hand_like}
                              style={{
                                width: (mobileW * 8) / 100,
                                height: (mobileW * 8) / 100,
                              }}
                              tintColor={Colors.whiteColor}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}

                  {/* --------trained in commands ------- */}

                  {data?.answers['answer_5'] != 'null' && (
                    <>
                      <View
                        style={{
                          marginTop: (mobileW * 5) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 5) / 100,
                          }}>
                          {t('trainedInCommandsTricks_txt')}
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: Colors.themeColor,
                          width: (mobileW * 35) / 100,
                          height: (mobileW * 0.1) / 100,
                          alignSelf: 'flex-end',
                          marginTop: (mobileW * 1) / 100,
                        }}></View>

                      <View
                        style={{
                          marginTop: (mobileW * 3) / 100,
                          paddingBottom: (mobileH * 10) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontFamily: Font.FontLight,
                            fontSize: (mobileW * 3.5) / 100,
                          }}>
                          {data?.answers['answer_5']}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </KeyboardAwareScrollView>
            </>
          )}
        </>

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
              {/* <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShareProfilePopUp(true), setIsPopUpMenu(false);
              }}
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: (mobileW * 2) / 100,
              }}>
              <View>
                <Image
                  source={localimag.icon_share}
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
                }}>{`Share Profile`}</Text>
            </TouchableOpacity> */}

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

        {/* share profile modal */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={shareProfilePopUp}
          onRequestClose={() => {
            setShareProfilePopUp(false);
            setIsPopUpMenu(true);
          }}>
          <TouchableOpacity
            onPress={() => {
              setShareProfilePopUp(false);
              setIsPopUpMenu(true);
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
                width: (mobileW * 70) / 100,
                paddingVertical: (mobileH * 2) / 100,
                borderRadius: (mobileW * 3) / 100,
                backgroundColor: Colors.whiteColor,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View>
                <Image
                  source={localimag.icon_julia_share}
                  style={{
                    width: (mobileW * 25) / 100,
                    height: (mobileW * 25) / 100,
                    marginTop: (mobileW * 3) / 100,
                  }}
                />
              </View>

              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 6) / 100,
                }}>
                {`Julia`}
              </Text>

              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 4) / 100,
                }}>
                {`Pet Owner`}
              </Text>
            </View>
          </TouchableOpacity>

          {/* FlatList at the bottom */}
          <View
            style={{
              position: 'absolute',
              bottom: (mobileW * 1) / 100,
              width: mobileW,
              alignItems: 'center',
              // elevation: (mobileW * 2) / 100,
              // shadowColor: '#000',
              // shadowOffset: {width: 0, height: 2},
              // shadowOpacity: 0.5,
              // shadowRadius: (mobileW * 5) / 100,
              // backgroundColor: Colors.ColorBlack
            }}>
            <FlatList
              data={SHARING_DATA}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    marginHorizontal: (mobileW * 1) / 100,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={item.share_image}
                    style={{
                      width: (mobileW * 15) / 100,
                      height: (mobileW * 15) / 100,
                    }}
                  />
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontLight,
                      fontSize: (mobileW * 2.5) / 100,
                    }}>
                    {item.share_app_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
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
              <View style={{backgroundColor: Colors.whiteColor, flex: 1}}>
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
              <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
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
                          config.language == 1 ? {scaleX: -1} : {scaleX: 1},
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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
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

        {/*  pet modal  */}
        <Modal animationType="slide" transparent={true} visible={isPetModal}>
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
                }}>
                {data?.pet_name}
              </Text>

              <View
                style={{
                  width: (mobileW * 90) / 100,
                  height: (mobileW * 70) / 100,
                  // backgroundColor: 'blue',
                  borderRadius: (mobileW * 7) / 100,
                  overflow: 'hidden',
                }}>
                <Image
                  source={
                    // data?.pet_images[0]?.type == 2
                    //   ? { uri: config.img_url + data?.pet_images[0]?.thumbnail }
                    //   : { uri: config.img_url + data?.pet_images[0]?.image }
                    {
                      uri:
                        config.img_url +
                        (createMatchImage?.type == 1
                          ? createMatchImage?.image
                          : createMatchImage?.thumbnail),
                    }
                  }
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
                  value={message}
                  setValue={setMessage}
                />
                <CommonButton
                  title={`${t('match_with_txt')} ${data?.pet_name}`}
                  containerStyle={{
                    backgroundColor: Colors.themeColor2,
                    marginTop: (mobileW * 3) / 100,
                  }}
                  onPress={createMatch}
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
                    marginTop: (mobileW * 4) / 100,
                    marginHorizontal: (mobileW * 5) / 100,
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
                          setUnmatchReason_txt(item?.reason[config.language]);
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

export default UserDetails;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.themeColor2,
  },
});
