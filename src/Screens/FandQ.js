import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  config,
  localimag,
  mobileH,
  mobileW,
  Colors,
  Font,
  consolepro,
  localStorage,
  apifuntion,
} from '../Provider/utilslib/Utils';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Nodata_foundimage} from '../Components/No_data_found';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const FandQ = () => {
  const {goBack, navigate} = useNavigation();

  const [fandq, setFAndQ] = useState([]);

  const {t} = useTranslation();

  const getFAQ = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_array');
      const userId = user_arr?.user_id;

      const API_URL = config.baseURL + 'get_faq?user_id=' + userId;

      apifuntion
        .getApi(API_URL, 0)
        .then(res => {
          if (res?.success == true) {
            setFAndQ(res?.faq_arr);
            consolepro.consolelog(res, '<<RES');
          } else {
            setFAndQ([]);
            consolepro.consolelog(res, '<<RES');
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<ERR');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<<ERror');
    }
  };

  useEffect(() => {
    if (config.device_type == 'ios') {
      setTimeout(() => {
        getFAQ();
      }, 1200);
    } else {
      getFAQ();
    }
  }, []);

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
            onPress={() => goBack()}
            activeOpacity={0.8}
            style={{
              width: (mobileW * 7) / 100,
              height: (mobileW * 7) / 100,
            }}>
            <Image
              source={localimag.icon_back_arrow}
              style={[
                {
                  width: (mobileW * 7) / 100,
                  height: (mobileW * 7) / 100,
                },
                {
                  tintColor: Colors.themeColor2,
                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                },
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          contentContainerStyle={{
            paddingBottom: (mobileH * 10) / 100,
            marginTop: (mobileH * 3) / 100,
          }}
          keyboardShouldPersistTaps="handled">
          <View
            style={{
              marginTop: (mobileH * 1) / 100,
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: Colors.themeColor2,
                fontSize: (mobileW * 6.5) / 100,
                fontFamily: Font.FontBold,
              }}>
              {t('fandq_txt')}
            </Text>
          </View>

          <FlatList
            data={fandq}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              marginTop: (mobileH * 2) / 100,
            }}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigate('FandQdetails', {
                      fandqID: item?.faq_id,
                      index: index + 1,
                    })
                  }
                  activeOpacity={0.8}
                  style={{
                    marginVertical: (mobileH * 0.5) / 100,
                    paddingVertical: (mobileH * 1.5) / 100,
                    width: mobileW,
                    backgroundColor: Colors.themeColor,
                    paddingHorizontal: (mobileW * 6) / 100,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: (mobileW * 3) / 100,
                      fontFamily: Font.FontMedium,
                      color: Colors.whiteColor,
                    }}>
                    {config.language == 1 ? `. ${index + 1}` : `${index + 1} .`}
                  </Text>
                  <Text
                    style={{
                      width: (mobileW * 70) / 100,
                      marginLeft: (mobileW * 1.5) / 100,
                      fontSize: (mobileW * 3.1) / 100,
                      fontFamily: Font.FontMedium,
                      color: Colors.whiteColor,
                      textAlign: config.language == 1 ? 'left' : 'left',
                    }}>
                    {Array.isArray(item.question) &&
                    typeof config.language === 'number'
                      ? item.question[config.language] || item.question[0] || ''
                      : ''}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={() => (
              <View style={{marginTop: (mobileH * 15) / 100}}>
                <Nodata_foundimage />
              </View>
            )}
          />
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FandQ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
});
