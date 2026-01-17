import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  config,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  Colors,
  Font,
  consolepro,
  localStorage,
  apifuntion,
} from '../Provider/utilslib/Utils';
import {useNavigation, useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const FandQDetails = () => {
  const {goBack, navigate} = useNavigation();
  const {params} = useRoute();

  const {t} = useTranslation();

  const [fandQDetails, setFandQDetails] = useState('');
  const id = params?.id;
  const question = params?.question;

  const fandqID = params?.fandqID;
  const index = params?.index;

  consolepro.consolelog(fandqID, index, '<<FAq');

  const get_faq_details = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_array');
      const userId = user_arr?.user_id;

      const API_URL =
        config.baseURL + `get_faq_details?user_id=${userId}&faq_id=${fandqID}`;

      apifuntion
        .getApi(API_URL, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res?.faq_details, '<<RES');
            setFandQDetails(res?.faq_details);
          } else {
            consolepro.consolelog(res, '<<RES');
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<ER');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERR');
    }
  };

  useEffect(() => {
    if (config.device_type == 'ios') {
      setTimeout(() => {
        get_faq_details();
      }, 1200);
    } else {
      get_faq_details();
    }
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View
          style={{
            width: (mobileW * 90) / 100,
            alignSelf: 'center',
            marginTop: (mobileH * 4) / 100,
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
              style={{
                width: (mobileW * 7) / 100,
                height: (mobileW * 7) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
              tintColor={Colors.ColorBlack}
            />
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          contentContainerStyle={{
            paddingBottom: (mobileH * 10) / 100,
          }}
          keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              marginTop: (mobileH * 4) / 100,
              paddingVertical: (mobileH * 1.5) / 100,
              width: mobileW,
              backgroundColor: Colors.themeColor,
              //alignItems: 'center',
              paddingHorizontal: (mobileW * 6) / 100,
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: (mobileW * 3.8) / 100,
                fontFamily: Font.FontMedium,
                color: Colors.whiteColor,
              }}>
              {config.language == 1 ? `. ${index}` : `${index} .`}
            </Text>
            <Text
              style={{
                width: (mobileW * 70) / 100,
                marginLeft: (mobileW * 1) / 100,
                fontSize: (mobileW * 3.8) / 100,
                fontFamily: Font.FontMedium,
                color: Colors.whiteColor,
                textAlign: config.language == 1 ? 'left' : 'left',
              }}>
              {' '}
              {Array.isArray(fandQDetails.question) &&
              typeof config.language === 'number'
                ? fandQDetails.question[config.language] ||
                  fandQDetails.question[0] ||
                  ''
                : ''}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
              marginTop: (mobileH * 2) / 100,
            }}>
            <Text
              style={{
                fontSize: (mobileW * 4) / 100,
                fontFamily: Font.FontRegular,
                color: Colors.themeColor2,
                width: (mobileW * 85) / 100,
                textAlign: config.language == 1 ? 'left' : 'left',
              }}>
              {Array.isArray(fandQDetails.answer) &&
              typeof config.language === 'number'
                ? fandQDetails.answer[config.language] ||
                  fandQDetails.answer[0] ||
                  ''
                : ''}
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FandQDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
});
