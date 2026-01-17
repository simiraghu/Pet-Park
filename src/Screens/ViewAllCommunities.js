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
import {Colors} from '../Provider/Colorsfont';
import {apifuntion} from '../Provider/Apicallingprovider/apiProvider';
import {consolepro} from '../Provider/Messageconsolevalidationprovider/Consoleprovider';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {config} from '../Provider/configProvider';
import {useTranslation} from 'react-i18next';
import {
  mobileH,
  mobileW,
  localStorage,
  Font,
  localimag,
} from '../Provider/utilslib/Utils';
import {SafeAreaView} from 'react-native-safe-area-context';

const ViewAllFollowedCommunities = () => {
  const [viewallCommunities, setViewallCommunities] = useState([]);
  const {navigate, goBack} = useNavigation();
  const {t} = useTranslation();
  // Get View All Communities

  const GetViewAllFollowedCommunities = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const API_URL =
        config.baseURL + 'view_all_followed_community?user_id=' + userId;

      apifuntion
        .getApi(API_URL, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setViewallCommunities(res?.followed_community);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res);
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<ERROr');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (config.device_type == 'ios') {
        setTimeout(() => {
          GetViewAllFollowedCommunities();
        }, 1200);
      } else {
        GetViewAllFollowedCommunities();
      }
    }, []),
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
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
              width: (mobileW * 12) / 100,
              height: (mobileW * 12) / 100,
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

        <View
          style={{
            //marginTop: (mobileH * 0.5) / 100,
            width: (mobileW * 90) / 100,
            alignSelf: 'center',
            paddingBottom: (mobileW * 4) / 100,
          }}>
          <Text
            style={{
              color: Colors.headingColor,
              fontSize: (mobileW * 4.5) / 100,
              fontFamily: Font.FontSemibold,
            }}>
            {t('all_followed_communities_txt')}
          </Text>
        </View>

        <FlatList
          data={viewallCommunities}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: (mobileH * 2) / 100,
            gap: (mobileW * 4) / 100,
            paddingHorizontal: (mobileW * 5) / 100,
            paddingBottom: (mobileH * 8) / 100,
          }}
          keyboardShouldPersistTaps="handled"
          renderItem={({item, index}) => (
            <AllFollowedCommunity item={item} index={index} t={t} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewAllFollowedCommunities;

const AllFollowedCommunity = ({item, index, t}) => {
  const {goBack, navigate} = useNavigation();
  consolepro.consolelog(item, '<< community ITEM');
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigate('JoinCommunity', {
          type: 1,
          community_id: item?.community_id,
        })
      }>
      <ImageBackground
        source={
          item?.cover_image
            ? {uri: config.img_url + item?.cover_image}
            : localimag?.icon_dog_1
        }
        style={{
          width: (mobileW * 90) / 100,
          alignSelf: 'center',
          height: (mobileH * 30) / 100,
          paddingHorizontal: (mobileW * 5) / 100,
          borderRadius: (mobileW * 4) / 100,
        }}
        imageStyle={{
          borderRadius: (mobileW * 4) / 100,
        }}>
        <View
          style={{
            width: (mobileW * 90) / 100,

            height: (mobileH * 30) / 100,
            backgroundColor: '#00000050',
            borderRadius: (mobileW * 4) / 100,
            alignSelf: 'center',
            paddingHorizontal: (mobileW * 5) / 100,
          }}>
          <View
            style={{
              marginTop: (mobileH * 2) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 4) / 100,
                fontFamily: Font.FontMedium,
                textAlign: config.language == 1 ? 'left' : 'left',
              }}>
              Welcome to #
              {item?.community_name?.length > 15
                ? config.language == 1
                  ? '...' + item?.community_name?.slice(0, 15)
                  : item?.community_name?.slice(0, 15) + '...'
                : item?.community_name}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={localimag.icon_star}
                style={{
                  width: (mobileW * 3) / 100,
                  height: (mobileW * 3) / 100,
                }}
              />

              <Text
                style={{
                  color: Colors.whiteColor,
                  fontSize: (mobileW * 2.8) / 100,
                  fontFamily: Font.FontRegular,
                  marginLeft: (mobileW * 1) / 100,
                }}>{`(${item?.joined_members_count}+ Members)`}</Text>
            </View>

            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 2.8) / 100,
                fontFamily: Font.FontRegular,
                marginTop: (mobileH * 1) / 100,
                lineHeight: (mobileH * 2.1) / 100,
                textAlign: config.language == 1 ? 'left' : 'left',
              }}>
              {item?.description?.slice(0, 230)}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigate('JoinCommunity', {
                type: 1,
                community_id: item?.community_id,
              })
            }
            style={{
              backgroundColor: Colors.whiteColor,
              width: (mobileW * 35) / 100,
              // paddingHorizontal: (mobileW * 1) / 100,
              height: (mobileH * 4.2) / 100,
              borderRadius: (mobileW * 30) / 100,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.themeColor,
              marginTop: (mobileH * 1.5) / 100,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: Colors.themeColor,
                fontSize: (mobileW * 2.8) / 100,
                fontFamily: Font.FontRegular,
              }}>
              {t('viewCommunity_txt')}
            </Text>

            <Image
              source={localimag.icon_arrow}
              style={{
                width: (mobileW * 5) / 100,
                height: (mobileW * 5) / 100,
                tintColor: Colors.themeColor,
                marginLeft: (mobileW * 1) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});
