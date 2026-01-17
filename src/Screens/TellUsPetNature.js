import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {localimag} from '../Provider/Localimage';
import {
  config,
  consolepro,
  Lang_chg,
  mobileH,
  mobileW,
  msgProvider,
} from '../Provider/utilslib/Utils';
import {useNavigation, useRoute} from '@react-navigation/native';

import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CommonButton from '../Components/CommonButton';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const TellUsPetNature = () => {
  const {goBack, navigate} = useNavigation();
  const [value, setValue] = useState(50);
  const [sliderValue, setSliderValue] = useState([]);

  //                   pet_name,
  // pet_type,
  // breed,
  // pet_dob,
  // pet_gender,
  // size,
  // image,
  // isVaccinated,
  // governmentRegister,
  // register,

  const {t} = useTranslation();
  const {params} = useRoute();

  const pet_name = params?.pet_name;
  const pet_type = params?.pet_type;
  const breed = params?.breed;
  const pet_dob = params?.pet_dob;
  const pet_gender = params?.pet_gender;
  const size = params?.size;
  const image = params?.image;
  const isVaccinated = params?.isVaccinated;
  const governmentRegister = params?.governmentRegister;
  const register = params?.register;
  const frontImage = params?.frontImage;
  const backImage = params?.backImage;
  const selfieImage = params?.selfieImage;

  console.log(frontImage, backImage, selfieImage, '<<Selfie image');

  const [natureData, setNatureData] = useState([
    {
      id: 1,
      nature: ['Friendly', 'ودود', '友好'],
      key: 'friendly',
    },
    {
      id: 2,
      nature: ['Active', 'نشيط', '活跃'],
      key: 'active',
    },
    {
      id: 3,
      nature: ['Aggressive', 'عدواني', '好斗的'],
      key: 'aggressive',
    },
    {
      id: 4,
      nature: ['Bark A Lot', 'ينبح كثيرا', '经常吠叫'],
      key: 'bark',
    },
    {
      id: 5,
      nature: ["Doesn't Bark", 'لا ينبح', '不吠叫'],
      key: 'doesnot_bark',
    },
    {
      id: 6,
      nature: ['Following You', 'يتبعك', '跟着你'],
      key: 'following_you',
    },
    {
      id: 7,
      nature: ['Kisser', 'يحب التقبيل', '亲吻者'],
      key: 'kisser',
    },
    {
      id: 8,
      nature: ['Love Licking', 'يحب اللعق', '喜欢舔'],
      key: 'love_licking',
    },
    {
      id: 9,
      nature: ['Guard', 'حارس', '守卫'],
      key: 'guard',
    },
    {
      id: 10,
      nature: ['Lazy', 'كسول', '懒惰'],
      key: 'lazy',
    },
    {
      id: 11,
      nature: ['Napper', 'يأخذ قيلولة', '打盹者'],
      key: 'napper',
    },
    {
      id: 12,
      nature: ['Love Seeker', 'باحث عن الحب', '寻爱者'],
      key: 'love_seeker',
    },
  ]);

  const [sliderValues, setSliderValues] = useState(
    natureData.reduce((acc, item) => {
      acc[item.key] = 0; // Initialize with 0 for each item's key
      return acc;
    }, {}),
  );

  const handleSliderChange = (values, index) => {
    const key = natureData[index]?.key; // Get the key for the item at this index
    if (key) {
      setSliderValues(prev => ({
        ...prev,
        [key]: values[0], // Update the slider value using the key
      }));
    }
  };

  const getSliderValuesByKey = () => {
    const result = {};

    natureData.forEach(item => {
      result[item.key] = sliderValues[item.key] ?? 0; // Use the key to get the value
    });

    return result;
  };

  const getSliderValuesArray = () => {
    const valuesArray = Object.values(sliderValues);
    return valuesArray;
  };

  const handleSubmit = () => {
    const sliderValuesArray = getSliderValuesByKey();

    consolepro.consolelog(sliderValuesArray, 'Slider Values Array');
    const valuesGreaterThanZero = Object.values(sliderValuesArray).filter(
      value => value > 0,
    ).length;

    // Check if at least 3 values are greater than 0
    if (valuesGreaterThanZero >= 3) {
      // Continue with the navigation or any other logic you want
      setTimeout(() => {
        navigate('KnowYourPet', {
          sliderValuesArray,
          pet_name,
          pet_type,
          breed,
          pet_dob,
          pet_gender,
          size,
          image,
          isVaccinated,
          governmentRegister,
          register,
          type: 1,
          frontImage,
          backImage,
          selfieImage,
        });
      }, 500);
    } else {
      msgProvider.toast(t('please_select_three_values_txt'), 'bottom');
      return false;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainView}>
        {/* back */}

        <TouchableOpacity
          onPress={() => goBack()}
          activeOpacity={0.8}
          style={{
            width: (mobileW * 6) / 100,
            height: (mobileW * 6) / 100,
            marginLeft: (mobileW * 4) / 100,
            marginTop: (mobileW * 4) / 100,
          }}>
          <Image
            source={localimag.icon_back_arrow}
            style={[
              {
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              },
              {tintColor: Colors.themeColor2},
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View
          style={{
            marginHorizontal: (mobileW * 3) / 100,
            marginTop: (mobileW * 5) / 100,
            alignSelf: 'center',
            flex: 1,
            paddingBottom: (mobileH * 10) / 100,
          }}>
          <Text
            style={{
              color: Colors.themeColor2,
              fontFamily: Font.FontSemibold,
              fontSize: (mobileW * 5.5) / 100,
            }}>
            {t('tell_use_about_your_pet_nature_txt')}
          </Text>

          <Text
            style={{
              color: Colors.themeColor,
              fontFamily: Font.FontSemibold,
              fontSize: (mobileW * 3.5) / 100,
            }}>
            {t('you_can_choose_any_three_txt')}
          </Text>

          {/* ---------- nature view --------- */}
          <FlatList
            data={natureData}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{
              marginTop: (mobileW * 5) / 100,
              // flex: 1,
              // backgroundColor: 'blue',
              // height: (mobileH * 30) / 100,
            }}
            contentContainerStyle={{paddingBottom: (mobileW * 10) / 100}}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.itemContainer,
                  {
                    backgroundColor:
                      (sliderValues[item.key] ?? 0) === 0
                        ? Colors.whiteColor
                        : Colors.themeColor,
                  },
                ]}>
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        (sliderValues[item.key] ?? 0) === 0
                          ? Colors.themeColor2
                          : Colors.whiteColor,
                    },
                  ]}>
                  {item?.nature[config.language]}
                </Text>

                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        sliderValues[index] === 0
                          ? Colors.themeColor2
                          : Colors.whiteColor,
                      textAlign: config.language == 2 ? 'right' : 'left',
                    },
                  ]}>
                  {sliderValues[item.key] !== 0
                    ? `${sliderValues[item.key]}%`
                    : ''}
                </Text>

                <MultiSlider
                  containerStyle={{
                    height: (mobileW * 3) / 100,
                    marginHorizontal: (mobileW * 2) / 100,
                  }}
                  values={[sliderValues[index] ?? 0]} // Ensure the value is 0 if undefined or null
                  min={0}
                  max={100}
                  step={1}
                  sliderLength={80}
                  onValuesChange={values => handleSliderChange(values, index)}
                  selectedStyle={{backgroundColor: '#FFF'}}
                  unselectedStyle={{backgroundColor: '#a7a39c'}}
                  trackStyle={{height: 3}}
                  markerStyle={{
                    backgroundColor:
                      (sliderValues[item.key] ?? 0) === 0
                        ? Colors.themeColor
                        : Colors.whiteColor,
                    width: (mobileW * 2.5) / 100,
                    height: (mobileW * 2.5) / 100,
                    borderRadius: (mobileW * 30) / 100,
                  }}
                />
              </View>
            )}
          />
          <CommonButton
            title={t('continue_txt')}
            containerStyle={{backgroundColor: Colors.themeColor2}}
            onPress={() => handleSubmit()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TellUsPetNature;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: Colors.whiteColor,
    flex: 1,
  },
  itemContainer: {
    backgroundColor: Colors.themeColor,
    width: (mobileW * 29) / 100,
    paddingVertical: (mobileW * 2) / 100,
    margin: (mobileW * 1) / 100,
    paddingHorizontal: (mobileW * 1) / 100,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    borderRadius: (mobileW * 2) / 100,
    // alignItems: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: (mobileW * 3) / 100,
    marginBottom: (mobileW * 1) / 100,
    fontFamily: Font.FontMedium,
  },
});
