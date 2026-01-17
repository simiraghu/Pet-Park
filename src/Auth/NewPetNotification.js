import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
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
import {useNavigation} from '@react-navigation/native';

const NewPetNotification = () => {
  const navigation = useNavigation();

  const [notificationData, setNotificationData] = useState([
    {
      id: 0,
      icon: localimag.icon_userPlaceholder,
      title: 'Mohit joined community group #Paw_lover',
      time: '20 min ago',
    },
    {
      id: 1,
      icon: localimag.icon_userPlaceholder,
      title: 'Mohit joined community group #Paw_lover',
      time: '20 min ago',
    },
    {
      id: 2,
      icon: localimag.icon_userPlaceholder,
      title: 'Mohit joined community group #Paw_lover',
      time: '20 min ago',
    },
    {
      id: 3,
      icon: localimag.icon_userPlaceholder,
      title: 'Mohit joined community group #Paw_lover',
      time: '20 min ago',
    },
    {
      id: 4,
      icon: localimag.icon_userPlaceholder,
      title: 'Mohit joined community group #Paw_lover',
      time: '20 min ago',
    },
    {
      id: 5,
      icon: localimag.icon_userPlaceholder,
      title: 'Mohit joined community group #Paw_lover',
      time: '20 min ago',
    },
    {
      id: 6,
      icon: localimag.icon_userPlaceholder,
      title: 'Mohit joined community group #Paw_lover',
      time: '20 min ago',
    },
    {
      id: 7,
      icon: localimag.icon_userPlaceholder,
      title: 'Mohit joined community group #Paw_lover',
      time: '20 min ago',
    },
    {
      id: 8,
      icon: localimag.icon_userPlaceholder,
      title: 'Mohit joined community group #Paw_lover',
      time: '20 min ago',
    },
    {
      id: 9,
      icon: localimag.icon_userPlaceholder,
      title: 'Mohit joined community group #Paw_lover',
      time: '20 min ago',
    },
    {
      id: 10,
      icon: localimag.icon_userPlaceholder,
      title: 'Mohit joined community group #Paw_lover',
      time: '20 min ago',
    },
    {
      id: 11,
      icon: localimag.icon_userPlaceholder,
      title: 'Mohit joined community group #Paw_lover',
      time: '20 min ago',
    },
    {
      id: 12,
      icon: localimag.icon_userPlaceholder,
      title: 'Mohit joined community group #Paw_lover',
      time: '20 min ago',
    },
  ]);

  return (
    <View style={styles.container}>
      {/* header */}
      <View
        style={{
          width: (mobileW * 90) / 100,
          marginTop: (mobileH * 3.5) / 100,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}>
          <Image
            source={localimag.icon_goBack}
            style={{
              width: (mobileW * 6) / 100,
              height: (mobileW * 6) / 100,
              tintColor: '#405757',
            }}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: (mobileH * 3) / 100,
          width: (mobileW * 88) / 100,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            color: Colors.darkGreenColor,
            fontSize: (mobileW * 6.5) / 100,
            fontFamily: Font.FontMedium,
          }}>
          {Lang_chg.notifications_txt[config.language]}
        </Text>
      </View>

      {/* ---------------------------- */}

      <FlatList
        data={notificationData}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.mainView,
          {
            paddingBottom: (mobileH * 8) / 100,
          },
        ]}
        renderItem={({item, index}) => <Listview item={item} index={index} />}
      />
    </View>
  );
};

export default NewPetNotification;

const Listview = ({item, index}) => {
  return (
    <View
      style={{
        paddingVertical: (mobileH * 1) / 100,
        //flexDirection: 'row',
        //alignItems: 'center',
        marginTop: (mobileH * 1) / 100,
        borderBottomWidth: 1.5,
        borderBottomColor: Colors.conversationBorderColor,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: (mobileW * 77) / 100,
        }}>
        <Image
          style={{
            height: (mobileW * 13) / 100,
            width: (mobileW * 13) / 100,
            borderRadius: (mobileW * 10) / 100,
          }}
          source={item.icon}
        />

        <View
          style={{
            marginLeft: (mobileW * 1.8) / 100,
          }}>
          <Text
            style={{
              fontFamily: Font.FontSemibold,
              fontSize: (mobileW * 4) / 100,
              color: Colors.darkGreenColor,
            }}>
            {item.title}
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontFamily: Font.FontMedium,
          fontSize: (mobileW * 2.8) / 100,
          color: Colors.darkGreenColor,
          alignSelf: 'flex-end',
          marginTop: (-mobileH * 1.5) / 100,
        }}>
        {item.time}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  mainView: {
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
  },
});
