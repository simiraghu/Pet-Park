import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import InputField from '../Components/InputField';
import CommonButton from '../Components/CommonButton';
import {SafeAreaView} from 'react-native-safe-area-context';

const DeleteAccount = () => {
  const {goBack, navigate} = useNavigation();
  const [description, setDescription] = useState(null);
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
              width: (mobileW * 5) / 100,
              height: (mobileW * 5) / 100,
              marginTop: (mobileW * 3) / 100,
            }}>
            <Image
              source={localimag.icon_back_arrow}
              style={{
                width: (mobileW * 5) / 100,
                height: (mobileW * 5) / 100,
              }}
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
          <View
            style={{
              marginTop: (mobileH * 3) / 100,
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 6.5) / 100,
                fontFamily: Font.FontBold,
              }}>
              {Lang_chg.delete_account_txt[config.language]}
            </Text>

            <InputField
              multiline={true}
              keyboardType="default"
              value={description}
              setValue={setDescription}
              maxLength={250}
              title={Lang_chg.enteryourReason_txt[config.language]}
              containerStyle={{
                marginTop: (mobileH * 2) / 100,
              }}
              inputStyle={{
                height: (mobileH * 20) / 100,
                textAlignVertical: 'top',
                marginTop: (mobileH * 2.5) / 100,
                color: Colors.placeholderTextColor,
              }}
            />
          </View>

          <View
            style={{
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
              marginTop: (mobileH * 3.5) / 100,
            }}>
            <CommonButton
              containerStyle={{
                width: (mobileW * 25) / 100,
                height: (mobileH * 4) / 100,
                alignSelf: 'flex-end',
              }}
              btnTextStyle={{
                fontSize: (mobileW * 3.5) / 100,
              }}
              title={Lang_chg.submit_txt[config.language]}
              onPress={() => navigate('WelcomeScreen')}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.themeColor2,
  },
});
