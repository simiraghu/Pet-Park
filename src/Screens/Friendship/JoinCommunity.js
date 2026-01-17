import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  FlatList,
  Modal,
  Dimensions,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';

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
} from '../../Provider/utilslib/Utils';
import LinearGradient from 'react-native-linear-gradient';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ConfirmModal from '../../Components/ConfirmModal';
import CommonButton from '../../Components/CommonButton';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import Share from 'react-native-share';
import Video from 'react-native-video';
import {SafeAreaView} from 'react-native-safe-area-context';

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

const JoinCommunity = ({navigation}) => {
  const {goBack, navigate, setParams} = useNavigation();
  const {t} = useTranslation();

  const [likesData, setLikesData] = useState([
    {
      id: 0,
      img: require('../../Icons/icon_artBoard_13.png'),
    },
    {
      id: 1,
      img: require('../../Icons/icon_artBoard_6.png'),
    },
    {
      id: 2,
      img: require('../../Icons/icon_artBoard_1.png'),
    },
  ]);

  const [postData, setPostData] = useState([]);
  const [modalStatus, setModalStaus] = useState(false);
  const [isUnfollowModal, setIsUnfollowModal] = useState(false);
  const [reportProfilePopUp, setReportProfilePopUp] = useState(false);
  const [reportReason, setReportReason] = useState(0);
  const [reportThanksModal, setReportThanksModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [blockedSuccessfully, setBlockedSuccessfully] = useState(false);
  const [communityDetails, setCommunityDetails] = useState('');
  const [selectedReportOption, setSelectedReportOption] = useState(null);
  const [post_user_name, setPost_user_name] = useState(null);
  const [community_post_id, setCommunity_post_id] = useState(null);
  const [report_reason_text, setReport_reason_text] = useState(null);
  const [other_user_id, setOther_user_id] = useState(null);
  const [community_user_id, setCommunity_user_id] = useState(null);
  const [user_id, setUser_id] = useState(null);
  const [isDeleteCommunityModal, setisDeleteCommunityModal] = useState(false);
  const [isProfileApprovalModal, setIsProfileApprovalModal] = useState(false);
  const [isUserApproved, setIsUserApproved] = useState(false);
  const [isApiLoading, setisApiLoading] = useState(true);

  const [offset, setOffset] = useState(0); // current offset
  const [limit] = useState(5); // how many to load per request
  const [hasMoreData, setHasMoreData] = useState(true); // for button visibility
  const [loadingMore, setLoadingMore] = useState(false); // prevent duplicate calls

  const {params} = useRoute();

  const community_id = params?.community_id;

  consolepro.consolelog(community_id, '<<CommunityID');

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      GetCommunityDetails(0, false);
      setRefreshing(false);
    }, 1000);
  };
  useFocusEffect(
    useCallback(() => {
      const getUserDetails = async () => {
        const user_array = await localStorage.getItemObject('user_array');
        const userId = user_array?.user_id;
        setUser_id(userId);
      };
      getUserDetails();
    }, []),
  );

  consolepro.consolelog(user_id, '<<User ID');
  consolepro.consolelog(community_user_id, '<< Community User ID');

  // Get Community Details ============>>

  // const GetCommunityDetails = async (offsetVal = 0, isRefresh = false) => {
  //   try {
  //     if (loadingMore && !isRefresh) return;

  //     if (!isRefresh) {
  //       setLoadingMore(true);
  //     }
  //     const user_array = await localStorage.getItemObject('user_array');
  //     const userId = user_array?.user_id;

  //     if (!userId) {
  //       navigate('WelcomeScreen');
  //       return;
  //     }

  //     const API_URL =
  //       config.baseURL +
  //       `view_community?user_id=${userId}&community_id=${community_id}&offset=${offsetVal}&limit=${limit}`;

  //     consolepro.consolelog('API URL=========>>', API_URL);

  //     setisApiLoading(true);
  //     apifuntion
  //       .getApi(API_URL, 1)
  //       .then(res => {
  //         if (res?.success === true) {
  //           let newPostdata = res?.community_details?.post_details || [];

  //           // ✅ Handle "NA", null, undefined, or wrong data type
  //           if (!Array.isArray(newPostdata)) {
  //             consolepro.consolelog(
  //               'Invalid post_details, resetting to empty array:',
  //               newPostdata,
  //             );
  //             newPostdata = [];
  //           }

  //           consolepro.consolelog('New Post Data', newPostdata);

  //           if (isRefresh) {
  //             setPostData(newPostdata);
  //             setOffset(limit);
  //           } else {
  //             setPostData(prev => {
  //               const existingIds = new Set(
  //                 prev.map(item => item?.community_post_id),
  //               );
  //               const newUniqueItems = newPostdata.filter(
  //                 item => !existingIds.has(item?.community_post_id),
  //               );

  //               return [...prev, ...newUniqueItems];
  //             });
  //             setOffset(prev => prev + limit);
  //           }

  //           // ✅ Set additional details
  //           setCommunityDetails(res?.community_details);
  //           setCommunity_user_id(res?.community_details?.user_id);
  //           setHasMoreData(newPostdata.length === limit);
  //         } else {
  //           // ❌ If API returns failure
  //           setPostData([]);
  //           setHasMoreData(false);
  //           setisApiLoading(false);
  //           if (res?.active_flag === 0) {
  //             localStorage.clear();
  //             navigate('WelcomeScreen');
  //           } else {
  //             consolepro.consolelog(res, '<<RESPONSE ERROR');
  //           }
  //         }
  //       })
  //       .catch(error => {
  //         consolepro.consolelog(error, '<<API ERROR');
  //         setisApiLoading(false);
  //       })
  //       .finally(() => {
  //         setLoadingMore(false);
  //         setisApiLoading(false);
  //       });
  //   } catch (error) {
  //     consolepro.consolelog(error, '<<CATCH ERROR');
  //     setLoadingMore(false);
  //     setisApiLoading(false);
  //   }
  // };

  const GetCommunityDetails = async (offsetVal = 0, isRefresh = false) => {
    try {
      if (loadingMore && !isRefresh) return;

      if (isRefresh) {
        setisApiLoading(true); // full page loader for refresh
      } else if (offsetVal === 0) {
        setisApiLoading(true); // full page loader for first load
      } else {
        setLoadingMore(true); // footer loader
      }

      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      if (!userId) {
        navigate('WelcomeScreen');
        return;
      }

      const API_URL =
        config.baseURL +
        `view_community?user_id=${userId}&community_id=${community_id}&offset=${offsetVal}&limit=${limit}`;

      consolepro.consolelog('API URL =======>', API_URL);
      const res = await apifuntion.getApi(API_URL, 1);

      if (res?.success) {
        const postDetails = res?.community_details?.post_details;
        const isValidArray = Array.isArray(postDetails);
        const newPostdata = isValidArray ? postDetails : [];

        if (!isValidArray || newPostdata.length === 0) {
          setHasMoreData(false);
        }

        if (isRefresh || offsetVal === 0) {
          // First load or refresh → always replace
          setPostData(isValidArray ? newPostdata : []);
          setOffset(limit);
        } else {
          // Load more → append only if valid array
          if (isValidArray && newPostdata.length > 0) {
            setPostData(prev => {
              const existingIds = new Set(
                prev.map(item => item?.community_post_id),
              );
              const newUniqueItems = newPostdata.filter(
                item => !existingIds.has(item?.community_post_id),
              );
              return [...prev, ...newUniqueItems];
            });
            setOffset(prev => prev + limit);
          }
          // If it's "NA" or empty, do nothing → keep old posts
        }

        setCommunityDetails(res?.community_details);
        setCommunity_user_id(res?.community_details?.user_id);
        setHasMoreData(res?.has_more);
      } else {
        if (res?.active_flag === 0) {
          localStorage.clear();
          navigate('WelcomeScreen');
        }
        setHasMoreData(false);
      }
    } catch (error) {
      consolepro.consolelog(error, '<<CATCH ERROR');
    } finally {
      setisApiLoading(false);
      setLoadingMore(false);
    }
  };

  consolepro.consolelog('HAS more data=====>>', hasMoreData);
  consolepro.consolelog('loading more =====>>', loadingMore);
  consolepro.consolelog('api loading  =====>>', isApiLoading);

  // Join Community ==============>>

  const handleJoinCommunity = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL = config.baseURL + 'join_community';

      const data = new FormData();

      data.append('user_id', userId);
      data.append('community_id', community_id);

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              msgProvider.toast(res?.msg[config.language], 'bottom');
              GetCommunityDetails(0, false);
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
      consolepro.consolelog(error, '<<ERROr');
    }
  };

  // unfollow community ==========>>

  const unfollowCommunity = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL +
        `unfollow_community?user_id=${userId}&community_id=${community_id}`;

      apifuntion
        .getApi(API_URL, 0)
        .then(res => {
          if (res?.success == true) {
            setTimeout(() => {
              setIsUnfollowModal(false);
              msgProvider.toast(res?.msg[config.language], 'bottom');
              navigate('Community');
              return false;
            }, 900);
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

  // handle like unlike =============>>

  const handleLikeToggle = async postId => {
    const user_array = await localStorage.getItemObject('user_array');
    const userId = user_array?.user_id;
    const userImage = user_array?.image;

    const currentPost = postData.find(
      post => post?.community_post_id == postId,
    );
    if (!currentPost) return;

    const newLikeState = !currentPost.like_Status;

    // Update UI Optimistically
    const updatedPosts = postData.map(post => {
      if (post?.community_post_id == postId) {
        let updatedLikeMembers = Array.isArray(post.like_members_images)
          ? [...post.like_members_images]
          : [];

        if (newLikeState) {
          // Add current user if not already present
          if (!updatedLikeMembers.some(member => member.user_id == userId)) {
            updatedLikeMembers.unshift({
              user_id: userId,
              image: userImage,
            });
          }
        } else {
          // Remove current user
          updatedLikeMembers = updatedLikeMembers.filter(
            member => member.user_id != userId,
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

    setPostData(updatedPosts);

    // API Request
    const API_URL = config.baseURL + 'like_community_post';
    const data = new FormData();
    data.append('user_id', userId);
    data.append('community_post_id', postId);

    apifuntion
      .postApi(API_URL, data, 1)
      .then(res => {
        if (!res.success) {
          // Rollback if API fails
          const rollbackPosts = postData.map(post => {
            if (post?.community_post_id == postId) {
              let rollbackMembers = Array.isArray(post.like_members_images)
                ? [...post.like_members_images]
                : [];

              if (!newLikeState) {
                // Re-add user if rollback from unlike
                if (!rollbackMembers.some(m => m.user_id == userId)) {
                  rollbackMembers.unshift({
                    user_id: userId,
                    image: userImage,
                  });
                }
              } else {
                // Remove user if rollback from like
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

          setPostData(rollbackPosts);
        }
      })
      .catch(err => {
        console.log('Like error', err);
        setPostData(postData); // Revert to old state on error
      });
  };

  // Community post comment =========>>

  const handleComments = async (community_post_id, index, value, setValue) => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL = config.baseURL + 'add_comment';

      const data = new FormData();
      data.append('user_id', userId);
      data.append('community_post_id', community_post_id);
      data.append('comment', value);

      if (!value[index] || value[index].trim().length == 0) {
        consolepro.consolelog(value[index], 'Invalid or empty comment');
        return;
      }

      consolepro.consolelog(data, '<<DATa');
      consolepro.consolelog(communityDetails?.join_status, '<<JOIN');

      // if (communityDetails?.join_status == 0) {
      //   msgProvider.alert(
      //     t('information_txt'),
      //     t('joinFirstToComment_txt'),
      //     false,
      //   );
      //   return false;
      // } else {
      if (value[index] && value[index].trim().length > 0) {
        apifuntion
          .postApi(API_URL, data, 1)
          .then(res => {
            if (res?.success == true) {
              consolepro.consolelog(res, '<<RES');
              setTimeout(() => {
                msgProvider.toast(res?.msg[config.language], 'bottom');
                setValue('');
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
        // }
      } else {
        consolepro.consolelog(value[index], 'value index');
      }
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  // Report Post ====================>>

  const handleReportPost = async () => {
    try {
      consolepro.consolelog('Post Report');
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();
      data.append('user_id', userId);
      data.append('community_post_id', community_post_id);
      data.append('reason', selectedReportOption);
      consolepro.consolelog(data, '<DATA');

      if (selectedReportOption == 4) {
        data.append('report_reason', report_reason_text);
      }

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

  // handle delete community

  const handleDeleteCommunity = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();

      data.append('user_id', userId);
      data.append('community_id', community_id);

      const API_URL = config.baseURL + 'delete_community';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              setisDeleteCommunityModal(false);
              msgProvider.toast(res?.msg[config.language], 'bottom');
              navigate('Community');
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

  useFocusEffect(
    useCallback(() => {
      if (config.device_type == 'ios') {
        setTimeout(() => {
          GetCommunityDetails(0, false);
        }, 1200);
      } else {
        GetCommunityDetails(0, false);
      }

      // 🧹 Cleanup on unmount
      return () => {
        setPostData([]);
        setOffset(0);
        setHasMoreData(true);
        setCommunityDetails(null);
        setCommunity_user_id(null);
      };
    }, []),
  );

  // manage hide all from ==========>>

  const ManageHidAllFrom = async () => {
    try {
      consolepro.consolelog('Post Report');
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();
      data.append('user_id', userId);
      data.append('community_post_id', community_post_id);
      data.append('reason', selectedReportOption);
      consolepro.consolelog(data, '<DATA');

      consolepro.consolelog(selectedReportOption, '<<Selected report option');
      consolepro.consolelog(selectedReportOption);

      const API_URL = config.baseURL + 'report_community_post';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              setTimeout(() => {
                GetCommunityDetails(0, false);
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

  // Share community ============>>>

  const share_btn = community_id => {
    consolepro.consolelog('I am in share event ', community_id);

    var share_url =
      config.baseURL + 'deepLink/?link=pomsse://view_community/' + community_id;

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

  // consolepro.consolelog('Post Data ==========>>', postData);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: (mobileH * 8) / 100,
          }}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <ImageBackground
            source={
              communityDetails?.cover_image && {
                uri: config.img_url + communityDetails?.cover_image,
              }
            }
            style={styles.imageBackground}>
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'transparent']} // Dark to transparent gradient
              style={styles.gradient}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => goBack()}
                activeOpacity={0.8}
                style={{
                  paddingHorizontal: (mobileW * 5) / 100,
                  marginTop: (mobileH * 3) / 100,
                }}>
                <Image
                  source={localimag.icon_goBack}
                  style={{
                    width: (mobileW * 6) / 100,
                    height: (mobileW * 6) / 100,
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => share_btn(community_id)}
                disabled={!isUserApproved}
                activeOpacity={0.8}
                style={{
                  paddingHorizontal: (mobileW * 5) / 100,
                  marginTop: (mobileH * 3) / 100,
                }}>
                <Image
                  source={localimag.icon_share_app}
                  style={{
                    width: (mobileW * 6) / 100,
                    height: (mobileW * 6) / 100,
                  }}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <View
            style={{
              paddingHorizontal: (mobileW * 5) / 100,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: (mobileH * 1) / 100,
            }}>
            <Text
              style={{
                color: Colors.themeColor,
                fontSize: (mobileW * 5) / 100,
                fontFamily: Font.FontSemibold,
                textAlign: 'center',
                width: (mobileW * 55) / 100,
              }}>
              Welcome to #{communityDetails?.community_name}
            </Text>

            {community_user_id != user_id && (
              <TouchableOpacity
                disabled={!isUserApproved}
                activeOpacity={0.8}
                onPress={() => {
                  communityDetails?.join_status != 0
                    ? setTimeout(() => {
                        setIsUnfollowModal(true);
                      }, 700)
                    : handleJoinCommunity();
                }}
                style={{
                  width: (mobileW * 35) / 100,
                  height: (mobileH * 4.2) / 100,
                  borderRadius: (mobileW * 30) / 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: Colors.themeColor,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: Colors.themeColor,
                }}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontSize: (mobileW * 2.8) / 100,
                    fontFamily: Font.FontRegular,
                  }}>
                  {communityDetails?.join_status == 0
                    ? t('joinCommunity_txt')
                    : t('unfollow_txt')}
                </Text>

                {communityDetails?.join_status == 0 && (
                  <Image
                    source={localimag.icon_arrow}
                    style={{
                      width: (mobileW * 5) / 100,
                      height: (mobileW * 5) / 100,
                      marginLeft: (mobileW * 1) / 100,
                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      ],
                    }}
                  />
                )}
              </TouchableOpacity>
            )}

            {community_user_id == user_id && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={!isUserApproved}
                  onPress={() =>
                    navigate('EditCommunity', {
                      community_details: communityDetails,
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
                  onPress={() => {
                    setisDeleteCommunityModal(true);
                  }}
                  disabled={!isUserApproved}
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
            )}
          </View>

          {community_user_id == user_id && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                // marginTop: (mobileH * 0.8) / 100,
                paddingHorizontal: (mobileW * 5) / 100,
                alignSelf: 'flex-end',
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
                  color: Colors.darkGreenColor,
                  fontSize: (mobileW * 2.8) / 100,
                  fontFamily: Font.FontMedium,
                  marginLeft: (mobileW * 1) / 100,
                  textAlign: config.language == 1 ? 'left' : 'left',
                }}>{`(${communityDetails?.joined_members_count} Members)`}</Text>
            </View>
          )}

          {community_user_id != user_id && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: (mobileH * 0.8) / 100,
                paddingHorizontal: (mobileW * 5) / 100,
                alignSelf: 'flex-end',
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
                  color: Colors.darkGreenColor,
                  fontSize: (mobileW * 2.8) / 100,
                  fontFamily: Font.FontMedium,
                  marginLeft: (mobileW * 1) / 100,
                  textAlign: config.language == 1 ? 'left' : 'left',
                }}>{`(${communityDetails?.joined_members_count} Members)`}</Text>
            </View>
          )}

          <View
            style={{
              paddingHorizontal: (mobileW * 5) / 100,
              marginTop: (mobileH * 1.5) / 100,
              flexDirection: 'row',
            }}>
            {/* about community */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                marginLeft: (mobileW * 1.5) / 100,
              }}>
              <Text
                style={{
                  color: Colors.themeColor,
                  fontSize: (mobileW * 4) / 100,
                  fontFamily: Font.FontMedium,
                }}>
                {t('aboutCommunities_txt')}
              </Text>

              <View
                style={{
                  backgroundColor: Colors.themeColor,
                  width: (mobileW * 39) / 100,
                  alignSelf: 'center',
                  height: (mobileH * 0.6) / 100,
                  marginTop: (mobileH * 0.1) / 100,
                  borderRadius: (mobileW * 5) / 100,
                }}></View>
            </TouchableOpacity>
          </View>

          {/* border */}

          <View
            style={{
              backgroundColor: Colors.darkGreenColor,
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
              height: (mobileH * 0.15) / 100,
            }}></View>

          {/* ---------------------------- */}

          <View
            style={{
              paddingHorizontal: (mobileW * 5) / 100,
              marginTop: (mobileH * 2) / 100,
              paddingBottom: (mobileW * 3) / 100,
            }}>
            <Text
              style={{
                color: Colors.darkGreenColor,
                fontSize: (mobileW * 4.3) / 100,
                fontFamily: Font.FontSemibold,
                textAlign: config.language == 1 ? 'left' : 'left',
              }}>
              {communityDetails?.title}
            </Text>

            <Text
              style={{
                color: Colors.darkGreenColor,
                fontSize: (mobileW * 3) / 100,
                fontFamily: Font.FontMedium,
                lineHeight: (mobileH * 2.5) / 100,
                textAlign: 'justify',
                marginTop: (mobileH * 0.5) / 100,
                textAlign: config.language == 1 ? 'left' : 'left',
              }}>
              {communityDetails?.description}
            </Text>
          </View>

          {/* -------------------------------- */}

          <View
            style={{
              paddingHorizontal: (mobileW * 5) / 100,
              marginTop: -(mobileH * 0.5) / 100,
              flexDirection: 'row',
            }}>
            {/* Post */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                marginLeft: (mobileW * 1.5) / 100,
              }}>
              <Text
                style={{
                  color: Colors.themeColor,
                  fontSize: (mobileW * 4) / 100,
                  fontFamily: Font.FontMedium,
                }}>
                {t('post_txt')}
              </Text>

              <View
                style={{
                  backgroundColor: Colors.themeColor,
                  width: (mobileW * 10) / 100,
                  alignSelf: 'center',
                  height: (mobileH * 0.6) / 100,
                  marginTop: (mobileH * 0.1) / 100,
                  borderRadius: (mobileW * 5) / 100,
                }}></View>
            </TouchableOpacity>
          </View>

          {/* border */}

          <View
            style={{
              backgroundColor: Colors.darkGreenColor,
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
              height: (mobileH * 0.15) / 100,
            }}></View>

          {communityDetails?.join_status == 0 &&
            user_id != communityDetails?.user_id && (
              <View
                style={{
                  alignSelf: 'center',
                  paddingHorizontal: (mobileW * 3) / 100,
                  paddingVertical: (mobileW * 2) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontSize: (mobileW * 3) / 100,
                    fontFamily: Font.FontMedium,
                  }}>
                  {t('join_our_community_to_explore_pet_details_txt')}
                </Text>
              </View>
            )}

          {/* ---------------------------- */}
          {isApiLoading ? null : communityDetails?.post_details !== 'NA' ? (
            <FlatList
              data={postData.filter(item => item !== 'NA')}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                gap: (mobileW * 4) / 100,
                paddingBottom: (mobileH * 8) / 100,
                marginTop: (mobileH * 2) / 100,
              }}
              renderItem={({item, index}) => (
                <PostView
                  item={item}
                  index={index}
                  setModalStaus={setModalStaus}
                  t={t}
                  handleLikeToggle={handleLikeToggle}
                  post_user_name={post_user_name}
                  setPost_user_name={setPost_user_name}
                  setCommunity_post_id={setCommunity_post_id}
                  communityDetails={communityDetails}
                  handleComments={handleComments}
                  handleReportPost={handleReportPost}
                  community_post_id={community_post_id}
                  other_user_id={other_user_id}
                  setOther_user_id={setOther_user_id}
                  user_id={user_id}
                  community_user_id={community_user_id}
                  GetCommunityDetails={GetCommunityDetails}
                  isUserApproved={isUserApproved}
                />
              )}
              ListEmptyComponent={() => (
                <View
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginTop: (mobileW * 2) / 100,
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
              ListFooterComponent={() =>
                hasMoreData && !isApiLoading ? (
                  <TouchableOpacity
                    onPress={() => GetCommunityDetails(offset, false)}
                    style={{
                      alignSelf: 'center',
                      // backgroundColor: Colors.themeColor2,
                      // paddingHorizontal: 20,
                      // paddingVertical: 10,
                      borderRadius: 8,
                      marginTop: 10,
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
                        onPress={() => GetCommunityDetails(offset, false)}>
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
          ) : (
            <View
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: (mobileW * 2) / 100,
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
        </KeyboardAwareScrollView>

        {/* three dot modal */}

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
                  }, 500);
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
                  }, 500);
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
                  }, 500);
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
                  setSelectedReportOption(4);
                  setModalStaus(false);
                  setReportProfilePopUp(true);
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
                  setSelectedReportOption(5);
                  setTimeout(() => {
                    handleReportPost();
                  }, 500);
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

        {/* unfollow modal */}

        <ConfirmModal
          message={t('are_you_sure_txt')}
          content={t('you_want_to_unfollow_txt')}
          visible={isUnfollowModal}
          onCancelText={t('cancel_txt')}
          button={true}
          onCancelBtn={true}
          btnText={t('unfollow_txt')}
          onCancelPress={() => setIsUnfollowModal(false)}
          onCrosspress={() => setIsUnfollowModal(false)}
          onPress={() => {
            unfollowCommunity();
          }}
          popupicon={localimag.icon_unfollow}
        />

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
                    {`Report`}
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
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setTimeout(() => {
                          setSelectedReportOption(5);
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
                  </View>
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
                }}>{`${t('block_txt')} ${post_user_name}?`}</Text>

              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3.2) / 100,
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

        {/* blocked modal */}

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
                    navigation.navigate('Community');
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
      </View>
    </SafeAreaView>
  );
};

export default JoinCommunity;

const PostView = ({
  item,
  index,
  setModalStaus,
  t,
  handleLikeToggle,
  setPost_user_name,
  setCommunity_post_id,
  communityDetails,
  handleComments,
  community_post_id,
  other_user_id,
  setOther_user_id,
  user_id,
  community_user_id,
  GetCommunityDetails,
  isUserApproved,
}) => {
  const {params} = useRoute();
  const type = params?.type;
  const {setParams, navigate} = useNavigation();

  const [value, setValue] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [commentText, setCommentText] = useState(null);
  const [commentsData, setCommentsData] = useState([]);
  const [isViewCommentsModal, setisViewCommentsModal] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isMyFeedPostModal, setisMyFeedPostModal] = useState(false);
  const [isPostDeleteModal, setIsPostDeleteModal] = useState(false);

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

  const commentInputRef = useRef(null);

  // consolepro.consolelog('Item =====>>>>', item);

  const handleReply = commentItem => {
    consolepro.consolelog(commentItem, '<<Comment');
    setReplyTo(commentItem);
    setTimeout(() => {
      commentInputRef?.current?.focus();
    }, 200);
  };

  // handle Comments ==========>>

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
      if (commentText && commentText.trim().length >= 0) {
        apifuntion
          .postApi(API_URL, data)
          .then(res => {
            if (res?.success == true) {
              consolepro.consolelog(res, '<<RES');
              setTimeout(() => {
                GetAllComments(community_post_id);
                setCommentText(''); // Clear input
                setReplyTo(null); // Clear reply mode
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
      data.append('community_post_id', community_post_id);
      data.append('comment', commentText);

      consolepro.consolelog(data, '<<DATa');

      if (commentText && commentText.trim().length >= 0) {
        apifuntion
          .postApi(API_URL, data)
          .then(res => {
            if (res?.success == true) {
              consolepro.consolelog(res, '<<RES');
              setTimeout(() => {
                GetAllComments(community_post_id);
                setCommentText(''); // Clear input
                setReplyTo(null); // Clear reply mode
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
  };

  // consolepro.consolelog(community_post_id, 'Community Post Id');

  // Get ALL Comments ==========>>

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

  // handle like unlike =========>>>

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

  // handle post delete

  const handlePostDelete = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();
      data.append('user_id', userId);
      data.append('community_post_id', community_post_id);

      consolepro.consolelog(data, '<<DAta');

      const API_URL = config.baseURL + 'delete_community_post';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, 'RES');
            setTimeout(() => {
              GetCommunityDetails(0, false);
              setIsPostDeleteModal(false);
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
      consolepro.consolelog(error, '<ERROR');
    }
  };

  // Delete comments ====>>

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
              GetAllComments(community_post_id);
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

  //  share post

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

  return (
    <View
      key={index.toString()}
      style={{
        width: (mobileW * 90) / 100,
        alignSelf: 'center',
        borderWidth: 1,
        paddingTop: (mobileH * 1.5) / 100,
        paddingBottom: (mobileH * 0.5) / 100,
        borderColor: Colors.borderColor,
        borderRadius: (mobileW * 2) / 100,
        //marginTop: (mobileH * 1) / 100,
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
            Welcome to #
            {item?.community_name?.length > 15
              ? config.language == 1
                ? '...' + item?.community_name?.slice(0, 15)
                : item?.community_name?.slice(0, 15) + '...'
              : item?.community_name}
          </Text>
        </Text>

        {/* <TouchableOpacity
          activeOpacity={0.8}
          //onPress={() => navigate('JoinCommunity')}
        >
          <Text
            style={{
              color: Colors.themeColor,
              fontSize: (mobileW * 3.2) / 100,
              fontFamily: Font.FontSemibold,
            }}>
            {t('viewCommunity_txt')}
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* divider */}

      <View
        style={{
          marginVertical: (mobileH * 1.4) / 100,
          borderWidth: 0.5,
          borderColor: Colors.borderColor,
          width: (mobileW * 82) / 100,
          alignSelf: 'center',
        }}></View>

      {/* ------------- */}

      <View
        style={{
          borderRadius: (mobileW * 3) / 100,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            consolepro.consolelog(
              'Community Image ========>>',
              item?.community_image,
            );
            // if (item?.bring_type == 0) {

            //   navigate('UserDetails', {
            //     other_user_id: item?.user_id
            //   })
            // } else if (item?.bring_type == 1) {
            //   navigate('WishingPetParentUserDetails', {
            //     other_user_id: item?.user_id
            //   })
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
                    ? {uri: config.img_url + item?.community_image}
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
                  item?.community_image
                    ? { uri: config.img_url + item?.community_image }
                    : localimag?.icon_add_pet_photo
                }
                style={{
                  width: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                  transform: [
                    config.language == 1 ? { scaleX: -1 } : { scaleX: 1 },
                  ],
                }}
              />
            </View> */}
          </View>

          <View
            style={{
              width: (mobileW * 37) / 100,
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
              // marginTop: (-mobileH * 1) / 100,
            }
          }>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // marginTop: (-mobileH * 1) / 100,
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {item?.like_members_images != 'NA' &&
                  item?.like_members_images?.slice(0, 3).map((user, index) => (
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
                        marginLeft: index === 0 ? 0 : (-mobileW * 2.2) / 100,
                        borderWidth: 1,
                        borderColor: '#fff',
                      }}
                    />
                  ))}

                {/* Show "+X" if more than 3 likes */}
                {item?.like_members_images != 'NA' &&
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
              onPress={() => handleLikeToggle(item?.community_post_id)}
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
                        ? {uri: config.img_url + item.user_image}
                        : localimag.icon_profile_user
                    }
                    style={{
                      width: (mobileH * 3.5) / 100,
                      height: (mobileH * 3.5) / 100,
                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
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
                          config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                        ],
                      }}
                    />
                  </View>
                )}
              </View>

              {/* Text Section */}
              <View style={{justifyContent: 'center'}}>
                <TouchableOpacity
                  disabled={!isUserApproved}
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
            activeOpacity={0.8}
            // disabled={!isUserApproved}
            onPress={() => {
              navigate('VideoPreview', {
                uri: config.img_url + item?.image_video,
                type: 1,
              });
            }}
            style={{width: (mobileW * 80) / 100, height: (mobileH * 60) / 100}}>
            <Image
              source={
                item?.image_video ? {uri: config.img_url + item?.thumbnail} : ''
              }
              style={{
                width: (mobileW * 80) / 100,
                height: (mobileH * 60) / 100,
              }}
            />
            <TouchableOpacity
              activeOpacity={0.8}
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
      {/* ----------- */}

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

      {/* divider */}

      <View
        style={{
          marginTop: (mobileH * 1.4) / 100,
          borderWidth: 0.5,
          borderColor: Colors.borderColor,
          width: (mobileW * 82) / 100,
          alignSelf: 'center',
        }}></View>

      {/* ------comment view------- */}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: (mobileH * 0.3) / 100,
          paddingVertical: (mobileW * 2) / 100,
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
              transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
            }}
          />

          {community_user_id != user_id &&
          communityDetails?.join_status == 0 ? (
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!isUserApproved}
              onPress={() => {
                msgProvider.alert(
                  t('information_txt'),
                  t('joinFirstToComment_txt'),
                  false,
                );
                return false;
              }}
              style={{
                width: (mobileW * 40) / 100,
                marginLeft: (mobileW * 3) / 100,
                height: (mobileH * 4) / 100,
                color: Colors.themeColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 3) / 100,
                paddingBottom: 3,
                backgroundColor: '#C6C5C5',
                borderBottomRightRadius: (mobileW * 2) / 100,
                borderTopLeftRadius:
                  config.language != 1 ? 0 : (mobileW * 2) / 100,
                borderTopRightRadius: (mobileW * 2) / 100,
                borderBottomLeftRadius:
                  config.language == 1 ? 0 : (mobileW * 2) / 100,
                paddingHorizontal: (mobileW * 3) / 100,
                textAlign: config.language == 1 ? 'right' : 'left',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3) / 100,
                }}>
                {t('join_first_to_comment_txt')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TextInput
              placeholderTextColor={Colors.themeColor}
              returnKeyLabel="done"
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              keyboardType="default"
              style={{
                width: (mobileW * 40) / 100,
                marginLeft: (mobileW * 1) / 100,
                height: (mobileH * 5) / 100,
                color: Colors.themeColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 3) / 100,
                paddingBottom: 3,
                backgroundColor: Colors.whiteColor,
                borderBottomRightRadius: (mobileW * 2) / 100,
                borderTopLeftRadius:
                  config.language != 1 ? 0 : (mobileW * 2) / 100,
                borderTopRightRadius: (mobileW * 2) / 100,
                borderBottomLeftRadius:
                  config.language == 1 ? 0 : (mobileW * 2) / 100,
                paddingHorizontal: (mobileW * 3) / 100,
                textAlign: config.language == 1 ? 'right' : 'left',
              }}
              placeholder={t('comment_txt')}
              onChangeText={val => setValue(val)}
              value={value}
              maxLength={250}
              editable={isUserApproved}
            />
          )}
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={
              community_user_id != user_id && communityDetails?.join_status == 0
            }
            onPress={() => {
              handleComments(item?.community_post_id, index, value, setValue);
            }}
            style={{width: (mobileW * 5) / 100, height: (mobileW * 5) / 100}}>
            <Image
              source={localimag.icon_send}
              style={{
                width: (mobileW * 5.5) / 100,
                height: (mobileW * 5.5) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!isUserApproved}
            activeOpacity={0.8}
            onPress={() => {
              setPost_user_name(item?.name);
              setCommunity_post_id(item?.community_post_id);
              setOther_user_id(item?.user_id);
              if (community_user_id == user_id) {
                setisMyFeedPostModal(true);
              } else {
                setModalStaus(true);
              }
            }}>
            <Image
              source={localimag.icon_menuGrey}
              style={{
                width: (mobileW * 5) / 100,
                height: (mobileW * 5) / 100,
                marginLeft: (mobileW * 1) / 100,
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
          paddingBottom: (mobileW * 4) / 100,
          paddingHorizontal: (mobileW * 1) / 100,
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          disabled={!isUserApproved}
          onPress={() => {
            setisViewCommentsModal(true);
            GetAllComments(item?.community_post_id);
            setCommunity_post_id(item?.community_post_id);
          }}
          style={{}}>
          <Text
            style={{
              color: Colors.themeColor,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 3) / 100,
            }}>
            {t('viewComments_txt')}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            disabled={!isUserApproved}
            onPress={() => {
              onCommunityPostShare(item?.community_post_id);
              // navigate('CommunityPostScreen')
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
                      style={{flexDirection: 'row', alignItems: 'flex-start'}}>
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
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          {item?.replies?.length <= 0 && (
                            <TouchableOpacity onPress={() => handleReply(item)}>
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

                          {user_id == item?.user_id && (
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
                        {item?.replies?.slice(0, 1).map((replyItem, index) => (
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

                              {user_id == replyItem?.user_id && (
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
                                        config.language == 1 ? 'right' : 'left',
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
                {community_user_id != user_id &&
                communityDetails?.join_status == 0 ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      msgProvider.alert(
                        t('information_txt'),
                        t('joinFirstToComment_txt'),
                        false,
                      );
                      return false;
                    }}
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
                      justifyContent: 'center',
                      paddingHorizontal: (mobileW * 4) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.themeColor,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3.2) / 100,
                      }}>
                      {t('join_first_to_comment_txt')}
                    </Text>
                  </TouchableOpacity>
                ) : (
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
                )}
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
              bottom: (-mobileW * 3) / 100,
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
                  navigate('PostEdit', {post: item});
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageBackground: {
    width: mobileW,
    height: (mobileH * 25) / 100,
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '38%',
  },

  containerStyle: {
    flex: 1,
    backgroundColor: '#00000090',
    alignItems: 'center',
  },
  subContainerStyle: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: (mobileW * 5) / 100,
    borderTopRightRadius: (mobileW * 5) / 100,
    paddingHorizontal: (mobileW * 5) / 100,
    paddingVertical: (mobileH * 1) / 100,
    paddingBottom: (mobileH * 5) / 100,
  },
});
