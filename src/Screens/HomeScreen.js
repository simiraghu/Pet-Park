import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Lang_chg} from '../Provider/Language_provider';
import {config} from '../Provider/configProvider';
import {Colors, Font} from '../Provider/Colorsfont';
import {localimag, mobileH, mobileW} from '../Provider/utilslib/Utils';
import LinearGradient from 'react-native-linear-gradient';
import CommonButton from '../Components/CommonButton';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const HomeScreen = ({navigation}) => {
  const [isActiveRadio, setIsActiveRadio] = useState(0);
  const {t} = useTranslation();
  const [selectionData, setSelectionData] = useState([
    {
      id: 1,
      mainHeading: t('friendship_txt'),
      subHeading: t('where_paws_meets_for_lifelong_friendships_txt'),
    },
    {
      id: 2,
      mainHeading: t('plan_a_new_pet_txt'),
      subHeading: t('your_journey_perfect_pet_companion_start_here'),
    },
  ]);

  const handleBackPress = useCallback(() => {
    BackHandler.exitApp();
    return true;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => backHandler.remove();
    }, [handleBackPress]),
  );

  const handleContinuePress = () => {
    isActiveRadio === 0
      ? navigation.navigate('IdentityProof', {page: 'friendship'})
      : navigation.navigate('IdentityProof', {page: 'Planapet'});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        {/* ----- heading text ------ */}
        <View
          style={{alignSelf: 'center', marginHorizontal: (mobileW * 4) / 100}}>
          <View style={{marginTop: (mobileH * 8) / 100}}>
            <Text
              style={{
                color: Colors.ColorBlack,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 6) / 100,
              }}>
              {t('what_brings_you_to_pet_park_txt')}
            </Text>
            <Text
              style={{
                color: Colors.themeColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 3.9) / 100,
                textAlign: 'center',
              }}>
              {t('discover_connections_playtime_pawsitive_vibes_txt')}
            </Text>
          </View>
        </View>

        {/* ------- selection radio ----- */}

        <View style={{alignSelf: 'center', marginTop: (mobileW * 5) / 100}}>
          {selectionData.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={index.toString()}
              onPress={() => setIsActiveRadio(index)}>
              <LinearGradient
                colors={
                  index === isActiveRadio
                    ? ['#85B068', '#47573DFF']
                    : ['#E0EDD7FF', '#DFF0D6FF']
                }
                style={{
                  width: (mobileW * 90) / 100,
                  height: (mobileH * 9) / 100,
                  borderRadius: (mobileW * 3) / 100,
                  justifyContent: 'center',
                  marginVertical: (mobileW * 3) / 100,
                }}
                start={{x: 0, y: 0.25}}
                end={{x: 1, y: 0.25}}>
                <View
                  style={{
                    marginHorizontal: (mobileW * 3) / 100,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        color:
                          index === isActiveRadio
                            ? Colors.whiteColor
                            : Colors.themeColor,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 4) / 100,
                      }}>
                      {item.mainHeading}
                    </Text>

                    <Image
                      source={
                        index === isActiveRadio
                          ? localimag.icon_filled_radio
                          : localimag.icon_empty_radio
                      }
                      style={{
                        width: (mobileW * 5) / 100,
                        height: (mobileW * 5) / 100,
                      }}
                    />
                  </View>

                  <View>
                    <Text
                      style={{
                        color:
                          index === isActiveRadio
                            ? Colors.whiteColor
                            : Colors.ColorBlack,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3) / 100,
                      }}>
                      {item.subHeading}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* -------- continue button -------- */}
        <CommonButton
          title={t('continue_txt')}
          containerStyle={{
            backgroundColor: Colors.themeColor2,
            position: 'absolute',
            bottom: (mobileW * 6) / 100,
          }}
          onPress={handleContinuePress}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
