import {
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Colors, Font } from '../Provider/Colorsfont';
import { localimag } from '../Provider/Localimage';
import { config, Lang_chg, mobileH, mobileW } from '../Provider/utilslib/Utils';
import CommonButton from '../Components/CommonButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import InputField from '../Components/InputField';
import { useNavigation } from '@react-navigation/native';
import CommonModal from '../Components/CommonModal';

const REPORT_DATA = [
  {
    id: 1,
    report_reason: 'Nudity or sexual activity',
  },
  {
    id: 2,
    report_reason: 'Bullying or harassment',
  },
  {
    id: 3,
    report_reason: 'Suicide, self injury or eating disorders',
  },
  {
    id: 4,
    report_reason: 'Voilence, hate or exploition',
  },
  {
    id: 5,
    report_reason: 'Selling or promoting restricted items',
  },
  {
    id: 6,
    report_reason: 'Scam, fraud or impersonation',
  },
  {
    id: 7,
    report_reason: 'Something else',
  },
];

const SHARING_DATA = [
  {
    id: 1,
    share_image: localimag.icon_whatsapp,
    share_app_name: 'WhatsApp',
  },
  {
    id: 2,
    share_image: localimag.icon_share_to,
    share_app_name: 'Share to',
  },
  {
    id: 3,
    share_image: localimag.icon_copy_link,
    share_app_name: 'Copylink',
  },
  {
    id: 4,
    share_image: localimag.icon_send_share,
    share_app_name: 'Send',
  },
  {
    id: 5,
    share_image: localimag.icon_message,
    share_app_name: 'Message',
  },
];

const UNMATCH_REASON = [
  {
    id: 1,
    reason: 'No Reason',
  },
  {
    id: 2,
    reason: "I'm not intrested in this person",
  },
  {
    id: 3,
    reason: 'Profile fake, Spam or Spammer',
  },
  {
    id: 4,
    reason: 'Inappropriate content',
  },
  {
    id: 5,
    reason: 'Underage or minor',
  },
  {
    id: 6,
    reason: 'Somthing else',
  },
];

