import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {
  config,
  Lang_chg,
  localimag,
  mobileW,
  localStorage,
} from '../Provider/utilslib/Utils';
import CommonModal from '../Components/CommonModal';

const PaymentMethod = ({navigation}) => {
  const [paymentModeData, setPaymentModeData] = useState([
    {
      id: 1,
      appIcon: localimag.icon_credit_card,
      app_name: Lang_chg.credit_card_txt[config.language],
    },
    {
      id: 2,
      appIcon: localimag.icon_paypal,
      app_name: Lang_chg.paypal_txt[config.language],
    },
    {
      id: 3,
      appIcon: localimag.icon_google_pay,
      app_name: Lang_chg.google_pay_txt[config.language],
    },
  ]);

  const [isPaymentMode, setIsPaymentMode] = useState(0);

  const [successModal, setSuccessModal] = useState(false);
  const [chatType, setChatType] = useState(null);

  const getChatType = async () => {
    const startChat = await localStorage.getItemString('WoofYes');
    console.log(startChat, 'getchat');
    setChatType(startChat);
  };
  getChatType();

  const PaymentModeComponent = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setIsPaymentMode(index);
        }}
        style={{
          width: (mobileW * 90) / 100,
          padding: (mobileW * 3) / 100,
          backgroundColor: Colors.whiteColor,
          marginTop: (mobileW * 3) / 100,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,
          elevation: 7,
          borderRadius: (mobileW * 2) / 100,
          borderColor: Colors.whiteColor,
          borderWidth: 1,
          alignSelf: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={item.appIcon}
            style={{width: (mobileW * 4) / 100, height: (mobileW * 4) / 100}}
          />

          <View
            style={{
              height: (mobileW * 9) / 100,
              width: (mobileW * 0.3) / 100,
              backgroundColor: Colors.themeColor2,
              marginLeft: (mobileW * 3) / 100,
            }}></View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: (mobileW * 3) / 100,
            }}>
            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontSemibold,
                fontSize: (mobileW * 3.5) / 100,
                width: (mobileW * 65) / 100,
              }}>
              {item.app_name}
            </Text>

            <Image
              style={{
                width: (mobileW * 4.5) / 100,
                height: (mobileW * 4.5) / 100,
              }}
              source={
                isPaymentMode === index
                  ? localimag.icon_filled_checkbox_theme1
                  : localimag.icon_empty_radio
              }
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{backgroundColor: Colors.whiteColor, flex: 1}}>
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
            {width: (mobileW * 6) / 100, height: (mobileW * 6) / 100},
            {tintColor: Colors.themeColor2},
          ]}
        />
      </TouchableOpacity>

      <View style={{marginHorizontal: (mobileW * 4) / 100}}>
        <Text
          style={{
            color: Colors.themeColor2,
            fontFamily: Font.FontBlack,
            fontSize: (mobileW * 5.5) / 100,
            marginLeft: (mobileW * 4) / 100,
          }}>
          {Lang_chg.payment_method_txt[config.language]}
        </Text>

        {/* payment mode */}
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{paddingVertical: (mobileW * 3) / 100}}
          data={paymentModeData}
          renderItem={({item, index}) => (
            <PaymentModeComponent item={item} index={index} />
          )}
        />

        {/* total bill */}
        <View
          style={{
            backgroundColor: Colors.themeColor,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,
            elevation: 7,
            marginTop: (mobileW * 5) / 100,
            borderTopLeftRadius: (mobileW * 2) / 100,
            borderTopRightRadius: (mobileW * 2) / 100,
            borderBottomLeftRadius: (mobileW * 4) / 100,
            borderBottomRightRadius: (mobileW * 4) / 100,
          }}>
          <View
            style={{
              backgroundColor: Colors.whiteColor,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.29,
              shadowRadius: 4.65,
              elevation: 7,
              borderTopLeftRadius: (mobileW * 2) / 100,
              borderTopRightRadius: (mobileW * 2) / 100,
              borderBottomLeftRadius: (mobileW * 4) / 100,
              borderBottomRightRadius: (mobileW * 4) / 100,
              borderColor: Colors.whiteColor,
              borderWidth: 1,
            }}>
            {/* 1-month subscription  */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: (mobileW * 3) / 100,
                marginTop: (mobileW * 3) / 100,
              }}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 4) / 100,
                }}>{`1-month subscription`}</Text>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 4) / 100,
                }}>{`Rs. 1`}</Text>
            </View>

            {/* divider */}
            <View
              style={{
                width: (mobileW * 86) / 100,
                height: (mobileW * 0.2) / 100,
                backgroundColor: Colors.placeholderTextColor,
                marginTop: (mobileW * 3) / 100,
                alignSelf: 'center',
              }}></View>

            {/* discount */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: (mobileW * 3) / 100,
                marginTop: (mobileW * 3) / 100,
                paddingBottom: (mobileW * 12) / 100,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 4) / 100,
                  }}>{`Discount`}</Text>
                <View
                  style={{
                    backgroundColor: Colors.themeColor,
                    paddingHorizontal: (mobileW * 2.5) / 100,
                    borderRadius: (mobileW * 10) / 100,
                    justifyContent: 'center',
                    marginLeft: (mobileW * 2) / 100,
                    paddingVertical: (mobileW * 0.6) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 2.5) / 100,
                    }}>{`- 99%`}</Text>
                </View>
              </View>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 4) / 100,
                }}>{`Rs. 99`}</Text>
            </View>
          </View>

          {/* payable amount */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: (mobileW * 4) / 100,
              paddingVertical: (mobileW * 4) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 4) / 100,
              }}>
              {Lang_chg.payable_amount_txt[config.language]}
            </Text>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 4) / 100,
              }}>
              {`Rs. 1.00`}
            </Text>
          </View>
        </View>
      </View>

      {/* pay now */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSuccessModal(true)}
        style={{
          backgroundColor: Colors.themeColor,
          position: 'absolute',
          bottom: 0,
          width: mobileW,
          alignItems: 'center',
          justifyContent: 'center',
          height: (mobileW * 15) / 100,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            color: Colors.whiteColor,
            fontFamily: Font.FontMedium,
            fontSize: (mobileW * 4) / 100,
          }}>
          {Lang_chg.pay_now_txt[config.language]}
        </Text>
        <Image
          source={localimag.icon_arrow}
          style={{
            width: (mobileW * 6) / 100,
            height: (mobileW * 6) / 100,
            marginLeft: (mobileW * 2) / 100,
          }}
        />
      </TouchableOpacity>

      {/* success modal */}
      <CommonModal
        message={Lang_chg.payment_successfully_txt[config.language]}
        visible={successModal}
        btnText={Lang_chg.done_txt[config.language]}
        button={true}
        onCrosspress={() => {
          setSuccessModal(false);
          chatType
            ? navigation.navigate('MatchChat', {type: 1})
            : navigation.navigate('Conversation');
        }}
        onPress={() => {
          setSuccessModal(false);
          chatType
            ? navigation.navigate('MatchChat', {type: 1})
            : navigation.navigate('Conversation');
        }}
      />
    </View>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({});
