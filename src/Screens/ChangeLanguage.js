import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {
  config,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  Colors,
  Font,
} from '../Provider/utilslib/Utils';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SearchBar from '../Components/SearchBar';

import i18next from '../Services/i18next';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {setLanguage} from '../Redux/Slice/RegisterSlice';
import {language_set} from '../Provider/Language_provider';
import {SafeAreaView} from 'react-native-safe-area-context';

const ChangeLanguage = ({navigation}) => {
  const [isChangeLanguage, setIsChangeLanguage] = useState(0);

  const dispatch = useDispatch();

  const {t} = useTranslation();

  const language = useSelector(state => state.register?.language);

  const SetLanguage = val => {
    config.language = val;
  };

  useLayoutEffect(() => {
    setInitialState();
  }, []);

  const setInitialState = () => {
    setIsChangeLanguage(language);
  };

  const [languages, setLanguages] = useState([
    {
      id: 1,
      name: 'English',
    },
    {
      id: 2,
      name: 'Arabic',
    },
    {
      id: 3,
      name: 'Chinese',
    },
  ]);

  const updateLanguage = indx => {
    if (indx == 0) {
      SetLanguage(0);
      i18next.changeLanguage('en');
      dispatch(setLanguage(0));
      config.language = 0;
      language_set(0);
    }

    if (indx == 1) {
      SetLanguage(1);
      i18next.changeLanguage('ar');
      dispatch(setLanguage(1));
      config.language = 1;
      language_set(1);
    }

    if (indx == 2) {
      SetLanguage(2);
      i18next.changeLanguage('ch');
      dispatch(setLanguage(2));
      config.language = 2;
      language_set(2);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View
          style={{
            width: (mobileW * 90) / 100,
            alignSelf: 'center',
            marginTop: (mobileH * 2) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
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
                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                },
                //   {tintColor: Colors.ColorBlack},
              ]}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: (mobileH * 3) / 100,
            width: (mobileW * 90) / 100,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              color: Colors.whiteColor,
              fontSize: (mobileW * 6) / 100,
              fontFamily: Font.FontSemibold,
            }}>
            {t('choose_language_txt')}
          </Text>
        </View>
        {/* search bar */}

        <View>
          <SearchBar
            containerStyle={{
              backgroundColor: Colors.whiteColor,
              alignSelf: 'center',
            }}
            placeHolderText={t('search_txt')}
          />
        </View>

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          contentContainerStyle={{
            //   paddingBottom: (mobileH * 10) / 100,
            flex: 1,
          }}
          keyboardShouldPersistTaps="handled">
          <View
            style={{
              marginTop: (mobileH * 2) / 100,
              width: mobileW,
              paddingVertical: (mobileH * 2) / 100,
              backgroundColor: Colors.whiteColor,
              flex: 1,
            }}>
            <FlatList
              data={languages}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setIsChangeLanguage(index);

                      setTimeout(() => {
                        updateLanguage(index);
                      }, 500);
                    }}
                    style={{
                      marginTop: (mobileH * 1.5) / 100,
                      width: (mobileW * 90) / 100,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      {/* <Image
                      style={{
                        height: (mobileW * 5) / 100,
                        width: (mobileW * 5) / 100,
                      }}
                      source={item.image}></Image> */}

                      <Text
                        style={{
                          marginLeft: (mobileW * 2.5) / 100,
                          fontSize: (mobileW * 3.5) / 100,
                          fontFamily: Font.FontSemibold,
                          color: Colors.themeColor2,
                        }}>
                        {item.name}
                      </Text>
                    </View>
                    <Image
                      style={{
                        height: (mobileW * 4.5) / 100,
                        width: (mobileW * 4.5) / 100,
                      }}
                      source={
                        isChangeLanguage === index
                          ? localimag.icon_filled_checkbox_theme1
                          : localimag.icon_empty_checkbox_theme1
                      }></Image>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChangeLanguage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.themeColor2,
  },
});
