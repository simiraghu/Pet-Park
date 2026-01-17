import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
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
import SearchBar from '../../Components/SearchBar';
import {useTranslation} from 'react-i18next';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  onSnapshot,
  where,
} from 'firebase/firestore';
import {fireStoreDB} from '../../Config/firebaseConfig';
import * as Progress from 'react-native-progress';
import Video from 'react-native-video';
import moment from 'moment';
import ConfirmModal from '../../Components/ConfirmModal';
import CommonButton from '../../Components/CommonButton';
import {pushnotification} from '../../Provider/PushNotificationHandlre';
import ApprovalModal from '../../Components/ApprovalModal';
import {SafeAreaView} from 'react-native-safe-area-context';

const Conversation = ({navigation}) => {
  const {goBack, navigate} = useNavigation();

  const {t} = useTranslation();

  const [storyData, setStoryData] = useState([
    {
      id: 0,
      img: null,
      status: false,
    },
    {
      id: 1,
      img: require('../../Icons/icon_dog_1.png'),
      status: true,
    },
    {
      id: 2,
      img: require('../../Icons/icon_artBoard_14.png'),
      status: false,
    },
    {
      id: 3,
      img: require('../../Icons/icon_artBoard_11.png'),
      status: false,
    },
    {
      id: 4,
      img: require('../../Icons/icon_artBoard_12.png'),
      status: false,
    },
    {
      id: 5,
      img: require('../../Icons/icon_artBoard_13.png'),
      status: false,
    },
    {
      id: 6,
      img: require('../../Icons/icon_dog_2.png'),
      status: false,
    },
  ]);

  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUserProfileApproved, setIsUserProfileapproved] = useState(false);

  const [userId, setUserId] = useState(null);

  const [conversationArr, setConversationArr] = useState([]);

  const [conversationFilter, setConversationFilter] = useState([]);
  const [isProfileApprovalModal, setIsProfileApprovalModal] = useState(false);
  const [isUserApproved, setIsUserApproved] = useState(false);
  const [overallUnread, setOverallUnread] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const approvalWasShown = useRef(false);
  const unsubscribersRef = useRef([]);

  useEffect(() => {
    pushnotification.redirectfun({navigation});
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (config.device_type == 'ios') {
        setTimeout(() => {
          getUserId();
          getAllChatUsers(1);
        }, 1200);
      } else {
        getUserId();
        getAllChatUsers(1);
      }
    }, []),
  );

  const getChatDocumentId = (user1, user2) => {
    const sortedIds = [user1, user2].sort();
    const chatId = sortedIds.join('_');
    return chatId;
  };

  const getUserId = async () => {
    const user_array = await localStorage.getItemObject('user_array');
    const userId = user_array?.user_id;
    setUserId(userId);
  };

  // search users

  const handleSearch = (text = '') => {
    setSearchText(text);
    const filtered = conversationArr.filter(item =>
      (item?.name ?? '').toLowerCase().includes(text.toLowerCase()),
    );
    consolepro.consolelog('filtered ===> ', filtered);
    setConversationFilter(filtered);
  };

  const [data, setData] = useState([]);
  const [storyRefreshKey, setStoryRefreshKey] = useState(0);
  const [visible, setVisible] = useState(false);

  const [isSubscriptionModal, setIsSubscriptionModal] = useState(false);

  // Get Stories =========

  const getStories = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;
      setUserId(userId);

      const API_URL = config.baseURL + `get_all_story?user_id=${userId}`;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res?.data, '<<RES');
            config.device_type == 'ios'
              ? setTimeout(() => {
                  setData(res?.data);
                }, 700)
              : setData(res?.data);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('welcomeScreen');
            } else {
              consolepro.consolelog(res, '<<RES');
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<error');
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
              approvalWasShown.current = false;
            } else {
              setIsUserApproved(false);
              setIsProfileApprovalModal(true);
              approvalWasShown.current = true;
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

  useFocusEffect(
    useCallback(() => {
      if (config.device_type === 'ios') {
        setTimeout(() => {
          getStories();
          setStoryRefreshKey(prev => prev + 1);
        }, 1200);
      } else {
        getStories();
        setStoryRefreshKey(prev => prev + 1);
      }
    }, []),
  );

  // ✅ Fetch chat users & setup listeners

  // const getAllChatUsers = async () => {
  //   try {
  //     setLoading(true);
  //     const user_array = await localStorage.getItemObject('user_array');
  //     const currentUserId = user_array?.user_id;

  //     const API_URL = `${config.baseURL}get_all_chat_users?user_id=${currentUserId}`;
  //     await apifuntion
  //       .getApi(API_URL, 1)
  //       .then(res => {
  //         if (res?.success) {
  //           const details_arr = res?.user_details || [];

  //           const enrichedArr = details_arr.map(user => ({
  //             ...user,
  //             last_message: '',
  //             last_message_time: '',
  //             last_message_time_raw: null,
  //             last_message_type: 0,
  //             unread_count: 0,
  //           }));

  //           setConversationArr(enrichedArr);
  //           setConversationFilter(enrichedArr);

  //           // ✅ Setup Firestore listeners (with staggered delay)
  //           unsubscribersRef.current.forEach(unsub => unsub());
  //           unsubscribersRef.current = [];

  //           enrichedArr.forEach((user, index) => {
  //             const chatId = getChatDocumentId(currentUserId, user?.user_id);
  //             const messagesRef = collection(
  //               fireStoreDB,
  //               'chats',
  //               chatId,
  //               'messages',
  //             );

  //             // ✅ Stagger listener setup to reduce load
  //             setTimeout(() => {
  //               // 🔹 Latest message listener
  //               const latestQuery = query(
  //                 messagesRef,
  //                 orderBy('timeStamp', 'desc'),
  //                 limit(1),
  //               );

  //               const unsubLatest = onSnapshot(latestQuery, snapshot => {
  //                 if (!snapshot.empty) {
  //                   const docData = snapshot.docs[0].data();

  //                   const lastMessage = docData?.isStory
  //                     ? docData.story_reply
  //                     : docData?.isMatch
  //                     ? docData.match_message
  //                     : docData.body;

  //                   const lastMessageTime = docData.timeStamp?.toDate() || null;
  //                   const lastMessageType = docData?.type ?? 0;

  //                   setConversationArr(prevArr => {
  //                     const updatedArr = prevArr.map(item =>
  //                       item.user_id === user.user_id
  //                         ? {
  //                             ...item,
  //                             last_message: lastMessage,
  //                             last_message_time: lastMessageTime
  //                               ? moment(lastMessageTime).fromNow()
  //                               : '',
  //                             last_message_time_raw: lastMessageTime,
  //                             last_message_type: lastMessageType,
  //                           }
  //                         : item,
  //                     );
  //                     const sortedArr = sortByLastMessage(updatedArr);
  //                     setConversationFilter(sortedArr);
  //                     return sortedArr;
  //                   });
  //                 }
  //               });

  //               // 🔹 Unread message count listener
  //               const unreadQuery = query(
  //                 messagesRef,
  //                 where('isRead', '==', false),
  //               );
  //               const unsubUnread = onSnapshot(unreadQuery, snapshot => {
  //                 const unreadCount = snapshot.docs.filter(
  //                   doc => doc.data().senderId !== currentUserId,
  //                 ).length;

  //                 setConversationArr(prevArr => {
  //                   const updatedArr = prevArr.map(item =>
  //                     item.user_id === user.user_id
  //                       ? {...item, unread_count: unreadCount}
  //                       : item,
  //                   );
  //                   const sortedArr = sortByLastMessage(updatedArr);
  //                   setConversationFilter(sortedArr);

  //                   // 🔹 Update overall unread count
  //                   const overallCount = sortedArr.reduce(
  //                     (sum, u) => sum + (u.unread_count || 0),
  //                     0,
  //                   );
  //                   setOverallUnread(overallCount);

  //                   return sortedArr;
  //                 });
  //               });

  //               unsubscribersRef.current.push(unsubLatest, unsubUnread);
  //             }, index * 50); // ⏱ stagger by 50ms per user
  //           });
  //         }

  //         setLoading(false);
  //       })
  //       .catch(error => {
  //         consolepro.consolelog('Error ==========>>', error);
  //       });
  //   } catch (error) {
  //     consolepro.consolelog(error, '<<ERROR');
  //     setConversationArr([]);
  //     setConversationFilter([]);
  //     setLoading(false);
  //   }
  // };

  const getAllChatUsers = async () => {
    try {
      setLoading(true);

      const user_array = await localStorage.getItemObject('user_array');
      const currentUserId = user_array?.user_id;

      const API_URL = `${config.baseURL}get_all_chat_users?user_id=${currentUserId}`;
      const res = await apifuntion.getApi(API_URL, 1);

      if (res?.success) {
        const details_arr = res?.user_details || [];

        const tempMap = new Map();
        let updateCounter = 0;

        // Clear old listeners
        unsubscribersRef.current.forEach(unsub => unsub());
        unsubscribersRef.current = [];

        details_arr.forEach(async user => {
          const enrichedUser = {
            ...user,
            last_message: '',
            last_message_time: '',
            last_message_time_raw: null,
            last_message_type: 0,
            unread_count: 0,
          };

          tempMap.set(user.user_id, enrichedUser);

          const chatId = getChatDocumentId(currentUserId, user.user_id);
          const messagesRef = collection(
            fireStoreDB,
            'chats',
            chatId,
            'messages',
          );

          // 🔹 Fetch initial last message
          const lastMsgSnap = await getDocs(
            query(messagesRef, orderBy('timeStamp', 'desc'), limit(1)),
          );
          if (!lastMsgSnap.empty) {
            const docData = lastMsgSnap.docs[0].data();
            const lastMessage = docData?.isStory
              ? docData.story_reply
              : docData?.isMatch
              ? docData.match_message
              : docData.body || '';

            const lastMessageTime = docData.timeStamp?.toDate() || null;
            const lastMessageType = docData?.type ?? 0;

            const prev = tempMap.get(user.user_id);
            tempMap.set(user.user_id, {
              ...prev,
              last_message: lastMessage,
              last_message_time: lastMessageTime
                ? moment(lastMessageTime).fromNow()
                : '',
              last_message_time_raw: lastMessageTime,
              last_message_type: lastMessageType,
            });
          }

          // 🔹 Fetch initial unread count
          const unreadSnap = await getDocs(
            query(messagesRef, where('isRead', '==', false)),
          );
          const unreadCount = unreadSnap.docs.filter(
            doc => doc.data().senderId !== currentUserId,
          ).length;

          const prev = tempMap.get(user.user_id);
          tempMap.set(user.user_id, {
            ...prev,
            unread_count: unreadCount,
          });

          // ✅ Count and build list
          updateCounter++;
          if (updateCounter === details_arr.length) {
            const finalArray = sortByLastMessage(Array.from(tempMap.values()));
            setConversationArr(finalArray);
            setConversationFilter(finalArray);

            const totalUnread = finalArray.reduce(
              (sum, u) => sum + (u.unread_count || 0),
              0,
            );
            setOverallUnread(totalUnread);
            setLoading(false);
          }

          // 🔁 Real-time updates
          const unsubLatest = onSnapshot(
            query(messagesRef, orderBy('timeStamp', 'desc'), limit(1)),
            snapshot => {
              if (!snapshot.empty) {
                const docData = snapshot.docs[0].data();
                const lastMessage = docData?.isStory
                  ? docData.story_reply
                  : docData?.isMatch
                  ? docData.match_message
                  : docData.body || '';

                const lastMessageTime = docData.timeStamp?.toDate() || null;
                const lastMessageType = docData?.type ?? 0;

                setConversationArr(prevArr => {
                  const updated = prevArr.map(item =>
                    item.user_id === user.user_id
                      ? {
                          ...item,
                          last_message: lastMessage,
                          last_message_time: lastMessageTime
                            ? moment(lastMessageTime).fromNow()
                            : '',
                          last_message_time_raw: lastMessageTime,
                          last_message_type: lastMessageType,
                        }
                      : item,
                  );
                  const sorted = sortByLastMessage(updated);
                  setConversationFilter(sorted);
                  return sorted;
                });
              }
            },
          );

          const unsubUnread = onSnapshot(
            query(messagesRef, where('isRead', '==', false)),
            snapshot => {
              const unreadCount = snapshot.docs.filter(
                doc => doc.data().senderId !== currentUserId,
              ).length;

              setConversationArr(prevArr => {
                const updated = prevArr.map(item =>
                  item.user_id === user.user_id
                    ? {
                        ...item,
                        unread_count: unreadCount,
                      }
                    : item,
                );
                const sorted = sortByLastMessage(updated);
                setConversationFilter(sorted);
                const totalUnread = sorted.reduce(
                  (sum, u) => sum + (u.unread_count || 0),
                  0,
                );
                setOverallUnread(totalUnread);
                return sorted;
              });
            },
          );

          unsubscribersRef.current.push(unsubLatest, unsubUnread);
        });
      } else {
        console.log('User approval and subscription check:', {
          isUserApproved,
          isProfileApprovalModal,
          approvalWasShown: approvalWasShown.current,
          subscriptionStatus: res?.subscription_status,
        });

        if (res?.active_flag === 0) {
          localStorage.clear();
          navigate('WelcomeScreen');
          setConversationArr([]);
          setConversationFilter([]);
        } else if (res?.approve_flag == 0 || res?.approve_flag == 2) {
          setConversationArr([]);
          setConversationFilter([]);
          setIsUserProfileapproved(true);
          // setTimeout(() => {
          //   msgProvider.alert(
          //     t('information_txt'),
          //     res?.msg[config.language],
          //     false,
          //   );
          //   return false;
          // }, 300);
        } else if (res?.subscription_status == false) {
          consolepro.consolelog(res, '<<RES');
          setConversationArr([]);
          setConversationFilter([]);
          setIsUserProfileapproved(false);
          if (config.device_type == 'ios') {
            setTimeout(() => {
              if (
                // !isUserApproved &&
                !isProfileApprovalModal &&
                !approvalWasShown.current
              ) {
                setIsSubscriptionModal(true);
              } else {
                console.log(
                  '❌ Skipped subscription modal due to recent profile modal',
                );
              }
            }, 800);
          } else {
            setTimeout(() => {
              if (
                // !isUserApproved &&
                !isProfileApprovalModal &&
                !approvalWasShown.current
              ) {
                setIsSubscriptionModal(true);
              } else {
                console.log(
                  '❌ Skipped subscription modal due to recent profile modal',
                );
              }
            }, 200);
          }
        } else {
          consolepro.consolelog('RES=============>>', res);
          setIsUserProfileapproved(false);

          setConversationArr([]);
          setConversationFilter([]);
          setLoading(false);
        }
        setConversationArr([]);
        setConversationFilter([]);
        setLoading(false);
      }
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
      setConversationArr([]);
      setConversationFilter([]);
      setLoading(false);
    }
  };

  // ✅ Sort helper (latest first)

  const sortByLastMessage = arr => {
    return [...arr].sort((a, b) => {
      const timeA = a.last_message_time_raw
        ? new Date(a.last_message_time_raw).getTime()
        : 0;
      const timeB = b.last_message_time_raw
        ? new Date(b.last_message_time_raw).getTime()
        : 0;
      return timeB - timeA;
    });
  };

  // ✅ Cleanup listeners on unmount

  useEffect(() => {
    return () => {
      unsubscribersRef.current.forEach(unsub => unsub());
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      getAllChatUsers();
      setRefreshing(false);
    }, 1000);
  };

  consolepro.consolelog('Over All Count From Firesbase: ', overallUnread);
  consolepro.consolelog('Converstation sorted Array :: ', conversationArr);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {/*--------  header---------*/}
        <View
          style={{
            width: (mobileW * 88) / 100,
            marginTop: (mobileH * 3.5) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            alignSelf: 'center',
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
        </View>

        {/* ---- header end -------- */}

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
            {t('conversations_txt')}
          </Text>
          <Text
            style={{
              color: Colors.headingColor,
              fontSize: (mobileW * 3.5) / 100,
              fontFamily: Font.FontMedium,
            }}>
            {t('treasureEveryPawSome_txt')}
          </Text>
        </View>

        {/* --------------- story ------------- */}
        {/* {!isUserProfileApproved && ( */}

        <View
          style={{
            marginTop: (mobileH * 1.5) / 100,
            marginHorizontal: (mobileW * 5) / 100,
          }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              direction: config.language == 1 ? 'rtl' : 'ltr',
              flexDirection: config.language == 1 ? 'row-reverse' : 'row',
            }}
            contentContainerStyle={{
              justifyContent: 'flex-end',
              width: (mobileW * 90) / 100,
              alignSelf: 'flex-end',

              // flexDirection: config.language == 1 ? 'row-reverse' : 'row',
            }}>
            {data?.[0]?.stories?.length <= 0 && userId == data[0]?.user_id && (
              <TouchableOpacity
                disabled={!isUserApproved}
                activeOpacity={0.8}
                onPress={() => navigate('CreateStory')}
                style={{
                  width: (mobileW * 19.5) / 100,
                  height: (mobileW * 19.5) / 100,
                  backgroundColor: Colors.homeCardbackgroundColor,
                  borderRadius: (mobileW * 7) / 100,
                  borderWidth: 1,
                  borderColor: Colors.themeColor,
                  alignItems: 'center',
                  marginRight: (mobileW * 2) / 100,
                  marginTop: (mobileH * 1.5) / 100,
                  marginHorizontal: (mobileW * 1) / 100,
                }}>
                <View
                  style={{
                    backgroundColor: Colors.themeColor,
                    borderRadius: (mobileW * 10) / 100,
                    alignItems: 'center',
                    width: (mobileW * 6) / 100,
                    height: (mobileW * 6) / 100,
                    marginTop: (mobileH * 1) / 100,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontRegular,
                      fontSize: (mobileW * 4) / 100,
                    }}>
                    +
                  </Text>
                </View>

                <Text
                  style={{
                    color: Colors.themeColor,
                    fontSize: (mobileW * 3) / 100,
                    fontFamily: Font.FontMedium,
                    textAlign: 'center',
                    width: (mobileW * 18) / 100,
                    marginTop: (mobileH * 0.4) / 100,
                  }}>
                  {t('createStory_txt')}
                </Text>
              </TouchableOpacity>
            )}

            {data?.length > 0 && (
              <View style={{flex: 1}}>
                <FlatList
                  data={
                    data[0]?.stories?.length == 0
                      ? data.slice(1) // Skip the first user if they have no stories
                      : data
                  }
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    marginTop: (mobileH * 1.5) / 100,
                    gap: (mobileW * 2) / 100,
                    flexDirection: config.language == 1 ? 'row-reverse' : 'row',
                  }}
                  // style={{backgroundColor: 'red'}}
                  inverted={config.language == 1}
                  style={{
                    direction: config.language == 1 ? 'rtl' : 'ltr',
                    flexDirection: config.language == 1 ? 'row-reverse' : 'row',
                  }}
                  renderItem={({item, index}) => (
                    <View style={{flex: 1}}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                          key={index}
                          disabled={!isUserApproved}
                          activeOpacity={0.8}
                          onPress={() => {
                            navigate('ViewStory', {selectedUserIndex: index});
                          }}
                          style={{
                            width: (mobileW * 20) / 100,
                            height: (mobileW * 20) / 100,
                            backgroundColor: Colors.whiteColor,
                            borderRadius: (mobileW * 7) / 100,
                            borderWidth: 2,
                            borderColor: item.status
                              ? Colors.themeColor
                              : Colors.storyBorderColor,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Image
                            source={
                              item?.user_image
                                ? {uri: config.img_url + item.user_image}
                                : localimag.icon_add_user
                            }
                            style={{
                              width: (mobileW * 18.5) / 100,
                              height: (mobileW * 18.5) / 100,
                              borderRadius: (mobileW * 7) / 100,
                            }}
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontSemibold,
                            fontSize: (mobileW * 2.7) / 100,
                            marginTop: (mobileW * 1) / 100,
                          }}>
                          {item?.user_id == userId
                            ? 'Your Story'
                            : item?.user_name?.length > 10
                            ? item?.user_name?.slice(0, 10) + '...'
                            : item?.user_name}
                        </Text>

                        {/* Show the + button only for the first user */}
                        {userId == item?.user_id && (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigate('CreateStory')}
                            style={styles.button}>
                            <Text style={styles.buttonText}>+</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}
                />
              </View>
            )}
          </ScrollView>
        </View>

        {/* )} */}
        {/* --------------------------- */}

        {/* {!isUserProfileApproved && ( */}

        <SearchBar
          value={searchText}
          setValue={text => {
            setSearchText(text);
            handleSearch(text);
          }}
          placeHolderText={t('search_txt')}
          containerStyle={{
            alignSelf: 'center',
            marginBottom: (mobileH * 1.5) / 100,
          }}
          editable={isUserApproved}
        />

        {/* )} */}

        {/* -------------------------------------- */}

        <FlatList
          data={conversationFilter}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.mainView,
            {
              paddingBottom: (mobileH * 15) / 100,
            },
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item, index}) => (
            <Listview
              item={item}
              index={index}
              userId={userId}
              getAllChatUsers={getAllChatUsers}
              isUserApproved={isUserApproved}
            />
          )}
          ListEmptyComponent={() =>
            !loading ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: (mobileW * 40) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontSize: (mobileW * 3.3) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {t('start_a_converstation_here_txt')}
                </Text>
              </View>
            ) : null
          }
        />

        {/* Subscription modal */}

        {!isProfileApprovalModal && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isSubscriptionModal}
            onRequestClose={() => setIsSubscriptionModal(false)}>
            <TouchableOpacity
              onPress={() => setIsSubscriptionModal(false)}
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
                  borderRadius: (mobileW * 3) / 100,
                  paddingHorizontal: (mobileW * 5) / 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: (mobileW * 80) / 100,
                  paddingVertical: (mobileW * 7) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 3) / 100,
                    textAlign: 'center',
                  }}>
                  {t('Subscription_popup_message_txt')}
                </Text>

                <CommonButton
                  disabled={!isUserApproved}
                  containerStyle={{
                    backgroundColor: Colors.themeColor2,
                    width: (mobileW * 50) / 100,
                    marginTop: (mobileW * 7) / 100,
                  }}
                  title={t('buy_subscription_txt')}
                  btnTextStyle={{
                    fontSize: (mobileW * 3.7) / 100,
                    fontFamily: Font.FontSemibold,
                  }}
                  onPress={() => {
                    setIsSubscriptionModal(false);
                    setTimeout(() => {
                      navigate('Subscription');
                    }, 300);
                  }}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        )}

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

