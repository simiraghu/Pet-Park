import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  config,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  Colors,
  Font,
  localStorage,
  apifuntion,
  consolepro,
  msgProvider,
} from '../../Provider/utilslib/Utils';
import SearchBar from '../../Components/SearchBar';

import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {pushnotification} from '../../Provider/PushNotificationHandlre';
import ApprovalModal from '../../Components/ApprovalModal';
import {SafeAreaView} from 'react-native-safe-area-context';

const Match = () => {
  const {goBack, navigate} = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUserProfileApproved, setIsUserProfileApproved] = useState(false);
  const [isProfileApprovalModal, setIsProfileApprovalModal] = useState(false);
  const [isUserApproved, setIsUserApproved] = useState(false);

  const navigation = useNavigation();

  const {t} = useTranslation();

  const [fanData, setFanData] = useState([]);

  const [filteredFanData, setFilteredFanData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    pushnotification.redirectfun({navigation});
  }, []);

  useFocusEffect(
    useCallback(() => {
      const run = async () => {
        setSearchText('');

        try {
          const filter_data = await localStorage.getItemObject('filter_data');

          const isFilterActive =
            filter_data &&
            Object.values(filter_data).some(
              val =>
                val !== '' && val !== undefined && val !== null && val !== 'NA',
            );

          if (isFilterActive) {
            await filterData(filter_data);
            await localStorage.removeItem('filter_data');
          } else {
            await getMatchList();
          }
        } catch (err) {
          consolepro.consolelog(err, '<<ERROR in useFocusEffect');
          await getMatchList();
        }
      };

      if (config.device_type === 'ios') {
        const timer = setTimeout(() => {
          run();
        }, 1200);

        return () => clearTimeout(timer);
      } else {
        run();
      }
    }, []),
  );

  const getMatchList = async () => {
    try {
      setLoading(true);
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL = config.baseURL + 'get_all_adores?user_id=' + userId;

      //consolepro.consolelog('api url ===> ', API_URL);

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<adore you');
            let adore_arr = res?.adore_arr;
            setFanData(adore_arr);
            setFilteredFanData(adore_arr);
            setIsUserProfileApproved(false);
          } else {
            consolepro.consolelog(res);
            setFanData([]);
            setFilteredFanData([]);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
              setFanData([]);
              setFilteredFanData([]);
              setIsUserProfileApproved(false);
            } else if (res?.approve_flag == 0 || res?.approve_flag == 2) {
              setFanData([]);
              setFilteredFanData([]);
              setIsUserProfileApproved(true);
              // setTimeout(() => {
              //   msgProvider.alert(
              //     t('information_txt'),
              //     res?.msg[config.language],
              //     false,
              //   );
              //   return false;
              // }, 300);
              setLoading(false);
            } else {
              consolepro.consolelog(res, '<<RES');
              setFanData([]);
              setFilteredFanData([]);
              setIsUserProfileApproved(false);
            }
          }
          setLoading(false);
        })
        .catch(error => {
          consolepro.consolelog(error, '<<ERROR');
          setFanData([]);
          setFilteredFanData([]);
          setLoading(false);
          setIsUserProfileApproved(false);
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
      setFanData([]);
      setFilteredFanData([]);
      setLoading(false);
      setIsUserProfileApproved(false);
    }
  };

  const handleSearch = (text = '') => {
    setSearchText(text);

    const filtered = fanData.filter(item =>
      (item?.name ?? '').toLowerCase().includes(text.toLowerCase()),
    );

    consolepro.consolelog('filtered ===> ', filtered);

    setFilteredFanData(filtered);
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

  const filterData = async ({
    gender,
    breed,
    relationStatus,
    minAge,
    maxAge,
    parentMinAge,
    parentMaxAge,
    fromDistance,
    toDistance,
    latitude,
    longitude,
    address,
    categorie,
  }) => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id || '';

      consolepro.consolelog('Gender======>>', gender);

      // Build query parameters object
      const queryParams = {
        user_id: userId,
        gender: gender || '',
        breed_id: breed || '',
        relationship_status: relationStatus || '',
        min_age: minAge || '',
        max_age: maxAge || '',
        parent_min_age: parentMinAge || '',
        parent_max_age: parentMaxAge || '',
        from_distance: fromDistance || '',
        to_distance: toDistance || '',
        latitude: latitude || '',
        longitude: longitude || '',
        address: address || '',
        pet_type_id: categorie || '',
      };

      // Build query string helper (you can implement or reuse your buildQueryString)
      const queryString = buildQueryString(queryParams);

      const API_URL = `${config.baseURL}get_all_adores?${queryString}`;

      consolepro.consolelog('API URL +++ ', API_URL);

      const res = await apifuntion.getApi(API_URL, 1);

      if (res?.success === true) {
        consolepro.consolelog(res, '<<adore you');
        const adore_arr = res?.adore_arr || [];
        setFanData(adore_arr);
        setFilteredFanData(adore_arr);
      } else {
        consolepro.consolelog(res);

        if (res?.active_flag === 0) {
          localStorage.clear();
          navigation.navigate('WelcomeScreen');
        } else {
          setFanData([]);
          setFilteredFanData([]);
        }
      }
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
      setFanData([]);
      setFilteredFanData([]);
    }
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

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      getMatchList();
      setRefreshing(false);
    }, 1000);
  };
  // const [isLike, setIsLike] = useState(null)

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {/*--------  header---------*/}
        <View
          style={{
            width: (mobileW * 88) / 100,
            marginTop: (mobileH * 3.5) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            alignSelf: 'center',
          }}>
          <TouchableOpacity onPress={() => goBack()} activeOpacity={0.8}>
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

          {/* {!isUserProfileApproved && ( */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('FilterModal', {
                getFilteredData: filterData,
              })
            }
            disabled={!isUserApproved}>
            <Image
              source={localimag.icon_greenFilter}
              style={{
                width: (mobileW * 7.5) / 100,
                height: (mobileW * 7.5) / 100,
              }}
            />
          </TouchableOpacity>
          {/* )} */}
        </View>

        {/* ---- header end -------- */}

        <View
          style={{
            marginTop: (mobileH * 3) / 100,
            width: (mobileW * 88) / 100,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              color: Colors.headingColor,
              fontSize: (mobileW * 6.5) / 100,
              fontFamily: Font.FontSemibold,
            }}>
            {t('adore_you_txt')}
          </Text>
          <Text
            style={{
              color: Colors.headingColor,
              fontSize: (mobileW * 3.5) / 100,
              fontFamily: Font.FontMedium,
            }}>
            {t('hereYouCanSeePeoeple_txt')}
          </Text>
        </View>

        {/* --------------------- */}

        {/* {!isUserProfileApproved && ( */}
        <SearchBar
          value={searchText}
          placeHolderText={t('search_txt')}
          containerStyle={{
            alignSelf: 'center',
            marginBottom: (mobileH * 2) / 100,
          }}
          setValue={text => {
            setSearchText(text);
            handleSearch(text);
          }}
          editable={isUserApproved}
        />
        {/* )} */}

        {/* -------------------------- */}

        <FlatList
          data={filteredFanData}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: (mobileW * 5) / 100,
            //marginTop: (mobileH * 2) / 100,
            gap: (mobileW * 4) / 100,
            paddingBottom: (mobileH * 15) / 100,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyboardShouldPersistTaps="handled"
          renderItem={({item, index}) => (
            <CardView
              item={item}
              index={index}
              isUserApproved={isUserApproved}
            />
          )}
          ListEmptyComponent={() =>
            !loading ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: (mobileW * 50) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontSize: (mobileW * 5) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {t('no_data_found_txt')}
                </Text>
              </View>
            ) : null
          }
        />

        <ApprovalModal
          isVisible={isProfileApprovalModal}
          onClose={() => setIsProfileApprovalModal(false)}
          onReject={reason => {}}
        />
      </View>
    </SafeAreaView>
  );
};

