import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
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
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import ApprovalModal from '../Components/ApprovalModal';

const Notification = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const [notificationData, setNotificationData] = useState([
    // {
    //   id: 0,
    //   icon: localimag.icon_userPlaceholder,
    //   title: 'Jack Likes your photo',
    //   date: '1W',
    //   img: require('../Icons/icon_notificationDog.png'),
    // },
    // {
    //   id: 1,
    //   icon: localimag.icon_userPlaceholder,
    //   title: 'Jack Likes your photo',
    //   date: '1W',
    //   img: require('../Icons/icon_notificationDog.png'),
    // },
    // {
    //   id: 2,
    //   icon: localimag.icon_userPlaceholder,
    //   title: 'Jack Likes your photo',
    //   date: '1W',
    //   img: require('../Icons/icon_notificationDog.png'),
    // },
    // {
    //   id: 3,
    //   icon: localimag.icon_userPlaceholder,
    //   title: 'Jack Likes your photo',
    //   date: '1W',
    //   img: require('../Icons/icon_notificationDog.png'),
    // },
    // {
    //   id: 4,
    //   icon: localimag.icon_userPlaceholder,
    //   title: 'Jack Likes your photo',
    //   date: '1W',
    //   img: require('../Icons/icon_notificationDog.png'),
    // },
    // {
    //   id: 5,
    //   icon: localimag.icon_userPlaceholder,
    //   title: 'Jack Likes your photo',
    //   date: '1W',
    //   img: require('../Icons/icon_notificationDog.png'),
    // },
    // {
    //   id: 6,
    //   icon: localimag.icon_userPlaceholder,
    //   title: 'Jack Likes your photo',
    //   date: '1W',
    //   img: require('../Icons/icon_notificationDog.png'),
    // },
    // {
    //   id: 7,
    //   icon: localimag.icon_userPlaceholder,
    //   title: 'Jack Likes your photo',
    //   date: '1W',
    //   img: require('../Icons/icon_notificationDog.png'),
    // },
    // {
    //   id: 8,
    //   icon: localimag.icon_userPlaceholder,
    //   title: 'Jack Likes your photo',
    //   date: '1W',
    //   img: require('../Icons/icon_notificationDog.png'),
    // },
    // {
    //   id: 9,
    //   icon: localimag.icon_userPlaceholder,
    //   title: 'Jack Likes your photo',
    //   date: '1W',
    //   img: require('../Icons/icon_notificationDog.png'),
    // },
    // {
    //   id: 10,
    //   icon: localimag.icon_userPlaceholder,
    //   title: 'Jack Likes your photo',
    //   date: '1W',
    //   img: require('../Icons/icon_notificationDog.png'),
    // },
    // {
    //   id: 11,
    //   icon: localimag.icon_userPlaceholder,
    //   title: 'Jack Likes your photo',
    //   date: '1W',
    //   img: require('../Icons/icon_notificationDog.png'),
    // },
    // {
    //   id: 12,
    //   icon: localimag.icon_userPlaceholder,
    //   title: 'Jack Likes your photo',
    //   date: '1W',
    //   img: require('../Icons/icon_notificationDog.png'),
    // },
  ]);
  const [isUserProfileApproved, setIsUserProfileApproved] = useState(false);
  const [isProfileApprovalModal, setIsProfileApprovalModal] = useState(false);
  const [isUserApproved, setIsUserApproved] = useState(false);

  // delete single notifications ============>>

  const handleSigleNotificationDelete = async notification_id => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL = config.baseURL + 'delete_single_notification';
      consolepro.consolelog(API_URL.at, '<<API');
      const data = new FormData();

      data.append('user_id', userId);
      data.append('notification_message_id', notification_id);

      consolepro.consolelog(data, '<DATA');
      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              GetAllNotifications();
              msgProvider.toast(res?.msg[config.language], 'bottom');
              return false;
            }, 900);
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

  // Get All notifications ============>>>

  const GetAllNotifications = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL = config.baseURL + 'get_all_notifications';
      consolepro.consolelog(API_URL.at, '<<API');
      const data = new FormData();

      data.append('user_id', userId);

      consolepro.consolelog(data, '<DATA');
      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setNotificationData(res?.notifications_array);
          } else {
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

  // Clear all notifications ============>>>

  const ClearAllNotification = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL = config.baseURL + 'clear_all_notifications';
      consolepro.consolelog(API_URL.at, '<<API');
      const data = new FormData();

      data.append('user_id', userId);

      consolepro.consolelog(data, '<DATA');
      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              GetAllNotifications();
              msgProvider.toast(res?.msg[config.language], 'bottom');
              return false;
            }, 900);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res, '<<RES');
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

  useFocusEffect(
    useCallback(() => {
      GetAllNotifications();
    }, []),
  );

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
              setTimeout(() => {
                setIsUserApproved(true);
                setIsProfileApprovalModal(false);
              }, 300);
            } else {
              setTimeout(() => {
                setIsUserApproved(false);
                setIsProfileApprovalModal(true);
              }, 300);
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
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
                tintColor: '#405757',

                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
            />
          </TouchableOpacity>
        </View>

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
              color: Colors.darkGreenColor,
              fontSize: (mobileW * 6.5) / 100,
              fontFamily: Font.FontMedium,
            }}>
            {t('notifications_txt')}
          </Text>

          <TouchableOpacity
            style={{
              borderBottomColor: Colors.themeColor2,
              borderBottomWidth: 1,
            }}
            onPress={() => ClearAllNotification()}
            activeOpacity={0.7}
            disabled={!isUserApproved}>
            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontSemibold,
                fontSize: (mobileW * 3.5) / 100,
              }}>
              {t('clear_all_txt')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ---------------------------- */}

        <FlatList
          data={notificationData}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.mainView,
            {
              paddingBottom: (mobileH * 8) / 100,
            },
          ]}
          renderItem={({item, index}) => (
            <Listview
              item={item}
              index={index}
              handleSigleNotificationDelete={handleSigleNotificationDelete}
              isUserApproved={isUserApproved}
            />
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: (mobileW * 4) / 100,
              }}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontSize: (mobileW * 3) / 100,
                  fontFamily: Font.FontSemibold,
                }}>
                {t('no_data_found_txt')}
              </Text>
            </View>
          )}
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

