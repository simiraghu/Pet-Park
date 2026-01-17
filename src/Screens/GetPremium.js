import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {localimag} from '../Provider/Localimage';
import {
  Colors,
  config,
  Font,
  Lang_chg,
  mobileW,
} from '../Provider/utilslib/Utils';
import CommonButton from '../Components/CommonButton';
import {useRoute} from '@react-navigation/native';

const PLAN_DATA = [
  {
    id: 1,
    subsc_month: '1-month subscription',
    previous_price: `${config.currency[0]} 1,199`,
    current_price: `${config.currency[0]} 579 `,
    per_month: `(${config.currency[0]} 579 / month)`,
    off_percent: '- 50 %',
    popular_plan: false,
  },
  {
    id: 2,
    subsc_month: '3-month subscription',
    previous_price: `${config.currency[0]} 3,557`,
    current_price: `${config.currency[0]} 1290 `,
    per_month: `(${config.currency[0]} 430 / month)`,
    off_percent: '- 50 %',
    popular_plan: true,
  },
  {
    id: 3,
    subsc_month: '6-month subscription',
    previous_price: `${config.currency[0]} 7,194`,
    current_price: `${config.currency[0]} 2,240 `,
    per_month: `(${config.currency[0]} 373 / month)`,
    off_percent: '- 50 %',
    popular_plan: false,
  },
];
const GetPremium = ({navigation}) => {
  const [isSelectedPlan, setIsSelectedPlan] = useState(0);
  const {params} = useRoute();

  const pageType = params?.pageType;
  const type = params?.type;
  console.log(type, 'type');
  
  return (
    <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      {/* --------back------- */}
      <View
        style={{
          flexDirection: 'row',
          // alignItems: 'center',
          justifyContent: 'space-between',
          // backgroundColor: 'blue',
        }}>
        <ImageBackground
          source={localimag.icon_premium_screen_2}
          style={{width: (mobileW * 25) / 100, height: (mobileW * 25) / 100}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              alignSelf: 'flex-start',
              marginLeft: (mobileW * 4) / 100,
              marginTop: (mobileW * 4) / 100,
              width: (mobileW * 7) / 100,
              height: (mobileW * 7) / 100,
            }}>
            <Image
              source={localimag.icon_back_arrow}
              style={[
                {width: (mobileW * 6) / 100, height: (mobileW * 6) / 100},
                {tintColor: Colors.ColorBlack},
              ]}
            />
          </TouchableOpacity>
        </ImageBackground>

        <ImageBackground
          source={localimag.icon_premium2}
          style={{
            width: (mobileW * 55) / 100,
            height: (mobileW * 28) / 100,
          }}></ImageBackground>
      </View>
      <View
        style={{
          marginHorizontal: (mobileW * 3) / 100,
          // marginTop: (mobileW * 15) / 100,
          flex: 1,
          alignSelf: 'center',
        }}>
        {/* -------- unlock heading ------- */}
        <Text
          style={{
            color: Colors.themeColor2,
            fontFamily: Font.FontSemibold,
            fontSize: (mobileW * 5.5) / 100,
          }}>
          {Lang_chg.unlock_exclusive_feature_txt[config.language]}
        </Text>

        {/* ------- features -------- */}
        <View style={{marginHorizontal: (mobileW * 3) / 100}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: (mobileW * 5) / 100,
            }}>
            <Image
              source={localimag.icon_unlimited_match}
              style={{
                width: (mobileW * 8) / 100,
                height: (mobileW * 8) / 100,
              }}
            />
            <Text
              style={{
                color: Colors.themeColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 4) / 100,
                marginLeft: (mobileW * 2) / 100,
              }}>
              {Lang_chg.unlimited_pet_match_txt[config.language]}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: (mobileW * 1) / 100,
            }}>
            <Image
              source={localimag.icon_easily_access}
              style={{
                width: (mobileW * 8) / 100,
                height: (mobileW * 8) / 100,
              }}
            />
            <Text
              style={{
                color: Colors.themeColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 4) / 100,
                marginLeft: (mobileW * 2) / 100,
              }}>
              {Lang_chg.early_access_to_new_feature_txt[config.language]}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',

              marginTop: (mobileW * 1) / 100,
            }}>
            <Image
              source={localimag.icon_community_premium}
              style={{
                width: (mobileW * 8) / 100,
                height: (mobileW * 8) / 100,
              }}
            />
            <Text
              style={{
                color: Colors.themeColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 4) / 100,
                marginLeft: (mobileW * 2) / 100,
              }}>
              {Lang_chg.access_to_full_community_feature_txt[config.language]}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: (mobileW * 1) / 100,
            }}>
            <Image
              source={localimag.icon_chat_and_connect}
              style={{
                width: (mobileW * 8) / 100,
                height: (mobileW * 8) / 100,
              }}
            />
            <Text
              style={{
                color: Colors.themeColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 4) / 100,
                marginLeft: (mobileW * 2) / 100,
              }}>
              {Lang_chg.chat_and_connect_pet_owner_txt[config.language]}
            </Text>
          </View>
        </View>

        {/* ------- premium plan ---------- */}
        <FlatList
          data={PLAN_DATA}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          // style={{backgroundColor: 'red'}}
          renderItem={({item, index}) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsSelectedPlan(index)}
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
                  {item?.subsc_month}
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
                    {item?.off_percent}
                  </Text>
                </View>
              </View>

              <View>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontRegular,
                    fontSize: (mobileW * 3.5) / 100,
                    textDecorationLine: 'line-through',
                    marginHorizontal: (mobileW * 5) / 100,
                  }}>
                  {item.previous_price}
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
                    {item?.current_price}
                  </Text>
                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3.5) / 100,
                    }}>
                    {item?.per_month}
                  </Text>
                </View>

                {item?.popular_plan && (
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
                      {Lang_chg.most_popular_txt[config.language]}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        />

        {/* --------- get premium button ------ */}
        <CommonButton
          title={Lang_chg.get_premium_now[config.language]}
          containerStyle={{
            marginBottom: (mobileW * 6) / 100,
            elevation: (mobileW * 1) / 100,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.5,
            shadowRadius: (mobileW * 5) / 100,
          }}
          onPress={() => {
            if (type === 1) {
              navigation.navigate('MatchChat');
            } else {
              pageType === 1
                ? navigation.navigate('ChatScreen')
                : navigation.navigate('Conversation');
            }
          }}
        />
      </View>
    </View>
  );
};

export default GetPremium;

const styles = StyleSheet.create({
  selectedPlan: {
    backgroundColor: Colors.ColorPremiumBox,
    borderColor: Colors.themeColor,
    borderWidth: 1,
  },

  notSelectedPlan: {
    width: (mobileW * 90) / 100,
    marginTop: (mobileW * 4) / 100,
    backgroundColor: Colors.whiteColor,
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
  },
});
