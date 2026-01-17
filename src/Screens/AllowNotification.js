import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {Lang_chg} from '../Provider/Language_provider';
import {localimag} from '../Provider/Localimage';
import CommonButton from '../Components/CommonButton';
import {config, mobileW, localStorage} from '../Provider/utilslib/Utils';
import {t} from 'i18next';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const AllowNotification = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        <View
          style={{
            marginTop: (mobileW * 3) / 100,
            alignSelf: 'center',
            //   backgroundColor: 'blue',
            marginHorizontal: (mobileW * 5) / 100,
            flex: 1,
          }}>
          {/* -----back---- */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AllowLocation')}
            style={{
              alignSelf: 'flex-start',
              width: (mobileW * 10) / 100,
              height: (mobileW * 10) / 100,
            }}>
            <Image
              source={localimag.icon_back_arrow}
              style={[
                {
                  width: (mobileW * 6) / 100,
                  height: (mobileW * 6) / 100,
                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                },
                {tintColor: Colors.ColorBlack},
              ]}
            />
          </TouchableOpacity>

          {/* -------notification image---- */}
          <Image
            source={localimag.icon_notification}
            style={{
              width: (mobileW * 20) / 100,
              height: (mobileW * 20) / 100,
              marginTop: (mobileW * 5) / 100,
            }}
          />

          {/* ------- heading text ------ */}
          <Text
            style={{
              color: Colors.themeColor2,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 6.5) / 100,
              marginTop: (mobileW * 5) / 100,
            }}>
            {t('want_to_stay_informed')}
          </Text>

          <Text
            style={{
              color: Colors.themeColor,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 4) / 100,
            }}>
            {t('you_need_enable_notification_txt')}
          </Text>

          {/* --------- continue button ------ */}
          <View
            style={{
              position: 'absolute',
              bottom: (mobileW * 10) / 100,
              alignSelf: 'center',
            }}>
            <CommonButton
              title={t('continue_txt')}
              containerStyle={{backgroundColor: Colors.themeColor2}}
              onPress={() => {
                localStorage.setItemString('push_notification', 'true');
                navigation.replace('FriendshipHome');
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AllowNotification;

const styles = StyleSheet.create({});
