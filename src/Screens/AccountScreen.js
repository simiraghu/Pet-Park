import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {localimag} from '../Provider/Localimage';
import {config, Lang_chg, mobileW} from '../Provider/utilslib/Utils';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const AccountScreen = ({navigation}) => {
  const {t} = useTranslation();
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
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              },
              {tintColor: Colors.ColorBlack},
            ]}
          />
        </TouchableOpacity>

        {/* -------account heading ----- */}

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
            {t('account_txt')}
          </Text>
        </View>

        {/* --------- list --------- */}
        <View style={{marginTop: (mobileW * 5) / 100}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('PersonalInformation')}
            style={{
              width: mobileW,
              borderBottomWidth: (mobileW * 0.2) / 100,
              borderBottomColor: Colors.themeColor2,
              paddingVertical: (mobileW * 3) / 100,
              borderTopWidth: (mobileW * 0.2) / 100,
              borderTopColor: Colors.themeColor2,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: (mobileW * 5) / 100,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: (mobileW * 85) / 100,
                  marginLeft: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {t('personal_information_txt')}
                </Text>

                <Image
                  source={localimag.icon_arrow_forward}
                  style={{
                    width: (mobileW * 3) / 100,
                    height: (mobileW * 3) / 100,
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DeleteAccountScreen')}
            style={{
              width: mobileW,
              borderBottomWidth: (mobileW * 0.2) / 100,
              borderBottomColor: Colors.themeColor2,
              paddingVertical: (mobileW * 3) / 100,
              borderTopWidth: (mobileW * 0.2) / 100,
              borderTopColor: Colors.themeColor2,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: (mobileW * 5) / 100,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: (mobileW * 85) / 100,
                  marginLeft: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {t('delete_account_txt')}
                </Text>

                <Image
                  source={localimag.icon_arrow_forward}
                  style={{
                    width: (mobileW * 3) / 100,
                    height: (mobileW * 3) / 100,
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({});
