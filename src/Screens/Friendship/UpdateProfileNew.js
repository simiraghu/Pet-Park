import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
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
import React, {useCallback, useEffect, useState} from 'react';
import {Colors, Font} from '../../Provider/Colorsfont';
import {localimag} from '../../Provider/Localimage';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  config,
  consolepro,
  Lang_chg,
  mobileH,
  mobileW,
  localStorage,
  apifuntion,
  mediaprovider,
  msgProvider,
} from '../../Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import * as Progress from 'react-native-progress';
import InputField from '../../Components/InputField';
import CommonButton from '../../Components/CommonButton';
import CommonModal from '../../Components/CommonModal';
import {useTranslation} from 'react-i18next';
import {showEditor} from 'react-native-video-trim';
import Video from 'react-native-video';
import {createThumbnail} from 'react-native-create-thumbnail';
import MovToMp4 from 'react-native-mov-to-mp4';
import RNFS from 'react-native-fs';
import {SafeAreaView} from 'react-native-safe-area-context';

const UpdateProfileNew = ({navigation}) => {
  const {goBack, navigate} = useNavigation();
  const {t} = useTranslation();
  const {params} = useRoute();

  const [userImages, setUserImages] = useState([
    {
      id: 1,
      image: require('../../Icons/icon_artBoard_13.png'),
    },
    {
      id: 2,
      image: require('../../Icons/icon_artBoard_13.png'),
    },
    {
      id: 3,
      image: require('../../Icons/icon_artBoard_13.png'),
    },
    {
      id: 4,
      image: require('../../Icons/icon_artBoard_13.png'),
    },
  ]);

  const [dogImages, setDogImages] = useState([
    {
      id: 1,
      image: require('../../Icons/1.png'),
    },
    {
      id: 2,
      image: require('../../Icons/2.png'),
    },
    {
      id: 3,
      image: require('../../Icons/3.png'),
    },
    {
      id: 4,
      image: require('../../Icons/3.png'),
    },
  ]);

  const [natureData, setNatureData] = useState([
    {
      id: 1,
      nature: ['Friendly', 'ودود', '友好'],
      key: 'friendly',
    },
    {
      id: 2,
      nature: ['Active', 'نشيط', '活跃'],
      key: 'active',
    },
    {
      id: 3,
      nature: ['Aggressive', 'عدواني', '好斗的'],
      key: 'aggressive',
    },
    {
      id: 4,
      nature: ['Bark A Lot', 'ينبح كثيرا', '经常吠叫'],
      key: 'bark',
    },
    {
      id: 5,
      nature: ["Doesn't Bark", 'لا ينبح', '不吠叫'],
      key: 'doesnot_bark',
    },
    {
      id: 6,
      nature: ['Following You', 'يتبعك', '跟着你'],
      key: 'following_you',
    },
    {
      id: 7,
      nature: ['Kisser', 'يحب التقبيل', '亲吻者'],
      key: 'kisser',
    },
    {
      id: 8,
      nature: ['Love Licking', 'يحب اللعق', '喜欢舔'],
      key: 'love_licking',
    },
    {
      id: 9,
      nature: ['Guard', 'حارس', '守卫'],
      key: 'guard',
    },
    {
      id: 10,
      nature: ['Lazy', 'كسول', '懒惰'],
      key: 'lazy',
    },
    {
      id: 11,
      nature: ['Napper', 'يأخذ قيلولة', '打盹者'],
      key: 'napper',
    },
    {
      id: 12,
      nature: ['Love Seeker', 'باحث عن الحب', '寻爱者'],
      key: 'love_seeker',
    },
  ]);

  const [sliderValues, setSliderValues] = useState(
    natureData.reduce((acc, item) => {
      acc[item.key] = 0; // Initialize with 0 for each item's key
      return acc;
    }, {}),
  );

  const handleSliderChange = (values, key) => {
    setSliderValues(prev => ({
      ...prev,
      [key]: values[0], // Update the slider value using the key
    }));
  };

  const getSliderValuesByKey = () => {
    const result = {};

    natureData.forEach(item => {
      result[item.key] = sliderValues[item.key] ?? 0;
    });

    return result;
  };

  const [userDetails, setUserDetails] = useState(null);
  const [removedImages, setRemovedImages] = useState([]);
  const [removePetImagesID, setRmovedPetImagesID] = useState([]);
  const [isVaccinated, setIsVaccinated] = useState(null);
  const [governmentRegister, setGovernmentRegister] = useState(null);
  const [register, setRegister] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [pet_name, setPet_name] = useState(null);
  const [pet_age, setPet_age] = useState(null);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [mediamodal, setMediamodal] = useState(false);
  const [isAbout_editable, setIsAbout_editable] = useState(false);
  const [petMediaModal, setPetMediaModal] = useState(false);
  const [petNameEditable, setPetNameEditable] = useState(false);
  const [petAgeEditable, setPetAgeEditable] = useState(false);

  const [mediaItem, setMediaItem] = useState([null, null, null, null]);
  const [petMediaItem, setPetMediaItem] = useState([null, null, null, null]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [petSelectedSlot, setPetSelectedSlot] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [question_1, setQuestion_1] = useState(null);
  const [question_2, setQuestion_2] = useState(null);
  const [question_3, setQuestion_3] = useState(null);
  const [question_4, setQuestion_4] = useState(null);
  const [question_5, setQuestion_5] = useState(null);

  const [isAnswer_1_editable, setIsAnswer_1_editable] = useState(false);
  const [isAnswer_2_editable, setIsAnswer_2_editable] = useState(false);
  const [isAnswer_3_editable, setIsAnswer_3_editable] = useState(false);
  const [isAnswer_4_editable, setIsAnswer_4_editable] = useState(false);
  const [isAnswer_5_editable, setIsAnswer_5_editable] = useState(false);

  const [isUserProfileEdit, setIsUserProfileEdit] = useState(false);
  const [user_profile, setUser_profile] = useState(null);
  const [identityFront, setIdentityFront] = useState(null);
  const [identityBack, setIdentityBack] = useState(null);
  const [selfieImage, setSelfie_image] = useState(null);
  const [identityFrontAPI, setIdentityFrontAPI] = useState(null);
  const [identityBackAPI, setIdentityBackAPI] = useState(null);
  const [selfieImageAPI, setSelfie_imageAPI] = useState(null);
  const [isIdentityFrontModal, setIsIdentityFrontModal] = useState(false);
  const [cameraImageType, setcameraImageType] = useState(null);
  const [isidentityRemoveSelfie, setIsidentityRemoveSelfie] = useState(false);
  const [isidentityRemoveFrontImage, setIsidentityRemoveFrontImage] =
    useState(false);
  const [isidentityRemoveBackImage, setIsidentityRemoveBackImage] =
    useState(false);
  const [occupation, setOccupation] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [isOccupationEdit, setIsOccupationEdit] = useState(false);
  const [isRelationModal, setisRelationModal] = useState(false);

  const images = userDetails?.user_images || [];
  const maxImages = 4;

  const filledSlots = [...images];

  // Fill with placeholders for remaining slots =========>>

  while (filledSlots.length < maxImages) {
    filledSlots.push({isAddButton: true});
  }

  const petImages = userDetails?.pet_images || [];
  const maxPetImages = 4;
  const filledPetImagesSlots = [...petImages];

  while (filledPetImagesSlots.length < maxPetImages) {
    filledPetImagesSlots.push({isAddButton: true});
  }

  const RelationData = [
    {label: ['Single', 'أعزب', '单身'], value: 1},
    {label: ['Married', 'متزوج', '已婚'], value: 2},
    {label: ['In a relationship', 'في علاقة', '恋爱中'], value: 3},
    {label: ['Divorce', 'مطلّق', '离婚'], value: 4},
  ];

  const handleRelationsipStatus = category => {
    consolepro.consolelog('<<Category======>>', category);
    setMaritalStatus(category?.value);
    setisRelationModal(false);
    Keyboard.dismiss();
  };

  consolepro.consolelog('Marital Status======>>', maritalStatus);

  // handle remove images =========>>>

  const handleRemoveImage = index => {
    const currentImages = userDetails?.user_images || [];
    consolepro.consolelog(currentImages, '<<Current Images');

    const updatedImages = [...currentImages];
    const removedImage = updatedImages[index];
    consolepro.consolelog(removedImage, '<<Remove image');

    // If the removed image is an API image, store its ID
    if (removedImage?.user_image_id) {
      setRemovedImages(prev => [...prev, removedImage.user_image_id]);
    }

    // Replace the removed image with { isAddButton: true } to maintain array structure
    updatedImages[index] = {isAddButton: true};

    // Update userDetails with the new array
    setUserDetails(prev => ({
      ...(prev || {}),
      user_images: updatedImages,
    }));
  };

  // Get User Details =============>>

  const getUserDetails = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL = config.baseURL + 'get_user_profile?user_id=' + userId;

      apifuntion
        .getApi(API_URL, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setUserDetails(res?.user_details);
            setAnswer(res?.user_details?.about);
            setQuestion_1(res?.user_details?.answer_1);
            setQuestion_2(res?.user_details?.answer_2);
            setQuestion_3(res?.user_details?.answer_3);
            setQuestion_4(res?.user_details?.answer_4);
            setQuestion_5(res?.user_details?.answer_5);
            setIsVaccinated(res.user_details?.vaccination_status);
            setGovernmentRegister(res?.user_details?.govt_registration_status);
            if (res?.user_details?.pet_registration_like_status == 0) {
              setRegister(2);
            } else {
              setRegister(res?.user_details?.pet_registration_like_status);
            }
            setPet_name(res?.user_details.pet_name);
            setPet_age(res?.user_details?.pet_age);
            if (res?.user_details?.identity_front_image) {
              setIdentityFrontAPI(res?.user_details?.identity_front_image);
            }

            if (res?.user_details?.identity_back_image) {
              setIdentityBackAPI(res?.user_details?.identity_back_image);
            }

            if (res?.user_details?.selfie_image) {
              setSelfie_imageAPI(res?.user_details?.selfie_image);
            }

            setOccupation(res?.user_details?.occupation || '');
            setMaritalStatus(res?.user_details?.relationship_status || '');
          } else {
            if (res?.active_flag == 0) {
              consolepro.consolelog(res, '<<RES');
              localStorage.clear();
              navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res);
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<ERRR');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  useEffect(() => {
    if (userDetails) {
      const petNatureKeys = natureData.map(n => n?.key); // Extract all static keys

      let mappedSliderValues = {};
      petNatureKeys.forEach(key => {
        if (userDetails.hasOwnProperty(key)) {
          mappedSliderValues[key] = Number(userDetails[key]);
        } else {
          mappedSliderValues[key] = 0;
        }
      });

      setSliderValues(mappedSliderValues); // Set the values for the sliders
    }
  }, [userDetails]);

  useEffect(() => {
    getUserDetails();
  }, []);

  // Handle Open Setting ========>>>

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

  // Camera Open ===========>>>>

  const isVideo = uri => {
    return (
      uri &&
      (uri.endsWith('.mp4') || uri.endsWith('.mov') || uri.endsWith('.avi'))
    );
  };

  const isImage = uri => {
    return (
      uri &&
      (uri.endsWith('.jpg') || uri.endsWith('.jpeg') || uri.endsWith('.png'))
    );
  };

  const video = params?.videoUri;
  const petvideoUri = params?.petvideoUri;
  const index = params?.index;
  const petIndex = params?.petIndex;
  const user_thumbnail = params?.user_thumbnail;
  const pet_thumbnail = params?.pet_thumbnail;

  // open media picker =======>>

  const openMediaPicker = async index => {
    consolepro.consolelog(index, '<<IN');
    setSelectedSlot(index);

    const selectedMedia = mediaItem[index];
    const userImage = userDetails?.user_images?.[index];

    consolepro.consolelog(selectedMedia, '<<MEDIA');

    let uri = '';
    let type = 0; // default to image
    let thumbnail = '';

    const hasValidMedia =
      (selectedMedia?.uri && selectedMedia?.uri !== '') ||
      (userImage?.image && userImage?.image !== '');

    if (hasValidMedia) {
      if (selectedMedia?.uri) {
        uri = selectedMedia.uri;
        type = selectedMedia.type; // 0 for image, 2 for video
        thumbnail = selectedMedia.thumbnail || '';
      } else if (userImage?.image) {
        uri = config.img_url + userImage.image;
        type = isVideo(uri) ? 2 : 0;
      }

      console.log(type, uri, index, '<<Media type');

      navigation.navigate('VideoPreview', {
        uri,
        index,
        type: isVideo(uri) ? 1 : 0,
        thumbnail,
      });
    } else {
      consolepro.consolelog('Opening Media Modal...');
      setMediamodal(true);
    }
  };

  // For Video ================

  useFocusEffect(
    useCallback(() => {
      // Assuming video or images are being selected from the camera/gallery
      if (video && index !== undefined && index !== null) {
        consolepro.consolelog(video, '<<INVE');
        setMediaItem(prevItems => {
          const updatedItems = [...prevItems];
          updatedItems[index] = {
            uri: video,
            type: 2,
            thumbnail: user_thumbnail,
          }; // Set the selected video/image at the specified index
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

  // User Profile Edit

  const Camerapopen = async () => {
    try {
      await mediaprovider
        .launchCamera()
        .then(res => {
          setUser_profile(res?.path);
          setIsUserProfileEdit(false);
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
          setUser_profile(res?.path);
          setIsUserProfileEdit(false);
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
      if (error?.message?.includes('permission')) openSettings();
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
          .then(thumnailResponce => {
            consolepro.consolelog(thumnailResponce, '<<Thumbnail ');

            handleMediaSelected({
              uri: res?.path,
              type: type,
              thumbnail: thumnailResponce?.path,
            });
          })
          .catch(error => {
            consolepro.consolelog(error, '<<error');
          });
      }, 800);
    } catch (error) {
      setMediamodal(false);
    }
  };

  // handle remove images pet  =========>>>

  const handlePetImageRemove = index => {
    const currentImages = userDetails?.pet_images || [];
    consolepro.consolelog(currentImages, '<<Current Images');

    const updatedImages = [...currentImages];
    const removedImage = updatedImages[index];
    consolepro.consolelog(removedImage, '<<Remove image');

    // If the removed image is an API image, store its ID
    if (removedImage?.pet_image_id) {
      setRmovedPetImagesID(prev => [...prev, removedImage.pet_image_id]);
    }

    // Replace the removed image with { isAddButton: true } to maintain array structure
    updatedImages[index] = {isAddButton: true};

    // Update userDetails with the new array
    setUserDetails(prev => ({
      ...(prev || {}),
      pet_images: updatedImages,
    }));
  };

  const removePetImages = index => {
    const updated = [...petMediaItem];
    updated[index] = null;
    setPetMediaItem(updated);
  };

  // Optional: Remove from a specific slot

  const removeMedia = index => {
    const updated = [...mediaItem];
    updated[index] = null;
    setMediaItem(updated);
  };

  // For Pet Media ==========>>>

  const openPetMediaPicker = async index => {
    consolepro.consolelog(index, '<< IN');
    setPetSelectedSlot(index);

    const selectedPetMedia = petMediaItem[index];
    const petImageFromUser = userDetails?.pet_images?.[index];

    consolepro.consolelog(selectedPetMedia, '<< Pet Media');

    let uri = '';
    let type = 0; // default to image

    const hasValidMedia =
      (selectedPetMedia?.uri && selectedPetMedia?.uri !== '') ||
      (petImageFromUser?.image && petImageFromUser?.image !== '');

    if (hasValidMedia) {
      if (selectedPetMedia?.uri) {
        uri = selectedPetMedia.uri;
        type = selectedPetMedia.type ?? (isVideo(uri) ? 1 : 0);
      } else if (petImageFromUser?.image) {
        uri = config.img_url + petImageFromUser.image;
        type = isVideo(uri) ? 1 : 0;
      }

      consolepro.consolelog(type, uri, index, '< Pet < Media type');

      navigation.navigate('VideoPreview', {
        uri,
        index,
        type: isVideo(uri) ? 1 : 0,
      });
    } else {
      // Open media selection modal if no valid media
      consolepro.consolelog('Opening Pet Media Modal');
      setPetMediaModal(true);
    }
  };

  const handlePetMediaSelection = media => {
    const updatedItems = [...petMediaItem];
    if (petSelectedSlot !== null) {
      updatedItems[petSelectedSlot] = media;
      setPetMediaItem(updatedItems);
    }
    setPetSelectedSlot(null);
    setPetMediaModal(false);
    consolepro.consolelog(media, '<<Media');
  };

  const petOpenCamera = async ({type}) => {
    try {
      const obj = await mediaprovider.launchCamera(); // returns file:// path
      console.log('Camera Image Path:', obj);

      handlePetMediaSelection({uri: obj?.path, type: type, thumbnail: ''});
    } catch (error) {
      setPetMediaModal(false);
      if (error?.toString().toLowerCase().includes('permission')) {
        openSettings();
      }
    }
  };

  const petOpenGallery = async ({type}) => {
    try {
      const result = await mediaprovider.launchGellery();
      console.log('Gallery result:', result);

      // Handle both single and multiple selection results
      const selectedImages = Array.isArray(result) ? result : [result];

      if (selectedImages.length > 0) {
        const image = selectedImages[0]; // file:// path
        console.log('Gallery Image Path:', image?.path);

        handlePetMediaSelection({uri: image?.path, type: type, thumbnail: ''});
      }
    } catch (error) {
      setPetMediaModal(false);
      if (error.message?.includes('permission')) openSettings();
    }
  };

  const petOpenGalleryVideo = async ({type}) => {
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
          .then(thumnailResponce => {
            consolepro.consolelog(thumnailResponce, '<<Thumbnail ');
            handlePetMediaSelection({
              uri: res?.path,
              type: type,
              thumbnail: thumnailResponce?.path,
            });
          })
          .catch(error => {
            consolepro.consolelog(error, '<<error');
          });
      }, 800);
    } catch (error) {
      setPetMediaModal(false);
      if (error?.toString().toLowerCase().includes('permission')) {
        openSettings();
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Assuming video or images are being selected from the camera/gallery
      if (petvideoUri && petIndex !== undefined && petIndex !== null) {
        setPetMediaItem(prevItems => {
          const updatedItems = [...prevItems];
          updatedItems[petIndex] = {
            uri: petvideoUri,
            type: 2,
            thumbnail: pet_thumbnail,
          }; // Set the selected video/image at the specified index
          return updatedItems;
        });

        // Reset the params in navigation
        navigation.setParams({
          petvideoUri: null,
          petIndex: null,
        });
      }
    }, [petvideoUri, petIndex]),
  );

  const IdentityCamerapopen = async () => {
    try {
      await mediaprovider
        .launchCamera()
        .then(res => {
          consolepro.consolelog('RES Camera ======>>', res?.path);
          if (cameraImageType == 0) {
            setIdentityFront(res?.path);
            setIsIdentityFrontModal(false);
            setIsidentityRemoveSelfie(false);
          } else if (cameraImageType == 1) {
            setIdentityBack(res?.path);
            setIsIdentityFrontModal(false);
            setIsidentityRemoveSelfie(false);
          } else if (cameraImageType == 2) {
            setSelfie_image(res?.path);
            setIsIdentityFrontModal(false);
            setIsidentityRemoveSelfie(false);
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

  const IdentityGalleryopen = async () => {
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
          if (cameraImageType == 0) {
            setIdentityFront(res?.path);
            setIsIdentityFrontModal(false);
          } else if (cameraImageType == 1) {
            setIdentityBack(res?.path);
            setIsIdentityFrontModal(false);
          } else if (cameraImageType == 2) {
            setSelfie_image(res?.path);
            setIsIdentityFrontModal(false);
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

  // handle updation ==============>>

  consolepro.consolelog(mediaItem, '<<Media Item ========>>');

  const handleUpdate = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const mediaItemReal =
        mediaItem?.filter(item => item != null && item?.isAddButton !== true) ||
        [];

      const apiUserImagesReal =
        userDetails?.user_images?.filter(item => item?.isAddButton !== true) ||
        [];

      const totalRealMediaCount =
        mediaItemReal.length + apiUserImagesReal.length;

      if (totalRealMediaCount < 4) {
        msgProvider.toast(
          t('please_add_your_four_image_or_four_video_txt'),
          'bottom',
        );
        return false;
      }

      if (!answer) {
        msgProvider.toast(t('emptyAbout_txt'), 'bottom');
        return false;
      }

      // if (!pet_name) {
      //   msgProvider.toast(t('emptyPetName'), 'bottom');
      //   return false;
      // }

      // if (!pet_age) {
      //   msgProvider.toast(t('emptyPetAge_txt'), 'bottom');
      //   return false;
      // }

      // if (!pet_age) {
      //   msgProvider.toast(t('emptyPetAge_txt'), 'bottom');
      //   return false;
      // }

      const petMediaItemReal =
        petMediaItem?.filter(
          item => item != null && item?.isAddButton !== true,
        ) || [];

      const apiPetImagesReal =
        userDetails?.pet_images?.filter(item => item?.isAddButton !== true) ||
        [];

      const totalRealPetMediaCount =
        petMediaItemReal.length + apiPetImagesReal.length;

      if (totalRealPetMediaCount < 4) {
        msgProvider.toast(t('please_add_your_pet_four_image_txt'), 'bottom');
        return false;
      }

      if (sliderValues) {
        const valuesGreaterThanZero = Object.values(sliderValues).filter(
          value => value > 0,
        ).length;

        if (valuesGreaterThanZero < 3) {
          msgProvider.toast(t('emptyPetNatureValues_txt'), 'bottom');
          return false;
        }
      }

      const answers = [
        question_1,
        question_2,
        question_3,
        question_4,
        question_5,
      ];

      // Filter out null or empty answers
      const nonEmptyAnswers = answers.filter(
        answer => answer !== null && answer !== '',
      );

      if (nonEmptyAnswers.length < 3) {
        msgProvider.toast(t('please_answer_any_three_txt'), 'bottom');
        return false;
      }

      // if (!identityFrontAPI && !identityFront) {
      //   msgProvider.toast(t('emptyFrontImage_txt'), 'bottom');
      //   return false;
      // }

      // if (!identityBackAPI && !identityBack) {
      //   msgProvider.toast(t('emptyBackImage_txt'), 'bottom');
      //   return false;
      // }

      // if (!selfieImageAPI && !selfieImage) {
      //   msgProvider.toast(t('emptySelfieImage_txt'), 'bottom');
      //   return false;
      // }

      consolepro.consolelog('gallery data  => ', mediaItem);

      // return false;

      const data = new FormData();
      data.append('user_id', userId);
      data.append('about', answer);
      data.append('user_image_id', String(removedImages));
      // data.append('user_image_id', String(64));
      // data.append('pet_name', pet_name);
      // data.append('age', pet_age);
      data.append('pet_image_id', String(removePetImagesID));
      // data.append('pet_image_id', String(18));

      for (let i = 0; i < mediaItem.length; i++) {
        const item = mediaItem[i];
        if (!item) continue;

        if (item?.type === 2) {
          let videoUri = item?.uri;

          if (
            config.device_type === 'ios' &&
            videoUri?.toLowerCase().endsWith('.mov')
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

              console.log('Converted user video to MP4:', convertedPath);

              videoUri = convertedPath.startsWith('file://')
                ? convertedPath
                : `file://${convertedPath}`;
            } catch (e) {
              console.log('MOV to MP4 conversion failed (user video):', e);
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
            uri: item?.uri,
            type: 'image/jpg',
            name: 'image.jpg',
          });
        }
      }

      for (let i = 0; i < petMediaItem.length; i++) {
        const item = petMediaItem[i];
        if (!item) continue;

        if (item?.type === 2) {
          let videoUri = item?.uri;

          if (
            config.device_type === 'ios' &&
            videoUri?.toLowerCase().endsWith('.mov')
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

              console.log('Converted pet video to MP4:', convertedPath);

              videoUri = convertedPath.startsWith('file://')
                ? convertedPath
                : `file://${convertedPath}`;
            } catch (e) {
              console.log('MOV to MP4 conversion failed (pet video):', e);
              msgProvider.toast(t('unsupported_file_format_txt'), 'bottom');
              return false;
            }
          }

          data.append('pet_videos', {
            uri: videoUri,
            type: 'video/mp4',
            name: 'video.mp4',
          });

          if (item?.thumbnail) {
            data.append('pet_thumbnail', {
              uri: item.thumbnail,
              type: 'image/jpg',
              name: 'image.jpg',
            });
          }
        } else if (item?.type === 1) {
          data.append('pet_images', {
            uri: item?.uri,
            type: 'image/jpg',
            name: 'image.jpg',
          });
        }
      }

      data.append('friendly', sliderValues?.friendly);
      data.append('active', sliderValues?.active);
      data.append('aggressive', sliderValues?.aggressive);
      data.append('bark', sliderValues?.bark);
      data.append('doesnot_bark', sliderValues?.doesnot_bark);
      data.append('following_you', sliderValues?.following_you);
      data.append('kisser', sliderValues?.kisser);
      data.append('love_licking', sliderValues?.love_licking);
      data.append('guard', sliderValues?.guard);
      data.append('lazy', sliderValues?.lazy);
      data.append('napper', sliderValues?.napper);
      data.append('love_seeker', sliderValues?.love_seeker);
      if (question_1) {
        data.append('answer_1', question_1);
      }
      if (question_2) {
        data.append('answer_2', question_2);
      }
      if (question_3) {
        data.append('answer_3', question_3);
      }
      if (question_4) {
        data.append('answer_4', question_4);
      }
      if (question_5) {
        data.append('answer_5', question_5);
      }
      data.append('vaccination_status', isVaccinated);
      data.append('govt_registration_status', governmentRegister);
      data.append('pet_registration_like_status', register);

      if (user_profile) {
        data.append('profile_image', {
          uri: user_profile,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      }

      if (identityFront) {
        data.append('identity_front_image', {
          uri: identityFront,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      } else if (isidentityRemoveFrontImage) {
        data.append('remove_identity_front_image', isidentityRemoveFrontImage);
      }

      if (identityBack) {
        data.append('identity_back_image', {
          uri: identityBack,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      } else if (isidentityRemoveBackImage) {
        data.append('remove_identity_back_image', isidentityRemoveBackImage);
      }

      if (selfieImage) {
        data.append('selfie_image', {
          uri: selfieImage,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      } else if (isidentityRemoveSelfie) {
        data.append('remove_selfie_image', isidentityRemoveSelfie);
      }

      if (maritalStatus) {
        data.append('relationship_status', maritalStatus);
      }

      if (occupation) {
        data.append('occupation', occupation);
      }
      consolepro.consolelog(
        'identity remove selfie=======>>',
        isidentityRemoveSelfie,
      );
      const API_URL = config.baseURL + 'edit_profile';

      consolepro.consolelog('FormData _parts: ', data);

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
              setIsUpdateModal(true);
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
          consolepro.consolelog(error, '<<ERROR');
        });

      for (let [key, value] of data._parts || data.entries()) {
        if (key === 'user_images') {
          consolepro.consolelog(key, value);
        }
      }
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainView}>
        {/*  header  */}

        <View
          style={{
            width: (mobileW * 90) / 100,
            alignSelf: 'center',
            marginTop: (mobileH * 3.5) / 100,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => goBack()}
            activeOpacity={0.8}
            style={{
              width: (mobileW * 6) / 100,
              height: (mobileW * 6) / 100,
            }}>
            <Image
              source={localimag.icon_goBack}
              style={{
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
            />
          </TouchableOpacity>

          <Text
            style={{
              color: Colors.whiteColor,
              fontFamily: Font.FontRegular,
              fontSize: (mobileW * 5) / 100,
              marginLeft: (mobileW * 4) / 100,
              width: (mobileW * 70) / 100,
            }}>
            {t('update_profile_txt')}
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigate('UserCardProfileWithPet');
            }}
            style={{
              alignSelf: 'flex-end',
              // backgroundColor: 'red',
              alignItems: 'center',
              justifyContent: 'center',
              width: (mobileW * 10) / 100,
              height: (mobileW * 10) / 100,
            }}
            activeOpacity={0.8}>
            <Image
              source={localimag.icon_eye_profile}
              style={{
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
              }}
              tintColor={Colors.whiteColor}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: (mobileW * 90) / 100,
            height: (mobileW * 0.2) / 100,
            backgroundColor: Colors.themeColor,
            alignSelf: 'center',
            marginTop: (mobileW * 5) / 100,
          }}></View>

        <KeyboardAwareScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={Platform.OS === 'android' ? 80 : 0} // Important for Android
          enableOnAndroid={true}
          contentContainerStyle={{
            paddingBottom: (mobileW * 25) / 100,
            flexGrow: 1, // This allows the scroll view to grow and become scrollable
          }}>
          {/*  profile detail  */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: (mobileW * 4) / 100,
              marginTop: (mobileW * 5) / 100,
            }}>
            <View
              style={{
                marginHorizontal: (mobileW * 5) / 100,
                alignSelf: 'flex-start',
              }}>
              <View
                style={{
                  borderRadius: (mobileW * 7) / 100,
                  overflow: 'hidden',
                }}>
                <Image
                  source={
                    user_profile
                      ? {uri: user_profile}
                      : userDetails?.user_image &&
                        !isVideo(userDetails.user_image)
                      ? {uri: config.img_url + userDetails?.user_image}
                      : localimag.icon_profile_user
                  }
                  style={{
                    width: (mobileW * 13) / 100,
                    height: (mobileW * 13) / 100,
                  }}
                />
              </View>

              <View
                style={{
                  alignSelf: 'flex-start',
                  borderRadius: (mobileW * 30) / 100,
                  overflow: 'hidden',
                  position: 'absolute',
                  right: (-mobileW * 1) / 100,
                }}>
                <Image
                  source={
                    userDetails?.pet_images?.length > 0
                      ? {
                          uri:
                            config.img_url +
                            (userDetails.pet_images[0].type === 2
                              ? userDetails.pet_images[0].pet_thumbnail
                              : userDetails.pet_images[0].image),
                        }
                      : localimag?.icon_add_pet_photo
                  }
                  style={{
                    width: (mobileW * 5) / 100,
                    height: (mobileW * 5) / 100,
                  }}
                />
              </View>
            </View>

            <View style={{width: (mobileW * 60) / 100}}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 5.5) / 100,
                  marginLeft: (mobileW * 1) / 100,
                }}>
                {userDetails?.name}
              </Text>

              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3.2) / 100,
                  marginLeft: (mobileW * 1) / 100,
                }}>
                {userDetails?.user_age} Years Old
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setIsUserProfileEdit(!isUserProfileEdit)}
              activeOpacity={0.8}
              style={{
                zIndex: 10,
                backgroundColor: Colors.whiteColor,
                borderRadius: (mobileW * 20) / 100,
                padding: (mobileW * 1) / 100,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,
                elevation: 8,
                marginRight: (mobileW * 4) / 100,
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
              }}>
              <Image
                source={localimag.icon_edit_pen}
                style={{
                  width: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,

                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginHorizontal: (mobileW * 3) / 100,
              marginTop: (mobileW * 5) / 100,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 3.5) / 100,
                marginLeft: (mobileW * 1) / 100,
              }}>
              {t('approval_status_txt')} :
            </Text>
            <Text
              style={{
                color:
                  userDetails?.approve_flag == 0
                    ? '#FFA500'
                    : userDetails?.approve_flag == 1
                    ? '#8FF41DFF'
                    : Colors.cancleColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 3.5) / 100,
                marginLeft: (mobileW * 1) / 100,
              }}>
              {userDetails?.approve_flag == 0
                ? 'Pending'
                : userDetails?.approve_flag == 1
                ? 'Approved'
                : 'Rejected'}
            </Text>
          </View>

          <View
            style={{
              marginHorizontal: (mobileW * 3) / 100,
              marginTop: (mobileW * 4) / 100,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3.5) / 100,
                  marginLeft: (mobileW * 1) / 100,
                }}>
                {t('Marital_Status_txt')} :
              </Text>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3.5) / 100,
                  marginLeft: (mobileW * 1) / 100,
                }}>
                {/* {userDetails?.relationship_status == 1
                ? 'Single'
                : userDetails?.relationship_status == 2
                  ? 'Married'
                  : userDetails?.relationship_status == 3
                    ? 'In a relationship'
                    : 'Divorce'} */}
                {maritalStatus == 1
                  ? 'Single'
                  : maritalStatus == 2
                  ? 'Married'
                  : maritalStatus == 3
                  ? 'In a relationship'
                  : 'Divorce'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setisRelationModal(true);
              }}
              activeOpacity={0.8}
              style={{
                zIndex: 10,
                backgroundColor: Colors.whiteColor,
                borderRadius: (mobileW * 20) / 100,
                padding: (mobileW * 1) / 100,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,
                elevation: 8,
                marginRight: (mobileW * 4) / 100,
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
              }}>
              <Image
                source={localimag.icon_edit_pen}
                style={{
                  width: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,

                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginHorizontal: (mobileW * 3) / 100,
              marginTop: (mobileW * 3) / 100,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 3.5) / 100,
                marginLeft: (mobileW * 1) / 100,
              }}>
              {t('gender_txt')} :
            </Text>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 3.5) / 100,
                marginLeft: (mobileW * 1) / 100,
              }}>
              {userDetails?.gender == 1
                ? 'Male'
                : userDetails?.gender == 2
                ? 'Female'
                : 'Other'}
            </Text>
          </View>

          {/* <View
          style={{
            marginHorizontal: (mobileW * 3) / 100,
            marginTop: (mobileW * 4) / 100,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: Colors.whiteColor,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 3.5) / 100,
              marginLeft: (mobileW * 1) / 100,
            }}>
            {t('occupation_txt')} :
          </Text>
          <Text
            style={{
              color: Colors.whiteColor,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 3.5) / 100,
              marginLeft: (mobileW * 1) / 100,
            }}>
            {userDetails?.occupation}
          </Text>
        </View> */}

          <View
            style={{
              marginHorizontal: (mobileW * 3) / 100,
              marginTop: (mobileW * 4) / 100,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 3.5) / 100,
                marginLeft: (mobileW * 1) / 100,
              }}>
              {t('occupation_txt')} :
            </Text>
            <TextInput
              value={occupation}
              onChangeText={text => setOccupation(text)}
              placeholder={t('occupation_txt')}
              placeholderTextColor={Colors.whiteColor + '99'} // optional: slight opacity
              style={{
                width: (mobileW * 58) / 100,
                color: Colors.whiteColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 3.5) / 100,
                marginLeft: (mobileW * 1) / 100,
                paddingVertical: 0, // aligns with Text
              }}
              underlineColorAndroid="transparent"
              editable={isOccupationEdit}
            />
            <TouchableOpacity
              onPress={() => setIsOccupationEdit(!isOccupationEdit)}
              activeOpacity={0.8}
              style={{
                zIndex: 10,
                backgroundColor: Colors.whiteColor,
                borderRadius: (mobileW * 20) / 100,
                padding: (mobileW * 1) / 100,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,
                elevation: 8,
                marginRight: (mobileW * 5) / 100,
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
              }}>
              <Image
                source={
                  isOccupationEdit
                    ? localimag.icon_check_mark
                    : localimag.icon_edit_pen
                }
                style={{
                  width: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,

                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                }}
              />
            </TouchableOpacity>
          </View>

          {/*  images view */}

          <View>
            <FlatList
              data={filledSlots}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{marginHorizontal: (mobileW * 1.5) / 100}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: (mobileW * 1) / 100,
                    marginTop: (mobileW * 5) / 100,
                  }}>
                  <View
                    style={{
                      borderRadius: (mobileW * 3) / 100,
                      overflow: 'hidden',
                    }}>
                    {item?.isAddButton && !mediaItem[index] ? (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => openMediaPicker(index)}
                        style={{
                          width: (mobileW * 22) / 100,
                          height: (mobileW * 22) / 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: Colors.borderGrey,
                        }}>
                        <Image
                          source={localimag.icon_add_user}
                          style={{
                            width: (mobileW * 22) / 100,
                            height: (mobileW * 22) / 100,
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          openMediaPicker(index);
                        }}>
                        <Image
                          source={{
                            uri: item?.user_thumbnail
                              ? config?.img_url + item?.user_thumbnail
                              : item?.image
                              ? config.img_url + item?.image
                              : mediaItem[index]?.uri,
                          }}
                          style={{
                            width: (mobileW * 22) / 100,
                            height: (mobileW * 22) / 100,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {!item?.isAddButton && (
                    <TouchableOpacity
                      onPress={() => handleRemoveImage(index)} // define this
                      activeOpacity={0.5}
                      style={{
                        position: 'absolute',
                        top: (-mobileW * 1.5) / 100,
                        right: (-mobileW * 1.5) / 100,
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
                        source={localimag.icon_cross}
                        style={{
                          width: (mobileW * 3) / 100,
                          height: (mobileW * 3) / 100,
                        }}
                        tintColor={Colors.cancleColor}
                      />
                    </TouchableOpacity>
                  )}

                  {mediaItem[index] && (
                    <TouchableOpacity
                      onPress={() => removeMedia(index)} // define this
                      activeOpacity={0.8}
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
          </View>

          {/*  about  */}

          <View
            style={{
              marginHorizontal: (mobileW * 3) / 100,
              marginTop: (mobileW * 4) / 100,
            }}>
            {/* ------input field ------ */}
            <View
              style={{
                paddingVertical: (mobileW * 2) / 100,
                position: 'relative',
              }}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3) / 100,
                }}>
                {t('about_txt')}
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
                  height: (mobileW * 25) / 100,
                  textAlign: config.language == 1 ? 'right' : 'left',
                }}
                placeholder={t('enter_aboutHere_txt')}
                value={answer}
                onChangeText={val => setAnswer(val)}
                placeholderTextColor={Colors.placeholderTextColor}
                maxLength={250}
                editable={isAbout_editable}
              />
              <TouchableOpacity
                onPress={() => setIsAbout_editable(!isAbout_editable)}
                activeOpacity={0.8}
                style={{
                  position: 'absolute',
                  right: (mobileW * 1.5) / 100,
                  zIndex: 10,
                  bottom: (mobileW * 3) / 100,
                  width: (mobileW * 6) / 100,
                  height: (mobileW * 6) / 100,
                }}>
                <Image
                  source={
                    isAbout_editable
                      ? localimag?.icon_check_mark
                      : localimag.icon_edit_pen
                  }
                  style={{
                    width: (mobileW * 4) / 100,
                    height: (mobileW * 4) / 100,

                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/*  pet details   */}

          <View
            style={{
              marginLeft: (mobileW * 5) / 100,
              marginTop: (mobileW * 1) / 100,
            }}>
            {/* <Text
            style={{
              color: Colors.whiteColor,
              fontFamily: Font.FontSemibold,
              fontSize: (mobileW * 7) / 100,
              alignSelf: 'flex-start',
            }}>
            {userDetails?.pet_name}
          </Text> */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TextInput
                value={pet_name}
                onChangeText={val => setPet_name(val)}
                style={{
                  width: (mobileW * 60) / 100,
                  color: Colors.whiteColor,
                  backgroundColor: Colors.themeColor2,
                  fontSize: (mobileW * 6) / 100,
                  fontFamily: Font.FontSemibold,
                  paddingVertical: 0,
                  marginTop: (mobileW * 4) / 100,
                  textAlign: config.language == 1 ? 'right' : 'left',
                }}
                editable={petNameEditable}
                placeholder={t('enter_pet_name_txt')}
                placeholderTextColor={Colors.placeholderTextColor}
                maxLength={50}
              />

              {/* <TouchableOpacity
              onPress={() => setPetNameEditable(!petNameEditable)}
              activeOpacity={0.8}
              style={{
                zIndex: 10,
                backgroundColor: Colors.whiteColor,
                borderRadius: (mobileW * 20) / 100,
                padding: (mobileW * 1) / 100,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,
                elevation: 7,
                marginRight: (mobileW * 4) / 100,
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
              }}>
              <Image
                source={
                  petNameEditable
                    ? localimag?.icon_check_mark
                    : localimag.icon_edit_pen
                }
                style={{
                  width: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,

                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                }}
              />
            </TouchableOpacity> */}
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TextInput
                value={pet_age}
                onChangeText={val => setPet_age(val)}
                style={{
                  width: (mobileW * 60) / 100,
                  color: Colors.whiteColor,
                  backgroundColor: Colors.themeColor2,
                  fontSize: (mobileW * 3) / 100,
                  fontFamily: Font.FontRegular,
                  marginTop: 0,
                  paddingVertical: 0,
                  textAlign: config.language == 1 ? 'right' : 'left',
                }}
                editable={petAgeEditable}
                placeholder={t('enter_pet_age_txt')}
                placeholderTextColor={Colors.placeholderTextColor}
                maxLength={50}
              />
              {/* <TouchableOpacity
              onPress={() => setPetAgeEditable(!petAgeEditable)}
              activeOpacity={0.8}
              style={{
                zIndex: 10,
                backgroundColor: Colors.whiteColor,
                borderRadius: (mobileW * 20) / 100,
                padding: (mobileW * 1) / 100,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,
                elevation: 7,
                marginRight: (mobileW * 4) / 100,
              }}>
              <Image
                source={
                  petAgeEditable
                    ? localimag?.icon_check_mark
                    : localimag.icon_edit_pen
                }
                style={{
                  width: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,

                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                }}
              />
            </TouchableOpacity> */}
            </View>
          </View>

          <View>
            <FlatList
              data={filledPetImagesSlots}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{marginHorizontal: (mobileW * 1.5) / 100}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: (mobileW * 1) / 100,
                    marginTop: (mobileW * 5) / 100,
                  }}>
                  <View
                    style={{
                      borderRadius: (mobileW * 3) / 100,
                      overflow: 'hidden',
                    }}>
                    {item?.isAddButton && !petMediaItem[index] ? (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => openPetMediaPicker(index)} // define this function
                        style={{
                          width: (mobileW * 22) / 100,
                          height: (mobileW * 22) / 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: Colors.borderGrey,
                        }}>
                        <Image
                          source={localimag.icon_add_pet_photo}
                          style={{
                            width: (mobileW * 22) / 100,
                            height: (mobileW * 22) / 100,
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => openPetMediaPicker(index)}>
                        <Image
                          source={{
                            uri: item?.pet_thumbnail
                              ? config?.img_url + item?.pet_thumbnail
                              : item?.image
                              ? config.img_url + item?.image
                              : petMediaItem[index]?.uri,
                          }}
                          style={{
                            width: (mobileW * 22) / 100,
                            height: (mobileW * 22) / 100,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {!item?.isAddButton && (
                    <TouchableOpacity
                      onPress={() => handlePetImageRemove(index)} // define this
                      activeOpacity={0.8}
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

                  {petMediaItem[index] && (
                    <TouchableOpacity
                      onPress={() => removePetImages(index)} // define this
                      activeOpacity={0.8}
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
          </View>

          {/*  nature view  */}

          <View
            style={{
              marginHorizontal: (mobileW * 3) / 100,
              marginTop: (mobileW * 5) / 100,
              alignSelf: 'center',
              flex: 1,
              // backgroundColor: 'blue',
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 5.5) / 100,
              }}>
              {t('tell_use_about_your_pet_nature_txt')}
            </Text>

            <Text
              style={{
                color: Colors.themeColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 3.5) / 100,
              }}>
              {t('you_can_choose_any_three_txt')}
            </Text>

            {/* ---------- nature view --------- */}

            <FlatList
              data={natureData}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              style={{
                marginTop: (mobileW * 5) / 100,
                // flex: 1,
                // backgroundColor: 'blue',
                // height: (mobileH * 30) / 100,
              }}
              contentContainerStyle={{paddingBottom: (mobileW * 10) / 100}}
              renderItem={({item, index}) => (
                <View
                  style={[
                    styles.itemContainer,
                    {
                      backgroundColor:
                        (sliderValues[item.key] ?? 0) === 0
                          ? Colors.whiteColor
                          : Colors.themeColor,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color:
                          (sliderValues[item.key] ?? 0) === 0
                            ? Colors.themeColor2
                            : Colors.whiteColor,
                        textAlign: config.language == 2 ? 'right' : 'left',
                      },
                    ]}>
                    {item?.nature[config.language]}
                  </Text>

                  <Text
                    style={[
                      styles.text,
                      {
                        color:
                          sliderValues[index] === 0
                            ? Colors.themeColor2
                            : Colors.whiteColor,
                        textAlign: config.language == 2 ? 'right' : 'left',
                      },
                    ]}>
                    {sliderValues[item?.key] !== 0
                      ? `${sliderValues[item?.key]}%`
                      : ''}
                  </Text>

                  <MultiSlider
                    containerStyle={{
                      height: (mobileW * 3) / 100,
                      marginHorizontal: (mobileW * 2) / 100,
                    }}
                    values={[sliderValues[item.key] ?? 0]} // Ensure the value is 0 if undefined or null
                    min={0}
                    max={100}
                    step={1}
                    sliderLength={80}
                    onValuesChange={values =>
                      handleSliderChange(values, item?.key)
                    } // Update using item.key
                    selectedStyle={{backgroundColor: '#FFF'}}
                    unselectedStyle={{backgroundColor: '#a7a39c'}}
                    trackStyle={{height: 3}}
                    markerStyle={{
                      backgroundColor:
                        sliderValues[item?.key] === 0
                          ? Colors.themeColor
                          : Colors.whiteColor,
                      width: (mobileW * 2.5) / 100,
                      height: (mobileW * 2.5) / 100,
                      borderRadius: (mobileW * 30) / 100,
                    }}
                  />
                </View>
              )}
            />
          </View>

          {/*  know your pet view */}

          <View style={{marginLeft: (mobileW * 5) / 100}}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 6) / 100,
              }}>
              {t('lets_go_to_know_your_pet_txt')}
            </Text>

            <Text
              style={{
                color: Colors.themeColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
              }}>
              {t('you_can_answer_any_3_txt')}
            </Text>

            {/* -----progress ------ */}

            <Progress.Bar
              progress={1}
              width={(mobileW * 90) / 100}
              height={(mobileW * 0.6) / 100}
              style={{marginTop: (mobileW * 4) / 100}}
              color={Colors.ColorProgress}
              borderColor={Colors.placeholderTextColor}
              unfilledColor={Colors.whiteColor}
            />

            {/* Question 1 */}

            <View style={{marginTop: (mobileW * 3) / 100}}>
              <View
                style={{
                  backgroundColor: Colors.whiteColor,
                  width: (mobileW * 90) / 100,
                  // height: (mobileW * 25) / 100,
                  borderRadius: (mobileW * 3) / 100,
                  paddingHorizontal: (mobileW * 4) / 100,
                  paddingVertical: (mobileW * 1) / 100,
                  // alignItems: 'center'
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontBold,
                    fontSize: (mobileW * 4) / 100,
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  {t('best_memory_with_your_pet_txt')}
                </Text>

                <View style={{alignSelf: 'center'}}>
                  <TextInput
                    keyboardType="default"
                    placeholder={t('enter_your_answer_txt')}
                    placeholderTextColor={Colors.placeholderTextColor}
                    style={{
                      // backgroundColor: Colors.placeholderTextColor,
                      paddingHorizontal: (mobileW * 5) / 100,
                      width: (mobileW * 90) / 100,
                      fontFamily: Font.FontMedium,
                      color: Colors.placeholderTextColor,
                      fontSize: (mobileW * 3.5) / 100,
                      height: (mobileW * 15) / 100,
                      textAlign: config.language == 1 ? 'right' : 'left',
                      textAlignVertical: 'top',
                    }}
                    editable={isAnswer_1_editable}
                    value={question_1}
                    onChangeText={val => setQuestion_1(val)}
                    maxLength={250}
                    multiline={true}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setIsAnswer_1_editable(!isAnswer_1_editable)}
                  activeOpacity={0.8}
                  style={{
                    position: 'absolute',
                    right: (-mobileW * 1.5) / 100,
                    zIndex: 10,
                    backgroundColor: Colors.whiteColor,
                    borderRadius: (mobileW * 20) / 100,
                    padding: (mobileW * 1) / 100,
                    top: (-mobileW * 1.5) / 100,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 4.65,

                    elevation: 7,
                  }}>
                  <Image
                    source={
                      isAnswer_1_editable
                        ? localimag?.icon_check_mark
                        : localimag.icon_edit_pen
                    }
                    style={{
                      width: (mobileW * 4) / 100,
                      height: (mobileW * 4) / 100,

                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      ],
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Question 2 */}

            <View style={{marginTop: (mobileW * 3) / 100}}>
              <View
                style={{
                  backgroundColor: Colors.whiteColor,
                  width: (mobileW * 90) / 100,
                  // height: (mobileW * 25) / 100,
                  borderRadius: (mobileW * 3) / 100,
                  paddingHorizontal: (mobileW * 4) / 100,
                  paddingVertical: (mobileW * 1) / 100,
                  // alignItems: 'center'
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontBold,
                    fontSize: (mobileW * 4) / 100,
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  {t('questions_heading_value2')}
                </Text>

                <View style={{alignSelf: 'center'}}>
                  <TextInput
                    keyboardType="default"
                    placeholder={t('enter_your_answer_txt')}
                    placeholderTextColor={Colors.placeholderTextColor}
                    style={{
                      // backgroundColor: Colors.placeholderTextColor,
                      paddingHorizontal: (mobileW * 5) / 100,
                      width: (mobileW * 90) / 100,
                      fontFamily: Font.FontMedium,
                      color: Colors.placeholderTextColor,
                      fontSize: (mobileW * 3.5) / 100,
                      height: (mobileW * 15) / 100,
                      textAlign: config.language == 1 ? 'right' : 'left',
                      textAlignVertical: 'top',
                    }}
                    value={question_2}
                    onChangeText={val => setQuestion_2(val)}
                    editable={isAnswer_2_editable}
                    maxLength={250}
                    multiline={true}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setIsAnswer_2_editable(!isAnswer_2_editable)}
                  activeOpacity={0.8}
                  style={{
                    position: 'absolute',
                    right: (-mobileW * 1.5) / 100,
                    zIndex: 10,
                    backgroundColor: Colors.whiteColor,
                    borderRadius: (mobileW * 20) / 100,
                    padding: (mobileW * 1) / 100,
                    top: (-mobileW * 1.5) / 100,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 4.65,

                    elevation: 7,
                  }}>
                  <Image
                    source={
                      isAnswer_2_editable
                        ? localimag?.icon_check_mark
                        : localimag.icon_edit_pen
                    }
                    style={{
                      width: (mobileW * 4) / 100,
                      height: (mobileW * 4) / 100,

                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      ],
                    }}
                  />
                </TouchableOpacity>
                {/* )} */}
              </View>
            </View>

            {/* Question 3 */}

            <View style={{marginTop: (mobileW * 3) / 100}}>
              <View
                style={{
                  backgroundColor: Colors.whiteColor,
                  width: (mobileW * 90) / 100,
                  // height: (mobileW * 25) / 100,
                  borderRadius: (mobileW * 3) / 100,
                  paddingHorizontal: (mobileW * 4) / 100,
                  paddingVertical: (mobileW * 1) / 100,
                  // alignItems: 'center'
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontBold,
                    fontSize: (mobileW * 4) / 100,
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  {t('questions_heading_value3')}
                </Text>

                <View style={{alignSelf: 'center'}}>
                  <TextInput
                    keyboardType="default"
                    placeholder={t('enter_your_answer_txt')}
                    placeholderTextColor={Colors.placeholderTextColor}
                    style={{
                      // backgroundColor: Colors.placeholderTextColor,
                      paddingHorizontal: (mobileW * 5) / 100,
                      width: (mobileW * 90) / 100,
                      fontFamily: Font.FontMedium,
                      color: Colors.placeholderTextColor,
                      fontSize: (mobileW * 3.5) / 100,
                      height: (mobileW * 15) / 100,

                      textAlign: config.language == 1 ? 'right' : 'left',
                      textAlignVertical: 'top',
                    }}
                    value={question_3}
                    onChangeText={val => setQuestion_3(val)}
                    editable={isAnswer_3_editable}
                    maxLength={250}
                    multiline={true}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setIsAnswer_3_editable(!isAnswer_3_editable)}
                  activeOpacity={0.8}
                  style={{
                    position: 'absolute',
                    right: (-mobileW * 1.5) / 100,
                    zIndex: 10,
                    backgroundColor: Colors.whiteColor,
                    borderRadius: (mobileW * 20) / 100,
                    padding: (mobileW * 1) / 100,
                    top: (-mobileW * 1.5) / 100,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 4.65,

                    elevation: 7,
                  }}>
                  <Image
                    source={
                      isAnswer_3_editable
                        ? localimag?.icon_check_mark
                        : localimag.icon_edit_pen
                    }
                    style={{
                      width: (mobileW * 4) / 100,
                      height: (mobileW * 4) / 100,

                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      ],
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Question 4 */}

            <View style={{marginTop: (mobileW * 3) / 100}}>
              <View
                style={{
                  backgroundColor: Colors.whiteColor,
                  width: (mobileW * 90) / 100,
                  // height: (mobileW * 25) / 100,
                  borderRadius: (mobileW * 3) / 100,
                  paddingHorizontal: (mobileW * 4) / 100,
                  paddingVertical: (mobileW * 1) / 100,
                  // alignItems: 'center'
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontBold,
                    fontSize: (mobileW * 4) / 100,
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  {t('questions_heading_value4')}
                </Text>

                <View style={{alignSelf: 'center'}}>
                  <TextInput
                    keyboardType="default"
                    placeholder={t('enter_your_answer_txt')}
                    placeholderTextColor={Colors.placeholderTextColor}
                    style={{
                      // backgroundColor: Colors.placeholderTextColor,
                      paddingHorizontal: (mobileW * 5) / 100,
                      width: (mobileW * 90) / 100,
                      fontFamily: Font.FontMedium,
                      color: Colors.placeholderTextColor,
                      fontSize: (mobileW * 3.5) / 100,
                      height: (mobileW * 15) / 100,
                      textAlignVertical: 'top',
                      textAlign: config.language == 1 ? 'right' : 'left',
                    }}
                    value={question_4}
                    onChangeText={val => setQuestion_4(val)}
                    editable={isAnswer_4_editable}
                    maxLength={250}
                    multiline={true}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setIsAnswer_4_editable(!isAnswer_4_editable)}
                  activeOpacity={0.8}
                  style={{
                    position: 'absolute',
                    right: (-mobileW * 1.5) / 100,
                    zIndex: 10,
                    backgroundColor: Colors.whiteColor,
                    borderRadius: (mobileW * 20) / 100,
                    padding: (mobileW * 1) / 100,
                    top: (-mobileW * 1.5) / 100,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 4.65,

                    elevation: 7,
                  }}>
                  <Image
                    source={
                      isAnswer_4_editable
                        ? localimag?.icon_check_mark
                        : localimag.icon_edit_pen
                    }
                    style={{
                      width: (mobileW * 4) / 100,
                      height: (mobileW * 4) / 100,

                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      ],
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Question 5 */}

            <View style={{marginTop: (mobileW * 3) / 100}}>
              <View
                style={{
                  backgroundColor: Colors.whiteColor,
                  width: (mobileW * 90) / 100,
                  // height: (mobileW * 25) / 100,
                  borderRadius: (mobileW * 3) / 100,
                  paddingHorizontal: (mobileW * 4) / 100,
                  paddingVertical: (mobileW * 1) / 100,
                  // alignItems: 'center'
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontBold,
                    fontSize: (mobileW * 4) / 100,
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  {t('questions_heading_value5')}
                </Text>

                <View style={{alignSelf: 'center'}}>
                  <TextInput
                    keyboardType="default"
                    placeholder={t('enter_your_answer_txt')}
                    placeholderTextColor={Colors.placeholderTextColor}
                    style={{
                      // backgroundColor: Colors.placeholderTextColor,
                      paddingHorizontal: (mobileW * 5) / 100,
                      width: (mobileW * 90) / 100,
                      fontFamily: Font.FontMedium,
                      color: Colors.placeholderTextColor,
                      fontSize: (mobileW * 3.5) / 100,
                      height: (mobileW * 15) / 100,
                      textAlignVertical: 'top',
                      textAlign: config.language == 1 ? 'right' : 'left',
                    }}
                    value={question_5}
                    onChangeText={val => setQuestion_5(val)}
                    editable={isAnswer_5_editable}
                    maxLength={250}
                    multiline={true}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setIsAnswer_5_editable(!isAnswer_5_editable)}
                  activeOpacity={0.8}
                  style={{
                    position: 'absolute',
                    right: (-mobileW * 1.5) / 100,
                    zIndex: 10,
                    backgroundColor: Colors.whiteColor,
                    borderRadius: (mobileW * 20) / 100,
                    padding: (mobileW * 1) / 100,
                    top: (-mobileW * 1.5) / 100,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 4.65,

                    elevation: 7,
                  }}>
                  <Image
                    source={
                      isAnswer_5_editable
                        ? localimag?.icon_check_mark
                        : localimag.icon_edit_pen
                    }
                    style={{
                      width: (mobileW * 4) / 100,
                      height: (mobileW * 4) / 100,

                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      ],
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* pet health */}

          <View
            style={{
              alignSelf: 'center',
              marginHorizontal: (mobileW * 3) / 100,
            }}>
            <View style={{marginTop: (mobileW * 5) / 100}}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 6) / 100,
                }}>
                {t('tell_us_about_your_pet_health_txt')}
              </Text>
            </View>

            {/* vaccination certificate */}

            <View style={{marginTop: (mobileW * 4) / 100}}>
              <View
                style={{
                  backgroundColor: Colors.themeColor,
                  width: (mobileW * 45) / 100,
                  height: (mobileW * 7) / 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: (mobileW * 1.5) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {t('vaccination_status')}
                </Text>
              </View>

              {/* -------vaccinated ------ */}
              <View style={{marginTop: (mobileW * 3) / 100}}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 5) / 100,
                  }}>
                  {t('is_your_pet_vaccinated_txt')}
                </Text>

                {/* --------- radio butons-------- */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: (mobileW * 2) / 100,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIsVaccinated(1)}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={
                        isVaccinated === 1
                          ? localimag.icon_radio_with_white_border
                          : localimag.icon_filled_radio
                      }
                      style={{
                        width: (mobileW * 5) / 100,
                        height: (mobileW * 5) / 100,
                      }}
                    />
                    <Text
                      style={{
                        color: Colors.themeColor,
                        fontFamily: Font.FontSemibold,
                        fontSize: (mobileW * 4) / 100,
                        marginLeft: (mobileW * 2) / 100,
                      }}>
                      {t('yes_txt')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setIsVaccinated(2)}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: (mobileW * 30) / 100,
                    }}>
                    <Image
                      source={
                        isVaccinated === 2
                          ? localimag.icon_radio_with_white_border
                          : localimag.icon_filled_radio
                      }
                      style={{
                        width: (mobileW * 5) / 100,
                        height: (mobileW * 5) / 100,
                      }}
                    />
                    <Text
                      style={{
                        color: Colors.themeColor,
                        fontFamily: Font.FontSemibold,
                        fontSize: (mobileW * 4) / 100,
                        marginLeft: (mobileW * 2) / 100,
                      }}>
                      {t('no_txt')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/*government registration */}

            <View style={{marginTop: (mobileW * 6) / 100}}>
              <View
                style={{
                  backgroundColor: Colors.themeColor,
                  width: (mobileW * 60) / 100,
                  height: (mobileW * 7) / 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: (mobileW * 1.5) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {t('government_registration_txt')}
                </Text>
              </View>

              {/* ------- registration ------ */}
              <View style={{marginTop: (mobileW * 2) / 100}}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 5) / 100,
                  }}>
                  {t('is_your_pet_registered_with_the_government_portal')}
                </Text>

                {/* --------- radio butons-------- */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: (mobileW * 2) / 100,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setGovernmentRegister(1)}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={
                        governmentRegister === 1
                          ? localimag.icon_radio_with_white_border
                          : localimag.icon_filled_radio
                      }
                      style={[
                        {
                          width: (mobileW * 5) / 100,
                          height: (mobileW * 5) / 100,
                        },
                      ]}
                    />
                    <Text
                      style={{
                        color: Colors.themeColor,
                        fontFamily: Font.FontSemibold,
                        fontSize: (mobileW * 4) / 100,
                        marginLeft: (mobileW * 2) / 100,
                      }}>
                      {t('yes_txt')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setGovernmentRegister(2)}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: (mobileW * 30) / 100,
                    }}>
                    <Image
                      source={
                        governmentRegister === 2
                          ? localimag.icon_radio_with_white_border
                          : localimag.icon_filled_radio
                      }
                      style={{
                        width: (mobileW * 5) / 100,
                        height: (mobileW * 5) / 100,
                      }}
                    />
                    <Text
                      style={{
                        color: Colors.themeColor,
                        fontFamily: Font.FontSemibold,
                        fontSize: (mobileW * 4) / 100,
                        marginLeft: (mobileW * 2) / 100,
                      }}>
                      {t('no_txt')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* pet register*/}

            <View style={{marginTop: (mobileW * 4) / 100}}>
              {/* ------- registration ------ */}
              <View style={{marginTop: (mobileW * 4) / 100}}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 5) / 100,
                  }}>
                  {t('would_you_like_to_register_your_pet_txt')}
                </Text>

                {/* --------- radio butons-------- */}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: (mobileW * 2) / 100,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setRegister(1)}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={
                        register === 1
                          ? localimag.icon_radio_with_white_border
                          : localimag.icon_filled_radio
                      }
                      style={{
                        width: (mobileW * 5) / 100,
                        height: (mobileW * 5) / 100,
                      }}
                    />
                    <Text
                      style={{
                        color: Colors.themeColor,
                        fontFamily: Font.FontSemibold,
                        fontSize: (mobileW * 4) / 100,
                        marginLeft: (mobileW * 2) / 100,
                      }}>
                      {t('yes_txt')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setRegister(2)}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: (mobileW * 30) / 100,
                    }}>
                    <Image
                      source={
                        register === 2
                          ? localimag.icon_radio_with_white_border
                          : localimag.icon_filled_radio
                      }
                      style={{
                        width: (mobileW * 5) / 100,
                        height: (mobileW * 5) / 100,
                      }}
                    />
                    <Text
                      style={{
                        color: Colors.themeColor,
                        fontFamily: Font.FontSemibold,
                        fontSize: (mobileW * 4) / 100,
                        marginLeft: (mobileW * 2) / 100,
                      }}>
                      {t('no_txt')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Identity Proof */}

              <View style={{marginTop: (mobileW * 8) / 100}}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 5) / 100,
                  }}>
                  {t('identity_proof_txt')}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: (mobileW * 4) / 100,
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  {/* --------- Identity Front --------- */}
                  <View style={{position: 'relative'}}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        borderRadius: (mobileW * 5) / 100,
                        overflow: 'hidden',
                      }}
                      onPress={() => {
                        if (identityFrontAPI || identityFront) {
                          navigate('VideoPreview', {
                            uri: identityFrontAPI
                              ? config.img_url +
                                userDetails?.identity_front_image
                              : identityFront,
                            type: 0,
                          });
                        } else {
                          setIsIdentityFrontModal(true);
                          setcameraImageType(0);
                        }
                      }}>
                      <Image
                        source={
                          identityFrontAPI
                            ? {
                                uri: config.img_url + identityFrontAPI,
                              }
                            : identityFront
                            ? {uri: identityFront}
                            : localimag.icon_add_user
                        }
                        style={{
                          width: (mobileW * 22) / 100,
                          height: (mobileW * 22) / 100,
                        }}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: Colors.whiteColor,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3) / 100,
                        marginTop: (mobileW * 1) / 100,
                      }}>
                      {t('identity_front_txt')}
                    </Text>

                    {(identityFrontAPI || identityFront) && (
                      <TouchableOpacity
                        onPress={() => {
                          setIdentityFront(null);
                          if (identityFrontAPI) {
                            setIdentityFrontAPI(null);
                            setIsidentityRemoveFrontImage(true);
                          }
                        }}
                        style={{
                          position: 'absolute',
                          top: (-mobileW * 1) / 100,
                          right: (-mobileW * 0.8) / 100,
                          backgroundColor: Colors.whiteColor,
                          borderRadius: (mobileW * 5) / 100,
                          padding: (mobileW * 1) / 100,
                          zIndex: 10,
                        }}>
                        <Image
                          source={localimag.icon_cross}
                          style={{
                            width: (mobileW * 2.5) / 100,
                            height: (mobileW * 2.5) / 100,
                          }}
                          tintColor={Colors.cancleColor}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* --------- Identity Back --------- */}
                  <View style={{position: 'relative'}}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        borderRadius: (mobileW * 5) / 100,
                        overflow: 'hidden',
                      }}
                      onPress={() => {
                        if (identityBackAPI || identityBack) {
                          navigate('VideoPreview', {
                            uri: identityBackAPI
                              ? config.img_url + identityBackAPI
                              : identityBack,
                            type: 0,
                          });
                        } else {
                          setIsIdentityFrontModal(true);
                          setcameraImageType(1);
                        }
                      }}>
                      <Image
                        source={
                          identityBackAPI
                            ? {
                                uri: config.img_url + identityBackAPI,
                              }
                            : identityBack
                            ? {uri: identityBack}
                            : localimag.icon_add_user
                        }
                        style={{
                          width: (mobileW * 22) / 100,
                          height: (mobileW * 22) / 100,
                        }}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{
                        color: Colors.whiteColor,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3) / 100,
                        marginTop: (mobileW * 1) / 100,
                      }}>
                      {t('identity_back_txt')}
                    </Text>

                    {(identityBackAPI || identityBack) && (
                      <TouchableOpacity
                        onPress={() => {
                          setIdentityBack(null);
                          if (setIdentityBack) {
                            setIdentityBackAPI(null);
                            setIsidentityRemoveBackImage(true);
                          }
                        }}
                        style={{
                          position: 'absolute',
                          top: (-mobileW * 1) / 100,
                          right: (-mobileW * 0.8) / 100,
                          backgroundColor: Colors.whiteColor,
                          borderRadius: (mobileW * 5) / 100,
                          padding: (mobileW * 1) / 100,
                          zIndex: 10,
                        }}>
                        <Image
                          source={localimag.icon_cross}
                          style={{
                            width: (mobileW * 2.5) / 100,
                            height: (mobileW * 2.5) / 100,
                          }}
                          tintColor={Colors.cancleColor}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* --------- Selfie --------- */}
                  <View style={{position: 'relative'}}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        borderRadius: (mobileW * 5) / 100,
                        overflow: 'hidden',
                      }}
                      onPress={() => {
                        if (selfieImageAPI || selfieImage) {
                          navigate('VideoPreview', {
                            uri: selfieImageAPI
                              ? config.img_url + selfieImageAPI
                              : selfieImage,
                            type: 0,
                          });
                        } else {
                          setIsIdentityFrontModal(true);
                          setcameraImageType(2);
                        }
                      }}>
                      <Image
                        source={
                          selfieImageAPI
                            ? {uri: config.img_url + selfieImageAPI}
                            : selfieImage
                            ? {uri: selfieImage}
                            : localimag.icon_add_user
                        }
                        style={{
                          width: (mobileW * 22) / 100,
                          height: (mobileW * 22) / 100,
                        }}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{
                        color: Colors.whiteColor,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3) / 100,
                        marginTop: (mobileW * 1) / 100,
                      }}>
                      {t('selfie_image_txt')}
                    </Text>

                    {(selfieImageAPI || selfieImage) && (
                      <TouchableOpacity
                        onPress={() => {
                          setSelfie_image(null);
                          if (selfieImageAPI) {
                            setIsidentityRemoveSelfie(true);
                            setSelfie_imageAPI(null);
                          }
                        }}
                        style={{
                          position: 'absolute',
                          top: (-mobileW * 1) / 100,
                          right: (-mobileW * 0.8) / 100,
                          backgroundColor: Colors.whiteColor,
                          borderRadius: (mobileW * 5) / 100,
                          padding: (mobileW * 1) / 100,
                          zIndex: 10,
                        }}>
                        <Image
                          source={localimag.icon_cross}
                          style={{
                            width: (mobileW * 2.5) / 100,
                            height: (mobileW * 2.5) / 100,
                          }}
                          tintColor={Colors.cancleColor}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              <View style={{marginTop: (mobileW * 10) / 100}}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {t('important_disclaimer_txt')}
                </Text>

                <Text
                  style={{
                    color: Colors.themeColor,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3.5) / 100,
                  }}>
                  {t('if_you_cant_register_txt')}
                </Text>
              </View>
            </View>

            <CommonButton
              title={t('update_btn_txt')}
              containerStyle={{marginTop: (mobileW * 8) / 100}}
              onPress={() => handleUpdate()}
            />

            <CommonModal
              visible={isUpdateModal}
              message={t('profile_update_successfully_txt')}
              btnText={t('profile_txt')}
              isIcon={localimag.icon_green_tick}
              isIconTick={true}
              onCrosspress={() => setIsUpdateModal(false)}
              button={true}
              onPress={() => {
                setIsUpdateModal(false);
                navigate('Account');
              }}
            />
          </View>
        </KeyboardAwareScrollView>

        {/* camera gallery modal for users*/}

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
                      pageType: 3,
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
                  {t('cancelmedia')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* camera gallery modal for pets */}

        <Modal animationType="slide" transparent={true} visible={petMediaModal}>
          <TouchableOpacity
            onPress={() => setPetMediaModal(false)}
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
                onPress={() => petOpenGallery({type: 1})}
                activeOpacity={0.8}
                style={styles.button}>
                <Text style={styles.buttonText}>{t('Mediagallery')}</Text>
              </TouchableOpacity>

              {/* Camera Option */}

              <TouchableOpacity
                onPress={() => petOpenCamera({type: 1})}
                activeOpacity={0.8}
                style={styles.button}>
                <Text style={styles.buttonText}>{t('MediaCamera')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => petOpenGalleryVideo({type: 2})}
                activeOpacity={0.8}
                style={styles.button}>
                <Text style={styles.buttonText}>
                  {t('video_from_gallery_txt')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setPetMediaModal(false);
                  setTimeout(() => {
                    navigation.navigate('VideoRecordingScreen', {
                      index: petSelectedSlot,
                      pageType: 4,
                      pet: true,
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
                  setPetMediaModal(false);
                }}>
                <Text style={[styles.buttonText, {color: 'red'}]}>
                  {t('cancelmedia')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Profile Edit modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isUserProfileEdit}
          requestClose={() => {
            setIsUserProfileEdit(false);
          }}>
          <TouchableOpacity
            onPress={() => {
              setIsUserProfileEdit(false);
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

        {/* Identity Modal */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isIdentityFrontModal}
          requestClose={() => {
            setIsIdentityFrontModal(false);
          }}>
          <TouchableOpacity
            onPress={() => {
              setIsIdentityFrontModal(false);
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
                    IdentityGalleryopen({type: 1});
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
                    IdentityCamerapopen({type: 1});
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
                data={RelationData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      index === RelationData.length - 1 && styles.lastOption,
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
      </View>
    </SafeAreaView>
  );
};

export default UpdateProfileNew;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.themeColor2,
  },
  itemContainer: {
    backgroundColor: Colors.themeColor,
    width: (mobileW * 29) / 100,
    paddingVertical: (mobileW * 2) / 100,
    margin: (mobileW * 1) / 100,
    paddingHorizontal: (mobileW * 1) / 100,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    borderRadius: (mobileW * 2) / 100,
    // alignItems: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: (mobileW * 3) / 100,
    marginBottom: (mobileW * 1) / 100,
    fontFamily: Font.FontMedium,
  },
  thumb: {
    backgroundColor: '#FFF',
    width: (mobileW * 2) / 100,
    height: (mobileW * 2) / 100,
    borderRadius: (mobileW * 15) / 100,
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
});
