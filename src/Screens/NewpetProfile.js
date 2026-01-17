import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import {
  config,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  Colors,
  Font,
} from '../Provider/utilslib/Utils';
import { useNavigation } from '@react-navigation/native';

const NewpetProfile = () => {
  const { goBack, navigate } = useNavigation();

  const [logoutmodel, setLogoutModel] = useState(false);

  const [tags, setTags] = useState([
    {
      id: 0,
      name: '29 Years Old',
    },
    {
      id: 1,
      name: 'Single',
    },
    {
      id: 2,
      name: 'Doctor',
    },
    {
      id: 2,
      name: 'Looking For Pet',
    },
  ]);

  const [subTags, setSubTags] = useState([
    {
      id: 0,
      name: 'Dog',
    },
    {
      id: 1,
      name: 'Young',
    },
    {
      id: 2,
      name: 'Beagle',
    },
    {
      id: 3,
      name: 'Female',
    },
  ]);

  return (
    <View style={styles.container}>
      {/* header */}
      <View
        style={{
          paddingHorizontal: (mobileW * 5) / 100,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: (mobileH * 4) / 100,
        }}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => goBack()}>
          <Image
            source={localimag.icon_goBack}
            style={{
              width: (mobileW * 6) / 100,
              height: (mobileW * 6) / 100,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigate('PlanAPetEdit')}>
          <Text
            style={{
              color: Colors.whiteColor,
              fontSize: (mobileW * 4.5) / 100,
              fontFamily: Font.FontSemibold,
            }}>
            {Lang_chg.edit_txt[config.language]}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: (mobileH * 3) / 100,
          paddingHorizontal: (mobileW * 5) / 100,
          height: (mobileH * 0.05) / 100,
          width: (mobileW * 88) / 100,
          alignSelf: 'center',
          backgroundColor: Colors.whiteColor,
        }}></View>

      {/* ------------------------ */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ paddingBottom: (mobileW * 10) / 100 }}>
        <View
          style={{
            paddingHorizontal: (mobileW * 5) / 100,
            marginTop: (mobileH * 3) / 100,
            flexDirection: 'row',
            alignItems: 'center',

          }}>
          <Image
            source={require('../Icons/icon_homeUser.png')}
            style={{
              width: (mobileW * 14) / 100,
              height: (mobileW * 14) / 100,
            }}
          />

          <Text
            style={{
              color: Colors.whiteColor,
              fontSize: (mobileW * 6) / 100,
              fontFamily: Font.FontSemibold,
              marginLeft: (mobileW * 3) / 100,
            }}>
            Divya Singh
          </Text>
        </View>

        <ImageBackground
          source={require('../Icons/icon_cardUser.png')}
          style={{
            width: (mobileW * 90) / 100,
            height: (mobileH * 32) / 100,
            position: 'relative',
            alignSelf: 'center',
            marginTop: (mobileH * 2) / 100,
          }}
          imageStyle={{
            borderRadius: (mobileW * 4) / 100,
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              width: (mobileW * 20) / 100,
              height: (mobileH * 3.3) / 100,
              borderRadius: (mobileW * 30) / 100,
              backgroundColor: '#97958a',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'flex-end',
              flexDirection: 'row',
              margin: (mobileH * 2) / 100,
            }}>
            <Image
              source={localimag.icon_userLocation}
              style={{
                width: (mobileW * 3.5) / 100,
                height: (mobileW * 3.5) / 100,
              }}
            />
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 3.3) / 100,
                fontFamily: Font.FontSemibold,
                marginLeft: (mobileW * 1) / 100,
              }}>
              Delhi
            </Text>
          </TouchableOpacity>
        </ImageBackground>

        {/* -------------------------------- */}

        <View
          style={{
            marginTop: (mobileH * 3) / 100,
            paddingHorizontal: (mobileW * 4) / 100,
          }}>
          <View
            style={{
              //marginTop: (mobileH * 0.5) / 100,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {tags.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index.toString()}
                  activeOpacity={1}
                  style={{
                    paddingHorizontal: (mobileW * 3.5) / 100,
                    height: (mobileH * 3.3) / 100,
                    borderRadius: (mobileW * 30) / 100,
                    backgroundColor: '#596969',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: index != 0 ? (mobileW * 1) / 100 : null,
                    //opacity: 0.8,
                  }}>
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontSize: (mobileW * 2.8) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View
          style={{
            marginTop: (mobileH * 3) / 100,
            paddingHorizontal: (mobileW * 5) / 100,
          }}>
          <Text
            style={{
              color: Colors.whiteColor,
              fontSize: (mobileW * 3.3) / 100,
              fontFamily: Font.FontMedium,
            }}>
            I am looking for a young Beagle to welcome into my life as a joyful
            and energetic companion. With their playful nature and loving
            temperament, Beagles are the perfect blend of curiosity and charm.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: (mobileW * 5.3) / 100,
                fontFamily: Font.FontSemibold,
                marginTop: (mobileH * 1) / 100,
              }}>
              Plan A Pet
            </Text>

            <View
              style={{
                borderBottomColor: '#97958a',
                borderBottomWidth: 1,
                marginLeft: -(mobileW * 0.5) / 100,
                width: (mobileW * 33) / 100,
                height: (mobileH * 4) / 100,
              }}></View>
          </View>

          <View
            style={{
              marginTop: (mobileH * 1.5) / 100,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {subTags.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index.toString()}
                  activeOpacity={1}
                  style={{
                    paddingHorizontal: (mobileW * 6) / 100,
                    height: (mobileH * 3.3) / 100,
                    borderRadius: (mobileW * 30) / 100,
                    backgroundColor: '#596969',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: index != 0 ? (mobileW * 1.6) / 100 : null,
                    //opacity: 0.8,
                  }}>
                  <Text
                    style={{
                      color: Colors.whiteColor,
                      fontSize: (mobileW * 2.8) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Logout */}

          <TouchableOpacity
            onPress={() => setLogoutModel(true)}
            activeOpacity={0.8}
            style={{
              width: (mobileW * 52) / 100,
              height: (mobileH * 4) / 100,
              alignSelf: 'center',
              marginTop: (mobileH * 8) / 100,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.themeColor,
              borderRadius: (mobileW * 1.5) / 100,
              borderWidth: (mobileW * 0.2) / 100,
              borderColor: Colors.darkGreenColor,
              alignSelf: 'flex-end',
              marginBottom : mobileW * 4 /100
            }}>
            <Text
              style={{
                fontSize: (mobileW * 3.3) / 100,
                color: Colors.whiteColor,
                fontFamily: Font.FontSemibold,
              }}>
              {Lang_chg.logout_txt[config.language]}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* ---------------------------------- */}

      {/* ----- Logout Model ------------------- */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutmodel}
        requestClose={() => setLogoutModel(false)}>
        <TouchableOpacity
          onPress={() => {
            setLogoutModel(false);
          }}
          activeOpacity={1}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000090',
          }}>
          <View
            style={{
              width: (mobileW * 65) / 100,
              paddingVertical: (mobileH * 1.5) / 100,
              borderRadius: (mobileW * 3) / 100,
              backgroundColor: Colors.whiteColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setLogoutModel(false)}
              activeOpacity={0.8}
              style={{
                alignSelf: 'flex-end',
              }}>
              <Image
                source={localimag.icon_crossIcon}
                style={{
                  right: (mobileW * 2) / 100,
                  width: (mobileW * 5) / 100,
                  height: (mobileW * 5) / 100,
                  tintColor: '#dbd7d7',
                }}
              />
            </TouchableOpacity>

            <Image
              source={localimag.icon_logoutModal}
              style={{
                width: (mobileW * 15) / 100,
                height: (mobileW * 15) / 100,
                resizeMode: 'contain',
                marginTop: (-mobileH * 1) / 100,
              }}
            />
            <Text
              style={{
                width: (mobileW * 50) / 100,
                color: Colors.themeColor,
                fontSize: (mobileW * 5) / 100,
                fontFamily: Font.FontSemibold,
                textAlign: 'center',
                marginTop: (mobileH * 1) / 100,
              }}>
              {Lang_chg.areyousure_txt[config.language]}
            </Text>
            <Text
              style={{
                width: (mobileW * 50) / 100,
                color: Colors.darkGreenColor,
                fontSize: (mobileW * 3) / 100,
                fontFamily: Font.FontSemibold,
                textAlign: 'center',
              }}>
              {Lang_chg.youwanttologout_txt[config.language]}
            </Text>

            <View
              style={{
                width: (mobileW * 55) / 100,
                alignItems: 'center',
                justifyContent: 'space-between',
                alignSelf: 'center',
                flexDirection: 'row',
                marginTop: (mobileH * 1.5) / 100,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setLogoutModel(false);
                }}
                activeOpacity={0.8}
                style={{
                  height: (mobileH * 4.5) / 100,
                  width: (mobileW * 26.5) / 100,
                  backgroundColor: Colors.cancleColor,
                  borderRadius: (mobileW * 2) / 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: (mobileW * 3.5) / 100,
                    fontFamily: Font.FontMedium,
                    color: Colors.whiteColor,
                  }}>
                  {Lang_chg.cancelmedia[config.language]}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setLogoutModel(false);
                  navigate('WelcomeScreen');
                }}
                style={{
                  height: (mobileH * 4.5) / 100,
                  width: (mobileW * 26.5) / 100,
                  backgroundColor: Colors.themeColor_1,
                  borderRadius: (mobileW * 2) / 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: (mobileW * 3.5) / 100,
                    fontFamily: Font.FontSemibold,
                    color: Colors.whiteColor,
                  }}>
                  {Lang_chg.logout_txt[config.language]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default NewpetProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.themeColor_1,
  },
});
