import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {config, Lang_chg, localimag, mobileW} from '../Provider/utilslib/Utils';
import SearchBar from '../Components/SearchBar';

const CREATE_STORY_DATA = [
  {
    id: 1,
    image: localimag.icon_create_story,
  },
  {
    id: 2,
    image: localimag.icon_dog_1,
  },
  {
    id: 3,
    image: localimag.icon_dog_2,
  },
  {
    id: 4,
    image: localimag.icon_dog_3,
  },
  {
    id: 5,
    image: localimag.icon_dog_3,
  },
  {
    id: 6,
    image: localimag.icon_dog_5,
  },
  {
    id: 7,
    image: localimag.icon_dog_4,
  },
  {
    id: 8,
    image: localimag.icon_dog_2,
  },
];

const CONVERSATION_DATA = [
  {
    id: 1,
    profile_image: localimag.icon_profile_user,
    user_name: 'Jack',
    user_message: "Hello i'm Jack, i have a little dog cooco how are you?",
    message_time: '20 min',
  },
  {
    id: 2,
    profile_image: localimag.icon_profile_user,
    user_name: 'Jack',
    user_message: "Hello i'm Jack, i have a little dog cooco how are you?",
    message_time: '20 min',
  },
  {
    id: 3,
    profile_image: localimag.icon_profile_user,
    user_name: 'Jack',
    user_message: "Hello i'm Jack, i have a little dog cooco how are you?",
    message_time: '20 min',
  },
  {
    id: 4,
    profile_image: localimag.icon_profile_user,
    user_name: 'Jack',
    user_message: "Hello i'm Jack, i have a little dog cooco how are you?",
    message_time: '20 min',
  },
  {
    id: 5,
    profile_image: localimag.icon_profile_user,
    user_name: 'Jack',
    user_message: "Hello i'm Jack, i have a little dog cooco how are you?",
    message_time: '20 min',
  },
  {
    id: 6,
    profile_image: localimag.icon_profile_user,
    user_name: 'Jack',
    user_message: "Hello i'm Jack, i have a little dog cooco how are you?",
    message_time: '20 min',
  },
  {
    id: 7,
    profile_image: localimag.icon_profile_user,
    user_name: 'Jack',
    user_message: "Hello i'm Jack, i have a little dog cooco how are you?",
    message_time: '20 min',
  },
  {
    id: 8,
    profile_image: localimag.icon_profile_user,
    user_name: 'Jack',
    user_message: "Hello i'm Jack, i have a little dog cooco how are you?",
    message_time: '20 min',
  },
];

const ConversationScreen = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.whiteColor,
      }}>
      <View
        style={{
          marginTop: (mobileW * 3) / 100,
          marginLeft: (mobileW * 5) / 100,
          flex: 1,
        }}>
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
              {width: (mobileW * 6) / 100, height: (mobileW * 6) / 100},
              {tintColor: Colors.ColorBlack},
            ]}
          />
        </TouchableOpacity>

        {/* --------- heading -------- */}
        <View>
          <Text
            style={{
              color: Colors.themeColor2,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 6) / 100,
              marginTop: (mobileW * 3) / 100,
            }}>
            {Lang_chg.conversations_txt[config.language]}
          </Text>

          <Text
            style={{
              color: Colors.themeColor2,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 3.5) / 100,
            }}>
            {Lang_chg.treasure_every_paw_some_txt[config.language]}
          </Text>

          <Text
            style={{
              color: Colors.themeColor2,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 3.5) / 100,
            }}>
            {Lang_chg.one_time_memory_txt[config.language]}
          </Text>
        </View>

        {/* <View style={{marginTop: (mobileW * 4) / 100}}> */}
        <SearchBar placeHolderText={Lang_chg.search_txt[config.language]} />
        {/* </View> */}

        <FlatList
          data={CONVERSATION_DATA}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{marginTop: (mobileW * 7) / 100}}
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps="handled"
          renderItem={({item, index}) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ChatScreen')}
              style={{
                flexDirection: 'row',
                // alignItems: 'center',
                width: (mobileW * 90) / 100,
                // backgroundColor: 'blue',
                alignSelf: 'center',
                borderBottomColor: Colors.themeColor,
                borderBottomWidth: (mobileW * 0.2) / 100,
                marginBottom: (mobileW * 3) / 100,
              }}>
              <View
                style={{
                  marginBottom: (mobileW * 3) / 100,
                }}>
                <View
                  style={{
                    // backgroundColor: 'blue',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: (mobileW * 10) / 100,
                    alignSelf: 'center',
                    overflow: 'hidden',
                  }}>
                  <Image
                    source={item.profile_image}
                    style={{
                      width: (mobileW * 13) / 100,
                      height: (mobileW * 13) / 100,
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  marginHorizontal: (mobileW * 3) / 100,
                  // backgroundColor: 'red',
                  width: (mobileW * 55) / 100,
                  marginBottom: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontBold,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {item.user_name}
                </Text>

                <Text
                  style={{
                    color: Colors.themeColor,
                    fontFamily: Font.FontRegular,
                    fontSize: (mobileW * 3) / 100,
                  }}>
                  {item.user_message}
                </Text>
              </View>

              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 3) / 100,
                  marginBottom: (mobileW * 3) / 100,
                }}>
                {item.message_time}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default ConversationScreen;

const styles = StyleSheet.create({});