export default Conversation;

const StoryView = ({item, index}) => {
  const {navigate} = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigate('ViewStory', {type: 1})}
      style={{
        width: (mobileW * 20) / 100,
        height: (mobileW * 20) / 100,
        backgroundColor: Colors.whiteColor,
        borderRadius: (mobileW * 7) / 100,
        borderWidth: 2,
        borderColor: item.status ? Colors.themeColor : Colors.storyBorderColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={item.img}
        style={{
          width: (mobileW * 18.5) / 100,
          height: (mobileW * 18.5) / 100,
          borderRadius: (mobileW * 7) / 100,
        }}
      />
    </TouchableOpacity>
  );
};

const Listview = ({item, index, userId, getAllChatUsers, isUserApproved}) => {
  const {navigate} = useNavigation();
  const [isSelected, setIsSelected] = useState(false);
  const [isDeleteChatmodal, setIsDeleteChatmodal] = useState(false);
  const [other_user_id_forDeletion, setOther_user_id_forDeletion] =
    useState('');
  const [selectedUserId, setSelectedUserId] = useState(null); // null means no selection

  const {t} = useTranslation();

  // delete chat user ============

  const deleteChatUser = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const user_id = user_array?.user_id;

      const API_URL = config.baseURL + 'delete_chat_user';
      const data = new FormData();

      data.append('user_id', user_id);
      data.append('other_user_id', other_user_id_forDeletion);

      apifuntion
        .postApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              msgProvider.toast(res?.msg[config.language], 'bottom');
              getAllChatUsers(1);
              return false;
            }, 800);
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
          consolepro.consolelog(error, '<<Error');
        });

      consolepro.consolelog(data, '<<DATa');
    } catch (error) {
      consolepro.consolelog(error, '<Error');
    }
  };

  consolepro.consolelog(selectedUserId, '<<Selected user id');
  consolepro.consolelog(other_user_id_forDeletion, 'Other user id fr deletion');

  consolepro.consolelog('Last Message Type ===>>', item?.last_message_type);

  return (
    <View>
      {item?.id != userId && (
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!isUserApproved}
          onPress={() => {
            navigate('ChatScreen', {
              userId: userId,
              matchId: item?.user_id,
            });
            setIsSelected(false);
            setSelectedUserId(null);
            setOther_user_id_forDeletion(null);
          }}
          style={{
            width: (mobileW * 90) / 100,
            paddingVertical: (mobileH * 1) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: (mobileH * 1) / 100,
            borderBottomWidth: 1.5,
            borderBottomColor: Colors.conversationBorderColor,
          }}>
          {/* User Image */}
          <Image
            style={{
              height: (mobileW * 13) / 100,
              width: (mobileW * 13) / 100,
              borderRadius: (mobileW * 10) / 100,
            }}
            source={{uri: config.img_url + item.user_image}}
          />

          {/* Content */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: (mobileW * 2) / 100,
            }}>
            {/* Left Side: Name + Last Message */}
            <View style={{flex: 1}}>
              {/* Name */}
              <Text
                style={{
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 4) / 100,
                  color: Colors.darkGreenColor,
                  marginBottom: (mobileH * 0.5) / 100,
                }}
                numberOfLines={1}>
                {item?.name}
              </Text>

              {/* Last Message */}
              {item?.last_message_type == 0 && (
                <Text
                  style={{
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3.3) / 100,
                    color: Colors.themeColor,
                  }}
                  numberOfLines={1}>
                  {item?.last_message}
                </Text>
              )}

              {item?.last_message_type == 1 && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={localimag?.icon_photos}
                    style={{
                      width: (mobileW * 3.5) / 100,
                      height: (mobileW * 3.5) / 100,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3.3) / 100,
                      color: Colors.themeColor,
                      marginLeft: (mobileW * 1) / 100,
                    }}>
                    Image
                  </Text>
                </View>
              )}

              {item?.last_message_type == 2 && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={localimag?.VoiceIcon}
                    style={{
                      width: (mobileW * 3.5) / 100,
                      height: (mobileW * 3.5) / 100,
                    }}
                  />
                  <Image
                    source={localimag?.waveimage}
                    style={{
                      width: (mobileW * 4) / 100,
                      height: (mobileW * 4) / 100,
                      marginLeft: (mobileW * 1) / 100,
                      tintColor: Colors.themeColor,
                    }}
                  />
                </View>
              )}
            </View>

            {/* Right Side: Time + Unread Count */}
            <View
              style={{alignItems: 'flex-end', justifyContent: 'space-between'}}>
              {/* Time */}
              <Text
                style={{
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 2.7) / 100,
                  color: Colors.darkGreenColor,
                  marginBottom: (mobileH * 1) / 100,
                }}>
                {item.last_message_time}
              </Text>

              {/* Unread Count */}
              {item?.unread_count > 0 && (
                <View
                  style={{
                    backgroundColor: Colors.themeColor2,
                    paddingHorizontal: (mobileW * 2) / 100,
                    paddingVertical: (mobileW * 0.8) / 100,
                    borderRadius: (mobileW * 50) / 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: (mobileW * 5) / 100,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: (mobileW * 2) / 100,
                      fontFamily: Font.FontMedium,
                    }}>
                    {item?.unread_count}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  mainView: {
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
  },
  replyContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    position: 'absolute',
    bottom: (mobileW * 3.5) / 100,
    right: 0,
    backgroundColor: Colors.themeColor2,
    borderRadius: (mobileW * 38) / 100,
    zIndex: 10,
    width: (mobileW * 6) / 100,
    height: (mobileW * 6) / 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: Colors.whiteColor,
    fontFamily: Font.FontSemibold,
    fontSize: (mobileW * 4.8) / 100,
    textAlign: 'center',
    alignSelf: 'center',
  },
  avatarWrapper: {
    alignItems: 'center',
    marginRight: 15,
  },
  avatar: {
    width: (mobileW * 30) / 100,
    height: (mobileW * 30) / 100,
    borderRadius: (mobileW * 50) / 100,
    borderWidth: 2,
    borderColor: 'red',
  },
  avatarText: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
  storyContainer: {
    flex: 1,
    backgroundColor: Colors.blackColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: mobileW,
    height: mobileH,
    resizeMode: 'cover',
    position: 'absolute',
  },
  header: {
    position: 'absolute',
    top: (mobileW * 7) / 100,
    left: (mobileW * 5) / 100,
    right: (mobileW * 5) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: (mobileW * 10) / 100,
    height: (mobileW * 10) / 100,
    borderRadius: (mobileW * 50) / 100,
    marginRight: (mobileW * 3) / 100,
  },
  headerName: {
    color: '#fff',
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontMedium,
  },
  dots: {
    color: '#fff',
    fontSize: (mobileW * 6) / 100,
    paddingHorizontal: (mobileW * 2) / 100,
  },
  progressBarContainer: {
    position: 'absolute',
    top: (mobileW * 2) / 100,
    left: (mobileW * 2) / 100,
    right: (mobileW * 2) / 100,
    height: (mobileW * 1) / 100,
    flexDirection: 'row',
    zIndex: 1,
    justifyContent: 'space-between',
  },

  progressBarContainer: {
    position: 'absolute',
    top: (mobileW * 2) / 100,
    left: (mobileW * 2) / 100,
    right: (mobileW * 2) / 100,
    height: (mobileW * 1) / 100,
    flexDirection: 'row',
    zIndex: 1,
    justifyContent: 'space-between',
  },

  progressBarBackground: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: (mobileW * 2) / 100,
    overflow: 'hidden',
    marginRight: (mobileW * 1) / 100,
  },

  progressBarForeground: {
    height: '100%',
    borderRadius: (mobileW * 2) / 100,
  },

  storyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: (mobileW * 2) / 100,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
  },
});
