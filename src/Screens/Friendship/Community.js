import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
  TextInput,
  Keyboard,
  Modal,
  Dimensions,
  RefreshControl,
  KeyboardAvoidingView,
  Linking,
  Alert,
  Platform,
  PermissionsAndroid,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useId, useRef, useState} from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  config,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  Colors,
  Font,
  consolepro,
  localStorage,
  apifuntion,
  msgProvider,
  mediaprovider,
} from '../../Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonButton from '../../Components/CommonButton';
import {useTranslation} from 'react-i18next';
import CommonModal from '../../Components/CommonModal';
import ConfirmModal from '../../Components/ConfirmModal';
import {showEditor} from 'react-native-video-trim';
import {createThumbnail} from 'react-native-create-thumbnail';
import {RNCamera} from 'react-native-camera';
import RNFS from 'react-native-fs';
import {pushnotification} from '../../Provider/PushNotificationHandlre';
import MovToMp4 from 'react-native-mov-to-mp4';
import SearchBar from '../../Components/SearchBar';
import DropDownPicker from 'react-native-dropdown-picker';
import Share from 'react-native-share';
import ApprovalModal from '../../Components/ApprovalModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getAllChatUsersByProvider} from '../../Hooks/ChatHelper';

const screenWidth = Math.round(Dimensions.get('window').width);

