import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {localimag} from '../Provider/Localimage';
import {
  Colors,
  config,
  consolepro,
  Font,
  mobileH,
  mobileW,
  msgProvider,
} from '../Provider/utilslib/Utils';
import {useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {PermissionsAndroid, Platform, Alert} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import RNFS from 'react-native-fs';
import {SafeAreaView} from 'react-native-safe-area-context';

const VideoRecorderScreen = ({navigation}) => {
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(false);
  const [thumbnail, setThumbnail] = useState('');

  const {params} = useRoute();
  const index = params?.index;
  const pageType = params?.pageType;
  const pet = params?.pet;
  const user = params?.user;

  consolepro.consolelog(pageType, '<<Page Type');
  consolepro.consolelog(index, videoUri, '<<Index recording');
  consolepro.consolelog(pet, '<PET');

  const {t} = useTranslation();

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (!isRecording && interval !== null) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Format time as mm:ss
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      setRecordingTime(0);
      setShowPreview(false);
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
            // handleMediaSelected({
            //   uri: res?.path,
            //   type: type,
            //   thumbnail: thumbnailResponse?.path,
            // });
            setThumbnail(thumbnailResponse?.path);
            setVideoUri(data.uri);
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

  useEffect(() => {
    (async () => {
      const permission = await requestCameraPermission();
      setHasPermission(permission);
    })();
  }, []);

  consolepro.consolelog(videoUri, '<<VIEO');

  const handleNavigation = async () => {
    try {
      if (videoUri && index !== null && index !== undefined) {
        const statResult = await RNFS.stat(videoUri);
        const fileSizeInMB = (statResult.size / (1024 * 1024)).toFixed(2);
        console.log(`Video Size: ${fileSizeInMB} MB`);

        if (fileSizeInMB > 50) {
          msgProvider.toast(t('please_record_a_shorter_video_txt'), 'bottom');
          return false;
        }
        if (pageType == 1) {
          navigation.navigate('AddPetDetails', {
            videoUri,
            type: 1,
            index,
            thumbnail: thumbnail,
          });
        } else if (pageType == 2) {
          navigation.navigate('AddUserDetails', {
            videoUri,
            type: 1,
            index,
            thumbnail: thumbnail,
          });
        } else if (pageType == 3) {
          navigation.navigate('UpdateProfileNew', {
            videoUri,
            type: 1,
            index,
            user_thumbnail: thumbnail,
          });
        } else if (pageType == 4 && pet) {
          navigation.navigate('UpdateProfileNew', {
            petvideoUri: videoUri,
            type: 1,
            petIndex: index,
            pet_thumbnail: thumbnail,
          });
        } else if (pageType == 5) {
          navigation.navigate('WithoutPetProfile', {
            videoUri,
            type: 1,
            index,
            pet_thumbnail: thumbnail,
          });
        } else if (pageType == 6 && user) {
          navigation.navigate('WithoutPetProfile', {
            userVideoUri: videoUri,
            type: 1,
            userIndex: index,
            user_thumbnail: thumbnail,
          });
        }
      } else {
        console.log('Missing params:', {videoUri, index});
      }
    } catch (error) {
      consolepro.consolelog(error, '<<<Error');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.themeColor2}}>
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={localimag.icon_back_arrow}
              style={{
                width: (mobileW * 5) / 100,
                height: (mobileW * 5) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
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
              onPress={() => {
                handleNavigation();
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
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
                  isRecording ? localimag.icon_pause : localimag.icon_play_icon
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    bottom: (mobileW * 10) / 100,
    alignSelf: 'center',
  },
});

export default VideoRecorderScreen;
