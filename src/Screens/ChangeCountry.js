import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  config,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  Colors,
  Font,
  consolepro,
  localStorage,
  apifuntion,
  msgProvider,
} from '../Provider/utilslib/Utils';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SearchBar from '../Components/SearchBar';
import {useTranslation} from 'react-i18next';
import ConfirmModal from '../Components/ConfirmModal';
import {SafeAreaView} from 'react-native-safe-area-context';

const ChangeCountry = ({navigation}) => {
  const [Country, setCountry] = useState([]);

  const {t} = useTranslation();

  const [searchText, setSearchText] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isChangeCountryModal, setIsChangeCountryModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Search functionality =======
  const handleSearch = (text = '') => {
    setSearchText(text);

    const filtered = Country.filter(item =>
      (item?.country ?? '').toLowerCase().includes(text.toLowerCase()),
    );

    consolepro.consolelog('filtered ===> ', filtered);

    setFilteredCountries(filtered);
  };

  // Get Country ===========>>>

  const GetCountry = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_array');
      const userId = user_arr?.user_id;

      const API_URL = config.baseURL + 'get_country?user_id=' + userId;
      consolepro.consolelog(API_URL, '<<API');

      apifuntion
        .getApi(API_URL, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setCountry(res?.country_arr);
            setFilteredCountries(res?.country_arr);
          } else {
            consolepro.consolelog(res, '<RES');
            setCountry([]);
            setFilteredCountries([]);
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<<ERR');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Err');
    }
  };

  // Change country =========>>>

  const ChangeCountry = async () => {
    try {
      consolepro.consolelog(selectedCountry, '<<SElected countru');
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL = config.baseURL + 'change_country';
      const data = new FormData();

      data.append('user_id', userId);
      data.append('country_id', selectedCountry?.country_id);
      consolepro.consolelog(data, '<<DATA');

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            localStorage.setItemObject('user_array', res?.userDataArray);
            msgProvider.toast(res?.msg[config.language], 'bottom');
            setTimeout(() => {
              setIsChangeCountryModal(false);
            }, 700);
            return false;
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
          consolepro.consolelog(error, 'ERROR');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERror');
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (config.device_type == 'ios') {
        setTimeout(() => {
          GetCountry();
        }, 1200);
      } else {
        GetCountry();
      }
    }, []),
  );

  useEffect(() => {
    const GetUserDetails = async () => {
      const user_array = await localStorage.getItemObject('user_array');
      consolepro.consolelog(user_array, '<<USER Array');
      consolepro.consolelog(selectedCountry, '<<SElected count');
      setSelectedCountry({
        country: user_array?.country,
        country_code: user_array?.country_code,
        country_flag: user_array?.country_flag,
        country_id: user_array?.country_id,
      });
    };
    GetUserDetails();
  }, []);

  // {"country": "India", "country_code": 91, "country_flag": "Flag_of_India.svg.png", "country_id": 1}

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View
          style={{
            width: (mobileW * 90) / 100,
            alignSelf: 'center',
            marginTop: (mobileH * 2) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={{
              alignSelf: 'flex-start',
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
                //   {tintColor: Colors.ColorBlack},
              ]}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: (mobileH * 3) / 100,
            width: (mobileW * 90) / 100,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              color: Colors.whiteColor,
              fontSize: (mobileW * 6) / 100,
              fontFamily: Font.FontSemibold,
            }}>
            {t('choose_country_txt')}
          </Text>
        </View>

        {/* search bar */}

        <View>
          <SearchBar
            containerStyle={{
              backgroundColor: Colors.whiteColor,
              alignSelf: 'center',
            }}
            placeHolderText={t('search_txt')}
            setValue={text => {
              setSearchText(text);
              handleSearch(text);
            }}
          />
        </View>

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          contentContainerStyle={{
            //   paddingBottom: (mobileH * 10) / 100,
            flex: 1,
          }}
          keyboardShouldPersistTaps="handled">
          <View
            style={{
              marginTop: (mobileH * 2) / 100,
              width: mobileW,
              paddingVertical: (mobileH * 2) / 100,
              backgroundColor: Colors.whiteColor,
              flex: 1,
            }}>
            <FlatList
              data={filteredCountries}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setIsChangeCountryModal(true);
                      setSelectedCountry(item);
                    }}
                    style={{
                      marginTop: (mobileH * 1.5) / 100,
                      width: (mobileW * 90) / 100,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <Image
                        style={{
                          height: (mobileW * 5) / 100,
                          width: (mobileW * 5) / 100,
                          borderRadius: (mobileW * 30) / 100,
                          transform: [
                            config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                          ],
                        }}
                        source={
                          item?.country_flag
                            ? {uri: config.img_url + item.country_flag}
                            : localimag.icon_dutch_flag
                        }></Image>

                      <Text
                        style={{
                          marginLeft: (mobileW * 2.5) / 100,
                          fontSize: (mobileW * 3.5) / 100,
                          fontFamily: Font.FontSemibold,
                          color: Colors.themeColor2,
                        }}>
                        {item?.country}
                      </Text>
                    </View>
                    <Image
                      style={{
                        height: (mobileW * 4.5) / 100,
                        width: (mobileW * 4.5) / 100,
                      }}
                      source={
                        selectedCountry?.country_id === item?.country_id
                          ? localimag.icon_filled_checkbox_theme1
                          : localimag.icon_empty_checkbox_theme1
                      }
                    />
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={() => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontSize: (mobileW * 3.5) / 100,
                      fontFamily: Font.FontMedium,
                    }}>
                    {t('no_data_found_txt')}
                  </Text>
                </View>
              )}
            />
          </View>
        </KeyboardAwareScrollView>

        <ConfirmModal
          visible={isChangeCountryModal}
          button={true}
          btnText={t('yes_txt')}
          onCancelBtn={true}
          onCancelText={t('cancelmedia')}
          onCancelPress={() => setIsChangeCountryModal(false)}
          onCrosspress={() => setIsChangeCountryModal(false)}
          message={t('areyousure_txt')}
          content={t('you_want_to_change_country_txt')}
          onPress={() => {
            ChangeCountry();
          }}
          popupicon={localimag?.icon_green_tick}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChangeCountry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.themeColor2,
  },
});
