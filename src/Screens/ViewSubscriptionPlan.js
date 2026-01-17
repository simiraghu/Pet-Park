import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {
  config,
  Lang_chg,
  localimag,
  mobileW,
  localStorage,
  consolepro,
  apifuntion,
  mobileH,
  msgProvider,
} from '../Provider/utilslib/Utils';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import {SafeAreaView} from 'react-native-safe-area-context';

const ViewSubscriptionPlan = ({navigation}) => {
  const [planData, setplanData] = useState([]);

  const [isSelectedPlan, setIsSelectedPlan] = useState(null);
  const [selected_plan_id, setSelected_plan_id] = useState(null);
  const [selected_plan_amount, setSelected_plan_amount] = useState(null);
  const [selectMonth, setSelectMonth] = useState(null);
  const [user_emailId, setUser_emailId] = useState(null);
  const [user_mobileNumber, setUser_mobileNumber] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [chatType, setChatType] = useState(null);

  const {params} = useRoute();
  const type = params?.type;
  consolepro.consolelog(type, 'type');

  const {t} = useTranslation();

  useFocusEffect(
    useCallback(() => {
      const get_user_details = async () => {
        try {
          const user_array = await localStorage.getItemObject('user_array');
          const user_email = user_array?.email;
          const user_mobile_number = user_array?.mobile;
          const user_name = user_array?.name;
          const user_id = user_array?.user_id;

          setUser_emailId(user_email);
          setUser_mobileNumber(user_mobile_number);
          setUserName(user_name);
          setUserId(user_id);
        } catch (error) {
          consolepro.consolelog('Error =========>>', error);
        }
      };

      get_user_details();
    }, []),
  );

  const getChatType = async () => {
    const startChat = await localStorage.getItemString('WoofYes');
    console.log(startChat, 'getchat');
    setChatType(startChat);
  };

  getChatType();

  // Get All Subscription ==============

  const getAllSubscription = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL = config.baseURL + 'get_all_subscription?user_id=' + userId;

      apifuntion
        .getApi(API_URL, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setplanData(res?.subscription_arr);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res);
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

  // Subscription Plan ================

  const buySubscriptionPlan = async () => {
    if (!selected_plan_id) {
      msgProvider.toast(t('please_select_subscription_plan_txt'), 'bottom');
      return false;
    }

    var options = {
      description: 'Pomsse',
      image: localimag?.icon_pet_park_main_logo,
      currency: 'INR',
      key: config.razorpay_key_id, // Your api key
      amount: selected_plan_amount * 100,
      name: 'Pomsse',
      prefill: {
        email: user_emailId,
        contact: user_mobileNumber,
        name: userName,
      },
      theme: {color: '#042222'},
    };

    if (selected_plan_amount != 0) {
      RazorpayCheckout.open(options)
        .then(data => {
          // handle success
          consolepro.consolelog('data', data);
          // alert(`Success: ${data.razorpay_payment_id}`);

          const apiData = new FormData();
          apiData.append('user_id', userId);
          apiData.append('amount', selected_plan_amount);
          apiData.append('subscription_id', selected_plan_id);
          apiData.append('transaction_id', data?.razorpay_payment_id);

          consolepro.consolelog('DATA =========>>', apiData);

          const API_URL = config.baseURL + 'buy_subscription';
          consolepro.consolelog('API Url ========>>', API_URL);

          setTimeout(() => {
            apifuntion
              .postApi(API_URL, apiData, 0)
              .then(res => {
                if (res?.success == true) {
                  consolepro.consolelog('RES =======>>', res);
                  msgProvider.toast(res?.msg[config.language], 'bottom');
                  setTimeout(() => {
                    type == 'home'
                      ? navigation.navigate('FriendshipHome')
                      : navigation.navigate('Conversation');
                  }, 300);

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
                consolepro.consolelog('Error ======>>', error);
              });
          }, 300);
        })
        .catch(error => {
          // handle failure
          consolepro.consolelog('error', error);
          msgProvider.alert(
            t('information_txt'),
            t('Payment_unsuccessful_txt'),
            false,
          );
        });
    } else {
      const apiData = new FormData();
      apiData.append('user_id', userId);
      apiData.append('amount', selected_plan_amount);
      apiData.append('subscription_id', selected_plan_id);
      apiData.append('transaction_id', '123456');

      consolepro.consolelog('DATA =========>>', apiData);

      const API_URL = config.baseURL + 'buy_subscription';
      consolepro.consolelog('API Url ========>>', API_URL);

      setTimeout(() => {
        apifuntion
          .postApi(API_URL, apiData, 0)
          .then(res => {
            if (res?.success == true) {
              consolepro.consolelog('RES =======>>', res);
              msgProvider.toast(res?.msg[config.language], 'bottom');
              setTimeout(() => {
                type == 'home'
                  ? navigation.navigate('FriendshipHome')
                  : navigation.navigate('Conversation');
              }, 300);

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
            consolepro.consolelog('Error ======>>', error);
          });
      }, 300);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (config.device_type == 'ios') {
        setTimeout(() => {
          getAllSubscription();
        }, 1200);
      } else {
        getAllSubscription();
      }
    }, []),
  );

  consolepro.consolelog('selected plan id', selected_plan_id);
  consolepro.consolelog('Selected plan amount', selected_plan_amount);
  consolepro.consolelog('User Email =====>>', user_emailId);
  consolepro.consolelog('User mobile number =======>>', user_mobileNumber);
  consolepro.consolelog('User name', userName);

  const getSubscriptionText = () => {
    if (!selectMonth && typeof selectMonth !== 'string') {
      return t('start_subscription_txt');
    }

    if (String(selectMonth).endsWith('ays')) {
      return `${t('start_txt')} ${selectMonth?.toUpperCase()} ${t(
        'subscription_txt_caps',
      )}`;
    }

    if (String(selectMonth).endsWith('ear')) {
      return `${t('start_txt')} ${selectMonth?.toUpperCase()} ${t(
        'subscription_txt_caps',
      )}`;
    }

    return `${t('start_txt')} ${String(selectMonth)} ${t(
      'month_subscription_txt_caps',
    )}`;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        style={{flex: 1}}
        source={localimag.icon_subscription_bg}>
        {/* --------back ------ */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={{
            alignSelf: 'flex-start',
            width: (mobileW * 14) / 100,
            height: (mobileW * 14) / 100,
            marginTop: (mobileW * 7) / 100,
            marginLeft: (mobileW * 5) / 100,
          }}>
          <Image
            source={localimag.icon_back_arrow}
            style={[
              {
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              },
            ]}
          />
        </TouchableOpacity>

        <View
          style={{
            alignSelf: 'center',
            flex: 1,
            // paddingBottom: (mobileW * 22) / 100,
          }}>
          {/* heading */}
          <Text
            style={{
              color: Colors.whiteColor,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 5.7) / 100,
              marginLeft: (mobileW * 1) / 100,
            }}>
            {t('unlock_exclusive_feature_txt')}
          </Text>

          {/*  premium plan */}
          <View style={{flex: 1}}>
            <FlatList
              data={planData}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingVertical: (mobileW * 6) / 100}}
              keyExtractor={(item, index) => index.toString()}
              // style={{backgroundColor: 'red'}}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setIsSelectedPlan(index);
                    setSelected_plan_id(item?.subscription_id);
                    setSelected_plan_amount(item?.amount);
                    setSelectMonth(String(item?.month));
                  }}
                  style={
                    isSelectedPlan === index
                      ? [styles.notSelectedPlan, styles.selectedPlan]
                      : styles.notSelectedPlan
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginHorizontal: (mobileW * 5) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.themeColor,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 4) / 100,
                        // marginTop: (mobileW * 4) / 100,
                      }}>
                      {String(item?.month)?.endsWith('ays')
                        ? String(item?.month) + ' ' + t('subscription_txt')
                        : String(item?.month) +
                          ' - ' +
                          t('month_subscription_txt')}
                    </Text>

                    <View
                      style={{
                        backgroundColor: Colors.themeColor,
                        alignSelf: 'center',
                        paddingVertical: (mobileW * 2) / 100,
                        paddingHorizontal: (mobileW * 2) / 100,
                        borderBottomLeftRadius: (mobileW * 3) / 100,
                        borderBottomEndRadius: (mobileW * 3) / 100,
                      }}>
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.FontRegular,
                          fontSize: (mobileW * 4) / 100,
                        }}>
                        {item?.discount} %
                      </Text>
                    </View>
                  </View>

                  <View>
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontRegular,
                        fontSize: (mobileW * 3.5) / 100,
                        // textDecorationLine: 'line-through',
                        marginHorizontal: (mobileW * 5) / 100,
                      }}>
                      {t('discount_amount_txt')}{' '}
                      {config.currency[config.language]} {item?.discount_amount}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: (mobileW * 5) / 100,
                        marginBottom: (mobileW * 2) / 100,
                      }}>
                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontSemibold,
                          fontSize: (mobileW * 5) / 100,
                        }}>
                        {`${config.currency[0]} ${item?.amount} `}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignSelf: 'flex-end',
                        // backgroundColor: 'red',
                        paddingVertical: (mobileW * 3) / 100,
                        paddingHorizontal: (mobileW * 5) / 100,
                      }}>
                      {item?.amount == 0 && (
                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontSemibold,
                            fontSize: (mobileW * 4) / 100,
                          }}>
                          {t('free_txt')}
                        </Text>
                      )}
                    </View>
                    {/* {item?.popular_plan && (
                    <View
                      style={{
                        backgroundColor: Colors.themeColor2,
                        alignSelf: 'flex-end',
                        paddingHorizontal: (mobileW * 3) / 100,
                        paddingVertical: (mobileW * 1) / 100,
                      }}>
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.FontRegular,
                          fontSize: (mobileW * 4) / 100,
                        }}>
                        {t('most_popular_txt')}
                      </Text>
                    </View>
                  )} */}
                  </View>
                </TouchableOpacity>
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
                      color: Colors.whiteColor,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3) / 100,
                    }}>
                    {t('no_data_found_txt')}
                  </Text>
                </View>
              )}
            />

            {/* subscription button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                // type == 'home'
                //   ? navigation.navigate('FriendshipHome')
                //   : navigation.navigate('Conversation')

                buySubscriptionPlan()
              }
              style={{
                backgroundColor: Colors.themeColor,
                width: (mobileW * 78) / 100,
                height: (mobileW * 12) / 100,
                borderRadius: (mobileW * 10) / 100,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                alignSelf: 'center',
                marginVertical: (mobileW * 13) / 100,
              }}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontRegular,
                  fontSize: (mobileW * 3.3) / 100,
                }}>
                {getSubscriptionText()}
              </Text>
              <Image
                source={localimag.icon_arrow}
                style={{
                  width: (mobileW * 6) / 100,
                  height: (mobileW * 6) / 100,
                  marginLeft: (mobileW * 1) / 100,
                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ViewSubscriptionPlan;

const styles = StyleSheet.create({
  selectedPlan: {
    backgroundColor: Colors.ColorPremiumBox,
    borderColor: Colors.themeColor,
    // borderWidth: 0.4,
  },

  notSelectedPlan: {
    width: (mobileW * 90) / 100,
    marginTop: (mobileW * 4) / 100,
    backgroundColor: Colors.whiteColor,
    borderRadius: (mobileW * 2) / 100,
    // borderColor: Colors.whiteColor,
    // borderWidth: 0.4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});
