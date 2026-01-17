import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Keyboard,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {localimag} from '../Provider/Localimage';
import {
  Colors,
  config,
  Font,
  Lang_chg,
  mobileH,
  mobileW,
  localStorage,
  consolepro,
  msgProvider,
  mediaprovider,
  apifuntion,
} from '../Provider/utilslib/Utils';
import {InputWithIcon} from '../Components/InputWithIcon';
import InputField from '../Components/InputField';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonButton from '../Components/CommonButton';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import SelectGenderModal from '../Components/SelectGenderModal';
import {validation} from '../Provider/Messageconsolevalidationprovider/Validation_provider';
import {createThumbnail} from 'react-native-create-thumbnail';
import {showEditor} from 'react-native-video-trim';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {RNCamera} from 'react-native-camera';
import RNFS from 'react-native-fs';
import MovToMp4 from 'react-native-mov-to-mp4';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {SafeAreaView} from 'react-native-safe-area-context';

const AddUserDetails = () => {
  const navigation = useNavigation();
  const {params} = useRoute();
  const {t} = useTranslation();
  const cameraRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const statusBarHeight =
    Platform.OS === 'android'
      ? StatusBar.currentHeight - (mobileH * 5) / 100
      : 44;

  const [name, setName] = useState(null);
  const [date, setDate] = useState(null);
  const [location, setLocation] = useState(null);
  const [whatDoYouDo, setWhatDoYouDo] = useState(null);
  const [gender, setGender] = useState(null);
  const [relationshipStatus, setRelationshipStatus] = useState(null);
  const [sharingModal, setSharingModal] = useState(false);

  const [isDatePicker, setIsDatePicker] = useState(false);
  const [isGenderModal, setIsGenderModal] = useState(false);
  const [isRelationModal, setisRelationModal] = useState(false);
  const [mediamodal, setMediamodal] = useState(false);

  // video recording modal

  const [videoRecordingModal, setVideoRecordingModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(false);
  const [videoRecordingthumbnail, setVideoRecordingThumbnail] = useState('');

  const [mediaItem, setMediaItem] = useState([null, null, null, null]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [searchValue, setSearchValue] = useState(null);
  const [addressbar2, setAddressbar2] = useState(false);
  const [details, setDetails] = useState(null);
  const [addLocation, setAddLocation] = useState(null);
  const [addLocationHome, setAddLocationHome] = useState(null);
  const [addressSelected, setAddressSelected] = useState('Search');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [myShortName, setMyShortName] = useState('');
  const GooglePlacesRef = useRef();
  const watchID = useRef(null);

  const pageName = params?.pagename;
  const petType = params?.petType;
  const breed = params?.breed;
  const petGender = params?.gender;
  const ageRange = params?.ageRange;
  const note = params?.note;
  const video = params?.videoUri;
  const index = params?.index;
  const thumbnail = params?.thumbnail;

  const frontImage = params?.frontImage;
  const backImage = params?.backImage;
  const selfieImage = params?.selfieImage;

  console.log(frontImage, backImage, selfieImage, '<<Selfie');

  // Location Places ==========

  const onPlacePress = (data, details = null) => {
    // console.log('details ======>>', details);
    // consolepro.consolelog('DATA =========>>', data);

    setDetails(details);

    let city = 'unknown';
    for (let i = 0; i < details.address_components.length; i++) {
      if (details?.address_components[i].types[0] === 'locality') {
        city = details.address_components[i].long_name;
      }
    }

    console.log('city =======>>', city);
    const locationData = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      address: details.formatted_address,
      city: city,
    };

    setAddLocation(locationData);
    setAddLocationHome(details);
    setAddressbar2(true);
    setLatitude(details?.geometry.location.lat);
    setLongitude(details?.geometry.location.lng);
    setAddress(details?.formatted_address);
    setDescription(details?.formatted_address);
    setAddressSelected(details?.formatted_address);
    setMyShortName(details?.address_components[0]?.short_name);

    // Update your global/config if needed
    config.latitude = details.geometry.location.lat;
    config.longitude = details.geometry.location.lng;
    global.shortName = details?.address_components[0]?.short_name;
  };

  const handleBackPress = useCallback(() => {
    localStorage.removeItem('hasSaved');
    navigation.goBack();
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

  let finalData = null;

  if (pageName == 'KnowYourPet') {
    const answerArray = params?.answerArray;
    const merged = params?.merged;

    consolepro.consolelog(answerArray, merged);

    const flattenedAnswers = Object.assign({}, ...answerArray);

    finalData = {
      ...merged,
      ...flattenedAnswers,
    };

    consolepro.consolelog(finalData, '<<Final Data');
  }

  const [GenderDetails, setGenderDetails] = useState([
    {label: ['Male', 'ذكر', '男'], value: 1},
    {label: ['Female', 'أنثى', '女'], value: 2},
    {label: ['Others', 'آخرون', '其他'], value: 3},
  ]);

  const RealtionData = [
    {label: ['Single', 'أعزب', '单身'], value: 1},
    {label: ['Married', 'متزوج', '已婚'], value: 2},
    {label: ['In a relationship', 'في علاقة', '恋爱中'], value: 3},
    {label: ['Divorce', 'مطلّق', '离婚'], value: 4},
  ];

  const handleGenderDetails = category => {
    setGender(category);
    setIsGenderModal(false);
    consolepro.consolelog(category, 'Gender');
    Keyboard.dismiss();
  };

  const handleRelationsipStatus = category => {
    setRelationshipStatus(category);
    setisRelationModal(false);
    Keyboard.dismiss();
  };

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

  // open media picker

  const openMediaPicker = async index => {
    setSelectedSlot(index);

    const selectedMedia = mediaItem[index];
    consolepro.consolelog(selectedMedia, '<< Selected Media');

    if (selectedMedia?.uri) {
      const mediaType = selectedMedia?.type === 2 ? 1 : 0;

      consolepro.consolelog(
        mediaType,
        selectedMedia.uri,
        index,
        '<<Media type',
      );

      // Optional: Close modal if it might still be open
      setMediamodal(false);

      setTimeout(() => {
        navigation.navigate('VideoPreview', {
          uri: selectedMedia.uri,
          index,
          type: mediaType,
          thumbnail: selectedMedia.thumbnail || '',
        });
      }, 300); // small delay to ensure navigation happens smoothly
    } else {
      consolepro.consolelog('Modal');
      setMediamodal(true);
    }
  };

  const handleMediaSelected = media => {
    consolepro.consolelog(media, '<<Handle media');
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
      consolepro.consolelog('opening camera');
      const obj = await mediaprovider.launchCamera();
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
      // console.log('Gallery result:', result);

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
      consolepro.consolelog(type, 'TYpe');

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

  // Remove media =====

  const removeMedia = index => {
    const updated = [...mediaItem];
    updated[index] = null;
    setMediaItem(updated);
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
            setVideoRecordingThumbnail(thumbnailResponse?.path);
            setVideoUri(data?.uri);
          })
          .catch(error => {
            consolepro.consolelog(error, 'THumbnail res');
          });
        setShowPreview(true);
      } catch (error) {
        console.log('Recording error:', error);
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

  const handleRecordedVideo = async media => {
    consolepro.consolelog(media, '<<Handle recorded video');
    const updatedItems = [...mediaItem];

    if (selectedSlot !== null) {
      updatedItems[selectedSlot] = media;
      setMediaItem(updatedItems);
    }

    setSelectedSlot(null);
    setMediamodal(false);
    consolepro.consolelog(media, '<<Recorded Media');
  };

  // handle continue =============>>

  const handleContinue = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_array');
      const userId = user_arr?.user_id;

      const allItemsEmpty = mediaItem.filter(item => item != null);
      consolepro.consolelog('All items =====>>', allItemsEmpty);
      if (allItemsEmpty?.length != 4) {
        msgProvider.toast(t('emptyImage_txt'), 'bottom');
        return false;
      }

      if (!name) {
        msgProvider.toast(t('emptyName'), 'bottom');
        return false;
      }

      if (name && name.trim().length <= 0) {
        msgProvider.toast(t('emptyName'), 'bottom');
        return false;
      }

      if (!gender) {
        msgProvider.toast(t('emptyGender'), 'bottom');
        return false;
      }

      if (!date) {
        msgProvider.toast(t('emptyDateOfBirth_txt'), 'bottom');
        return false;
      }

      if (!searchValue) {
        msgProvider.toast(t('emptyLocation'), 'bottom');
        return false;
      }

      if (searchValue && searchValue.trim().length <= 0) {
        msgProvider.toast(t('emptyLocation'), 'bottom');
        return false;
      }

      if (!latitude || !longitude || !address) {
        msgProvider.toast(t('please_select_a_valid_location_txt'), 'bottom');
        return false;
      }

      if (!whatDoYouDo) {
        msgProvider.toast(t('emptyWhatDoYouDo'), 'bottom');
        return false;
      }

      if (whatDoYouDo && whatDoYouDo.trim().length <= 0) {
        msgProvider.toast(t('emptyWhatDoYouDo'), 'bottom');
        return false;
      }

      if (!relationshipStatus) {
        msgProvider.toast(t('emptyRelationShipStatus'), 'bottom');
        return false;
      }

      const data = new FormData();
      data.append('user_id', userId);
      data.append('pet_type_id', petType);
      data.append('breed_id', breed);
      data.append('pet_gender', petGender);
      data.append('age_range', ageRange);
      data.append('note', note);
      data.append('name', name);
      data.append('gender', gender?.value);
      if (frontImage) {
        data.append('identity_front_image', {
          uri: frontImage,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      }

      if (backImage) {
        data.append('identity_back_image', {
          uri: backImage,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      }

      if (selfieImage) {
        data.append('selfie_image', {
          uri: selfieImage,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      }

      if (date) {
        const formattedDate = moment().format('YYYY-MM-DD');
        console.log(formattedDate, '<<Formatted DAte'); // e.g. "2025-04-09"
        data.append('dob', formattedDate);
      }

      data.append('location', address);
      data.append('latitude', latitude);
      data.append('longitude', longitude);
      data.append('occupation', whatDoYouDo);
      data.append('relationship_status', relationshipStatus?.value);

      consolepro.consolelog(mediaItem, '<<MEdia Item');
      for (let i = 0; i < mediaItem?.length; i++) {
        const item = mediaItem[i];
        if (!item) continue;

        if (item?.type === 2) {
          let videoUri = item?.uri;

          if (
            config.device_type === 'ios' &&
            videoUri.toLowerCase().endsWith('.mov')
          ) {
            try {
              const localPath = videoUri.startsWith('file://')
                ? videoUri.slice(7)
                : videoUri;
              const outputFileName = `${Date.now()}.mp4`;

              const convertedPath = await MovToMp4.convertMovToMp4(
                localPath,
                outputFileName,
              );
              console.log('Converted to MP4:', convertedPath);

              videoUri = `file://${convertedPath}`; // Important: re-add file://
            } catch (e) {
              console.log('MOV to MP4 conversion failed:', e);
              msgProvider.toast(t('unsupported_file_format_txt'), 'bottom');
              return false;
            }
          }

          data.append('videos', {
            uri: videoUri,
            type: 'video/mp4',
            name: 'video.mp4',
          });

          data.append('user_thumbnail', {
            uri: item.thumbnail,
            type: 'image/jpeg',
            name: 'image.jpg',
          });
        } else if (item?.type === 1) {
          data.append('images', {
            uri: item.uri,
            type: 'image/jpg',
            name: 'image.jpg',
          });
        }
      }

      for (let pair of data._parts) {
        console.log(pair[0], pair[1]);
      }

      const API_URL = config.baseURL + 'plan_new_pet';

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<REs');
            setTimeout(() => {
              localStorage.setItemObject('user_array', res?.userDataArray);
              localStorage.setItemString(
                'bring_type',
                String(res?.userDataArray?.bring_type),
              );
              setSharingModal(true);
            }, 500);

            setName(null);
            setSearchValue(null);
            setWhatDoYouDo(null);
            setGender(null);
            setDate(new Date());
            setRelationshipStatus(null);
            setMediaItem([null, null, null, null]);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
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
    } catch (error) {
      consolepro.consolelog(error, '<<Line 77');
    }
  };

  // For friendship ===============>>

  const handleContinueForFrienship = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_array');
      const userId = user_arr?.user_id;
      consolepro.consolelog('hellow friendship', mediaItem.length);

      const allItemsEmpty = mediaItem?.filter(item => item != null);
      if (allItemsEmpty?.length != 4) {
        msgProvider.toast(t('emptyImage_txt'), 'bottom');
        return false;
      }

      if (!name) {
        msgProvider.toast(t('emptyName'), 'bottom');
        return false;
      }

      if (name && name.trim().length <= 0) {
        msgProvider.toast(t('emptyName'), 'bottom');
        return false;
      }

      if (!gender) {
        msgProvider.toast(t('emptyGender'), 'bottom');
        return false;
      }

      if (!date) {
        msgProvider.toast(t('emptyDateOfBirth_txt'), 'bottom');
        return false;
      }

      if (!searchValue) {
        msgProvider.toast(t('emptyLocation'), 'bottom');
        return false;
      }

      if (searchValue && searchValue.trim().length <= 0) {
        msgProvider.toast(t('emptyLocation'), 'bottom');
        return false;
      }

      if (!latitude || !longitude || !address) {
        msgProvider.toast(t('please_select_a_valid_location_txt'), 'bottom');
        return false;
      }

      if (!whatDoYouDo) {
        msgProvider.toast(t('emptyWhatDoYouDo'), 'bottom');
        return false;
      }

      if (whatDoYouDo && whatDoYouDo.trim().length <= 0) {
        msgProvider.toast(t('emptyWhatDoYouDo'), 'bottom');
        return false;
      }

      if (!relationshipStatus) {
        msgProvider.toast(t('emptyRelationShipStatus'), 'bottom');
        return false;
      }

      const data = new FormData();

      data.append('user_id', userId);
      data.append('pet_name', finalData?.pet_name);
      data.append('pet_type_id', finalData?.pet_type);
      data.append('breed_id', finalData?.breed);
      data.append('pet_gender', finalData?.pet_gender);
      data.append('pet_dob', moment(finalData?.pet_dob).format('YYYY-MM-DD'));
      data.append('size_id', finalData?.size);

      console.log(finalData, 'URI');

      for (let i = 0; i < finalData?.image?.length; i++) {
        const item = finalData?.image[i];
        if (!item) continue;

        if (item?.type == 2) {
          let videoUri = item?.uri;

          if (
            config.device_type === 'ios' &&
            videoUri.toLowerCase().endsWith('.mov')
          ) {
            try {
              // Remove "file://" if present
              const localPath = videoUri.startsWith('file://')
                ? videoUri.slice(7)
                : videoUri;

              const outputFileName = `${Date.now()}.mp4`;
              const convertedPath = await MovToMp4.convertMovToMp4(
                localPath,
                outputFileName,
              );

              console.log('Converted pet video:', convertedPath);

              // Re-attach file:// if necessary for FormData
              videoUri = `file://${convertedPath}`;
            } catch (e) {
              console.log('MOV to MP4 conversion failed (pet video):', e);
              msgProvider.toast(t('unsupported_file_format_txt'), 'bottom');
              return false;
            }
          }

          // Append converted or original video
          data.append('pet_videos', {
            uri: videoUri,
            type: 'video/mp4',
            name: 'video.mp4',
          });

          // Append thumbnail
          data.append('pet_thumbnail', {
            uri: item?.thumbnail,
            type: 'image/jpg',
            name: 'image.jpg',
          });
        } else if (item?.type == 1) {
          console.log('pet images'); // fixed console typo
          data.append('pet_images', {
            uri: item?.uri,
            type: 'image/jpg',
            name: 'image.jpg',
          });
        }
      }

      data.append('vaccination_status', finalData?.isVaccinated);
      data.append('govt_registration_status', finalData?.governmentRegister);

      if (finalData?.type == 1) {
        data.append('pet_registration_like_status', finalData?.register);
        data.append('friendly', finalData?.friendly);
        data.append('active', finalData?.active);
        data.append('aggressive', finalData?.aggressive);
        data.append('bark', finalData?.bark);
        data.append('doesnot_bark', finalData?.doesnot_bark);
        data.append('following_you', finalData?.following_you);
        data.append('kisser', finalData?.kisser);
        data.append('love_licking', finalData?.love_licking);
        data.append('guard', finalData?.guard);
        data.append('lazy', finalData?.lazy);
        data.append('napper', finalData?.napper);
        data.append('love_seeker', finalData?.love_seeker);
      }

      data.append('answer_1', finalData?.answer_1);
      data.append('answer_2', finalData?.answer_2);
      data.append('answer_3', finalData?.answer_3);
      data.append('answer_4', finalData?.answer_4);
      data.append('answer_5', finalData?.answer_5);

      data.append('name', name);
      data.append('gender', gender?.value);
      data.append('dob', moment(date).format('YYYY-MM-DD'));
      data.append('location', address);
      data.append('latitude', latitude);
      data.append('longitude', longitude);
      data.append('occupation', whatDoYouDo);
      data.append('relationship_status', relationshipStatus?.value);

      if (finalData?.frontImage) {
        data.append('identity_front_image', {
          uri: finalData?.frontImage,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      }

      if (finalData?.backImage) {
        data.append('identity_back_image', {
          uri: finalData?.backImage,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      }

      if (finalData?.selfieImage) {
        data.append('selfie_image', {
          uri: finalData?.selfieImage,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      }

      for (let i = 0; i < mediaItem.length; i++) {
        const item = mediaItem[i];
        if (!item) continue;

        if (item?.type === 2) {
          let videoUri = item.uri;

          if (
            config.device_type === 'ios' &&
            videoUri.toLowerCase().endsWith('.mov')
          ) {
            try {
              const localPath = videoUri.startsWith('file://')
                ? videoUri.slice(7)
                : videoUri;
              const outputFileName = `${Date.now()}.mp4`;

              const convertedPath = await MovToMp4.convertMovToMp4(
                localPath,
                outputFileName,
              );
              console.log('Converted user video:', convertedPath);

              videoUri = `file://${convertedPath}`;
            } catch (e) {
              console.error('MOV to MP4 conversion failed (user video):', e);
              msgProvider.toast(t('unsupported_file_format_txt'), 'bottom');
              return false;
            }
          }

          data.append('videos', {
            uri: videoUri,
            type: 'video/mp4',
            name: 'video.mp4',
          });

          if (item?.thumbnail) {
            data.append('user_thumbnail', {
              uri: item.thumbnail,
              type: 'image/jpg',
              name: 'image.jpg',
            });
          }
        } else if (item?.type === 1) {
          data.append('user_images', {
            uri: item.uri,
            type: 'image/jpg',
            name: 'image.jpg',
          });
        }
      }

      data._parts.forEach(([key, value]) => {
        if (typeof value === 'object' && value?.uri) {
          console.log(`${key}:`, JSON.stringify(value, null, 2));
        } else {
          console.log(`${key}:`, value);
        }
      });

      const API_URL = config.baseURL + 'pet_friendship';

      consolepro.consolelog('DATA=======>>', data);

      // return false;

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              localStorage.setItemObject('user_array', res?.userDataArray);
              localStorage.setItemString(
                'bring_type',
                String(res?.userDataArray?.bring_type),
              );

              navigation.navigate('AllowLocation');
            }, 700);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
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

  consolepro.consolelog('Search Values====>>>', searchValue);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        <View
          style={{
            marginHorizontal: (mobileW * 5) / 100,
            marginTop: (mobileW * 5) / 100,
            flex: 1,
          }}>
          {/* back */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.goBack();
              setName(null);
              setLocation(null);
              setWhatDoYouDo(null);
              localStorage.removeItem('hasSaved');
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
            extraScrollHeight={Platform.OS === 'android' ? 200 : 0}
            enableOnAndroid={true}
            contentContainerStyle={{
              paddingBottom: (mobileW * 25) / 100,
              flexGrow: 1,
            }}>
            {/* header content */}

            <View style={{marginTop: (mobileW * 2) / 100}}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 6.5) / 100,
                }}>
                {t('add_litle_about_you_txt')}
              </Text>
              <Text
                style={{
                  color: Colors.themeColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 4) / 100,
                }}>
                {t('you_add_your_details_txt')}
              </Text>
            </View>

            {/* add users photo */}

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
                            : localimag.icon_add_user
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
            {/* input fields */}

            <View>
              <InputField
                title={t('your_name_txt')}
                titleStyles={{color: Colors.themeColor2}}
                inputStyle={{
                  borderColor: Colors.themeColor2,
                  borderWidth: (mobileW * 0.3) / 100,
                }}
                placeholderText={t('enter_your_name_txt')}
                keyboardType={'dafault'}
                containerStyle={{
                  marginTop: (mobileW * 1) / 100,
                }}
                maxLength={50}
                value={name}
                setValue={setName}
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
                value={gender?.label?.[config.language]}
                onPress={() => setIsGenderModal(true)}
                onIconPress={() => setIsGenderModal(true)}
              />

              <InputWithIcon
                title={t('DOB_txt')}
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={t('enter_date_of_bith_txt')}
                iconSource={localimag.icon_calendar}
                iconStyle={{
                  with: (mobileW * 5) / 100,
                  height: (mobileW * 5) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
                value={date ? moment(date).format('DD-MM-YYYY') : ''}
                onPress={() => setIsDatePicker(true)}
                onIconPress={() => setIsDatePicker(true)}
              />

              {/* <InputField
              title={t('location_txt')}
              titleStyles={{color: Colors.themeColor2}}
              inputStyle={{
                borderColor: Colors.themeColor2,
                borderWidth: (mobileW * 0.3) / 100,
              }}
              placeholderText={t('enter_your_location_txt')}
              containerStyle={{
                marginTop: (mobileW * 1) / 100,
              }}
              keyboardType={'dafault'}
              maxLength={50}
              value={location}
              setValue={setLocation}
            /> */}

              <View
                style={{
                  flex: 1,
                  // paddingHorizontal: (mobileW * 2) / 100,
                  paddingVertical: (mobileW * 3) / 100,
                }}>
                <View>
                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontSize: (mobileW * 3.5) / 100,
                      fontFamily: Font.FontMedium,
                    }}>
                    {t('location_txt')}
                  </Text>
                </View>
                <GooglePlacesAutocomplete
                  placeholder={t('enter_your_location_txt')}
                  textInputProps={{
                    placeholderTextColor: Colors.placeholderTextColor,
                    onChangeText: text => setSearchValue(text),
                    value: searchValue,
                  }}
                  minLength={1}
                  autoFocus={false}
                  returnKeyType={'search'}
                  listViewDisplayed={addressbar2}
                  fetchDetails={true}
                  ref={GooglePlacesRef}
                  renderDescription={row => row?.description}
                  onPress={onPlacePress}
                  query={{
                    key: config.mapkey,
                    language: config.maplanguage,
                  }}
                  styles={{
                    description: {color: Colors?.themeColor2},
                    textInputContainer: {
                      backgroundColor: Colors.whiteColor,
                      marginTop: (mobileW * 2) / 100,
                      alignSelf: 'center',
                      height: (mobileH * 6) / 100,
                      alignItems: 'center',
                      borderRadius: (mobileW * 2) / 100,
                      borderWidth: 1,
                      borderColor: Colors.themeColor2,
                      width: (mobileW * 90) / 100,
                      paddingHorizontal: (mobileW * 2) / 100,
                    },
                    textInput: {
                      width: (mobileW * 90) / 100,
                      backgroundColor: Colors.whiteColor,
                      height: (mobileH * 5) / 100,
                      borderRadius: (mobileW * 2) / 100,
                      color: Colors.themeColor2,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3.5) / 100,
                      top: (mobileW * 1) / 100,
                      textAlign: config.language == 1 ? 'right' : 'left',
                    },
                    predefinedPlacesDescription: {
                      color: '#1faadb',
                    },
                    container: {
                      borderRadius: 10,
                    },
                    listView: {
                      backgroundColor: 'pink',
                      marginTop: (mobileW * 3) / 100,
                      borderWidth: 1,
                      boderColor: 'black',
                    },
                  }}
                  onFail={error =>
                    console.log('GooglePlaces error:======>>', error)
                  }
                  onNotFound={() => console.log('No results found')}
                  currentLocation={false}
                  currentLocationLabel="Current location"
                  nearbyPlacesAPI="GooglePlacesSearch"
                  GoogleReverseGeocodingQuery={{}}
                  GooglePlacesSearchQuery={{
                    rankby: 'distance',
                    types: 'food',
                  }}
                  filterReverseGeocodingByTypes={[
                    'locality',
                    'administrative_area_level_3',
                    'postal_code',
                    'sublocality',
                    'country',
                  ]}
                  debounce={100}
                  renderRightButton={() => (
                    <TouchableOpacity
                      style={{alignSelf: 'center', paddingRight: 10}}
                      onPress={() => {
                        GooglePlacesRef?.current?.setAddressText('');
                        setAddressSelected('Search');
                        setSearchValue('');
                        setAddress(null);
                        setLatitude(null);
                        setLongitude(null);
                      }}>
                      {Platform.OS === 'android' && (
                        <Image
                          source={
                            searchValue
                              ? localimag.icon_cross
                              : localimag?.icon_search
                          }
                          style={{
                            width: searchValue
                              ? (mobileW * 3.5) / 100
                              : (mobileW * 4) / 100,
                            height: searchValue
                              ? (mobileW * 3.5) / 100
                              : (mobileW * 4) / 100,
                            resizeMode: 'contain',
                            tintColor: Colors.themeColor2,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>

              <InputField
                title={t('what_do_you_do_txt')}
                titleStyles={{color: Colors.themeColor2}}
                inputStyle={{
                  borderColor: Colors.themeColor2,
                  borderWidth: (mobileW * 0.3) / 100,
                }}
                containerStyle={{
                  marginTop: (mobileW * 1) / 100,
                }}
                placeholderText={t('enter_what_do_you_do_txt')}
                keyboardType={'dafault'}
                maxLength={50}
                value={whatDoYouDo}
                setValue={setWhatDoYouDo}
              />

              <InputWithIcon
                title={t('relationship_status_txt')}
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={t('select_relationship_status_txt')}
                iconSource={localimag.icon_down}
                iconStyle={{
                  with: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
                value={relationshipStatus?.label?.[config.language]}
                onPress={() => setisRelationModal(true)}
                onIconPress={() => setisRelationModal(true)}
              />

              <CommonButton
                title={t('continue_txt')}
                containerStyle={{
                  backgroundColor: Colors.themeColor2,
                  marginTop: (mobileW * 4) / 100,
                  // marginBottom: (mobileH * 6) / 100,
                }}
                onPress={() => {
                  if (pageName == 'KnowYourPet') {
                    handleContinueForFrienship();
                  } else if (pageName == 'PlanAPet') {
                    handleContinue();
                  } else {
                    msgProvider.alert(
                      t('information_txt'),
                      'Something went wrong!',
                      false,
                    );
                    return false;
                  }
                }}
              />
            </View>
          </KeyboardAwareScrollView>

          {/* date picker */}
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

          {/* gender modal */}
          {/* <SelectGenderModal
 visible={isGenderModal}
 setModalStatus={() => setIsGenderModal(false)}
 onPress={() => setIsGenderModal(false)}
 /> */}
        </View>

        {/* gender dropdown modal */}

        <Modal transparent={true} visible={isGenderModal} animationType="fade">
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

        {/* relationship dropdown modal */}
        <Modal
          transparent={true}
          visible={isRelationModal}
          animationType="fade">
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setisRelationModal(false)}>
            <View style={styles.dropdown}>
              <FlatList
                data={RealtionData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      index === RealtionData.length - 1 && styles.lastOption,
                    ]}
                    onPress={() => handleRelationsipStatus(item)}>
                    <Text style={styles.optionText}>
                      {item?.label?.[config.language]}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* thanks sharing modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={sharingModal}
          requestClose={() => {
            setTimeout(() => {
              setSharingModal(false);
              // pageName !== 'KnowYourPet' &&
              //   localStorage.setItemString('bring_type', 0);
              navigation.replace('FriendshipHome');
            }, 700);
          }}>
          <TouchableOpacity
            onPress={() => {
              setTimeout(() => {
                setSharingModal(false);
                // pageName !== 'KnowYourPet' &&
                //   localStorage.setItemString('bring_type', 0);
                navigation.replace('FriendshipHome');
              }, 700);
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
                  marginTop: (mobileH * 2) / 100,
                }}>
                {t('thanks_for_sharing_txt')}
              </Text>
              <Text
                style={{
                  width: (mobileW * 55) / 100,
                  color: Colors.ColorBlack,
                  fontSize: (mobileW * 3) / 100,
                  fontFamily: Font.FontRegular,
                  textAlign: 'center',
                }}>
                {t('your_pet_profile_ready_to_explore_txt')}
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
                    setTimeout(() => {
                      setSharingModal(false);
                      // pageName !== 'KnowYourPet' &&
                      //   localStorage.setItemString('bring_type', 0);
                      navigation.replace('FriendshipHome');
                    }, 700);
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
                    // navigation.navigate('VideoRecordingScreen', {
                    // index: selectedSlot,
                    // pageType: 2,
                    // });

                    setVideoRecordingModal(true);
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
                  {t('cancelmedia')}
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
                        return false;
                      }
                      handleRecordedVideo({
                        uri: videoUri,
                        type: 2,
                        thumbnail: videoRecordingthumbnail,
                      });

                      setTimeout(() => {
                        setVideoRecordingModal(false);
                      }, 200);
                    } catch (error) {
                      consolepro.consolelog(error, '<<ERror');
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
                    // bottom: (mobileW * 13) / 100,
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

export default AddUserDetails;

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
