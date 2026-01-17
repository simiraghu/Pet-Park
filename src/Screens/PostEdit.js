import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {localimag} from '../Provider/Localimage';
import {
  apifuntion,
  Colors,
  config,
  consolepro,
  Font,
  mobileH,
  mobileW,
  localStorage,
  msgProvider,
  mediaprovider,
} from '../Provider/utilslib/Utils';
import InputField from '../Components/InputField';
import {useTranslation} from 'react-i18next';
import CommonButton from '../Components/CommonButton';
import CommonModal from '../Components/CommonModal';
import {RNCamera} from 'react-native-camera';
import {showEditor} from 'react-native-video-trim';
import {createThumbnail} from 'react-native-create-thumbnail';
import RNFS from 'react-native-fs';

import MovToMp4 from 'react-native-mov-to-mp4';
import {SafeAreaView} from 'react-native-safe-area-context';

const screenWidth = Math.round(Dimensions.get('window').width);

const PostEdit = () => {
  const {goBack, navigate} = useNavigation();
  const {params} = useRoute();
  const {t} = useTranslation();

  const post = params?.post;
  const recordingIntervalRef = useRef(null);
  const cameraRef = useRef(null);
  consolepro.consolelog(post, '<<POST');
  const statusBarHeight =
    Platform.OS === 'android'
      ? StatusBar.currentHeight - (mobileH * 5) / 100
      : 44;

  const [aboutPost, setAboutPost] = useState(post?.description);

  const [selectCommunityPost, setSelectCommunityPost] = useState(null);
  const [isCommunityPostModal, setIsCommunityPostModal] = useState(false);
  const [communityPost, setCommunityPost] = useState([]);
  const [isUpdateModal, setisUpdateModal] = useState(false);
  const [add_image, setAdd_image] = useState(null);
  const [mediaModal, setMediamodal] = useState(false);
  const [images, setImages] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoRecordingModal, setVideoRecordingModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSelectCommunityPost({
        community_id: post?.community_id,
        community_name: post?.community_name,
      });
      if (post?.image_video) {
        setImages({
          uri: post?.image_video,
          type: post?.type,
          thumbnail: post?.thumbnail,
        });
      }
    }, []),
  );

  const handleCommunityPost = post => {
    consolepro.consolelog(post, '<<POST');
    setSelectCommunityPost(post);
    setIsCommunityPostModal(false);
  };

  // Get User Communities =============

  const GetUserCommunities = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL + 'get_all_user_communities?user_id=' + userId;
      consolepro.consolelog(API_URL, '<<API URL');

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<REs');
            setTimeout(() => {
              setCommunityPost(res?.community_arr);
            }, 400);
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

  useFocusEffect(
    useCallback(() => {
      if (config.device_type == 'ios') {
        setTimeout(() => {
          GetUserCommunities();
        }, 1200);
      } else {
        GetUserCommunities();
      }
    }, []),
  );

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
        if (Platform.OS === 'ios') {
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
        // await showEditor(res?.path, { maxDuration: 15, saveToPhoto: false });

        setMediamodal(false);
        createThumbnail({
          url: res?.path,
          timeStamp: 1000,
          format: 'jpeg',
        })
          .then(res => {
            setAdd_image({uri: res?.path, type: type, thumbnail: res?.path});
          })
          .catch(error => {
            consolepro.consolelog(error, '<<error');
          });
      }, 1000);
    } catch (error) {
      consolepro.consolelog(error, '<<Error');
      if (error?.toString().toLowerCase().includes('permission')) {
        open_settings();
      }
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

  // handle post Edit =========
  const handleCommunityPostEdit = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();
      data.append('user_id', userId);
      data.append('community_id', selectCommunityPost?.community_id);
      data.append('community_post_id', post?.community_post_id);
      data.append('description', aboutPost);

      if (add_image?.type == 1) {
        data.append('image', {
          uri: add_image?.uri,
          name: 'image.jpg',
          type: 'image/jpeg',
        });
      }

      if (add_image?.type === 2 && add_image?.uri && add_image?.thumbnail) {
        let videoUri = add_image.uri;

        // Convert .mov to .mp4 on iOS
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
          name: 'video.mp4',
          type: 'video/mp4',
        });

        data.append('thumbnail', {
          uri: add_image.thumbnail,
          name: 'image.jpg',
          type: 'image/jpeg',
        });
      }

      const API_URL = config.baseURL + 'edit_community_post';
      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              setisUpdateModal(true);
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
          consolepro.consolelog(error, '<<ERRor');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<EROR');
    }
  };

  consolepro.consolelog(add_image, '<<Add image');
  consolepro.consolelog(images, '<<Images');

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: (mobileH * 8) / 100,
          }}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled">
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
                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginHorizontal: (mobileW * 6) / 100,
              marginTop: (mobileW * 6) / 100,
            }}>
            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontSemibold,
                fontSize: (mobileW * 5) / 100,
              }}>
              {t('editPost_txt')}
            </Text>

            <View
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: (mobileW * 1) / 100,
              }}>
              <View
                style={{
                  marginTop: (mobileW * 3) / 100,
                  width: (mobileW * 30) / 100,
                  height: (mobileW * 30) / 100,
                  position: 'relative',
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (!add_image && !images?.uri) {
                      setMediamodal(true);
                    } else {
                      if (images?.uri) {
                        navigate('VideoPreview', {
                          uri: config.img_url + images?.uri,
                          type: images?.type == 2 ? 1 : 0,
                        });
                      } else if (add_image?.uri) {
                        navigate('VideoPreview', {
                          uri: add_image?.uri,
                          type: add_image?.type == 2 ? 1 : 0,
                        });
                      } else {
                        consolepro.consolelog("Can't navigate");
                      }
                    }
                  }}
                  style={{
                    borderRadius: (mobileW * 5) / 100,
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                  }}>
                  {images?.uri ? (
                    <Image
                      source={
                        images?.type == 1
                          ? {uri: config.img_url + images?.uri}
                          : {uri: config.img_url + images?.thumbnail}
                      }
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  ) : (
                    <Image
                      source={
                        add_image?.type == 1 && add_image?.uri
                          ? {uri: add_image?.uri}
                          : add_image?.type == 2 && add_image?.thumbnail
                          ? {uri: add_image?.thumbnail}
                          : localimag.icon_add_pet_photo
                      }
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  )}
                </TouchableOpacity>

                {(add_image?.uri || images?.uri) && (
                  <TouchableOpacity
                    onPress={() => {
                      if (add_image?.uri) {
                        setAdd_image(null);
                      } else {
                        setImages(null);
                      }
                    }}
                    activeOpacity={0.7}
                    style={{
                      position: 'absolute',
                      top: (-mobileW * 1) / 100,
                      right: (-mobileW * 1) / 100,
                      backgroundColor: Colors.whiteColor,
                      borderRadius: (mobileW * 5) / 100,
                      padding: (mobileW * 1) / 100,
                      zIndex: 10,
                      elevation: 10,
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 1},
                      shadowOpacity: 0.3,
                      shadowRadius: 2,
                    }}>
                    <Image
                      source={localimag?.icon_cross}
                      style={{
                        width: (mobileW * 3) / 100,
                        height: (mobileW * 3) / 100,
                        tintColor: Colors.cancleColor,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* ------input field ------ */}
            <View
              style={{
                paddingVertical: (mobileW * 2) / 100,
                position: 'relative',
                marginTop: (mobileW * 5) / 100,
              }}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3.5) / 100,
                }}>
                {t('write_your_post_txt')}
              </Text>

              <TextInput
                multiline
                // numberOfLines={7}
                style={{
                  backgroundColor: Colors.whiteColor,
                  borderColor: Colors.themeColor2,
                  borderWidth: 1,
                  borderRadius: (mobileW * 2) / 100,
                  marginTop: (mobileW * 2) / 100,
                  textAlignVertical: 'top',
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3.5) / 100,
                  padding: (mobileW * 3) / 100,
                  paddingRight: (mobileW * 10) / 100,
                  color: Colors.ColorBlack,
                  height: (mobileW * 35) / 100,
                  textAlign: config.language == 1 ? 'right' : 'left',
                }}
                placeholder={t('write_your_post_txt')}
                value={aboutPost}
                onChangeText={val => setAboutPost(val)}
                placeholderTextColor={Colors.placeholderTextColor}
                maxLength={250}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: (mobileW * 5) / 100,
              marginTop: (mobileW * 3) / 100,
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
                onPress={() => setIsCommunityPostModal(true)}
                style={{
                  marginLeft: (mobileW * 1) / 100,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.placeholderTextColor,
                    fontSize: (mobileW * 3.5) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {selectCommunityPost?.community_name
                    ? selectCommunityPost?.community_name?.length > 30
                      ? selectCommunityPost?.community_name?.slice(0, 30) +
                        '...'
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
          </View>

          <CommonButton
            title={t('update_btn_txt')}
            containerStyle={{
              backgroundColor: Colors.themeColor2,
              marginTop: (mobileW * 15) / 100,
            }}
            onPress={() => handleCommunityPostEdit()}
          />
        </KeyboardAwareScrollView>

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

        {/* create modal */}
        <CommonModal
          message={t('communityPostUpdated_successfully_txt')}
          visible={isUpdateModal}
          isIconTick={true}
          isIcon={localimag.icon_green_tick}
          button={true}
          btnText={t('okay_txt')}
          onCrosspress={() => setisUpdateModal(false)}
          onPress={() => {
            setisUpdateModal(false);
            navigate('Community');
          }}
        />

        <Modal animationType="slide" transparent={true} visible={mediaModal}>
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
                    try {
                      const statResult = await RNFS.stat(videoUri);
                      const fileSizeInMB = (
                        statResult.size /
                        (1024 * 1024)
                      ).toFixed(2);
                      console.log(`Video Size: ${fileSizeInMB} MB`);

                      if (fileSizeInMB > 50) {
                        msgProvider.toast(
                          t('please_record_a_shorter_video_txt'),
                          'bottom',
                        );
                        return;
                      }

                      handleRecordedVideo({
                        uri: videoUri,
                        type: 2,
                        thumbnail: thumbnail,
                      });

                      setTimeout(() => {
                        setVideoRecordingModal(false);
                      }, 200);
                    } catch (error) {
                      consolepro.consolelog(error, '<error');
                    }
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
      </View>
    </SafeAreaView>
  );
};

export default PostEdit;

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
