import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  BackHandler,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useCallback, useState, useRef, useEffect} from 'react';
import {
  Colors,
  config,
  Font,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  localStorage,
  consolepro,
  apifuntion,
  msgProvider,
} from '../../Provider/utilslib/Utils';
import LinearGradient from 'react-native-linear-gradient';
import BannerCarousel from 'react-native-banner-carousel';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Swiper from 'react-native-deck-swiper';
import {useTranslation} from 'react-i18next';
import SearchBar from '../../Components/SearchBar';
import Geolocation from '@react-native-community/geolocation';
import Svg, {G, Line} from 'react-native-svg';
import ApprovalModal from '../../Components/ApprovalModal';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const FriendshipHome = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deckKey, setDeckKey] = useState(0); // <== NEW

  const [slideIndex, setSlideIndex] = useState(0);

  const [showData, setShowData] = useState(false);
  const navigation = useNavigation();
  const {params} = useRoute();

  const {t} = useTranslation();

  const swiperRef = useRef(null);

  const [data, setData] = useState([]);

  const [isPageTypeValue, setisPageTypeValue] = useState('');

  const [cardIndex, setCardIndex] = useState(0);

  const [userImgArr, setuserImgArr] = useState([]);
  const [bring_type, setBring_type] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [petProfile, setPetProfile] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [originalData, setOriginalData] = useState([]);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latdelta, setLatdelta] = useState(0.0922);
  const [longdelta, setLongdelta] = useState(0.0421);
  const [addressselected, setAddressSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [addLocation, setAddLocation] = useState(null);
  const [addLocationHome, setAddLocationHome] = useState(null);
  const [apiCalling, setApiCalling] = useState(false);

  const [currentCombinedLocation, setCurrentCombinedLocation] = useState('');
  const [isUserProfileApproved, setIsUserProfileApproved] = useState(false);

  const [isProfileApprovalModal, setIsProfileApprovalModal] = useState(false);
  const [isUserApproved, setIsUserApproved] = useState(false);
  const [notification_count, setNotification_count] = useState(0);

  const flatListRef = useRef(null);
  const autoScrollRef = useRef(null);
  const [index, setIndex] = useState(0);

  const [isHideShow, setIsHideShow] = useState(true);

  const watchID = useRef(null);

  // consolepro.consolelog('Params====>', params);

  useFocusEffect(
    useCallback(() => {
      const getType = async () => {
        const type = await localStorage.getItemString('PlanAPet');
        const filteredData = await localStorage.getItemObject('filter_data');
        console.log('Filtered Data ===========>>>', filteredData);
        console.log(type, '<<<<<<type');
        setisPageTypeValue(type);
      };

      getType();
    }, []),
  );

  const Indicator = ({slides, slideIndex}) => {
    //consolepro.consolelog('currentIndex == > ', currentIndex);
    return (
      <View
        style={{
          flexDirection: 'row',
          //justifyContent: 'center',
          //alignSelf: 'center',
        }}>
        {slides.map((_, index) => (
          <View
            //key={index.toString()}
            style={{
              height: (mobileW * 0.7) / 100,
              width: (mobileW * 10) / 100,
              borderRadius: (mobileW * 1) / 100,
              backgroundColor:
                slideIndex == index ? Colors.ColorPremiumBox : '#a7a39c',
              //backgroundColor: Colors.ColorPremiumBox,
              marginHorizontal: (mobileW * 0.8) / 100,
            }}
          />
        ))}
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => backHandler.remove();
    }, [handleBackPress]),
  );

  const handleBackPress = useCallback(() => {
    BackHandler.exitApp();
    return true;
  }, []);

  const GenderDetails = [
    ['Male', 'ذكر', '男'],
    ['Female', 'أنثى', '女'],
    ['Others', 'آخرون', '其他'],
  ];

  const petAgeRanges = [
    {label: ['0-1 Year', '٠-١ سنة', '0-1 岁'], value: 1},
    {label: ['1-3 Years', '١-٣ سنوات', '1-3 岁'], value: 2},
    {label: ['3-7 Years', '٣-٧ سنوات', '3-7 岁'], value: 3},
    {label: ['7-12 Years', '٧-١٢ سنة', '7-12 岁'], value: 4},
    {label: ['12-16 Years', '١٢-١٦ سنة', '12-16 岁'], value: 5},
    {label: ['16-20 Years', '١٦-٢٠ سنة', '16-20 岁'], value: 6},
  ];

  const RealtionData = [
    ['Single', 'أعزب', '单身'],
    ['Married', 'متزوج', '已婚'],
    ['In a relationship', 'في علاقة', '恋爱中'],
    ['Divorce', 'مطلّق', '离婚'],
  ];

  const bringTypeData = [
    ['Friendship', 'صداقة', '友谊'],
    ['Planing for pet', 'التخطيط لاقتناء حيوان أليف', '计划养宠物'],
  ];

  // get Home Details ========

  const GetHomeDetails = async () => {
    try {
      setLoading(true);
      const user_array = await localStorage.getItemObject('user_array');
      consolepro.consolelog('User Array=======>>', user_array);
      const userId = user_array?.user_id;
      consolepro.consolelog('User id==========>>', userId);
      const bring_type = user_array?.bring_type;
      setBring_type(bring_type);
      setUserProfile(user_array?.user_image);
      if (user_array?.pet_images[0]?.image) {
        setPetProfile(user_array?.pet_images[0]?.image ?? '');
      }

      const API_URL = config.baseURL + 'home_page?user_id=' + userId;

      consolepro.consolelog('API url =========>>', API_URL);

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            setApiCalling(true);
            let details_arr = res?.details_arr;
            let user_images = details_arr[0]?.user_images;
            setIsUserProfileApproved(false);
            setData(res?.details_arr);
            setuserImgArr([...user_images]);
            setOriginalData(res?.details_arr);
            setShowData(true);
            setNotification_count(res?.notification_count);
          } else {
            setApiCalling(true);
            consolepro.consolelog(res);
            setData([]);
            setuserImgArr([]);
            setOriginalData([]);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
              setIsUserProfileApproved(false);
            } else if (res?.approve_flag == 0 || res?.approve_flag == 2) {
              setData([]);
              setuserImgArr([]);
              setOriginalData([]);
              setLoading(false);
              setIsUserProfileApproved(true);
              setTimeout(() => {
                msgProvider.alert(
                  t('information_txt'),
                  res?.msg[config.language],
                  false,
                );
                return false;
              }, 300);
            } else {
              consolepro.consolelog(res, '<<RES');
              setData([]);
              setuserImgArr([]);
              setOriginalData([]);
              setIsUserProfileApproved(false);
            }
          }
          setLoading(false);
          setApiCalling(true);
        })
        .catch(error => {
          consolepro.consolelog(error, '<<ERROR');
          setApiCalling(true);
          setData([]);
          setuserImgArr([]);
          setOriginalData();
          setLoading(false);
        });
    } catch (error) {
      setApiCalling(true);
      consolepro.consolelog(error, '<<ERROR');
      setData([]);
      setuserImgArr([]);
      setOriginalData([]);
      setLoading(false);
    }
  };

  const likeUserProfile = async (other_user_id, type) => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL +
        'like_user_profile?user_id=' +
        userId +
        '&other_user_id=' +
        other_user_id;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            if (res?.match_status) {
              navigation.navigate('UserMatch', {type: 1, other_user_id});
              if (type == 1) {
                swiperRef.current?.swipeRight();
              }
            } else {
              if (type == 1) {
                swiperRef.current?.swipeRight();
              }
            }
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

  const dislikeUserProfile = async (other_user_id, type) => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL +
        'dislike_user_profile?user_id=' +
        userId +
        '&other_user_id=' +
        other_user_id;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            if (type == 1) {
              swiperRef.current?.swipeLeft();
            }
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

  const onScroll = event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / slideSize);
    setSlideIndex(index);
  };

  const onswipeLeft = indx => {
    const swipedData = data[indx];
    const name = swipedData?.name;

    const otherId = swipedData?.user_id;

    consolepro.consolelog('Swiped Left on : ==> ', name);

    dislikeUserProfile(otherId);
  };

  const onswipeRight = indx => {
    const swipedData = data[indx];
    const name = swipedData?.name;

    const otherId = swipedData?.user_id;

    consolepro.consolelog('Swiped Right on : ==> ', name);

    likeUserProfile(otherId);
  };

  const buildQueryString = (params = {}) => {
    return Object.entries(params)
      .filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          value !== '' &&
          value !== 'NA',
      )
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join('&');
  };

  const filterData = async filterData => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      if (!filterData || typeof filterData !== 'object') {
        consolepro.consolelog('Invalid filterData');
        return;
      }

      const queryParams = {
        user_id: userId,
        gender: filterData?.gender,
        breed_id: filterData?.breed,
        relationship_status: filterData?.relationStatus,
        min_age: filterData?.minAge,
        max_age: filterData?.maxAge,
        parent_min_age: filterData?.parentMinAge,
        parent_max_age: filterData?.parentMaxAge,
        from_distance: filterData?.fromDistance,
        to_distance: filterData?.toDistance,
        latitude: filterData?.latitude,
        longitude: filterData?.longitude,
        address: filterData?.address,
        pet_type_id: filterData?.categorie,
      };

      const queryString = buildQueryString(queryParams);
      const API_URL = `${config.baseURL}home_page?${queryString}`;

      consolepro.consolelog('API URL +++ ', API_URL);

      const res = await apifuntion.getApi(API_URL, 1);

      if (res?.success === true && Array.isArray(res.details_arr)) {
        const details_arr = res?.details_arr;
        const user_images = details_arr[0]?.user_images || [];

        consolepro.consolelog('First User Images:', user_images);

        setData(details_arr);
        setuserImgArr([...user_images]);
        setShowData(true);
      } else {
        setData([]);
        setuserImgArr([]);
        setShowData(false);

        setApiCalling(true);
        if (res?.active_flag === 0) {
          localStorage.clear();
          navigation.navigate('WelcomeScreen');
        } else if (res?.approve_flag == 0 || res?.approve_flag == 2) {
          setData([]);
          setuserImgArr([]);
          setShowData(false);
          setLoading(false);

          setApiCalling(true);
          setIsUserProfileApproved(true);
          setTimeout(() => {
            msgProvider.alert(
              t('information_txt'),
              res?.msg[config.language],
              false,
            );
            return false;
          }, 300);

          setApiCalling(true);
        }
      }
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
      setData([]);
      setuserImgArr([]);
      setShowData(false);

      setApiCalling(true);
    }
  };

  const renderCard = (item, index) => {
    if (!item) return null;
    return (
      <TouchableOpacity
        activeOpacity={1}
        // disabled={!isUserApproved}
        onPress={() => {
          item?.bring_type == 1
            ? navigation.navigate('WishingPetParentUserDetails', {
                other_user_id: item?.user_id,
              })
            : navigation.navigate('UserDetails', {
                other_user_id: item?.user_id,
              });
        }}
        style={{
          width: (mobileW * 90) / 100,
          alignSelf: 'center',
          height:
            config.device_type == 'ios'
              ? (mobileH * 62) / 100
              : (mobileH * 65) / 100,
          backgroundColor: Colors.homeCardbackgroundColor,
          borderRadius: (mobileW * 3) / 100,
        }}>
        <View>
          {/* Using BannerCarousel instead of FlatList */}
          <BannerCarousel
            key={`${item?.user_id}-${item?.user_images?.length}`}
            autoplay
            autoplayTimeout={3000}
            loop
            index={0}
            showsPageIndicator={false}
            pageIndicatorContainerStyle={{
              width: (mobileW * 0) / 100,
              height: (mobileH * 0) / 100,
            }}
            activePageIndicatorStyle={{
              width: (mobileW * 0) / 100,
              height: (mobileH * 0) / 100,
            }}
            pageSize={(mobileW * 90) / 100}
            onPageChanged={index => setSlideIndex(index)}>
            {item?.user_images?.map((childItem, carouselIndex) => (
              <TouchableOpacity
                activeOpacity={1}
                // disabled={!isUserApproved}
                onPress={() => {
                  item?.bring_type == 1
                    ? navigation.navigate('WishingPetParentUserDetails', {
                        other_user_id: item?.user_id,
                      })
                    : navigation.navigate('UserDetails', {
                        other_user_id: item?.user_id,
                      });
                }}>
                <ImageBackground
                  source={
                    childItem?.type == 2
                      ? {uri: config.img_url + childItem?.thumbnail}
                      : {uri: config.img_url + childItem?.image}
                  }
                  style={{
                    width: (mobileW * 90) / 100,
                    height:
                      config.device_type == 'ios'
                        ? (mobileH * 25) / 100
                        : (mobileH * 28) / 100,
                    position: 'relative',
                  }}
                  imageStyle={{
                    borderRadius: (mobileW * 4) / 100,
                  }}>
                  <LinearGradient
                    colors={['rgba(0,0,0,0.5)', 'transparent']}
                    style={styles.gradient}
                  />
                  <View
                    style={{
                      marginTop: (mobileH * 1.5) / 100,
                    }}>
                    <View
                      style={{
                        paddingHorizontal: (mobileW * 5) / 100,
                      }}>
                      <Indicator
                        slides={item?.user_images}
                        slideIndex={carouselIndex}
                      />

                      <TouchableOpacity
                        activeOpacity={1}
                        style={{
                          paddingHorizontal: (mobileW * 2) / 100,
                          paddingVertical: (mobileW * 1) / 100,
                          borderRadius: (mobileW * 30) / 100,
                          backgroundColor: '#97958a',
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'flex-end',
                          flexDirection: 'row',
                          marginTop: (mobileW * 1) / 100,
                        }}>
                        <Image
                          source={localimag.icon_userLocation}
                          style={{
                            width: (mobileW * 3.2) / 100,
                            height: (mobileW * 3.2) / 100,
                          }}
                        />
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{
                            color: Colors.whiteColor,
                            fontSize: (mobileW * 3) / 100,
                            fontFamily: Font.FontSemibold,
                            marginLeft: (mobileW * 1) / 100,
                            flexShrink: 1,
                            maxWidth: (mobileW * 50) / 100,
                          }}>
                          {item?.address}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        //backgroundColor: '#00000010',
                        marginTop: (mobileH * 3.5) / 100,
                      }}>
                      <View
                        style={{
                          paddingHorizontal: (mobileW * 5) / 100,
                          paddingBottom: (mobileH * 1) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.whiteColor,
                            fontSize: (mobileW * 7) / 100,
                            fontFamily: Font.FontBold,
                            zIndex: 5,
                          }}>
                          {item?.name}
                        </Text>

                        <Text
                          numberOfLines={2}
                          style={{
                            color: Colors.whiteColor,
                            fontSize: (mobileW * 3.4) / 100,
                            fontFamily: Font.FontMedium,
                            textAlign: 'justify',
                            zIndex: 5,
                          }}>
                          {item?.about?.slice(0, 150)}
                        </Text>

                        <View
                          style={{
                            marginTop: (mobileH * 1) / 100,
                            flexDirection: 'row',
                            alignItems: 'center',
                            zIndex: 5,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <View
                              // activeOpacity={1}
                              style={{
                                width: (mobileW * 20) / 100,
                                paddingHorizontal: (mobileW * 2) / 100,
                                height: (mobileH * 3.5) / 100,
                                borderRadius: (mobileW * 30) / 100,
                                backgroundColor: '#A2A19FFF',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft:
                                  index != 0 ? (mobileW * 1) / 100 : null,
                                opacity: 0.8,
                                marginTop: (mobileW * 2) / 100,
                              }}>
                              <Text
                                numberOfLines={1}
                                style={{
                                  color: Colors.whiteColor,
                                  fontSize: (mobileW * 2.8) / 100,
                                  fontFamily: Font.FontSemibold,
                                }}>
                                {item?.bring_type != undefined &&
                                item?.bring_type == 0
                                  ? 'Friendship'
                                  : 'Planning a pet'}
                              </Text>
                            </View>

                            <View
                              // activeOpacity={1}
                              style={{
                                width: (mobileW * 20) / 100,
                                paddingHorizontal: (mobileW * 2) / 100,
                                height: (mobileH * 3.5) / 100,
                                borderRadius: (mobileW * 30) / 100,
                                backgroundColor: '#A2A19FFF',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft:
                                  index != 0 ? (mobileW * 1) / 100 : null,
                                opacity: 0.8,
                                marginTop: (mobileW * 2) / 100,
                                marginLeft: (mobileW * 1) / 100,
                              }}>
                              <Text
                                numberOfLines={1}
                                style={{
                                  color: Colors.whiteColor,
                                  fontSize: (mobileW * 2.8) / 100,
                                  fontFamily: Font.FontSemibold,
                                }}>
                                {item?.occupation}
                              </Text>
                            </View>

                            <View
                              // activeOpacity={1}
                              style={{
                                width: (mobileW * 20) / 100,
                                height: (mobileH * 3.5) / 100,
                                borderRadius: (mobileW * 30) / 100,
                                backgroundColor: '#A2A19FFF',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft:
                                  index != 0 ? (mobileW * 1) / 100 : null,
                                opacity: 0.8,
                                marginTop: (mobileW * 2) / 100,
                                marginLeft: (mobileW * 1) / 100,
                              }}>
                              <Text
                                style={{
                                  color: Colors.whiteColor,
                                  fontSize: (mobileW * 2.8) / 100,
                                  fontFamily: Font.FontSemibold,
                                }}>
                                {item?.gender &&
                                  GenderDetails[item?.gender - 1][
                                    config.language
                                  ]}
                              </Text>
                            </View>

                            <View
                              // activeOpacity={1}
                              style={{
                                width: (mobileW * 20) / 100,
                                height: (mobileH * 3.5) / 100,
                                borderRadius: (mobileW * 30) / 100,
                                backgroundColor: '#97958a',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft:
                                  index != 0 ? (mobileW * 1) / 100 : null,
                                opacity: 0.8,
                                marginTop: (mobileW * 2) / 100,
                                marginLeft: (mobileW * 1) / 100,
                              }}>
                              <Text
                                numberOfLines={1}
                                style={{
                                  color: Colors.whiteColor,
                                  fontSize: (mobileW * 2.8) / 100,
                                  fontFamily: Font.FontSemibold,
                                }}>
                                {item?.relationship_status &&
                                  RealtionData[item?.relationship_status - 1][
                                    config.language
                                  ]}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.5)']}
                    style={styles.gradientBottom}
                  />
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </BannerCarousel>
        </View>

        <View
          style={{
            flex: 1,
            paddingHorizontal: (mobileW * 5) / 100,
            marginTop: (mobileH * 1.5) / 100,
          }}>
          {item?.bring_type == 1 ? (
            <View
              style={{
                alignSelf: 'center',
                marginTop: (mobileW * 5) / 100,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  width: (mobileW * 80) / 100,
                  height: (mobileW * 11) / 100,
                  borderRadius: (mobileW * 10) / 100,
                  backgroundColor: Colors.wishingToParentHeadingColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {t('wishingTobePetParent_txt')}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: (mobileW * 5) / 100,
                }}>
                <View
                  style={{
                    backgroundColor: Colors.themeColor2,
                    width: (mobileW * 20) / 100,
                    height: (mobileW * 8) / 100,
                    borderRadius: (mobileW * 10) / 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3) / 100,
                    }}>
                    {item?.pet_type[config.language]}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: Colors.themeColor2,
                    width: (mobileW * 20) / 100,
                    height: (mobileW * 8) / 100,
                    paddingHorizontal: (mobileW * 1) / 100,
                    borderRadius: (mobileW * 10) / 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: (mobileW * 1) / 100,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3) / 100,
                    }}>
                    {item?.breed_name[config.language]}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: Colors.themeColor2,
                    width: (mobileW * 20) / 100,
                    height: (mobileW * 8) / 100,
                    borderRadius: (mobileW * 10) / 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: (mobileW * 1) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3) / 100,
                    }}>
                    {item?.pet_gender == 2
                      ? 'Female'
                      : item?.pet_gender == 1
                      ? 'Male'
                      : 'Both'}
                  </Text>
                </View>
              </View>
              <View style={{height: (mobileW * 18) / 100}}>
                <Text
                  numberOfLines={3}
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3.8) / 100,
                    marginTop: (mobileW * 2) / 100,
                  }}>
                  {item?.note?.slice(0, 130)}
                </Text>
              </View>
            </View>
          ) : (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.darkGreenColor,
                    fontSize: (mobileW * 4.5) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {item?.pet_name}
                </Text>

                <Image
                  source={localimag.icon_meetLine}
                  style={{
                    width: (mobileW * 47) / 100,
                    height: (mobileW * 12) / 100,
                    marginLeft: (mobileW * 2) / 100,
                    resizeMode: 'contain',
                    marginTop: (-mobileH * 1) / 100,
                  }}
                />

                <Text
                  style={{
                    color: Colors.darkGreenColor,
                    fontSize: (mobileW * 4.5) / 100,
                    fontFamily: Font.FontMedium,
                    marginLeft: (mobileW * 0.5) / 100,
                    marginTop: (-mobileH * 3) / 100,
                  }}>
                  Meet
                </Text>
              </View>

              <Text
                numberOfLines={3}
                style={{
                  color: Colors.darkGreenColor,
                  fontSize: (mobileW * 3.3) / 100,
                  fontFamily: Font.FontMedium,
                  textAlign: 'justify',
                }}>
                {item?.about?.slice(0, 130)}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  right: (mobileW * 0.8) / 100,
                  width: (mobileW * 90) / 100,
                  alignSelf: config.language == 1 ? 'flex-end' : 'flex-start',
                }}>
                <FlatList
                  data={
                    item?.behaviors
                      ? Object.entries(item.behaviors).slice(0, 3)
                      : []
                  }
                  keyExtractor={([key], index) => key + index}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{gap: (mobileW * 1) / 100}}
                  renderItem={({item, index}) => {
                    const [key, value] = item;
                    const progress = value; // This is your progress percentage

                    const radius = 15;
                    const strokeWidth = 3;
                    const size = radius * 2 + 5;
                    const center = size / 2;
                    const totalSegments = 60;
                    const angleStep = 360 / totalSegments;

                    const getSegmentColor = index => {
                      const activeSegments = Math.round(
                        (progress / 100) * totalSegments,
                      );
                      if (index >= activeSegments) return '#2b2b2b';

                      const ratio = index / totalSegments;
                      if (ratio < 0.25) return '#019686';
                      if (ratio < 0.5) return '#019686';
                      return '#019686';
                    };

                    const segments = Array.from({length: totalSegments}).map(
                      (_, i) => {
                        const angle = angleStep * i - 90;
                        const rad = (angle * Math.PI) / 180;
                        const x1 =
                          center + (radius - strokeWidth) * Math.cos(rad);
                        const y1 =
                          center + (radius - strokeWidth) * Math.sin(rad);
                        const x2 = center + radius * Math.cos(rad);
                        const y2 = center + radius * Math.sin(rad);

                        return (
                          <Line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={getSegmentColor(i)}
                            strokeWidth={0.99}
                            strokeLinecap="round"
                          />
                        );
                      },
                    );

                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: (mobileW * 25) / 100,
                        }}>
                        <Svg width={size} height={size}>
                          <G>{segments}</G>
                        </Svg>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 3.5) / 100,
                            marginLeft: (mobileW * 1) / 100,
                            flexShrink: 1,
                            flex: 1,
                            textAlign: 'left',
                          }}>
                          {key.replace('_', ' ')}
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>

              <View
                style={{
                  marginTop: (mobileH * 1) / 100,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {item?.pet_images?.slice(0, 4)?.map((item, index) => {
                  return (
                    <Image
                      key={index.toString()}
                      source={
                        item?.image && item?.type == 2
                          ? {
                              uri: config.img_url + item?.thumbnail,
                            }
                          : {uri: config.img_url + item?.image}
                      }
                      style={{
                        width: (mobileW * 18) / 100,
                        height: (mobileW * 18) / 100,
                        marginLeft: index != 0 ? (mobileW * 2) / 100 : null,
                        borderRadius: (mobileW * 3) / 100,

                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 3,
                        },
                        shadowOpacity: 0.29,
                        shadowRadius: 4.65,

                        elevation: 7,
                      }}
                    />
                  );
                })}
              </View>
            </>
          )}

          {/* bark off and woof yes view */}

          <View
            style={{
              marginTop: (mobileH * 1.5) / 100,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              // onPress={swipeNext}

              disabled={!isUserApproved}
              onPress={() => {
                dislikeUserProfile(item?.user_id, 1);
                //swiperRef.current?.swipeLeft(); // or swipeRight() depending on your use case
              }}
              activeOpacity={1}
              style={{
                width: (mobileW * 38) / 100,
                height: (mobileH * 5.5) / 100,
                borderRadius: (mobileW * 30) / 100,
                justifyContent: 'center',
                alignItems: 'center',
                // borderWidth: 1,
                // borderColor: Colors.darkGreenColor,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,
                elevation: 5,
                backgroundColor: Colors.themeColor2,
              }}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontSize: (mobileW * 3.8) / 100,
                  fontFamily: Font.FontMedium,
                }}>
                {t('bark_off_txt')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              disabled={!isUserApproved}
              onPress={() => {
                // index === 1 ?
                //handleStartChatWoofYes();
                likeUserProfile(item?.user_id, 1);
                // :
                // handleSwipeNext();
              }}
              style={{
                width: (mobileW * 38) / 100,
                height: (mobileH * 5.5) / 100,
                borderRadius: (mobileW * 30) / 100,
                backgroundColor: Colors.WoofYesBtn,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 5.65,
                elevation: 7,
              }}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontSize: (mobileW * 3.8) / 100,
                  fontFamily: Font.FontSemibold,
                }}>
                {t('woof_yes_txt')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSearchBar = (text = '') => {
    setSearchText(text);
    consolepro.consolelog(text, '<<Search text');

    if (text.trim() === '') {
      setData(originalData);
      setDeckKey(prev => prev + 1); // 🔁 Reset swiper
      return;
    }

    setIsSearch(true);
    const filteredUsers = originalData.filter(item =>
      (item?.name ?? '').toLowerCase().includes(text.toLowerCase()),
    );

    consolepro.consolelog(filteredUsers, '<<Filtered users');
    setData(filteredUsers);
    setDeckKey(prev => prev + 1); // 🔁 Reset swiper
  };

  useFocusEffect(
    useCallback(() => {
      setSearchText('');
      setData(originalData);
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setApiCalling(true);
      const fetchData = async () => {
        setCardIndex(0);
        setSlideIndex(0);
        setDeckKey(prev => prev + 1);
        setApiCalling(true);

        const filterDataStored = await localStorage.getItemObject(
          'filter_data',
        );
        console.log('Filtered Data ===========>>>', filterDataStored);

        const isFilterActive =
          filterDataStored &&
          Object.values(filterDataStored).some(
            val =>
              val !== '' && val !== undefined && val !== null && val !== 'NA',
          );

        if (!isActive) return;

        const run = async () => {
          if (isFilterActive) {
            await filterData(filterDataStored);
            await localStorage.removeItem('filter_data'); // ✅ Clear filter after use
          } else {
            await GetHomeDetails();
          }
        };

        if (config.device_type === 'ios') {
          setTimeout(() => {
            if (isActive) run();
          }, 200);
        } else {
          run();
        }
      };

      fetchData();

      return () => {
        isActive = false;
        setApiCalling(false);
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const isGlobalDetailsValid =
        global?.details &&
        global?.details !== 'NA' &&
        global?.details?.geometry?.location;

      if (!isGlobalDetailsValid) {
        const delay = config.device_type == 'ios' ? 1200 : 500;
        setTimeout(() => {
          getlatlong();
          consolepro.consolelog('Calling getlatlong()');
        }, delay);
      } else {
        consolepro.consolelog('Using existing global.details', global?.details);

        const location = global?.details?.geometry?.location;
        const components = global?.details?.address_components || [];

        setLatitude(location?.lat);
        setLongitude(location?.lng);

        let city = '';
        let country = '';

        components.forEach(component => {
          if (component?.types?.includes('locality')) {
            city = component.long_name;
          }
          if (component?.types?.includes('country')) {
            country = component?.long_name;
          }
        });

        const combinedLocation =
          city && country
            ? `${city}, ${country}`
            : city
            ? city
            : country
            ? country
            : '';

        setCurrentCombinedLocation(combinedLocation);
      }

      return () => {
        if (watchID?.current !== null) {
          Geolocation.clearWatch(watchID.current);
        }
      };
    }, [global?.details]),
  );

  // Request permission and get current location

  const getlatlong = async () => {
    let permission = await localStorage.getItemString('permission');

    if (permission !== 'denied') {
      if (Platform.OS === 'ios') {
        callLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            callLocation();
          } else {
            localStorage.setItemString('permission', 'denied');
            getalldata({
              coords: {latitude, longitude},
            });
          }
        } catch (err) {
          console.warn(err);
        }
      }
    } else {
      getalldata({
        coords: {latitude, longitude},
      });
    }
  };

  // Get current location and watch updates

  const callLocation = () => {
    localStorage.getItemObject('position').then(position => {
      let pointcheck = 0;

      if (position != null) {
        // Use cached position immediately
        getalldata(position);

        // Then get a fresh location with relaxed accuracy for quick response
        Geolocation.getCurrentPosition(
          pos => {
            localStorage.setItemObject('position', pos);
            getalldata(pos);
            pointcheck = 1;
          },
          err => {
            // fallback to cached
            getalldata(position);
          },
          {enableHighAccuracy: false, timeout: 5000, maximumAge: 10000},
        );

        // Start watching for higher accuracy updates after initial quick fetch
        watchID.current = Geolocation.watchPosition(
          pos => {
            if (pointcheck !== 1) {
              localStorage.setItemObject('position', pos);
              getalldata(pos);
            }
          },
          err => console.warn(err),
          {enableHighAccuracy: true, distanceFilter: 10, interval: 10000},
        );
      } else {
        // No cached position, just get current with relaxed accuracy
        Geolocation.getCurrentPosition(
          pos => {
            localStorage.setItemObject('position', pos);
            getalldata(pos);
            pointcheck = 1;
          },
          err => {
            getalldata({coords: {latitude, longitude}});
          },
          {enableHighAccuracy: false, timeout: 5000, maximumAge: 10000},
        );

        watchID.current = Geolocation.watchPosition(
          pos => {
            if (pointcheck !== 1) {
              localStorage.setItemObject('position', pos);
              getalldata(pos);
            }
          },
          err => console.warn(err),
          {enableHighAccuracy: true, distanceFilter: 10, interval: 10000},
        );
      }
    });
  };

  // Handle location data and update state

  const getalldata = async position => {
    const {latitude: lat, longitude: lng} = position.coords;
    setLatitude(lat);
    setLongitude(lng);
    setLoading(false);

    const event = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: latdelta,
      longitudeDelta: longdelta,
    };

    await getadddressfromlatlong(event);
  };

  // Reverse geocode lat/long to address and update state

  const getadddressfromlatlong = event => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${event.latitude},${event.longitude}&key=${config.mapkey}&language=${config.maplanguage}`,
    )
      .then(response => response.json())
      .then(resp => {
        let responseJson = resp.results[0];
        let city = '';
        let administrative_area_level_1 = '';

        for (let i = 0; i < responseJson?.address_components?.length; i++) {
          const type = responseJson?.address_components[i]?.types[0];
          if (type === 'locality') {
            city = responseJson?.address_components[i].long_name;
            break;
          } else if (type === 'administrative_area_level_2') {
            city = responseJson?.address_components[i].long_name;
          }
        }

        for (let j = 0; j < responseJson?.address_components?.length; j++) {
          if (
            responseJson?.address_components[j]?.types[0] ===
            'administrative_area_level_1'
          ) {
            administrative_area_level_1 =
              responseJson?.address_components[j]?.long_name;
          }
        }

        const details = responseJson;
        global.details = details;
        global.add_location = {
          address: details?.formatted_address,
          latitude: event.latitude,
          longitude: event.longitude,
        };
        consolepro.consolelog(
          'Global add location==========>>',
          global.add_location,
        );
        consolepro.consolelog('Formated address', details);

        consolepro.consolelog('before google ref');

        setLatdelta(event.latitudeDelta);
        setLongdelta(event.longitudeDelta);
        setLatitude(event.latitude);
        setLongitude(event.longitude);
        setAddressSelected(details.formatted_address);
        setAddLocation({
          address: details.address_components[0]?.short_name,
          latitude: event.latitude,
          longitude: event.longitude,
          long_name2: details.address_components[0]?.short_name,
        });
        setAddLocationHome(details);
        consolepro.consolelog('after google ref');
        // localStorage.setItemString('add_location', addLocation);
        // Optional logging
        consolepro.consolelog(
          'Address:=============>>',
          details?.address_components?.[0]?.short_name,
        );
        consolepro.consolelog('Latitude:=============>>', event?.latitude);
        consolepro.consolelog('Longitude:=============>>', event.longitude);
        consolepro.consolelog(
          'long name:=============>>',
          details.address_components[0]?.short_name,
        );
      });
  };

  const get_user_approval_status = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL + 'check_user_profile_approve?user_id=' + userId;

      consolepro.consolelog('API URL for approval status ===> ', API_URL);

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<User Approval Status');
            if (res?.approve_flag === 1) {
              setIsUserApproved(true);
              setIsProfileApprovalModal(false);
            } else {
              setIsUserApproved(false);
              setIsProfileApprovalModal(true);
            }
          } else {
            consolepro.consolelog(res, '<<Error in getting approval status');
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Error in getting approval status');
        });
    } catch (error) {
      consolepro.consolelog('Error =======>>', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      get_user_approval_status();
    }, []),
  );

  const payment_hide_or_show = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const user_id = user_array?.user_id;

      const API_URL = config.baseURL + 'get_payment_status';

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success === true) {
            consolepro.consolelog(res, '<<<Payment status');
            config.razorpay_key_id = res?.statusArr?.razorpay_key_id;
            config.razorpay_secret_key = res?.statusArr?.razorpay_secret_key;
            if (res?.statusArr?.status == 0) {
              setIsHideShow(true); // Show payment feature
            } else {
              setIsHideShow(false); // Hide payment feature
            }
          } else {
            consolepro.consolelog(
              'Payment status API returned success = false',
            );
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<<<<< API error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<<<<< Try-Catch error');
    }
  };

  useFocusEffect(
    useCallback(() => {
      payment_hide_or_show();
    }, []),
  );

  return (
    // <SafeAreaProvider style={styles.container}>
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* {showData && ( */}
        <>
          {/* header View */}

          <View
            style={{
              paddingHorizontal: (mobileW * 5) / 100,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: (mobileH * 2) / 100,
            }}>
            {isSearch ? (
              <TextInput
                style={{
                  width: (mobileW * 60) / 100,
                  marginTop: (mobileW * 1) / 100,
                  backgroundColor: Colors.ColorSearchBar,
                  color: Colors.themeColor2,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 3.2) / 100,
                  borderRadius: (mobileW * 10) / 100,
                  height: (mobileH * 5.5) / 100,
                  paddingHorizontal: (mobileW * 5) / 100,
                }}
                placeholder={t('search_txt')}
                value={searchText}
                onChangeText={text => {
                  setSearchText(text);
                  handleSearchBar(text);
                }}
                placeholderTextColor={Colors.themeColor2}
                maxLength={250}
                keyboardType="default"
              />
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('LocationAccess', {
                    locationData: {
                      latitude: latitude,
                      longitude: longitude,
                    },
                  });
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity activeOpacity={0.8}>
                  <Image
                    source={localimag.icon_location}
                    style={{
                      width: (mobileW * 12) / 100,
                      height: (mobileW * 12) / 100,
                    }}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    marginLeft: (mobileW * 1.5) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.themeColor,
                      fontSize: (mobileW * 3.3) / 100,
                      fontFamily: Font.FontMedium,
                    }}>
                    {t('yourLocation_txt')}
                  </Text>
                  <Text
                    style={{
                      color: Colors.blackColor,
                      fontSize: (mobileW * 3.3) / 100,
                      fontFamily: Font.FontMedium,
                    }}>
                    {currentCombinedLocation}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={!isUserApproved}
                onPress={() => {
                  setIsSearch(!isSearch);
                }}>
                <Image
                  source={localimag.icon_search}
                  style={{
                    width: (mobileW * 6) / 100,
                    height: (mobileW * 6) / 100,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Notification')}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Notification')}
                  activeOpacity={0.8}
                  style={{
                    marginLeft: (mobileW * 2) / 100,
                  }}>
                  <Image
                    source={localimag.icon_bell}
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                  />
                </TouchableOpacity>
                {notification_count > 0 && (
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      backgroundColor: Colors.cancleColor,
                      borderRadius: (mobileW * 50) / 100,
                      position: 'absolute',
                      right: 0,
                    }}></View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  bring_type == 0
                    ? navigation.navigate('UpdateProfileNew')
                    : navigation.navigate('WithoutPetProfile');
                }}>
                <View
                  style={{
                    // backgroundColor: 'blue',
                    // alignSelf: 'flex-start',
                    borderRadius: (mobileW * 30) / 100,
                    overflow: 'hidden',
                    marginLeft: (mobileW * 2) / 100,
                  }}>
                  <Image
                    source={
                      userProfile
                        ? {uri: config.img_url + userProfile}
                        : localimag.icon_profile_user
                    }
                    style={{
                      width: (mobileH * 5) / 100,
                      height: (mobileH * 5) / 100,
                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      ],
                    }}
                  />
                </View>

                {bring_type == 0 && (
                  <View
                    style={{
                      // backgroundColor: 'blue',
                      alignSelf: 'flex-start',
                      borderRadius: (mobileW * 30) / 100,
                      overflow: 'hidden',
                      position: 'absolute',
                      right: 0,
                    }}>
                    <Image
                      source={
                        petProfile
                          ? {
                              uri: config.img_url + petProfile,
                            }
                          : localimag.icon_add_pet_photo
                      }
                      style={{
                        width: (mobileW * 4) / 100,
                        height: (mobileW * 4) / 100,
                        transform: [
                          config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                        ],
                      }}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* ----------Filter View ---------- */}
          {/* {!isUserProfileApproved && ( */}

          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <View
              style={{
                marginTop: (mobileH * 2.5) / 100,
                paddingHorizontal: (mobileW * 5) / 100,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={!isUserApproved}
                onPress={() =>
                  navigation.navigate('FilterModal', {
                    getFilteredData: filterData,
                  })
                }>
                <Image
                  source={localimag.icon_greenFilter}
                  style={{
                    width: (mobileW * 8) / 100,
                    height: (mobileW * 8) / 100,
                  }}
                />
              </TouchableOpacity>

              {!isHideShow && (
                <TouchableOpacity
                  disabled={!isUserApproved}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('Subscription', {type: 'home'})
                  }
                  style={{
                    width: (mobileW * 32) / 100,
                    height: (mobileH * 4.5) / 100,
                    borderRadius: (mobileW * 30) / 100,
                    backgroundColor: Colors.blackColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: Colors.premiumColor,
                  }}>
                  <Text
                    style={{
                      color: Colors.premiumColor,
                      fontSize: (mobileW * 3.5) / 100,
                      fontFamily: Font.FontMedium,
                    }}>
                    {t('premium_txt')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>

          {/* )} */}

          {/* user card swipe View*/}

          {apiCalling == true && (
            <TouchableOpacity
              activeOpacity={1}
              style={{flex: 1, marginTop: 0, paddingTop: 0}}>
              {loading ? null : data && data != 'NA' ? (
                <Swiper
                  ref={swiperRef}
                  key={`deck-${deckKey}-${isUserApproved}`}
                  cards={data}
                  cardIndex={cardIndex}
                  onSwiped={index => setCardIndex(index + 1)}
                  onSwipedAll={async () => {
                    console.log('🔥 All cards swiped!');
                    setTimeout(async () => {
                      setCardIndex(0);
                      setSlideIndex(0);
                      setDeckKey(prev => prev + 1);

                      const filterDataStored = await localStorage.getItemObject(
                        'filter_data',
                      );
                      const isFilterActive =
                        filterDataStored &&
                        Object.values(filterDataStored).some(
                          val =>
                            val !== '' &&
                            val !== undefined &&
                            val !== null &&
                            val !== 'NA',
                        );

                      const run = async () => {
                        if (isFilterActive) {
                          await filterData(filterDataStored);
                          await localStorage.removeItem('filter_data'); // Clear it after use
                        } else {
                          await GetHomeDetails();
                        }
                      };

                      if (config.device_type === 'ios') {
                        setTimeout(() => {
                          run();
                        }, 1200);
                      } else {
                        run();
                      }
                    }, 300);
                  }}
                  onSwipedLeft={index => {
                    onswipeLeft(index);
                  }}
                  onSwipedRight={index => {
                    onswipeRight(index);
                  }}
                  disableBottomSwipe={true}
                  disableTopSwipe={true}
                  // disableLeftSwipe={false} // ✅ allow swipe if approved
                  // disableRightSwipe={false}
                  disableLeftSwipe={!isUserApproved} // ✅ allow swipe if approved
                  disableRightSwipe={!isUserApproved}
                  verticalSwipe={false}
                  backgroundColor={Colors.whiteColor}
                  stackSize={2}
                  stackSeparation={0}
                  stackScale={1}
                  animateCardOpacity={false}
                  containerStyle={{
                    marginTop: 0,
                    paddingTop: 0,
                  }}
                  cardVerticalMargin={(mobileW * 7) / 100}
                  renderCard={renderCard}
                />
              ) : (
                <View>
                  {apiCalling == true && (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontFamily: Font.FontBold,
                          fontSize: (mobileW * 4.5) / 100,
                        }}>
                        {t('no_data_found_txt')}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          )}
        </>

        <ApprovalModal
          isVisible={isProfileApprovalModal}
          onClose={() => setIsProfileApprovalModal(false)}
          onReject={reason => {}}
        />
      </View>
    </SafeAreaView>
    // </SafeAreaProvider>
  );
};

export default FriendshipHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    borderRadius: (mobileW * 4) / 100,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
    borderRadius: (mobileW * 4) / 100,
  },
});
