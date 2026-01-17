import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {localimag} from '../Provider/Localimage';
import {
  Colors,
  config,
  Font,
  Lang_chg,
  mobileW,
} from '../Provider/utilslib/Utils';
import LinearGradient from 'react-native-linear-gradient';

const FavouriteScreen = ({navigation}) => {
  const [favourite, setFavourite] = useState([
    {
      id: 1,
      user_name: 'Ankit K',
      user_profile: require('../Icons/user3.png'),
    },
    {
      id: 2,
      user_name: 'John',
      user_profile: require('../Icons/user2.png'),
    },
    {
      id: 3,
      user_name: 'Prateek',
      user_profile: require('../Icons/user1.png'),
    },
  ]);

  return (
    <View style={{backgroundColor: Colors.whiteColor, flex: 1}}>
      <View
        style={{
          marginTop: (mobileW * 5) / 100,
          marginLeft: (mobileW * 5) / 100,
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

        {/* -------- heading------- */}

        <View style={{marginTop: (mobileW * 5) / 100}}>
          <Text
            style={{
              color: Colors.themeColor2,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 6) / 100,
            }}>
            {Lang_chg.favourite_txt[config.language]}
          </Text>
        </View>
      </View>

      <View style={{alignSelf: 'center', marginTop: (mobileW * 5) / 100}}>
        <FlatList
          data={favourite}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          renderItem={({item}) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('UserDetails')}
              style={{
                marginHorizontal: (mobileW * 2) / 100,
                marginVertical: (mobileW * 2) / 100,
              }}>
              <View
                style={{
                  backgroundColor: Colors.whiteColor,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.29,
                  shadowRadius: 4.65,

                  elevation: 7,
                  paddingVertical: (mobileW * 3) / 100,
                  width: (mobileW * 45) / 100,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    // backgroundColor: 'blue',
                    borderRadius: (mobileW * 20) / 100,
                  }}>
                  <Image
                    source={item.user_profile}
                    style={{
                      width: (mobileW * 45) / 100,
                      height: (mobileW * 45) / 100,
                    }}
                    resizeMode="contain"
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: (mobileW * 1) / 100,
                    alignSelf: 'center',
                    justifyContent: 'space-around',
                    // backgroundColor: 'blue',
                    width: (mobileW * 35) / 100,
                  }}>
                  <TouchableOpacity activeOpacity={0.8}>
                    <Image
                      source={localimag.icon_cross_with_bg}
                      style={{
                        width: (mobileW * 10) / 100,
                        height: (mobileW * 10) / 100,
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.8}>
                    <Image
                      source={localimag.icon_filled_like}
                      style={{
                        width: (mobileW * 10) / 100,
                        height: (mobileW * 10) / 100,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: Colors.themeColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontRegular,
                    fontSize: (mobileW * 3.5) / 100,
                  }}>
                  {item.user_name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({});