const UserDetailsWithMessage = ({ navigation }) => {
  const [isPopUpMenu, setIsPopUpMenu] = useState(false);
  const [shareProfilePopUp, setShareProfilePopUp] = useState(false);
  const [reportProfilePopUp, setReportProfilePopUp] = useState(false);
  const [reportReason, setReportReason] = useState(0);
  const [reportThanksModal, setReportThanksModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [blockedSuccessfully, setBlockedSuccessfully] = useState(false);

  const [bestMemoWithDuskyLike1, setBestMemoWithDuskyLike1] = useState(false);
  const [bestMemoWithDuskyLike2, setBestMemoWithDuskyLike2] = useState(true);
  const [favToyLike, setFavToyLike] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [tags, setTags] = useState([
    {
      id: 0,
      name: '29 Year Old',
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
      name: 'Female',
    },
  ]);

  const [dogDetails, setDogDetails] = useState([
    {
      id: 0,
      name: 'Female',
    },
    {
      id: 1,
      name: 'Fully Vaccinated',
    },
    {
      id: 2,
      name: 'Maltese',
    },
    {
      id: 2,
      name: 'Friendship',
    },
  ]);

  const [dogActivity, setDogActivity] = useState([
    {
      id: 1,
      image: require('../Icons/friendlinessimage.png'),
      activity: 'Frienliness',
    },
    {
      id: 2,
      image: require('../Icons/activeimage.png'),
      activity: 'Active',
    },
    {
      id: 1,
      image: require('../Icons/activeimage.png'),
      activity: 'Love Seeker',
    },
  ]);

  const [isPetModal, setIsPetModal] = useState(false);
  const [unmatchReasonPopup, setUnmatchReasonPopup] = useState(false);
  const [selectUnmatchReason, setSelectUnmatchReason] = useState(0);
  const { navigate } = useNavigation();
  const [isUmatchModal, setIsUmatchModal] = useState(false);

  return (
    <View style={styles.mainView}>
      {/* --------- header ------- */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: (mobileW * 5) / 100,
          marginHorizontal: (mobileW * 4) / 100,
          paddingBottom: (mobileW * 2) / 100,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            alignSelf: 'flex-start',
          }}>
          <Image
            source={localimag.icon_back_arrow}
            style={[{ width: (mobileW * 6) / 100, height: (mobileW * 6) / 100 }]}
          />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsPopUpMenu(true)}>
            <Image
              source={localimag.icon_three_dot}
              style={[
                {
                  width: (mobileW * 6) / 100,
                  height: (mobileW * 6) / 100,
                  marginLeft: (mobileW * 3) / 100,
                },
                { tintColor: Colors.whiteColor },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsUmatchModal(true)}
        style={{
          position: 'absolute',
          bottom: (mobileW * 3) / 100,
          zIndex: 10,
          left: (mobileW * 6) / 100,
          borderRadius: (mobileW * 30) / 100,
          overflow: 'hidden',
          backgroundColor: Colors.cancleColor,
          padding: (mobileW * 1) / 100,
        }}>
        <Image
          source={localimag.icon_dislike}
          style={{ width: (mobileW * 10) / 100, height: (mobileW * 10) / 100 }}
          tintColor={Colors.whiteColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsPetModal(true)}
        style={{
          position: 'absolute',
          bottom: (mobileW * 3) / 100,
          zIndex: 10,
          right: (mobileW * 6) / 100,
          borderRadius: (mobileW * 30) / 100,
          overflow: 'hidden',
          backgroundColor: Colors.WoofYesBtn,
          padding: (mobileW * 1) / 100,
        }}>
        <Image
          source={localimag.icon_hand_like}
          style={{ width: (mobileW * 10) / 100, height: (mobileW * 10) / 100 }}
          tintColor={Colors.whiteColor}
        />
      </TouchableOpacity>

      <KeyboardAwareScrollView
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: Colors.themeColor,
            width: (mobileW * 90) / 100,
            height: (mobileW * 0.2) / 100,
            alignSelf: 'center',
            marginTop: (mobileW * 2) / 100,
          }}></View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={{ alignSelf: 'center' }}
          onPress={() => setIsPetModal(true)}>
          <View
            style={{ alignSelf: 'center', marginVertical: (mobileW * 8) / 100 }}>
            <View
              style={{
                width: (mobileW * 90) / 100,
                height: (mobileW * 35) / 100,
                overflow: 'hidden',
                borderRadius: (mobileW * 5) / 100,
              }}>
              <Image
                source={require('../Icons/dog_glass.png')}
                style={{
                  width: (mobileW * 90) / 100,
                  height: (mobileW * 35) / 100,
                }}
              />
            </View>

            <View
              style={{
                backgroundColor: '#FEE9E9',
                paddingVertical: (mobileW * 3) / 100,
                paddingHorizontal: (mobileW * 3) / 100,
                borderBottomLeftRadius: (mobileW * 3) / 100,
                borderTopRightRadius: (mobileW * 3) / 100,
                width: (mobileW * 85) / 100,
                position: 'absolute',
                bottom: (-mobileW * 5) / 100,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: Colors.cancleColor,
                  fontFamily: Font.FontRegular,
                  fontSize: (mobileW * 3) / 100,
                }}>{`What a good`}</Text>

              <Image
                source={require('../Icons/dog_face_icon.png')}
                style={[
                  {
                    width: (mobileW * 3.5) / 100,
                    height: (mobileW * 3.5) / 100,
                    marginLeft: (mobileW * 1) / 100,
                  },
                  { tintColor: Colors.cancleColor },
                ]}
              />
              <Image
                source={localimag.icon_likePost}
                style={[
                  {
                    width: (mobileW * 4) / 100,
                    height: (mobileW * 4) / 100,
                    marginHorizontal: (mobileW * 2) / 100,
                  },
                  { tintColor: Colors.cancleColor },
                ]}
              />

              <Text
                style={{
                  color: Colors.cancleColor,
                  fontFamily: Font.FontRegular,
                  fontSize: (mobileW * 3) / 100,
                }}>{`Absolutely adorable!`}</Text>

              <Image
                source={require('../Icons/emoji_icon.png')}
                style={[
                  {
                    width: (mobileW * 3.5) / 100,
                    height: (mobileW * 3.5) / 100,
                    marginLeft: (mobileW * 1) / 100,
                  },
                  { tintColor: Colors.cancleColor },
                ]}
              />
            </View>
          </View>
        </TouchableOpacity>
        {/* ----- profile ------ */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: (mobileW * 5) / 100,
          }}>
          <View
            style={{
              marginHorizontal: (mobileW * 5) / 100,
              //   backgroundColor: 'red',
              alignSelf: 'flex-start',
              //   alignItems: 'center',
            }}>
            <View
              style={{
                // backgroundColor: 'blue',
                // alignSelf: 'flex-start',
                borderRadius: (mobileW * 7) / 100,
                overflow: 'hidden',
              }}>
              <Image
                source={require('../Icons/image_user_new1.png')}
                style={{
                  width: (mobileW * 13) / 100,
                  height: (mobileW * 13) / 100,
                }}
              />
            </View>

            <View
              style={{
                // backgroundColor: 'blue',
                alignSelf: 'flex-start',
                borderRadius: (mobileW * 5) / 100,
                overflow: 'hidden',
                position: 'absolute',
                right: 0,
              }}>
              <Image
                source={localimag.icon_dog_4}
                style={{
                  width: (mobileW * 5) / 100,
                  height: (mobileW * 5) / 100,
                }}
              />
            </View>
          </View>

          <Text
            style={{
              color: Colors.whiteColor,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 7) / 100,
              textAlign: 'center',
              alignSelf: 'center',
            }}>{`Ankit K`}</Text>
        </View>

        <View style={{ alignSelf: 'center', marginTop: (mobileW * 5) / 100 }}>
          <ImageBackground
            source={require('../Icons/image_user_new1.png')}
            style={{
              width: (mobileW * 90) / 100,
              height: (mobileH * 32) / 100,
              position: 'relative',
            }}
            imageStyle={{
              borderRadius: (mobileW * 4) / 100,
            }}>
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'transparent']} // Dark to transparent gradient
              style={styles.gradient}
            />
            <View
              style={{
                marginTop: (mobileH * 2) / 100,
              }}>
              <View
                style={{
                  paddingHorizontal: (mobileW * 5) / 100,
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
                      fontSize: (mobileW * 3.5) / 100,
                      fontFamily: Font.FontSemibold,
                      marginLeft: (mobileW * 1) / 100,
                    }}>
                    Delhi
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.5)']} // Dark to transparent gradient
              style={styles.gradientBottom}
            />
          </ImageBackground>
        </View>

        <View
          style={{
            //marginTop: (mobileH * 0.5) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 5,
            alignSelf: 'center',
            marginTop: (mobileW * 3) / 100,
          }}>
          {tags.map((item, index) => {
            return (
              <TouchableOpacity
                key={index.toString()}
                activeOpacity={1}
                style={{
                  width: (mobileW * 20) / 100,
                  height: (mobileH * 3.5) / 100,
                  borderRadius: (mobileW * 30) / 100,
                  backgroundColor: '#97958a',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: index != 0 ? (mobileW * 1.5) / 100 : null,
                  opacity: 0.8,
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

        <View
          style={{
            marginHorizontal: (mobileW * 8) / 100,
            //   backgroundColor: 'blue',
          }}>
          <Text
            style={{
              color: Colors.whiteColor,
              fontFamily: Font.FontLight,
              fontSize: (mobileW * 3.5) / 100,
              marginTop: (mobileH * 3) / 100,
            }}>{`Proud parent to Dusky. My loyal companion who fills my life with joy, love and endless happiness every day.`}</Text>
        </View>

        {/* ------ dog details --------- */}
        <View
          style={{
            marginHorizontal: (mobileW * 5) / 100,
            marginTop: (mobileW * 3) / 100,
            flexDirection: 'row',
            // alignItems: 'center',
            // justifyContent: 'space-between'
          }}>
          <View style={{ borderRadius: (mobileW * 5) / 100, overflow: 'hidden' }}>
            <Image
              source={require('../Icons/images_user.jpg')}
              style={{
                width: (mobileW * 50) / 100,
                height: (mobileW * 50) / 100,
              }}
            />
          </View>

          <View style={{ marginLeft: (mobileW * 5) / 100 }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontSemibold,
                fontSize: (mobileW * 8) / 100,
              }}>{`Bella`}</Text>

            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontLight,
                fontSize: (mobileW * 3) / 100,
              }}>{`3-4 Years Old`}</Text>

            {dogActivity.map((item, index) => (
              <View
                key={index.toString()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: (mobileW * 1) / 100,
                }}>
                <View>
                  <Image
                    source={item.image}
                    style={{
                      width: (mobileW * 10) / 100,
                      height: (mobileW * 10) / 100,
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontLight,
                    fontSize: (mobileW * 3.5) / 100,
                    marginLeft: (mobileW * 1) / 100,
                  }}>
                  {item.activity}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            //marginTop: (mobileH * 0.5) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 5,
            alignSelf: 'center',
            marginTop: (mobileW * 3) / 100,
          }}>
          {dogDetails.map((item, index) => {
            return (
              <TouchableOpacity
                key={index.toString()}
                activeOpacity={1}
                style={{
                  width:
                    index === 1 ? (mobileW * 30) / 100 : (mobileW * 20) / 100,
                  height: (mobileH * 3.5) / 100,
                  borderRadius: (mobileW * 30) / 100,
                  backgroundColor: '#97958a',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: index != 0 ? (mobileW * 1) / 100 : null,
                  opacity: 0.8,
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

        {/* -------- best memory ------ */}
        <View
          style={{
            marginHorizontal: (mobileW * 7) / 100,
            marginTop: (mobileH * 4) / 100,
          }}>
          <View>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 5) / 100,
              }}>{`Best memory with dusky?`}</Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.themeColor,
              width: (mobileW * 35) / 100,
              height: (mobileW * 0.1) / 100,
              alignSelf: 'flex-end',
              marginTop: (mobileW * 1) / 100,
            }}></View>

          <View style={{ marginTop: (mobileW * 3) / 100 }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontLight,
                fontSize: (mobileW * 3.5) / 100,
              }}>{`When dusky barked at a stranger approaching the house, showing her loyalty and  protective instincts.`}</Text>
          </View>

          {/* ------dog image container ------- */}
          <View
            style={{
              // backgroundColor: Colors.whiteColor,
              width: (mobileW * 85) / 100,
              height: (mobileW * 70) / 100,
              // borderTopLeftRadius: (mobileW * 5) / 100,
              // borderTopEndRadius: (mobileW * 5) / 100,
              marginTop: (mobileW * 5) / 100,
              overflow: 'hidden',
              borderRadius: (mobileW * 5) / 100,
            }}>
            <ImageBackground
              source={require('../Icons/image_user_new5.png')}
              style={{
                width: (mobileW * 85) / 100,
                height: (mobileW * 70) / 100,
                borderBottomLeftRadius: (mobileW * 5) / 100,
                borderBottomRightRadius: (mobileW * 5) / 100,
              }}></ImageBackground>
          </View>

          <View
            style={{
              // backgroundColor: Colors.whiteColor,
              width: (mobileW * 85) / 100,
              height: (mobileW * 70) / 100,
              borderTopLeftRadius: (mobileW * 5) / 100,
              borderTopEndRadius: (mobileW * 5) / 100,
              marginTop: (mobileW * 7) / 100,
              overflow: 'hidden',
              borderRadius: (mobileW * 5) / 100,
            }}>
            <ImageBackground
              source={require('../Icons/image_user_new3.png')}
              style={{
                width: (mobileW * 85) / 100,
                height: (mobileW * 70) / 100,
                borderBottomLeftRadius: (mobileW * 5) / 100,
                borderBottomRightRadius: (mobileW * 5) / 100,
              }}></ImageBackground>
          </View>

          {/* --------favorite toy or treat ------- */}
          <View
            style={{
              marginTop: (mobileW * 5) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 5) / 100,
              }}>{`Favorite Toy Or Treat?`}</Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.themeColor,
              width: (mobileW * 35) / 100,
              height: (mobileW * 0.1) / 100,
              alignSelf: 'flex-end',
              marginTop: (mobileW * 1) / 100,
            }}></View>

          <View style={{ marginTop: (mobileW * 3) / 100 }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontLight,
                fontSize: (mobileW * 3.5) / 100,
              }}>{`Dusky's favorite toy is her squeaky ball, and she absolutely loves peanut butter treats!`}</Text>
          </View>

          <View
            style={{
              // backgroundColor: Colors.whiteColor,
              width: (mobileW * 85) / 100,
              height: (mobileW * 70) / 100,
              borderTopLeftRadius: (mobileW * 5) / 100,
              borderTopEndRadius: (mobileW * 5) / 100,
              marginTop: (mobileW * 5) / 100,
              overflow: 'hidden',
              borderRadius: (mobileW * 5) / 100,
            }}>
            <ImageBackground
              source={require('../Icons/image_user_new4.png')}
              style={{
                width: (mobileW * 85) / 100,
                height: (mobileW * 70) / 100,
                borderBottomLeftRadius: (mobileW * 5) / 100,
                borderBottomRightRadius: (mobileW * 5) / 100,
              }}></ImageBackground>
          </View>

          {/* --------trained in commands ------- */}
          <View
            style={{
              marginTop: (mobileW * 5) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 5) / 100,
              }}>{`Trainned in commands or tricks`}</Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.themeColor,
              width: (mobileW * 35) / 100,
              height: (mobileW * 0.1) / 100,
              alignSelf: 'flex-end',
              marginTop: (mobileW * 1) / 100,
            }}></View>

          <View
            style={{
              marginTop: (mobileW * 3) / 100,
              paddingBottom: (mobileH * 10) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontLight,
                fontSize: (mobileW * 3.5) / 100,
              }}>{`Dusky's is trained to sit, stay and shake hands on command. she also love rolling over for treats!`}</Text>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* --------- pop up menu ----- */}
      <Modal
        // animationType="slide"
        transparent={true}
        visible={isPopUpMenu}
        requestClose={() => setIsPopUpMenu(false)}>
        <TouchableOpacity
          onPress={() => {
            setIsPopUpMenu(false);
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
              // width: (mobileW * 35) / 100,
              paddingVertical: (mobileH * 1) / 100,
              borderRadius: (mobileW * 2) / 100,
              backgroundColor: Colors.whiteColor,
              alignItems: 'center',
              position: 'absolute',
              right: (mobileW * 6) / 100,
              top: Platform.OS === 'ios' ? mobileW * 15 / 100 : (mobileW * 6) / 100,
              paddingHorizontal: (mobileW * 3) / 100,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setReportProfilePopUp(true), setIsPopUpMenu(false);
              }}
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: (mobileW * 2) / 100,
              }}>
              <View>
                <Image
                  source={localimag.icon_report_blank}
                  style={{
                    width: (mobileW * 4) / 100,
                    height: (mobileW * 4) / 100,
                  }}
                />
              </View>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 3.5) / 100,
                  marginLeft: (mobileW * 2) / 100,
                }}>{`Report Profile`}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setBlockModal(true), setIsPopUpMenu(false);
              }}
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: (mobileW * 2) / 100,
              }}>
              <View>
                <Image
                  source={localimag.icon_profile_block}
                  style={{
                    width: (mobileW * 4) / 100,
                    height: (mobileW * 4) / 100,
                  }}
                />
              </View>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 3.5) / 100,
                  marginLeft: (mobileW * 2) / 100,
                }}>{`Block`}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* -------- share profile modal -------- */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={shareProfilePopUp}
        onRequestClose={() => {
          setShareProfilePopUp(false);
          setIsPopUpMenu(true);
        }}>
        <TouchableOpacity
          onPress={() => {
            setShareProfilePopUp(false);
            setIsPopUpMenu(true);
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
              width: (mobileW * 70) / 100,
              paddingVertical: (mobileH * 2) / 100,
              borderRadius: (mobileW * 3) / 100,
              backgroundColor: Colors.whiteColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View>
              <Image
                source={localimag.icon_julia_share}
                style={{
                  width: (mobileW * 25) / 100,
                  height: (mobileW * 25) / 100,
                  marginTop: (mobileW * 3) / 100,
                }}
              />
            </View>

            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontSemibold,
                fontSize: (mobileW * 6) / 100,
              }}>
              {`Julia`}
            </Text>

            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontSemibold,
                fontSize: (mobileW * 4) / 100,
              }}>
              {`Pet Owner`}
            </Text>
          </View>
        </TouchableOpacity>

        {/* FlatList at the bottom */}
        <View
          style={{
            position: 'absolute',
            bottom: (mobileW * 1) / 100,
            width: mobileW,
            alignItems: 'center',
            // elevation: (mobileW * 2) / 100,
            // shadowColor: '#000',
            // shadowOffset: {width: 0, height: 2},
            // shadowOpacity: 0.5,
            // shadowRadius: (mobileW * 5) / 100,
            // backgroundColor: Colors.ColorBlack
          }}>
          <FlatList
            data={SHARING_DATA}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  marginHorizontal: (mobileW * 1) / 100,
                  alignItems: 'center',
                }}>
                <Image
                  source={item.share_image}
                  style={{
                    width: (mobileW * 15) / 100,
                    height: (mobileW * 15) / 100,
                  }}
                />
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontLight,
                    fontSize: (mobileW * 2.5) / 100,
                  }}>
                  {item.share_app_name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* -------- report profile modal ---------- */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={reportProfilePopUp}
        requestClose={() => {
          setReportProfilePopUp(false);
        }}>
        <TouchableOpacity
          onPress={() => {
            setReportProfilePopUp(false);
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
              backgroundColor: Colors.whiteColor,
              position: 'absolute',
              bottom: 0,
              borderTopEndRadius: (mobileW * 3) / 100,
              borderTopLeftRadius: (mobileW * 3) / 100,
              // flex: 1
            }}>
            <View
              style={{
                backgroundColor: Colors.themeColor,
                height: (mobileH * 7) / 100,
                width: mobileW,
                paddingHorizontal: (mobileW * 3) / 100,
                borderTopEndRadius: (mobileW * 3) / 100,
                borderTopLeftRadius: (mobileW * 3) / 100,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 6) / 100,
                    textAlign: 'center', // Ensure text is centered
                  }}>
                  {`Report`}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setReportProfilePopUp(false);
                }}>
                <Image
                  source={localimag.icon_cross}
                  style={[
                    {
                      width: (mobileW * 5) / 100,
                      height: (mobileW * 5) / 100,
                    },
                    { tintColor: Colors.whiteColor },
                  ]}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                // alignItems: 'center',
                // justifyContent: 'center',
                marginTop: (mobileW * 4) / 100,
                marginHorizontal: (mobileW * 5) / 100,
                // backgroundColor: 'blue'
              }}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 6) / 100,
                  textAlign: 'center',
                }}>
                {Lang_chg.what_do_you_want_to_report_txt[config.language]}
              </Text>

              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontLight,
                  fontSize: (mobileW * 3.5) / 100,
                  marginTop: (mobileW * 2) / 100,
                }}>
                {Lang_chg.if_someone_immidate_danger_txt[config.language]}
              </Text>

              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 4.5) / 100,
                  marginTop: (mobileW * 2) / 100,
                }}>
                {
                  Lang_chg.why_are_you_reporting_this_profile_txt[
                  config.language
                  ]
                }
              </Text>
            </View>
            <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }}>
              <FlatList
                data={REPORT_DATA}
                style={{ marginTop: (mobileW * 2) / 100 }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      marginLeft: (mobileW * 6) / 100,
                      marginTop: (mobileW * 1) / 100,
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setReportReason(index)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                      }}>
                      <Image
                        source={
                          reportReason === index
                            ? localimag.icon_filled_checkbox_theme1
                            : localimag.icon_empty_radio
                        }
                        style={{
                          width: (mobileW * 5) / 100,
                          height: (mobileW * 5) / 100,
                        }}
                      />
                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 3.5) / 100,
                          marginLeft: (mobileW * 2) / 100,
                        }}>
                        {item.report_reason}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />

              <CommonButton
                title={Lang_chg.ok_txt[config.language]}
                containerStyle={{
                  backgroundColor: Colors.themeColor2,
                  marginVertical: (mobileW * 5) / 100,
                  width: (mobileW * 70) / 100,
                }}
                onPress={() => {
                  setReportProfilePopUp(false), setReportThanksModal(true);
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ------ Report Thanks modal ------ */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={reportThanksModal}
        requestClose={() => {
          setReportThanksModal(false);
        }}>
        <TouchableOpacity
          onPress={() => {
            setReportThanksModal(false);
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
              backgroundColor: Colors.whiteColor,
              position: 'absolute',
              bottom: 0,
              borderTopEndRadius: (mobileW * 3) / 100,
              borderTopLeftRadius: (mobileW * 3) / 100,
              width: mobileW,
            }}>
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: (mobileW * 5) / 100,
                  paddingHorizontal: (mobileW * 7) / 100,
                }}>
                <View>
                  <Image
                    source={localimag.icon_tick_bold_green}
                    style={{
                      width: (mobileW * 12) / 100,
                      height: (mobileW * 12) / 100,
                    }}
                  />
                </View>

                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 6) / 100,
                    marginTop: (mobileW * 2) / 100,
                    textAlign: 'center',
                  }}>
                  {Lang_chg.thanks_for_letting_use_know[config.language]}
                </Text>

                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontLight,
                    fontSize: (mobileW * 3.5) / 100,
                    textAlign: 'center',
                  }}>
                  {Lang_chg.we_use_your_feedback_txt[config.language]}
                </Text>
              </View>

              <CommonButton
                title={Lang_chg.done_txt[config.language]}
                containerStyle={{
                  backgroundColor: Colors.themeColor2,
                  marginVertical: (mobileW * 5) / 100,
                  width: (mobileW * 70) / 100,
                }}
                onPress={() => {
                  setReportThanksModal(false);
                  navigation.navigate('FriendshipHome');
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ------ asking block modal -------- */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={blockModal}
        requestClose={() => {
          setBlockModal(false);
        }}>
        <TouchableOpacity
          onPress={() => {
            setBlockModal(false);
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
              width: (mobileW * 80) / 100,
              paddingVertical: (mobileH * 2) / 100,
              borderRadius: (mobileW * 3) / 100,
              backgroundColor: Colors.whiteColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontBold,
                fontSize: (mobileW * 6) / 100,
              }}>{`Block John?`}</Text>

            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
              }}>{`John will no longer be able to`}</Text>

            <View style={{ marginTop: (mobileW * 2) / 100 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    backgroundColor: Colors.themeColor2,
                    width: (mobileW * 2) / 100,
                    height: (mobileW * 2) / 100,
                    borderRadius: (mobileW * 10) / 100,
                  }}></View>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3) / 100,
                    marginLeft: (mobileW * 1) / 100,
                  }}>{`See your post`}</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: (mobileW * 1) / 100,
                }}>
                <View
                  style={{
                    backgroundColor: Colors.themeColor2,
                    width: (mobileW * 2) / 100,
                    height: (mobileW * 2) / 100,
                    borderRadius: (mobileW * 10) / 100,
                  }}></View>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3) / 100,
                    marginLeft: (mobileW * 1) / 100,
                  }}>{`Tag you`}</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: (mobileW * 1) / 100,
                }}>
                <View
                  style={{
                    backgroundColor: Colors.themeColor2,
                    width: (mobileW * 2) / 100,
                    height: (mobileW * 2) / 100,
                    borderRadius: (mobileW * 10) / 100,
                  }}></View>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3) / 100,
                    marginLeft: (mobileW * 1) / 100,
                  }}>{`Invite you to event or group`}</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: (mobileW * 1) / 100,
                }}>
                <View
                  style={{
                    backgroundColor: Colors.themeColor2,
                    width: (mobileW * 2) / 100,
                    height: (mobileW * 2) / 100,
                    borderRadius: (mobileW * 10) / 100,
                  }}></View>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3) / 100,
                    marginLeft: (mobileW * 1) / 100,
                  }}>{`Start a conversation with you`}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: (mobileW * 3) / 100,
              }}>
              <CommonButton
                containerStyle={{
                  width: (mobileW * 35) / 100,
                  backgroundColor: Colors.ColorCancel,
                  height: (mobileW * 10) / 100,
                }}
                title={Lang_chg.cancel_txt[config.language]}
                onPress={() => setBlockModal(false)}
              />

              <CommonButton
                containerStyle={{
                  width: (mobileW * 35) / 100,
                  backgroundColor: Colors.themeColor2,
                  height: (mobileW * 10) / 100,
                  marginLeft: (mobileW * 3) / 100,
                }}
                title={Lang_chg.block_txt[config.language]}
                onPress={() => {
                  setBlockedSuccessfully(true), setBlockModal(false);
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* -------blocked modal --------*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={blockedSuccessfully}
        requestClose={() => setBlockedSuccessfully(false)}>
        <TouchableOpacity
          onPress={() => {
            setBlockedSuccessfully(false);
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
              width: (mobileW * 70) / 100,
              paddingVertical: (mobileH * 1.5) / 100,
              borderRadius: (mobileW * 3) / 100,
              backgroundColor: Colors.whiteColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                width: (mobileW * 60) / 100,
                color: Colors.themeColor2,
                fontSize: (mobileW * 5.5) / 100,
                fontFamily: Font.FontBold,
                textAlign: 'center',
                marginTop: (mobileH * 1) / 100,
              }}>
              {`You Blocked John`}
            </Text>
            <Text
              style={{
                width: (mobileW * 55) / 100,
                color: Colors.ColorBlack,
                fontSize: (mobileW * 3) / 100,
                fontFamily: Font.FontRegular,
                textAlign: 'center',
              }}>
              {`Blocks are profile specific and apply individually. this block won't apply to John's other profile's, but we'll limit some of the  way that he can interact with you from his other profiles.`}
            </Text>

            <View
              style={{
                width: (mobileW * 55) / 100,
                alignItems: 'center',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: (mobileH * 1.5) / 100,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setBlockedSuccessfully(false);
                  navigation.navigate('FriendshipHome');
                }}
                style={{
                  height: (mobileH * 4.5) / 100,
                  width: (mobileW * 30) / 100,
                  backgroundColor: Colors.themeColor2,
                  borderRadius: (mobileW * 5) / 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: (mobileW * 3.5) / 100,
                    fontFamily: Font.FontMedium,
                    color: Colors.whiteColor,
                  }}>
                  {Lang_chg.ok_txt[config.language]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ------ pet modal ----- */}
      <Modal animationType="slide" transparent={true} visible={isPetModal}>
        <TouchableOpacity
          onPress={() => {
            setIsPetModal(false);
          }}
          activeOpacity={1}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#4C656180',
          }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={(mobileW * 1) / 100}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontSemibold,
                fontSize: (mobileW * 6.5) / 100,
                marginLeft: (mobileW * 3) / 100,
              }}>{`Jojo`}</Text>

            <View
              style={{
                width: (mobileW * 90) / 100,
                height: (mobileW * 70) / 100,
                // backgroundColor: 'blue',
                borderRadius: (mobileW * 7) / 100,
                overflow: 'hidden',
              }}>
              <Image
                source={require('../Icons/dog_glass.png')}
                style={{
                  width: (mobileW * 90) / 100,
                  height: (mobileW * 70) / 100,
                  // backgroundColor: 'blue',

                  borderRadius: (mobileW * 5) / 100,
                }}
              // resizeMode="contain"
              />
            </View>

            <View>
              <InputField
                placeholderText={`Write A Message`}
                keyboardType={'default'}
              />
              <CommonButton
                title={`Send`}
                containerStyle={{
                  backgroundColor: Colors.themeColor2,
                  marginTop: (mobileW * 3) / 100,
                }}
                onPress={() => {
                  setIsPetModal(false);
                  setTimeout(() => {
                    navigation.navigate('MatchChat');
                  }, 200);
                }}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsPetModal(false)}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 4) / 100,
                    alignSelf: 'center',
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  {Lang_chg.cancel_txt[config.language]}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>

        </TouchableOpacity>
      </Modal>

      {/* unmatch modal */}
      {/* <CommonModal
        message={Lang_chg.are_you_sure_txt[config.language]}
        visible={isUmatchModal}
        content={`Unmatching will delete the match for both you and Ankit K.`}
        button={true}
        btnText={`Unmatch`}
        onCrosspress={() => setIsUmatchModal(false)}
        onPress={() => {
          setIsUmatchModal(false);
          setUnmatchReasonPopup(true);
        }}
        isIconTick={true}
        isIcon={localimag.icon_green_tick}
      /> */}

      {/* --unmatch */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isUmatchModal}
        requestClose={() => {
          setIsUmatchModal(false);
        }}>
        <TouchableOpacity
          onPress={() => {
            setIsUmatchModal(false);
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
              backgroundColor: Colors.whiteColor,
              paddingHorizontal: (mobileW * 3) / 100,
              width: (mobileW * 90) / 100,
              borderRadius: (mobileW * 5) / 100,
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: (mobileW * 6) / 100,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsUmatchModal(false)}
              style={{ alignSelf: 'flex-end' }}>
              <Image
                source={localimag.icon_cross}
                style={{
                  width: (mobileW * 5) / 100,
                  height: (mobileW * 5) / 100,

                  marginTop: (mobileW * 2) / 100,
                  marginLeft: (mobileW * 3) / 100,
                }}
              />
            </TouchableOpacity>
            <Image
              source={localimag.icon_unmatch_pop_up}
              style={{
                width: (mobileW * 50) / 100,
                height: (mobileW * 50) / 100,
              }}
            />

            <Text
              style={{
                color: Colors.themeColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 6) / 100,
              }}>
              {Lang_chg.are_you_sure_txt[config.language]}
            </Text>

            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 3.5) / 100,
                paddingHorizontal: (mobileW * 6) / 100,
                textAlign: 'center',
              }}>
              {`Unmatching will delete the match for both you and Ankit K.`}
            </Text>

            <CommonButton
              containerStyle={{
                width: (mobileW * 40) / 100,
                backgroundColor: Colors.themeColor2,
                borderRadius: (mobileW * 3) / 100,
                marginTop: (mobileW * 3) / 100,
              }}
              title={`Unmatch`}
              onPress={() => {
                setIsUmatchModal(false);
                setUnmatchReasonPopup(true);
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* unmatch reason modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={unmatchReasonPopup}
        requestClose={() => {
          setUnmatchReasonPopup(false);
          // setSelectUnmatchReason(0);
        }}>
        <TouchableOpacity
          onPress={() => {
            setUnmatchReasonPopup(false);
            setSelectUnmatchReason(0);
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
              backgroundColor: Colors.whiteColor,
              position: 'absolute',
              bottom: 0,
              borderTopEndRadius: (mobileW * 3) / 100,
              borderTopLeftRadius: (mobileW * 3) / 100,
            }}>
            <View
              style={{
                backgroundColor: Colors.themeColor,
                height: (mobileH * 7) / 100,
                width: mobileW,
                paddingHorizontal: (mobileW * 3) / 100,
                borderTopEndRadius: (mobileW * 3) / 100,
                borderTopLeftRadius: (mobileW * 3) / 100,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 6) / 100,
                    textAlign: 'center', // Ensure text is centered
                  }}>
                  {`Unmatch`}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setUnmatchReasonPopup(false);
                  setSelectUnmatchReason(0);
                }}>
                <Image
                  source={localimag.icon_cross}
                  style={[
                    {
                      width: (mobileW * 5) / 100,
                      height: (mobileW * 5) / 100,
                    },
                    { tintColor: Colors.whiteColor },
                  ]}
                />
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: Colors.whiteColor }}>
              <View
                style={{
                  // alignItems: 'center',
                  // justifyContent: 'center',
                  marginTop: (mobileW * 4) / 100,
                  marginHorizontal: (mobileW * 5) / 100,
                  // backgroundColor: 'blue'
                }}>
                <Text
                  style={{
                    color: Colors.placeholderTextColor,
                    fontFamily: Font.FontRegular,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {`Your reason is private`}
                </Text>
              </View>

              <FlatList
                data={UNMATCH_REASON}
                style={{ marginTop: (mobileW * 2) / 100 }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      marginLeft: (mobileW * 6) / 100,
                      marginTop: (mobileW * 1) / 100,
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setSelectUnmatchReason(index)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                      }}>
                      <Image
                        source={
                          selectUnmatchReason === index
                            ? localimag.icon_filled_checkbox_theme1
                            : localimag.icon_empty_radio
                        }
                        style={{
                          width: (mobileW * 5) / 100,
                          height: (mobileW * 5) / 100,
                        }}
                      />
                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 3.5) / 100,
                          marginLeft: (mobileW * 2) / 100,
                        }}>
                        {item.reason}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />

              <CommonButton
                title={Lang_chg.ok_txt[config.language]}
                containerStyle={{
                  backgroundColor: Colors.themeColor2,
                  marginVertical: (mobileW * 5) / 100,
                  width: (mobileW * 70) / 100,
                }}
                onPress={() => {
                  setUnmatchReasonPopup(false);
                  setSelectUnmatchReason(0);
                  navigate('FriendshipHome');
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default UserDetailsWithMessage;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.themeColor2,
  },
});
