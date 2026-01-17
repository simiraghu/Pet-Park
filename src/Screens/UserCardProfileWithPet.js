import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  localimag,
  mobileH,
  mobileW,
  config,
  consolepro,
  localStorage,
  apifuntion,
} from '../Provider/utilslib/Utils';
import LinearGradient from 'react-native-linear-gradient';
import BannerCarousel from 'react-native-banner-carousel';
import Svg, {G, Line} from 'react-native-svg';
import {SafeAreaView} from 'react-native-safe-area-context';

const UserCardProfileWithPet = () => {
  const {goBack} = useNavigation();
  const {t} = useTranslation();

  const [user_details, setUser_details] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showData, setShowData] = useState(false);

  const RealtionData = [
    ['Single', 'أعزب', '单身'],
    ['Married', 'متزوج', '已婚'],
    ['In a relationship', 'في علاقة', '恋爱中'],
    ['Divorce', 'مطلّق', '离婚'],
  ];

  const GenderDetails = [
    ['Male', 'ذكر', '男'],
    ['Female', 'أنثى', '女'],
    ['Others', 'آخرون', '其他'],
  ];

  const Indicator = ({slides, slideIndex}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        {slides.map((_, index) => (
          <View
            key={index.toString()}
            style={{
              height: (mobileW * 0.7) / 100,
              width: (mobileW * 10) / 100,
              borderRadius: (mobileW * 1) / 100,
              backgroundColor:
                slideIndex == index ? Colors.ColorPremiumBox : '#a7a39c',
              marginHorizontal: (mobileW * 0.8) / 100,
            }}
          />
        ))}
      </View>
    );
  };

  const get_user_profile_details = async () => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const user_id = user_array?.user_id;
      const API_URL = config.baseURL + 'get_user_profile?user_id=' + user_id;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            setUser_details(res?.user_details);
            setShowData(true);
          } else {
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigate('WelcomeScreen');
            } else {
              consolepro.consolelog('res======>>', re);
            }
          }
        })
        .catch(error => {
          consolepro.consolelog('Error:', error);
          setUser_details([]);
        });
    } catch (error) {
      consolepro.consolelog('Error:', error);
    }
  };

  const renderPetBehavior = (behaviorName, value) => {
    const progress = value;
    const radius = 15;
    const strokeWidth = 3;
    const size = radius * 2 + 5;
    const center = size / 2;

    const totalSegments = 60;
    const angleStep = 360 / totalSegments;

    const getSegmentColor = index => {
      const activeSegments = Math.round((progress / 100) * totalSegments);
      return index >= activeSegments ? '#2b2b2b' : '#019686';
    };

    const segments = Array.from({length: totalSegments}).map((_, i) => {
      const angle = angleStep * i - 90;
      const rad = (angle * Math.PI) / 180;
      const x1 = center + (radius - strokeWidth) * Math.cos(rad);
      const y1 = center + (radius - strokeWidth) * Math.sin(rad);
      const x2 = center + radius * Math.cos(rad);
      const y2 = center + radius * Math.sin(rad);

      return (
        <Line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={getSegmentColor(i)}
          strokeWidth={0.99}
          strokeLinecap="round"
        />
      );
    });

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: (mobileW * 25) / 100,
        }}>
        <Svg width={size} height={size}>
          <G>{segments}</G>
        </Svg>
        <Text
          numberOfLines={1}
          style={{
            color: Colors.themeColor2,
            fontFamily: Font.FontMedium,
            fontSize: (mobileW * 3.5) / 100,
            marginLeft: (mobileW * 1) / 100,
            flexShrink: 1,
            flex: 1,
            textAlign: 'left',
          }}>
          {behaviorName.replace('_', ' ')}
        </Text>
      </View>
    );
  };

  // Function to get top 3 non-zero behaviors;

  const getTopBehaviors = () => {
    if (!user_details) return [];

    const behaviors = [
      {name: 'Friendly', value: user_details?.friendly},
      {name: 'Active', value: user_details?.active},
      {name: 'Aggressive', value: user_details?.aggressive},
      {name: 'Bark', value: user_details?.bark},
      {name: 'Following', value: user_details?.following_you},
      {name: 'Love Licking', value: user_details?.love_licking},
      {name: 'Guard', value: user_details?.guard},
      {name: 'Napper', value: user_details?.napper},
      {name: 'Affection', value: user_details?.love_seeker},
      {name: 'Does not bark', value: user_details?.doennot_bark},
      {name: 'Kisser', value: user_details?.kisser},
      {name: 'Lazy', value: user_details?.lazy},
    ];

    return behaviors
      .filter(b => b.value > 0) // Only behaviors with value > 0
      .sort((a, b) => b.value - a.value) // Sort by highest value first
      .slice(0, 3); // Take top 3
  };

  consolepro.consolelog('Behaviours=======>>>', getTopBehaviors());

  useFocusEffect(
    useCallback(() => {
      if (config.device_type == 'ios') {
        setTimeout(() => {
          get_user_profile_details();
        }, 300);
      } else {
        get_user_profile_details();
      }
    }, []),
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        {/* Header remains the same */}

        <View
          style={{
            width: mobileW,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.themeColor2,
            paddingVertical: (mobileW * 4) / 100,
            paddingHorizontal: (mobileW * 2) / 100,
          }}>
          <TouchableOpacity
            onPress={() => goBack()}
            activeOpacity={0.8}
            style={{
              width: (mobileW * 6) / 100,
              height: (mobileW * 6) / 100,
            }}>
            <Image
              source={localimag.icon_goBack}
              style={{
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
            />
          </TouchableOpacity>

          <Text
            style={{
              color: Colors.whiteColor,
              fontFamily: Font.FontRegular,
              fontSize: (mobileW * 5) / 100,
              marginLeft: (mobileW * 4) / 100,
              width: (mobileW * 70) / 100,
            }}>
            {t('profile_txt')}
          </Text>
        </View>

        {showData && (
          <View
            style={{
              flex: 1,
              paddingHorizontal: (mobileW * 5) / 100,
              marginTop: (mobileH * 1.5) / 100,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                width: (mobileW * 90) / 100,
                alignSelf: 'center',
                height:
                  config.device_type == 'ios'
                    ? (mobileH * 62) / 100
                    : (mobileH * 75) / 100,
                backgroundColor: Colors.homeCardbackgroundColor,
                borderRadius: (mobileW * 3) / 100,
                // justifyContent: 'center'
              }}>
              <View style={{}}>
                <BannerCarousel
                  key={`${user_details?.user_id}-${user_details?.user_images?.length}`}
                  autoplay
                  autoplayTimeout={3000}
                  loop
                  index={0}
                  showsPageIndicator={false}
                  pageSize={(mobileW * 90) / 100}
                  onPageChanged={index => setSlideIndex(index)}>
                  {user_details?.user_images?.map(
                    (childItem, carouselIndex) => (
                      <TouchableOpacity
                        key={carouselIndex}
                        style={{
                          borderRadius: (mobileW * 4) / 100,
                          overflow: 'hidden',
                        }}
                        activeOpacity={1}>
                        <ImageBackground
                          source={
                            childItem?.type == 2
                              ? {
                                  uri:
                                    config.img_url + childItem?.user_thumbnail,
                                }
                              : {uri: config.img_url + childItem?.image}
                          }
                          style={{
                            width: (mobileW * 90) / 100,
                            height:
                              config.device_type == 'ios'
                                ? (mobileH * 25) / 100
                                : (mobileH * 30) / 100,
                            position: 'relative',
                          }}
                          imageStyle={{
                            borderRadius: (mobileW * 4) / 100,
                          }}>
                          <LinearGradient
                            colors={['rgba(0,0,0,0.5)', 'transparent']}
                            style={styles.gradient}
                          />
                          <View
                            style={{
                              marginTop: (mobileH * 1.5) / 100,
                            }}>
                            <View
                              style={{
                                paddingHorizontal: (mobileW * 5) / 100,
                              }}>
                              <Indicator
                                slides={user_details?.user_images}
                                slideIndex={carouselIndex}
                              />

                              <TouchableOpacity
                                activeOpacity={1}
                                style={{
                                  paddingHorizontal: (mobileW * 2) / 100,
                                  paddingVertical: (mobileW * 1) / 100,
                                  borderRadius: (mobileW * 30) / 100,
                                  backgroundColor: '#97958a',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  alignSelf: 'flex-end',
                                  flexDirection: 'row',
                                  marginTop: (mobileW * 1) / 100,
                                }}>
                                <Image
                                  source={localimag.icon_userLocation}
                                  style={{
                                    width: (mobileW * 3.2) / 100,
                                    height: (mobileW * 3.2) / 100,
                                  }}
                                />
                                <Text
                                  numberOfLines={1}
                                  ellipsizeMode="tail"
                                  style={{
                                    color: Colors.whiteColor,
                                    fontSize: (mobileW * 3) / 100,
                                    fontFamily: Font.FontSemibold,
                                    marginLeft: (mobileW * 1) / 100,
                                    flexShrink: 1,
                                    maxWidth: (mobileW * 50) / 100,
                                  }}>
                                  {user_details?.address}
                                </Text>
                              </TouchableOpacity>
                            </View>

                            <View
                              style={{
                                //backgroundColor: '#00000010',
                                marginTop: (mobileH * 3.5) / 100,
                              }}>
                              <View
                                style={{
                                  paddingHorizontal: (mobileW * 5) / 100,
                                  paddingBottom: (mobileH * 1) / 100,
                                }}>
                                <Text
                                  style={{
                                    color: Colors.whiteColor,
                                    fontSize: (mobileW * 7) / 100,
                                    fontFamily: Font.FontBold,
                                    zIndex: 5,
                                  }}>
                                  {user_details?.name}
                                </Text>

                                <Text
                                  numberOfLines={2}
                                  style={{
                                    color: Colors.whiteColor,
                                    fontSize: (mobileW * 3.4) / 100,
                                    fontFamily: Font.FontMedium,
                                    textAlign: 'justify',
                                    zIndex: 5,
                                  }}>
                                  {user_details?.bring_type == 0
                                    ? user_details?.about?.slice(0, 150)
                                    : user_details?.note?.slice(0, 150)}
                                </Text>

                                <View
                                  style={{
                                    marginTop: (mobileH * 1) / 100,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    zIndex: 5,
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}>
                                    <View
                                      // activeOpacity={1}
                                      style={{
                                        width: (mobileW * 20) / 100,
                                        paddingHorizontal: (mobileW * 2) / 100,
                                        height: (mobileH * 3.5) / 100,
                                        borderRadius: (mobileW * 30) / 100,
                                        backgroundColor: '#A2A19FFF',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        opacity: 0.8,
                                        marginTop: (mobileW * 2) / 100,
                                      }}>
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          color: Colors.whiteColor,
                                          fontSize: (mobileW * 2.8) / 100,
                                          fontFamily: Font.FontSemibold,
                                        }}>
                                        {user_details?.bring_type !=
                                          undefined &&
                                        user_details?.bring_type == 0
                                          ? 'Friendship'
                                          : 'Planning a pet'}
                                      </Text>
                                    </View>

                                    <View
                                      // activeOpacity={1}
                                      style={{
                                        width: (mobileW * 20) / 100,
                                        paddingHorizontal: (mobileW * 2) / 100,
                                        height: (mobileH * 3.5) / 100,
                                        borderRadius: (mobileW * 30) / 100,
                                        backgroundColor: '#A2A19FFF',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        opacity: 0.8,
                                        marginTop: (mobileW * 2) / 100,
                                        marginLeft: (mobileW * 1) / 100,
                                      }}>
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          color: Colors.whiteColor,
                                          fontSize: (mobileW * 2.8) / 100,
                                          fontFamily: Font.FontSemibold,
                                        }}>
                                        {user_details?.occupation}
                                      </Text>
                                    </View>

                                    <View
                                      // activeOpacity={1}
                                      style={{
                                        width: (mobileW * 20) / 100,
                                        height: (mobileH * 3.5) / 100,
                                        borderRadius: (mobileW * 30) / 100,
                                        backgroundColor: '#A2A19FFF',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        opacity: 0.8,
                                        marginTop: (mobileW * 2) / 100,
                                        marginLeft: (mobileW * 1) / 100,
                                      }}>
                                      <Text
                                        style={{
                                          color: Colors.whiteColor,
                                          fontSize: (mobileW * 2.8) / 100,
                                          fontFamily: Font.FontSemibold,
                                        }}>
                                        {user_details?.gender &&
                                          GenderDetails[
                                            user_details?.gender - 1
                                          ][config.language]}
                                      </Text>
                                    </View>

                                    <View
                                      // activeOpacity={1}
                                      style={{
                                        width: (mobileW * 20) / 100,
                                        height: (mobileH * 3.5) / 100,
                                        borderRadius: (mobileW * 30) / 100,
                                        backgroundColor: '#97958a',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        opacity: 0.8,
                                        marginTop: (mobileW * 2) / 100,
                                        marginLeft: (mobileW * 1) / 100,
                                      }}>
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          color: Colors.whiteColor,
                                          fontSize: (mobileW * 2.8) / 100,
                                          fontFamily: Font.FontSemibold,
                                        }}>
                                        {user_details?.relationship_status &&
                                          RealtionData[
                                            user_details?.relationship_status -
                                              1
                                          ][config.language]}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>

                          <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.5)']}
                            style={styles.gradientBottom}
                          />
                        </ImageBackground>
                      </TouchableOpacity>
                    ),
                  )}
                </BannerCarousel>
              </View>

              {user_details?.bring_type == 0 ? (
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: (mobileW * 5) / 100,
                    marginTop: (mobileH * 1.5) / 100,
                  }}>
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: Colors.darkGreenColor,
                          fontSize: (mobileW * 4.5) / 100,
                          fontFamily: Font.FontSemibold,
                        }}>
                        {user_details?.pet_name}
                      </Text>

                      <Image
                        source={localimag.icon_meetLine}
                        style={{
                          width: (mobileW * 47) / 100,
                          height: (mobileW * 12) / 100,
                          marginLeft: (mobileW * 2) / 100,
                          resizeMode: 'contain',
                          marginTop: (-mobileH * 1) / 100,
                        }}
                      />

                      <Text
                        style={{
                          color: Colors.darkGreenColor,
                          fontSize: (mobileW * 4.5) / 100,
                          fontFamily: Font.FontMedium,
                          marginLeft: (mobileW * 0.5) / 100,
                          marginTop: (-mobileH * 3) / 100,
                        }}>
                        Meet
                      </Text>
                    </View>

                    <Text
                      numberOfLines={3}
                      style={{
                        color: Colors.darkGreenColor,
                        fontSize: (mobileW * 3.3) / 100,
                        fontFamily: Font.FontMedium,
                        textAlign: 'justify',
                      }}>
                      {user_details?.about?.slice(0, 130)}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        alignSelf:
                          config.language == 1 ? 'flex-end' : 'flex-start',
                      }}>
                      <FlatList
                        data={getTopBehaviors()}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={3}
                        columnWrapperStyle={{
                          justifyContent: 'space-around',
                          paddingHorizontal: 10,
                        }}
                        contentContainerStyle={{
                          paddingVertical: 5,
                        }}
                        renderItem={({item, index}) => {
                          const isFirstColumn = index % 3 === 0;

                          return (
                            <View
                              style={{
                                flex: 1,
                                alignItems: 'center',
                                marginBottom: (mobileW * 4) / 100,
                                marginLeft: isFirstColumn
                                  ? 0
                                  : (mobileW * 1) / 100,
                              }}>
                              {renderPetBehavior(item?.name, item?.value)}
                            </View>
                          );
                        }}
                      />
                    </View>

                    <View
                      style={{
                        marginTop: (mobileH * 1) / 100,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {user_details?.pet_images
                        ?.slice(0, 4)
                        ?.map((item, index) => (
                          <Image
                            key={index.toString()}
                            source={{
                              uri:
                                config.img_url +
                                (item?.type == 2
                                  ? item?.pet_thumbnail
                                  : item?.image),
                            }}
                            style={[
                              styles.petImage,
                              index !== 0 && {marginLeft: (mobileW * 2) / 100},
                            ]}
                          />
                        ))}
                    </View>
                  </>
                </View>
              ) : (
                <View
                  style={{
                    alignSelf: 'center',
                    marginTop: (mobileW * 5) / 100,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      width: (mobileW * 80) / 100,
                      height: (mobileW * 11) / 100,
                      borderRadius: (mobileW * 10) / 100,
                      backgroundColor: Colors.wishingToParentHeadingColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: Colors.whiteColor,
                        fontFamily: Font.FontSemibold,
                        fontSize: (mobileW * 4) / 100,
                      }}>
                      {t('wishingTobePetParent_txt')}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: (mobileW * 5) / 100,
                    }}>
                    <View
                      style={{
                        backgroundColor: Colors.themeColor2,
                        width: (mobileW * 20) / 100,
                        height: (mobileW * 8) / 100,
                        borderRadius: (mobileW * 10) / 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 3) / 100,
                        }}>
                        {user_details?.pet_type_name[config.language]}
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: Colors.themeColor2,
                        width: (mobileW * 20) / 100,
                        height: (mobileW * 8) / 100,
                        paddingHorizontal: (mobileW * 1) / 100,
                        borderRadius: (mobileW * 10) / 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: (mobileW * 1) / 100,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 3) / 100,
                        }}>
                        {user_details?.breed_name[config.language]}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: Colors.themeColor2,
                        width: (mobileW * 20) / 100,
                        height: (mobileW * 8) / 100,
                        borderRadius: (mobileW * 10) / 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: (mobileW * 1) / 100,
                      }}>
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 3) / 100,
                        }}>
                        {user_details?.pet_gender == 2
                          ? 'Female'
                          : user_details?.pet_gender == 1
                          ? 'Male'
                          : 'Other'}
                      </Text>
                    </View>
                  </View>
                  <View style={{}}>
                    <Text
                      numberOfLines={4}
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3.8) / 100,
                        marginTop: (mobileW * 2) / 100,
                      }}>
                      {user_details?.note?.slice(0, 130)}
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default UserCardProfileWithPet;

const styles = StyleSheet.create({
  behaviorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  behaviorItem: {
    width: (mobileW * 3) / 100,
    alignItems: 'center',
    marginBottom: 10,
  },
  behaviorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  behaviorText: {
    color: Colors.themeColor2,
    fontFamily: Font.FontMedium,
    fontSize: (mobileW * 3.5) / 100,
    marginLeft: (mobileW * 1) / 100,
    maxWidth: (mobileW * 30) / 100,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '30%',
  },
  gradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
  },
  petImage: {
    width: (mobileW * 18) / 100,
    height: (mobileW * 18) / 100,
    borderRadius: (mobileW * 3) / 100,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});
