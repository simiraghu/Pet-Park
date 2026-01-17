import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {localimag} from '../Provider/Localimage';
import {
  Colors,
  config,
  consolepro,
  Font,
  Lang_chg,
  mobileW,
  localStorage,
  apifuntion,
  msgProvider,
} from '../Provider/utilslib/Utils';
import CommonButton from '../Components/CommonButton';
import ConfirmModal from '../Components/ConfirmModal';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const BlockedAccount = ({navigation}) => {
  const [blockedUserData, setblockedUserData] = useState([]);

  const [isUnblocked, setIsUnblocked] = useState(false);
  const [otherUserId, setOtherUserId] = useState(null);
  const [blockedUserName, setBlockedUserName] = useState(null);

  const {t} = useTranslation();

  // GEt Blocked users =====>>

  const getBlockedAccounts = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL + 'get_all_blocked_users?user_id=' + userId;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setblockedUserData(res?.blocked_users);
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

  // unblock user ==========>>

  const unblockUser = async other_user_id => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL +
        `unblock_user?user_id=${userId}&other_user_id=${other_user_id}`;

      apifuntion
        .getApi(API_URL, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              setIsUnblocked(false);
              msgProvider.toast(res?.msg[config.language], 'bottom');
              if (config.device_type == 'ios') {
                setTimeout(() => {
                  getBlockedAccounts();
                }, 1200);
              } else {
                getBlockedAccounts();
              }
              return false;
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

  useEffect(() => {
    if (config?.device_type == 'ios') {
      setTimeout(() => {
        getBlockedAccounts();
      }, 1200);
    } else {
      getBlockedAccounts();
    }
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{backgroundColor: Colors.whiteColor, flex: 1}}>
        {/* --------back ------ */}
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
                marginLeft: (mobileW * 5) / 100,
                marginTop: (mobileW * 5) / 100,
              },
              {
                tintColor: Colors.ColorBlack,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              },
            ]}
          />
        </TouchableOpacity>

        {/* blocked account heading  */}

        <View
          style={{
            marginHorizontal: (mobileW * 7) / 100,
            marginTop: (mobileW * 4) / 100,
          }}>
          <Text
            style={{
              color: Colors.themeColor2,
              fontFamily: Font.FontSemibold,
              fontSize: (mobileW * 6.5) / 100,
            }}>
            {t('blocked_account_txt')}
          </Text>
        </View>

        {/*  blocked list  */}

        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          data={blockedUserData}
          keyExtractor={(item, index) => index.toString()}
          style={{marginTop: (mobileW * 5) / 100}}
          renderItem={({item, index}) => (
            <View
              style={{
                backgroundColor: Colors.ColorSearchBar,
                width: (mobileW * 90) / 100,
                alignSelf: 'center',
                paddingHorizontal: (mobileW * 3) / 100,
                borderRadius: (mobileW * 2) / 100,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: (mobileW * 3) / 100,
                marginTop: (mobileW * 3) / 100,
              }}>
              <View
                style={{
                  marginHorizontal: (mobileW * 1) / 100,
                  //   backgroundColor: 'red',
                  alignSelf: 'flex-start',
                  //   alignItems: 'center',
                }}>
                <View
                  style={{
                    // backgroundColor: 'blue',
                    // alignSelf: 'flex-start',
                    borderRadius: (mobileW * 30) / 100,
                    overflow: 'hidden',
                  }}>
                  <Image
                    source={
                      item?.image
                        ? {uri: config.img_url + item?.image}
                        : localimag?.icon_profile_user
                    }
                    style={{
                      width: (mobileW * 13) / 100,
                      height: (mobileW * 13) / 100,
                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      ],
                    }}
                  />
                </View>

                {/* <View
                style={{
                  // backgroundColor: 'blue',
                  alignSelf: 'flex-start',
                  borderRadius: (mobileW * 30) / 100,
                  overflow: 'hidden',
                  position: 'absolute',
                  right: 0,
                }}>
                <Image
                  source={localimag.icon_dog_1}
                  style={{
                    width: (mobileW * 5) / 100,
                    height: (mobileW * 5) / 100,
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                />
              </View> */}
              </View>
              <View
                style={{
                  marginLeft: (mobileW * 1) / 100,
                  flexDirection: 'row',
                  width: (mobileW * 65) / 100,
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 4) / 100,
                      textAlign: config.language == 1 ? 'left' : 'left',
                    }}>
                    {item?.name}
                  </Text>

                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3) / 100,
                      textAlign: config.language == 1 ? 'left' : 'left',
                    }}>{`Blocked`}</Text>
                </View>

                <CommonButton
                  title={t('unblocked_txt')}
                  containerStyle={{
                    width: (mobileW * 25) / 100,
                    height: (mobileW * 6) / 100,
                    backgroundColor: Colors.themeColor2,
                    // alignSelf: 'flex-end',
                  }}
                  btnTextStyle={{fontSize: (mobileW * 3) / 100}}
                  onPress={() => {
                    setOtherUserId(item?.user_id);
                    setBlockedUserName(item?.name);
                    setIsUnblocked(true);
                  }}
                />
              </View>
            </View>
          )}
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
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 4) / 100,
                }}>
                {t('no_data_found_txt')}
              </Text>
            </View>
          )}
        />

        <ConfirmModal
          visible={isUnblocked}
          onCancelText={t('cancel_txt')}
          btnText={t('unblock_txt')}
          popupicon={localimag.icon_unblock}
          message={t('are_you_sure_txt')}
          content={`${t('youWantToUnblock_txt')} ${blockedUserName}`}
          button={true}
          onCancelBtn={true}
          onCancelPress={() => setIsUnblocked(false)}
          onCrosspress={() => setIsUnblocked(false)}
          onPress={() => {
            unblockUser(otherUserId);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default BlockedAccount;

const styles = StyleSheet.create({});
