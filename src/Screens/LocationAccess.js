import React, {Component, useTransition} from 'react';
import {
  Platform,
  Text,
  View,
  Linking,
  PermissionsAndroid,
  BackHandler,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableHighlight,
  ImageBackground,
  FlatList,
  Modal,
} from 'react-native';
import {
  button_style,
  Currentltlg,
  msgProvider,
  msgText,
  msgTitle,
  localStorage,
  apifuntion,
  config,
  Lang_chg,
  AppProvider,
  Mapprovider,
  validation,
  Font,
  Colors,
  mobileW,
  consolepro,
  mobileH,
  localimag,
} from '../Provider/utilslib/Utils';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
  Callout,
  Marker,
  Circle,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {withTranslation} from 'react-i18next';

class Office_address extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      image: 'NA',
      latitude: config.latitude,
      longitude: config.longitude,
      latdelta: '0.0922',
      longdelta: '0.0421',
      // post_location: 'NA',
      addressbar: false,
      addressbar2: false,
      addressselected: 'Search',
      makermove: 0,
      username: '',
      address: '',
      map_arr: [],
      places_arr: 'NA',
      modalVisible: false,
      userdetails: 'NA',
      place_id: '',
      title: '',
      location: '',
      description: '',
      distance_away: '',
      distance: '',
      status: '',
      hideStatus: 'yes',
      radius: 0,
      userlocation: '',
      add_my_location: '',
      add_location: 'NA',
      long_name: '',
      long_name1: '',
      long_name2: '',
      markers: [
        {
          title: 'hello',
          // image: require('./icons/location_setting.png'),
          coordinates: {
            latitude: 22.7533,
            longitude: 75.8937,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        },
        {
          title: 'hello',
          // image: require('./icons/location_setting.png'),
          coordinates: {
            latitude: 22.7244,
            longitude: 75.8839,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        },
        {
          title: 'hello',
          // image: require('./icons/location_setting.png'),
          coordinates: {
            latitude: 22.7355,
            longitude: 75.9074,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        },
        {
          title: 'hello',
          // image: require('./icons/location_setting.png'),
          coordinates: {
            latitude: 22.7617,
            longitude: 75.9273,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        },
        {
          title: 'hello',
          // image: require('./icons/location_setting.png'),
          coordinates: {
            latitude: 22.7196,
            longitude: 75.8577,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        },
        {
          title: 'hello',
          // image: require('./icons/location_setting.png'),
          coordinates: {
            latitude: 22.7193,
            longitude: 75.8694,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        },
      ],
      newaddress: this.props?.route?.params?.newaddress,
      newlatitude: this.props?.route?.params?.newlatitude,
      newlongitude: this.props?.route?.params?.newlongitude,

      myShortName: '',
      add_location_home: 'NA',
    };

    global.props.hideLoader();
  }

  async componentDidMount() {
    const {route} = this.props;
    const locationData = route?.params?.locationData;

    const {newaddress, newlatitude, newlongitude} = this.state;

    consolepro.consolelog('Line 170', newaddress);
    consolepro.consolelog('Line 171', newlatitude);
    consolepro.consolelog('Line 172', newlongitude);

    if (locationData?.latitude && locationData?.longitude) {
      const {latitude, longitude} = locationData;

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${config.mapkey}&language=${config.maplanguage}`,
        );
        const json = await response.json();
        const address = json.results?.[0]?.formatted_address;

        if (address && this.GooglePlacesRef?.setAddressText) {
          this.GooglePlacesRef.setAddressText(address);
        }

        this.setState({
          address,
          addressselected: address,
          latitude,
          longitude,
        });

        consolepro.consolelog('Autofilled from navigation param:', address);
      } catch (error) {
        console.warn('Reverse geocoding failed', error);
      }

      return; // Exit early
    }

    if (
      newaddress &&
      newaddress !== 'NA' &&
      newaddress !== undefined &&
      newaddress !== ''
    ) {
      consolepro.consolelog('Line 177');
      setTimeout(() => {
        if (this.GooglePlacesRef?.setAddressText) {
          this.GooglePlacesRef.setAddressText(newaddress);
        }

        this.setState({
          address: newaddress,
          latitude: newlatitude,
          longitude: newlongitude,
          addressselected: newaddress,
        });
      }, 100);
    } else {
      setTimeout(() => {
        this.getlatlong();
      }, 100);
    }

    consolepro.consolelog('88', this.state.address);
  }

  getcurrentlatlogn = async () => {
    let data = await Currentltlg.requestLocation();
    let latitude = data.coords.latitude;
    let longitude = data.coords.longitude;
    this.setState({latitude: latitude, longitude: longitude});
    // var latLongData = { latitude: this.state.latitude, longitude: this.state.longitude};
    localStorage.setItemObject('latitude', latitude);
    localStorage.setItemObject('longitude', longitude);
    // consolepro.consolelog('latitude', this.state.latitude)
    // consolepro.consolelog('longitude', this.state.longitude)
  };

  callLocation = async that => {
    this.setState({loading: true});
    localStorage.getItemObject('position').then(position => {
      consolepro.consolelog('position', position);
      if (position != null) {
        var pointcheck1 = 0;
        this.getalldata(position);
        Geolocation.getCurrentPosition(
          //Will give you the current location
          position => {
            localStorage.setItemObject('position', position);
            this.getalldata(position);
            pointcheck1 = 1;
          },
          error => {
            let position = {
              coords: {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
              },
            };

            this.getalldata(position);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
        );
        that.watchID = Geolocation.watchPosition(position => {
          //Will give you the location on location change
          consolepro.consolelog('data', position);

          if (pointcheck1 != 1) {
            localStorage.setItemObject('position', position);
            this.getalldata(position);
          }
        });
      } else {
        consolepro.consolelog('helo gkjodi');
        var pointcheck = 0;
        Geolocation.getCurrentPosition(
          //Will give you the current location
          position => {
            localStorage.setItemObject('position', position);

            this.getalldata(position);
            pointcheck = 1;
          },
          error => {
            let position = {
              coords: {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
              },
            };

            this.getalldata(position);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
        );
        that.watchID = Geolocation.watchPosition(position => {
          //Will give you the location on location change
          consolepro.consolelog('data', position);

          if (pointcheck != 1) {
            localStorage.setItemObject('position', position);
            this.getalldata(position);
          }
        });
      }
    });
  };

  getlatlong = async () => {
    let permission = await localStorage.getItemString('permission');
    if (permission != 'denied') {
      var that = this;
      //Checking for the permission just after component loaded
      if (Platform.OS === 'ios') {
        this.callLocation(that);
      } else {
        // this.callLocation(that);
        async function requestLocationPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Access Required',
                message: 'This App needs to Access your location',
              },
            );
            consolepro.consolelog(
              'granted',
              PermissionsAndroid.RESULTS.GRANTED,
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              that.callLocation(that);
            } else {
              let position = {
                coords: {
                  latitude: that.state.latitude,
                  longitude: that.state.longitude,
                },
              };
              localStorage.setItemString('permission', 'denied');
              that.getalldata(position);
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
          latitude: this.state.latitude,
          longitude: this.state.longitude,
        },
      };
      this.getalldata(position);
    }
  };

  getalldata = async position => {
    let longitude = position.coords.longitude;
    let latitude = position.coords.latitude;
    consolepro.consolelog('positionlatitude', latitude);
    consolepro.consolelog('positionlongitude', longitude);
    this.setState({latitude: latitude, longitude: longitude, loading: false});
    // this.get_data(latitude, longitude)
    let event = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: this.state.latdelta,
      longitudeDelta: this.state.longdelta,
    };
    await this.getadddressfromlatlong(event);
  };

  setMapRef = map => {
    this.map = map;
  };

  getCoordinates = region => {
    return {
      latitude: parseFloat(this.state.latitude),
      longitude: parseFloat(this.state.longitude),
      latitudeDelta: parseFloat(this.state.latdelta),
      longitudeDelta: parseFloat(this.state.longdelta),
    };
  };

  getadddressfromlatlong = event => {
    // alert('hihi')

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
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
          address: details.formatted_address,
          city: city,
          administrative_area_level_1: administrative_area_level_1,
        };
        // add_location = data2
        //this.setState({add_location:data2})
        // post_location = data2
        consolepro.consolelog('data2', data2);
        consolepro.consolelog('details', details);
        // consolepro.consolelog('responseJson1234', add_location)
        this.GooglePlacesRef &&
          this.GooglePlacesRef.setAddressText(details.formatted_address);
        this.setState({
          latdelta: event.latitudeDelta,
          longdelta: event.longitudeDelta,
          latitude: event.latitude,
          longitude: event.longitude,
          addressselected: details.formatted_address,
          long_name: details.address_components[0].long_name,
          long_name1: details.address_components[1].long_name,
          //long_name2: details.address_components[2].long_name,
          long_name2: details.address_components[0]?.short_name,
        });
        setTimeout(() => {
          consolepro.consolelog('seardefault', this.state.addressselected);
          consolepro.consolelog('longitude765', this.state.longitude);
          consolepro.consolelog('latitude', this.state.latitude);
          consolepro.consolelog('long_name 426', this.state.long_name);
          consolepro.consolelog('long_name 427', this.state.long_name1);
          consolepro.consolelog('long_name', this.state.long_name2);
        }, 300);
        let address = this.state.long_name2;
        let add_location_arr = {
          address: address,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          long_name2: this.state.long_name2,
        };
        this.setState({
          add_location: add_location_arr,
          add_location_home: details,
        });

        this.setState({add_my_location: data2});
        console.log('add_my_location===', this.state.add_my_location);
        console.log('long_name2222===', this.state.long_name2);
      });
  };

  continueBtn = () => {
    //this.getlatlong();
    consolepro.consolelog('latitude1223', this.state.latitude);
    consolepro.consolelog('longitude123', this.state.longitude);
    consolepro.consolelog('addressselected1232', this.state.addressselected);
    if (this.state.addressselected == 'Search') {
      msgProvider.toast(this.props.t('Emptyvalidlocation'), 'center');
      return false;
    }
    var add_location = this.state.add_location;
    consolepro.consolelog('add_location==123', add_location);
    global.add_location = add_location;

    consolepro.consolelog('shortName', global.shortName);

    if (add_location != 'NA') {
      localStorage.setItemObject('add_location', add_location);
    }
    // else {
    //     this.props.navigation.goBack()
    // }

    if (this.state.details) {
      global.details = this.state.details;
    } else {
      global.details = this.state.add_location_home;
    }

    console.log('global.details', global.details);
    console.log('global.details11111111', this.state.add_location_home);

    const onGoBack = this.props.route?.params?.onGoBack;
    if (typeof onGoBack === 'function') {
      onGoBack(); // ✅ Triggers isLocationManuallyChanged = true
    }

    this.props.navigation.goBack();
  };

  render() {
    const {t} = this.props;
    //  consolepro.consolelog("Longitude ======>>",this.props.route.longitude)
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{flex: 1}}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <SafeAreaView style={{flex: 0, backgroundColor: Colors.whiteColor}} />
          <StatusBar
            backgroundColor={Colors.whiteColor}
            hidden={false}
            barStyle={'dark-content'}
            whiteColor={'dark-content'}
            translucent={false}
            networkActivityIndicatorVisible={true}
          />

          {/* ============ Header Start============= */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: Colors.themeColor2,
              width: (mobileW * 100) / 100,
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: (mobileW * 90) / 100,
                backgroundColor: Colors.themeColor2,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: (mobileW * 4) / 100,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                style={{
                  width: '10%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{
                    width: (mobileW * 5.5) / 100,
                    height: (mobileW * 5.5) / 100,
                    resizeMode: 'contain',
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                  source={localimag.icon_back_arrow}></Image>
              </TouchableOpacity>

              <View
                style={{
                  width: '80%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: (mobileW * 5.5) / 100,
                    fontFamily: Font.FontSemibold,
                    color: Colors.whiteColor,
                    textAlign: 'center',
                  }}>
                  {t('location_txt')}
                </Text>
              </View>

              <View
                style={{
                  width: '10%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}></View>
            </View>
          </View>
          {/* ============ Header End============= */}

          <MapView
            followsUserLocation={true}
            style={{flex: 1}}
            region={this.getCoordinates(this)}
            zoomEnabled={true}
            // provider={PROVIDER_GOOGLE}
            minZoomLevel={2}
            maxZoomLevel={20}
            rotateEnabled={true}
            pitchEnabled={true}
            showsUserLocation={true}
            userLocationPriority="high"
            moveOnMarkerPress={true}
            showsMyLocationButton={false}
            showsScale={true} // also this is not working
            showsCompass={true} // and this is not working
            showsPointsOfInterest={true} // this is not working either
            showsBuildings={true} // and finally, this isn't working either
            draggable
            ref={this.setMapRef}>
            <Marker.Animated
              coordinate={{
                latitude: parseFloat(this.state.latitude),
                longitude: parseFloat(this.state.longitude),
                latitudeDelta: parseFloat(this.state.latdelta),
                longitudeDelta: parseFloat(this.state.longdelta),
              }}
              // isPreselected={true}

              onDragEnd={e => {
                consolepro.consolelog('dragEnd', e.nativeEvent.coordinate);
              }}
              draggable
              title={
                this.state.username != null ? this.state.username : 'Guest user'
              }
              description={'Search Location'}>
              <Image
                source={localimag.icon_pin}
                style={{
                  height: (mobileW * 12) / 100,
                  width: (mobileW * 12) / 100,
                  resizeMode: 'contain',
                }}
              />
            </Marker.Animated>
          </MapView>

          {/* currren location start */}

          <View
            style={{
              position: 'absolute',
              top: (mobileH * 18) / 100,
              width: '100%',
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              TouchableOpacity={0.9}
              onPress={() => {
                this.getlatlong();
              }}
              style={{
                width: (mobileW * 10) / 100,
                height: (mobileW * 10) / 100,
                borderRadius: (mobileW * 5) / 100,
                marginRight: (mobileW * 5) / 100,
                backgroundColor: Colors.themeColor2,
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: (mobileW * 5) / 100,
                  height: (mobileW * 5) / 100,
                }}
                source={localimag.icon_current_location}></Image>
            </TouchableOpacity>
          </View>

          {/* currren location end */}

          <View style={{position: 'absolute', width: '100%', top: 40}}>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 20,
                paddingVertical: (mobileW * 8) / 100,
              }}>
              <GooglePlacesAutocomplete
                placeholder="Search location"
                textInputProps={{
                  placeholderTextColor: 'black',
                }}
                minLength={1}
                autoFocus={false}
                returnKeyType={'search'}
                listViewDisplayed={this.state.addressbar2}
                fetchDetails={true}
                ref={instance => {
                  this.GooglePlacesRef = instance;
                }}
                renderDescription={row => row.description}
                onPress={(data, details = null) => {
                  console.log('datalocation', details);

                  this.setState({
                    details: details,
                  });

                  let city = 'unknown';
                  for (let i = 0; i < details.address_components.length; i++) {
                    if (details.address_components[i].types[0] == 'locality') {
                      city = details.address_components[i].long_name;
                    }
                  }

                  consolepro.consolelog('city', city);
                  let data2 = {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    address: details.formatted_address,
                    city: city,
                  };

                  this.setState({
                    add_location: data2,
                    add_location_home: details,
                  });

                  this.setState({
                    addressbar: true,
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    address: details.formatted_address,
                    description: details.formatted_address,
                    addressselected: details.formatted_address,
                    myShortName: details?.address_components[0]?.short_name,
                  });

                  config.latitude = details.geometry.location.lat;
                  config.longitude = details.geometry.location.lng;

                  global.shortName = details?.address_components[0]?.short_name;
                }}
                query={{
                  key: config.mapkey,
                  language: config.maplanguage,

                  // components: 'country:nz|country:au',
                }}
                styles={{
                  description: {color: 'black'},
                  textInputContainer: {
                    backgroundColor: Colors.whiteColor,
                    marginTop: (mobileW * 2) / 100,
                    alignSelf: 'center',
                    height: 42,
                    alignItems: 'flex-end',
                    borderRadius: 50,
                    shadowColor: '#000000',
                    shadowOffset: {width: 0, height: 3},
                    shadowOpacity: 0.17,
                    shadowRadius: 3.05,
                    elevation: 4,
                  },
                  textInput: {
                    marginLeft: 7,
                    marginRight: 10,
                    textAlign: 'left',
                    height: 37,
                    borderRadius: 10,
                    backgroundColor: Colors.whiteColor,
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
                    backgroundColor: 'pink',
                    marginTop: 30,
                    borderWidth: 1,
                    boderColor: 'black',
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
                      this.GooglePlacesRef.setAddressText('');
                      this.setState({addressselected: 'Search'});
                    }}>
                    {Platform.OS == 'android' && (
                      <Image
                        source={localimag.icon_cross}
                        style={{
                          width: (mobileW * 3.5) / 100,
                          height: (mobileW * 3.5) / 100,
                          resizeMode: 'contain',
                          marginRight: (mobileW * 2) / 100,
                          tintColor: 'black',
                        }}></Image>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>

          <HideWithKeyboard>
            <TouchableOpacity
              onPress={() => {
                // console.log('shortName', global.shortName);
                this.continueBtn();
              }}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                width: (mobileW * 90) / 100,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: (mobileW * 2) / 100,
                bottom: 0,
                position: 'absolute',
                marginBottom: (mobileW * 5) / 100,
                paddingVertical: (mobileW * 3) / 100,
                backgroundColor: Colors.themeColor2,
              }}>
              <Text
                style={{
                  fontSize: (mobileW * 5) / 100,
                  color: Colors.whiteColor,
                  fontFamily: Font.FontSemibold,
                  textAlign: 'center',
                  paddingLeft: 3.5,
                }}>
                {t('continue_txt')}
              </Text>
            </TouchableOpacity>
          </HideWithKeyboard>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withTranslation()(Office_address);
