import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Keyboard,
  TextInput,
  Modal,
  Dimensions,
  BackHandler,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  config,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  Colors,
  Font,
} from '../Provider/utilslib/Utils';
import {Image} from 'react-native-animatable';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const screenWidth = Math.round(Dimensions.get('window').width);

const NewpetHome = () => {
  const {goBack, navigate} = useNavigation();
  const [ListData, setListData] = useState([
    {
      id: 0,
      img: require('../Icons/icon_artBoard.png'),
    },
    {
      id: 1,
      img: require('../Icons/icon_artBoard2.png'),
    },
  ]);

  const [likesData, setLikesData] = useState([
    {
      id: 0,
      img: require('../Icons/icon_artBoard_13.png'),
    },
    {
      id: 1,
      img: require('../Icons/icon_artBoard_6.png'),
    },
    {
      id: 2,
      img: require('../Icons/icon_artBoard_1.png'),
    },
  ]);

  const [modalStatus, setModalStaus] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => backHandler.remove();
    }, [handleBackPress]),
  );

  const handleBackPress = useCallback(() => {
    BackHandler.exitApp();
    return true;
  }, []);

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
        <Image
          source={localimag.icon_newpetHomeImg}
          style={{
            width: (mobileW * 28) / 100,
            height: (mobileH * 5) / 100,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => navigate('NewPetNotification')}
            activeOpacity={0.8}
            style={{}}>
            <Image
              source={localimag.icon_bell}
              style={{
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
                tintColor: Colors.whiteColor,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigate('NewpetProfile')}
            style={{
              marginLeft: (mobileW * 3) / 100,
            }}>
            <Image
              source={require('../Icons/icon_homeUser.png')}
              style={{
                width: (mobileW * 10) / 100,
                height: (mobileW * 10) / 100,
                borderRadius: (mobileW * 30) / 100,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: (mobileH * 15) / 100,
        }}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled">
        {/* ------------------- */}

        <View
          style={{
            marginTop: (mobileH * 1) / 100,
          }}>
          <FlatList
            data={ListData}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            contentContainerStyle={{
              marginTop: (mobileH * 1.5) / 100,
              gap: (mobileW * 3) / 100,
              paddingHorizontal: (mobileW * 5) / 100,
            }}
            keyboardShouldPersistTaps="handled"
            renderItem={({item, index}) => (
              <ListView item={item} index={index} />
            )}
          />
        </View>
        {/* --------------------- */}

        <View
          style={{
            paddingHorizontal: (mobileW * 5) / 100,
            marginTop: (mobileH * 2) / 100,
          }}>
          {/* publish post view start */}
          <View
            style={{
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
              borderWidth: 1,
              paddingVertical: (mobileH * 1.3) / 100,
              borderColor: Colors.borderColor,
              borderRadius: (mobileW * 2) / 100,
              backgroundColor: Colors.whiteColor,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  marginLeft: (mobileW * 2) / 100,
                }}>
                <ImageBackground
                  source={require('../Icons/icon_homeUser.png')}
                  style={{
                    width: (mobileW * 10) / 100,
                    height: (mobileW * 10) / 100,
                    borderRadius: (mobileW * 30) / 100,
                  }}>
                  <Image
                    source={require('../Icons/icon_dog_1.png')}
                    style={{
                      width: (mobileW * 5) / 100,
                      height: (mobileW * 5) / 100,
                      borderRadius: (mobileW * 30) / 100,
                      alignSelf: 'flex-end',
                      right: (-mobileW * 0.8) / 100,
                    }}
                  />
                </ImageBackground>
              </TouchableOpacity>

              <TextInput
                placeholderTextColor={Colors.placeholderTextColor}
                returnKeyLabel="done"
                returnKeyType="done"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                keyboardType="default"
                style={{
                  width: (mobileW * 66) / 100,
                  marginLeft: (mobileW * 2) / 100,
                  height: (mobileH * 5) / 100,
                  color: Colors.placeholderTextColor,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 3.3) / 100,
                  paddingBottom: 3,
                }}
                placeholder={`Write your post here`}
                //onChangeText={val => setValue(val)}
                //value={value}
              />

              <Image
                source={localimag.icon_imageVideo}
                style={{
                  width: (mobileW * 7.5) / 100,
                  height: (mobileW * 7.5) / 100,
                  borderRadius: (mobileW * 1) / 100,
                  marginTop: (-mobileH * 1.5) / 100,
                }}
              />
            </View>

            {/* divider */}

            <View
              style={{
                marginVertical: (mobileH * 1.5) / 100,
                borderWidth: 0.5,
                borderColor: Colors.borderColor,
                width: (mobileW * 82) / 100,
                alignSelf: 'center',
              }}></View>

            {/* ------------- */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: (mobileW * 3) / 100,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={localimag.icon_world}
                  style={{
                    width: (mobileW * 4) / 100,
                    height: (mobileW * 4) / 100,
                  }}
                />

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    marginLeft: (mobileW * 3) / 100,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: Colors.placeholderTextColor,
                      fontSize: (mobileW * 3) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {Lang_chg.addYourPostIn_txt[config.language]}
                  </Text>

                  <Image
                    source={localimag.icon_dropDown}
                    style={{
                      width: (mobileW * 3) / 100,
                      height: (mobileW * 3) / 100,
                      marginLeft: (mobileW * 1.5) / 100,
                    }}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  width: (mobileW * 33) / 100,
                  height: (mobileH * 5) / 100,
                  borderRadius: (mobileW * 30) / 100,
                  backgroundColor: Colors.themeColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontSize: (mobileW * 3.5) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {Lang_chg.publishPost_txt[config.language]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* publish post view end */}

          {/* posts view */}

          {[1, 1].map((item, index) => {
            return (
              <View
                key={index.toString()}
                style={{
                  width: (mobileW * 90) / 100,
                  alignSelf: 'center',
                  borderWidth: 1,
                  paddingTop: (mobileH * 1.5) / 100,
                  paddingBottom: (mobileH * 0.5) / 100,
                  borderColor: Colors.borderColor,
                  borderRadius: (mobileW * 2) / 100,
                  marginTop: (mobileH * 1.5) / 100,
                  paddingHorizontal: (mobileW * 3) / 100,
                  backgroundColor: Colors.whiteColor,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: Colors.placeholderTextColor,
                      fontSize: (mobileW * 3.2) / 100,
                      fontFamily: Font.FontSemibold,
                    }}>
                    {Lang_chg.postedIn_txt[config.language]}{' '}
                    <Text
                      style={{
                        color: Colors.themeColor,
                        fontSize: (mobileW * 3.2) / 100,
                        fontFamily: Font.FontSemibold,
                      }}>
                      Beagle Love
                    </Text>
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      navigate('JoinCommunity', {
                        type: 1,
                      })
                    }>
                    <Text
                      style={{
                        color: Colors.themeColor,
                        fontSize: (mobileW * 3.2) / 100,
                        fontFamily: Font.FontSemibold,
                      }}>
                      {Lang_chg.viewCommunity_txt[config.language]}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* divider */}

                <View
                  style={{
                    marginVertical: (mobileH * 1.4) / 100,
                    borderWidth: 0.5,
                    borderColor: Colors.borderColor,
                    width: (mobileW * 82) / 100,
                    alignSelf: 'center',
                  }}></View>

                {/* ------------- */}

                <View
                  style={{
                    borderRadius: (mobileW * 3) / 100,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: (mobileH * 1) / 100,
                    }}>
                    <ImageBackground
                      source={require('../Icons/icon_homeUser.png')}
                      style={{
                        width: (mobileW * 11) / 100,
                        height: (mobileW * 11) / 100,
                        borderRadius: (mobileW * 30) / 100,
                      }}>
                      <Image
                        source={require('../Icons/icon_dog_1.png')}
                        style={{
                          width: (mobileW * 5.5) / 100,
                          height: (mobileW * 5.5) / 100,
                          borderRadius: (mobileW * 30) / 100,
                          alignSelf: 'flex-end',
                          right: (-mobileW * 0.8) / 100,
                        }}
                      />
                    </ImageBackground>
                    <View
                      style={{
                        // width: (mobileW * 70) / 100,
                        marginLeft: (mobileW * 3) / 100,
                      }}>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.5) / 100,
                          fontFamily: Font.FontSemibold,
                          color: Colors.blackColor,
                        }}>
                        {'Aarav Sharma'}
                      </Text>
                      <Text
                        style={{
                          fontSize: (mobileW * 2.9) / 100,
                          fontFamily: Font.FontMedium,
                          color: Colors.blackColor,
                        }}>
                        {'Banglore, India'}
                      </Text>
                    </View>
                  </View>

                  {/* ---- 4k view---- */}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: (-mobileH * 2.5) / 100,
                    }}>
                    <View
                      style={{
                        height: (mobileH * 3) / 100,
                        borderRadius: (mobileW * 30) / 100,
                        backgroundColor: Colors.homeCardbackgroundColor,
                        paddingHorizontal: (mobileW * 1) / 100,
                        alignItems: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        {likesData.map((item, index) => {
                          return (
                            <Image
                              key={index.toString}
                              source={item.img}
                              style={{
                                width: (mobileW * 5) / 100,
                                height: (mobileW * 5) / 100,
                                borderRadius: (mobileW * 30) / 100,
                                marginRight:
                                  index !== likesData.length - 1
                                    ? (-mobileW * 2) / 100
                                    : null,
                              }}
                            />
                          );
                        })}
                      </View>

                      <Text
                        style={{
                          color: Colors.blackColor,
                          fontSize: (mobileW * 2.8) / 100,
                          fontFamily: Font.FontSemibold,
                          marginLeft: (mobileW * 1) / 100,
                        }}>
                        +4K
                      </Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        marginLeft: (mobileW * 3) / 100,
                      }}>
                      <Image
                        source={localimag.icon_likePost}
                        style={{
                          width: (mobileW * 6) / 100,
                          height: (mobileW * 6) / 100,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* ----------- */}

                <View
                  style={{
                    marginTop: (mobileH * 0.8) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.blackColor,
                      fontSize: (mobileW * 3.3) / 100,
                      fontFamily: Font.FontMedium,
                    }}>
                    {
                      'One common myth about Beagles is that they are difficult to train because they are "stubborn" or "not intelligent"'
                    }
                  </Text>
                </View>

                {/* divider */}

                <View
                  style={{
                    marginTop: (mobileH * 1.4) / 100,
                    borderWidth: 0.5,
                    borderColor: Colors.borderColor,
                    width: (mobileW * 82) / 100,
                    alignSelf: 'center',
                  }}></View>

                {/* ------comment view------- */}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: (mobileH * 0.3) / 100,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={localimag.icon_comment}
                      style={{
                        width: (mobileW * 5) / 100,
                        height: (mobileW * 5) / 100,
                      }}
                    />

                    <TextInput
                      placeholderTextColor={Colors.themeColor}
                      returnKeyLabel="done"
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                      keyboardType="default"
                      style={{
                        width: (mobileW * 66) / 100,
                        marginLeft: (mobileW * 1) / 100,
                        height: (mobileH * 5) / 100,
                        color: Colors.themeColor,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3.3) / 100,
                        paddingBottom: 3,
                      }}
                      placeholder={`Comment`}
                      //onChangeText={val => setValue(val)}
                      //value={value}
                    />
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setModalStaus(true)}>
                    <Image
                      source={localimag.icon_menuGrey}
                      style={{
                        width: (mobileW * 5) / 100,
                        height: (mobileW * 5) / 100,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {/* --------------- */}
        </View>
      </KeyboardAwareScrollView>

      {/* ------------------------------ */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalStatus}
        onRequestClose={() => setModalStaus(false)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalStaus(false)}
          style={styles.containerStyle}>
          <View style={styles.subContainerStyle}>
            <TouchableOpacity
              onPress={() => setModalStaus(false)}
              activeOpacity={0.8}
              style={{
                marginTop: (mobileH * 2) / 100,
              }}>
              <Image
                source={localimag.icon_goBack}
                style={{
                  width: (mobileW * 6) / 100,
                  height: (mobileW * 6) / 100,
                  tintColor: Colors.darkGreenColor,
                }}
              />
            </TouchableOpacity>

            {/* Interested */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                marginTop: (mobileH * 3) / 100,
              }}>
              <Image
                source={localimag.icon_interested}
                style={{
                  width: (mobileW * 6) / 100,
                  height: (mobileW * 6) / 100,
                }}
              />

              <View
                style={{
                  marginLeft: (mobileW * 1) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.darkGreenColor,
                    fontSize: (mobileW * 4) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {Lang_chg.interested_txt[config.language]}
                </Text>
                <Text
                  style={{
                    color: Colors.subTitleColor,
                    fontSize: (mobileW * 2.7) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {Lang_chg.moreSuggestedPosts_txt[config.language]}
                </Text>
              </View>
            </TouchableOpacity>

            {/* not interested */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                marginTop: (mobileH * 1) / 100,
              }}>
              <Image
                source={localimag.icon_notInterested}
                style={{
                  width: (mobileW * 6) / 100,
                  height: (mobileW * 6) / 100,
                }}
              />

              <View
                style={{
                  marginLeft: (mobileW * 1) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.darkGreenColor,
                    fontSize: (mobileW * 4) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {Lang_chg.notInterested_txt[config.language]}
                </Text>
                <Text
                  style={{
                    color: Colors.subTitleColor,
                    fontSize: (mobileW * 2.7) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {Lang_chg.lessSuggestedPost_txt[config.language]}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Hide post */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                marginTop: (mobileH * 1) / 100,
              }}>
              <Image
                source={localimag.icon_hidePost}
                style={{
                  width: (mobileW * 6) / 100,
                  height: (mobileW * 6) / 100,
                }}
              />

              <View
                style={{
                  marginLeft: (mobileW * 1) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.darkGreenColor,
                    fontSize: (mobileW * 4) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {Lang_chg.hidePost_txt[config.language]}
                </Text>
                <Text
                  style={{
                    color: Colors.subTitleColor,
                    fontSize: (mobileW * 2.7) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {Lang_chg.seeFewerPostLikeThis_txt[config.language]}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Report post */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                marginTop: (mobileH * 1) / 100,
              }}>
              <Image
                source={localimag.icon_reportPost}
                style={{
                  width: (mobileW * 6) / 100,
                  height: (mobileW * 6) / 100,
                }}
              />

              <View
                style={{
                  marginLeft: (mobileW * 1) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.darkGreenColor,
                    fontSize: (mobileW * 4) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {Lang_chg.reportPost_txt[config.language]}
                </Text>
                <Text
                  style={{
                    color: Colors.subTitleColor,
                    fontSize: (mobileW * 2.7) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {Lang_chg.weWontletDiscover_txt[config.language]}
                </Text>
              </View>
            </TouchableOpacity>

            {/* hide all from */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                marginTop: (mobileH * 1) / 100,
              }}>
              <Image
                source={localimag.icon_hidePost}
                style={{
                  width: (mobileW * 6) / 100,
                  height: (mobileW * 6) / 100,
                }}
              />

              <View
                style={{
                  marginLeft: (mobileW * 1) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.darkGreenColor,
                    fontSize: (mobileW * 4) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {Lang_chg.hideAllfrom_txt[config.language]}
                </Text>
                <Text
                  style={{
                    color: Colors.subTitleColor,
                    fontSize: (mobileW * 2.7) / 100,
                    fontFamily: Font.FontSemibold,
                  }}>
                  {Lang_chg.stopSeeingPost_txt[config.language]}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default NewpetHome;

const ListView = ({item, index}) => {
  return (
    <Image
      source={item.img}
      style={{
        width: (mobileW * 70) / 100,
        height: (mobileH * 20) / 100,
      }}
      borderRadius={(mobileW * 4) / 100}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.themeColor_1,
  },
  containerStyle: {
    flex: 1,
    backgroundColor: '#00000090',
    alignItems: 'center',
  },
  subContainerStyle: {
    position: 'absolute',
    bottom: (-mobileH * 7) / 100,
    width: screenWidth,
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: (mobileW * 5) / 100,
    borderTopRightRadius: (mobileW * 5) / 100,
    paddingHorizontal: (mobileW * 5) / 100,
    paddingVertical: (mobileH * 1) / 100,
    paddingBottom: (mobileH * 15) / 100,
    flex: 1,
  },
});