export default Match;

const CardView = ({item, index, isUserApproved}) => {
  const navigation = useNavigation();
  const cardWidth = (mobileW * 43) / 100;
  const cardHeight = (mobileH * 36) / 100;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        item?.bring_type == 1
          ? navigation.navigate('WishingPetParentUserDetails', {
              other_user_id: item?.user_id,
            })
          : navigation.navigate('UserDetails', {
              other_user_id: item?.user_id,
            });
      }}
      disabled={!isUserApproved}
      style={{
        width: cardWidth,
        height: cardHeight,
        backgroundColor: Colors.whiteColor,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        borderRadius: (mobileW * 1.5) / 100,
        alignItems: 'center',
        marginHorizontal: (mobileW * 1.5) / 100,
        marginBottom: (mobileH * 2) / 100,
      }}>
      <View
        style={{
          alignSelf: 'flex-start',
          marginLeft: (mobileW * 2) / 100,
          marginTop: (mobileW * 3) / 100,
        }}>
        {item?.message && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {item?.status === 2 && (
              <>
                <Text
                  numberOfLines={2}
                  style={{
                    color: Colors.cancleColor,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3) / 100,
                  }}>
                  {item?.message}
                </Text>
              </>
            )}
          </View>
        )}
        {item?.status == 2 && (
          <View
            style={{
              width: (mobileW * 40) / 100,
              height: 1, // Keep a thin line
              backgroundColor: Colors.cancleColor,
              marginTop: (mobileW * 1) / 100,
            }}
          />
        )}
        {/* {item?.status === 1 && (
          <Text
            style={{
              color: Colors.cancleColor,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 3) / 100,
              alignSelf: 'center',
            }}>
            Liked your photo
          </Text>
        )} */}
      </View>

      <ImageBackground
        source={
          item?.image
            ? {uri: config.img_url + item?.image}
            : localimag.icon_userPlaceholder
        }
        style={{
          width: (mobileW * 33) / 100,
          height: (mobileH * 21) / 100,
          marginTop: (mobileH * 1.5) / 100,
        }}
        imageStyle={{
          borderRadius: (mobileW * 20) / 100,
          resizeMode: item?.image == null ? 'contain' : 'cover',
        }}
      />

      <LinearGradient
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        colors={['#85B068', '#85B068', '#47573D']}
        style={{
          width: '100%',
          height: (mobileH * 5.5) / 100,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomLeftRadius: (mobileW * 1.5) / 100,
          borderBottomRightRadius: (mobileW * 1.5) / 100,
          position: 'absolute',
          bottom: 0,
        }}>
        <Text
          numberOfLines={1}
          style={{
            color: Colors.whiteColor,
            fontSize: (mobileW * 4) / 100,
            fontFamily: Font.FontMedium,
          }}>
          {item?.name}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
});
