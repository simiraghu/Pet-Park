import {
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import SearchBar from '../Components/SearchBar';
import {Lang_chg} from '../Provider/Language_provider';
import {config} from '../Provider/configProvider';
import {
  Colors,
  consolepro,
  Font,
  localimag,
  mobileH,
  mobileW,
  localStorage,
  Currentltlg,
} from '../Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import CommonButton from '../Components/CommonButton';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {SafeAreaView} from 'react-native-safe-area-context';

const UseCurrentLocation = ({navigation}) => {
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
  const [add_my_location, setAdd_my_location] = useState('');
  const [latdelta, setLatdelta] = useState('0.0922');
  const [longdelta, setLongdelta] = useState('0.0421');
  const [long_name, setLong_name] = useState('');
  const [long_name1, setLong_name1] = useState('');
  const [long_name2, setLong_name2] = useState('');
  const GooglePlacesRef = useRef();
  const watchID = useRef(null);
  const {t} = useTranslation();

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

  // Get Current Location ============

  const getCurrentLocation = async () => {
    let permission = await localStorage.getItemString('permission');
    if (permission != 'denied') {
      //Checking for the permission just after component loaded
      if (Platform.OS === 'ios') {
        callLocation();
      } else {
        // this.callLocation(that);
        async function requestLocationPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            consolepro.consolelog(
              'granted',
              PermissionsAndroid.RESULTS.GRANTED,
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              callLocation();
            } else {
              let position = {
                coords: {
                  latitude: latitude,
                  longitude: longitude,
                },
              };
              localStorage.setItemString('permission', 'denied');
              getalldata(position);
            }
          } catch (err) {
            console.warn(err);
          }
        }
        requestLocationPermission();
      }
    } else {
      let position = {
        coords: {
          latitude: latitude,
          longitude: longitude,
        },
      };
      getalldata(position);
    }
  };

  const callLocation = async that => {
    localStorage.getItemObject('position').then(position => {
      consolepro.consolelog('position', position);
      if (position != null) {
        var pointcheck1 = 0;
        getalldata(position);
        Geolocation.getCurrentPosition(
          //Will give you the current location
          position => {
            localStorage.setItemObject('position', position);
            getalldata(position);
            pointcheck1 = 1;
          },
          error => {
            let position = {
              coords: {
                latitude: latitude,
                longitude: longitude,
              },
            };

            getalldata(position);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
        );
        watchID = Geolocation.watchPosition(position => {
          //Will give you the location on location change
          consolepro.consolelog('data', position);

          if (pointcheck1 != 1) {
            localStorage.setItemObject('position', position);
            getalldata(position);
          }
        });
      } else {
        consolepro.consolelog('helo gkjodi');
        var pointcheck = 0;
        Geolocation.getCurrentPosition(
          //Will give you the current location
          position => {
            localStorage.setItemObject('position', position);

            getalldata(position);
            pointcheck = 1;
          },
          error => {
            let position = {
              coords: {
                latitude: latitude,
                longitude: longitude,
              },
            };

            getalldata(position);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
        );
        watchID = Geolocation.watchPosition(position => {
          //Will give you the location on location change
          consolepro.consolelog('data', position);

          if (pointcheck != 1) {
            localStorage.setItemObject('position', position);
            getalldata(position);
          }
        });
      }
    });
  };

  const getalldata = async position => {
    let longitude = position.coords.longitude;
    let latitude = position.coords.latitude;
    consolepro.consolelog('positionlatitude', latitude);
    consolepro.consolelog('positionlongitude', longitude);
    // this.setState({latitude: latitude, longitude: longitude, loading: false});
    setLatitude(latitude);
    setLongitude(longitude);
    // this.get_data(latitude, longitude)
    let event = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: latdelta,
      longitudeDelta: longdelta,
    };
    await getadddressfromlatlong(event);
  };

  const getadddressfromlatlong = event => {
    // alert('hihi')
    try {
      fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          event.latitude +
          ',' +
          event.longitude +
          '&key=' +
          config.mapkey +
          '&language=' +
          config.maplanguage,
      )
        .then(response => response.json())
        .then(resp => {
          let responseJson = resp.results[0];
          let city = '';
          let administrative_area_level_1 = '';
          for (let i = 0; i < responseJson.address_components.length; i++) {
            if (responseJson.address_components[i].types[0] == 'locality') {
              city = responseJson.address_components[i].long_name;
              break;
            } else if (
              responseJson.address_components[i].types[0] ==
              'administrative_area_level_2'
            ) {
              city = responseJson.address_components[i].long_name;
            }
          }
          for (let j = 0; j < responseJson.address_components.length; j++) {
            if (
              responseJson.address_components[j].types[0] ==
              'administrative_area_level_1'
            ) {
              administrative_area_level_1 =
                responseJson.address_components[j].long_name;
            }
          }
          let details = responseJson;

          global.details = details;

          consolepro.consolelog('asdcascas', details);

          let data2 = {
            latitude: details?.geometry.location.lat,
            longitude: details?.geometry.location.lng,
            address: details?.formatted_address,
            city: city,
            administrative_area_level_1: administrative_area_level_1,
          };
          consolepro.consolelog('data2', data2);
          consolepro.consolelog('details', details);
          consolepro.consolelog('Ruuninggn');

          if (
            GooglePlacesRef?.current &&
            typeof GooglePlacesRef?.current?.setAddressText === 'function'
          ) {
            GooglePlacesRef?.current?.setAddressText(details.formatted_address);
          }

          consolepro.consolelog('after gogle places');

          setLatdelta(event?.latitudeDelta);
          setLongdelta(event?.longitudeDelta);
          setLatitude(event?.latitude);
          setLongitude(event?.longitude);
          setAddressSelected(details?.formatted_address);
          setLong_name(details?.address_components[0]?.long_name);
          setLong_name1(details?.address_components[1]?.long_name);
          setLong_name2(details?.address_components[0]?.long_name);

          setTimeout(() => {
            consolepro.consolelog('seardefault', addressSelected);
            consolepro.consolelog('longitude765', longitude);
            consolepro.consolelog('latitude', latitude);
            consolepro.consolelog('long_name 426', long_name);
            consolepro.consolelog('long_name 427', long_name1);
            consolepro.consolelog('long_name', long_name2);
          }, 300);

          let address = long_name2;
          let add_location_arr = {
            address: address,
            latitude: latitude,
            longitude: longitude,
            long_name2: long_name2,
          };

          setAdd_my_location(add_location_arr);
          setAddLocationHome(details);
          // setState({add_my_location: data2});
          setAdd_my_location(data2);
          console.log('add_my_location===', add_my_location);
          console.log('long_name2222===', long_name2);
        });
    } catch (error) {
      consolepro.consolelog('Error ======>>', error);
    }
  };

  consolepro.consolelog('Address ========>>', add_my_location);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        <View
          style={{
            marginHorizontal: (mobileW * 5) / 100,
            marginTop: (mobileW * 4) / 100,
            flex: 1,
          }}>
          {/* --------back------ */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.goBack();
              setSearchValue(null);
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
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={false}>
            <View style={{marginTop: (mobileW * 4) / 100}}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 6) / 100,
                }}>
                {t('location_txt')}
              </Text>

              {/* --------search bar ------- */}
              {/* <SearchBar
              placeHolderText={t('search_txt')}
              value={searchValue}
              setValue={setSearchValue}
            /> */}

              <View
                style={{
                  flex: 1,
                  paddingHorizontal: (mobileW * 2) / 100,
                  paddingVertical: (mobileW * 5) / 100,
                }}>
                <GooglePlacesAutocomplete
                  placeholder={t('search_txt')}
                  textInputProps={{
                    placeholderTextColor: 'black',
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
                    description: {color: 'black'},
                    textInputContainer: {
                      backgroundColor: Colors.ColorSearchBar,
                      marginTop: (mobileW * 2) / 100,
                      alignSelf: 'center',
                      height: (mobileH * 6) / 100,
                      alignItems: 'flex-end',
                      borderRadius: 50,
                    },
                    textInput: {
                      marginLeft: 7,
                      marginRight: 10,
                      textAlign: 'left',
                      height: (mobileH * 5) / 100,
                      borderRadius: 10,
                      backgroundColor: Colors.ColorSearchBar,
                      color: '#5d5d5d',
                      fontSize: 14,
                    },
                    predefinedPlacesDescription: {
                      color: '#1faadb',
                    },
                    container: {
                      borderRadius: 10,
                    },
                    listView: {
                      position: 'absolute',
                      top: (mobileW * 45) / 100,
                      left: 0,
                      right: 0,
                      zIndex: 9999,
                      maxHeight: (mobileH * 60) / 100,
                    },
                  }}
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
                              : (mobileW * 5.5) / 100,
                            height: searchValue
                              ? (mobileW * 3.5) / 100
                              : (mobileW * 5.5) / 100,
                            resizeMode: 'contain',
                            marginRight: (mobileW * 3) / 100,
                            tintColor: 'black',
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>

              <View
                style={{
                  marginTop: (mobileW * 4) / 100,
                  borderBottomColor: Colors.themeColor,
                  borderBottomWidth: (mobileW * 0.2) / 100,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    // navigation.navigate('AllowNotification');
                    // setSearchValue(null);
                    getCurrentLocation();
                  }}
                  activeOpacity={0.8}
                  style={{
                    marginHorizontal: (mobileW * 4) / 100,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'flex-start',
                    marginBottom: (mobileW * 2) / 100,
                  }}>
                  <Image
                    source={localimag.icon_send}
                    style={{
                      width: (mobileW * 7) / 100,
                      height: (mobileW * 7) / 100,
                    }}
                  />

                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 4) / 100,
                      marginLeft: (mobileW * 2) / 100,
                    }}>
                    {t('use_my_current_location_txt')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  marginHorizontal: (mobileW * 4) / 100,
                }}>
                {(searchValue?.trim().length > 0 || addressbar2) && (
                  <Text
                    style={{
                      color: Colors.themeColor,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3) / 100,
                      marginTop: (mobileW * 4) / 100,
                    }}>
                    {t('search_result_txt')}
                  </Text>
                )}
              </View>
              <HideWithKeyboard>
                <View style={{marginTop: (mobileH * 50) / 100}}>
                  <CommonButton
                    title={t('continue_txt')}
                    containerStyle={{backgroundColor: Colors.themeColor2}}
                    onPress={() => {
                      navigation.navigate('AllowNotification');
                    }}
                  />
                </View>
              </HideWithKeyboard>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UseCurrentLocation;

const styles = StyleSheet.create({});
