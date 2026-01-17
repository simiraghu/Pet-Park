import {
  Alert,
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
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {localimag} from '../Provider/Localimage';
import {
  config,
  consolepro,
  Lang_chg,
  mobileH,
  mobileW,
  msgProvider,
  localStorage,
  mediaprovider,
  apifuntion,
} from '../Provider/utilslib/Utils';
import {useNavigation, useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputField from '../Components/InputField';
import CommonButton from '../Components/CommonButton';
import CommonModal from '../Components/CommonModal';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const EditCommunityScreen = ({navigation}) => {
  const {navigate} = useNavigation();
  const {params} = useRoute();
  const {t} = useTranslation();

  const community_details = params?.community_details;
  consolepro.consolelog(community_details, '<<Community details');

  const [title, setTitle] = useState(community_details?.title);
  const [community, setCommunity] = useState(community_details?.community_name);
  const [aboutCommunity, setAboutCommunity] = useState(
    community_details?.description,
  );
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [mediamodal, setMediamodal] = useState(false);
  const [add_image, setAdd_image] = useState(null);

  const [coverImage, setCoverImage] = useState(community_details?.cover_image);

  // Edit community ===========

  const EditCommunity = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      if (!add_image && !coverImage) {
        msgProvider.toast(t('emptyCommunityBanner_txt'), 'bottom');
        return false;
      }

      if (!title) {
        msgProvider.toast(t('emptyCommunity_title_txt'), 'bottom');
        return false;
      }

      if (!community) {
        msgProvider.toast(t('emptyCommunity_txt'), 'bottom');
        return false;
      }

      if (!aboutCommunity) {
        msgProvider.toast(t('emptyAboutCommunity_txt'), 'bottom');
        return false;
      }

      const API_URL = config.baseURL + 'edit_community';
      const data = new FormData();

      data.append('user_id', userId);
      data.append('community_id', community_details?.community_id);
      data.append('title', title);
      data.append('community_name', community);
      data.append('description', aboutCommunity);
      if (add_image != null) {
        data.append('cover_image', {
          uri: add_image,
          name: 'image.jpg',
          type: 'image/jpeg',
        });
      }

      consolepro.consolelog(data, '<<DATA');

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, 'RES');
            setTimeout(() => {
              setIsCreateModal(true);
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
      consolepro.consolelog(error, '<<Error');
    }
  };

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

  // handle image from gallary =======>>>

  const openGallery = async () => {
    const hasPermission = await requestPhotosPermission();

    if (!hasPermission) {
      console.log('Gallery permission denied');
      return;
    }

    await mediaprovider
      .launchGellery(true)
      .then(res => {
        console.log(res?.path, 'images');
        setAdd_image(res?.path);
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

  consolepro.consolelog(add_image, '<<Add imae');

  // handle image from camera =======>>>

  const openCamera = async () => {
    try {
      await mediaprovider
        .launchCamera()
        .then(res => {
          consolepro.consolelog(res?.path, '<camera image');
          setAdd_image(res?.path);
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainView}>
        {/* --------back ------ */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={{
            alignSelf: 'flex-start',
            marginTop: (mobileW * 5) / 100,
            marginLeft: (mobileW * 3) / 100,
          }}>
          <Image
            source={localimag.icon_back_arrow}
            style={[
              {
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              },
              {tintColor: Colors.ColorBlack},
            ]}
          />
        </TouchableOpacity>

        {/* fields */}
        <KeyboardAwareScrollView
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: (mobileW * 5) / 100,
            paddingBottom: (mobileH * 5) / 100,
          }}
          showsHorizontalScrollIndicator={false}>
          <View style={{marginTop: (mobileW * 3) / 100}}>
            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontBlack,
                fontSize: (mobileW * 5.5) / 100,
              }}>
              {t('updateCommunity_txt')}
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
                    if (!add_image) setMediamodal(true);
                  }}
                  style={{
                    borderRadius: (mobileW * 5) / 100,
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                  }}>
                  <Image
                    source={
                      add_image
                        ? {uri: add_image} // Show selected image if available
                        : coverImage
                        ? {uri: config.img_url + coverImage} // Show prefilled image
                        : localimag.icon_add_pet_photo
                    }
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </TouchableOpacity>

                {/* {!add_image && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (!add_image) setMediamodal(true);
                  }}
                  style={{
                    borderRadius: (mobileW * 5) / 100,
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                  }}>
                  <Image
                    source={localimag?.icon_add_pet_photo}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </TouchableOpacity>
              )} */}

                {add_image || coverImage ? (
                  <TouchableOpacity
                    onPress={() => {
                      setAdd_image(null);
                      setCoverImage(null);
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
                ) : (
                  <View></View>
                )}
              </View>

              <Text
                style={{
                  color: Colors.themeColor,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 4) / 100,
                }}>
                {t('your_community_cover_txt')}
              </Text>
            </View>

            {/* inputs */}
            <View style={{marginTop: (mobileW * 7) / 100}}>
              <InputField
                title={t('community_title_txt')}
                placeholderText={t('enter_your_community_name_txt')}
                inputStyle={{
                  borderColor: Colors.themeColor2,
                  borderWidth: (mobileW * 0.3) / 100,
                }}
                titleStyles={{color: Colors.themeColor2}}
                keyboardType={'default'}
                value={title}
                setValue={val => setTitle(val)}
                maxLength={50}
              />

              <InputField
                title={t('community_name_txt')}
                placeholderText={t('welcome_to_txt')}
                inputStyle={{
                  borderColor: Colors.themeColor2,
                  borderWidth: (mobileW * 0.3) / 100,
                }}
                containerStyle={{marginTop: (mobileW * 3) / 100}}
                titleStyles={{color: Colors.themeColor2}}
                keyboardType={'default'}
                value={community}
                setValue={val => setCommunity(val)}
                maxLength={50}
              />

              <View
                style={{
                  paddingVertical: (mobileW * 2) / 100,
                  marginTop: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3.5) / 100,
                  }}>
                  {t('about_your_community_txt')}
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
                    height: (mobileW * 40) / 100,
                  }}
                  placeholder={t('write_your_answer_here_txt')}
                  value={aboutCommunity}
                  onChangeText={val => setAboutCommunity(val)}
                  placeholderTextColor={Colors.placeholderTextColor}
                  maxLength={250}
                />
              </View>

              <CommonButton
                title={t('update_btn_txt')}
                containerStyle={{
                  backgroundColor: Colors.themeColor2,
                  marginTop: (mobileH * 7) / 100,
                }}
                onPress={() => {
                  EditCommunity();
                }}
              />
            </View>
          </View>

          {/* create modal */}
          <CommonModal
            message={t('communityUpdatedSuccessfully_txt')}
            visible={isCreateModal}
            isIconTick={true}
            isIcon={localimag.icon_green_tick}
            button={true}
            btnText={t('okay_txt')}
            onCrosspress={() => setIsCreateModal(false)}
            onPress={() => {
              setIsCreateModal(false);
              navigate('Community', {type: 1});
            }}
          />
        </KeyboardAwareScrollView>

        {/* camera gallery modal */}
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
                onPress={() => openGallery()}
                activeOpacity={0.8}
                style={styles.button}>
                <Text style={styles.buttonText}>{t('Mediagallery')}</Text>
              </TouchableOpacity>

              {/* Camera Option */}
              <TouchableOpacity
                onPress={() => openCamera()}
                activeOpacity={0.8}
                style={styles.button}>
                <Text style={styles.buttonText}>{t('MediaCamera')}</Text>
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={() => {
                  setMediamodal(false);
                }}>
                <Text style={[styles.buttonText, {color: 'red'}]}>
                  {t('cancelmedia')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default EditCommunityScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
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
  },
});
