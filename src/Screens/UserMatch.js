import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {localimag} from '../Provider/Localimage';
import {
  apifuntion,
  Colors,
  config,
  consolepro,
  Font,
  Lang_chg,
  mobileH,
  mobileW,
  localStorage,
} from '../Provider/utilslib/Utils';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const UserMatch = ({navigation}) => {
  const {params} = useRoute();
  const type = params?.type;
  console.log(type, 'match type');

  const {t} = useTranslation();
  const [otherUserdata, setOtherUserData] = useState(null);

  const [myData, setMyData] = useState(null);

  const [userId, setUserId] = useState(null);

  const getOtherUserDetails = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL +
        'get_other_user_profile?user_id=' +
        userId +
        '&other_user_id=' +
        params?.other_user_id;

      consolepro.consolelog('API URL ==> ', API_URL);

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            let details_arr = res?.user_details;
            setOtherUserData(details_arr);
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

  const getMyDetails = async () => {
    const user_array = await localStorage.getItemObject('user_array');
    const userId = user_array?.user_id;
    consolepro.consolelog('user_array ===> ', user_array);
    setUserId(userId);
    setMyData(user_array);
  };

  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [isActiveSubscription, setIsActiveSubscription] = useState(0);

  const [isHideShow, setIsHideShow] = useState(true);

  // Get all suscription history ===========

  const getAllSubscriptionHistory = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL + `get_subscription_history?user_id=${userId}`;

      apifuntion
        .getApi(API_URL, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog('Res ==========>>', res);
            const activeSubscription = res?.data?.find(
              item => item?.status === 1,
            );
            if (activeSubscription) {
              setIsActiveSubscription(1);
            } else {
              setIsActiveSubscription(0);
            }
            consolepro.consolelog(
              'Active Subscription ======>>',
              activeSubscription,
            );
            setSubscriptionHistory(res?.data);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              consolepro.consolelog('RES =====>>', res);
            }
          }
        })
        .catch(error => {
          consolepro.consolelog('Error ======>>', error);
        });
    } catch (error) {
      consolepro.consolelog('Error =========>>', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (config.device_type == 'ios') {
        setTimeout(() => {
          getAllSubscriptionHistory();
        }, 1200);
      } else {
        getAllSubscriptionHistory();
      }
    }, []),
  );

  useEffect(() => {
    getOtherUserDetails();
    getMyDetails();
  }, []);

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
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        {/* --------back ------ */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={{
            alignSelf: 'flex-start',
            marginTop: (mobileW * 3) / 100,
            marginLeft: (mobileW * 5) / 100,
            width: (mobileW * 7) / 100,
            height: (mobileW * 7) / 100,
          }}>
          <Image
            source={localimag.icon_back_arrow}
            style={[
              {
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              },
              {tintColor: Colors.ColorBlack},
            ]}
          />
        </TouchableOpacity>

        <View
          style={{
            alignItems: 'flex-start',
            marginLeft: (mobileW * 25) / 100,
            marginTop: (mobileW * 5) / 100,
          }}>
          <Image
            source={localimag.icon_green_heart}
            style={{width: (mobileW * 5) / 100, height: (mobileW * 5) / 100}}
          />
        </View>

        {/* ------ background image -------- */}
        <ImageBackground
          source={localimag.icon_dashed_background}
          style={{
            width: mobileW,
            height: (mobileH * 42) / 100,
          }}
          resizeMode="contain">
          <View
            style={{
              flexDirection: 'row',
              marginTop: (mobileH * 10) / 100,
              marginHorizontal: (mobileW * 5) / 100,
              // backgroundColor: 'blue'
            }}>
            {/* ------girl view ------- */}
            <View>
              <View>
                <View
                  style={{
                    // backgroundColor: 'blue',
                    borderTopLeftRadius: (mobileW * 20) / 100,
                    borderTopRightRadius: (mobileW * 20) / 100,
                    borderBottomLeftRadius: (mobileW * 20) / 100,
                    width: (mobileW * 45) / 100,
                    height: (mobileW * 45) / 100,
                    marginBottom: (mobileH * 1) / 100,
                    marginTop: (-mobileH * 1) / 100,
                  }}>
                  <Image
                    source={
                      otherUserdata?.user_images[0]?.image
                        ? {
                            uri:
                              config.img_url +
                                otherUserdata?.user_images[0]?.image ||
                              config.img_url +
                                otherUserdata?.user_images[1]?.image ||
                              config.img_url +
                                otherUserdata?.user_images[2]?.image,
                          }
                        : localimag.icon_userPlaceholder
                    }
                    style={{
                      width: (mobileW * 45) / 100,
                      height: (mobileW * 45) / 100,
                      borderRadius: (mobileW * 30) / 100,
                      borderBottomRightRadius: (mobileW * 1) / 100,
                    }}
                    // resizeMode="contain"
                  />
                </View>

                <View
                  style={{
                    backgroundColor: Colors.themeColor,
                    borderRadius: (mobileW * 4) / 100,
                    width: (mobileW * 30) / 100,
                    height: (mobileW * 8) / 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: (mobileW * 1) / 100,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.5,
                    shadowRadius: (mobileW * 3) / 100,
                    position: 'absolute',
                    right: (-mobileW * 14) / 100,
                    top: (mobileW * 6) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontRegular,
                      fontSize: (mobileW * 3) / 100,
                    }}>{`100 % match`}</Text>
                </View>
              </View>

              {otherUserdata?.pet_images && (
                <View
                  style={{
                    borderRadius: (mobileW * 10) / 100,
                    // backgroundColor: 'blue',
                    overflow: 'hidden',
                    alignSelf: 'flex-end',
                    marginRight: (mobileW * 3) / 100,
                  }}>
                  <Image
                    source={{
                      uri: config.img_url + otherUserdata?.pet_images[0]?.image,
                    }}
                    style={{
                      width: (mobileW * 15) / 100,
                      height: (mobileW * 15) / 100,
                    }}
                  />
                </View>
              )}

              <View>
                <Image
                  source={localimag.icon_foot}
                  style={{
                    width: (mobileW * 15) / 100,
                    height: (mobileW * 15) / 100,
                    marginLeft: (mobileW * 5) / 100,
                  }}
                />
              </View>
            </View>

            {/* ----- boy view -------- */}
            <View style={{marginTop: (mobileW * 25) / 100}}>
              <View
                style={{
                  borderTopLeftRadius: (mobileW * 20) / 100,
                  borderTopRightRadius: (mobileW * 20) / 100,
                  borderBottomLeftRadius: (mobileW * 20) / 100,
                  width: (mobileW * 45) / 100,
                  height: (mobileW * 45) / 100,
                  marginBottom: (mobileH * 1) / 100,
                }}>
                <Image
                  source={
                    myData?.user_images[0]?.image
                      ? {
                          uri: config.img_url + myData?.user_images[0]?.image,
                        }
                      : localimag.icon_userPlaceholder
                  }
                  style={{
                    width: (mobileW * 45) / 100,
                    height: (mobileW * 45) / 100,
                    borderRadius: (mobileW * 30) / 100,
                    borderBottomLeftRadius: (mobileW * 1) / 100,
                    marginLeft: (mobileW * 3) / 100,
                  }}
                  // resizeMode="contain"
                />
              </View>

              {myData?.pet_images && (
                <View
                  style={{
                    borderRadius: (mobileW * 10) / 100,
                    // backgroundColor: 'blue',
                    overflow: 'hidden',
                    alignSelf: 'flex-start',
                    marginLeft: (mobileW * 3) / 100,
                  }}>
                  <Image
                    source={{
                      uri: config.img_url + myData?.pet_images[0]?.image,
                    }}
                    style={{
                      width: (mobileW * 15) / 100,
                      height: (mobileW * 15) / 100,
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        </ImageBackground>

        {/* ------- congratulations -------- */}
        <View style={{marginTop: (mobileH * 12) / 100, alignItems: 'center'}}>
          <Text
            style={{
              color: Colors.themeColor,
              fontFamily: Font.FontSemibold,
              fontSize: (mobileW * 4) / 100,
            }}>
            {t('congratulations_txt')}
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontBold,
                fontSize: (mobileW * 7) / 100,
              }}>{`It's A Match,`}</Text>

            {myData?.name?.length < 8 && (
              <Text
                style={{
                  color: Colors.themeColor,
                  fontFamily: Font.FontBold,
                  fontSize: (mobileW * 7) / 100,
                  marginLeft: (mobileW * 2) / 100,
                }}>{`${myData?.name}!!`}</Text>
            )}
          </View>

          {myData?.name?.length > 8 && (
            <Text
              style={{
                color: Colors.themeColor,
                fontFamily: Font.FontBold,
                fontSize: (mobileW * 7) / 100,
                marginLeft: (mobileW * 2) / 100,
              }}>{`${myData?.name}!!`}</Text>
          )}

          <View style={{alignSelf: 'center', alignItems: 'center'}}>
            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 3.5) / 100,
                textAlign: 'center',
                marginHorizontal: (mobileW * 10) / 100,
              }}>
              {t('do_not_waste_time_start_converstation_txt')}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (isHideShow) {
                  // If user is hidden, directly go to ChatScreen
                  navigation.navigate('ChatScreen', {
                    pageType: 1,
                    type: 1,
                    matchId: params?.other_user_id,
                    userId: userId,
                  });
                } else if (isActiveSubscription == 1 && params?.other_user_id) {
                  // If user has active subscription and other user exists
                  navigation.navigate('ChatScreen', {
                    pageType: 1,
                    type: 1,
                    matchId: params?.other_user_id,
                    userId: userId,
                  });
                } else if (isActiveSubscription == 1) {
                  // If only subscription is active
                  navigation.navigate('Conversation', {
                    pageType: 1,
                    type: 1,
                    matchId: params?.other_user_id,
                    userId: userId,
                  });
                } else {
                  // No subscription
                  navigation.navigate('Subscription', {
                    pageType: 1,
                    other_user_id: params?.other_user_id,
                    userId: userId,
                  });
                }
              }}
              style={{
                width: (mobileW * 70) / 100,
                height: (mobileW * 12) / 100,
                backgroundColor: Colors.themeColor,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: (mobileW * 7) / 100,
                flexDirection: 'row',
                marginTop: (mobileW * 5) / 100,
              }}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3.5) / 100,
                }}>
                {t('start_chatting_now_txt')}
              </Text>
              <Image
                source={localimag.icon_white_double_heart}
                style={{
                  width: (mobileW * 8) / 100,
                  height: (mobileW * 8) / 100,
                  marginLeft: (mobileW * 3) / 100,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{alignSelf: 'center'}}
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3.5) / 100,
                  marginTop: (mobileW * 3) / 100,
                }}>
                {t('not_now_chat_later_txt')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserMatch;

const styles = StyleSheet.create({});