export default Notification;

const Listview = ({
  item,
  index,
  handleSigleNotificationDelete,
  isUserApproved,
}) => {
  return (
    <View
      style={{
        paddingVertical: (mobileH * 1) / 100,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: (mobileH * 1) / 100,
        borderBottomWidth: 1.5,
        borderBottomColor: Colors.conversationBorderColor,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: (mobileW * 80) / 100,
        }}>
        <Image
          style={{
            height: (mobileW * 10) / 100,
            width: (mobileW * 10) / 100,
            borderRadius: (mobileW * 50) / 100,
          }}
          source={
            item?.Image
              ? {uri: config.img_url + item?.image}
              : localimag?.icon_profile_user
          }
        />

        <View
          style={{
            marginHorizontal: (mobileW * 1.5) / 100,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: (mobileW * 80) / 100,
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: Font.FontSemibold,
                fontSize: (mobileW * 4) / 100,
                color: Colors.darkGreenColor,
                width: (mobileW * 45) / 100,
                // backgroundColor: 'red',
              }}>
              {item?.title[config.language]}
            </Text>

            <Text
              style={{
                fontFamily: Font.FontSemibold,
                fontSize: (mobileW * 3) / 100,
                color: Colors.darkGreenColor,
              }}>
              {item?.createtime}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 3) / 100,
                color: Colors.darkGreenColor,
                width: (mobileW * 60) / 100,
              }}>
              {item?.message[config.language]}
            </Text>

            <TouchableOpacity
              disabled={!isUserApproved}
              onPress={() =>
                handleSigleNotificationDelete(item?.notification_message_id)
              }
              style={{
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
          </View>
        </View>
      </View>
      {/* <View>
        <Image
          style={{
            height: (mobileW * 11.5) / 100,
            width: (mobileW * 11.5) / 100,
            borderRadius: (mobileW * 10) / 100,
          }}
          source={item.img}
        />
        <TouchableOpacity
          onPress={() => handleSigleNotificationDelete()}
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
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  mainView: {
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
  },
});
