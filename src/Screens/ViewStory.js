import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Keyboard,
  FlatList,
} from 'react-native';
import Video from 'react-native-video';
import * as Progress from 'react-native-progress';
import {config} from '../Provider/configProvider';
import {
  Colors,
  consolepro,
  Font,
  localimag,
  mobileH,
  localStorage,
  mobileW,
  apifuntion,
  msgProvider,
} from '../Provider/utilslib/Utils';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {addDoc, collection, doc, serverTimestamp} from 'firebase/firestore';
import {fireStoreDB} from '../Config/firebaseConfig';
import {SafeAreaView} from 'react-native-safe-area-context';

const ViewStory = () => {
  const isInitialLoad = useRef(true);
  const [data, setData] = useState([]);
  const {navigate, goBack} = useNavigation();
  const [replyText, setReplyText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storyID, setStoryID] = useState(null);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const viewedStories = useRef(new Set());
  const [videoDuration, setVideoDuration] = useState(0);
  const [userId, setUserId] = useState(null);
  const [isViewerModal, setIsViewerModal] = useState(false);
  const [viewerData, setViewerData] = useState([]);
  const [chatMessage, setChatMessage] = useState(null);
  const [myData, setMyData] = useState(null);

  const {params} = useRoute();
  const {t} = useTranslation();
  const shouldPause = isViewerModal || showDeleteModal || keyboardVisible;
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      console.log('Keyboard Shown');
      setKeyboardVisible(true);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      console.log('Keyboard Hidden');
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const getMyDetails = async () => {
    const user_array = await localStorage.getItemObject('user_array');
    consolepro.consolelog('user_array ===> ', user_array);
    setMyData(user_array);
  };

  const sortedIds = [userId, data[currentUserIndex]?.user_id].sort();
  const chatId = sortedIds.join('_');
  const chatRef = doc(fireStoreDB, 'chats', chatId);

  // Handle Reply ======

  consolepro.consolelog('My DATa ====>>', myData);

  const handleSendReply = async (type = 0, url = '', isStory = true) => {
    // For text, make sure chatMessage is not empty
    if (type === 0 && !chatMessage) return;

    try {
      const messagesRef = collection(chatRef, 'messages');

      const messageData = {
        senderId: userId,
        senderName: myData?.name,
        profilePic: myData?.user_images[0]?.image || '',
        timeStamp: serverTimestamp(),
        type: Number(type),
        story_reply: type === 0 ? chatMessage : '',
        image_url: '',
        voice_url: '',
        isStory: isStory,
        story_url:
          data[currentUserIndex]?.stories[currentStoryIndex]?.type == 1
            ? data[currentUserIndex]?.stories[currentStoryIndex]?.story_image ||
              ''
            : data[currentUserIndex]?.stories[currentStoryIndex]?.thumbnail ||
              '',
        isRead: false,
      };

      consolepro.consolelog('Message Data ======>>', messageData);

      await addDoc(messagesRef, messageData);

      setChatMessage(null);
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // update seen stories

  const updateSeenStories = async story_id => {
    try {
      consolepro.consolelog('story_id =======>>>', story_id);
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;
      consolepro.consolelog('<<updating');

      const API_URL =
        config.baseURL +
        `update_view_count?user_id=${userId}&story_id=${story_id}`;

      consolepro.consolelog(API_URL, '<<API_URL');

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
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
          consolepro.consolelog(error, '<<error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<error');
    }
  };

  //  handle Delete story

  const handleDeleteStory = async ({userId, story_id}) => {
    consolepro.consolelog('userId =======>>>', userId);
    consolepro.consolelog('story_id =======>>>', story_id);

    const data = new FormData();
    data.append('user_id', userId);
    data.append('story_id', story_id);

    consolepro.consolelog(data, '<<data');
    const API_URL = config.baseURL + `delete_story`;

    apifuntion
      .postApi(API_URL, data, 0)
      .then(res => {
        if (res?.success == true) {
          consolepro.consolelog(res, '<<RES');
          setTimeout(() => {
            setShowDeleteModal(false);
            setVisible(false);
            msgProvider.toast(res?.msg[config.language], 'bottom');
            goBack();
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
  };

  // get all stories

  const getAllStories = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;
      setUserId(userId);

      const API_URL = config.baseURL + `get_all_story?user_id=${userId}`;

      apifuntion.getApi(API_URL, 1).then(res => {
        if (res?.success === true) {
          const storyData = res?.data;
          let validStoryUsers = storyData.filter(
            user => user?.stories?.length > 0,
          );
          setData(validStoryUsers);

          if (isInitialLoad.current) {
            const selectedIndex = params?.selectedUserIndex ?? 0;
            setCurrentUserIndex(selectedIndex);
            setCurrentStoryIndex(0);
            isInitialLoad.current = false;
          }

          setVisible(true);
        } else {
          if (res?.active_flag === 0) {
            localStorage.clear();
            navigate('welcomeScreen');
          }
        }
      });
    } catch (err) {
      consolepro.consolelog(err, '<<error');
    }
  };

  // Get all story viewers

  const getAllStoryViewers = async ({story_id}) => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      consolepro.consolelog(story_id, '<<Story id');
      const API_URL =
        config.baseURL +
        `get_story_view_users?user_id=${userId}&story_id=${story_id}`;

      consolepro.consolelog(API_URL, 'API URL');

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            setViewerData(res?.user_arr);
            consolepro.consolelog(res, '<<Res');
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res, '<<RES');
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Error');
    }
  };

  const handleLoadStart = () => {
    console.log('Loading started...');

    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    console.log('Loading ended...');
    setIsLoading(false);
  };

  const handleVideoLoad = meta => {
    // Add slight delay to ensure it's ready visually
    const actualDuration = meta?.duration;
    consolepro.consolelog(actualDuration, '<<actual duration');
    setVideoDuration(Math.min(actualDuration, 15)); // Cap to 15 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 300); // Adjust timing as needed
  };

  useEffect(() => {
    if (
      currentUserIndex >= data.length ||
      currentStoryIndex >= data[currentUserIndex]?.stories?.length ||
      isViewerModal ||
      showDeleteModal ||
      keyboardVisible
    ) {
      return;
    }

    let startTime = null;
    let animationFrameId = null;

    const currentStory =
      data[currentUserIndex]?.stories[currentStoryIndex] || {};
    const isVideo = currentStory.type == 2;

    const durationMs = isVideo ? Math.min(videoDuration || 0, 15) * 1000 : 5000;

    const animateProgress = timestamp => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;

      const newProgress = Math.min(elapsedTime / durationMs, 1);
      setProgress(newProgress);

      if (newProgress >= 1) {
        goToNextStory();
      } else {
        animationFrameId = requestAnimationFrame(animateProgress);
      }
    };

    if (!isLoading && (isVideo ? videoDuration > 0 : true)) {
      animationFrameId = requestAnimationFrame(animateProgress);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      setProgress(0);
    };
  }, [
    visible,
    currentUserIndex,
    currentStoryIndex,
    data.length,
    goToNextStory,
    isLoading,
    videoDuration,
    isViewerModal,
    showDeleteModal,
    keyboardVisible,
  ]);

  const goToNextStory = useCallback(() => {
    const user = data[currentUserIndex];

    if (currentStoryIndex < user?.stories?.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      goToNextUser();
    }
  }, [data, currentStoryIndex, currentUserIndex]);

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(i => i - 1);
      setProgress(0);
      Keyboard.dismiss();
    } else {
      goToPrevUser();
    }
  };

  const goToNextUser = () => {
    if (currentUserIndex < data?.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
      Keyboard.dismiss();
      setShowDeleteModal(false);
    } else {
      // Close the story view if no more users
      closeStory();
    }
  };

  const goToPrevUser = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(i => i - 1);
      setCurrentStoryIndex(0);
      setProgress(0);
      Keyboard.dismiss();
      setShowDeleteModal(false);
    }
  };

  const hasNavigatedBackRef = useRef(false);

  const closeStory = () => {
    if (hasNavigatedBackRef?.current) return;

    const validStoryUsers = data.filter(
      user => user?.stories && user?.stories.length > 0,
    );
    const currentUser = validStoryUsers[currentUserIndex];
    const currentUserStories = currentUser?.stories || [];

    const isLastUser = currentUserIndex === validStoryUsers?.length - 1;
    const isLastStory = currentStoryIndex === currentUserStories?.length - 1;

    if (isLastUser && isLastStory) {
      hasNavigatedBackRef.current = true; // Lock immediately, sync-safe

      setTimeout(() => {
        goBack();
        setShowDeleteModal(false);
      }, 400);
    }
  };

  useEffect(() => {
    const currentUser = data[currentUserIndex];
    const currentStory = currentUser?.stories?.[currentStoryIndex];

    console.log('useEffect triggered');
    console.log('Current Story:', currentStory);

    if (currentStory?.story_id) {
      console.log('Story viewed:', currentStory?.story_id);
      viewedStories?.current?.add(currentStory?.story_id);
      updateSeenStories(currentStory?.story_id);
    }
  }, [visible, currentUserIndex, currentStoryIndex]);

  useFocusEffect(
    useCallback(() => {
      if (config.device_type == 'ios') {
        setTimeout(() => {
          getAllStories();
          getMyDetails();
        }, 1200);
      } else {
        getAllStories();
        getMyDetails();
      }
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (config.device_type == 'ios') {
        setTimeout(() => {
          getAllStoryViewers();
        }, 1200);
      } else {
        getAllStoryViewers();
      }
    }, []),
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.blackColor}}>
        {data[currentUserIndex] && (
          <TouchableWithoutFeedback
            style={{backgroundColor: Colors.blackColor, flex: 1}}
            onPress={e => {
              const x = e.nativeEvent.locationX;
              if (x < mobileW / 2) {
                goToPrevStory();
                Keyboard.dismiss();
              } else {
                goToNextStory();
                Keyboard.dismiss();
              }
            }}>
            <View style={styles?.storyContainer}>
              {data[currentUserIndex]?.stories[currentStoryIndex]?.type == 2 ? (
                <Video
                  source={{
                    uri:
                      config.img_url +
                      data[currentUserIndex]?.stories[currentStoryIndex]
                        ?.story_image,
                  }}
                  style={styles?.storyImage}
                  resizeMode="cover"
                  muted={false}
                  repeat={false}
                  onLoadStart={handleLoadStart}
                  onLoad={handleVideoLoad}
                  paused={shouldPause}
                />
              ) : (
                <Image
                  source={{
                    uri:
                      config.img_url +
                      data[currentUserIndex]?.stories[currentStoryIndex]
                        ?.story_image,
                  }}
                  style={styles.storyImage}
                  onLoadStart={handleLoadStart}
                  onLoad={handleVideoLoad}
                  resizeMode={'contain'}
                />
              )}
              {isLoading && (
                <ActivityIndicator
                  size="large"
                  color={Colors.themeColor}
                  style={styles.loader}
                  // backgroundColor={Colors.whiteColor}
                />
              )}
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.userRow}>
                  {data[currentUserIndex]?.user_id != userId && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => goBack()}>
                      <Image
                        source={localimag.icon_back_arrow}
                        style={{
                          width: (mobileW * 5) / 100,
                          height: (mobileW * 5) / 100,
                          marginRight: (mobileW * 2) / 100,

                          transform: [
                            config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                          ],
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  <Image
                    source={
                      data[currentUserIndex]?.user_image
                        ? {
                            uri:
                              config.img_url +
                              data[currentUserIndex]?.user_image,
                          }
                        : localimag.icon_userPlaceholder
                    }
                    style={styles.headerAvatar}
                  />
                  <Text style={styles.headerName}>
                    {data[currentUserIndex]?.user_name}
                  </Text>
                </View>

                {data[currentUserIndex]?.user_id == userId && (
                  <TouchableOpacity
                    onPress={() => {
                      consolepro.consolelog(
                        data[currentUserIndex]?.stories[currentStoryIndex]
                          ?.story_id,
                        '<<currentUser',
                      );
                      setShowDeleteModal(true);
                      setStoryID(
                        data[currentUserIndex]?.stories[currentStoryIndex]
                          ?.story_id,
                      );
                    }}
                    style={{
                      width: (mobileW * 7) / 100,
                      height: (mobileW * 7) / 100,
                    }}>
                    <Text style={styles.dots}>⋮</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Progress Bars */}
              <View style={styles.progressBarContainer}>
                {data[currentUserIndex]?.stories.map((_, index) => (
                  <View key={index} style={styles.progressBarBackground}>
                    <Progress.Bar
                      progress={
                        index == currentStoryIndex
                          ? progress
                          : index < currentStoryIndex
                          ? 1
                          : 0
                      }
                      width={null} // Takes full width of the parent container
                      height={3} // Adjust height as needed
                      borderWidth={0}
                      color={Colors.themeColor}
                      unfilledColor="rgba(255,255,255,0.3)"
                      animated={false}
                    />
                  </View>
                ))}
              </View>

              <View
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 0,
                  right: 0,
                  paddingHorizontal: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {data[currentUserIndex]?.user_id == userId ? (
                  <TouchableOpacity
                    onPress={() => {
                      setIsViewerModal(true);
                      getAllStoryViewers({
                        story_id:
                          data[currentUserIndex]?.stories[currentStoryIndex]
                            ?.story_id,
                      });
                    }}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: (mobileW * 3) / 100,
                    }}>
                    <Image
                      source={localimag.icon_eye_open}
                      style={{
                        width: (mobileW * 7) / 100,
                        height: (mobileW * 7) / 100,
                      }}
                      tintColor={Colors.whiteColor}
                    />
                    <Text
                      style={{
                        color: Colors.whiteColor,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 2.5) / 100,
                      }}>
                      {data[0]?.stories[0]?.view_count}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <KeyboardAvoidingView
                      behavior={
                        config.device_type == 'ios' ? 'padding' : 'height'
                      }
                      keyboardVerticalOffset={(mobileW * 15) / 100}
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                      }}>
                      <TextInput
                        style={{
                          flex: 1,
                          height: (mobileW * 12) / 100,
                          backgroundColor: '#fff',
                          borderRadius: 25,
                          paddingHorizontal: (mobileW * 5) / 100,
                          fontSize: (mobileW * 4) / 100,
                          textAlign: config.language == 1 ? 'right' : 'left',
                          color: Colors.themeColor2,
                          fontFamily: Font.FontMedium,
                        }}
                        placeholder="Reply to story..."
                        placeholderTextColor="#888"
                        value={chatMessage}
                        onChangeText={setChatMessage}
                        maxLength={250}
                        keyboardType="default"
                      />
                      <TouchableOpacity
                        onPress={() => handleSendReply(0)}
                        style={{
                          marginLeft: 10,
                          backgroundColor: Colors.themeColor,
                          borderRadius: (mobileW * 50) / 100,
                          padding: (mobileW * 3) / 100,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={localimag.icon_send}
                          style={{
                            width: (mobileW * 6) / 100,
                            height: (mobileW * 6) / 100,
                          }}
                          tintColor={Colors.themeColor2}
                        />
                      </TouchableOpacity>
                    </KeyboardAvoidingView>
                  </>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}

        {/* Delete modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'flex-end',
            }}
            activeOpacity={1}
            onPressOut={() => setShowDeleteModal(false)}>
            <View
              style={{
                backgroundColor: '#fff',
                padding: 20,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}>
              <TouchableOpacity
                onPress={() => {
                  handleDeleteStory({
                    userId: data[0]?.user_id,
                    story_id: storyID,
                  });
                  setShowDeleteModal(false);
                }}
                style={{
                  backgroundColor: Colors.cancleColor,
                  padding: 12,
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  {t('delete_btn_txt')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                <Text
                  style={{
                    marginTop: 15,
                    textAlign: 'center',
                    color: Colors.themeColor2,
                  }}>
                  {t('cancel_txt')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Story viewer modal  */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isViewerModal}
          requestClose={() => {
            setIsViewerModal(false);
          }}>
          <TouchableOpacity
            onPress={() => setIsViewerModal(false)}
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
                height: (mobileH * 90) / 100,

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

              <View
                style={{
                  flex: 1,
                  marginTop: (mobileW * 5) / 100,
                  backgroundColor: Colors.whiteColor,
                }}>
                <FlatList
                  data={viewerData}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {}}
                      onLongPress={() => {}}
                      style={{
                        width: (mobileW * 90) / 100,
                        paddingVertical: (mobileH * 1) / 100,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: (mobileH * 1) / 100,
                        borderBottomWidth: 1.5,
                        borderBottomColor: Colors.conversationBorderColor,
                        alignSelf: 'center',
                      }}>
                      <Image
                        style={{
                          height: (mobileW * 10) / 100,
                          width: (mobileW * 10) / 100,
                          borderRadius: (mobileW * 10) / 100,
                        }}
                        source={
                          item?.image
                            ? {uri: config.img_url + item?.image}
                            : localimag?.icon_userPlaceholder
                        }
                      />

                      <View
                        style={{
                          flexDirection: 'row',
                          width: (mobileW * 60) / 100,
                          justifyContent: 'space-between',
                          marginLeft: (mobileW * 4) / 100,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.FontSemibold,
                              fontSize: (mobileW * 3.5) / 100,
                              color: Colors.darkGreenColor,
                              //width: (mobileW * 55) / 100,
                              textAlign: config.language == 1 ? 'left' : 'left',
                            }}>
                            {item.name?.length > 15
                              ? `${item.name?.slice(0, 15)}...`
                              : item.name}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={() => (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
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
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default ViewStory;

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

  progressBarBackground: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: (mobileW * 2) / 100,
    overflow: 'hidden',
    marginRight: (mobileW * 1) / 100,
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