const REPORT_DATA = [
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

const Community = ({navigation}) => {
  const {goBack, navigate} = useNavigation();
  const {t} = useTranslation();

  const cameraRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const [ListData, setListData] = useState([]);
  const [allCommunityData, setAllCommunityData] = useState([]);
  const [viewAllFollowedCommunities, setViewAllFollewedCommunities] = useState(
    [],
  );
  const [myFeedStatus, setMyFeedStatus] = useState(false);
  const [myCommunitiesStatus, setmyCommunitiesStatus] = useState(false);
  const [allCommunity, setAllCommunity] = useState(true);
  const [isViewAll, setIsViewAll] = useState(false);
  const [modalStatus, setModalStaus] = useState(false);
  const [value, setValue] = useState('');
  const [description, setDescription] = useState();
  const [communityPost, setCommunityPost] = useState([]);
  const [selectCommunityPost, setSelectCommunityPost] = useState(null);
  const [writePost, setwritePost] = useState(null);
  const [isCommunityPostModal, setIsCommunityPostModal] = useState(false);
  const [isEditDescription, setIsEditDescription] = useState(false);
  const [reportProfilePopUp, setReportProfilePopUp] = useState(false);
  const [reportReason, setReportReason] = useState(0);
  const [reportThanksModal, setReportThanksModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [blockedSuccessfully, setBlockedSuccessfully] = useState(false);
  const [followedCommunities, setFollowedCommunities] = useState(null);
  const [followedCommunitiesPost, setFollowedCommunitiesPost] = useState([]);
  const [myFeedDetails, setMyFeedDetails] = useState(null);
  const [myFeedPosts, setMyFeedPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedReportOption, setSelectedReportOption] = useState(null);
  const [isMyFeedPostModal, setisMyFeedPostModal] = useState(false);
  const [isPostDeleteModal, setIsPostDeleteModal] = useState(false);
  const [communityPostId, setCommunityPostId] = useState(null);
  const [post_user_name, setPost_user_name] = useState(null);
  const [isDeleteCommunityModal, setisDeleteCommunityModal] = useState(false);
  const [myFeedCommunityPostId, setMyFeedCommunityPostId] = useState(null);
  const [report_reason_text, setReport_reason_text] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [commentText, setCommentText] = useState(null);
  const [commentsData, setCommentsData] = useState([]);
  const [isViewCommentsModal, setisViewCommentsModal] = useState(false);
  const [bring_type, setBring_type] = useState(null);
  const [petImages, setpetImages] = useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [other_user_id, setOther_user_id] = useState(null);
  const commentInputRef = useRef(null);
  const [mediamodal, setMediamodal] = useState(false);
  const [add_image, setAdd_image] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoRecordingModal, setVideoRecordingModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(false);
  const [isUserProfileApproved, setIsUserProfileApproved] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredCommunityData, setFilteredCommunityData] = useState([]);
  const [isAllCommunityLoading, setIsAllCommunityLoading] = useState(true);
  const [myFeedCommunityStatue, setMyFeedCommunityStatue] = useState(false);
  const [isPublicPost, setISPublicPost] = useState(0);
  const [isCommunityModal, setIsCommunityModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isMyFeedComments, setIsMyFeedComments] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [
    isFollowedCommunityCommentsModal,
    setIsFollowedCommunityCommentsModal,
  ] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isCommunitySelectModal, setIsCommunitySelectModal] = useState(false);

  const [userCommunityData, setUserCommunityData] = useState([]);
  const [isSelectedCommunity, setIsSelectedCommunity] = useState(null);
  const [visibleHideModal, setVisibleHideModal] = useState(false);
  const [isVisibleHide, setIsVisibleHide] = useState(0);
  const [user_name, setUser_name] = useState(null);
  const [isProfileApprovalModal, setIsProfileApprovalModal] = useState(false);
  const [isUserApproved, setIsUserApproved] = useState(false);
  const [isMyFeedLoading, setIsMyFeedLoading] = useState(true);

  const [offset, setOffset] = useState(0); // current offset
  const [limit] = useState(5); // how many to load per request
  const [followed_community_limit] = useState(3); // how many to load per request
  const [hasMoreData, setHasMoreData] = useState(true); // for button visibility
  const [loadingMore, setLoadingMore] = useState(false); // prevent duplicate calls

  const [my_feed_offset, setMy_feed_offset] = useState(0);
  const [my_feed_more_data, setMy_feed_more_data] = useState(true);
  const [my_feed_loading_more, setMy_feed_loading_more] = useState(false);

  const [followed_community_offset, setFollowed_community_offset] = useState(0);
  const [followed_community_more_data, setFollowed_community_more_data] =
    useState(true);
  const [followed_loading_more, setFollowed_loading_more] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const statusBarHeight =
    Platform.OS === 'android'
      ? StatusBar.currentHeight - (mobileH * 5) / 100
      : 44;

  useEffect(() => {
    pushnotification.redirectfun({navigation});
  }, []);

  const handleCommunityPost = post => {
    setSelectCommunityPost(post);
    setIsCommunityPostModal(false);
  };

  const userDetails = async () => {
    const user_array = await localStorage.getItemObject('user_array');
    const user_images = user_array?.user_image ?? '';
    const pet_images = user_array?.pet_images[0]?.image ?? '';
    const user_name = user_array?.name;
    setUser_name(user_name);
    setpetImages(pet_images);
    setBring_type(user_array?.bring_type);
    setUserProfile(user_images);
    setUserId(user_array?.user_id);
  };

  const handleSearch = text => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredCommunityData(allCommunityData); // Show all
      return;
    }

    const filtered = allCommunityData.filter(item =>
      item?.community_name?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredCommunityData(filtered);
  };

  useFocusEffect(
    useCallback(() => {
      userDetails();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (config.device_type == 'ios') {
        setTimeout(() => {
          GetAllCommunity(0, false);
          GetViewAllFollowedCommunities();
          GetFollowedCommunities(0, false);
          GetMyFeed(null, 0, false);
          GetUserCommunities();
        }, 1200);
      } else {
        GetAllCommunity(0, false);
        GetViewAllFollowedCommunities();
        GetFollowedCommunities(0, false);
        GetMyFeed(null, 0, false);
        GetUserCommunities();
      }

      return () => {
        setAllCommunityData([]);
        setFilteredCommunityData([]);
        setListData([]);
        setOffset(0);
        setHasMoreData(true);
        setFollowed_community_offset(0);
        setMy_feed_offset(0);
        setFollowed_community_more_data(true);
        setMy_feed_more_data(true);
        setMyFeedPosts([]);
        setFollowedCommunitiesPost([]);
      };
    }, []),
  );

  // Get All Communities

  // const GetAllCommunity = async () => {
  //   try {
  //     const user_array = await localStorage.getItemObject('user_array');
  //     const userId = user_array?.user_id;

  //     const API_URL = config.baseURL + 'get_all_communities?user_id=' + userId;

  //     apifuntion
  //       .getApi(API_URL, 1)
  //       .then(res => {
  //         if (res?.success == true) {
  //           setAllCommunityData(res?.community_arr);
  //           setListData(res?.banner_arr);
  //           setFilteredCommunityData(res?.community_arr);
  //           setIsUserProfileApproved(false);
  //           setIsAllCommunityLoading(false);
  //         } else {
  //           if (res?.active_flag == 0) {
  //             localStorage.clear();
  //             navigate('WelcomeScreen');
  //             setIsAllCommunityLoading(false);
  //           } else if (res?.approve_flag == 0 || res?.approve_flag == 2) {
  //             setAllCommunityData([]);
  //             setListData([]);
  //             setIsUserProfileApproved(true);
  //             setIsAllCommunityLoading(false);
  //             setFilteredCommunityData([]);
  //             // setTimeout(() => {
  //             //   msgProvider.alert(
  //             //     t('information_txt'),
  //             //     res?.msg[config.language],
  //             //     false,
  //             //   );
  //             //   return false;
  //             // }, 300);
  //           } else {
  //             setAllCommunity([]);
  //             setIsUserProfileApproved(false);
  //             setIsAllCommunityLoading(false);
  //             setFilteredCommunityData([]);
  //           }
  //         }
  //       })
  //       .catch(error => {
  //         consolepro.consolelog(error, '<<Error');
  //         setIsAllCommunityLoading(false);
  //         setFilteredCommunityData([]);
  //       });
  //   } catch (error) {
  //     consolepro.consolelog(error, '<<Error');
  //     setFilteredCommunityData([]);
  //     setIsAllCommunityLoading(false);
  //   }
  // };

  const GetAllCommunity = async (offsetVal = 0, isRefresh = false) => {
    try {
      if (loadingMore && !isRefresh) return;

      if (!isRefresh) {
        setLoadingMore(true);
        if (offsetVal === 0) {
          setIsAllCommunityLoading(true); // show loader on first load
        }
      } else {
        setIsAllCommunityLoading(true); // when refreshing
      }

      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL +
        `get_all_communities?user_id=${userId}&offset=${offsetVal}&limit=${limit}`;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            const newCommunityData = Array.isArray(res?.community_arr)
              ? res?.community_arr
              : [];

            if (isRefresh) {
              setAllCommunityData(newCommunityData);
              setFilteredCommunityData(newCommunityData);
              setOffset(limit); // reset offset
            } else {
              setAllCommunityData(prev => {
                const existingIds = new Set(
                  prev.map(item => item?.community_id),
                );
                const newUniqueItems = newCommunityData.filter(
                  item => !existingIds.has(item?.community_id),
                );
                return [...prev, ...newUniqueItems];
              });
              setFilteredCommunityData(prev => {
                const existingIds = new Set(
                  prev.map(item => item?.community_id),
                );
                const newUniqueItems = newCommunityData.filter(
                  item => !existingIds.has(item?.community_id),
                );
                return [...prev, ...newUniqueItems];
              });
              setOffset(prev => prev + limit);
            }

            setListData(res?.banner_arr || []);
            setHasMoreData(newCommunityData.length === limit); // if less than 5, no more
            setIsUserProfileApproved(false);
          } else {
            // handle user inactive or not approved cases
            setAllCommunityData([]);
            setFilteredCommunityData([]);
            setListData([]);
            setHasMoreData(false);
            if (res?.active_flag === 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
            } else if (res?.approve_flag === 0 || res?.approve_flag === 2) {
              setIsUserProfileApproved(true);
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Error');
        })
        .finally(() => {
          setIsAllCommunityLoading(false);
          setLoadingMore(false);
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Catch Error');
      setIsAllCommunityLoading(false);
      setLoadingMore(false);
    }
  };

  // Get View All Communities

  const GetViewAllFollowedCommunities = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL + 'view_all_followed_community?user_id=' + userId;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            setViewAllFollewedCommunities(res?.followed_community);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res);
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<ERROr');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  // Get Followed Communities

  const GetFollowedCommunities = async (offsetVal = 0, isRefresh = false) => {
    try {
      if (followed_loading_more && !isRefresh) return;

      if (!isRefresh) {
        setFollowed_loading_more(true);
      }
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL +
        `get_followed_communities?user_id=${userId}&offset=${offsetVal}&limit=${followed_community_limit}`;

      consolepro.consolelog('API URL ====>>>', API_URL);

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            const newPostData = Array.isArray(res?.post_Liked_details)
              ? res?.post_Liked_details
              : [];

            if (isRefresh) {
              setFollowedCommunitiesPost(newPostData);
              setFollowed_community_offset(followed_community_limit);
            } else {
              setFollowedCommunitiesPost(prev => {
                const existingIds = new Set(
                  prev.map(item => item?.community_post_id),
                );
                const newUniqueItems = newPostData.filter(
                  item => !existingIds.has(item?.community_post_id),
                );
                return [...prev, ...newUniqueItems];
              });
              setFollowed_community_offset(
                prev => prev + followed_community_limit,
              );
            }

            setFollowedCommunities(res?.community_arr);
            setFollowed_community_more_data(
              newPostData.length === followed_community_limit,
            );
          } else {
            setFollowedCommunities([]);
            setFollowedCommunitiesPost([]);
            setFollowed_community_more_data(false);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
            } else if (res?.approve_flag == 0 || res?.approve_flag == 2) {
              setFollowedCommunities([]);
              setFollowedCommunitiesPost([]);
              // setTimeout(() => {
              //   msgProvider.alert(
              //     t('information_txt'),
              //     res?.msg[config.language],
              //     false,
              //   );
              //   return false;
              // }, 300);
            } else {
              consolepro.consolelog(res);
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<ERROr');
        })
        .finally(() => {
          setFollowed_loading_more(false);
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
      setFollowed_loading_more(false);
    }
  };

  // Get  My Feed

  const GetMyFeed = async (community_id, offsetVal = 0, isRefresh = false) => {
    try {
      if (my_feed_loading_more && !isRefresh) return;

      if (!isRefresh) setMy_feed_loading_more(true);
      else setIsMyFeedLoading(true);

      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;
      let API_URL;

      if (community_id) {
        API_URL =
          config.baseURL +
          'get_my_feed?user_id=' +
          userId +
          `&community_id=${community_id}&offset=${offsetVal}&limit=${limit}`;
      } else if (global.community_id) {
        API_URL =
          config.baseURL +
          'get_my_feed?user_id=' +
          userId +
          `&community_id=${global.community_id}&offset=${offsetVal}&limit=${limit}`;
      } else {
        API_URL =
          config.baseURL +
          `get_my_feed?user_id=${userId}&offset=${offsetVal}&limit=${limit}`;
      }

      consolepro.consolelog('GET MY FEED API URL=======>>', API_URL);

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            const newPostData = Array.isArray(res?.post_arr)
              ? res?.post_arr
              : [];

            if (isRefresh) {
              setMyFeedPosts(newPostData);
              setMy_feed_offset(limit);
            } else {
              setMyFeedPosts(prev => {
                const existingIds = new Set(
                  prev.map(item => item?.community_post_id),
                );

                const newUniqueItems = newPostData.filter(
                  item => !existingIds.has(item?.community_post_id),
                );
                return [...prev, ...newUniqueItems];
              });
              setMy_feed_offset(prev => prev + limit);
            }

            setMyFeedDetails(res?.community_details);
            setDescription(res?.community_details?.description);
            setMy_feed_more_data(newPostData?.length === limit);
          } else {
            setMyFeedPosts([]);
            setMy_feed_more_data(false);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
            } else if (res?.approve_flag == 0 || res?.approve_flag == 2) {
              setMyFeedPosts([]);
              setDescription(null);
              setMyFeedDetails(null);
              setMyFeedCommunityStatue(true);
              // setTimeout(() => {
              //   msgProvider.alert(
              //     t('information_txt'),
              //     res?.msg[config.language],
              //     false,
              //   );
              //   return false;
              // }, 300);
            } else if (!res?.community_status && res?.approve_flag == 1) {
              setMyFeedCommunityStatue(true);
              setMyFeedPosts([]);
              setMyFeedDetails(null);
            } else {
              consolepro.consolelog(res);
              setMyFeedPosts([]);
              setMyFeedDetails(null);
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<ERROr');
        })
        .finally(() => {
          setIsMyFeedLoading(false);
          setMy_feed_loading_more(false);
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
      setMy_feed_loading_more(false);
    }
  };

  // Get User Communities

  const GetUserCommunities = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL + 'get_all_user_communities?user_id=' + userId;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            setCommunityPost(res?.community_arr);
            const formattedData =
              res?.community_arr?.map(item => ({
                label: item.community_name,
                value: item.community_id,
              })) || [];

            setCommunities(formattedData);
            setUserCommunityData(res?.community_arr);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res, '<<REs');
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<ERROR');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERR');
    }
  };

  // Publish Post
  consolepro.consolelog('Add Image =====>>', add_image);

  const PublisPost = async () => {
    Keyboard.dismiss();
    try {
      if (!add_image) {
        msgProvider.toast(t('please_add_media_txt'), 'bottom');
        return false;
      }
      if (!writePost) {
        msgProvider.toast(t('emptyWritePost'), 'bottom');
        return false;
      }

      if (!selectCommunityPost?.community_name) {
        msgProvider.toast(t('emptyCommunityPost'), 'bottom');
        return false;
      }

      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL = config.baseURL + 'publish_post';
      const data = new FormData();

      data.append('user_id', userId);
      data.append('community_id', selectCommunityPost?.community_id);
      data.append('description', writePost);

      if (add_image?.type == 1) {
        data.append('image', {
          uri: add_image?.uri,
          type: 'image/jpg',
          name: `image.jpg`,
        });
      }

      data.append('private_public', isPublicPost);
      data.append('username_visible_status', isVisibleHide);

      if (add_image?.type === 2 && add_image?.uri && add_image?.thumbnail) {
        let videoUri = add_image.uri;

        consolepro.consolelog('Line 745', add_image.uri);

        // Convert .mov to .mp4 on iOS
        // return false;
        if (
          config.device_type === 'ios' &&
          videoUri.toLowerCase().endsWith('.mov')
        ) {
          try {
            const localPath = videoUri.startsWith('file://')
              ? videoUri.slice(7)
              : videoUri;
            const outputFileName = `${Date.now()}_converted.mp4`;
            const convertedPath = await MovToMp4.convertMovToMp4(
              localPath,
              outputFileName,
            );

            console.log('Converted video to MP4:', convertedPath);

            videoUri = convertedPath.startsWith('file://')
              ? convertedPath
              : `file://${convertedPath}`;
          } catch (e) {
            console.log('MOV to MP4 conversion failed:', e);
            msgProvider.toast(t('unsupported_file_format_txt'), 'bottom');
            return false;
          }
        }

        data.append('video', {
          uri: videoUri,
          type: 'video/mp4',
          name: 'video.mp4',
        });

        data.append('thumbnail', {
          uri: add_image.thumbnail,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      }

      consolepro.consolelog(data, '<<DATA');

      // return false
      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              msgProvider.toast(res?.msg[config.language], 'bottom');
              setMyFeedPosts([]);
              GetMyFeed(null, 0, false);
              setwritePost(null);
              setSelectCommunityPost(null);
              setAdd_image(null);
              setISPublicPost(0);
              setIsVisibleHide(0);
              return false;
            }, 700);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
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
          consolepro.consolelog(error, '<<ERROR');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  // handle like unlike (MY FEED)

  const handleLikeToggle = async postId => {
    const user_array = await localStorage.getItemObject('user_array');
    const userId = user_array?.user_id;
    const userImage = user_array?.image;

    const currentPost = myFeedPosts.find(
      post => post?.community_post_id === postId,
    );
    if (!currentPost) return;

    const newLikeState = !currentPost.like_Status;

    const updatedPosts = myFeedPosts.map(post => {
      if (post?.community_post_id === postId) {
        // Ensure like_members_images is an array
        let updatedLikeMembers = Array.isArray(post.like_members_images)
          ? [...post.like_members_images]
          : [];

        if (newLikeState) {
          if (!updatedLikeMembers.some(member => member.user_id === userId)) {
            updatedLikeMembers.unshift({
              user_id: userId,
              image: userImage,
            });
          }
        } else {
          updatedLikeMembers = updatedLikeMembers.filter(
            member => member.user_id !== userId,
          );
        }

        return {
          ...post,
          like_Status: newLikeState,
          total_likes: newLikeState
            ? Number(post.total_likes) + 1
            : Number(post.total_likes) - 1,
          like_members_images: updatedLikeMembers,
        };
      }
      return post;
    });

    setMyFeedPosts(updatedPosts);

    const API_URL = config.baseURL + 'like_community_post';
    const data = new FormData();
    data.append('user_id', userId);
    data.append('community_post_id', postId);

    apifuntion
      .postApi(API_URL, data, 1)
      .then(res => {
        if (!res.success) {
          // Rollback if API fails
          const rollbackPosts = myFeedPosts.map(post => {
            if (post?.community_post_id === postId) {
              let rollbackMembers = Array.isArray(post.like_members_images)
                ? [...post.like_members_images]
                : [];

              if (!newLikeState) {
                if (!rollbackMembers.some(m => m.user_id === userId)) {
                  rollbackMembers.unshift({
                    user_id: userId,
                    image: userImage,
                  });
                }
              } else {
                rollbackMembers = rollbackMembers.filter(
                  m => m.user_id !== userId,
                );
              }

              return {
                ...post,
                like_Status: !newLikeState,
                total_likes: !newLikeState
                  ? Number(post.total_likes) + 1
                  : Number(post.total_likes) - 1,
                like_members_images: rollbackMembers,
              };
            }
            return post;
          });

          setMyFeedPosts(rollbackPosts);
        }
      })
      .catch(err => {
        console.log('Like error', err);
        setMyFeedPosts(myFeedPosts); // Restore original state on error
      });
  };

  // handle like unlike followed posts

  const handleFollowedPostLike = async postId => {
    const user_array = await localStorage.getItemObject('user_array');
    const userId = user_array?.user_id;
    const userImage = user_array?.image;

    const currentPost = followedCommunitiesPost.find(
      post => post?.community_post_id === postId,
    );
    if (!currentPost) return;

    const newLikeState = !currentPost.like_Status;

    const updatedPosts = followedCommunitiesPost.map(post => {
      if (post?.community_post_id === postId) {
        let updatedLikeMembers = Array.isArray(post.like_members_images)
          ? [...post.like_members_images]
          : [];

        if (newLikeState) {
          if (!updatedLikeMembers.some(member => member.user_id === userId)) {
            updatedLikeMembers.unshift({
              user_id: userId,
              image: userImage,
            });
          }
        } else {
          updatedLikeMembers = updatedLikeMembers.filter(
            member => member.user_id !== userId,
          );
        }

        return {
          ...post,
          like_Status: newLikeState,
          total_likes: newLikeState
            ? Number(post.total_likes) + 1
            : Number(post.total_likes) - 1,
          like_members_images: updatedLikeMembers,
        };
      }
      return post;
    });

    setFollowedCommunitiesPost(updatedPosts);

    const API_URL = config.baseURL + 'like_community_post';
    const data = new FormData();
    data.append('user_id', userId);
    data.append('community_post_id', postId);

    apifuntion
      .postApi(API_URL, data, 1)
      .then(res => {
        if (!res.success) {
          // Rollback if API fails
          const rollbackPosts = followedCommunitiesPost.map(post => {
            if (post?.community_post_id === postId) {
              let rollbackMembers = Array.isArray(post.like_members_images)
                ? [...post.like_members_images]
                : [];

              if (!newLikeState) {
                if (!rollbackMembers.some(m => m.user_id === userId)) {
                  rollbackMembers.unshift({
                    user_id: userId,
                    image: userImage,
                  });
                }
              } else {
                rollbackMembers = rollbackMembers.filter(
                  m => m.user_id !== userId,
                );
              }

              return {
                ...post,
                like_Status: !newLikeState,
                total_likes: !newLikeState
                  ? Number(post.total_likes) + 1
                  : Number(post.total_likes) - 1,
                like_members_images: rollbackMembers,
              };
            }
            return post;
          });

          setFollowedCommunitiesPost(rollbackPosts);
        }
      })
      .catch(err => {
        console.log('Like error', err);
        setFollowedCommunitiesPost(followedCommunitiesPost); // Restore original state on error
      });
  };

  // handle delete community

  const handleDeleteCommunity = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();

      data.append('user_id', userId);
      data.append('community_id', myFeedDetails?.community_id);

      const API_URL = config.baseURL + 'delete_community';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              global.community_id = null;
              GetMyFeed(null, 0, false);
              GetUserCommunities();
              setisDeleteCommunityModal(false);
              msgProvider.toast(res?.msg[config.language], 'bottom');
              return false;
            }, 700);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
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

      consolepro.consolelog(data, '<<DATA');
    } catch (error) {
      consolepro.consolelog(error, '<<Error');
    }
  };

  // handle block user

  const handleUserBlocked = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();
      data.append('user_id', userId);
      data.append('other_user_id', other_user_id);

      const API_URL = config.baseURL + 'block_user';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              setBlockModal(false);
              setBlockedSuccessfully(true);
              setFollowedCommunitiesPost([]);
              setMyFeedPosts([]);
              setAllCommunityData([]);
              setOffset(0);
              setMy_feed_offset(0);
              setFollowed_community_offset(0);
              GetMyFeed(null, 0, false);
              GetAllCommunity(0, false);
              GetFollowedCommunities(0, false);
            }, 700);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
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
          consolepro.consolelog(error, '<<Er');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  // handle post delete

  const handlePostDelete = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();
      data.append('user_id', userId);
      data.append(
        'community_post_id',
        myFeedCommunityPostId?.community_post_id,
      );

      consolepro.consolelog(data, '<<DAta');

      const API_URL = config.baseURL + 'delete_community_post';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, 'RES');
            setTimeout(() => {
              setMyFeedPosts([]);
              setMy_feed_offset(0);
              GetMyFeed(null, 0, false);
              setIsPostDeleteModal(false);
            }, 300);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
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
          consolepro.consolelog(error, '<<ERROR');
        });
    } catch (error) {
      consolepro.consolelog(error, '<ERROR');
    }
  };

  // Community post comment

  const handleComments = async (community_post_id, index) => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL = config.baseURL + 'add_comment';

      const data = new FormData();
      data.append('user_id', userId);
      data.append('community_post_id', community_post_id);
      data.append('comment', value[index]);

      if (value[index] && value[index].trim().length > 0) {
        apifuntion
          .postApi(API_URL, data, 1)
          .then(res => {
            if (res?.success == true) {
              consolepro.consolelog(res, '<<RES');
              setTimeout(() => {
                msgProvider.toast(res?.msg[config.language], 'bottom');
                return false;
              }, 700);
            } else {
              if (res?.active_flag == 0) {
                localStorage.clear();
                navigate('WelcomeScreen');
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
            consolepro.consolelog(error, '<<ERROR');
          });
      }
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  // handle report post

  const handleReportPost = async () => {
    try {
      consolepro.consolelog('Post Report');
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();
      data.append('user_id', userId);
      data.append('community_post_id', communityPostId);
      data.append('reason', selectedReportOption);
      consolepro.consolelog(data, '<DATA');

      if (selectedReportOption == 4) {
        data.append('report_reason', report_reason_text);
      }

      consolepro.consolelog(selectedReportOption, '<<Selected report option');

      const API_URL = config.baseURL + 'report_community_post';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              setModalStaus(false);
              if (selectedReportOption == 4) {
                setReportProfilePopUp(false);
                setReportThanksModal(true);
                setReportReason(0);
              }
              msgProvider.toast(res?.msg[config.language], 'bottom');
              return false;
            }, 700);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
            } else if (selectedReportOption != 4) {
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

  // Get ALL Comments

  const GetAllComments = async community_post_id => {
    try {
      consolepro.consolelog(community_post_id, '<<community post id');
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL +
        `get_all_comments?user_id=${userId}&community_post_id=${community_post_id}`;

      consolepro.consolelog(API_URL, '<<API');

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setCommentsData(res?.comment_arr);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res, '<<REs');
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  const handleReply = commentItem => {
    consolepro.consolelog(commentItem, '<<Comment');
    setReplyTo(commentItem);
    setTimeout(() => {
      commentInputRef?.current?.focus();
    }, 200);
  };

  // handle Comments

  const handleSendComment = async () => {
    if (replyTo) {
      console.log('Replying to comment id:', replyTo?.community_comment_id);

      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();

      data.append('user_id', userId);
      data.append('community_comment_id', replyTo?.community_comment_id);
      data.append('reply', commentText);

      const API_URL = config.baseURL + 'comment_reply';

      if (commentText && commentText?.trim()?.length >= 0) {
        apifuntion
          .postApi(API_URL, data, 1)
          .then(res => {
            if (res?.success == true) {
              consolepro.consolelog(res, '<<RES');
              setTimeout(() => {
                GetAllComments(communityPostId);
              }, 700);
            } else {
              if (res?.active_flag == 0) {
                consolepro.consolelog(res, '<<RES');
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
            consolepro.consolelog(error);
          });
      }
    } else {
      // Normal comment
      console.log('Posting normal comment');
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL = config.baseURL + 'add_comment';

      const data = new FormData();
      data.append('user_id', userId);
      data.append('community_post_id', communityPostId);
      data.append('comment', commentText);

      consolepro.consolelog(data, '<<DATa');

      if (commentText && commentText?.trim()?.length >= 0) {
        apifuntion
          .postApi(API_URL, data, 1)
          .then(res => {
            if (res?.success == true) {
              consolepro.consolelog(res, '<<RES');
              setTimeout(() => {
                GetAllComments(communityPostId);
              }, 700);
            } else {
              if (res?.active_flag == 0) {
                consolepro.consolelog(res, '<<RES');
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
            consolepro.consolelog(error);
          });
      }
    }

    setCommentText(''); // Clear input
    setReplyTo(null); // Clear reply mode
  };

  // handle like unlike

  const handleLikeComments = async postId => {
    const user_array = await localStorage.getItemObject('user_array');
    const userId = user_array?.user_id;

    const currentPost = commentsData.find(
      post => post?.community_comment_id === postId,
    );
    if (!currentPost) return;

    const newLikeState = !currentPost.like_Status;

    const updatedPosts = commentsData.map(post => {
      if (post?.community_comment_id == postId) {
        return {
          ...post,
          like_status: newLikeState, // ✅ Only toggle like status
        };
      }
      return post;
    });

    setCommentsData(updatedPosts);

    const API_URL = config.baseURL + 'like_comment';
    const data = new FormData();
    data.append('user_id', userId);
    data.append('community_comment_id', postId);

    apifuntion
      .postApi(API_URL, data, 1)
      .then(res => {
        if (!res?.success) {
          // Rollback if API failed
          const rollbackPosts = commentsData.map(post => {
            if (post?.community_comment_id === postId) {
              return {
                ...post,
                like_status: !newLikeState, // rollback the like status
              };
            }
            return post;
          });

          setCommentsData(rollbackPosts);
        }
      })
      .catch(err => {
        console.log('Like error', err);
        setCommentsData(commentsData);
      });
  };

  const handleCommentDelete = async (id, type) => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();

      data.append('user_id', userId);
      data.append('comment_id', id);
      data.append('type', type);

      consolepro.consolelog('Data ======>>', data);

      const API_URL = config.baseURL + 'delete_comment';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog('RES=======>>', res);
            msgProvider.toast(res?.msg[config.language], 'bottom');
            setTimeout(() => {
              GetAllComments(communityPostId);
            }, 300);
            return false;
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res, '<<REs');
            }
          }
        })
        .catch(error => {
          consolepro.consolelog('Error=======>>', error);
        });
    } catch (error) {
      consolepro.consolelog('Error=========>>', error);
    }
  };

  // Hide all from other users

  const ManageHidAllFrom = async () => {
    try {
      consolepro.consolelog('Post Report');
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();
      data.append('user_id', userId);
      data.append('community_post_id', communityPostId);
      data.append('reason', selectedReportOption);
      consolepro.consolelog(data, '<DATA');

      consolepro.consolelog(selectedReportOption, '<<Selected report option');

      const API_URL = config.baseURL + 'report_community_post';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              setTimeout(() => {
                GetFollowedCommunities(0, false);
                setReportThanksModal(false);
              }, 700);
              msgProvider.toast(res?.msg[config.language], 'bottom');
              return false;
            }, 700);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
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
          consolepro.consolelog(error, '<<ERROR');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const open_settings = () => {
    Alert.alert(
      'Alert',
      'This app need permissions,Please allow it',
      [
        {
          text: 'Close',
          onPress: () => {
            console.log('nothing user cancle it ');
          },
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    };
  }, [isRecording]);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message:
              'This app needs access to your camera for recording videos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      // iOS will prompt automatically, assume permission is granted
      return true;
    }
  };

  const requestPhotosPermission = async () => {
    try {
      if (Platform.OS == 'android') {
        if (Platform.Version >= 33) {
          // Android 13+ (READ_MEDIA_IMAGES)
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          );
          if (granted == PermissionsAndroid.RESULTS.DENIED) {
            console.log('User denied permission');
            return false;
          } else if (granted == PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            console.log('User selected "Never ask again", opening settings...');
            open_settings();
            return false;
          }
          return granted == PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // Android 12 and below (READ_EXTERNAL_STORAGE)
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          );
          if (granted == PermissionsAndroid.RESULTS.DENIED) {
            console.log('User denied permission');
            return false;
          } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            console.log('User selected "Never ask again", opening settings...');
            open_settings();
            return false;
          }
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      }
      return true; // iOS handles permissions automatically
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };

  useEffect(() => {
    if (videoRecordingModal) {
      (async () => {
        const permission = await requestCameraPermission();
        setHasPermission(permission);
      })();
    }
  }, [videoRecordingModal]);

  const openGallery = async ({type}) => {
    const hasPermission = await requestPhotosPermission();

    if (!hasPermission) {
      console.log('Gallery permission denied');
      return;
    }

    await mediaprovider
      .launchGellery()
      .then(res => {
        console.log(res?.path, 'images');
        setAdd_image({uri: res?.path, type: type, thumbnail: ''});
        setTimeout(() => {
          setMediamodal(false);
        }, 300);
      })
      .catch(error => {
        consolepro.consolelog(error, '<<Erro');
        if (config.device_type == 'ios') {
          if (
            error ===
            'Error: Cannot access images. Please allow access if you want to be able to select images.'
          ) {
            console.log('iOS permission denied, opening settings...');
            setTimeout(() => {
              open_settings();
            }, 1000);
          }
        } else {
          if (error === 'Error: Required permission missing') {
            console.log('Android permission missing, opening settings...');
            open_settings();
          }
        }
      });
  };

  const openCamera = async ({type}) => {
    try {
      await mediaprovider
        .launchCamera()
        .then(res => {
          consolepro.consolelog(res?.path, '<camera image');
          setAdd_image({uri: res?.path, type: type, thumbnail: ''});
          setTimeout(() => {
            setMediamodal(false);
          }, 300);
        })
        .catch(error => {
          if (config.device_type == 'ios') {
            if (error == 'Error: User did not grant camera permission.') {
              console.log('i am here ');
              setTimeout(() => {
                open_settings();
              }, 1000);
            }
          } else {
            if (error == 'Error: User did not grant camera permission.') {
              open_settings();
            }
          }
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Eror');
    }
  };

  const openGalleryVideo = async ({type}) => {
    try {
      const res = await mediaprovider.launchGalleryVideo();

      consolepro.consolelog('GAllery video path:- ', res?.path);
      const videoPath = res?.path;
      console.log('Gallery Video Path:', videoPath);

      const statResult = await RNFS.stat(videoPath);
      const fileSizeInMB = (statResult.size / (1024 * 1024)).toFixed(2);

      console.log(`Video Size: ${fileSizeInMB} MB`);

      if (fileSizeInMB > 50) {
        msgProvider.toast(
          t('please_select_a_video_smaller_than_50_md_txt'),
          'bottom',
        );
        return false;
      }
      setTimeout(async () => {
        // await showEditor(res?.path, {maxDuration: 15, saveToPhoto: false});
        setMediamodal(false);
        createThumbnail({
          url: res?.path,
          timeStamp: 1000,
          format: 'jpeg',
        })
          .then(res => {
            setAdd_image({uri: videoPath, type: type, thumbnail: res?.path});
            setThumbnail(res?.path);
          })
          .catch(error => {
            consolepro.consolelog(error, '<<error');
          });
      }, 1000);
    } catch (error) {
      consolepro.consolelog(error, '<<Error');
    }
  };

  const handleRecordedVideo = async media => {
    consolepro.consolelog(media, '<<media');
    setAdd_image(media);
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      setRecordingTime(0);
      setShowPreview(false);
      consolepro.consolelog('Recording');
      try {
        const data = await cameraRef.current.recordAsync();
        const originalUri = data?.uri;

        if (!originalUri) {
          throw new Error('Recording failed: no URI');
        }

        const sanitizedPath =
          Platform.OS === 'ios'
            ? originalUri.replace('file://', '')
            : originalUri;

        let destPath = '';

        if (config.device_type === 'ios') {
          destPath = `${RNFS.DocumentDirectoryPath}/video_${Date.now()}.mov`;
          await RNFS.copyFile(sanitizedPath, destPath);
        } else {
          // On Android, optionally copy to app-specific storage or keep original
          destPath = sanitizedPath;
        }

        consolepro.consolelog(originalUri, '<<Original uri');

        const thumbnailPath =
          config.device_type === 'ios' ? destPath : originalUri;

        createThumbnail({
          url: thumbnailPath,
          timeStamp: 1000,
          format: 'jpeg',
        })
          .then(async thumbnailResponse => {
            consolepro.consolelog(thumbnailResponse, '<<thumbnail res');
            setThumbnail(thumbnailResponse?.path);
            setVideoUri(data?.uri);
          })
          .catch(error => {
            consolepro.consolelog(error, 'THumbnail res');
          });
        setShowPreview(true);
      } catch (error) {
        console.error('Recording error:', error);
      } finally {
        setIsRecording(false);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  useFocusEffect(
    useCallback(() => {
      setSearchText('');
      setFilteredCommunityData(allCommunityData);
      setSelectedCommunity(null);
    }, []),
  );

  // community post Share

  const onCommunityPostShare = async community_post_id => {
    consolepro.consolelog('I am in share event ', community_post_id);

    var share_url =
      config.baseURL +
      'deepLink/?link=pomsse://get_post_details/' +
      community_post_id;

    consolepro.consolelog({share_url});

    let shareOptions = {
      message: share_url,
      failOnCancel: false,
      forceDialog: true,
    };

    Share.open(shareOptions)
      .then(res => consolepro.consolelog('Share Success', res))
      .catch(err => consolepro.consolelog('Share Error', err));
  };

  console.log(global.community_id, 'Community id global====>>');

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

  const onRefreshAll = async () => {
    setRefreshing(true);

    // Reset pagination before fetching
    setOffset(0);
    setHasMoreData(true);
    setLoadingMore(false);

    setMy_feed_offset(0);
    setMy_feed_more_data(true);
    setMy_feed_loading_more(false);

    setFollowed_community_offset(0);
    setFollowed_community_more_data(true);
    setFollowed_loading_more(false);

    try {
      await Promise.all([
        GetAllCommunity(0, true), // true = refresh mode
        GetFollowedCommunities(0, true),
        GetMyFeed(null, 0, true),
      ]);
    } catch (err) {
      consolepro.consolelog(err, '<< onRefreshAll ERROR');
    } finally {
      setRefreshing(false);
    }
  };

  consolepro.consolelog(
    'Followed community More Data=>',
    followed_community_more_data,
  );
  consolepro.consolelog('Followed community loading =>', followed_loading_more);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {/*--------  header ---------*/}

        <View
          style={{
            width: (mobileW * 88) / 100,
            marginTop: (mobileH * 3.5) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            alignSelf: 'center',
            paddingVertical: (mobileW * 3) / 100,
          }}>
          <TouchableOpacity onPress={() => goBack()} activeOpacity={0.8}>
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

          {allCommunity && (
            <SearchBar
              placeHolderText={t('search_txt')}
              containerStyle={{
                width: (mobileW * 75) / 100,
                height: (mobileW * 10) / 100,
                marginTop: 0,
              }}
              inputStyle={{
                width: (mobileW * 65) / 100,
                height: (mobileW * 10) / 100,
              }}
              iconStyle={{
                width: searchText ? (mobileW * 3) / 100 : (mobileW * 4) / 100,
                height: searchText ? (mobileW * 3) / 100 : (mobileW * 4) / 100,
                tintColor: Colors.themeColor2,
              }}
              setValue={text => {
                consolepro.consolelog(text, 'Search text');
                handleSearch(text);
              }} // 🔍
              value={searchText}
              iconSource={
                searchText ? localimag.icon_cross : localimag.icon_search
              }
              onIconPress={() => {
                setSearchText('');
                handleSearch('');
              }}
              editable={isUserApproved}
            />
          )}
        </View>

        {/* ---- header end -------- */}

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: (mobileH * 15) / 100,
          }}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefreshAll} />
          }>
          <View
            style={{
              marginTop: (mobileH * 3) / 100,
              width: (mobileW * 88) / 100,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: Colors.headingColor,
                fontSize: (mobileW * 6.5) / 100,
                fontFamily: Font.FontSemibold,
              }}>
              {t('petParkCommunity_txt')}
            </Text>

            {myCommunitiesStatus && (
              <Text
                style={{
                  color: Colors.themeColor,
                  fontSize: (mobileW * 3.5) / 100,
                  fontFamily: Font.FontMedium,
                }}>
                {t('connectPlayAndExplore_txt')}
              </Text>
            )}
          </View>

          {/* ------------------------------- */}

          {(allCommunity || (myFeedStatus && !myFeedDetails)) && (
            <View
              style={{
                marginTop: (mobileH * 1) / 100,
              }}>
              <FlatList
                data={ListData}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={{
                  marginTop: (mobileH * 1.5) / 100,
                  gap: (mobileW * 3) / 100,
                  paddingHorizontal: (mobileW * 5) / 100,
                }}
                keyboardShouldPersistTaps="handled"
                renderItem={({item, index}) => (
                  <ListView
                    item={item}
                    index={index}
                    isUserApproved={isUserApproved}
                  />
                )}
              />
            </View>
          )}

          {/* --------------------------- */}

          {myFeedStatus && myFeedDetails && (
            <View
              style={{
                marginHorizontal: (mobileW * 5) / 100,
                marginTop: (mobileW * 3) / 100,
              }}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    width: (mobileW * 35) / 100,
                    height: (mobileW * 35) / 100,
                    borderRadius: (mobileW * 4) / 100,
                    overflow: 'hidden',
                  }}>
                  <Image
                    source={
                      myFeedDetails?.cover_image
                        ? {uri: config.img_url + myFeedDetails?.cover_image}
                        : localimag.icon_add_pet_photo
                    }
                    style={{
                      width: (mobileW * 35) / 100,
                      height: (mobileW * 35) / 100,
                    }}
                  />
                </View>

                <View
                  style={{
                    marginHorizontal: (mobileW * 2) / 100,
                    width: (mobileW * 55) / 100,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      // alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        color: Colors.themeColor,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 5) / 100,
                        width: (mobileW * 40) / 100,
                        textAlign: config.language == 1 ? 'left' : 'left',
                        // backgroundColor: 'red'
                      }}>
                      Welcome to #{myFeedDetails?.community_name}
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      disabled={!isUserApproved}
                      onPress={() => {
                        setIsCommunitySelectModal(true);
                      }}
                      style={{
                        paddingRight: (mobileW * 4) / 100,
                      }}>
                      <Image
                        source={localimag.icon_down}
                        style={{
                          width: (mobileW * 4.3) / 100,
                          height: (mobileW * 4.3) / 100,
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={localimag.icon_star}
                      style={{
                        width: (mobileW * 3) / 100,
                        height: (mobileW * 3) / 100,
                      }}
                    />
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontSemibold,
                        fontSize: (mobileW * 3.5) / 100,
                        marginLeft: (mobileW * 1) / 100,
                        width: (mobileW * 35) / 100,
                      }}>{`(${myFeedDetails?.joined_members_count} members)`}</Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'flex-end',
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={!isUserApproved}
                        onPress={() =>
                          navigate('EditCommunity', {
                            community_details: myFeedDetails,
                          })
                        }
                        style={{
                          backgroundColor: Colors.whiteColor,
                          borderRadius: (mobileW * 30) / 100,
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 3},
                          shadowOpacity: 0.29,
                          shadowRadius: 4.65,
                          elevation: 7,
                          padding: (mobileW * 1) / 100,
                          marginRight: (mobileW * 2) / 100, // space between icons
                        }}>
                        <Image
                          source={localimag.icon_edit_pen}
                          style={{
                            width: (mobileW * 4) / 100,
                            height: (mobileW * 4) / 100,
                            transform: [
                              config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                            ],
                          }}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={!isUserApproved}
                        onPress={() => {
                          setisDeleteCommunityModal(true);
                        }}
                        style={{
                          backgroundColor: Colors.whiteColor,
                          borderRadius: (mobileW * 30) / 100,
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 3},
                          shadowOpacity: 0.29,
                          shadowRadius: 4.65,
                          elevation: 7,
                          padding: (mobileW * 1) / 100,
                        }}>
                        <Image
                          source={localimag.icon_trash}
                          style={{
                            width: (mobileW * 4) / 100,
                            height: (mobileW * 4) / 100,
                            transform: [
                              config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                            ],
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontSemibold,
                      fontSize: (mobileW * 3.5) / 100,
                      textAlign: config.language == 1 ? 'left' : 'left',
                      width: '100%',
                    }}>
                    {myFeedDetails?.title}
                  </Text>
                </View>
              </View>

              <View>
                <TextInput
                  multiline
                  style={{
                    // backgroundColor: 'gray',
                    // backgroundColor: Colors.whiteColor,
                    // borderColor: Colors.themeColor2,
                    // borderWidth: 1,
                    borderRadius: (mobileW * 2) / 100,
                    marginTop: (mobileW * 1) / 100,
                    textAlignVertical: 'top',
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3) / 100,
                    padding: (mobileW * 3) / 100,
                    // paddingRight: (mobileW * 3) / 100,
                    color: Colors.themeColor2,
                    height: (mobileW * 25) / 100,
                    textAlign: config.language == 1 ? 'right' : 'left',
                  }}
                  value={description}
                  onChangeText={val => setDescription(val)}
                  keyboardType="default"
                  placeholder="Enter About Community"
                  editable={isEditDescription}
                  placeholderTextColor={Colors.placeholderTextColor}
                  maxLength={250}
                />
                {/* 
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  backgroundColor: Colors.whiteColor,
                  borderRadius: (mobileW * 30) / 100,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.29,
                  shadowRadius: 4.65,
                  elevation: 7,
                  padding: (mobileW * 1) / 100,
                  alignSelf: 'flex-end',
                  position: 'absolute',
                  bottom: (mobileW * 2) / 100,
                  right: (mobileW * 2) / 100,
                }}>
                <Image
                  source={localimag.icon_edit_pen}
                  style={{
                    width: (mobileW * 4) / 100,
                    height: (mobileW * 4) / 100,
                  }}
                />
              </TouchableOpacity> */}
              </View>
            </View>
          )}

          <View
            style={{
              paddingHorizontal: (mobileW * 4) / 100,
              marginTop: (mobileH * 2) / 100,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {/* all communities */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setmyCommunitiesStatus(false);
                setMyFeedStatus(false);
                setAllCommunity(true);
                setValue('');
                setIsViewAll(false);
                setSelectCommunityPost(null);
                setwritePost(null);
                setOffset(0);
                setFollowed_community_offset(0);
                setMy_feed_offset(0);
                setAllCommunityData([]);
                setMyFeedPosts([]);
                setFollowedCommunitiesPost([]);
                GetAllCommunity(0, false);
                GetFollowedCommunities(0, false);
                GetMyFeed(null, 0, false);
              }}>
              <Text
                style={{
                  color: allCommunity
                    ? Colors.themeColor
                    : Colors.darkGreenColor,
                  fontSize: (mobileW * 3.2) / 100,
                  fontFamily: Font.FontMedium,
                }}>
                {t('all_communities_txt')}
              </Text>

              {allCommunity && (
                <View
                  style={{
                    backgroundColor: Colors.themeColor,
                    width: (mobileW * 28) / 100,
                    alignSelf: 'center',
                    height: (mobileH * 0.6) / 100,
                    marginTop: (mobileH * 0.3) / 100,
                    borderRadius: (mobileW * 5) / 100,
                  }}></View>
              )}
            </TouchableOpacity>

            {/* my communities */}
            <TouchableOpacity
              onPress={() => {
                setMyFeedStatus(false);
                setmyCommunitiesStatus(true);
                setAllCommunity(false);
                setValue('');
                // setIsViewAll(false);
                setSelectCommunityPost(null);
                setwritePost(null);
                setSearchText('');
                setFilteredCommunityData(allCommunityData);
                setOffset(0);
                setFollowed_community_offset(0);
                setMy_feed_offset(0);
                setAllCommunityData([]);
                setMyFeedPosts([]);
                setFollowedCommunitiesPost([]);
                GetFollowedCommunities(0, false);
                GetAllCommunity(0, false);
                GetMyFeed(null, 0, false);
              }}
              activeOpacity={0.8}
              style={
                {
                  // marginLeft: (mobileW * 2) / 100,
                }
              }>
              <Text
                style={{
                  color: myCommunitiesStatus
                    ? Colors.themeColor
                    : Colors.darkGreenColor,
                  fontSize: (mobileW * 3.2) / 100,
                  fontFamily: Font.FontMedium,
                  // backgroundColor: 'red'
                }}>
                {t('followed_communities_txt')}
              </Text>

              {myCommunitiesStatus && (
                <View
                  style={{
                    backgroundColor: Colors.themeColor,
                    width: (mobileW * 40) / 100,
                    alignSelf: 'center',
                    height: (mobileH * 0.6) / 100,
                    marginTop: (mobileH * 0.3) / 100,
                    borderRadius: (mobileW * 5) / 100,
                  }}></View>
              )}
            </TouchableOpacity>

            {/* my feed */}
            <TouchableOpacity
              onPress={() => {
                setMyFeedStatus(true);
                setmyCommunitiesStatus(false);
                setAllCommunity(false);
                setValue('');
                setIsViewAll(false);
                setSelectCommunityPost(null);
                setwritePost(null);
                setSearchText('');
                setFilteredCommunityData(allCommunityData);
                setOffset(0);
                setFollowed_community_offset(0);
                setMy_feed_offset(0);
                setAllCommunityData([]);
                setMyFeedPosts([]);
                setFollowedCommunitiesPost([]);
                GetMyFeed(null, 0, false);
                GetAllCommunity(0, false);
                GetFollowedCommunities(0, false);
              }}
              activeOpacity={0.8}
              style={
                {
                  // marginLeft: (mobileW * 5) / 100,
                }
              }>
              <Text
                style={{
                  color: myFeedStatus
                    ? Colors.themeColor
                    : Colors.darkGreenColor,
                  fontSize: (mobileW * 3.2) / 100,
                  fontFamily: Font.FontMedium,
                }}>
                {t('myFeed_txt')}
              </Text>

              {myFeedStatus && (
                <View
                  style={{
                    backgroundColor: Colors.themeColor,
                    width: (mobileW * 15) / 100,
                    alignSelf: 'center',
                    height: (mobileH * 0.6) / 100,
                    marginTop: (mobileH * 0.3) / 100,
                    borderRadius: (mobileW * 5) / 100,
                  }}></View>
              )}
            </TouchableOpacity>
          </View>

          {/* border */}

          <View
            style={{
              backgroundColor: Colors.darkGreenColor,
              width: (mobileW * 95) / 100,
              alignSelf: 'center',
              height: (mobileH * 0.15) / 100,
            }}></View>

          {/* my feed view */}

          {myFeedStatus && myFeedCommunityStatue && !myFeedDetails && (
            <TouchableOpacity
              activeOpacity={1}
              disabled={!isUserApproved}
              style={{
                alignSelf: 'center',
                marginTop: (mobileH * 7) / 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CommonButton
                title={t('create_own_community_txt')}
                containerStyle={{
                  backgroundColor: Colors.themeColor2,
                  width: (mobileW * 50) / 100,
                  height: (mobileW * 8) / 100,
                  marginTop: (mobileH * 2) / 100,
                }}
                disabled={!isUserApproved}
                btnTextStyle={{fontSize: (mobileW * 3.2) / 100}}
                onPress={() => navigate('CreateCommunity')}
              />
            </TouchableOpacity>
          )}

          {myFeedStatus && !isUserProfileApproved && myFeedDetails && (
            <TouchableOpacity
              activeOpacity={1}
              disabled={!isUserApproved}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: (mobileW * 5) / 100,
              }}>
              <CommonButton
                title={t('create_own_community_txt')}
                containerStyle={{
                  backgroundColor: Colors.themeColor2,
                  width: (mobileW * 50) / 100,
                  height: (mobileW * 8) / 100,
                  alignSelf: 'flext-start',
                  marginTop: (mobileH * 2) / 100,
                }}
                disabled={!isUserApproved}
                btnTextStyle={{fontSize: (mobileW * 3.2) / 100}}
                onPress={() => navigate('CreateCommunity')}
              />
            </TouchableOpacity>
          )}

          {myFeedStatus && !isUserProfileApproved && myFeedDetails && (
            <View
              style={{
                paddingHorizontal: (mobileW * 5) / 100,
                // marginTop: (mobileH * 2) / 100,
              }}>
              <View
                style={{
                  width: (mobileW * 90) / 100,
                  alignSelf: 'center',
                  borderWidth: 1,
                  paddingVertical: (mobileH * 1.3) / 100,
                  borderColor: Colors.borderColor,
                  borderRadius: (mobileW * 2) / 100,
                  marginTop: (mobileH * 2) / 100,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      marginLeft: (mobileW * 2) / 100,
                    }}>
                    <View>
                      <View
                        style={{
                          borderRadius: (mobileW * 30) / 100,
                          overflow: 'hidden',
                        }}>
                        <Image
                          source={
                            userProfile
                              ? {uri: config.img_url + userProfile}
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
                            borderRadius: (mobileW * 50) / 100,
                            overflow: 'hidden',
                            position: 'absolute',
                            right: 0,
                          }}>
                          <Image
                            source={
                              petImages
                                ? {uri: config.img_url + petImages}
                                : localimag?.icon_add_pet_photo
                            }
                            style={{
                              width: (mobileW * 4) / 100,
                              height: (mobileW * 4) / 100,
                              transform: [
                                config.language == 1
                                  ? {scaleX: -1}
                                  : {scaleX: 1},
                              ],
                            }}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>

                  <TextInput
                    placeholderTextColor={Colors.placeholderTextColor}
                    returnKeyLabel="done"
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    keyboardType="default"
                    style={{
                      width: (mobileW * 50) / 100,
                      marginLeft: (mobileW * 2) / 100,
                      height: (mobileH * 5) / 100,
                      color: Colors.placeholderTextColor,
                      fontFamily: Font.FontSemibold,
                      fontSize: (mobileW * 3.3) / 100,
                      paddingBottom: 3,
                      textAlign: config.language == 1 ? 'right' : 'left',
                    }}
                    placeholder={t('write_your_post_txt')}
                    onChangeText={val => setwritePost(val)}
                    value={writePost}
                    maxLength={250}
                    editable={isUserApproved}
                  />

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      disabled={!isUserApproved}
                      onPress={() => setVisibleHideModal(true)}>
                      <TouchableOpacity
                        disabled={!isUserApproved}
                        onPress={() => setVisibleHideModal(true)}
                        style={{
                          alignSelf: 'flex-start',
                          marginRight: (mobileW * 1) / 100,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 2) / 100,
                          }}>
                          Posted By
                        </Text>

                        <Image
                          source={localimag.icon_down}
                          style={{
                            width: (mobileW * 2) / 100,
                            height: (mobileW * 2) / 100,
                            marginLeft: (mobileW * 0.5) / 100,
                          }}
                        />
                      </TouchableOpacity>

                      <Text
                        numberOfLines={1}
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 2.5) / 100,
                          width: (mobileW * 12) / 100,
                        }}>
                        {user_name}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={!isUserApproved}
                      activeOpacity={0.8}
                      onPress={() => {
                        if (!add_image) {
                          setMediamodal(true);
                        } else {
                          navigate('VideoPreview', {
                            uri: add_image?.uri,
                            type: add_image?.type == 2 ? 1 : 0,
                          });
                        }
                      }}>
                      <Image
                        source={
                          add_image?.type == 2
                            ? {uri: add_image?.thumbnail}
                            : add_image?.type == 1
                            ? {uri: add_image?.uri}
                            : localimag.icon_imageVideo
                        }
                        style={{
                          width: (mobileW * 7.5) / 100,
                          height: (mobileW * 7.5) / 100,
                          borderRadius: (mobileW * 1) / 100,
                          // marginTop: (-mobileH * 1) / 100,
                        }}
                      />
                    </TouchableOpacity>

                    {add_image && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setAdd_image(null);
                        }}
                        style={{
                          position: 'absolute',
                          top: (-mobileW * 1) / 100,
                          right: (-mobileW * 1) / 100,
                          backgroundColor: Colors.whiteColor,
                          borderRadius: (mobileW * 30) / 100,
                          padding: (mobileW * 0.5) / 100,
                          zIndex: 10,
                          elevation: 10,
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 1},
                          shadowOpacity: 0.3,
                          shadowRadius: 2,
                        }}>
                        <Image
                          source={localimag.icon_cross}
                          style={{
                            width: (mobileW * 2.5) / 100,
                            height: (mobileW * 2.5) / 100,
                          }}
                          tintColor={Colors.cancleColor}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {visibleHideModal && (
                    <View
                      style={{
                        position: 'absolute',
                        top: (mobileW * 7) / 100,
                        right: (mobileW * 9) / 100,
                        zIndex: 999,
                      }}>
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          top: (-mobileW * 7) / 100,
                          bottom: 0,
                          left: -1000,
                          right: -1000,
                        }}
                        activeOpacity={1}
                        onPress={() => setVisibleHideModal(false)}
                      />

                      {/* Modal Content */}

                      <View
                        style={{
                          backgroundColor: 'white',
                          padding: 10,
                          borderRadius: 6,
                          elevation: 5,
                          shadowColor: '#000',
                          shadowOpacity: 0.2,
                          shadowOffset: {width: 0, height: 1},
                          shadowRadius: 4,
                          minWidth: 120,
                          alignSelf: 'flex-start',
                          marginVertical: (mobileW * 1) / 100,
                        }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            // justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => {
                            setIsVisibleHide(0);
                          }}
                          activeOpacity={0.8}>
                          <Image
                            source={
                              isVisibleHide == 0
                                ? localimag.icon_filled_checkbox_theme1
                                : localimag.icon_empty_checkbox_theme1
                            }
                            style={{
                              width: (mobileW * 3.5) / 100,
                              height: (mobileW * 3.5) / 100,
                            }}
                          />
                          <Text
                            style={{
                              color: Colors.themeColor2,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 3) / 100,
                              marginLeft: (mobileW * 2) / 100,
                            }}>
                            {t('visible_txt')}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: (mobileW * 1) / 100,
                          }}
                          onPress={() => {
                            setIsVisibleHide(1);
                          }}
                          activeOpacity={0.8}>
                          <Image
                            source={
                              isVisibleHide == 1
                                ? localimag.icon_filled_checkbox_theme1
                                : localimag.icon_empty_checkbox_theme1
                            }
                            style={{
                              width: (mobileW * 3.5) / 100,
                              height: (mobileW * 3.5) / 100,
                            }}
                          />
                          <Text
                            style={{
                              color: Colors.themeColor2,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 3) / 100,
                              marginLeft: (mobileW * 2) / 100,
                            }}>
                            {t('hide_txt')}
                          </Text>
                        </TouchableOpacity>

                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 2.2) / 100,
                            marginLeft: (mobileW * 3) / 100,
                          }}>
                          {t('your_name_stays_private_txt')}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    marginVertical: (mobileH * 1.5) / 100,
                    borderWidth: 0.5,
                    borderColor: Colors.borderColor,
                    width: (mobileW * 82) / 100,
                    alignSelf: 'center',
                  }}></View>

                <View
                  style={{
                    // flexDirection: 'row',
                    // alignItems: 'center',
                    // width: (mobileW * 82) / 100,
                    alignSelf: 'flex-start',
                    marginVertical: (mobileW * 1) / 100,
                    // backgroundColor: 'red',
                    marginLeft: (mobileW * 3) / 100,
                  }}>
                  <TouchableOpacity
                    disabled={!isUserApproved}
                    style={{
                      flexDirection: 'row',
                      // justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setISPublicPost(0);
                    }}
                    activeOpacity={0.8}>
                    <Image
                      source={
                        isPublicPost == 0
                          ? localimag.icon_filled_checkbox_theme1
                          : localimag.icon_empty_checkbox_theme1
                      }
                      style={{
                        width: (mobileW * 3.5) / 100,
                        height: (mobileW * 3.5) / 100,
                      }}
                    />
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3) / 100,
                        marginLeft: (mobileW * 2) / 100,
                      }}>
                      {t('public_txt')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={!isUserApproved}
                    style={{
                      flexDirection: 'row',
                      // justifyContent: 'center',
                      alignItems: 'center',
                      // marginLeft: mobileW * 5 / 100,
                      marginTop: (mobileW * 1) / 100,
                    }}
                    onPress={() => {
                      setISPublicPost(1);
                    }}
                    activeOpacity={0.8}>
                    <Image
                      source={
                        isPublicPost == 1
                          ? localimag.icon_filled_checkbox_theme1
                          : localimag.icon_empty_checkbox_theme1
                      }
                      style={{
                        width: (mobileW * 3.5) / 100,
                        height: (mobileW * 3.5) / 100,
                      }}
                    />
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3) / 100,
                        marginLeft: (mobileW * 2) / 100,
                      }}>
                      {t('private_txt')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: (mobileW * 3) / 100,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={localimag.icon_world}
                      style={{
                        width: (mobileW * 4) / 100,
                        height: (mobileW * 4) / 100,
                      }}
                    />

                    <TouchableOpacity
                      activeOpacity={0.8}
                      disabled={!isUserApproved}
                      onPress={() => setIsCommunityPostModal(true)}
                      style={{
                        marginLeft: (mobileW * 1) / 100,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: Colors.placeholderTextColor,
                          fontSize: (mobileW * 3) / 100,
                          fontFamily: Font.FontSemibold,
                        }}>
                        {selectCommunityPost?.community_name
                          ? selectCommunityPost?.community_name?.length > 15
                            ? selectCommunityPost?.community_name?.slice(
                                0,
                                15,
                              ) + '...'
                            : selectCommunityPost?.community_name
                          : t('addYourPostIn_txt')}
                      </Text>

                      <Image
                        source={localimag.icon_dropDown}
                        style={{
                          width: (mobileW * 3) / 100,
                          height: (mobileW * 3) / 100,
                          marginLeft: (mobileW * 1.5) / 100,
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={!isUserApproved}
                    onPress={() => {
                      PublisPost();
                    }}
                    style={{
                      width: (mobileW * 33) / 100,
                      height: (mobileH * 5) / 100,
                      borderRadius: (mobileW * 30) / 100,
                      backgroundColor: Colors.themeColor,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: Colors.whiteColor,
                        fontSize: (mobileW * 3.5) / 100,
                        fontFamily: Font.FontSemibold,
                      }}>
                      {t('publishPost_txt')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* publish post view end */}

              {/* posts view */}

              <FlatList
                data={myFeedPosts?.filter(item => item !== 'NA')}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      width: (mobileW * 90) / 100,
                      alignSelf: 'center',
                      borderWidth: 1,
                      paddingTop: (mobileH * 1.5) / 100,
                      paddingBottom: (mobileH * 2) / 100,
                      borderColor: Colors.borderColor,
                      borderRadius: (mobileW * 2) / 100,
                      marginTop: (mobileH * 1.5) / 100,
                      paddingHorizontal: (mobileW * 3) / 100,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: Colors.placeholderTextColor,
                          fontSize: (mobileW * 3.2) / 100,
                          fontFamily: Font.FontSemibold,
                        }}>
                        {t('postedIn_txt')}{' '}
                        <Text
                          style={{
                            color: Colors.themeColor,
                            fontSize: (mobileW * 3.2) / 100,
                            fontFamily: Font.FontSemibold,
                          }}>
                          {item?.community_name?.length > 15
                            ? config.language == 1
                              ? '...' + item?.community_name?.slice(0, 15)
                              : item?.community_name?.slice(0, 15) + '...'
                            : item?.community_name}
                        </Text>
                      </Text>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        // disabled={!isUserApproved}
                        onPress={() =>
                          navigate('JoinCommunity', {
                            type: 1,
                            community_id: item?.community_id,
                          })
                        }>
                        <Text
                          style={{
                            color: Colors.themeColor,
                            fontSize: (mobileW * 3.2) / 100,
                            fontFamily: Font.FontSemibold,
                          }}>
                          {t('viewCommunity_txt')}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        marginVertical: (mobileH * 1.4) / 100,
                        borderWidth: 0.5,
                        borderColor: Colors.borderColor,
                        width: (mobileW * 82) / 100,
                        alignSelf: 'center',
                      }}></View>

                    <View
                      style={{
                        borderRadius: (mobileW * 3) / 100,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: (mobileH * 1) / 100,
                        }}>
                        <View>
                          <View
                            style={{
                              // backgroundColor: 'blue',
                              // alignSelf: 'flex-start',
                              borderRadius: (mobileW * 30) / 100,
                              overflow: 'hidden',
                            }}>
                            <Image
                              source={
                                item?.cover_image
                                  ? {uri: config.img_url + item?.cover_image}
                                  : localimag.icon_profile_user
                              }
                              style={{
                                width: (mobileH * 5.5) / 100,
                                height: (mobileH * 5.5) / 100,
                                transform: [
                                  config.language == 1
                                    ? {scaleX: -1}
                                    : {scaleX: 1},
                                ],
                              }}
                            />
                          </View>

                          {/* <View
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
                              item?.cover_image
                                ? { uri: config.img_url + item?.cover_image }
                                : localimag.icon_profile_user
                            }
                            style={{
                              width: (mobileW * 4) / 100,
                              height: (mobileW * 4) / 100,
                              transform: [
                                config.language == 1
                                  ? { scaleX: -1 }
                                  : { scaleX: 1 },
                              ],
                            }}
                          />
                        </View> */}
                        </View>

                        <View
                          style={{
                            // width: (mobileW * 45) / 100,
                            marginLeft: (mobileW * 3) / 100,
                          }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: (mobileW * 3.5) / 100,
                              fontFamily: Font.FontSemibold,
                              color: Colors.blackColor,
                            }}>
                            {item?.community_name?.length > 20
                              ? config.language == 1
                                ? '...' + item?.community_name?.slice(0, 20)
                                : item?.community_name?.slice(0, 20) + '...'
                              : item?.community_name}
                          </Text>
                          {/* <Text
                          style={{
                            fontSize: (mobileW * 2.9) / 100,
                            fontFamily: Font.FontMedium,
                            color: Colors.blackColor,
                          }}>
                          {item?.address}
                        </Text> */}
                        </View>
                      </View>

                      {/* ---- 4k view---- */}

                      <View
                        style={
                          {
                            // flexDirection: 'row',
                            // alignItems: 'center',
                            // marginTop: (-mobileH * 2.5) / 100,
                          }
                        }>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              height: (mobileH * 3) / 100,
                              borderRadius: (mobileW * 30) / 100,
                              backgroundColor: Colors.homeCardbackgroundColor,
                              paddingHorizontal: (mobileW * 1.5) / 100,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              {Array.isArray(item?.like_members_images) &&
                                item?.like_members_images
                                  ?.slice(0, 3)
                                  .map((user, index) => (
                                    <Image
                                      key={index.toString()}
                                      source={
                                        user?.image
                                          ? {uri: config.img_url + user?.image}
                                          : localimag?.icon_profile_user
                                      }
                                      style={{
                                        width: (mobileW * 5) / 100,
                                        height: (mobileW * 5) / 100,
                                        borderRadius: (mobileW * 30) / 100,
                                        marginLeft:
                                          index === 0
                                            ? 0
                                            : (-mobileW * 2.2) / 100,
                                        borderWidth: 1,
                                        borderColor: '#fff',
                                      }}
                                    />
                                  ))}

                              {/* Show "+X" if more than 3 likes */}
                              {Array.isArray(item?.like_members_images) &&
                                item?.like_members_images?.length > 3 && (
                                  <View
                                    style={{
                                      width: (mobileW * 5) / 100,
                                      height: (mobileW * 5) / 100,
                                      borderRadius: (mobileW * 30) / 100,
                                      backgroundColor: '#ccc',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      marginLeft: (-mobileW * 2.2) / 100,
                                      borderWidth: 1,
                                      borderColor: '#fff',
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 2.5) / 100,
                                        color: Colors.blackColor,
                                        fontFamily: Font.FontMedium,
                                      }}>
                                      +{item?.like_members_images?.length - 3}
                                    </Text>
                                  </View>
                                )}
                            </View>

                            <Text
                              style={{
                                color: Colors.blackColor,
                                fontSize: (mobileW * 2.8) / 100,
                                fontFamily: Font.FontSemibold,
                                marginLeft: (mobileW * 3) / 100,
                              }}>
                              {item?.total_likes}
                            </Text>
                          </View>

                          <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={!isUserApproved}
                            onPress={() =>
                              handleLikeToggle(item?.community_post_id)
                            }
                            style={{
                              marginLeft: (mobileW * 3) / 100,
                            }}>
                            <Image
                              source={
                                item?.like_Status
                                  ? localimag?.icon_like_heart
                                  : localimag.icon_likePost
                              }
                              style={{
                                width: (mobileW * 7) / 100,
                                height: (mobileW * 7) / 100,
                              }}
                            />
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: (mobileW * 2) / 100,
                            alignSelf: 'flex-end',
                          }}>
                          {/* Profile Image Stack (Community + User) */}
                          <View
                            style={{
                              position: 'relative',
                              marginRight: (mobileW * 2) / 100,
                            }}>
                            {/* Community Image */}
                            <View
                              style={{
                                borderRadius: (mobileH * 3.5) / 2 / 100,
                                overflow: 'hidden',
                              }}>
                              <Image
                                source={
                                  item?.user_image
                                    ? {uri: config.img_url + item.user_image}
                                    : localimag.icon_profile_user
                                }
                                style={{
                                  width: (mobileH * 3.5) / 100,
                                  height: (mobileH * 3.5) / 100,
                                  transform: [
                                    config.language == 1
                                      ? {scaleX: -1}
                                      : {scaleX: 1},
                                  ],
                                }}
                              />
                            </View>

                            {/* User Image Overlay */}

                            {item?.bring_type == 0 && (
                              <View
                                style={{
                                  position: 'absolute',
                                  top: (-mobileW * 1) / 100,
                                  right: (-mobileW * 1) / 100,
                                  borderRadius: (mobileW * 4) / 2 / 100,
                                  overflow: 'hidden',
                                  borderWidth: 1,
                                  borderColor: '#fff',
                                  backgroundColor: '#fff',
                                }}>
                                <Image
                                  source={
                                    item?.pet_image
                                      ? {uri: config.img_url + item.pet_image}
                                      : localimag.icon_profile_user
                                  }
                                  style={{
                                    width: (mobileW * 3) / 100,
                                    height: (mobileW * 3) / 100,
                                    transform: [
                                      config.language == 1
                                        ? {scaleX: -1}
                                        : {scaleX: 1},
                                    ],
                                  }}
                                />
                              </View>
                            )}
                          </View>

                          {/* Text Section */}
                          <View style={{justifyContent: 'center'}}>
                            <TouchableOpacity
                              activeOpacity={1}
                              onPress={() => {}}
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 2,
                              }}>
                              <Text
                                style={{
                                  color: Colors.placeholderTextColor,
                                  fontFamily: Font.FontMedium,
                                  fontSize: (mobileW * 2) / 100,
                                }}>
                                Posted By
                              </Text>
                            </TouchableOpacity>

                            <Text
                              numberOfLines={1}
                              style={{
                                color: Colors.themeColor2,
                                fontFamily: Font.FontMedium,
                                fontSize: (mobileW * 2.5) / 100,
                                maxWidth: (mobileW * 20) / 100,
                              }}>
                              {item?.user_name}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* video image view */}

                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginVertical: (mobileW * 5) / 100,
                        width: (mobileW * 80) / 100,
                        height: (mobileH * 60) / 100,
                        alignSelf: 'center',
                      }}>
                      {item?.type == 2 ? (
                        <TouchableOpacity
                          // disabled={!isUserApproved}
                          activeOpacity={0.8}
                          onPress={() => {
                            navigate('VideoPreview', {
                              uri: config.img_url + item?.image_video,
                              type: 1,
                            });
                          }}>
                          <Image
                            source={
                              item?.image_video
                                ? {uri: config.img_url + item?.thumbnail}
                                : ''
                            }
                            style={{
                              width: (mobileW * 80) / 100,
                              height: (mobileH * 60) / 100,
                            }}
                          />
                          <TouchableOpacity
                            // disabled={!isUserApproved}
                            onPress={() => {
                              navigate('VideoPreview', {
                                uri: config.img_url + item?.image_video,
                                type: 1,
                              });
                            }}
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: [
                                {translateX: -(mobileW * 5) / 100},
                                {translateY: -(mobileW * 5) / 100},
                              ],
                            }}>
                            <Image
                              source={localimag.icon_play_icon}
                              style={{
                                width: (mobileW * 10) / 100,
                                height: (mobileW * 10) / 100,
                              }}
                            />
                          </TouchableOpacity>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          // disabled={!isUserApproved}
                          onPress={() => {
                            navigate('VideoPreview', {
                              uri: config.img_url + item?.image_video,
                              type: 0,
                            });
                          }}>
                          <Image
                            source={
                              item?.image_video
                                ? {uri: config.img_url + item?.image_video}
                                : ''
                            }
                            style={{
                              width: (mobileW * 80) / 100,
                              height: (mobileH * 60) / 100,
                            }}
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    <View
                      style={{
                        marginTop: (mobileH * 0.8) / 100,
                      }}>
                      <Text
                        style={{
                          color: Colors.blackColor,
                          fontSize: (mobileW * 3.3) / 100,
                          fontFamily: Font.FontMedium,
                          textAlign: config.language == 1 ? 'left' : 'left',
                        }}>
                        {item?.description}
                      </Text>
                    </View>

                    <View
                      style={{
                        marginTop: (mobileH * 1.4) / 100,
                        borderWidth: 0.5,
                        borderColor: Colors.borderColor,
                        width: (mobileW * 82) / 100,
                        alignSelf: 'center',
                      }}></View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: (mobileH * 0.3) / 100,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={localimag.icon_comment}
                          style={{
                            width: (mobileW * 5) / 100,
                            height: (mobileW * 5) / 100,
                            transform: [
                              config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                            ],
                          }}
                        />

                        <TextInput
                          placeholderTextColor={Colors.themeColor}
                          returnKeyLabel="done"
                          returnKeyType="done"
                          onSubmitEditing={() => {
                            Keyboard.dismiss();
                          }}
                          keyboardType="default"
                          style={{
                            width: (mobileW * 66) / 100,
                            marginLeft: (mobileW * 1) / 100,
                            height: (mobileH * 5) / 100,
                            color: Colors.themeColor,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 3.3) / 100,
                            paddingBottom: 3,
                            textAlign: config.language == 1 ? 'right' : 'left',
                          }}
                          placeholder={t('comment_txt')}
                          // onChangeText={val => setValue(val)}
                          // value={value}
                          value={value[index] || ''} // Each item gets its own comment
                          onChangeText={val =>
                            setValue(prev => ({...prev, [index]: val}))
                          }
                          maxLength={250}
                          editable={isUserApproved}
                        />
                      </View>

                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            setValue('');
                            handleComments(item?.community_post_id, index);
                          }}>
                          <Image
                            source={localimag.icon_send}
                            style={{
                              width: (mobileW * 5) / 100,
                              height: (mobileW * 5) / 100,
                              transform: [
                                config.language == 1
                                  ? {scaleX: -1}
                                  : {scaleX: 1},
                              ],
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          disabled={!isUserApproved}
                          onPress={() => {
                            setMyFeedCommunityPostId(item);
                            setisMyFeedPostModal(true);
                          }}>
                          <Image
                            source={localimag.icon_menuGrey}
                            style={{
                              width: (mobileW * 5) / 100,
                              height: (mobileW * 5) / 100,
                              marginLeft: (mobileW * 2) / 100,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        disabled={!isUserApproved}
                        onPress={() => {
                          setisViewCommentsModal(true);
                          GetAllComments(item?.community_post_id);
                          setCommunityPostId(item?.community_post_id);
                          setIsMyFeedComments(true);
                        }}>
                        <Text
                          style={{
                            color: Colors.themeColor,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 3) / 100,
                            marginTop: (mobileW * 3) / 100,
                          }}>
                          {t('viewComments_txt')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        disabled={!isUserApproved}
                        onPress={() => {
                          onCommunityPostShare(item?.community_post_id);
                        }}
                        style={{
                          backgroundColor: Colors.themeColor,
                          padding: (mobileW * 2) / 100,
                          borderRadius: (mobileW * 50) / 100,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={localimag.icon_share_app}
                          style={{
                            width: (mobileW * 4) / 100,
                            height: (mobileW * 4) / 100,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                ListFooterComponent={() =>
                  my_feed_more_data && !isMyFeedLoading ? (
                    <TouchableOpacity
                      onPress={() => GetMyFeed(null, my_feed_offset, false)}
                      style={{
                        alignSelf: 'center',
                        // backgroundColor: Colors.themeColor2,
                        // paddingHorizontal: 20,
                        // paddingVertical: 10,
                        borderRadius: 8,
                        marginTop: (mobileW * 5) / 100,
                        height: (mobileW * 9) / 100,
                      }}>
                      {my_feed_loading_more ? (
                        <ActivityIndicator
                          size={'small'}
                          color={Colors.themeColor2}
                        />
                      ) : (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={{
                            backgroundColor: Colors.themeColor2,
                            paddingHorizontal: (mobileW * 5) / 100,
                            paddingVertical: (mobileW * 2) / 100,
                            borderRadius: (mobileW * 5) / 100,
                          }}
                          onPress={() =>
                            GetMyFeed(null, my_feed_offset, false)
                          }>
                          <Text
                            style={{
                              color: Colors.whiteColor,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 3) / 100,
                            }}>
                            {t('load_more_txt')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  ) : null
                }
              />

              {/* --------------- */}
            </View>
          )}

          {/* -------------------------------------------- */}

          {/* followed communities view */}

          {myCommunitiesStatus && (
            <View
              style={{
                paddingHorizontal: (mobileW * 2) / 100,
                marginTop: (mobileH * 2) / 100,
              }}>
              {/* {!isViewAll && ( */}
              <View>
                {followedCommunities?.length > 0 && (
                  <TouchableOpacity
                    // disabled={!isUserApproved}
                    activeOpacity={0.8}
                    onPress={() => navigate('ViewAllFollowedCommunities')}
                    style={{
                      alignSelf: 'flex-end',
                      alignItems: 'center',
                      borderBottomColor: Colors.themeColor2,
                      borderBottomWidth: (mobileW * 0.3) / 100,
                      marginRight: (mobileW * 2) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontSemibold,
                        fontSize: (mobileW * 3) / 100,
                      }}>
                      {t('viewAll_txt')}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* followed communities  */}
                <FlatList
                  data={followedCommunities}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  contentContainerStyle={{
                    marginTop: (mobileH * 1.5) / 100,
                    gap: (mobileW * 2) / 100,
                    paddingHorizontal: (mobileW * 2) / 100,
                  }}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({item, index}) => (
                    <View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        // disabled={!isUserApproved}
                        onPress={() => {
                          consolepro.consolelog(
                            item?.community_id,
                            'comunity_id',
                          );
                          navigate('JoinCommunity', {
                            community_id: item?.community_id,
                          });
                        }}
                        style={{
                          width: (mobileW * 19) / 100,
                          height: (mobileW * 19) / 100,
                          backgroundColor: Colors.whiteColor,
                          borderRadius: (mobileW * 30) / 100,
                          borderWidth: 2,
                          borderColor: item.status
                            ? Colors.themeColor
                            : Colors.storyBorderColor,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={
                            item?.cover_image
                              ? {
                                  uri: config.img_url + item?.cover_image,
                                }
                              : localimag.icon_blank_community
                          }
                          style={{
                            width: item?.cover_image
                              ? (mobileW * 17.5) / 100
                              : (mobileW * 9) / 100,
                            height: item?.cover_image
                              ? (mobileW * 17.5) / 100
                              : (mobileW * 9) / 100,
                            borderRadius: item?.cover_image
                              ? (mobileW * 30) / 100
                              : (mobileW * 1) / 100,
                          }}
                        />
                      </TouchableOpacity>

                      <Text
                        style={{
                          color: Colors.darkGreenColor,
                          fontSize: (mobileW * 3) / 100,
                          fontFamily: Font.FontSemibold,
                          textAlign: 'center',
                          marginTop: (mobileH * 0.5) / 100,
                        }}>
                        {item?.community_name?.length > 10
                          ? item?.community_name?.slice(0, 10) + '...'
                          : item?.community_name}
                      </Text>
                    </View>
                  )}
                  ListEmptyComponent={() => (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        width: mobileW,
                      }}>
                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 3.5) / 100,
                        }}>
                        {t('no_data_found_txt')}
                      </Text>
                    </View>
                  )}
                />

                {/* followed community post */}
                <FlatList
                  data={followedCommunitiesPost?.filter(item => item !== 'NA')}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={true}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <View
                      style={{
                        width: (mobileW * 90) / 100,
                        alignSelf: 'center',
                        borderWidth: 1,
                        paddingTop: (mobileH * 1.5) / 100,
                        paddingBottom: (mobileH * 2) / 100,
                        borderColor: Colors.borderColor,
                        borderRadius: (mobileW * 2) / 100,
                        marginTop: (mobileH * 1.5) / 100,
                        paddingHorizontal: (mobileW * 3) / 100,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            color: Colors.placeholderTextColor,
                            fontSize: (mobileW * 3.2) / 100,
                            fontFamily: Font.FontSemibold,
                          }}>
                          {t('postedIn_txt')}{' '}
                          <Text
                            style={{
                              color: Colors.themeColor,
                              fontSize: (mobileW * 3.2) / 100,
                              fontFamily: Font.FontSemibold,
                            }}>
                            {item?.community_name?.length > 15
                              ? config.language == 1
                                ? '...' + item?.community_name?.slice(0, 15)
                                : item?.community_name?.slice(0, 15) + '...'
                              : item?.community_name}
                          </Text>
                        </Text>

                        <TouchableOpacity
                          activeOpacity={0.8}
                          // disabled={!isUserApproved}
                          onPress={() =>
                            navigate('JoinCommunity', {
                              type: 1,
                              community_id: item?.community_id,
                            })
                          }>
                          <Text
                            style={{
                              color: Colors.themeColor,
                              fontSize: (mobileW * 3.2) / 100,
                              fontFamily: Font.FontSemibold,
                            }}>
                            {t('viewCommunity_txt')}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          marginVertical: (mobileH * 1.4) / 100,
                          borderWidth: 0.5,
                          borderColor: Colors.borderColor,
                          width: (mobileW * 82) / 100,
                          alignSelf: 'center',
                        }}></View>

                      <View
                        style={{
                          borderRadius: (mobileW * 3) / 100,
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          disabled={!isUserApproved}
                          onPress={() => {
                            // if (item?.bring_type == 0) {
                            //   navigate('UserDetails', {
                            //     other_user_id: item?.user_id,
                            //   });
                            // } else if (item?.bring_type == 1) {
                            //   navigate('WishingPetParentUserDetails', {
                            //     other_user_id: item?.user_id,
                            //   });
                            // }
                          }}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: (mobileH * 1) / 100,
                          }}>
                          <View>
                            <View
                              style={{
                                // backgroundColor: 'blue',
                                // alignSelf: 'flex-start',
                                borderRadius: (mobileW * 30) / 100,
                                overflow: 'hidden',
                              }}>
                              <Image
                                source={
                                  item?.community_image
                                    ? {
                                        uri:
                                          config.img_url +
                                          item?.community_image,
                                      }
                                    : localimag.icon_profile_user
                                }
                                style={{
                                  width: (mobileH * 5.5) / 100,
                                  height: (mobileH * 5.5) / 100,
                                  transform: [
                                    config.language == 1
                                      ? {scaleX: -1}
                                      : {scaleX: 1},
                                  ],
                                }}
                              />
                            </View>

                            {/* <View
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
                                item?.image
                                  ? { uri: config.img_url + item?.cover_image }
                                  : localimag.icon_profile_user
                              }
                              style={{
                                width: (mobileW * 4) / 100,
                                height: (mobileW * 4) / 100,
                                transform: [
                                  config.language == 1
                                    ? { scaleX: -1 }
                                    : { scaleX: 1 },
                                ],
                              }}
                            />
                          </View> */}
                          </View>

                          <View
                            style={{
                              // width: (mobileW * 50) / 100,
                              marginLeft: (mobileW * 3) / 100,
                            }}>
                            <Text
                              style={{
                                fontSize: (mobileW * 3.5) / 100,
                                fontFamily: Font.FontSemibold,
                                color: Colors.blackColor,
                              }}>
                              {item?.title?.length > 15
                                ? config.language == 1
                                  ? '...' + item?.title?.slice(0, 15)
                                  : item?.title?.slice(0, 15) + '...'
                                : item?.title}
                            </Text>
                            {/* <Text
                            numberOfLines={1}
                            style={{
                              width: (mobileW * 30) / 100,
                              fontSize: (mobileW * 2.9) / 100,
                              fontFamily: Font.FontMedium,
                              color: Colors.blackColor,
                            }}>
                            {item?.address}
                          </Text> */}
                          </View>
                        </TouchableOpacity>

                        {/* ---- 4k view---- */}

                        <View
                          style={
                            {
                              // flexDirection: 'row',
                              // alignItems: 'center',
                              // marginTop: (-mobileH * 2.5) / 100,
                            }
                          }>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              // marginTop: (-mobileH * 2.5) / 100,
                            }}>
                            <View
                              style={{
                                height: (mobileH * 3) / 100,
                                borderRadius: (mobileW * 30) / 100,
                                backgroundColor: Colors.homeCardbackgroundColor,
                                paddingHorizontal: (mobileW * 1.5) / 100,
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                {item?.like_members_images != 'NA' &&
                                  item?.like_members_images
                                    ?.slice(0, 3)
                                    .map((user, index) => (
                                      <Image
                                        key={index.toString()}
                                        source={
                                          user?.image
                                            ? {
                                                uri:
                                                  config.img_url + user?.image,
                                              }
                                            : localimag?.icon_profile_user
                                        }
                                        style={{
                                          width: (mobileW * 5) / 100,
                                          height: (mobileW * 5) / 100,
                                          borderRadius: (mobileW * 30) / 100,
                                          marginLeft:
                                            index === 0
                                              ? 0
                                              : (-mobileW * 2.2) / 100,
                                          borderWidth: 1,
                                          borderColor: '#fff',
                                        }}
                                      />
                                    ))}

                                {/* Show "+X" if more than 3 likes */}
                                {item?.like_members_images?.length > 3 && (
                                  <View
                                    style={{
                                      width: (mobileW * 5) / 100,
                                      height: (mobileW * 5) / 100,
                                      borderRadius: (mobileW * 30) / 100,
                                      backgroundColor: '#ccc',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      marginLeft: (-mobileW * 2.2) / 100,
                                      borderWidth: 1,
                                      borderColor: '#fff',
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 2.5) / 100,
                                        color: Colors.blackColor,
                                        fontFamily: Font.FontMedium,
                                      }}>
                                      +{item?.like_members_images?.length - 3}
                                    </Text>
                                  </View>
                                )}
                              </View>

                              <Text
                                style={{
                                  color: Colors.blackColor,
                                  fontSize: (mobileW * 2.8) / 100,
                                  fontFamily: Font.FontSemibold,
                                  marginLeft: (mobileW * 3) / 100,
                                }}>
                                {item?.total_likes}
                              </Text>
                            </View>

                            <TouchableOpacity
                              activeOpacity={0.8}
                              disabled={!isUserApproved}
                              onPress={() =>
                                handleFollowedPostLike(item?.community_post_id)
                              }
                              style={{
                                marginLeft: (mobileW * 3) / 100,
                              }}>
                              <Image
                                source={
                                  item?.like_Status
                                    ? localimag?.icon_like_heart
                                    : localimag.icon_likePost
                                }
                                style={{
                                  width: (mobileW * 7) / 100,
                                  height: (mobileW * 7) / 100,
                                }}
                              />
                            </TouchableOpacity>
                          </View>

                          {item?.username_visible_status == 0 && (
                            <TouchableOpacity
                              activeOpacity={0.8}
                              disabled={!isUserApproved}
                              onPress={() => {
                                if (item?.bring_type == 0) {
                                  navigate('UserDetails', {
                                    other_user_id: item?.user_id,
                                  });
                                } else if (item?.bring_type == 1) {
                                  navigate('WishingPetParentUserDetails', {
                                    other_user_id: item?.user_id,
                                  });
                                }
                              }}
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: (mobileW * 2) / 100,
                                alignSelf: 'flex-end',
                              }}>
                              {/* Profile Image Stack (Community + User) */}
                              <View
                                style={{
                                  position: 'relative',
                                  marginRight: (mobileW * 2) / 100,
                                }}>
                                {/* Community Image */}
                                <View
                                  style={{
                                    borderRadius: (mobileH * 3.5) / 2 / 100,
                                    overflow: 'hidden',
                                  }}>
                                  <Image
                                    source={
                                      item?.user_image
                                        ? {
                                            uri:
                                              config.img_url + item?.user_image,
                                          }
                                        : localimag.icon_profile_user
                                    }
                                    style={{
                                      width: (mobileH * 3.5) / 100,
                                      height: (mobileH * 3.5) / 100,
                                      transform: [
                                        config.language == 1
                                          ? {scaleX: -1}
                                          : {scaleX: 1},
                                      ],
                                    }}
                                  />
                                </View>

                                {/* User Image Overlay */}

                                {item?.bring_type == 0 && (
                                  <View
                                    style={{
                                      position: 'absolute',
                                      top: (-mobileW * 1) / 100,
                                      right: (-mobileW * 1) / 100,
                                      borderRadius: (mobileW * 4) / 2 / 100,
                                      overflow: 'hidden',
                                      borderWidth: 1,
                                      borderColor: '#fff',
                                      backgroundColor: '#fff',
                                    }}>
                                    <Image
                                      source={
                                        item?.pet_image
                                          ? {
                                              uri:
                                                config.img_url + item.pet_image,
                                            }
                                          : localimag.icon_profile_user
                                      }
                                      style={{
                                        width: (mobileW * 3) / 100,
                                        height: (mobileW * 3) / 100,
                                        transform: [
                                          config.language == 1
                                            ? {scaleX: -1}
                                            : {scaleX: 1},
                                        ],
                                      }}
                                    />
                                  </View>
                                )}
                              </View>

                              {/* Text Section */}

                              <View style={{justifyContent: 'center'}}>
                                <TouchableOpacity
                                  activeOpacity={1}
                                  disabled={!isUserApproved}
                                  onPress={() => {}}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Colors.placeholderTextColor,
                                      fontFamily: Font.FontMedium,
                                      fontSize: (mobileW * 2) / 100,
                                    }}>
                                    Posted By
                                  </Text>
                                </TouchableOpacity>

                                <Text
                                  numberOfLines={1}
                                  style={{
                                    color: Colors.themeColor2,
                                    fontFamily: Font.FontMedium,
                                    fontSize: (mobileW * 2.5) / 100,
                                    maxWidth: (mobileW * 20) / 100,
                                  }}>
                                  {item?.name}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>

                      {/* video image view */}

                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginVertical: (mobileW * 5) / 100,
                          width: (mobileW * 80) / 100,
                          height: (mobileH * 60) / 100,
                          alignSelf: 'center',
                        }}>
                        {item?.type == 2 ? (
                          <TouchableOpacity
                            // disabled={!isUserApproved}
                            activeOpacity={0.8}
                            onPress={() => {
                              navigate('VideoPreview', {
                                uri: config.img_url + item?.image_video,
                                type: 1,
                              });
                            }}>
                            <Image
                              source={
                                item?.image_video
                                  ? {uri: config.img_url + item?.thumbnail}
                                  : ''
                              }
                              style={{
                                width: (mobileW * 80) / 100,
                                height: (mobileH * 60) / 100,
                              }}
                            />
                            <TouchableOpacity
                              // disabled={!isUserApproved}
                              onPress={() => {
                                navigate('VideoPreview', {
                                  uri: config.img_url + item?.image_video,
                                  type: 1,
                                });
                              }}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: [
                                  {translateX: -(mobileW * 5) / 100},
                                  {translateY: -(mobileW * 5) / 100},
                                ],
                              }}>
                              <Image
                                source={localimag.icon_play_icon}
                                style={{
                                  width: (mobileW * 10) / 100,
                                  height: (mobileW * 10) / 100,
                                }}
                              />
                            </TouchableOpacity>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            // disabled={!isUserApproved}
                            onPress={() => {
                              navigate('VideoPreview', {
                                uri: config.img_url + item?.image_video,
                                type: 0,
                              });
                            }}>
                            <Image
                              source={
                                item?.image_video
                                  ? {uri: config.img_url + item?.image_video}
                                  : ''
                              }
                              style={{
                                width: (mobileW * 80) / 100,
                                height: (mobileH * 60) / 100,
                              }}
                            />
                          </TouchableOpacity>
                        )}
                      </View>

                      <View
                        style={{
                          marginTop: (mobileH * 0.8) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.blackColor,
                            fontSize: (mobileW * 3.3) / 100,
                            fontFamily: Font.FontMedium,
                            textAlign: config.language == 1 ? 'left' : 'left',
                          }}>
                          {item?.description}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginTop: (mobileH * 1.4) / 100,
                          borderWidth: 0.5,
                          borderColor: Colors.borderColor,
                          width: (mobileW * 82) / 100,
                          alignSelf: 'center',
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: (mobileH * 0.3) / 100,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={localimag.icon_comment}
                            style={{
                              width: (mobileW * 5) / 100,
                              height: (mobileW * 5) / 100,
                              transform: [
                                config.language == 1
                                  ? {scaleX: -1}
                                  : {scaleX: 1},
                              ],
                            }}
                          />

                          <TextInput
                            placeholderTextColor={Colors.themeColor}
                            returnKeyLabel="done"
                            returnKeyType="done"
                            onSubmitEditing={() => {
                              Keyboard.dismiss();
                            }}
                            keyboardType="default"
                            style={{
                              width: (mobileW * 66) / 100,
                              marginLeft: (mobileW * 1) / 100,
                              height: (mobileH * 5) / 100,
                              color: Colors.themeColor,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 3.3) / 100,
                              paddingBottom: 3,
                              textAlign:
                                config.language == 1 ? 'right' : 'left',
                            }}
                            placeholder={t('comment_txt')}
                            // onChangeText={val => setValue(val)}
                            // value={value}
                            value={value[index] || ''} // Each item gets its own comment
                            onChangeText={val =>
                              setValue(prev => ({...prev, [index]: val}))
                            }
                            maxLength={250}
                            editable={isUserApproved}
                          />
                        </View>

                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={!isUserApproved}
                            onPress={() => {
                              setValue('');
                              handleComments(item?.community_post_id, index);
                            }}>
                            <Image
                              source={localimag.icon_send}
                              style={{
                                width: (mobileW * 5) / 100,
                                height: (mobileW * 5) / 100,
                                transform: [
                                  config.language == 1
                                    ? {scaleX: -1}
                                    : {scaleX: 1},
                                ],
                              }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={!isUserApproved}
                            onPress={() => {
                              setCommunityPostId(item?.community_post_id);
                              setPost_user_name(item?.name);
                              setModalStaus(true);
                              setOther_user_id(item?.user_id);
                            }}>
                            <Image
                              source={localimag.icon_menuGrey}
                              style={{
                                width: (mobileW * 5) / 100,
                                height: (mobileW * 5) / 100,
                                marginLeft: (mobileW * 2) / 100,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginHorizontal: (mobileW * 1) / 100,
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.6}
                          disabled={!isUserApproved}
                          onPress={() => {
                            setIsFollowedCommunityCommentsModal(true);
                            GetAllComments(item?.community_post_id);
                            setCommunityPostId(item?.community_post_id);
                          }}>
                          <Text
                            style={{
                              color: Colors.themeColor,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 3) / 100,
                              marginTop: (mobileW * 3) / 100,
                            }}>
                            {t('viewComments_txt')}
                          </Text>
                        </TouchableOpacity>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <TouchableOpacity
                            activeOpacity={0.6}
                            disabled={!isUserApproved}
                            onPress={() => {
                              onCommunityPostShare(item?.community_post_id);
                            }}
                            style={{
                              backgroundColor: Colors.themeColor,
                              padding: (mobileW * 2) / 100,
                              borderRadius: (mobileW * 50) / 100,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Image
                              source={localimag.icon_share_app}
                              style={{
                                width: (mobileW * 4) / 100,
                                height: (mobileW * 4) / 100,
                              }}
                            />
                          </TouchableOpacity>
                          {/* <Text
                          style={
                            {
                              color: Colors.themeColor,
                              fontFamily: Font.FontMedium,
                              fontSize: mobileW * 3 / 100,
                              marginLeft: mobileW * 1 / 100
                            }}>{item?.share_count}</Text> */}
                        </View>
                      </View>
                    </View>
                  )}
                  // ListEmptyComponent={() =>
                  //   <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  //     <Text style={{color: Colors.ColorBlack, fontFamily: Font.FontMedium, fontSize: mobileW * 3 /100}}>{t('no_data_found_txt')}</Text>
                  //   </View>
                  // }
                  removeClippedSubviews={true} // ✅ Recycles off-screen items
                  initialNumToRender={10} // ✅ Renders small batch initially
                  maxToRenderPerBatch={5} // ✅ Limits batch size
                  windowSize={5} // ✅ Keeps small render window
                  updateCellsBatchingPeriod={50} // ✅ Smooth rendering
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={() =>
                    followed_community_more_data ? (
                      <TouchableOpacity
                        onPress={() =>
                          GetFollowedCommunities(
                            followed_community_offset,
                            false,
                          )
                        }
                        style={{
                          alignSelf: 'center',
                          // backgroundColor: Colors.themeColor2,
                          // paddingHorizontal: 20,
                          // paddingVertical: 10,
                          borderRadius: 8,
                          marginTop: (mobileW * 5) / 100,
                          height: (mobileW * 9) / 100,
                        }}>
                        {followed_loading_more ? (
                          <ActivityIndicator
                            size={'small'}
                            color={Colors.themeColor2}
                          />
                        ) : (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                              backgroundColor: Colors.themeColor2,
                              paddingHorizontal: (mobileW * 5) / 100,
                              paddingVertical: (mobileW * 2) / 100,
                              borderRadius: (mobileW * 5) / 100,
                            }}
                            onPress={() =>
                              GetFollowedCommunities(
                                followed_community_offset,
                                false,
                              )
                            }>
                            <Text
                              style={{
                                color: Colors.whiteColor,
                                fontFamily: Font.FontMedium,
                                fontSize: (mobileW * 3) / 100,
                              }}>
                              {t('load_more_txt')}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </TouchableOpacity>
                    ) : null
                  }
                />
              </View>
              {/* )} */}

              {/* view all  */}
              {isViewAll && (
                <FlatList
                  data={viewAllFollowedCommunities}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    marginTop: (mobileH * 2) / 100,
                    gap: (mobileW * 4) / 100,
                    paddingHorizontal: (mobileW * 5) / 100,
                    paddingBottom: (mobileH * 8) / 100,
                  }}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({item, index}) => (
                    <AllFollowedCommunity item={item} index={index} t={t} />
                  )}
                />
              )}
            </View>
          )}

          {/* all community */}

          {allCommunity && (
            <View style={{flex: 1}}>
              <FlatList
                data={filteredCommunityData}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  marginTop: (mobileH * 2) / 100,
                  gap: (mobileW * 4) / 100,
                  paddingHorizontal: (mobileW * 5) / 100,
                  paddingBottom: (mobileH * 8) / 100,
                }}
                keyboardShouldPersistTaps="handled"
                renderItem={({item, index}) => (
                  <CardView
                    item={item}
                    index={index}
                    t={t}
                    isUserApproved={isUserApproved}
                  />
                )}
                ListFooterComponent={() =>
                  hasMoreData && !isAllCommunityLoading ? (
                    <TouchableOpacity
                      onPress={() => GetAllCommunity(offset, false)}
                      style={{
                        alignSelf: 'center',
                        // backgroundColor: Colors.themeColor2,
                        // paddingHorizontal: 20,
                        // paddingVertical: 10,
                        borderRadius: 8,
                        marginTop: (mobileW * 5) / 100,
                        height: (mobileW * 9) / 100,
                      }}>
                      {loadingMore ? (
                        <ActivityIndicator
                          size={'small'}
                          color={Colors.themeColor2}
                        />
                      ) : (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={{
                            backgroundColor: Colors.themeColor2,
                            paddingHorizontal: (mobileW * 5) / 100,
                            paddingVertical: (mobileW * 2) / 100,
                            borderRadius: (mobileW * 5) / 100,
                          }}
                          onPress={() => GetAllCommunity(offset, false)}>
                          <Text
                            style={{
                              color: Colors.whiteColor,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 3) / 100,
                            }}>
                            {t('load_more_txt')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  ) : null
                }
                ListEmptyComponent={() => {
                  if (isAllCommunityLoading) {
                    return null; // Don't show anything while loading
                  }

                  if (
                    !isAllCommunityLoading &&
                    filteredCommunityData?.length == 0
                  ) {
                    return (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                          width: mobileW,
                        }}>
                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 3.5) / 100,
                          }}>
                          {t('no_data_found_txt')}
                        </Text>
                      </View>
                    );
                  }

                  return null; // Return null in all other cases
                }}
              />
            </View>
          )}
        </KeyboardAwareScrollView>

        {/* ------------------------------ */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalStatus}
          onRequestClose={() => setModalStaus(false)}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalStaus(false)}
            style={styles.containerStyle}>
            <View style={styles.subContainerStyle}>
              <TouchableOpacity
                onPress={() => setModalStaus(false)}
                activeOpacity={0.8}
                style={{
                  marginTop: (mobileH * 2) / 100,
                }}>
                <Image
                  source={localimag.icon_goBack}
                  style={{
                    width: (mobileW * 6) / 100,
                    height: (mobileW * 6) / 100,
                    tintColor: Colors.darkGreenColor,
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                />
              </TouchableOpacity>

              {/* Interested */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedReportOption(1);
                  setTimeout(() => {
                    handleReportPost();
                  }, 700);
                }}
                style={{
                  flexDirection: 'row',
                  marginTop: (mobileH * 3) / 100,
                }}>
                <Image
                  source={localimag.icon_interested}
                  style={{
                    width: (mobileW * 6) / 100,
                    height: (mobileW * 6) / 100,
                  }}
                />

                <View
                  style={{
                    marginLeft: (mobileW * 1) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.darkGreenColor,
                      fontSize: (mobileW * 4) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {t('interested_txt')}
                  </Text>
                  <Text
                    style={{
                      color: Colors.subTitleColor,
                      fontSize: (mobileW * 2.7) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {t('moreSuggestedPosts_txt')}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* not interested */}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedReportOption(2);
                  setTimeout(() => {
                    handleReportPost();
                  }, 700);
                }}
                style={{
                  flexDirection: 'row',
                  marginTop: (mobileH * 1) / 100,
                }}>
                <Image
                  source={localimag.icon_notInterested}
                  style={{
                    width: (mobileW * 6) / 100,
                    height: (mobileW * 6) / 100,
                  }}
                />

                <View
                  style={{
                    marginLeft: (mobileW * 1) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.darkGreenColor,
                      fontSize: (mobileW * 4) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {t('notInterested_txt')}
                  </Text>
                  <Text
                    style={{
                      color: Colors.subTitleColor,
                      fontSize: (mobileW * 2.7) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {t('lessSuggestedPost_txt')}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Hide post */}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedReportOption(3);
                  setTimeout(() => {
                    handleReportPost();
                  }, 700);
                }}
                style={{
                  flexDirection: 'row',
                  marginTop: (mobileH * 1) / 100,
                }}>
                <Image
                  source={localimag.icon_hidePost}
                  style={{
                    width: (mobileW * 6) / 100,
                    height: (mobileW * 6) / 100,
                  }}
                />

                <View
                  style={{
                    marginLeft: (mobileW * 1) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.darkGreenColor,
                      fontSize: (mobileW * 4) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {t('hidePost_txt')}
                  </Text>
                  <Text
                    style={{
                      color: Colors.subTitleColor,
                      fontSize: (mobileW * 2.7) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {t('seeFewerPostLikeThis_txt')}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Report post */}

              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  marginTop: (mobileH * 1) / 100,
                }}
                onPress={() => {
                  setModalStaus(false);
                  setReportProfilePopUp(true);
                  setSelectedReportOption(4);
                }}>
                <Image
                  source={localimag.icon_reportPost}
                  style={{
                    width: (mobileW * 6) / 100,
                    height: (mobileW * 6) / 100,
                  }}
                />

                <View
                  style={{
                    marginLeft: (mobileW * 1) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.darkGreenColor,
                      fontSize: (mobileW * 4) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {t('reportPost_txt')}
                  </Text>
                  <Text
                    style={{
                      color: Colors.subTitleColor,
                      fontSize: (mobileW * 2.7) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {t('weWontletDiscover_txt')}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* hide all from */}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedReportOption(1);
                  setTimeout(() => {
                    handleReportPost();
                  }, 700);
                }}
                style={{
                  flexDirection: 'row',
                  marginTop: (mobileH * 1) / 100,
                }}>
                <Image
                  source={localimag.icon_hidePost}
                  style={{
                    width: (mobileW * 6) / 100,
                    height: (mobileW * 6) / 100,
                  }}
                />

                <View
                  style={{
                    marginLeft: (mobileW * 1) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.darkGreenColor,
                      fontSize: (mobileW * 4) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {t('hideAllfrom_txt')} {`${post_user_name}`}
                  </Text>
                  <Text
                    style={{
                      color: Colors.subTitleColor,
                      fontSize: (mobileW * 2.7) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {t('stopSeeingPost_txt')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/*  report profile modal  */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={reportProfilePopUp}
          requestClose={() => {
            setReportProfilePopUp(false);
            setReportReason(0);
          }}>
          <TouchableOpacity
            onPress={() => {
              setReportProfilePopUp(false);
              setReportReason(0);
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
                    {t('report_txt')}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setReportProfilePopUp(false);
                    setReportReason(0);
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

                <FlatList
                  data={REPORT_DATA}
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
                          setReport_reason_text(item?.report_reason[0]);
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
                  onPress={() => {
                    handleReportPost();
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/*  Report Thanks modal  */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={reportThanksModal}
          requestClose={() => {
            setReportThanksModal(false);
          }}>
          <TouchableOpacity
            onPress={() => {
              setReportThanksModal(false);
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
                width: mobileW,
              }}>
              <View style={{backgroundColor: Colors.whiteColor, flex: 1}}>
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

                <View style={{marginHorizontal: (mobileW * 10) / 100}}>
                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 4.5) / 100,
                      alignSelf: 'flex-start',
                      marginTop: (mobileW * 3) / 100,
                    }}>
                    {t('other_steps_you_can_take')}
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{marginTop: (mobileW * 2) / 100}}
                    onPress={() => {
                      setReportThanksModal(false);
                      setBlockModal(true);
                    }}>
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
                          }}>{`${t(
                          'block_txt',
                        )} ${post_user_name} Profile`}</Text>
                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontLight,
                            fontSize: (mobileW * 3) / 100,
                          }}>
                          {t('youwontBeAbleTo_txt')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
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
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedReportOption(5);
                        setTimeout(() => {
                          ManageHidAllFrom();
                        }, 300);
                      }}>
                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 4) / 100,
                          marginLeft: (mobileW * 2) / 100,
                        }}>{`${t('hideAllFrom_txt')} ${post_user_name}`}</Text>
                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontLight,
                          fontSize: (mobileW * 3) / 100,
                        }}>
                        {t('stopSeeingThePerson_txt')}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>

                <CommonButton
                  title={t('done_txt')}
                  containerStyle={{
                    backgroundColor: Colors.themeColor2,
                    marginVertical: (mobileW * 5) / 100,
                    width: (mobileW * 70) / 100,
                  }}
                  onPress={() => {
                    setTimeout(() => {
                      setReportThanksModal(false);
                      GetFollowedCommunities(0, false);
                    }, 700);
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
                paddingHorizontal: (mobileW * 3) / 100,
              }}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontBold,
                  fontSize: (mobileW * 6) / 100,
                  textAlign: 'center',
                }}>{`${t('block_txt')} ${post_user_name}?`}</Text>

              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3) / 100,
                  textAlign: 'center',
                }}>{`${post_user_name} ${t('willNoLonger_txt')}`}</Text>

              <View style={{marginTop: (mobileW * 2) / 100}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                    {' '}
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
                    {' '}
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
                    {' '}
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
                  onPress={() => {
                    handleUserBlocked();
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* blocked modal  */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={blockedSuccessfully}
          requestClose={() => setBlockedSuccessfully(false)}>
          <TouchableOpacity
            onPress={() => {
              setBlockedSuccessfully(false);
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
                {`${t('youBlocked_txt')} ${post_user_name}`}
              </Text>
              <Text
                style={{
                  width: (mobileW * 55) / 100,
                  color: Colors.ColorBlack,
                  fontSize: (mobileW * 3) / 100,
                  fontFamily: Font.FontRegular,
                  textAlign: 'center',
                }}>
                {t('block_description_txt')}
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
                    setTimeout(() => {
                      GetFollowedCommunities(0, false);
                    }, 700);
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

        {/* community post modal */}

        <Modal
          transparent={true}
          visible={isCommunityPostModal}
          animationType="fade">
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => {
              setIsCommunityPostModal(false);
            }}>
            <View style={styles.dropdown}>
              <FlatList
                data={communityPost}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      index === communityPost.length - 1 && styles.lastOption,
                    ]}
                    onPress={() => handleCommunityPost(item)}>
                    <Text style={styles.optionText}>
                      {item?.community_name}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text
                      style={{
                        color: Colors.ColorBlack,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3.5) / 100,
                      }}>
                      {t('no_data_found_txt')}
                    </Text>
                  </View>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* user post edit and delete post */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isMyFeedPostModal}
          requestClose={() => {
            setisMyFeedPostModal(false);
          }}>
          <TouchableOpacity
            onPress={() => {
              setisMyFeedPostModal(false);
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
                bottom: (-mobileW * 4) / 100,
                borderTopEndRadius: (mobileW * 5) / 100,
                borderTopLeftRadius: (mobileW * 5) / 100,
                width: mobileW,
              }}>
              <View
                style={{
                  width: (mobileW * 10) / 100,
                  height: (mobileW * 1) / 100,
                  backgroundColor: Colors.placeholderTextColor,
                  alignSelf: 'center',
                  marginTop: (mobileW * 4) / 100,
                }}></View>
              <View
                style={{
                  backgroundColor: Colors.whiteColor,
                  flex: 1,
                  paddingVertical: (mobileW * 15) / 100,
                  borderTopEndRadius: (mobileW * 5) / 100,
                  borderTopLeftRadius: (mobileW * 5) / 100,
                  paddingHorizontal: (mobileW * 6) / 100,
                }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    setisMyFeedPostModal(false);
                    navigate('PostEdit', {post: myFeedCommunityPostId});
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: (mobileW * 2) / 100,
                  }}>
                  <Image
                    source={localimag.icon_edit_pen}
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
                      marginLeft: (mobileW * 3) / 100,
                    }}>
                    {t('edit_txt')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => {
                    setisMyFeedPostModal(false);
                    setIsPostDeleteModal(true);
                  }}>
                  <Image
                    source={localimag.icon_trash}
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
                      marginLeft: (mobileW * 3) / 100,
                    }}>
                    {t('delete_btn_txt')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* view Comments Modal */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isViewCommentsModal}
          requestClose={() => {
            setisViewCommentsModal(false);
          }}>
          <TouchableOpacity
            onPress={() => setisViewCommentsModal(false)}
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
                borderTopEndRadius: (mobileW * 7) / 100,
                borderTopLeftRadius: (mobileW * 7) / 100,
                width: mobileW,
                flex: 1,
                height: isKeyboardVisible
                  ? config.device_type == 'ios'
                    ? (mobileH * 80) / 100
                    : (mobileH * 60) / 100
                  : config.device_type == 'ios'
                  ? (mobileH * 90) / 100
                  : (mobileH * 90) / 100,
                elevation: 10, // Android shadow
                shadowColor: '#000', // iOS shadow color
                shadowOffset: {width: 0, height: 5}, // iOS shadow offset
                shadowOpacity: 0.3, // iOS shadow opacity
                shadowRadius: 6,
              }}>
              <View
                style={{
                  width: (mobileW * 10) / 100,
                  height: (mobileW * 1) / 100,
                  backgroundColor: Colors.placeholderTextColor,
                  alignSelf: 'center',
                  marginTop: (mobileW * 4) / 100,
                }}></View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setisViewCommentsModal(false);
                  setCommentText(null);
                  setReplyTo(null);
                }}
                style={{
                  width: (mobileW * 10) / 100,
                  height: (mobileW * 10) / 100,
                  alignSelf: 'flex-end',
                }}>
                <Image
                  source={localimag?.icon_cross}
                  style={{
                    width: (mobileW * 4) / 100,
                    height: (mobileW * 4) / 100,
                    tintColor: Colors.themeColor2,
                    marginRight: (mobileW * 6) / 100,
                  }}
                />
              </TouchableOpacity>
              <View style={{backgroundColor: Colors.whiteColor, flex: 1}}>
                <FlatList
                  data={commentsData}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingTop: (mobileW * 7) / 100,
                    paddingBottom: (mobileH * 15) / 100,
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <View
                      style={{
                        paddingHorizontal: (mobileW * 6) / 100,
                        paddingVertical: (mobileW * 2) / 100,
                        backgroundColor: Colors.whiteColor,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                        }}>
                        <Image
                          source={
                            item?.image
                              ? {uri: config.img_url + item?.image}
                              : localimag.icon_profile_user
                          }
                          style={{
                            width: (mobileW * 8) / 100,
                            height: (mobileW * 8) / 100,
                            borderRadius: (mobileW * 4) / 100,
                            marginRight: (mobileW * 3) / 100,
                          }}
                        />

                        <View
                          style={{flex: 1, backgroundColor: Colors.whiteColor}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  color: Colors.themeColor2,
                                  fontFamily: Font.FontSemibold,
                                  fontSize: (mobileW * 3.2) / 100,
                                }}>
                                {item?.name}
                              </Text>
                              <Text
                                style={{
                                  color: Colors.placeholderTextColor,
                                  fontFamily: Font.FontMedium,
                                  fontSize: (mobileW * 3) / 100,
                                  marginLeft: (mobileW * 2) / 100,
                                }}>
                                {item?.createtime}
                              </Text>
                            </View>

                            {/* Like Icon */}
                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => {
                                handleLikeComments(item?.community_comment_id);
                              }}>
                              <Image
                                source={
                                  item?.like_status
                                    ? localimag?.icon_like_heart
                                    : localimag?.icon_likePost
                                }
                                style={{
                                  width: (mobileW * 4) / 100,
                                  height: (mobileW * 4) / 100,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              direction: config.language == 1 ? 'rtl' : 'ltr',
                            }}>
                            <Text
                              style={{
                                color: Colors.themeColor2,
                                fontSize: (mobileW * 3) / 100,
                                fontFamily: Font.FontMedium,
                                marginTop: (mobileW * 1) / 100,
                                // textAlign: config.language == 1 ? 'right' : 'left',
                              }}>
                              {item?.comment}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            {item?.replies?.length <= 0 && (
                              <TouchableOpacity
                                onPress={() => handleReply(item)}>
                                <Text
                                  style={{
                                    color: Colors.placeholderTextColor,
                                    fontFamily: Font.FontRegular,
                                    fontSize: (mobileW * 3) / 100,
                                    marginTop: (mobileW * 1) / 100,
                                    textAlign:
                                      config.language == 1 ? 'right' : 'left',
                                    marginRight: (mobileW * 1) / 100,
                                  }}>
                                  {t('reply_txt')}
                                </Text>
                              </TouchableOpacity>
                            )}

                            {isMyFeedComments && (
                              <TouchableOpacity
                                onPress={() =>
                                  handleCommentDelete(
                                    item?.community_comment_id,
                                    1,
                                  )
                                }>
                                <Text
                                  style={{
                                    color: Colors.placeholderTextColor,
                                    fontFamily: Font.FontRegular,
                                    fontSize: (mobileW * 3) / 100,
                                    marginTop: (mobileW * 1) / 100,
                                    textAlign:
                                      config.language == 1 ? 'right' : 'left',
                                  }}>
                                  {t('delete_btn_txt')}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                          {item?.replies?.slice(0, 1).map((item, index) => (
                            <View
                              style={{
                                flexDirection: 'row',
                                marginTop: (mobileW * 4) / 100,
                                paddingLeft: (mobileW * 10) / 100, // indent the reply
                              }}>
                              <Image
                                source={
                                  item?.image
                                    ? {uri: config.img_url + item?.image}
                                    : localimag.icon_profile_user
                                }
                                style={{
                                  width: (mobileW * 6) / 100,
                                  height: (mobileW * 6) / 100,
                                  borderRadius: (mobileW * 3) / 100,
                                  marginRight: (mobileW * 2) / 100,
                                  alignSelf: 'flex-start',
                                }}
                              />

                              <View style={{flex: 1}}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Text
                                      style={{
                                        color: Colors.themeColor2,
                                        fontFamily: Font.FontSemibold,
                                        fontSize: (mobileW * 3.2) / 100,
                                      }}>
                                      {item?.name || 'Reply User'}
                                    </Text>
                                    <Text
                                      style={{
                                        color: Colors.placeholderTextColor,
                                        fontFamily: Font.FontMedium,
                                        fontSize: (mobileW * 3) / 100,
                                        marginLeft: (mobileW * 2) / 100,
                                      }}>
                                      {item?.createtime}
                                    </Text>
                                  </View>
                                </View>

                                <Text
                                  style={{
                                    color: Colors.themeColor2,
                                    fontSize: (mobileW * 3) / 100,
                                    fontFamily: Font.FontMedium,
                                    marginTop: (mobileW * 1) / 100,
                                    // textAlign:
                                    //   config.language == 1 ? 'left' : 'right',
                                  }}>
                                  {item?.reply}
                                </Text>

                                {isMyFeedComments && (
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleCommentDelete(
                                        item?.comment_reply_like_id,
                                        2,
                                      )
                                    }>
                                    <Text
                                      style={{
                                        color: Colors.placeholderTextColor,
                                        fontFamily: Font.FontRegular,
                                        fontSize: (mobileW * 3) / 100,
                                        marginTop: (mobileW * 1) / 100,
                                        textAlign:
                                          config.language == 1
                                            ? 'right'
                                            : 'left',
                                      }}>
                                      {t('delete_btn_txt')}
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}
                  ListEmptyComponent={(item, index) => (
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 3) / 100,
                        }}>
                        {t('not_comment_yet_txt')}
                      </Text>
                    </View>
                  )}
                />
              </View>
              <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={(mobileH * 10) / 100}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  backgroundColor: Colors.whiteColor,
                  width: mobileW,
                  alignSelf: 'center',
                  elevation: 9, // Android shadow
                  shadowColor: '#000', // iOS shadow
                  shadowOffset: {width: 0, height: 3},
                  shadowOpacity: 0.4,
                  shadowRadius: 3.84,
                }}>
                <View
                  style={{
                    marginVertical: (mobileW * 1) / 100,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    backgroundColor: Colors.whiteColor,
                  }}>
                  <TextInput
                    ref={commentInputRef}
                    value={commentText}
                    onChangeText={val => setCommentText(val)}
                    placeholder={
                      replyTo?.name
                        ? `Replying to ${replyTo?.name}`
                        : t('add_comment_txt')
                    }
                    style={{
                      width: (mobileW * 85) / 100,
                      height: (mobileW * 13) / 100,
                      // backgroundColor: 'red',
                      alignSelf: 'center',
                      paddingVertical: (mobileW * 2) / 100,
                      paddingHorizontal: (mobileW * 3) / 100,
                      borderRadius: (mobileW * 10) / 100,
                      color: Colors.themeColor2,
                      textAlign: config.language == 1 ? 'right' : 'left',
                    }}
                    placeholderTextColor={Colors.themeColor2}
                    maxLength={250}
                  />
                  <TouchableOpacity
                    onPress={handleSendComment}
                    style={{
                      width: (mobileW * 9) / 100,
                      height: (mobileW * 9) / 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: (mobileW * 4) / 100,
                    }}
                    activeOpacity={0.6}>
                    <Image
                      source={localimag.icon_send}
                      style={{
                        width: (mobileW * 5) / 100,
                        height: (mobileW * 5) / 100,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Camera gallery modal */}

        <Modal animationType="slide" transparent={true} visible={mediamodal}>
          <TouchableOpacity
            onPress={() => setMediamodal(false)}
            activeOpacity={1}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#00000090',
            }}>
            <View
              style={{
                // width: (mobileW * 65) / 100,
                paddingVertical: (mobileH * 3) / 100,
                paddingHorizontal: (mobileH * 3) / 100,
                borderRadius: (mobileW * 3) / 100,
                backgroundColor: Colors.whiteColor,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: (mobileW * 4.2) / 100,
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: (mobileH * 2) / 100,
                }}>
                {t('Select_option_txt')}
              </Text>
              {/* Gallery Option */}
              <TouchableOpacity
                onPress={() => openGallery({type: 1})}
                activeOpacity={0.8}
                style={styles.button}>
                <Text style={styles.buttonText}>{t('Mediagallery')}</Text>
              </TouchableOpacity>

              {/* Camera Option */}
              <TouchableOpacity
                onPress={() => openCamera({type: 1})}
                activeOpacity={0.8}
                style={styles.button}>
                <Text style={styles.buttonText}>{t('MediaCamera')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openGalleryVideo({type: 2})}
                activeOpacity={0.8}
                style={styles.button}>
                <Text style={styles.buttonText}>
                  {t('video_from_gallery_txt')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setVideoRecordingModal(true);
                  setMediamodal(false);
                }}
                activeOpacity={0.8}
                style={styles.button}>
                <Text style={styles.buttonText}>
                  {t('video_from_camera_txt')}
                </Text>
              </TouchableOpacity>

              {/* Cancel */}

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={() => {
                  setMediamodal(false);
                }}>
                <Text style={[styles.buttonText, {color: 'red'}]}>
                  {t('cancel_txt')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* delete confirm modal post*/}

        <ConfirmModal
          visible={isPostDeleteModal}
          button={true}
          btnText={t('delete_btn_txt')}
          onCancelBtn={true}
          onCancelText={t('cancelmedia')}
          onCancelPress={() => setIsPostDeleteModal(false)}
          onCrosspress={() => setIsPostDeleteModal(false)}
          message={t('areyousure_txt')}
          content={t('you_want_to_delete_post_txt')}
          onPress={() => {
            handlePostDelete();
          }}
          popupicon={localimag.icon_green_tick}
        />

        {/*  delete confirm modal community */}

        <ConfirmModal
          visible={isDeleteCommunityModal}
          button={true}
          btnText={t('delete_btn_txt')}
          onCancelBtn={true}
          onCancelText={t('cancelmedia')}
          onCancelPress={() => setisDeleteCommunityModal(false)}
          onCrosspress={() => setisDeleteCommunityModal(false)}
          message={t('areyousure_txt')}
          content={t('you_want_to_delete_community_txt')}
          onPress={() => {
            handleDeleteCommunity();
          }}
          popupicon={localimag.icon_green_tick}
        />

        {/* Video recording modal */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={videoRecordingModal}
          requestClose={() => {
            setVideoRecordingModal(false);
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.themeColor2,
              marginTop: statusBarHeight,
            }}>
            {/* Top bar */}
            <View
              style={{
                height: (mobileH * 10) / 100,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 15,
                zIndex: 2,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
              }}>
              <TouchableOpacity onPress={() => setVideoRecordingModal(false)}>
                <Image
                  source={localimag.icon_back_arrow}
                  style={{
                    width: (mobileW * 5) / 100,
                    height: (mobileW * 5) / 100,
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                  tintColor={Colors.whiteColor}
                />
              </TouchableOpacity>

              {/* Timer Text */}

              <Text
                style={{
                  color: Colors.whiteColor,
                  fontSize: 18,
                  marginLeft: 20,
                  fontWeight: 'bold',
                }}>
                {formatTime(recordingTime)}
              </Text>

              {showPreview ? (
                <TouchableOpacity
                  onPress={async () => {
                    const statResult = await RNFS.stat(videoUri);
                    const fileSizeInMB = (
                      statResult.size /
                      (1024 * 1024)
                    ).toFixed(2);

                    console.log(`Video Size: ${fileSizeInMB} MB`);

                    if (fileSizeInMB > 50) {
                      msgProvider.toast(
                        t('please_select_a_video_smaller_than_50_md_txt'),
                        'bottom',
                      );
                      return false;
                    }
                    handleRecordedVideo({
                      uri: videoUri,
                      type: 2,
                      thumbnail: thumbnail,
                    });

                    setTimeout(() => {
                      setVideoRecordingModal(false);
                    }, 200);
                  }}
                  style={{
                    position: 'absolute',
                    right: (mobileW * 5) / 100,
                    backgroundColor: Colors.themeColor,
                    paddingHorizontal: (mobileW * 7) / 100,
                    paddingVertical: (mobileW * 1.5) / 100,
                    borderRadius: 10,
                    zIndex: 10,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                    //   bottom: (mobileW * 13) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontBold,
                      fontSize: (mobileW * 3.2) / 100,
                    }}>
                    {t('next_txt')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setCameraType(prevType =>
                      prevType === RNCamera.Constants.Type.back
                        ? RNCamera.Constants.Type.front
                        : RNCamera.Constants.Type.back,
                    );
                  }}
                  disabled={isRecording}
                  style={{position: 'absolute', right: (mobileW * 5) / 100}}>
                  <Image
                    style={{
                      width: (mobileW * 7) / 100,
                      height: (mobileW * 7) / 100,
                      tintColor: Colors.themeColor,
                    }}
                    source={localimag?.icon_flip_camera}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Camera view */}

            <View style={{flex: 1, marginTop: (mobileW * 22) / 100}}>
              {!hasPermission ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontSize: (mobileW * 3.5) / 100,
                      textAlign: 'center',
                      marginBottom: (mobileW * 3) / 100,
                      fontFamily: Font.FontLight,
                    }}>
                    Camera permission is required to record video.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openSettings();
                    }}>
                    <Text
                      style={{
                        color: Colors.whiteColor,
                        fontFamily: Font.FontSemibold,
                        fontSize: (mobileW * 3.5) / 100,
                      }}>
                      Open Settings
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <RNCamera
                  ref={cameraRef}
                  style={{flex: 1}}
                  type={cameraType}
                  captureAudio={true}
                  flashMode={RNCamera.Constants.FlashMode.off}
                />
              )}

              {/* Bottom controls */}

              <View style={styles.controls}>
                <TouchableOpacity
                  onPress={() =>
                    isRecording ? stopRecording() : startRecording()
                  }>
                  <Image
                    source={
                      isRecording
                        ? localimag.icon_pause
                        : localimag.icon_play_icon
                    }
                    style={{
                      width: (mobileW * 15) / 100,
                      height: (mobileW * 15) / 100,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* view Comments followed communities */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isFollowedCommunityCommentsModal}
          requestClose={() => {
            setIsFollowedCommunityCommentsModal(false);
          }}>
          <TouchableOpacity
            onPress={() => setIsFollowedCommunityCommentsModal(false)}
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
                borderTopEndRadius: (mobileW * 7) / 100,
                borderTopLeftRadius: (mobileW * 7) / 100,
                width: mobileW,
                flex: 1,
                height: isKeyboardVisible
                  ? config.device_type == 'ios'
                    ? (mobileH * 90) / 100
                    : (mobileH * 60) / 100
                  : config.device_type == 'ios'
                  ? (mobileH * 90) / 100
                  : (mobileH * 90) / 100,
                elevation: 10, // Android shadow
                shadowColor: '#000', // iOS shadow color
                shadowOffset: {width: 0, height: 5}, // iOS shadow offset
                shadowOpacity: 0.3, // iOS shadow opacity
                shadowRadius: 6,
              }}>
              <View
                style={{
                  width: (mobileW * 10) / 100,
                  height: (mobileW * 1) / 100,
                  backgroundColor: Colors.placeholderTextColor,
                  alignSelf: 'center',
                  marginTop: (mobileW * 4) / 100,
                }}></View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsFollowedCommunityCommentsModal(false);
                  setCommentText(null);
                  setReplyTo(null);
                }}
                style={{
                  width: (mobileW * 10) / 100,
                  height: (mobileW * 10) / 100,
                  alignSelf: 'flex-end',
                }}>
                <Image
                  source={localimag?.icon_cross}
                  style={{
                    width: (mobileW * 4) / 100,
                    height: (mobileW * 4) / 100,
                    tintColor: Colors.themeColor2,
                    marginRight: (mobileW * 6) / 100,
                  }}
                />
              </TouchableOpacity>
              <View style={{backgroundColor: Colors.whiteColor, flex: 1}}>
                <FlatList
                  data={commentsData}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingTop: (mobileW * 7) / 100,
                    paddingBottom: (mobileH * 15) / 100,
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <View
                      style={{
                        paddingHorizontal: (mobileW * 6) / 100,
                        paddingVertical: (mobileW * 2) / 100,
                        backgroundColor: Colors.whiteColor,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                        }}>
                        <Image
                          source={
                            item?.image
                              ? {uri: config.img_url + item?.image}
                              : localimag.icon_profile_user
                          }
                          style={{
                            width: (mobileW * 8) / 100,
                            height: (mobileW * 8) / 100,
                            borderRadius: (mobileW * 4) / 100,
                            marginRight: (mobileW * 3) / 100,
                          }}
                        />

                        <View
                          style={{flex: 1, backgroundColor: Colors.whiteColor}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  color: Colors.themeColor2,
                                  fontFamily: Font.FontSemibold,
                                  fontSize: (mobileW * 3.2) / 100,
                                }}>
                                {item?.name}
                              </Text>
                              <Text
                                style={{
                                  color: Colors.placeholderTextColor,
                                  fontFamily: Font.FontMedium,
                                  fontSize: (mobileW * 3) / 100,
                                  marginLeft: (mobileW * 2) / 100,
                                }}>
                                {item?.createtime}
                              </Text>
                            </View>

                            {/* Like Icon */}
                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => {
                                handleLikeComments(item?.community_comment_id);
                              }}>
                              <Image
                                source={
                                  item?.like_status
                                    ? localimag?.icon_like_heart
                                    : localimag?.icon_likePost
                                }
                                style={{
                                  width: (mobileW * 4) / 100,
                                  height: (mobileW * 4) / 100,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              direction: config.language == 1 ? 'rtl' : 'ltr',
                            }}>
                            <Text
                              style={{
                                color: Colors.themeColor2,
                                fontSize: (mobileW * 3) / 100,
                                fontFamily: Font.FontMedium,
                                marginTop: (mobileW * 1) / 100,
                                // textAlign: config.language == 1 ? 'right' : 'left',
                              }}>
                              {item?.comment}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            {item?.replies?.length <= 0 && (
                              <TouchableOpacity
                                onPress={() => handleReply(item)}>
                                <Text
                                  style={{
                                    color: Colors.placeholderTextColor,
                                    fontFamily: Font.FontRegular,
                                    fontSize: (mobileW * 3) / 100,
                                    marginTop: (mobileW * 1) / 100,
                                    textAlign:
                                      config.language == 1 ? 'right' : 'left',
                                    marginRight: (mobileW * 1) / 100,
                                  }}>
                                  {t('reply_txt')}
                                </Text>
                              </TouchableOpacity>
                            )}

                            {userId == item?.user_id && (
                              <TouchableOpacity
                                onPress={() =>
                                  handleCommentDelete(
                                    item?.community_comment_id,
                                    1,
                                  )
                                }>
                                <Text
                                  style={{
                                    color: Colors.placeholderTextColor,
                                    fontFamily: Font.FontRegular,
                                    fontSize: (mobileW * 3) / 100,
                                    marginTop: (mobileW * 1) / 100,
                                    textAlign:
                                      config.language == 1 ? 'right' : 'left',
                                  }}>
                                  {t('delete_btn_txt')}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                          {item?.replies
                            ?.slice(0, 1)
                            .map((replyItem, index) => (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: (mobileW * 4) / 100,
                                  paddingLeft: (mobileW * 10) / 100, // indent the reply
                                }}>
                                <Image
                                  source={
                                    replyItem?.image
                                      ? {uri: config.img_url + replyItem?.image}
                                      : localimag.icon_profile_user
                                  }
                                  style={{
                                    width: (mobileW * 6) / 100,
                                    height: (mobileW * 6) / 100,
                                    borderRadius: (mobileW * 3) / 100,
                                    marginRight: (mobileW * 2) / 100,
                                    alignSelf: 'flex-start',
                                  }}
                                />

                                <View style={{flex: 1}}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                    }}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <Text
                                        style={{
                                          color: Colors.themeColor2,
                                          fontFamily: Font.FontSemibold,
                                          fontSize: (mobileW * 3.2) / 100,
                                        }}>
                                        {replyItem?.name || 'Reply User'}
                                      </Text>
                                      <Text
                                        style={{
                                          color: Colors.placeholderTextColor,
                                          fontFamily: Font.FontMedium,
                                          fontSize: (mobileW * 3) / 100,
                                          marginLeft: (mobileW * 2) / 100,
                                        }}>
                                        {replyItem?.createtime}
                                      </Text>
                                    </View>
                                  </View>

                                  <Text
                                    style={{
                                      color: Colors.themeColor2,
                                      fontSize: (mobileW * 3) / 100,
                                      fontFamily: Font.FontMedium,
                                      marginTop: (mobileW * 1) / 100,
                                      // textAlign:
                                      //   config.language == 1 ? 'left' : 'right',
                                    }}>
                                    {replyItem?.reply}
                                  </Text>

                                  {/* {useId == item?.user_id && */}
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleCommentDelete(
                                        replyItem?.comment_reply_like_id,
                                        2,
                                      )
                                    }>
                                    <Text
                                      style={{
                                        color: Colors.placeholderTextColor,
                                        fontFamily: Font.FontRegular,
                                        fontSize: (mobileW * 3) / 100,
                                        marginTop: (mobileW * 1) / 100,
                                        textAlign:
                                          config.language == 1
                                            ? 'right'
                                            : 'left',
                                      }}>
                                      {t('delete_btn_txt')}
                                    </Text>
                                  </TouchableOpacity>
                                  {/* } */}
                                </View>
                              </View>
                            ))}
                        </View>
                      </View>
                    </View>
                  )}
                  ListEmptyComponent={(item, index) => (
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 3) / 100,
                        }}>
                        {t('not_comment_yet_txt')}
                      </Text>
                    </View>
                  )}
                />
              </View>
              <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={(mobileH * 10) / 100}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  backgroundColor: Colors.whiteColor,
                  width: mobileW,
                  alignSelf: 'center',
                  elevation: 9, // Android shadow
                  shadowColor: '#000', // iOS shadow
                  shadowOffset: {width: 0, height: 3},
                  shadowOpacity: 0.4,
                  shadowRadius: 3.84,
                }}>
                <View
                  style={{
                    marginVertical: (mobileW * 1) / 100,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    backgroundColor: Colors.whiteColor,
                  }}>
                  <TextInput
                    ref={commentInputRef}
                    value={commentText}
                    onChangeText={val => setCommentText(val)}
                    placeholder={
                      replyTo?.name
                        ? `Replying to ${replyTo?.name}`
                        : t('add_comment_txt')
                    }
                    style={{
                      width: (mobileW * 85) / 100,
                      height: (mobileW * 13) / 100,
                      // backgroundColor: 'red',
                      alignSelf: 'center',
                      paddingVertical: (mobileW * 2) / 100,
                      paddingHorizontal: (mobileW * 3) / 100,
                      borderRadius: (mobileW * 10) / 100,
                      color: Colors.themeColor2,
                      textAlign: config.language == 1 ? 'right' : 'left',
                    }}
                    placeholderTextColor={Colors.themeColor2}
                    maxLength={250}
                  />
                  <TouchableOpacity
                    onPress={handleSendComment}
                    style={{
                      width: (mobileW * 9) / 100,
                      height: (mobileW * 9) / 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: (mobileW * 4) / 100,
                    }}
                    activeOpacity={0.6}>
                    <Image
                      source={localimag.icon_send}
                      style={{
                        width: (mobileW * 5) / 100,
                        height: (mobileW * 5) / 100,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/*  community selection modal  */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isCommunitySelectModal}
          onRequestClose={() => {
            setIsCommunitySelectModal(false);
            setIsSelectedCommunity(null);
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setIsCommunitySelectModal(false);
              setIsSelectedCommunity(null);
            }}
            style={{
              flex: 1,
              backgroundColor: '#00000090',
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: Colors.whiteColor,
                borderTopRightRadius: (mobileW * 3) / 100,
                borderTopLeftRadius: (mobileW * 3) / 100,
                width: mobileW,
                padding: (mobileW * 3) / 100,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: Colors.whiteColor,
                  borderRadius: (mobileW * 3) / 100,
                  width: (mobileW * 95) / 100,
                  maxHeight: (mobileH * 32) / 100,
                  borderColor: Colors.themeColor2,
                  borderWidth: 1,
                  alignSelf: 'center',
                }}>
                <FlatList
                  data={userCommunityData}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={
                    {
                      // paddingBottom: mobileH * 4 / 100,
                    }
                  }
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setIsSelectedCommunity(item?.community_id);
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: (mobileW * 5) / 100,
                        paddingHorizontal: (mobileW * 4) / 100,
                        // justifyContent: 'space-between',
                        borderBottomColor: Colors.placeholderTextColor,
                        borderBottomWidth:
                          index != userCommunityData?.length - 1 ? 1 : 0,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={{uri: config.img_url + item?.community_image}}
                          style={{
                            width: (mobileW * 12) / 100,
                            height: (mobileW * 12) / 100,
                            borderRadius: (mobileW * 30) / 100,
                            marginRight: 10,
                          }}
                        />
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: (mobileW * 3.5) / 100,
                            color: Colors.themeColor2,
                            fontFamily: Font.FontSemibold,
                            width: (mobileW * 65) / 100,
                            // backgroundColor: 'red'
                          }}>
                          {item?.community_name}
                        </Text>
                      </View>

                      <Image
                        source={
                          isSelectedCommunity == item?.community_id
                            ? localimag.icon_verify
                            : localimag.icon_blank_verify
                        }
                        style={{
                          width: (mobileW * 8) / 100,
                          height: (mobileW * 8) / 100,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                />
              </View>
              <CommonButton
                title={t('add_community_txt')}
                containerStyle={{
                  backgroundColor: Colors.themeColor2,
                  marginVertical: (mobileW * 5) / 100,
                  width: (mobileW * 70) / 100,
                  alignSelf: 'center',
                }}
                onPress={() => {
                  // setTimeout(() => {
                  setIsCommunitySelectModal(false);
                  GetMyFeed(isSelectedCommunity);
                  global.community_id = isSelectedCommunity;
                  // }, 300);
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <ApprovalModal
          isVisible={isProfileApprovalModal}
          onClose={() => setIsProfileApprovalModal(false)}
          onReject={() => {
            setIsProfileApprovalModal(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Community;

// list view ===>>

const ListView = ({item, index, isUserApproved}) => {
  // consolepro.consolelog(item, '<<ITEM');
  const {navigate} = useNavigation();
  return (
    <TouchableOpacity
      // disabled={!isUserApproved}
      onPress={() => {
        navigate('VideoPreview', {
          uri: item?.banner_type == 1 ? item?.image : item?.image,
          type: item?.banner_type == 1 ? 2 : 1,
          banner_type: 'banner',
        });
      }}
      activeOpacity={0.8}
      style={{
        width: (mobileW * 70) / 100,
        height: (mobileH * 20) / 100,
      }}>
      <View>
        <Image
          source={
            item?.banner_type == 1
              ? {uri: config.img_url + item?.image}
              : {uri: config.img_url + item?.thumbnail}
          }
          // source={require('../../Icons/bannerimage.jpg')}
          style={{
            width: (mobileW * 70) / 100,
            height: (mobileH * 20) / 100,
            borderRadius: (mobileW * 4) / 100,
          }}
          resizeMode="contain"
        />

        {item?.banner_type == 2 && (
          <Image
            source={localimag.icon_play_icon} // Replace with your play icon
            style={{
              position: 'absolute',
              top: '40%',
              left: '40%',
              width: (mobileW * 10) / 100,
              height: (mobileW * 10) / 100,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

// card view =====>>

const CardView = ({item, index, t, isUserApproved}) => {
  const {goBack, navigate} = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      // disabled={!isUserApproved}
      onPress={() =>
        navigate('JoinCommunity', {
          type: 1,
          community_id: item?.community_id,
        })
      }>
      <ImageBackground
        source={
          item?.cover_image
            ? {uri: config.img_url + item?.cover_image}
            : localimag?.icon_dog_1
        }
        style={{
          width: (mobileW * 90) / 100,
          alignSelf: 'center',
          height: (mobileH * 30) / 100,
          paddingHorizontal: (mobileW * 5) / 100,
          borderRadius: (mobileW * 4) / 100,
        }}
        imageStyle={{
          borderRadius: (mobileW * 4) / 100,
        }}>
        <View
          style={{
            width: (mobileW * 90) / 100,
            height: (mobileH * 30) / 100,
            backgroundColor: '#00000050',
            borderRadius: (mobileW * 4) / 100,
            alignSelf: 'center',
            paddingHorizontal: (mobileW * 5) / 100,
          }}>
          <View
            style={{
              marginTop: (mobileH * 2) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 4) / 100,
                fontFamily: Font.FontMedium,
                textAlign: config.language == 1 ? 'left' : 'left',
              }}>
              Welcome to #
              {item?.community_name?.length > 15
                ? config.language == 1
                  ? '...' + item?.community_name?.slice(0, 15)
                  : item?.community_name?.slice(0, 15) + '...'
                : item?.community_name}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={localimag.icon_star}
                style={{
                  width: (mobileW * 3) / 100,
                  height: (mobileW * 3) / 100,
                }}
              />

              <Text
                style={{
                  color: Colors.whiteColor,
                  fontSize: (mobileW * 2.8) / 100,
                  fontFamily: Font.FontRegular,
                  marginLeft: (mobileW * 1) / 100,
                }}>{`(${item?.joined_members_count}+ Members)`}</Text>
            </View>

            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 2.8) / 100,
                fontFamily: Font.FontRegular,
                marginTop: (mobileH * 1) / 100,
                lineHeight: (mobileH * 2.1) / 100,
                textAlign: config.language == 1 ? 'left' : 'left',
              }}>
              {item?.description?.slice(0, 230)}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!isUserApproved}
            onPress={() =>
              navigate('JoinCommunity', {
                type: 1,
                community_id: item?.community_id,
              })
            }
            style={{
              backgroundColor: Colors.whiteColor,
              width: (mobileW * 35) / 100,
              // paddingHorizontal: (mobileW * 1) / 100,
              height: (mobileH * 4.2) / 100,
              borderRadius: (mobileW * 30) / 100,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.themeColor,
              marginTop: (mobileH * 1.5) / 100,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: Colors.themeColor,
                fontSize: (mobileW * 2.8) / 100,
                fontFamily: Font.FontRegular,
              }}>
              {t('viewCommunity_txt')}
            </Text>

            <Image
              source={localimag.icon_arrow}
              style={{
                width: (mobileW * 5) / 100,
                height: (mobileW * 5) / 100,
                tintColor: Colors.themeColor,
                marginLeft: (mobileW * 1) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const AllFollowedCommunity = ({item, index, t}) => {
  const {goBack, navigate} = useNavigation();
  consolepro.consolelog(item, '<< community ITEM');
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigate('JoinCommunity', {
          type: 1,
          community_id: item?.community_id,
        })
      }>
      <ImageBackground
        source={
          item?.cover_image
            ? {uri: config.img_url + item?.cover_image}
            : localimag?.icon_dog_1
        }
        style={{
          width: (mobileW * 90) / 100,
          alignSelf: 'center',
          height: (mobileH * 30) / 100,
          paddingHorizontal: (mobileW * 5) / 100,
          borderRadius: (mobileW * 4) / 100,
        }}
        imageStyle={{
          borderRadius: (mobileW * 4) / 100,
        }}>
        <View
          style={{
            width: (mobileW * 90) / 100,

            height: (mobileH * 30) / 100,
            backgroundColor: '#00000050',
            borderRadius: (mobileW * 4) / 100,
            alignSelf: 'center',
            paddingHorizontal: (mobileW * 5) / 100,
          }}>
          <View
            style={{
              marginTop: (mobileH * 2) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 4) / 100,
                fontFamily: Font.FontMedium,
                textAlign: config.language == 1 ? 'left' : 'left',
              }}>
              {item?.community_name}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={localimag.icon_star}
                style={{
                  width: (mobileW * 3) / 100,
                  height: (mobileW * 3) / 100,
                }}
              />

              <Text
                style={{
                  color: Colors.whiteColor,
                  fontSize: (mobileW * 2.8) / 100,
                  fontFamily: Font.FontRegular,
                  marginLeft: (mobileW * 1) / 100,
                }}>{`(${item?.joined_members_count}+ Members)`}</Text>
            </View>

            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 2.8) / 100,
                fontFamily: Font.FontRegular,
                marginTop: (mobileH * 1) / 100,
                lineHeight: (mobileH * 2.1) / 100,
                textAlign: config.language == 1 ? 'left' : 'left',
              }}>
              {item?.description?.slice(0, 230)}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigate('JoinCommunity', {
                type: 1,
                community_id: item?.community_id,
              })
            }
            style={{
              backgroundColor: Colors.whiteColor,
              width: (mobileW * 35) / 100,
              // paddingHorizontal: (mobileW * 1) / 100,
              height: (mobileH * 4.2) / 100,
              borderRadius: (mobileW * 30) / 100,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.themeColor,
              marginTop: (mobileH * 1.5) / 100,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: Colors.themeColor,
                fontSize: (mobileW * 2.8) / 100,
                fontFamily: Font.FontRegular,
              }}>
              {t('viewCommunity_txt')}
            </Text>

            <Image
              source={localimag.icon_arrow}
              style={{
                width: (mobileW * 5) / 100,
                height: (mobileW * 5) / 100,
                tintColor: Colors.themeColor,
                marginLeft: (mobileW * 1) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  containerStyle: {
    flex: 1,
    backgroundColor: '#00000030',
    alignItems: 'center',
  },
  subContainerStyle: {
    position: 'absolute',
    bottom: (-mobileH * 7) / 100,
    width: screenWidth,
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: (mobileW * 5) / 100,
    borderTopRightRadius: (mobileW * 5) / 100,
    paddingHorizontal: (mobileW * 5) / 100,
    paddingVertical: (mobileH * 1) / 100,
    paddingBottom: (mobileH * 15) / 100,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdown: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
    // maxHeight: 200,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: (mobileW * 4) / 100,
    color: '#333',
    fontFamily: Font.FontMedium,
  },
  lastOption: {
    borderBottomWidth: 0,
  },

  button: {
    height: (mobileH * 4.5) / 100,
    width: (mobileW * 60) / 100,
    borderRadius: (mobileW * 2) / 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: (mobileH * 0.8) / 100,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  buttonText: {
    fontSize: (mobileW * 3.5) / 100,
    fontWeight: '500',
    color: '#333',
    fontFamily: Font.FontMedium,
  },
  controls: {
    position: 'absolute',
    bottom: (mobileW * 10) / 100,
    alignSelf: 'center',
  },
});
