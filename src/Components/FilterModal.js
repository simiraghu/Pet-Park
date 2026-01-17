import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  config,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  Colors,
  Font,
  apifuntion,
  consolepro,
  localStorage,
} from '../Provider/utilslib/Utils';

import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import Geolocation from '@react-native-community/geolocation';
import {SafeAreaView} from 'react-native-safe-area-context';

const screenWidth = Math.round(Dimensions.get('window').width);

const FilterModal = () => {
  const navigation = useNavigation();

  const {params} = useRoute();

  const {t} = useTranslation();

  const [categories, setCategories] = useState([
    {
      id: 1,
      catName: 'Men',
      status: false,
    },
    {
      id: 2,
      catName: 'Women',
      status: false,
    },
    {
      id: 3,
      catName: 'Both',
      status: false,
    },
  ]);

  const [relationShip, setRelationShip] = useState([
    {
      id: 1,
      relation: 'Single',
    },
    {
      id: 2,
      relation: 'Married',
    },
  ]);

  const [interestData, setInterestData] = useState([]);

  const [selectCategory, setSelectCategory] = useState(null);

  const [values, setValues] = useState([4, 8]);
  const [ageRangeValues, setAgeRangeValues] = useState([1, 4]);

  const handleSelect = id => {
    setBreed(prev => {
      if (prev?.includes(id)) {
        return prev?.filter(item => item != id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handle_category_select = id => {
    setCategorie(prev => {
      if (prev?.includes(id)) {
        return prev?.filter(item => item != id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectOther = (selectedBreedIds, selectedItems) => {
    setBreed(selectedBreedIds); // Update selected breed ids in state
    setInterestData(selectedItems); // Update the interest data with selected breeds
  };

  const handle_selected_other_category = (
    selected_category_ids,
    selected_category,
  ) => {
    setCategorie(selected_category_ids); // Update selected breed ids in state
    setPet_category_data(selected_category); // Update the interest data with selected breeds
  };

  const [isChanging, setIsChanging] = useState(false);
  const [currentStartValue, setCurrentStartValue] = useState(values[0]);
  const [currentEndValue, setCurrentEndValue] = useState(values[1]);

  const [isAgeChanging, setisAgeChanging] = useState(false);
  const [ageRangeStartValue, setAgeRangeStartValue] = useState(
    ageRangeValues[0],
  );
  const [ageRangeEndValue, setAgeRangeEndValue] = useState(ageRangeValues[1]);

  const [userAgeRangeValue, setUserAgeRangeValue] = useState([14, 28]);
  const [userAgeChangeValueStart, setUserAgeChangeValueStart] = useState(
    userAgeRangeValue[0],
  );
  const [userAgeChangeEnd, setuserAgeChangeEnd] = useState(
    userAgeRangeValue[1],
  );
  const [isUserAgeChanging, setisUserAgeChanging] = useState(false);
  const [isRelationshipStatus, setIsRelationshipStatus] = useState(null);

  const [gender, setGender] = useState('');
  const [relationStatus, setRelationStatus] = useState('');
  const [breed, setBreed] = useState([]);
  const [fromDistance, setFromDistance] = useState('');
  const [toDistance, setToDistance] = useState('');

  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');

  const [parentMinAge, setParentMinAge] = useState('');
  const [parentMaxAge, setParentMaxAge] = useState('');

  const watchID = useRef(null);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latdelta, setLatdelta] = useState(0.0922);
  const [longdelta, setLongdelta] = useState(0.0421);
  const [addressselected, setAddressSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [addLocation, setAddLocation] = useState(null);
  const [addLocationHome, setAddLocationHome] = useState(null);

  const [currentCombinedLocation, setCurrentCombinedLocation] = useState('');
  const [isLocationManuallyChanged, setIsLocationManuallyChanged] =
    useState(false);

  const [pet_category_data, setPet_category_data] = useState([]);
  const [categorie, setCategorie] = useState([]);

  const handleSliderChange = sliderValues => {
    setValues(sliderValues);
    setCurrentStartValue(sliderValues[0]);
    setFromDistance(sliderValues[0]);
    setCurrentEndValue(sliderValues[1]);
    setToDistance(sliderValues[1]);
  };

  // Function to handle start of slider interaction
  const handleSliderChangeStart = () => {
    setIsChanging(true);
  };

  // Function to handle end of slider interaction
  const handleSliderChangeEnd = () => {
    setIsChanging(false);
  };

  const handleAgeChange = ageValues => {
    setAgeRangeValues(ageValues);
    setAgeRangeStartValue(ageValues[0]);
    setMinAge(ageValues[0]);
    setAgeRangeEndValue(ageValues[1]);
    setMaxAge(ageValues[1]);
  };

  const handleAgeChangeStart = () => {
    setisAgeChanging(true);
  };

  const handleAgeChangeEnd = () => {
    setisAgeChanging(false);
  };

  const handleUserAgeChange = userAgeRangeValues => {
    setUserAgeRangeValue(userAgeRangeValues);
    setUserAgeChangeValueStart(userAgeRangeValue[0]);
    setParentMinAge(userAgeRangeValue[0]);
    setuserAgeChangeEnd(userAgeRangeValue[1]);
    setParentMaxAge(userAgeRangeValue[1]);
  };

  const handleUserAgeChangeStart = () => {
    setisUserAgeChanging(true);
  };

  const handleUserAgeChangeEndt = () => {
    setisUserAgeChanging(false);
  };

  const getPetBreed = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL = config.baseURL + 'get_all_breeds?user_id=' + userId;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            let details_arr = res?.breed_arr;
            setInterestData(details_arr);
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
          if (component.types?.includes('locality')) {
            city = component.long_name;
          }
          if (component.types?.includes('country')) {
            country = component.long_name;
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
        if (watchID.current !== null) {
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

        for (let i = 0; i < responseJson.address_components.length; i++) {
          const type = responseJson.address_components[i].types[0];
          if (type === 'locality') {
            city = responseJson.address_components[i].long_name;
            break;
          } else if (type === 'administrative_area_level_2') {
            city = responseJson.address_components[i].long_name;
          }
        }

        for (let j = 0; j < responseJson.address_components.length; j++) {
          if (
            responseJson.address_components[j].types[0] ===
            'administrative_area_level_1'
          ) {
            administrative_area_level_1 =
              responseJson.address_components[j].long_name;
          }
        }

        const details = responseJson;
        global.details = details;

        consolepro.consolelog('before google ref');

        setLatdelta(event.latitudeDelta);
        setLongdelta(event.longitudeDelta);
        setLatitude(event.latitude);
        setLongitude(event.longitude);
        setAddressSelected(details.formatted_address);
        setAddLocation({
          address: details.formatted_address,
          latitude: event.latitude,
          longitude: event.longitude,
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

  const applyFilter = () => {
    const baseFilter = {
      gender,
      breed: breed?.join(','),
      relationStatus,
      fromDistance,
      toDistance,
      minAge,
      maxAge,
      parentMinAge,
      parentMaxAge,
      categorie: categorie?.join(','),
    };

    // ✅ Only include location if manually changed by user
    if (isLocationManuallyChanged) {
      baseFilter.latitude = latitude;
      baseFilter.longitude = longitude;
      baseFilter.address = global?.add_location?.address || '';
    }

    // ✅ Apply filter
    params?.getFilteredData(baseFilter);

    // ✅ Save filter state for reuse
    localStorage.setItemObject('filter_data', baseFilter);

    // ✅ Navigate back
    navigation.goBack();
  };

  const selectedBreedItems = interestData.filter(item =>
    breed.includes(item.breed_id),
  );

  const unselectedBreedItems = interestData.filter(
    item => !breed.includes(item.breed_id),
  );

  const combinedList = [...selectedBreedItems, ...unselectedBreedItems].slice(
    0,
    7,
  );

  const selected_category_items = pet_category_data.filter(item =>
    categorie.includes(item?.pet_type_id),
  );

  consolepro.consolelog(
    'Selected category items====>>.',
    selected_category_items,
  );

  consolepro.consolelog(
    'UN Selected category items====>>.',
    un_selected_category_items,
  );
  consolepro.consolelog('Combined category items====>>.', combined_category);

  const un_selected_category_items = pet_category_data?.filter(
    item => !categorie?.includes(item?.pet_type_id),
  );

  const combined_category = [
    ...selected_category_items,
    ...un_selected_category_items,
  ].slice(0, 7);

  // Reset Button

  const handleResetButton = async () => {
    // Call the parent screen's API with empty filter values to reset them
    getlatlong();
    if (params?.getFilteredData) {
      params.getFilteredData({
        gender: '',
        breed: [],
        relationStatus: '',
        fromDistance: '',
        toDistance: '',
        minAge: '',
        maxAge: '',
        parentMinAge: '',
        parentMaxAge: '',
        latitude,
        longitude,
        categorie: [],
      });
    }
    navigation.goBack();
  };

  // get category

  const get_all_category = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const user_id = user_array?.user_id;

      const API_URL = config.baseURL + 'get_pet_type?user_id=' + user_id;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            setPet_category_data(res?.pet_type_arr);
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
          consolepro.consolelog('Error ======>>', error);
        });
    } catch (error) {
      consolepro.consolelog('Category error ========>>', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (config.device_type == 'ios') {
        setTimeout(() => {
          getPetBreed();
          get_all_category();
        }, 1200);
      } else {
        getPetBreed();
        get_all_category();
      }
    }, []),
  );

  consolepro.consolelog('Breed ====>>', breed?.join(','));
  consolepro.consolelog('Category ====>>', categorie?.join(','));

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.modalContainer}>
        {/* header */}
        <View
          style={{
            width: (mobileW * 90) / 100,
            marginTop: (mobileH * 3.5) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}>
            <Image
              source={localimag.icon_goBack}
              style={{
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
            />
          </TouchableOpacity>
        </View>

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          contentContainerStyle={{paddingBottom: (mobileW * 10) / 100}}
          keyboardShouldPersistTaps="handled">
          <View
            style={{
              marginTop: (mobileH * 3) / 100,
              width: (mobileW * 88) / 100,
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 6.5) / 100,
                fontFamily: Font.FontMedium,
              }}>
              {t('filters_txt')}
            </Text>

            <TouchableOpacity
              style={{
                borderBottomColor: Colors.whiteColor,
                borderBottomWidth: 1,
              }}
              onPress={() => {
                handleResetButton();
              }}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontSize: (mobileW * 4) / 100,
                  fontFamily: Font.FontMedium,
                }}>
                {t('reset_txt')}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: (mobileH * 3) / 100,
              paddingHorizontal: (mobileW * 5) / 100,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index.toString()}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectCategory(index);
                  setGender(item?.id);
                }}
                style={{
                  width: (mobileW * 25) / 100,
                  height: (mobileH * 5) / 100,
                  borderRadius: (mobileW * 30) / 100,
                  backgroundColor:
                    selectCategory !== index
                      ? Colors.filterDeactiveColor
                      : Colors.whiteColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: index != 0 ? (mobileW * 3) / 100 : null,
                }}>
                <Text
                  style={{
                    color:
                      selectCategory !== index
                        ? Colors.whiteColor
                        : Colors.themeColor_1,
                    fontSize: (mobileW * 4) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {item?.catName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LocationAccess', {
                locationData: {
                  latitude: latitude,
                  longitude: longitude,
                },
                onGoBack: () => {
                  setIsLocationManuallyChanged(true);
                },
              });
            }}
            activeOpacity={1}
            style={{
              marginTop: (mobileH * 3) / 100,
              width: (mobileW * 90) / 100,
              height: (mobileH * 9) / 100,
              borderRadius: (mobileW * 3) / 100,
              backgroundColor: Colors.whiteColor,
              paddingHorizontal: (mobileW * 3) / 100,
              alignItems: 'center',
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <Image
              source={localimag.icon_location}
              style={{
                width: (mobileW * 13) / 100,
                height: (mobileW * 13) / 100,
                borderRadius: (mobileW * 30) / 100,
              }}
            />

            <View
              style={{
                marginLeft: (mobileW * 3) / 100,
              }}>
              <Text
                style={{
                  fontSize: (mobileW * 3.5) / 100,
                  fontFamily: Font.FontMedium,
                  color: Colors.themeColor,
                }}>
                {t('yourCurrentLocation_txt')}
              </Text>
              <Text
                style={{
                  fontSize: (mobileW * 3.5) / 100,
                  fontFamily: Font.FontSemibold,
                  color: Colors.darkGreenColor,
                }}>
                {currentCombinedLocation}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Interests */}

          <View
            style={{
              marginTop: (mobileH * 2) / 100,
              paddingHorizontal: (mobileW * 5) / 100,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: Colors.interestDeactiveColor,
                fontSize: (mobileW * 5) / 100,
                fontFamily: Font.FontMedium,
              }}>
              {t('pet_breed_txt')}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('Interest', {
                  breed_arr: interestData,
                  handleSelect: handleSelectOther,
                  onSelectBreeds: selected => {
                    // optional callback if you want it separately
                    console.log('onSelectBreeds:', selected);
                  },
                  breed,
                })
              }>
              <Text
                style={{
                  color: Colors.whiteColor,
                  textDecorationLine: 'underline',
                  fontSize: (mobileW * 5) / 100,
                  fontFamily: Font.FontMedium,
                }}>
                {t('all_txt')}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: (mobileH * 3) / 100,
              paddingHorizontal: (mobileW * 5) / 100,
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
            }}>
            {combinedList.map((item, index) => {
              const isSelected = breed.includes(item.breed_id);

              return (
                <TouchableOpacity
                  key={index.toString()}
                  activeOpacity={0.8}
                  onPress={() => handleSelect(item.breed_id)}
                  style={{
                    paddingHorizontal: (mobileW * 5) / 100,
                    height: (mobileH * 3.8) / 100,
                    borderRadius: (mobileW * 30) / 100,
                    backgroundColor: isSelected
                      ? Colors.whiteColor
                      : Colors.filterDeactiveColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: isSelected
                        ? Colors.themeColor_1
                        : Colors.whiteColor,
                      fontSize: (mobileW * 3) / 100,
                      fontFamily: Font.FontMedium,
                    }}>
                    {item?.breed_name[config.language]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Pet Category */}

          <View
            style={{
              marginTop: (mobileH * 2) / 100,
              paddingHorizontal: (mobileW * 5) / 100,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: Colors.interestDeactiveColor,
                fontSize: (mobileW * 5) / 100,
                fontFamily: Font.FontMedium,
              }}>
              {t('pet_category_txt')}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('AllCategory', {
                  category_array: pet_category_data,
                  handle_category_select: handle_selected_other_category,
                  onSelecCategory: selected => {
                    // optional callback if you want it separately
                    console.log('on category select:', selected);
                  },
                  categorie,
                });
              }}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  textDecorationLine: 'underline',
                  fontSize: (mobileW * 5) / 100,
                  fontFamily: Font.FontMedium,
                }}>
                {t('all_txt')}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: (mobileH * 3) / 100,
              paddingHorizontal: (mobileW * 5) / 100,
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
            }}>
            {combined_category.map((item, index) => {
              const isSelected = categorie.includes(item?.pet_type_id);

              return (
                <TouchableOpacity
                  key={index.toString()}
                  activeOpacity={0.8}
                  onPress={() => handle_category_select(item?.pet_type_id)}
                  style={{
                    paddingHorizontal: (mobileW * 5) / 100,
                    height: (mobileH * 3.8) / 100,
                    borderRadius: (mobileW * 30) / 100,
                    backgroundColor: isSelected
                      ? Colors.whiteColor
                      : Colors.filterDeactiveColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: isSelected
                        ? Colors.themeColor_1
                        : Colors.whiteColor,
                      fontSize: (mobileW * 3) / 100,
                      fontFamily: Font.FontMedium,
                    }}>
                    {item?.title[config.language]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* relationship status */}
          <View
            style={{
              paddingHorizontal: (mobileW * 5) / 100,
              marginTop: (mobileW * 5) / 100,
            }}>
            <Text
              style={{
                color: Colors.interestDeactiveColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 5) / 100,
              }}>
              {t('relationship_status_txt')}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: (mobileW * 3) / 100,
              }}>
              {relationShip.map((item, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  activeOpacity={0.8}
                  onPress={() => {
                    setIsRelationshipStatus(index);
                    setRelationStatus(item?.id);
                  }}
                  style={{
                    width: (mobileW * 20) / 100,
                    height: (mobileH * 4) / 100,
                    borderRadius: (mobileW * 30) / 100,
                    backgroundColor:
                      isRelationshipStatus !== index
                        ? Colors.filterDeactiveColor
                        : Colors.whiteColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: index != 0 ? (mobileW * 3) / 100 : null,
                  }}>
                  <Text
                    style={{
                      color:
                        isRelationshipStatus !== index
                          ? Colors.whiteColor
                          : Colors.themeColor_1,
                      fontSize: (mobileW * 3) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {item?.relation}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Distance */}

          <View
            style={{
              marginTop: (mobileH * 3) / 100,
              paddingHorizontal: (mobileW * 5) / 100,
            }}>
            <Text
              style={{
                color: Colors.interestDeactiveColor,
                fontSize: (mobileW * 5) / 100,
                fontFamily: Font.FontMedium,
              }}>
              {t('distance_txt')}
            </Text>

            <MultiSlider
              values={values}
              sliderLength={(mobileW * 90) / 100}
              //onValuesChange={multiSliderValuesChange}
              onValuesChange={handleSliderChange}
              min={0}
              max={10}
              step={1}
              selectedStyle={{
                backgroundColor: Colors.whiteColor,
                paddingVertical: (mobileW * 0.5) / 100,
              }}
              unselectedStyle={{
                backgroundColor: '#6f8080',
                borderRadius: (mobileW * 10) / 100,
                paddingVertical: (mobileW * 0.5) / 100,
              }}
              markerStyle={{
                backgroundColor: Colors.whiteColor,
                borderColor: Colors.whiteColor,
                borderWidth: 5,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: {width: 1, height: 1},
                shadowOpacity: 0.5,
                height: (mobileW * 5) / 100,
                width: (mobileW * 5) / 100,
              }}
              pressedMarkerStyle={{
                backgroundColor: Colors.whiteColor,
                borderColor: Colors.whiteColor,
                borderRadius: (mobileW * 10) / 100,
              }}
              // enableLabel={isChanging ? renderCustomLabel(values[0]) : null} // Show the label only when changing
              onValuesChangeStart={handleSliderChangeStart}
              onValuesChangeFinish={handleSliderChangeEnd}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: Colors.interestDeactiveColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3) / 100,
                }}>{`0km`}</Text>
              <Text
                style={{
                  color: Colors.interestDeactiveColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3) / 100,
                }}>{`10km`}</Text>
            </View>

            {isChanging && (
              <>
                <View
                  style={[
                    styles.labelContainer,
                    {left: `${(currentStartValue / 10) * 100}%`}, // Position start label
                  ]}>
                  <Text style={styles.labelText}>{currentStartValue} km</Text>
                </View>

                <View
                  style={[
                    styles.labelContainer,
                    {left: `${(currentEndValue / 11) * 100}%`}, // Position end label
                  ]}>
                  <Text style={styles.labelText}>{currentEndValue} km</Text>
                </View>
              </>
            )}
          </View>

          {/*Pet Age range */}

          <View
            style={{
              marginTop: (mobileH * 1) / 100,
              paddingHorizontal: (mobileW * 5) / 100,
            }}>
            <Text
              style={{
                color: Colors.interestDeactiveColor,
                fontSize: (mobileW * 5) / 100,
                fontFamily: Font.FontMedium,
              }}>
              {t('petAgeRange_txt')}
            </Text>

            <MultiSlider
              values={ageRangeValues}
              sliderLength={(mobileW * 90) / 100}
              //onValuesChange={multiSliderValuesChange}
              onValuesChange={handleAgeChange}
              min={0}
              max={10}
              step={1}
              selectedStyle={{
                backgroundColor: Colors.whiteColor,
                paddingVertical: (mobileW * 0.5) / 100,
              }}
              unselectedStyle={{
                backgroundColor: '#6f8080',
                borderRadius: (mobileW * 10) / 100,
                paddingVertical: (mobileW * 0.5) / 100,
              }}
              markerStyle={{
                backgroundColor: Colors.whiteColor,
                borderColor: Colors.whiteColor,
                borderWidth: 5,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: {width: 1, height: 1},
                shadowOpacity: 0.5,
                height: (mobileW * 5) / 100,
                width: (mobileW * 5) / 100,
              }}
              pressedMarkerStyle={{
                backgroundColor: Colors.whiteColor,
                borderColor: Colors.whiteColor,
                borderRadius: (mobileW * 10) / 100,
              }}
              onValuesChangeStart={handleAgeChangeStart}
              onValuesChangeFinish={handleAgeChangeEnd}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: Colors.interestDeactiveColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3) / 100,
                }}>{`0Year`}</Text>
              <Text
                style={{
                  color: Colors.interestDeactiveColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3) / 100,
                }}>{`10Years`}</Text>
            </View>
            {isAgeChanging && (
              <>
                <View
                  style={[
                    styles.labelContainer,
                    {left: `${(ageRangeStartValue / 10) * 100}%`}, // Position start label
                  ]}>
                  <Text style={styles.labelText}>
                    {ageRangeStartValue} year
                  </Text>
                </View>

                <View
                  style={[
                    styles.labelContainer,
                    {left: `${(ageRangeEndValue / 11.5) * 100}%`}, // Position end label
                  ]}>
                  <Text style={styles.labelText}>{ageRangeEndValue} year</Text>
                </View>
              </>
            )}
          </View>

          {/* pet parent Age Range */}
          <View
            style={{
              marginTop: (mobileH * 1) / 100,
              paddingHorizontal: (mobileW * 5) / 100,
            }}>
            <Text
              style={{
                color: Colors.interestDeactiveColor,
                fontSize: (mobileW * 5) / 100,
                fontFamily: Font.FontMedium,
              }}>
              {t('pet_parent_age_range_txt')}
            </Text>

            <MultiSlider
              values={userAgeRangeValue}
              sliderLength={(mobileW * 90) / 100}
              //onValuesChange={multiSliderValuesChange}
              onValuesChange={handleUserAgeChange}
              min={0}
              max={50}
              step={1}
              selectedStyle={{
                backgroundColor: Colors.whiteColor,
                paddingVertical: (mobileW * 0.5) / 100,
              }}
              unselectedStyle={{
                backgroundColor: '#6f8080',
                borderRadius: (mobileW * 10) / 100,
                paddingVertical: (mobileW * 0.5) / 100,
              }}
              markerStyle={{
                backgroundColor: Colors.whiteColor,
                borderColor: Colors.whiteColor,
                borderWidth: 5,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: {width: 1, height: 1},
                shadowOpacity: 0.5,
                height: (mobileW * 5) / 100,
                width: (mobileW * 5) / 100,
              }}
              pressedMarkerStyle={{
                backgroundColor: Colors.whiteColor,
                borderColor: Colors.whiteColor,
                borderRadius: (mobileW * 10) / 100,
              }}
              onValuesChangeStart={handleUserAgeChangeStart}
              onValuesChangeFinish={handleUserAgeChangeEndt}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: Colors.interestDeactiveColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3) / 100,
                }}>{`0Year`}</Text>
              <Text
                style={{
                  color: Colors.interestDeactiveColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3) / 100,
                }}>{`50Years`}</Text>
            </View>
            {isUserAgeChanging && (
              <>
                <View
                  style={[
                    styles.labelContainer,
                    {left: `${(userAgeChangeValueStart / 50) * 100}%`}, // Position start label
                  ]}>
                  <Text style={styles.labelText}>
                    {userAgeChangeValueStart} year
                  </Text>
                </View>

                <View
                  style={[
                    styles.labelContainer,
                    {left: `${(userAgeChangeEnd / 55.5) * 100}%`}, // Position end label
                  ]}>
                  <Text style={styles.labelText}>{userAgeChangeEnd} year</Text>
                </View>
              </>
            )}
          </View>

          {/*--------- Apply button -------*/}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={applyFilter}
            style={{
              width: (mobileW * 70) / 100,
              height: (mobileH * 6) / 100,
              alignSelf: 'center',
              borderRadius: (mobileW * 30) / 100,
              backgroundColor: Colors.themeColor,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: (mobileH * 2) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 4) / 100,
                fontFamily: Font.FontMedium,
              }}>
              {t('apply_txt')}
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.themeColor_1,
  },
  containerStyle: {
    flex: 1,
    backgroundColor: '#00000090',
    alignItems: 'center',
  },
  subContainerStyle: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: (mobileW * 5) / 100,
    borderTopRightRadius: (mobileW * 5) / 100,
    paddingHorizontal: (mobileW * 5) / 100,
    paddingVertical: (mobileH * 1) / 100,
    paddingBottom: (mobileH * 5) / 100,
  },
  labelContainer: {
    position: 'absolute',
    top: (-mobileW * 1) / 100, // Position the label above the thumb
    backgroundColor: Colors.themeColor, // Label background color
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    borderRadius: (mobileW * 10) / 100, // Make label round
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // Ensure label is above the slider
  },
  labelText: {
    color: Colors.whiteColor, // Label text color
    fontSize: (mobileW * 3) / 100, // Adjust font size of the label text
    fontFamily: Font.FontMedium,
  },
});
