import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {localimag} from '../Provider/Localimage';
import {
  config,
  consolepro,
  Lang_chg,
  mobileH,
  mobileW,
} from '../Provider/utilslib/Utils';
import CommonButton from '../Components/CommonButton';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const Subscription = ({navigation, route}) => {
  const {t} = useTranslation();

  const other_user_id = route?.params?.other_user_id;
  const userId = route?.params?.userId;
  const type = route?.params?.type;
  consolepro.consolelog(type, 'type');

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
            marginHorizontal: (mobileW * 3) / 100,
            flex: 1,
            // alignSelf: 'center',
            marginTop: (mobileH * 37) / 100,
          }}>
          {/* unlock heading */}

          <Text
            style={{
              color: Colors.whiteColor,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 5.7) / 100,
              marginLeft: (mobileW * 1) / 100,
            }}>
            {t('unlock_exclusive_feature_txt')}
          </Text>

          {/*  features */}
          <View style={{marginHorizontal: (mobileW * 1) / 100}}>
            {/* unlimited pet matches */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: (mobileW * 5) / 100,
              }}>
              <Image
                source={localimag.icon_unlimited_match}
                style={{
                  width: (mobileW * 9) / 100,
                  height: (mobileW * 9) / 100,
                }}
              />
              <Text
                style={{
                  color: Colors.themeColor,
                  fontFamily: Font.FontRegular,
                  fontSize: (mobileW * 4.2) / 100,
                  marginLeft: (mobileW * 1) / 100,
                }}>
                {t('unlimited_pet_match_txt')}
              </Text>
            </View>

            {/* early access new feature */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: (mobileW * 1) / 100,
              }}>
              <Image
                source={localimag.icon_easily_access}
                style={{
                  width: (mobileW * 9) / 100,
                  height: (mobileW * 9) / 100,
                }}
              />
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontRegular,
                  fontSize: (mobileW * 4.2) / 100,
                  marginLeft: (mobileW * 1) / 100,
                }}>
                {t('early_access_to_new_feature_txt')}
              </Text>
            </View>

            {/* full community */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',

                marginTop: (mobileW * 1) / 100,
              }}>
              <Image
                source={localimag.icon_community_premium}
                style={{
                  width: (mobileW * 9) / 100,
                  height: (mobileW * 9) / 100,
                }}
              />
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontRegular,
                  fontSize: (mobileW * 4.2) / 100,
                  marginLeft: (mobileW * 1) / 100,
                }}>
                {t('access_to_full_community_feature_txt')}
              </Text>
            </View>

            {/* chat and connect pet owner */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: (mobileW * 1) / 100,
              }}>
              <Image
                source={localimag.icon_chat_and_connect}
                style={{
                  width: (mobileW * 9) / 100,
                  height: (mobileW * 9) / 100,
                }}
              />
              <Text
                style={{
                  color: Colors.themeColor,
                  fontFamily: Font.FontRegular,
                  fontSize: (mobileW * 4.2) / 100,
                  marginLeft: (mobileW * 1) / 100,
                }}>
                {t('chat_and_connect_pet_owner_txt')}
              </Text>
            </View>
          </View>

          {/* subscription button */}
          <CommonButton
            title={t('startOneMonthSubscription_txt')}
            btnTextStyle={{fontSize: (mobileW * 3.5) / 100}}
            containerStyle={{
              height: (mobileH * 5.5) / 100,
              borderRadius: (mobileW * 12) / 100,
              marginTop: (mobileW * 7) / 100,
            }}
            onPress={() =>
              navigation.navigate('ViewSubscriptionPlan', {
                userId: userId,
                other_user_id: other_user_id,
                type: type,
              })
            }
          />

          {/* view all plans */}
          <TouchableOpacity
            style={{alignSelf: 'center', marginTop: (mobileW * 4) / 100}}
            onPress={() =>
              navigation.navigate('ViewSubscriptionPlan', {
                userId: userId,
                other_user_id: other_user_id,
                type: type,
              })
            }
            activeOpacity={0.8}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontLight,
                fontSize: (mobileW * 3.5) / 100,
              }}>
              {t('view_all_plans_txt')}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Subscription;

const styles = StyleSheet.create({});
