import {
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {localimag} from '../Provider/Localimage';
import {
  config,
  consolepro,
  Lang_chg,
  mediaprovider,
  mobileH,
  mobileW,
  msgProvider,
  localStorage,
  apifuntion,
} from '../Provider/utilslib/Utils';
import {useNavigation} from '@react-navigation/native';
import CommonButton from '../Components/CommonButton';
import {useTranslation} from 'react-i18next';
import {createThumbnail} from 'react-native-create-thumbnail';
import {RNCamera} from 'react-native-camera';
import {showEditor} from 'react-native-video-trim';
import RNFS from 'react-native-fs';
import MovToMp4 from 'react-native-mov-to-mp4';
import {SafeAreaView} from 'react-native-safe-area-context';

const CreateStory = () => {
  const {goBack, navigate} = useNavigation();
  const {t} = useTranslation();
  const cameraRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const statusBarHeight =
    Platform.OS === 'android'
      ? StatusBar.currentHeight - (mobileH * 5) / 100
      : 44;

  const [isStoryModal, setIsStoryModal] = useState(false);
  const [videoRecordingModal, setVideoRecordingModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [mediaItem, setMediaItem] = useState([]);

  // Story Selection =======

  const handleMediaSelected = media => {
    if (mediaItem.length < 8) {
      setMediaItem(prev => [...prev, media]);
    } else {
      msgProvider.alert(t('information_txt'), t('story_length_images'), false);
      return false;
    }
  };

  consolepro.consolelog('Media Items =====>', mediaItem);

  // images multiselection

  const openGalleryMultiSelection = async ({type}) => {
    try {
      const multipleImages = await mediaprovider.MultipleselectGellery();
      // consolepro.consolelog("obj =========>", multipleImages)
      for (let i = 0; i < multipleImages.length; i++) {
        consolepro.consolelog(multipleImages[i]?.path);
        handleMediaSelected({
          uri: multipleImages[i]?.path,
          type: type,
          thumbnail: '',
        });
      }
      setTimeout(() => {
        setIsStoryModal(false);
      }, 300);
    } catch (error) {
      setIsStoryModal(false);
      if (error?.toString().toLowerCase().includes('permission')) {
        openSettings();
      }
    }
  };

  // Camera Selection

  const openCamera = async ({type}) => {
    try {
      const obj = await mediaprovider.launchCamera();
      handleMediaSelected({uri: obj?.path, type: type, thumbnail: ''});
      setTimeout(() => {
        setIsStoryModal(false);
      }, 300);
    } catch (error) {
      setIsStoryModal(false);
      if (error?.toString().toLowerCase().includes('permission')) {
        openSettings();
      }
    }
  };

  // From Gallery Video

  const openGalleryVideo = async ({type}) => {
    try {
      const res = await mediaprovider.launchGalleryVideo(true);
      console.log('Gallery Video Path:', res?.path);

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
        createThumbnail({
          url: res?.path,
          timeStamp: 1000,
          format: 'jpeg',
        })
          .then(async thumbnailResponse => {
            consolepro.consolelog(thumbnailResponse, '<<thumbnail res');

            handleMediaSelected({
              uri: res?.path,
              type: type,
              thumbnail: thumbnailResponse?.path,
            });

            setTimeout(() => {
              setIsStoryModal(false);
            }, 300);
          })
          .catch(error => {
            consolepro.consolelog(error, 'THumbnail res');
          });
      }, 800);
    } catch (error) {
      setIsStoryModal(false);
      if (error?.toString().toLowerCase().includes('permission')) {
        openSettings();
      }
    }
  };

  // remove media

  const removeMedia = index => {
    const updated = [...mediaItem];
    updated.splice(index, 1);
    setMediaItem(updated);
  };

  const openSettings = () => {
    Alert.alert(
      'Alert',
      'This app needs permissions, please allow it',
      [
        {text: 'Close', style: 'cancel'},
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
      ],
      {cancelable: false},
    );
  };

  // video recoring modal

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

  useEffect(() => {
    if (videoRecordingModal) {
      (async () => {
        const permission = await requestCameraPermission();
        setHasPermission(permission);
      })();
    }
  }, [videoRecordingModal]);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;

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
        .then(thumbnailResponse => {
          consolepro.consolelog(thumbnailResponse, '<<thumbnail res');
          setThumbnail(thumbnailResponse?.path);
          setVideoUri(originalUri); // Show original
          setShowPreview(true);
        })
        .catch(error => {
          consolepro.consolelog(error, 'Thumbnail generation error');
        });
    } catch (error) {
      console.error('Recording error:', error);
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
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

  const handleRecordedVideo = async media => {
    if (mediaItem.length < 8) {
      setMediaItem(prev => [...prev, media]);
    } else {
      msgProvider.alert(t('information_txt'), t('story_length_images'), false);
      return false;
    }
  };

  // add story

  const handleAddStory = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      consolepro.consolelog('User ID ==========>', userId);

      if (mediaItem.length <= 0) {
        msgProvider.toast(t('emptyMedia_txt'), 'bottom');
        return false;
      }

      const data = new FormData();

      data.append('user_id', userId);

      for (let i = 0; i < mediaItem.length; i++) {
        const item = mediaItem[i];
        consolepro.consolelog('Media Item ========>', item);

        if (!item) continue;

        if (item?.type === 2 && item?.uri && item?.thumbnail) {
          let videoUri = item.uri;

          // Convert .mov to .mp4 on iOS
          if (
            Platform.OS === 'ios' &&
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

          data.append('videos', {
            name: 'video.mp4',
            uri: videoUri,
            type: 'video/mp4',
          });

          data.append('thumbnail', {
            name: 'image.jpg',
            uri: item.thumbnail,
            type: 'image/jpg',
          });
        } else if (item?.type === 1 && item?.uri) {
          data.append('images', {
            name: 'image.jpg',
            uri: item.uri,
            type: 'image/jpg',
          });
        }
      }

      consolepro.consolelog('DATA ======>> ', data);

      const API_URL = config.baseURL + 'add_story';
      // return false
      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog('RES ==========>', res);
            setTimeout(() => {
              msgProvider.toast(res?.msg[config.language], 'bottom');
              navigate('Conversation');
              return false;
            }, 800);
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
        .catch(async error => {
          if (error.response) {
            const text = await error.response.text?.();
            consolepro.consolelog('Server Raw Response: ', text);
          }
          consolepro.consolelog('Upload error: ', error);
        });
    } catch (error) {
      consolepro.consolelog('Line 346 ========>', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainView}>
        <View
          style={{
            marginTop: (mobileW * 5) / 100,
            marginLeft: (mobileW * 5) / 100,
          }}>
          <TouchableOpacity
            onPress={() => goBack()}
            activeOpacity={0.8}
            style={{
              width: (mobileW * 6) / 100,
              height: (mobileW * 6) / 100,
              transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
            }}>
            <Image
              source={localimag.icon_goBack}
              style={{
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
                tintColor: '#405757',
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={{alignSelf: 'center'}}>
          <Text
            style={{
              color: Colors.themeColor2,
              fontFamily: Font.FontBold,
              fontSize: (mobileW * 5) / 100,
              alignSelf: 'center',
            }}>
            {t('addToStory_txt')}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              borderStyle: 'dashed',
              borderColor: Colors.themeColor2,
              borderWidth: (mobileW * 0.5) / 100,
              borderRadius: (mobileW * 5) / 100,
              marginTop: (mobileH * 5) / 100,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (mediaItem?.length < 8) {
                  setIsStoryModal(true);
                } else {
                  msgProvider.alert(
                    t('information_txt'),
                    t('story_length_images'),
                    false,
                  );
                  return false;
                }
              }}
              style={{
                backgroundColor: Colors.ColorGrayTransparent,
                width: (mobileW * 85) / 100,
                height: (mobileW * 40) / 100,
                margin: (mobileW * 1) / 100,
                borderRadius: (mobileW * 5) / 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={localimag.icon_upload}
                style={[
                  {width: (mobileW * 7) / 100, height: (mobileW * 7) / 100},
                  {
                    tintColor: Colors.placeholderTextColor,
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  },
                ]}
              />
              <Text
                style={{
                  color: Colors.placeholderTextColor,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 4) / 100,
                  marginTop: (mobileW * 2) / 100,
                }}>
                {t('uploadPhotAndVideo_txt')}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {mediaItem?.length > 0 && (
            <View
              style={{
                // backgroundColor: 'red',
                height: (mobileH * 14) / 100,
                paddingVertical: (mobileW * 2) / 100,
                marginTop: (mobileW * 2) / 100,
                paddingHorizontal: (mobileW * 5) / 100,
              }}>
              <FlatList
                data={mediaItem}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      alignSelf: 'center',
                      alignItems: 'center',
                      marginRight: (mobileW * 3) / 100,
                    }}>
                    <View
                      style={{
                        width: (mobileW * 20) / 100,
                        height: (mobileW * 20) / 100,
                        position: 'relative',
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          navigate('VideoPreview', {
                            type: item?.type == 2 ? 1 : 0,
                            uri: item?.uri,
                          });
                        }}
                        style={{
                          borderRadius: (mobileW * 4) / 100,
                          overflow: 'hidden',
                          width: '100%',
                          height: '100%',
                        }}>
                        <Image
                          source={{
                            uri: item?.type == 2 ? item?.thumbnail : item?.uri,
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          removeMedia(index);
                        }}
                        activeOpacity={0.7}
                        style={{
                          position: 'absolute',
                          top: (-mobileW * 1) / 100,
                          right: (-mobileW * 1) / 100,
                          backgroundColor: Colors.whiteColor,
                          borderRadius: (mobileW * 30) / 100,
                          padding: (mobileW * 0.7) / 100,
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
                            width: (mobileW * 2.5) / 100,
                            height: (mobileW * 2.5) / 100,
                            tintColor: Colors.cancleColor,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
          )}

          <CommonButton
            title={t('addStory_txt')}
            containerStyle={{marginTop: (mobileW * 7) / 100}}
            onPress={() => {
              handleAddStory();
            }}
          />
        </View>

        {/* media modal */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isStoryModal}
          requestClose={() => {
            setIsStoryModal(false);
          }}>
          <TouchableOpacity
            onPress={() => {
              setIsStoryModal(false);
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
                width: mobileW,
                borderTopLeftRadius: (mobileW * 8) / 100,
                borderTopRightRadius: (mobileW * 8) / 100,
                position: 'absolute',
                bottom: 0,
              }}>
              <View
                style={{
                  backgroundColor: Colors.whiteColor,
                  width: mobileW,
                  borderTopLeftRadius: (mobileW * 5) / 100,
                  borderTopRightRadius: (mobileW * 5) / 100,
                  marginTop: (mobileW * 8) / 100,
                  paddingHorizontal: (mobileW * 7) / 100,
                  paddingBottom: (mobileW * 6) / 100,
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => openGalleryMultiSelection({type: 1})}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: (mobileW * 2) / 100,
                  }}>
                  <Image
                    source={localimag.icon_media_gallery}
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                  />

                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontSemibold,
                      fontSize: (mobileW * 3.5) / 100,
                      marginLeft: (mobileW * 3) / 100,
                    }}>
                    {t('Mediagallery')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    openCamera({type: 1});
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: (mobileW * 2) / 100,
                  }}>
                  <Image
                    source={localimag.icon_flip_camera}
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                  />

                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontSemibold,
                      fontSize: (mobileW * 3.5) / 100,
                      marginLeft: (mobileW * 3) / 100,
                    }}>
                    {t('MediaCamera')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    openGalleryVideo({type: 2});
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: (mobileW * 2) / 100,
                  }}>
                  <Image
                    source={localimag.icon_video_gallery}
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                  />

                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontSemibold,
                      fontSize: (mobileW * 3.5) / 100,
                      marginLeft: (mobileW * 3) / 100,
                    }}>
                    {t('video_from_gallery_txt')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setIsStoryModal(false);
                    setVideoRecordingModal(true);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: (mobileW * 2) / 100,
                  }}>
                  <Image
                    source={localimag.icon_video_recording}
                    style={{
                      width: (mobileW * 6.5) / 100,
                      height: (mobileW * 6.5) / 100,
                    }}
                  />

                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontSemibold,
                      fontSize: (mobileW * 3.5) / 100,
                      marginLeft: (mobileW * 3) / 100,
                    }}>
                    {t('video_from_camera_txt')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Video recording modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={videoRecordingModal}
          requestClose={() => {}}>
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
                      }, 400);
                    } catch (error) {
                      consolepro.consolelog(error, '<<Error');
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

export default CreateStory;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: Colors.whiteColor,
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: (mobileW * 10) / 100,
    alignSelf: 'center',
  },
});
