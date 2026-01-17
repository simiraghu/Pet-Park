import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  Colors,
  config,
  consolepro,
  Font,
  Lang_chg,
  localimag,
  mobileW,
  localStorage,
} from '../Provider/utilslib/Utils';
import CommonButton from '../Components/CommonButton';
import {useTranslation} from 'react-i18next';
import {useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const AllowLocation = ({navigation}) => {
  const {t} = useTranslation();
  const {params} = useRoute();

  consolepro.consolelog(params, '<<PARAMS');

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        {/* -----back---- */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={{
            alignSelf: 'flex-start',
            width: (mobileW * 10) / 100,
            height: (mobileW * 10) / 100,
            marginLeft: (mobileW * 6) / 100,
            marginTop: (mobileW * 3) / 100,
          }}>
          <Image
            source={localimag.icon_back_arrow}
            style={[
              {
                width: (mobileW * 5) / 100,
                height: (mobileW * 5) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              },
              {tintColor: Colors.ColorBlack},
            ]}
          />
        </TouchableOpacity>

        <View
          style={{
            marginTop: (mobileW * 3) / 100,
            alignSelf: 'center',
            //   backgroundColor: 'blue',
            marginHorizontal: (mobileW * 5) / 100,
          }}>
          {/* -------notification image---- */}
          <Image
            source={localimag.icon_location_filled}
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
              fontSize: (mobileW * 6) / 100,
              marginTop: (mobileW * 5) / 100,
            }}>
            {t('where_in_the_world_are_you_txt')}
          </Text>

          <Text
            style={{
              color: Colors.themeColor,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 4) / 100,
            }}>
            {t('you_need_enable_location_txt')}
          </Text>

          {/* --------- allow button ------ */}
          <View style={{marginTop: (mobileW * 20) / 100}}>
            <CommonButton
              title={t('allow_location_access_txt')}
              containerStyle={{backgroundColor: Colors.themeColor2}}
              onPress={() => {
                localStorage.setItemString('permission', 'granted');
                navigation.navigate('UseCurrentLocation');
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AllowLocation;

const styles = StyleSheet.create({});
