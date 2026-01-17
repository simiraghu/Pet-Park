import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
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
} from '../../Provider/utilslib/Utils';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const Allcommunity = () => {
  const {goBack, navigate} = useNavigation();
  const [allCommunityData, setAllCommunityData] = useState([
    {
      id: 0,
      backImg: require('../../Icons/Images/icon_newDogImg_1.png'),
      description:
        'Connecting pet lovers and their furry friends to share stories, build friendships, and create lasting memories in a joyful community.',
      title: '#Paw_Love',
      members: '10K',
    },
    {
      id: 1,
      backImg: require('../../Icons/Images/icon_newDogImg_2.png'),
      description:
        'Connecting pet lovers and their furry friends to share stories, build friendships, and create lasting memories in a joyful community.',
      title: 'Bulldog Connect',
      members: '5K',
    },
    {
      id: 2,
      backImg: require('../../Icons/Images/icon_newDogImg_3.png'),
      description:
        'Connecting pet lovers and their furry friends to share stories, build friendships, and create lasting memories in a joyful community.',
      title: "Poddle myth's",
      members: '9.5K',
    },
    {
      id: 3,
      backImg: require('../../Icons/Images/icon_newDogImg_4.png'),
      description:
        'Connecting pet lovers and their furry friends to share stories, build friendships, and create lasting memories in a joyful community.',
      title: '#Paw_Love',
      members: '10K',
    },
  ]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {/*--------  header---------*/}
        <View
          style={{
            width: (mobileW * 88) / 100,
            marginTop: (mobileH * 3.5) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            alignSelf: 'center',
          }}>
          <TouchableOpacity onPress={() => goBack()} activeOpacity={0.8}>
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

        {/* ---- header end -------- */}

        <View
          style={{
            marginTop: (mobileH * 3) / 100,
            width: (mobileW * 88) / 100,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              color: Colors.headingColor,
              fontSize: (mobileW * 6.5) / 100,
              fontFamily: Font.FontSemibold,
            }}>
            {Lang_chg.petParkCommunity_txt[config.language]}
          </Text>

          <Text
            style={{
              color: Colors.themeColor,
              fontSize: (mobileW * 3.5) / 100,
              fontFamily: Font.FontMedium,
              marginTop: (mobileH * 1) / 100,
            }}>
            {`Connect, Play And Explore`}
          </Text>

          <Text
            style={{
              color: Colors.themeColor,
              fontSize: (mobileW * 4) / 100,
              fontFamily: Font.FontSemibold,
              marginTop: (mobileH * 1) / 100,
            }}>
            {Lang_chg.allCommunity_txt[config.language]}
          </Text>
        </View>

        {/* ------------------------------ */}

        <FlatList
          data={allCommunityData}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: (mobileH * 1.5) / 100,
            gap: (mobileW * 4) / 100,
            paddingHorizontal: (mobileW * 5) / 100,
            paddingBottom: (mobileH * 8) / 100,
          }}
          keyboardShouldPersistTaps="handled"
          renderItem={({item, index}) => <CardView item={item} index={index} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default Allcommunity;

const CardView = ({item, index}) => {
  const {goBack, navigate} = useNavigation();
  return (
    <ImageBackground
      source={item.backImg}
      style={{
        width: (mobileW * 90) / 100,
        alignSelf: 'center',
        height: (mobileH * 22.4) / 100,
        paddingHorizontal: (mobileW * 5) / 100,
        borderRadius: (mobileW * 4) / 100,
      }}
      imageStyle={{
        borderRadius: (mobileW * 4) / 100,
      }}>
      <View
        style={{
          width: (mobileW * 90) / 100,
          height: (mobileH * 22.4) / 100,
          backgroundColor: '#00000050',
          borderRadius: (mobileW * 4) / 100,
          alignSelf: 'center',
          paddingHorizontal: (mobileW * 5) / 100,
        }}>
        <View
          style={{
            marginTop: (mobileH * 2) / 100,
          }}>
          <Text
            style={{
              color: Colors.whiteColor,
              fontSize: (mobileW * 4) / 100,
              fontFamily: Font.FontMedium,
            }}>
            {item.title}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={localimag.icon_star}
              style={{
                width: (mobileW * 3) / 100,
                height: (mobileW * 3) / 100,
              }}
            />

            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 2.8) / 100,
                fontFamily: Font.FontRegular,
                marginLeft: (mobileW * 1) / 100,
              }}>{`(${item.members}+ Members)`}</Text>
          </View>

          <Text
            style={{
              color: Colors.whiteColor,
              fontSize: (mobileW * 2.8) / 100,
              fontFamily: Font.FontRegular,
              marginTop: (mobileH * 1) / 100,
              lineHeight: (mobileH * 2.1) / 100,
            }}>
            {item.description}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigate('JoinCommunity', {
              type: 1,
            })
          }
          style={{
            backgroundColor: Colors.whiteColor,
            width: (mobileW * 35) / 100,
            // paddingHorizontal: (mobileW * 1) / 100,
            height: (mobileH * 4.2) / 100,
            borderRadius: (mobileW * 30) / 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.themeColor,
            marginTop: (mobileH * 1.5) / 100,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: Colors.themeColor,
              fontSize: (mobileW * 2.8) / 100,
              fontFamily: Font.FontRegular,
            }}>
            {Lang_chg.joinCommunity_txt[config.language]}
          </Text>

          <Image
            source={localimag.icon_arrow}
            style={{
              width: (mobileW * 5) / 100,
              height: (mobileW * 5) / 100,
              tintColor: Colors.themeColor,
              marginLeft: (mobileW * 1) / 100,
            }}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
});
