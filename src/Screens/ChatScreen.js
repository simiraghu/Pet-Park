import {
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
  Alert,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {
  localimag,
  mobileH,
  mobileW,
  Lang_chg,
  config,
  consolepro,
  localStorage,
  apifuntion,
  mediaprovider,
  msgProvider,
} from '../Provider/utilslib/Utils';
import CommonButton from '../Components/CommonButton';
import {useTranslation} from 'react-i18next';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
  getDocs,
  writeBatch,
  where,
  limit,
} from 'firebase/firestore';
import {fireStoreDB} from '../Config/firebaseConfig';
import {LegendList} from '@legendapp/list';
import {useFocusEffect} from '@react-navigation/native';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import RNFetchBlob from 'rn-fetch-blob';
import {SafeAreaView} from 'react-native-safe-area-context';

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1

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

const ChatScreen = ({navigation, route}) => {
  const [isPopUpMenu, setIsPopUpMenu] = useState(false);
  const [shareProfilePopUp, setShareProfilePopUp] = useState(false);
  const [reportProfilePopUp, setReportProfilePopUp] = useState(false);
  const [reportReason, setReportReason] = useState(0);
  const [reportThanksModal, setReportThanksModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [blockedSuccessfully, setBlockedSuccessfully] = useState(false);
  const [chatMessage, setChatMessage] = useState(null);
  const [isChatImageModal, setIsChatImageModal] = useState(false);
  const [modalImageURL, setModalImageURL] = useState('');

  const [reportReason_txt, setReportReason_txt] = useState('');

  const [myData, setMyData] = useState(null);

  const [onlineStatus, setOnlineStatus] = useState(0);

  const [messages, setMessages] = useState([]);

  const [participants, setParticipants] = useState([]);

  const [matchData, setMatchData] = useState(null);

  const [cameraModal, setCameraModal] = useState(false);
  const [galleryModal, setGalleryModal] = useState(false);
  const [selectUnmatchReason, setSelectUnmatchReason] = useState(0);

  const [unMatchPopUp, setUnMatchPopUp] = useState(false);
  const [unmatchReasonPopup, setUnmatchReasonPopup] = useState(false);
  const [isUmatchModal, setIsUmatchModal] = useState(false);

  const [unmatchReason_txt, setUnmatchReason_txt] = useState('');

  const [audioState, setAudioState] = useState({
    recordSecs: 0, //audio
    recordTime: '00:00', //audio
    audio_modal: false,
    modal_audioplay: false,
    audio_path: '',
    audioplayTime: 0,
    audioduration: 0,
    Stopaudio: false,
    loading1: false,
    post_audio_url: '',
    playAudioStatus: false,
    play_self_audio: false,
    voiceRecordingStart: 0,
    recording_Status: false,
    audioPlay: false,
    playingId: null,
  });

  const listRef = useRef(null);

  const {t} = useTranslation();

  useEffect(() => {
    createChatRoom();
    getMessages();
    getMyDetails();
    getUserOnlineStatus();
    getParticipantsDetails();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBackPress = useCallback(() => {
    navigation.navigate('Conversation', {
      screen: 'Conversation',
    });
    return true;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => backHandler.remove();
    }, [handleBackPress]),
  );

  const getMyDetails = async () => {
    const user_array = await localStorage.getItemObject('user_array');
    consolepro.consolelog('user_array ===> ', user_array);
    setMyData(user_array);
  };

  const scrollToBottom = () => {
    if (audioState?.audioPlay) return;
    if (listRef.current && messages.length > 0) {
      try {
        listRef.current.scrollToIndex({
          index: messages.length - 1,
          animated: true,
        });
      } catch (error) {
        console.warn('Scroll failed, possibly unmeasured index:', error);
      }
    }
  };

  const sortedIds = [route.params.userId, route.params.matchId].sort();
  const chatId = sortedIds.join('_');

  const chatRef = doc(fireStoreDB, 'chats', chatId);

  const createChatRoom = async () => {
    if (!route?.params?.userId || !route?.params?.matchId) {
      console.log('User ID or Match ID is missing');
      return;
    }

    const userID = route.params.userId;
    const matchId = route.params.matchId;

    try {
      const chatSnapShot = await getDoc(chatRef);
      if (!chatSnapShot.exists()) {
        console.log('Chat does not exist, creating...');
        const participants = [userID, matchId];
        await setDoc(chatRef, {participants});
        console.log('Chat room created');
      } else {
        console.log('Chat room already exists');
      }
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  const onSend = async (type = 0, url = '') => {
    if (type == 0 && !chatMessage) return;
    consolepro.consolelog(url, '<<URL');
    try {
      const messagesRef = collection(chatRef, 'messages');

      if (type == 0) {
        await addDoc(messagesRef, {
          body: chatMessage,
          senderId: route.params.userId,
          timeStamp: serverTimestamp(),
          profilePic: myData?.user_images[0]?.image,
          senderName: myData?.name,
          type: Number(type), // 1 - image, 2 - voice, 0- text
          image_url: '',
          voice_url: '',
          isRead: false,
        });
      } else if (type == 1) {
        await addDoc(messagesRef, {
          body: chatMessage || '',
          senderId: route.params.userId,
          timeStamp: serverTimestamp(),
          profilePic: myData?.user_images[0]?.image,
          senderName: myData?.name,
          type: Number(type), // 1 - image, 2 - voice, 0- text
          image_url: url,
          voice_url: '',
          isRead: false,
        });
      } else {
        await addDoc(messagesRef, {
          body: chatMessage || '',
          senderId: route.params.userId,
          timeStamp: serverTimestamp(),
          profilePic: myData?.user_images[0]?.image,
          senderName: myData?.name,
          type: Number(type), // 1 - image, 2 - voice, 0- text
          image_url: '',
          voice_url: url,
          isRead: false,
        });
      }
      setChatMessage(null);
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getMessages = () => {
    const messagesRef = collection(fireStoreDB, 'chats', chatId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timeStamp'));

    const unsubscribe = onSnapshot(messagesQuery, snapshot => {
      console.log('Snapshot ==> ', snapshot);
      const allMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        status: false,
      }));

      consolepro.consolelog('All messages ==> ', allMessages);
      setMessages(allMessages);
    });

    return unsubscribe;
  };

  const getUserOnlineStatus = async () => {
    try {
      const API_URL =
        config.baseURL +
        'get_online_status?user_id=' +
        route.params.userId +
        '&other_user_id=' +
        route.params.matchId;

      consolepro.consolelog('API URL ==> ', API_URL);

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            let status = res?.online_status;
            setOnlineStatus(status);
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

  const getParticipantsDetails = async () => {
    try {
      const API_URL =
        config.baseURL +
        'get_details?user_id=' +
        route.params.userId +
        '&other_user_id=' +
        route.params.matchId;

      consolepro.consolelog('API URL ==> ', API_URL);

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES participants');
            let user_details = res?.user_details;

            let matchData = user_details.filter(
              (item, index) => item?.user_id != route.params.userId,
            );

            consolepro.consolelog('match Data ==> ', matchData);

            setMatchData(...matchData);
            setParticipants([...user_details]);
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
      data.append('other_user_id', route.params.matchId);

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
      data.append('other_user_id', route.params.matchId);

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

  const fileUpload = async (response, fileType) => {
    try {
      const data = new FormData();

      if (fileType == 1) {
        data.append('image', {
          uri: response,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      }

      if (fileType == 2) {
        // const filePath = config.device_type === 'ios' ? response.replace('file://', '') : response;
        //consolepro.consolelog("voice url ===> ", response)
        data.append('audio', {
          uri: response,
          type: config.device_type == 'ios' ? 'audio/m4a' : 'audio/mp3',
          name: config.device_type == 'ios' ? 'audio.m4a' : 'audio.mp3',
        });
      }

      data.append('type', fileType); // 1 - image, 2 - audio

      consolepro.consolelog(data, '<<Data');

      //return false;

      const API_URL = config.baseURL + 'file_upload';

      apifuntion
        .postApi(API_URL, data, 1)
        .then(res => {
          if (res?.success == true) {
            let file_path = res?.file_path;

            consolepro.consolelog('file path ===> ', file_path);
            consolepro.consolelog(res, '<<RES');

            onSend(fileType, file_path);
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

  const open_settings = () => {
    Alert.alert(
      'Alert',
      'This app need permissions, Please allow it',
      [
        {
          text: 'Close',
          onPress: () => {
            consolepro.consolelog('nothing user cancle it ');
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

  function Camerapopen() {
    mediaprovider
      .launchCamera()
      .then(async res => {
        setCameraModal(false);
        setTimeout(() => {
          fileUpload(res.path, 1);
        }, 500);
      })
      .catch(error => {
        setCameraModal(false);
        consolepro.consolelog(' camera error ', error);
        if (config.device_type == 'ios') {
          if (error == 'Error: User did not grant camera permission.') {
            consolepro.consolelog('i am here ');
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
  }

  // --------------------Open Gallery--------------------

  const Galleryopen = () => {
    mediaprovider
      .launchGellery()
      .then(res => {
        if (res.mime == 'video/mp4') {
          msgProvider.toast('Please select only image', 'center');
          setCameraModal(false);
          return false;
        } else {
          consolepro.consolelog('res', res);
          setCameraModal(false);
          setTimeout(() => {
            fileUpload(res.path, 1);
          }, 500);
        }
      })
      .catch(error => {
        consolepro.consolelog('error', error);
        setCameraModal(false);
      });
  };

  // --------------- Audo Record ------------------------

  const onStopRecord1 = audioPath => {
    setAudioState(prev => ({
      ...prev,
      Stopaudio: false,
      playAudioStatus: false,
      audio_modal: false,
      play_self_audio: false,
      recordSecs: 0,
      voiceRecordingStart: 0,
    }));

    if (audioPath !== '') {
      console.log('Uploading audio file at', audioPath);
      fileUpload(audioPath, 2);
    } else {
      console.warn('Audio path is empty, nothing to upload.');
    }
  };

  const onStopRecord = async () => {
    setAudioState(prev => ({
      ...prev,
      Stopaudio: true,
      playAudioStatus: true,
      voiceRecordingStart: 0,
    }));

    try {
      const result = await audioRecorderPlayer.stopRecorder();
      console.log('Recording result--->', result);
      audioRecorderPlayer.removeRecordBackListener();

      setAudioState(prev => ({
        ...prev,
        recording_Status: false,
        audio_path: result,
      }));

      // Start playback here
      // await audioRecorderPlayer.startPlayer(result);
      // audioRecorderPlayer.addPlayBackListener(e => {
      //   console.log(
      //     'Playing position:',
      //     e.currentPosition,
      //     'Duration:',
      //     e.duration,
      //   );

      //   setAudioState(prev => ({
      //     ...prev,
      //     audioplayTime: e.currentPosition,
      //     audioduration: e.duration,
      //   }));

      //   if (e.currentPosition >= e.duration) {
      //     audioRecorderPlayer.stopPlayer();
      //     audioRecorderPlayer.removePlayBackListener();
      //     console.log('Playback finished');
      //   }
      // });

      // If you still want to call upload:
      onStopRecord1(result);
    } catch (err) {
      console.warn('stopRecorder error', err);
    }
  };

  const onStartRecord = async () => {
    if (config.device_type === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          onStartRecordNew();
        } else {
          open_settings();
        }
      } catch (err) {
        open_settings();
        console.warn(err);
        return;
      }
    } else {
      onStartRecordNew();
    }
  };

  const onStartRecordNew = async () => {
    setAudioState(prev => {
      return {
        ...prev,
        Stopaudio: false,
        voiceRecordingStart: 1,
      };
    });
    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: 'hello.m4a',
      android: `${dirs.CacheDir}/hello.mp3`,
    });
    try {
      const result = await audioRecorderPlayer.startRecorder(path);
      //  const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener(e => {
        setAudioState(prev => {
          return {
            ...prev,
            recording_Status: true,
          };
        });

        setAudioState(prev => {
          return {
            ...prev,
            recordSecs: e.currentPosition,
            recordTime: audioRecorderPlayer.mmssss(
              Math.floor(e.currentPosition),
            ),
          };
        });

        return;
      });
    } catch (error) {
      console.log('Recording error:', error);

      // ✅ Detect iOS permission denial
      if (Platform.OS === 'ios') {
        msgProvider.toast(
          'Microphone access denied. Enable it in Settings.',
          'bottom',
        );
        return false;
      }
    }
  };

  const onTogglePlay = async (path, id, index) => {
    if (audioState.playingId === id && audioState.audioPlay) {
      // Pause current audio
      await audioRecorderPlayer.pausePlayer();

      setAudioState(prev => ({
        ...prev,
        audioPlay: false,
      }));

      // Set status to false for the current item
      setMessages(prevMessages =>
        prevMessages.map((msg, i) =>
          i === index ? {...msg, status: false} : msg,
        ),
      );

      return;
    }

    // Stop previous audio
    if (audioState.playingId && audioState.playingId !== id) {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    }

    // Update audio state
    setAudioState(prev => ({
      ...prev,
      audioPlay: true,
      playingId: id,
      audioplayTime: 0,
      audioduration: 0,
    }));

    // Update message status: set current index to true, others to false
    setMessages(prevMessages =>
      prevMessages.map((msg, i) => ({
        ...msg,
        status: i === index,
      })),
    );

    await audioRecorderPlayer.startPlayer(path);

    audioRecorderPlayer.addPlayBackListener(e => {
      setAudioState(prev => ({
        ...prev,
        audioplayTime: e.currentPosition,
        audioduration: e.duration,
      }));

      if (e.currentPosition >= e.duration) {
        audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();

        setAudioState(prev => ({
          ...prev,
          audioPlay: true,
          playingId: id,
          audioplayTime: 0,
          audioduration: 0,
        }));

        // Reset all statuses to false
        setMessages(prevMessages =>
          prevMessages.map(msg => ({
            ...msg,
            status: false,
          })),
        );
      }
    });
  };

  // consolepro.consolelog('match data =====>>', matchData);
  const unMatch = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();

      let unmatch_reason = ['No Reason', 'لا سبب', '没有原因'];

      data.append('user_id', userId);
      data.append('other_user_id', matchData?.user_id);

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
            setSelectUnmatchReason(0);
            setTimeout(() => {
              msgProvider.toast(res?.msg[config.language], 'bottom');
              navigation.navigate('Conversation');
              return false;
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

  consolepro.consolelog('Audio State ===> ', audioState);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const getChatDocumentId = (user1, user2) => {
    const sortedIds = [user1, user2].sort();
    const chatId = sortedIds.join('_');
    return chatId;
  };

  // const markMessagesAsRead = async (currentUserId, otherUserId) => {
  //   try {
  //     const chatDocId = getChatDocumentId(currentUserId, otherUserId);
  //     const messagesRef = collection(
  //       fireStoreDB,
  //       'chats',
  //       chatDocId,
  //       'messages',
  //     );

  //     // Query all unread messages sent by the other user
  //     const unreadQuery = query(messagesRef, where('isRead', '==', false));
  //     const snapshot = await getDocs(unreadQuery);

  //     const batch = writeBatch(fireStoreDB);
  //     snapshot.forEach(docSnap => {
  //       const data = docSnap.data();
  //       if (data?.senderId !== currentUserId) {
  //         batch.update(docSnap.ref, {isRead: true});
  //       }
  //     });

  //     await batch.commit();
  //     console.log('✅ All messages marked as read');

  //     const fetchData = async () => {
  //       const count = await getAllChatUsersByProvider();
  //       config.show_overall_chat_count = count;
  //       consolepro.consolelog('Counting*******', count);
  //     };
  //     fetchData();
  //   } catch (error) {
  //     console.error('Error marking messages as read:', error);
  //   }
  // };

  // ✅ Mark all unread messages as read
  // const markMessagesAsRead = async () => {
  //   try {
  //     if (!route?.params?.userId || !route?.params?.matchId) return;

  //     const chatDocId = getChatDocumentId(route?.params?.userId, otherUserId);
  //     const messagesRef = collection(
  //       fireStoreDB,
  //       'chats',
  //       chatDocId,
  //       'messages',
  //     );

  //     const unreadQuery = query(messagesRef, where('isRead', '==', false));
  //     console.log('Running markMessagesAsRead...');

  //     const snapshot = await getDocs(unreadQuery);

  //     if (snapshot.empty) {
  //       console.log('No unread messages');
  //       return;
  //     }

  //     const batch = writeBatch(fireStoreDB);
  //     snapshot.forEach(docSnap => {
  //       const data = docSnap.data();
  //       if (data?.senderId !== route?.params?.userId) {
  //         batch.update(docSnap.ref, {isRead: true});
  //       }
  //     });

  //     await batch.commit();
  //     console.log('✅ Marked unread messages as read');
  //   } catch (error) {
  //     console.error('Error marking messages as read:', error);
  //   }
  // };

  // const currentUserId = route?.params?.userId;
  // const otherUserId = route?.params?.matchId;

  // console.log('Current User id======>>', currentUserId);
  // console.log('Other USer ID====>', otherUserId);
  // // ✅ Real-time listener to auto-mark incoming messages
  // useEffect(() => {
  //   if (!currentUserId || !otherUserId) return;

  //   const chatDocId = getChatDocumentId(currentUserId, otherUserId);
  //   const messagesRef = collection(fireStoreDB, 'chats', chatDocId, 'messages');

  //   const unreadQuery = query(messagesRef, where('isRead', '==', false));

  //   const unsubscribe = onSnapshot(unreadQuery, snapshot => {
  //     if (snapshot.empty) return;

  //     const batch = writeBatch(fireStoreDB);
  //     snapshot.forEach(docSnap => {
  //       const data = docSnap.data();
  //       if (data?.senderId !== currentUserId) {
  //         batch.update(docSnap.ref, {isRead: true});
  //       }
  //     });

  //     if (!snapshot.empty) {
  //       batch.commit();
  //       console.log('✅ Auto-marked new messages as read');
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [currentUserId, otherUserId]);

  // // ✅ When user opens this screen, mark all messages as read
  // useFocusEffect(
  //   useCallback(() => {
  //     markMessagesAsRead();
  //   }, [currentUserId, otherUserId]),
  // );

  const currentUserId = route?.params?.userId;
  const otherUserId = route?.params?.matchId;

  const hasMarkedReadRef = useRef(false);

  const markMessagesAsRead = async () => {
    try {
      if (!currentUserId || !otherUserId) return;

      const chatDocId = getChatDocumentId(currentUserId, otherUserId);
      const messagesRef = collection(
        fireStoreDB,
        'chats',
        chatDocId,
        'messages',
      );

      // Limit can be adjusted or removed
      const unreadQuery = query(
        messagesRef,
        where('isRead', '==', false),
        limit(100),
      );

      const snapshot = await getDocs(unreadQuery);

      if (snapshot.empty) {
        console.log('No unread messages');
        return;
      }

      const batch = writeBatch(fireStoreDB);

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data?.senderId !== currentUserId) {
          batch.update(docSnap.ref, {isRead: true});
        }
      });

      await batch.commit();
      console.log('✅ Marked unread messages as read');
    } catch (error) {
      console.error('❌ Error marking messages as read:', error);
    }
  };

  // ✅ Real-time listener to mark new unread messages

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    const chatDocId = getChatDocumentId(currentUserId, otherUserId);
    const messagesRef = collection(fireStoreDB, 'chats', chatDocId, 'messages');

    const unreadQuery = query(messagesRef, where('isRead', '==', false));

    const unsubscribe = onSnapshot(unreadQuery, snapshot => {
      if (snapshot.empty) return;

      const batch = writeBatch(fireStoreDB);
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data?.senderId !== currentUserId) {
          batch.update(docSnap.ref, {isRead: true});
        }
      });

      if (!snapshot.empty) {
        batch.commit();
        console.log('✅ Auto-marked new messages as read');
      }
    });

    return () => unsubscribe();
  }, [currentUserId, otherUserId]);

  // ✅ On screen focus: mark old unread messages (once per focus)

  useFocusEffect(
    useCallback(() => {
      if (!hasMarkedReadRef.current) {
        markMessagesAsRead();
        hasMarkedReadRef.current = true;
      }

      return () => {
        hasMarkedReadRef.current = false;
      };
    }, [currentUserId, otherUserId]),
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.themeColor2}}>
        {/* --------back ------ */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: (mobileW * 3) / 100,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleBackPress}
            style={{
              alignSelf: 'flex-start',
              marginTop: (mobileW * 4) / 100,
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
                // {tintColor: Colors.ColorBlack},
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsPopUpMenu(true)}
            style={{
              alignSelf: 'flex-start',
              marginTop: (mobileW * 4) / 100,
            }}>
            <Image
              source={localimag.icon_three_dot}
              style={[
                {width: (mobileW * 6) / 100, height: (mobileW * 6) / 100},
                {tintColor: Colors.whiteColor},
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* ------- user details -------- */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (matchData?.bring_type == 0) {
              navigation.navigate('UserDetails', {
                other_user_id: route?.params?.matchId,
              });
            } else if (matchData?.bring_type == 1) {
              navigation.navigate('WishingPetParentUserDetails', {
                other_user_id: route?.params?.matchId,
              });
            }
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: (mobileW * 4) / 100,
            marginTop: (mobileW * 5) / 100,
            // backgroundColor: 'blue',
            marginBottom: (mobileW * 5) / 100,
          }}>
          <ImageBackground
            source={
              matchData?.user_image != null
                ? {uri: config.img_url + matchData?.user_image}
                : localimag?.icon_userPlaceholder
            }
            style={{
              width: (mobileW * 10) / 100,
              height: (mobileW * 10) / 100,
            }}
            imageStyle={{
              borderRadius: (mobileW * 30) / 100,
            }}>
            {matchData?.pet_image != null && (
              <Image
                source={{uri: config.img_url + matchData?.pet_image}}
                style={{
                  width: (mobileW * 5) / 100,
                  height: (mobileW * 5) / 100,
                  borderRadius: (mobileW * 30) / 100,
                  alignSelf: 'flex-end',
                  right: (-mobileW * 2) / 100,
                }}
              />
            )}
          </ImageBackground>
          <View
            style={{
              marginLeft: (mobileW * 4) / 100,
              marginTop: (mobileH * 1.5) / 100,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: (mobileW * 75) / 100,
              }}>
              <View>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontRegular,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {matchData?.name}
                </Text>

                {matchData?.pet_name && (
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontLight,
                      fontSize: (mobileW * 3) / 100,
                    }}>
                    {matchData?.pet_name}
                  </Text>
                )}
              </View>

              <View
                style={
                  {
                    // flexDirection: 'row',
                    // alignItems: 'center',
                    // justifyContent: 'space-between',
                    // // backgroundColor: 'blue',
                  }
                }>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontLight,
                    fontSize: (mobileW * 3) / 100,
                    marginTop: (mobileH * 2.5) / 100,
                  }}>
                  {onlineStatus == 1 ? `Online` : `Offline`}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* ---------- chat -------- */}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={(mobileH * 9) / 100}
          style={{
            flex: 1,
            backgroundColor: Colors.whiteColor,
            borderTopEndRadius: (mobileW * 8) / 100,
            borderTopLeftRadius: (mobileW * 8) / 100,
            overflow: 'hidden',
          }}>
          <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
            <LegendList
              ref={listRef}
              data={messages}
              renderItem={({item, index}) => (
                <View
                  style={{
                    marginTop: (mobileW * 8) / 100,
                    marginHorizontal: (mobileW * 1) / 100,
                    borderTopEndRadius: (mobileW * 8) / 100,
                    borderTopLeftRadius: (mobileW * 8) / 100,
                    backgroundColor: Colors.whiteColor,
                    paddingHorizontal: (mobileW * 3) / 100,
                    flex: 1,
                  }}>
                  {item?.senderId != route?.params?.userId ? (
                    <View style={{}}>
                      {/* text message */}

                      {item?.type == 0 && !item?.isStory && !item?.isMatch && (
                        <View
                          style={{
                            alignSelf: 'flex-start',
                            maxWidth: (mobileW * 70) / 100,
                            paddingHorizontal: (mobileW * 2) / 100,
                            paddingVertical: (mobileW * 3) / 100,
                            elevation: (mobileW * 1) / 100,
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.5,
                            shadowRadius: (mobileW * 5) / 100,
                            borderTopEndRadius: (mobileW * 2) / 100,
                            borderTopLeftRadius: (mobileW * 2) / 100,
                            borderBottomRightRadius: (mobileW * 2) / 100,
                            backgroundColor: Colors.whiteColor,
                          }}>
                          <Text
                            style={{
                              color: Colors.themeColor2,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 3) / 100,
                            }}>
                            {item?.body}
                          </Text>
                        </View>
                      )}

                      {/* Image message */}

                      {item?.type == 1 && (
                        <TouchableOpacity
                          onPress={() => {
                            setIsChatImageModal(true);
                            setModalImageURL(item?.image_url);
                          }}
                          style={{
                            alignSelf: 'flex-start',
                            maxWidth: (mobileW * 70) / 100,
                            paddingHorizontal: (mobileW * 3) / 100,
                            //paddingVertical: (mobileW * 3) / 100,
                            elevation: (mobileW * 1) / 100,
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.5,
                            shadowRadius: (mobileW * 5) / 100,
                            borderTopEndRadius: (mobileW * 2) / 100,
                            borderTopLeftRadius: (mobileW * 2) / 100,
                            borderBottomRightRadius: (mobileW * 2) / 100,
                            backgroundColor: Colors.whiteColor,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                borderRadius: (mobileW * 2) / 100,
                                // backgroundColor: 'red',
                                width: (mobileW * 50) / 100,
                                height: (mobileW * 50) / 100,
                              }}>
                              <Image
                                source={
                                  item?.image_url
                                    ? {uri: item?.image_url}
                                    : localimag.icon_no_data_found // use your local fallback image
                                }
                                style={{
                                  width: (mobileW * 50) / 100,
                                  height: (mobileW * 50) / 100,
                                }}
                                resizeMode="contain"
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}

                      {/* voice message */}

                      {item?.type == 2 && (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() =>
                            onTogglePlay(item.voice_url, item.id, index)
                          }
                          style={{
                            alignSelf: 'flex-start',
                            maxWidth: (mobileW * 70) / 100,
                            paddingHorizontal: (mobileW * 3) / 100,
                            //paddingVertical: (mobileW * 3) / 100,
                            elevation: (mobileW * 1) / 100,
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.5,
                            shadowRadius: (mobileW * 5) / 100,
                            borderTopEndRadius: (mobileW * 2) / 100,
                            borderTopLeftRadius: (mobileW * 2) / 100,
                            borderBottomRightRadius: (mobileW * 2) / 100,
                            backgroundColor: Colors.whiteColor,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View>
                              <Image
                                source={
                                  item.status == true
                                    ? localimag.icon_pause
                                    : localimag.icon_play_icon
                                }
                                style={{
                                  width: (mobileW * 10) / 100,
                                  height: (mobileW * 10) / 100,
                                }}
                              />
                            </View>
                            <View>
                              <Image
                                source={localimag.icon_voice_message}
                                style={{
                                  width: (mobileW * 55) / 100,
                                  height: (mobileW * 6) / 100,
                                }}
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}

                      {item?.type == 0 &&
                        item?.isStory == true &&
                        item?.story_url && (
                          <View
                            style={{
                              maxWidth: (mobileW * 70) / 100,
                              elevation: (mobileW * 1) / 100,
                              shadowColor: '#000',
                              shadowOffset: {width: 0, height: 1},
                              shadowOpacity: 0.5,
                              shadowRadius: (mobileW * 5) / 100,
                              borderTopEndRadius: (mobileW * 2) / 100,
                              borderTopLeftRadius: (mobileW * 2) / 100,
                              borderBottomRightRadius: (mobileW * 2) / 100,
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: (mobileW * 3) / 100,
                              paddingVertical: (mobileW * 3) / 100,
                              backgroundColor: Colors.whiteColor,
                              alignSelf: 'flex-start',
                              marginTop: (mobileW * 1.5) / 100,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: (mobileW * 1.5) / 100,
                              }}>
                              <Image
                                source={{uri: config.img_url + item?.story_url}}
                                style={{
                                  width: (mobileW * 8) / 100,
                                  height: (mobileW * 8) / 100,
                                  borderRadius: (mobileW * 1) / 100,
                                  marginRight: (mobileW * 3) / 100,
                                }}
                                resizeMode="cover"
                              />
                              <View>
                                <Text
                                  style={{
                                    color: Colors.themeColor,
                                    fontFamily: Font.FontMedium,
                                    fontSize: (mobileW * 3) / 100,
                                  }}>
                                  {`Replied to story`}
                                </Text>
                                <View style={{width: (mobileW * 40) / 100}}>
                                  <Text
                                    style={{
                                      color: Colors.themeColor2,
                                      fontFamily: Font.FontMedium,
                                      fontSize: (mobileW * 3) / 100,
                                      marginTop: (mobileW * 0.8) / 100,
                                      // textAlign: 'center',
                                    }}>
                                    {item?.story_reply}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        )}

                      {/* ✅ MATCH MESSAGE DESIGN */}
                      {item?.type === 0 && item?.isMatch && item?.match_url && (
                        <View
                          style={{
                            alignSelf: 'flex-start',
                            marginTop: (mobileW * 1.5) / 100,
                            // backgroundColor: 'red'
                          }}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                              setIsChatImageModal(true);
                              setModalImageURL(
                                config.img_url + item?.match_url,
                              );
                            }}
                            style={{
                              maxWidth: (mobileW * 50) / 100,
                              elevation: (mobileW * 1) / 100,
                              shadowColor: '#000',
                              shadowOffset: {width: 0, height: 1},
                              shadowOpacity: 0.5,
                              shadowRadius: (mobileW * 5) / 100,
                              borderTopEndRadius: (mobileW * 2) / 100,
                              borderTopLeftRadius: (mobileW * 2) / 100,
                              borderBottomRightRadius: (mobileW * 2) / 100,
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: (mobileW * 3) / 100,
                              paddingVertical: (mobileW * 3) / 100,
                              backgroundColor: Colors.whiteColor,
                              alignSelf: 'flex-start',
                            }}>
                            <Image
                              source={{uri: config.img_url + item?.match_url}}
                              style={{
                                width: (mobileW * 45) / 100,
                                height: (mobileW * 45) / 100,
                                borderRadius: (mobileW * 3) / 100,
                              }}
                            />
                          </TouchableOpacity>

                          {/* ✅ Red match_message box in normal layout flow */}
                          <View
                            style={{
                              backgroundColor: '#FEE9E9',
                              width: (mobileW * 60) / 100,
                              padding: (mobileW * 2) / 100,
                              marginTop: (mobileW * 1) / 100,
                              alignSelf: 'flex-start',
                              borderBottomRightRadius: (mobileW * 3) / 100,
                              borderTopLeftRadius: (mobileW * 3) / 100,
                            }}>
                            <Text
                              style={{
                                color: Colors.cancleColor,
                                fontFamily: Font.FontMedium,
                                fontSize: (mobileW * 3) / 100,
                              }}>
                              {item?.match_message}
                            </Text>
                          </View>
                        </View>
                      )}

                      <View
                        style={{
                          alignSelf: 'flex-start',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          // backgroundColor: 'blue',
                          maxWidth: (mobileW * 70) / 100,
                          marginTop: (mobileW * 1) / 100,
                        }}>
                        <View
                          style={{
                            alignSelf: 'flex-end',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={{uri: config.img_url + item.profilePic}}
                            style={{
                              width: (mobileW * 7) / 100,
                              height: (mobileW * 7) / 100,
                              borderRadius: (mobileW * 30) / 100,
                            }}
                          />
                          <Text
                            style={{
                              color: Colors.themeColor2,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 3) / 100,
                              marginLeft: (mobileW * 2) / 100,
                            }}>
                            {item?.senderName}
                          </Text>
                        </View>

                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontLight,
                            fontSize: (mobileW * 3) / 100,
                            marginLeft: (mobileW * 2) / 100,
                          }}>
                          {new Date(
                            parseInt(item?.timeStamp?.seconds) * 1000,
                          ).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          })}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View>
                      {/* text message */}
                      {item?.type == 0 && !item?.isStory && !item?.isMatch && (
                        <View
                          style={{
                            maxWidth: (mobileW * 70) / 100,
                            elevation: (mobileW * 1) / 100,
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.5,
                            shadowRadius: (mobileW * 5) / 100,
                            borderTopEndRadius: (mobileW * 2) / 100,
                            borderTopLeftRadius: (mobileW * 2) / 100,
                            borderBottomLeftRadius: (mobileW * 2) / 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: (mobileW * 1.5) / 100,
                            paddingVertical: (mobileW * 3) / 100,
                            backgroundColor: Colors.themeColor2,
                            alignSelf: 'flex-end',
                            marginTop: (mobileW * 1.5) / 100,
                          }}>
                          <Text
                            style={{
                              color: Colors.whiteColor,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 3) / 100,
                            }}>
                            {item?.body}
                          </Text>
                        </View>
                      )}

                      {/* Image message */}
                      {item?.type == 1 && (
                        <TouchableOpacity
                          onPress={() => {
                            setIsChatImageModal(true);
                            setModalImageURL(item?.image_url);
                          }}
                          style={{
                            maxWidth: (mobileW * 70) / 100,
                            elevation: (mobileW * 1) / 100,
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.5,
                            shadowRadius: (mobileW * 5) / 100,
                            borderTopEndRadius: (mobileW * 2) / 100,
                            borderTopLeftRadius: (mobileW * 2) / 100,
                            borderBottomLeftRadius: (mobileW * 2) / 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: (mobileW * 3) / 100,
                            //paddingVertical: (mobileW * 3) / 100,
                            backgroundColor: Colors.themeColor2,
                            alignSelf: 'flex-end',
                            marginTop: (mobileW * 1.5) / 100,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                borderRadius: (mobileW * 2) / 100,
                                // backgroundColor: 'red',
                                width: (mobileW * 50) / 100,
                                height: (mobileW * 50) / 100,
                              }}>
                              <Image
                                source={
                                  item?.image_url
                                    ? {uri: item?.image_url}
                                    : localimag.icon_no_data_found // use your local fallback image
                                }
                                style={{
                                  width: (mobileW * 50) / 100,
                                  height: (mobileW * 50) / 100,
                                  //borderRadius: (mobileW * 3) / 100,
                                }}
                                resizeMode="contain"
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}

                      {/* voice message */}

                      {item?.type == 2 && (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() =>
                            onTogglePlay(item.voice_url, item.id, index)
                          }
                          style={{
                            maxWidth: (mobileW * 70) / 100,
                            elevation: (mobileW * 1) / 100,
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.5,
                            shadowRadius: (mobileW * 5) / 100,
                            borderTopEndRadius: (mobileW * 2) / 100,
                            borderTopLeftRadius: (mobileW * 2) / 100,
                            borderBottomLeftRadius: (mobileW * 2) / 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: (mobileW * 3) / 100,
                            //paddingVertical: (mobileW * 3) / 100,
                            backgroundColor: Colors.themeColor2,
                            alignSelf: 'flex-end',
                            marginTop: (mobileW * 1.5) / 100,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View>
                              <Image
                                source={
                                  item.status
                                    ? localimag.icon_pause
                                    : localimag.icon_play_icon
                                }
                                style={{
                                  width: (mobileW * 10) / 100,
                                  height: (mobileW * 10) / 100,
                                }}
                              />
                            </View>
                            <View>
                              <Image
                                source={localimag.icon_voice_message}
                                style={{
                                  width: (mobileW * 55) / 100,
                                  height: (mobileW * 6) / 100,
                                }}
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}

                      {/* Story reply  */}

                      {item?.type == 0 && item?.isStory && item?.story_url && (
                        <View
                          style={{
                            maxWidth: (mobileW * 70) / 100,
                            elevation: (mobileW * 1) / 100,
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.5,
                            shadowRadius: (mobileW * 5) / 100,
                            borderTopEndRadius: (mobileW * 2) / 100,
                            borderTopLeftRadius: (mobileW * 2) / 100,
                            borderBottomLeftRadius: (mobileW * 2) / 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: (mobileW * 3) / 100,
                            paddingVertical: (mobileW * 3) / 100,
                            backgroundColor: Colors.themeColor2,
                            alignSelf: 'flex-end',
                            marginTop: (mobileW * 1.5) / 100,
                          }}>
                          {/* Top Part: "Replied to story" with thumbnail */}
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginBottom: (mobileW * 1.5) / 100,
                            }}>
                            <Image
                              source={{uri: config.img_url + item?.story_url}}
                              style={{
                                width: (mobileW * 8) / 100,
                                height: (mobileW * 8) / 100,
                                borderRadius: (mobileW * 1) / 100,
                                marginRight: (mobileW * 3) / 100,
                              }}
                              resizeMode="cover"
                            />
                            <View>
                              <Text
                                style={{
                                  color: Colors.themeColor,
                                  fontFamily: Font.FontMedium,
                                  fontSize: (mobileW * 3) / 100,
                                }}>
                                {`Replied to story`}
                              </Text>
                              <View style={{width: (mobileW * 40) / 100}}>
                                <Text
                                  style={{
                                    color: Colors.whiteColor,
                                    fontFamily: Font.FontMedium,
                                    fontSize: (mobileW * 3) / 100,
                                    marginTop: (mobileW * 0.8) / 100,
                                    // textAlign: 'center',
                                  }}>
                                  {item?.story_reply}
                                </Text>
                              </View>
                            </View>
                          </View>

                          {/* Bottom Part: Actual reply text */}
                        </View>
                      )}

                      {/* Match message  */}

                      {item?.type == 0 && item?.isMatch && item?.match_url && (
                        <View
                          style={{
                            alignSelf: 'flex-end',
                            marginTop: (mobileW * 1.5) / 100,
                            // backgroundColor: 'red'
                          }}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                              setIsChatImageModal(true);
                              setModalImageURL(
                                config.img_url + item?.match_url,
                              );
                            }}
                            style={{
                              maxWidth: (mobileW * 50) / 100,
                              elevation: (mobileW * 1) / 100,
                              shadowColor: '#000',
                              shadowOffset: {width: 0, height: 1},
                              shadowOpacity: 0.5,
                              shadowRadius: (mobileW * 5) / 100,
                              borderTopEndRadius: (mobileW * 2) / 100,
                              borderTopLeftRadius: (mobileW * 2) / 100,
                              borderBottomLeftRadius: (mobileW * 2) / 100,
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: (mobileW * 3) / 100,
                              paddingVertical: (mobileW * 3) / 100,
                              backgroundColor: Colors.themeColor2,
                              alignSelf: 'flex-end',
                            }}>
                            <Image
                              source={{uri: config.img_url + item?.match_url}}
                              style={{
                                width: (mobileW * 45) / 100,
                                height: (mobileW * 45) / 100,
                                borderRadius: (mobileW * 3) / 100,
                              }}
                            />
                          </TouchableOpacity>

                          {/* ✅ Red match_message box in normal layout flow */}
                          <View
                            style={{
                              backgroundColor: '#FEE9E9',
                              width: (mobileW * 60) / 100,
                              padding: (mobileW * 2) / 100,
                              marginTop: (mobileW * 1) / 100,
                              alignSelf: 'flex-end',
                              borderBottomRightRadius: (mobileW * 3) / 100,
                              borderTopLeftRadius: (mobileW * 3) / 100,
                            }}>
                            <Text
                              style={{
                                color: Colors.cancleColor,
                                fontFamily: Font.FontMedium,
                                fontSize: (mobileW * 3) / 100,
                              }}>
                              {item?.match_message}
                            </Text>
                          </View>
                        </View>
                      )}

                      <View
                        style={{
                          alignSelf: 'flex-end',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          // backgroundColor: 'blue',
                          maxWidth: (mobileW * 70) / 100,
                          marginTop: (mobileW * 1) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontLight,
                            fontSize: (mobileW * 3) / 100,
                            marginRight: (mobileW * 3) / 100,
                          }}>
                          {new Date(
                            parseInt(item?.timeStamp?.seconds) * 1000,
                          ).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          })}
                        </Text>
                        <View
                          style={{
                            alignSelf: 'flex-end',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={{uri: config.img_url + item?.profilePic}}
                            style={{
                              width: (mobileW * 7) / 100,
                              height: (mobileW * 7) / 100,
                              borderRadius: (mobileW * 30) / 100,
                            }}
                          />
                          <Text
                            style={{
                              color: Colors.themeColor2,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 3) / 100,
                              marginLeft: (mobileW * 2) / 100,
                            }}>
                            {item?.senderName}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              onContentReady={() => {
                scrollToBottom();
              }}
              contentContainerStyle={{paddingBottom: (mobileH * 15) / 100}}
              ListEmptyComponent={() => (
                <View
                  style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    marginTop: (mobileH * 3) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.themeColor,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 4) / 100,
                    }}>
                    {t('congratulations_txt')}
                  </Text>

                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontBold,
                      fontSize: (mobileW * 7) / 100,
                    }}>
                    {t('itsAMatch_txt')}
                  </Text>

                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontSemibold,
                      fontSize: (mobileW * 4) / 100,
                      textAlign: 'center',
                    }}>
                    {t('doNotWateTime_txt')}
                  </Text>
                </View>
              )}
            />
          </View>
        </KeyboardAvoidingView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={(mobileH * 8) / 100}
          style={{
            position: 'absolute',
            bottom:
              Platform.OS === 'android'
                ? Platform.Version >= 34
                  ? keyboardHeight
                  : 0
                : 0,
            // flex: 1,
            backgroundColor: Colors.whiteColor,
            width: mobileW,
          }}>
          <View
            style={{
              backgroundColor: Colors.ColorChatInput,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: (mobileW * 95) / 100,
              alignSelf: 'center',
              borderRadius: (mobileW * 2) / 100,
              marginVertical: (mobileW * 3) / 100,
              // position: 'absolute',
              // bottom: 0
            }}>
            {audioState.voiceRecordingStart == 0 && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setCameraModal(true)}
                style={{
                  borderRadius: (mobileW * 3) / 100,
                  margin: (mobileW * 1) / 100,
                  overflow: 'hidden',
                }}>
                <Image
                  source={localimag.icon_plus}
                  style={{
                    width: (mobileW * 8) / 100,
                    height: (mobileW * 8) / 100,
                  }}
                />
              </TouchableOpacity>
            )}

            {audioState.voiceRecordingStart == 0 ? (
              <TextInput
                style={{
                  width: (mobileW * 60) / 100,
                  color: Colors.ColorBlack,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3.5) / 100,
                  height: (mobileH * 7) / 100,
                  textAlign: config.language == 1 ? 'right' : 'left',
                }}
                placeholder={t('typeMessageHere_txt')}
                placeholderTextColor={Colors.ColorBlack}
                keyboardType="default"
                value={chatMessage}
                onChangeText={val => setChatMessage(val)}
              />
            ) : (
              <View
                style={{
                  height: (mobileH * 7) / 100,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    width: (mobileW * 60) / 100,
                    paddingVertical: (mobileW * 0.01) / 100,
                    color: Colors.blackColor,
                    fontFamily: Font.FontMedium,
                    // width: (mobileW * 55) / 100,
                    fontSize: (mobileW * 3.8) / 100,
                  }}>
                  {audioState.recordTime}
                </Text>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              onLongPress={() => {
                console.log('Long press start');
                setAudioState(prev => ({
                  ...prev,
                  playAudioStatus: false,
                  play_self_audio: false,
                }));
                onStartRecord();
              }}
              onPressOut={() => {
                console.log('Press released');
                setAudioState(prev => ({
                  ...prev,
                  play_self_audio: true,
                }));

                if (audioState.recording_Status) {
                  onStopRecord();
                }
                //  onStopRecord();
              }}
              style={{
                borderRadius: (mobileW * 3) / 100,
                margin: (mobileW * 1) / 100,
                overflow: 'hidden',
              }}>
              <Image
                source={localimag.icon_voice_mic}
                style={{
                  width: (mobileW * 8) / 100,
                  height: (mobileW * 8) / 100,
                }}
              />
            </TouchableOpacity>

            {audioState.voiceRecordingStart == 0 && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSend()}
                style={{
                  // alignSelf: 'center',
                  // marginVertical: (mobileW * 1) / 100,
                  borderRadius: (mobileW * 3) / 100,
                  margin: (mobileW * 1) / 100,
                  overflow: 'hidden',
                }}>
                <Image
                  source={localimag.icon_send}
                  style={{
                    width: (mobileW * 7) / 100,
                    height: (mobileW * 7) / 100,
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>

        {/* </KeyboardAvoidingView> */}

        {/* ---- pop up menu ---- */}

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
                paddingVertical: (mobileH * 2) / 100,
                borderRadius: (mobileW * 2) / 100,
                backgroundColor: Colors.whiteColor,
                alignItems: 'center',
                position: 'absolute',
                right: (mobileW * 6) / 100,
                top:
                  Platform.OS === 'ios'
                    ? (mobileW * 15) / 100
                    : (mobileW * 7) / 100,
                paddingHorizontal: (mobileW * 4) / 100,
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
                  setUnMatchPopUp(true);
                  setIsPopUpMenu(false);
                }}
                style={{
                  alignSelf: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: (mobileW * 2) / 100,
                  marginBottom: (mobileW * 1) / 100,
                }}>
                <View>
                  <Image
                    source={require('../Icons/unmatch_heart.png')}
                    style={[
                      {
                        width: (mobileW * 4) / 100,
                        height: (mobileW * 4) / 100,
                      },
                      {tintColor: Colors.themeColor},
                    ]}
                  />
                </View>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 3.5) / 100,
                    marginLeft: (mobileW * 2) / 100,
                  }}>
                  {t('unmatch_txt')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setReportProfilePopUp(true);
                  setIsPopUpMenu(false);
                }}
                style={{
                  alignSelf: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: (mobileW * 2) / 100,
                  marginBottom: (mobileW * 1) / 100,
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
                  setBlockModal(true);
                  setIsPopUpMenu(false);
                }}
                style={{
                  alignSelf: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: (mobileW * 2) / 100,
                  marginBottom: (mobileW * 1) / 100,
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

        {/* -------- share profile modal -------- */}
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
                <ImageBackground
                  source={require('../Icons/icon_homeUser.png')}
                  style={{
                    width: (mobileW * 20) / 100,
                    height: (mobileW * 20) / 100,
                    borderRadius: (mobileW * 30) / 100,
                  }}>
                  <Image
                    source={require('../Icons/icon_dog_1.png')}
                    style={{
                      width: (mobileW * 8) / 100,
                      height: (mobileW * 8) / 100,
                      borderRadius: (mobileW * 30) / 100,
                      alignSelf: 'flex-end',
                      right: (-mobileW * 0.8) / 100,
                    }}
                  />
                </ImageBackground>
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

        {/* --unmatch */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={unMatchPopUp}
          requestClose={() => {
            setUnMatchPopUp(false);
          }}>
          <TouchableOpacity
            onPress={() => {
              setUnMatchPopUp(false);
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
                onPress={() => setUnMatchPopUp(false)}
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
                {t('unmatch_description_txt')} {matchData?.name}
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
                  setUnMatchPopUp(false);
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

        {/* -------- report profile modal ---------- */}

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
                          {item.report_reason[config.language]}
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

        {/* ------ Report Thanks modal ------ */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={reportThanksModal}
          requestClose={() => {
            //setReportThanksModal(false);
          }}>
          <TouchableOpacity
            onPress={() => {
              // setReportThanksModal(false);
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
                          }}>{`${t('block_txt')} ${
                          matchData?.name
                        }'s Profile`}</Text>
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
                        }}>{`${t('hideAllFrom_txt')} ${matchData?.name}`}</Text>
                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontLight,
                          fontSize: (mobileW * 3) / 100,
                        }}>
                        {t('stopSeeingThePerson_txt')}
                      </Text>
                    </View>
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
                    navigation.navigate('Conversation');
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* ------ asking block modal -------- */}

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
                }}>{`${t('block_txt')} ${matchData?.name}?`}</Text>

              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 4) / 100,
                  textAlign: 'center',
                }}>{`${matchData?.name} ${t('willNoLonger_txt')}`}</Text>

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

        {/* -------blocked modal --------*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={blockedSuccessfully}
          //requestClose={() => setBlockedSuccessfully(false)}
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
                {`${t('youBlocked_txt')} ${matchData?.name}`}
              </Text>
              <Text
                style={{
                  width: (mobileW * 55) / 100,
                  color: Colors.ColorBlack,
                  fontSize: (mobileW * 3) / 100,
                  fontFamily: Font.FontRegular,
                  textAlign: 'center',
                }}>
                {`Blocks are profile specific and apply individually. this block won't apply to ${matchData?.name}'s other profile's, but we'll limit some of the  way that he can interact with you from his other profiles.`}
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
                    navigation.navigate('Conversation');
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

        {/* camera modal */}

        <Modal
          animationType="slide"
          transparent
          visible={cameraModal}
          onRequestClose={() => {
            setCameraModal(false);
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setCameraModal(false)}
            style={{
              flex: 1,
              backgroundColor: '#00000030',
              alignItems: 'center',
            }}>
            <View style={{position: 'absolute', bottom: 25, width: mobileW}}>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.whiteColor,
                  borderRadius: 20,
                  width: '88%',
                  paddingVertical: (mobileW * 4) / 100,
                  alignSelf: 'center',
                }}
                onPress={() => Camerapopen()}>
                <Text
                  style={{
                    fontSize: (mobileW * 4) / 100,
                    fontFamily: Font.FontMedium,
                    color: Colors.blackColor,
                    alignSelf: 'center',
                  }}>
                  {t('MediaCamera')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.whiteColor,
                  borderRadius: 20,
                  marginTop: 15,
                  width: '88%',
                  paddingVertical: (mobileW * 4) / 100,
                  alignSelf: 'center',
                }}
                onPress={() => Galleryopen()}>
                <Text
                  style={{
                    fontSize: (mobileW * 4) / 100,
                    fontFamily: Font.FontMedium,
                    color: Colors.blackColor,
                    alignSelf: 'center',
                  }}>
                  {t('Mediagallery')}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  marginTop: 15,
                  alignSelf: 'center',
                  borderRadius: 20,
                  backgroundColor: Colors.whiteColor,
                  width: '88%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => setCameraModal(false)}
                  style={{
                    alignSelf: 'center',
                    width: '88%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: (mobileW * 3.5) / 100,
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.FontBold,
                      fontSize: (mobileW * 4.3) / 100,
                      color: 'red',
                    }}>
                    {t('cancel_txt')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Image preview */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isChatImageModal}
          onRequestClose={() => setIsChatImageModal(false)}>
          <TouchableOpacity
            onPress={() => setIsChatImageModal(false)}
            activeOpacity={1}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#00000090',
            }}>
            <View
              style={{
                height: mobileH,
                width: mobileW,
                justifyContent: 'center',
                alignItems: 'center',
                padding: (mobileW * 5) / 100,
              }}>
              {/* Close Icon */}
              <TouchableOpacity
                onPress={() => setIsChatImageModal(false)}
                style={{
                  position: 'absolute',
                  top: (mobileW * 5) / 100,
                  right: (mobileW * 5) / 100,
                  zIndex: 2,
                }}>
                <Image
                  source={localimag.icon_crossIcon}
                  style={{
                    width: (mobileW * 6) / 100,
                    height: (mobileW * 6) / 100,
                    tintColor: 'white',
                  }}
                />
              </TouchableOpacity>

              {/* Image Preview */}
              <Image
                source={
                  modalImageURL
                    ? {uri: modalImageURL}
                    : localimag?.icon_no_data_found
                }
                style={{
                  width: '100%',
                  height: '90%',
                  resizeMode: 'contain',
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
