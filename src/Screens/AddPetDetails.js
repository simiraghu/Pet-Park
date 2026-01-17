import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {localimag} from '../Provider/Localimage';
import {
  Colors,
  config,
  consolepro,
  Font,
  Lang_chg,
  mobileH,
  mobileW,
  msgProvider,
  localStorage,
  mediaprovider,
  apifuntion,
} from '../Provider/utilslib/Utils';
import {InputWithIcon} from '../Components/InputWithIcon';
import InputField from '../Components/InputField';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonButton from '../Components/CommonButton';
import DatePicker from 'react-native-date-picker';
import SelectGenderModal from '../Components/SelectGenderModal';
import {validation} from '../Provider/Messageconsolevalidationprovider/Validation_provider';
import {createThumbnail} from 'react-native-create-thumbnail';
import {showEditor} from 'react-native-video-trim';
import moment from 'moment';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import RNFS from 'react-native-fs';
import {SafeAreaView} from 'react-native-safe-area-context';

const AddPetDetails = ({navigation}) => {
  const [petName, setPetName] = useState(null);
  const [category, setCategory] = useState(null);
  const [breed, setBreed] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState(null);
  const [size, setSize] = useState(null);

  const [isDatePicker, setIsDatePicker] = useState(false);
  const [date, setDate] = useState(null);

  const [isGenderModal, setIsGenderModal] = useState(false);
  const [isCategoryModal, setIsCategoryModal] = useState(false);
  const [isPetBreedModal, setIsPetBreedModal] = useState(false);
  const [isPetSizeModal, setIsPetSizeModal] = useState(false);

  const [isCameraGalleryModal, setIsCameraGalleryModal] = useState(false);

  const {t} = useTranslation();
  const {params} = useRoute();

  const [petCategories, setPetCategories] = useState([
    {label: 'Dogs', value: 'dogs'},
    {label: 'Cats', value: 'cats'},
    {label: 'Birds', value: 'birds'},
  ]);

  const GenderDetails = [
    {label: ['Male', 'ذكر', '男'], value: 1},
    {label: ['Female', 'أنثى', '女'], value: 2},
    {label: ['Others', 'آخرون', '其他'], value: 3},
  ];

  const [petBreedDetails, setPetBreedDetails] = useState([
    {label: 'Bulldog', value: 'bulldog'},
    {label: 'Poodle', value: 'poodle'},
    {label: 'Beagle', value: 'beagle'},
    // {label: 'Dachshund', value: 'dachshund'},
  ]);

  const [PetSize, setPetSize] = useState([
    {label: 'Small', value: 'small'},
    {label: 'Medium', value: 'medium'},
    {label: 'Large', value: 'large'},
  ]);

  const handleSelectCategory = category => {
    setCategory(category);
    setIsCategoryModal(false);
    setBreed(null);
    Keyboard.dismiss();
  };

  const handleGenderDetails = category => {
    setGender(category);
    setIsGenderModal(false);
    consolepro.consolelog(category, 'Gender');
    Keyboard.dismiss();
  };

  const handlePetBreed = category => {
    setBreed(category);
    setIsPetBreedModal(false);
    Keyboard.dismiss();
  };

  const handlePetSize = category => {
    consolepro.consolelog(category, '<<Cate');
    setSize(category);
    setIsPetSizeModal(false);
    Keyboard.dismiss();
  };

  // Handle Next ============

  const handleNext = async () => {
    try {
      const allItemsEmpty = mediaItem.filter(item => item != null);
      consolepro.consolelog('All empty ======>>', allItemsEmpty);
      if (allItemsEmpty?.length != 4) {
        msgProvider.toast(t('emptyImage_txt'), 'bottom');
        return false;
      }

      if (!petName) {
        msgProvider.toast(t('emptyPetName'), 'bottom');
        return false;
      }

      if (petName && petName.trim().length <= 0) {
        msgProvider.toast(t('emptyPetName'), 'bottom');
        return false;
      }

      if (!category) {
        msgProvider.toast(t('emptyPetCategory'), 'bottom');
        return false;
      }

      if (!breed) {
        msgProvider.toast(t('emptyPetBreed'), 'bottom');
        return false;
      }

      if (!date) {
        msgProvider.toast(t('emptyPetDateOfBirth_txt'), 'bottom');
        return false;
      }
      if (!gender) {
        msgProvider.toast(t('emptyGender'), 'bottom');
        return false;
      }

      if (!size) {
        msgProvider.toast(t('emptySize'), 'bottom');
        return false;
      }

      // setPetName(null);
      // setBreed(null);
      // setCategory(null);
      // setSize(null);
      // setDate(new Date());
      // setGender(null);
      // setMediaItem([null, null, null, null]);

      consolepro.consolelog({
        petType: category?.pet_type_id,
        breed: breed?.breed_id,
        pet_name: petName,
        pet_dob: date,
        pet_gender: gender?.value,
        size: size?.pet_size_id,
        image: mediaItem,
      });

      setTimeout(() => {
        navigation.navigate('AboutPetHealth', {
          petType: category?.pet_type_id,
          breed: breed?.breed_id,
          pet_name: petName,
          pet_dob: date,
          pet_gender: gender?.value,
          size: size?.pet_size_id,
          image: mediaItem.filter(item => item != null),
          frontImage: frontImage,
          backImage: backImage,
          selfieImage: selfieImage,
        });
        // setMediaItem([null, null, null, null]);
        // setPetName(null);
        // setCategory(null);
        // setBreed(null);
        // setDate(new Date());
        // setGender(null);
        // setSize(null);
        consolepro.consolelog(
          mediaItem.filter(item => item != null),
          '<<LINE 186',
        );
      }, 500);
    } catch (error) {
      consolepro.consolelog(error, '<<Line 188');
    }
  };

  // Get Pet Category =========

  // get pet type ==========

  const GetPetCategory = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_array');
      const userId = user_arr?.user_id;

      const API_URL = config.baseURL + 'get_pet_type?user_id=' + userId;
      consolepro.consolelog(API_URL, '<<A');
      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<REs');
            setPetCategories(res?.pet_type_arr);
          } else {
            consolepro.consolelog(res, '<<REs');
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              setPetCategories([]);
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERror');
    }
  };

  // Pet Breed ============

  const GetPetBreed = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_array');
      const userId = user_arr?.user_id;

      const API_URL =
        config.baseURL +
        `get_pet_breed?user_id=${userId}&pet_type_id=${category?.pet_type_id}`;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<REs');
            setPetBreedDetails(res?.breed_arr);
          } else {
            consolepro.consolelog(res, '<<REs');
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res, '<<RES');
              setPetBreedDetails([]);
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERror');
    }
  };

  // Get Pet Size =========

  const GetPetSize = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_array');
      const userId = user_arr?.user_id;

      const API_URL = config.baseURL + `get_pet_size?user_id=${userId}`;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<REs');
            setPetSize(res?.pet_size_arr);
          } else {
            consolepro.consolelog(res, '<<REs');
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res, '<<RES');
              setPetSize([]);
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERror');
    }
  };

  useFocusEffect(
    useCallback(() => {
      GetPetCategory();
      GetPetSize();
    }, []),
  );

  useEffect(() => {
    GetPetBreed();
  }, [category, category?.breed_id]);

  // Handle Open Setting ========

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

  // Camera Open =========

  const [mediaItem, setMediaItem] = useState([null, null, null, null]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [uploadMediaArray, setUploadMediaArray] = useState([]);
  const [mediamodal, setMediamodal] = useState(false);
  const [newcameramodal, setNewcameramodal] = useState(false);
  const [postVideo, setPostVideo] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordOptions] = useState({maxDuration: 15});
  const [cameraType, setCameraType] = useState('back');
  const [zoom, setZoom] = useState(0);
  const [flash, setFlash] = useState('off');
  const cameraRef = useRef(null);

  const video = params?.videoUri;
  const index = params?.index;
  const thumbnail = params?.thumbnail;

  const frontImage = params?.frontImage;
  const backImage = params?.backImage;
  const selfieImage = params?.selfieImage;

  consolepro.consolelog('Front Image =======>>', frontImage);
  consolepro.consolelog('Back Image =======>>', backImage);
  consolepro.consolelog('Selfie Image======>>', selfieImage);

  consolepro.consolelog(video, '<<VIdoe');

  const openMediaPicker = async index => {
    setSelectedSlot(index);
    const media = mediaItem[index];
    consolepro.consolelog(media?.uri);

    if (media?.uri) {
      const mediaType = media?.type === 2 ? 1 : 0;
      consolepro.consolelog(mediaType, media.uri, index, '<<Media type');

      setMediamodal(false); // Close modal before navigating

      setTimeout(() => {
        navigation.navigate('VideoPreview', {
          uri: media.uri,
          index,
          type: mediaType,
        });
      }, 300);
    } else {
      consolepro.consolelog('Modal');
      setMediamodal(true);
    }
  };

  // For Video ================

  useFocusEffect(
    useCallback(() => {
      // Assuming video or images are being selected from the camera/gallery
      if (video && index !== undefined && index !== null) {
        setMediaItem(prevItems => {
          const updatedItems = [...prevItems];
          updatedItems[index] = {uri: video, type: 2, thumbnail: thumbnail}; // Set the selected video/image at the specified index
          return updatedItems;
        });

        // Reset the params in navigation
        navigation.setParams({
          video: null,
          index: null,
        });
      }
    }, [video, index]),
  );

  consolepro.consolelog(mediaItem, '<<media item');

  // After selecting media (camera/gallery/etc.)

  const handleMediaSelected = media => {
    const updatedItems = [...mediaItem];
    if (selectedSlot !== null) {
      updatedItems[selectedSlot] = media;
      setMediaItem(updatedItems);
    }
    setSelectedSlot(null);
    setMediamodal(false);
    consolepro.consolelog(media, '<<Media');
  };

  // From Camera
  const openCamera = async ({type}) => {
    try {
      const obj = await mediaprovider.launchCamera(); // returns file:// path
      console.log('Camera Image Path:', obj);

      handleMediaSelected({uri: obj?.path, type: type, thumbnail: ''});
    } catch (error) {
      setMediamodal(false);
      if (error?.toString().toLowerCase().includes('permission')) {
        openSettings();
      }
    }
  };

  // From Gallery Image
  const openGallery = async ({type}) => {
    try {
      const result = await mediaprovider.launchGellery();
      console.log('Gallery result:', result);

      // Handle both single and multiple selection results
      const selectedImages = Array.isArray(result) ? result : [result];

      if (selectedImages.length > 0) {
        const image = selectedImages[0]; // file:// path
        console.log('Gallery Image Path:', image?.path);

        handleMediaSelected({uri: image?.path, type: type, thumbnail: ''});
      }
    } catch (error) {
      setMediamodal(false);
      if (error.message?.includes('permission')) openSettings();
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
        // await showEditor(res?.path, {maxDuration: 15, saveToPhoto: false});
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
          })
          .catch(error => {
            consolepro.consolelog(error, 'THumbnail res');
          });
      }, 800);
    } catch (error) {
      setMediamodal(false);
      if (error.message?.includes('permission')) openSettings();
    }
  };

  // Optional: Remove from a specific slot
  const removeMedia = index => {
    const updated = [...mediaItem];
    updated[index] = null;
    setMediaItem(updated);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        <View
          style={{
            marginHorizontal: (mobileW * 5) / 100,
            marginTop: (mobileW * 5) / 100,
            flex: 1,
          }}>
          {/* --------back------- */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.goBack(), setPetName(null);
            }}
            style={{
              alignSelf: 'flex-start',
              width: (mobileW * 10) / 100,
              height: (mobileW * 10) / 100,
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
                {tintColor: Colors.ColorBlack},
              ]}
            />
          </TouchableOpacity>

          <KeyboardAwareScrollView
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={Platform.OS === 'android' ? 100 : 0} // Important for Android
            enableOnAndroid={true}
            contentContainerStyle={{
              paddingBottom: (mobileW * 5) / 100,
              flexGrow: 1, // This allows the scroll view to grow and become scrollable
            }}>
            {/* -------- header content -------- */}

            <View style={{marginTop: (mobileW * 2) / 100}}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 6) / 100,
                }}>
                {t('tell_us_about_your_pet_txt')}
              </Text>
              <Text
                style={{
                  color: Colors.themeColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 4) / 100,
                }}>
                {t('you_add_pet_image_txt')}
              </Text>
            </View>

            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {/* {mediaItem.map((item, index) => ( */}
              <FlatList
                data={mediaItem}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      marginHorizontal: (mobileW * 1) / 100,
                      marginVertical: (mobileW * 3) / 100,
                      width: (mobileW * 20) / 100,
                      height: (mobileW * 20) / 100,
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => openMediaPicker(index)}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: (mobileW * 3) / 100,
                        overflow: 'hidden',
                      }}>
                      <ImageBackground
                        source={
                          item?.type === 2
                            ? item?.thumbnail
                              ? {uri: item?.thumbnail}
                              : item?.uri
                              ? {uri: item?.uri}
                              : localimag.icon_add_user
                            : item?.uri
                            ? {uri: item?.uri}
                            : localimag.icon_add_pet_photo
                        }
                        style={{
                          width: '100%',
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        imageStyle={{
                          borderRadius: (mobileW * 3) / 100,
                        }}>
                        {/* Placeholder text */}
                        {!item && (
                          <Text
                            style={{
                              color: Colors.themeColor,
                              fontFamily: Font.FontMedium,
                              fontSize: (mobileW * 2) / 100,
                              marginTop: (mobileW * 13) / 100,
                            }}>
                            {t('photo_video_txt')}
                          </Text>
                        )}
                      </ImageBackground>
                    </TouchableOpacity>

                    {/* Cross icon - floats outside top-right */}
                    {item && (
                      <TouchableOpacity
                        onPress={() => removeMedia(index)}
                        style={{
                          position: 'absolute',
                          top: (-mobileW * 1.5) / 100,
                          right: (-mobileW * 1.5) / 100,
                          backgroundColor: Colors.whiteColor,
                          borderRadius: (mobileW * 5) / 100,
                          padding: 3,
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
                            width: (mobileW * 3) / 100,
                            height: (mobileW * 3) / 100,
                          }}
                          tintColor={Colors.cancleColor}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              />
              {/* ))} */}
            </View>

            <View
              style={{alignSelf: 'center', marginBottom: (mobileW * 2) / 100}}>
              <Text
                style={{
                  color: Colors.cancleColor,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 3) / 100,
                }}>
                {t('please_upload_a_video_smaller_txt')}
              </Text>
            </View>
            {/* ))} */}

            {/* ------ input fields ----- */}
            <View>
              <InputField
                title={t('pet_name_txt')}
                titleStyles={{color: Colors.themeColor2}}
                placeholder={t('enter_pet_name_txt')}
                inputStyle={{
                  borderColor: Colors.themeColor2,
                  borderWidth: (mobileW * 0.3) / 100,
                }}
                placeholderText={t('enter_pet_name_txt')}
                keyboardType={'dafault'}
                maxLength={50}
                value={petName}
                setValue={setPetName}
              />

              <InputWithIcon
                title={t('pet_category_txt')}
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={t('select_pet_category_txt')}
                iconSource={localimag.icon_down}
                iconStyle={{
                  with: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
                onPress={() => setIsCategoryModal(true)}
                value={category?.title[config.language] ?? ''}
                onIconPress={() => setIsCategoryModal(true)}
              />

              <InputWithIcon
                title={t('pet_breed_txt')}
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={t('select_breed_txt')}
                iconSource={localimag.icon_down}
                iconStyle={{
                  with: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
                onPress={() => setIsPetBreedModal(true)}
                onIconPress={() => setIsPetBreedModal(true)}
                value={breed?.breed_name[config.language] ?? ''}
              />

              <InputWithIcon
                title={t('Date_of_birth_txt')}
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={t('enter_your_pet_dob_txt')}
                iconSource={localimag.icon_calendar}
                iconStyle={{
                  with: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
                onPress={() => setIsDatePicker(true)}
                value={date ? moment(date).format('DD-MM-YYYY') : ''}
                onIconPress={() => setIsDatePicker(true)}
              />

              <InputWithIcon
                title={t('gender_txt')}
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={t('select_gender_txt')}
                iconSource={localimag.icon_down}
                iconStyle={{
                  with: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
                value={gender?.label[config.language] ?? ''}
                onPress={() => setIsGenderModal(true)}
                onIconPress={() => setIsGenderModal(true)}
              />

              <InputWithIcon
                title={t('size_txt')}
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={t('select_size')}
                iconSource={localimag.icon_down}
                iconStyle={{
                  with: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
                value={size?.pet_size[config.language] ?? ''}
                onPress={() => setIsPetSizeModal(true)}
                onIconPress={() => setIsPetSizeModal(true)}
              />

              <CommonButton
                title={t('next_txt')}
                containerStyle={{
                  backgroundColor: Colors.themeColor2,
                  marginTop: (mobileW * 4) / 100,
                  // marginBottom: (mobileH * 6) / 100,
                }}
                onPress={() => {
                  handleNext();
                }}
              />
            </View>
          </KeyboardAwareScrollView>

          {/* --------- date picker ---- */}
          <DatePicker
            date={date || new Date()}
            onDateChange={setDate}
            modal
            open={isDatePicker}
            mode="date"
            dividerColor={Colors.themeColor}
            theme="light"
            title={t('select_date_of_birth_txt')}
            onCancel={() => setIsDatePicker(false)}
            onConfirm={value => {
              setDate(value);
              setIsDatePicker(false);
            }}
            buttonColor={Colors.themeColor}
            onStateChange={setDate}
            maximumDate={new Date()}
          />

          {/* --------- gender modal ---------- */}
          {/* <SelectGenderModal
          visible={isGenderModal}
          onPress={() => setIsGenderModal(false)}
          setModalStatus={() => setIsGenderModal(false)}
        /> */}

          {/* gender dropdown modal */}

          <Modal
            transparent={true}
            visible={isGenderModal}
            animationType="fade">
            <TouchableOpacity
              style={styles.overlay}
              onPress={() => setIsGenderModal(false)}>
              <View style={styles.dropdown}>
                <FlatList
                  data={GenderDetails}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        index === GenderDetails.length - 1 && styles.lastOption,
                      ]}
                      onPress={() => handleGenderDetails(item)}>
                      <Text style={styles.optionText}>
                        {item.label?.[config.language]}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* category Dropdown Modal */}

          {petCategories && petCategories?.length > 0 && (
            <Modal
              transparent={true}
              visible={isCategoryModal}
              animationType="fade">
              <TouchableOpacity
                style={styles.overlay}
                onPress={() => setIsCategoryModal(false)}>
                <View style={styles.dropdown}>
                  <FlatList
                    data={petCategories}
                    keyExtractor={item => item.value}
                    renderItem={({item, index}) => (
                      <TouchableOpacity
                        style={[
                          styles.option,
                          index === petCategories.length - 1 &&
                            styles.lastOption,
                        ]}
                        onPress={() => handleSelectCategory(item)}>
                        <Text style={styles.optionText}>
                          {item?.title?.[config.language] ?? ''}
                        </Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingVertical: (mobileW * 2) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.ColorBlack,
                            fontSize: (mobileW * 4) / 100,
                            fontFamily: Font.FontMedium,
                          }}>
                          {t('no_data_found_txt')}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          )}

          {/* breed dropdown modal */}
          <Modal
            transparent={true}
            visible={isPetBreedModal}
            animationType="fade">
            <TouchableOpacity
              style={styles.overlay}
              onPress={() => setIsPetBreedModal(false)}>
              <View style={styles.dropdown}>
                <FlatList
                  data={petBreedDetails}
                  keyExtractor={item => item.value}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        index === petBreedDetails.length - 1 &&
                          styles.lastOption,
                      ]}
                      onPress={() => handlePetBreed(item)}>
                      <Text style={styles.optionText}>
                        {item?.breed_name[config.language] ?? ''}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={() => (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: (mobileW * 2) / 100,
                      }}>
                      <Text
                        style={{
                          color: Colors.ColorBlack,
                          fontSize: (mobileW * 4) / 100,
                          fontFamily: Font.FontMedium,
                        }}>
                        {t('emptyBreed_Validation_txt')}
                      </Text>
                    </View>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* pet size modal */}

          <Modal
            transparent={true}
            visible={isPetSizeModal}
            animationType="fade">
            <TouchableOpacity
              style={styles.overlay}
              onPress={() => setIsPetSizeModal(false)}>
              <View style={styles.dropdown}>
                <FlatList
                  data={PetSize}
                  keyExtractor={item => item.value}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        index === PetSize.length - 1 && styles.lastOption,
                      ]}
                      onPress={() => handlePetSize(item)}>
                      <Text style={styles.optionText}>
                        {item?.pet_size?.[config.language] ?? ''}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={() => (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: (mobileW * 2) / 100,
                      }}>
                      <Text
                        style={{
                          color: Colors.ColorBlack,
                          fontSize: (mobileW * 4) / 100,
                          fontFamily: Font.FontMedium,
                        }}>
                        {t('no_data_found_txt')}
                      </Text>
                    </View>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>

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
                    setMediamodal(false);
                    setTimeout(() => {
                      navigation.navigate('VideoRecordingScreen', {
                        index: selectedSlot,
                        pageType: 1,
                      });
                    }, 300);
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
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddPetDetails;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
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
    marginVertical: (mobileW * 3) / 100,
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
});
