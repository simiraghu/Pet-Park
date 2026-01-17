import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {localimag} from '../Provider/Localimage';
import {
  config,
  consolepro,
  mobileH,
  mobileW,
  localStorage,
  apifuntion,
} from '../Provider/utilslib/Utils';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const SubscriptionHistory = () => {
  const {goBack, navigate} = useNavigation();
  const {t} = useTranslation();

  const [subscriptionHistory, setSubscriptionHistory] = useState([]);

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
            setSubscriptionHistory(res?.data);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainView}>
        {/* header */}

        <View
          style={{
            width: (mobileW * 90) / 100,
            alignSelf: 'center',
            marginTop: (mobileH * 3.5) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => goBack()}
            activeOpacity={0.8}
            style={{
              width: (mobileW * 16) / 100,
              height: (mobileW * 16) / 100,
            }}>
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

        {/* heading  */}

        <View style={{marginLeft: (mobileW * 7) / 100}}>
          <Text
            style={{
              color: Colors.themeColor2,
              fontFamily: Font.FontBold,
              fontSize: (mobileW * 4.5) / 100,
            }}>
            {t('subscription_history_txt')}
          </Text>

          <Text
            style={{
              color: Colors.themeColor2,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 3) / 100,
              marginTop: (mobileW * 3) / 100,
            }}>
            {t('subscripton_subHeading_txt')}
          </Text>
        </View>

        {/* subscription List items */}

        <View
          style={{
            flex: 1,
            alignSelf: 'center',
            marginTop: (mobileW * 9) / 100,
          }}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={subscriptionHistory}
            contentContainerStyle={{paddingBottom: (mobileW * 30) / 100}}
            renderItem={({item, index}) => (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {}}
                style={{
                  backgroundColor: item?.status
                    ? Colors.ColorPremiumBox
                    : Colors.whiteColor,
                  borderColor: item?.status
                    ? Colors.themeColor
                    : Colors.ColorGrayTransparent,
                  width: (mobileW * 94) / 100,
                  paddingVertical: (mobileW * 5) / 100,
                  marginVertical: (mobileW * 2) / 100,
                  borderRadius: (mobileW * 3) / 100,
                  borderWidth: 1,
                }}>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    marginHorizontal: (mobileW * 4) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontSemibold,
                      fontSize: (mobileW * 4) / 100,
                    }}>
                    {item?.amount == 0
                      ? 'FREE'
                      : config.currency[0] + ' ' + item?.amount}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: (mobileW * 2) / 100,
                  }}>
                  <View
                    style={{
                      backgroundColor:
                        item?.status == 1
                          ? Colors.themeColor
                          : Colors.cancleColor,
                      paddingVertical: (mobileW * 1) / 100,
                      alignSelf: 'flex-start',
                      marginHorizontal: (mobileW * 4) / 100,
                      marginTop: (mobileW * 1) / 100,
                      borderRadius: (mobileW * 1) / 100,
                      paddingHorizontal: (mobileW * 3) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.whiteColor,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3) / 100,
                      }}>
                      {String(item?.months)?.endsWith('ays')
                        ? item?.months + ' ' + t('subscription_txt')
                        : item?.months + ' ' + t('month_subscription_txt')}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color:
                        item.status == 1
                          ? Colors.themeColor
                          : Colors.cancleColor,
                      marginHorizontal: (mobileW * 3) / 100,
                      fontFamily: Font.FontSemibold,
                      fontSize: (mobileW * 3) / 100,
                    }}>
                    {item?.status == 1
                      ? t('active_txt')
                      : item?.status == 2
                      ? t('cancelmedia')
                      : t('Expired_txt')}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: (mobileW * 3) / 100,
                    alignSelf: item?.amount != 0 ? 'center' : 'flex-start',
                    marginLeft: item?.amount == 0 ? (mobileW * 3) / 100 : 0,
                  }}>
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3) / 100,
                      }}>
                      {t('start_date_txt')}
                    </Text>
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 2.5) / 100,
                      }}>
                      {item?.start_date}
                    </Text>
                  </View>

                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginHorizontal: (mobileW * 1.5) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3) / 100,
                      }}>
                      {t('end_date_txt')}
                    </Text>
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 2.5) / 100,
                      }}>
                      {item?.end_date}
                    </Text>
                  </View>

                  {item?.amount != 0 && (
                    <>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 3) / 100,
                            marginRight: (mobileW * 2) / 100,
                          }}>
                          {t('transaction_id_txt')}
                        </Text>
                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 2.5) / 100,
                          }}>
                          {item?.transaction_id}
                        </Text>
                      </View>

                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 3) / 100,
                          }}>
                          {t('transaction_date_txt')}
                        </Text>
                        <Text
                          style={{
                            color: Colors.themeColor2,
                            fontFamily: Font.FontMedium,
                            fontSize: (mobileW * 2.5) / 100,
                          }}>
                          {item?.transaction_date}
                        </Text>
                      </View>
                    </>
                  )}
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
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3.5) / 100,
                  }}>
                  {t('no_data_found_txt')}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SubscriptionHistory;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: Colors.whiteColor,
    flex: 1,
  },
});
