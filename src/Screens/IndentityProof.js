import {
  Alert,
  Image,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  config,
  consolepro,
  localimag,
  mediaprovider,
  mobileH,
  mobileW,
  msgProvider,
} from '../Provider/utilslib/Utils';
import {useTranslation} from 'react-i18next';
import CommonButton from '../Components/CommonButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';

const IndentityProof = ({navigation}) => {
  const {goBack, navigate} = useNavigation();
  const {t} = useTranslation();
  const {params} = useRoute();

  const [cameraModal, setCameraModal] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [previewUri, setPreviewUri] = useState(null);

  const [currentImageType, setCurrentImageType] = useState(null);
  const [isPreviewModal, setIsPreviewModal] = useState(false);

  const statusBarHeight =
    config.device_type == 'android'
      ? StatusBar.currentHeight - (mobileH * 5) / 100
      : 44;

  const page = params?.page;

  consolepro.consolelog('Page ======>>', page);
  // open setting function =====>>

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

  // Ask permission from camera and gallery ====>>>

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

  //   Camera Function

  const Camerapopen = async () => {
    try {
      await mediaprovider
        .launchCamera()
        .then(res => {
          consolepro.consolelog('RES Camera ======>>', res?.path);
          if (currentImageType == 0) {
            setFrontImage(res?.path);
            setCameraModal(false);
          } else if (currentImageType == 1) {
            setBackImage(res?.path);
            setCameraModal(false);
          } else if (currentImageType == 2) {
            setSelfieImage(res?.path);
            setCameraModal(false);
          }
        })
        .catch(error => {
          consolepro.consolelog('error ======>>', error);
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
      consolepro.consolelog('Error ======>>', error);
    }
  };

  //   Gallery Function

  const Galleryopen = async () => {
    try {
      const hasPermission = await requestPhotosPermission();

      if (!hasPermission) {
        console.log('Gallery permission denied');
        return;
      }
      await mediaprovider
        .launchGellery()
        .then(res => {
          consolepro.consolelog('RES Camera ======>>', res?.path);
          if (currentImageType == 0) {
            setFrontImage(res?.path);
            setCameraModal(false);
          } else if (currentImageType == 1) {
            setBackImage(res?.path);
            setCameraModal(false);
          } else if (currentImageType == 2) {
            setSelfieImage(res?.path);
            setCameraModal(false);
          }
        })
        .catch(error => {
          consolepro.consolelog('error ======>>', error);
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
    } catch (error) {
      consolepro.consolelog('Error =======>>', error);
    }
  };

  // Handle Continue Btn

  const handleContinueBtn = async () => {
    try {
      // if (!frontImage) {
      //   msgProvider.toast(t('emptyFrontImage_txt'), 'bottom');
      //   return false;
      // }

      // if (!backImage) {
      //   msgProvider.toast(t('emptyBackImage_txt'), 'bottom');
      //   return false;
      // }

      // if (!selfieImage) {
      //   msgProvider.toast(t('emptySelfieImage_txt'), 'bottom');
      //   return false;
      // }

      setTimeout(() => {
        page == 'friendship'
          ? navigate('AddPetDetails', {frontImage, backImage, selfieImage})
          : navigate('PlanAPet', {frontImage, backImage, selfieImage});
      }, 500);
    } catch (error) {
      consolepro.consolelog('Error ==========>>', error);
    }
  };

  consolepro.consolelog('Front Image =======>>', frontImage);
  consolepro.consolelog('Back Image =====>>', backImage);
  consolepro.consolelog('Selfie Image ===>>', selfieImage);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.containerStyle}>
        <View
          style={{
            width: (mobileW * 90) / 100,
            alignSelf: 'center',
            marginTop: (mobileH * 3.5) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => goBack()}
            activeOpacity={0.8}
            style={{
              width: (mobileW * 12) / 100,
              height: (mobileW * 12) / 100,
            }}>
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

        <View>
          <Text
            style={{
              color: Colors.themeColor2,
              fontFamily: Font.FontBold,
              fontSize: (mobileW * 5) / 100,
              alignSelf: 'center',
            }}>
            {t('identity_proof_txt')}
          </Text>
        </View>

        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: (mobileW * 7) / 100}}
          scrollEnabled={false}>
          {/* Front Image */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (frontImage) {
                setIsPreviewModal(true);
                setPreviewUri(frontImage);
              } else {
                setCameraModal(true);
                setCurrentImageType(0);
              }
            }}
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
            {frontImage ? (
              <>
                <Image
                  source={{uri: frontImage}}
                  style={{
                    backgroundColor: Colors.ColorGrayTransparent,
                    width: (mobileW * 85) / 100,
                    height: (mobileW * 32) / 100,
                    margin: (mobileW * 1) / 100,
                    borderRadius: (mobileW * 5) / 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setFrontImage(null);
                  }}
                  style={{
                    backgroundColor: Colors.whiteColor,
                    borderRadius: (mobileW * 30) / 100,
                    position: 'absolute',
                    top: (mobileW * 3) / 100,
                    right: (mobileW * 3) / 100,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 12,
                  }}>
                  <Image
                    source={localimag.icon_crossIcon}
                    style={{
                      width: (mobileW * 5) / 100,
                      height: (mobileW * 5) / 100,
                      tintColor: Colors.cancleColor,
                    }}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setCameraModal(true);
                  setCurrentImageType(0);
                }}
                style={{
                  backgroundColor: Colors.ColorGrayTransparent,
                  width: (mobileW * 85) / 100,
                  height: (mobileW * 32) / 100,
                  margin: (mobileW * 1) / 100,
                  borderRadius: (mobileW * 5) / 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={localimag.icon_upload_identity}
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
                    fontSize: (mobileW * 3.5) / 100,
                    marginTop: (mobileW * 4) / 100,
                    textAlign: 'center',
                  }}>
                  {t('upload_front_side_photo_txt') + '\n' + t('optional_txt')}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* Back Image */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (backImage) {
                setIsPreviewModal(true);
                setPreviewUri(backImage);
              } else {
                setCameraModal(true);
                setCurrentImageType(1);
              }
            }}
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
            {backImage ? (
              <>
                <Image
                  source={{uri: backImage}}
                  style={{
                    width: (mobileW * 85) / 100,
                    height: (mobileW * 32) / 100,
                    margin: (mobileW * 1) / 100,
                    borderRadius: (mobileW * 5) / 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setBackImage(null);
                  }}
                  style={{
                    backgroundColor: Colors.whiteColor,
                    borderRadius: (mobileW * 30) / 100,
                    position: 'absolute',
                    top: (mobileW * 3) / 100,
                    right: (mobileW * 3) / 100,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 12,
                  }}>
                  <Image
                    source={localimag.icon_crossIcon}
                    style={{
                      width: (mobileW * 5) / 100,
                      height: (mobileW * 5) / 100,
                      tintColor: Colors.cancleColor,
                    }}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setCurrentImageType(1);
                  setCameraModal(true);
                }}
                style={{
                  backgroundColor: Colors.ColorGrayTransparent,
                  width: (mobileW * 85) / 100,
                  height: (mobileW * 32) / 100,
                  margin: (mobileW * 1) / 100,
                  borderRadius: (mobileW * 5) / 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={localimag.icon_upload_identity}
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
                    fontSize: (mobileW * 3.5) / 100,
                    marginTop: (mobileW * 4) / 100,
                    textAlign: 'center',
                  }}>
                  {t('upload_back_side_photo_txt') + '\n' + t('optional_txt')}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* Selfie Image */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (selfieImage) {
                setIsPreviewModal(true);
                setPreviewUri(selfieImage);
              } else {
                setCurrentImageType(2);
                setCameraModal(true);
              }
            }}
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
            {selfieImage ? (
              <>
                <Image
                  source={{uri: selfieImage}}
                  style={{
                    backgroundColor: Colors.ColorGrayTransparent,
                    width: (mobileW * 85) / 100,
                    height: (mobileW * 32) / 100,
                    margin: (mobileW * 1) / 100,
                    borderRadius: (mobileW * 5) / 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelfieImage(null);
                  }}
                  style={{
                    backgroundColor: Colors.whiteColor,
                    borderRadius: (mobileW * 30) / 100,
                    position: 'absolute',
                    top: (mobileW * 3) / 100,
                    right: (mobileW * 3) / 100,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 12,
                  }}>
                  <Image
                    source={localimag.icon_crossIcon}
                    style={{
                      width: (mobileW * 5) / 100,
                      height: (mobileW * 5) / 100,
                      tintColor: Colors.cancleColor,
                    }}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setCurrentImageType(2);
                  setCameraModal(true);
                }}
                style={{
                  backgroundColor: Colors.ColorGrayTransparent,
                  width: (mobileW * 85) / 100,
                  height: (mobileW * 32) / 100,
                  margin: (mobileW * 1) / 100,
                  borderRadius: (mobileW * 5) / 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={localimag.icon_upload_identity}
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
                    fontSize: (mobileW * 3.5) / 100,
                    marginTop: (mobileW * 4) / 100,
                    textAlign: 'center',
                  }}>
                  {t('upload_selfie_image_txt') + '\n' + t('optional_txt')}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <CommonButton
            containerStyle={{
              backgroundColor: Colors.themeColor2,
              marginTop: (mobileW * 7) / 100,
            }}
            title={t('continue_txt')}
            onPress={() => {
              handleContinueBtn();
            }}
          />
        </KeyboardAwareScrollView>

        {/* Camera modal */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={cameraModal}
          requestClose={() => {
            setCameraModal(false);
          }}>
          <TouchableOpacity
            onPress={() => {
              setCameraModal(false);
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
                  onPress={() => {
                    Galleryopen({type: 1});
                  }}
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
                    {t('open_gallery_txt')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    Camerapopen({type: 1});
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
                    {t('open_camera_txt')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Preview Modal */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isPreviewModal}
          requestClose={() => {
            setIsPreviewModal(false);
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.blackColor,
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
                backgroundColor: Colors.themeColor2,
              }}>
              <TouchableOpacity onPress={() => setIsPreviewModal(false)}>
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
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                paddingTop: (mobileH * 20) / 100,
              }}>
              <Image
                source={{uri: previewUri}}
                style={{
                  width: mobileW,
                  height: (mobileH * 60) / 100,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default IndentityProof;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: Colors.whiteColor,
    flex: 1,
  },
});
