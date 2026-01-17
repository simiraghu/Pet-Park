import {
  FlatList,
  Image,
  ImageBackground,
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
import React, {useEffect, useState} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {
  localimag,
  mobileH,
  mobileW,
  Lang_chg,
  config,
  localStorage,
} from '../Provider/utilslib/Utils';
import CommonButton from '../Components/CommonButton';
import CommonModal from '../Components/CommonModal';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const REPORT_DATA = [
  {
    id: 1,
    report_reason: [
      'Nudity or sexual activity',
      'العري أو النشاط الجنسي',
      '裸露或性行为',
    ],
  },
  {
    id: 2,
    report_reason: [
      'Bullying or harassment',
      'التنمر أو المضايقة',
      '欺凌或骚扰',
    ],
  },
  {
    id: 3,
    report_reason: [
      'Suicide, self injury or eating disorders',
      'الانتحار أو إيذاء النفس أو اضطرابات الأكل',
      '自杀、自残或饮食失调',
    ],
  },
  {
    id: 4,
    report_reason: [
      'Voilence, hate or exploition',
      'العنف أو الكراهية أو الاستغلال',
      '暴力、仇恨或剥削',
    ],
  },
  {
    id: 5,
    report_reason: [
      'Selling or promoting restricted items',
      'بيع أو الترويج لعناصر محظورة',
      '销售或宣传受限物品',
    ],
  },
  {
    id: 6,
    report_reason: [
      'Scam, fraud or impersonation',
      'الاحتيال أو انتحال الشخصية',
      '诈骗、欺诈或冒充他人',
    ],
  },
  {
    id: 7,
    report_reason: ['Something else', 'شيء آخر', '其他'],
  },
];

const UNMATCH_REASON = [
  {
    id: 1,
    reason: ['No Reason', 'لا يوجد سبب', '没有理由'],
  },
  {
    id: 2,
    reason: ["I'm not interested in this person", 'لست مهتمًا بهذا الشخص', '我对这个人不感兴趣'],
  },
  {
    id: 3,
    reason: ['Profile fake, Spam or Spammer', 'ملف مزيف أو بريد عشوائي أو مرسل بريد عشوائي', '虚假资料、垃圾信息或垃圾信息发送者'],
  },
  {
    id: 4,
    reason: ['Inappropriate content', 'محتوى غير لائق', '不当内容'],
  },
  {
    id: 5,
    reason: ['Underage or minor', 'قاصر أو تحت السن القانونية', '未成年人'],
  },
  {
    id: 6,
    reason: ['Something else', 'شيء آخر', '其他原因'],
  },
];

const MatchChat = ({navigation}) => {
  const [isPopUpMenu, setIsPopUpMenu] = useState(false);
  const [unMatchPopUp, setUnMatchPopUp] = useState(false);
  const [reportProfilePopUp, setReportProfilePopUp] = useState(false);
  const [reportReason, setReportReason] = useState(0);
  const [reportThanksModal, setReportThanksModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [blockedSuccessfully, setBlockedSuccessfully] = useState(false);
  const [unmatchReasonPopup, setUnmatchReasonPopup] = useState(false);
  const [selectUnmatchReason, setSelectUnmatchReason] = useState(0);
  const [chatMessage, setChatMessage] = useState(null);
  const {navigate, goBack} = useNavigation();

  const {t} = useTranslation();

  useEffect(() => {
    const getChatType = async () => {
      await localStorage.removeItem('WoofYes');
    };
    getChatType();
  }, []);

  const {params} = useRoute();
  const type = params?.type;

  return (
    <View style={{flex: 1, backgroundColor: Colors.themeColor2}}>
      {/* --------back ------ */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: (mobileW * 3) / 100,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => (type === 1 ? navigate('Conversation') : goBack())}
          style={{
            alignSelf: 'flex-start',
            marginTop: (mobileW * 4) / 100,
          }}>
          <Image
            source={localimag.icon_back_arrow}
            style={[
              {
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              },
              // {tintColor: Colors.ColorBlack},
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsPopUpMenu(true)}
          style={{
            alignSelf: 'flex-start',
            marginTop: (mobileW * 4) / 100,
          }}>
          <Image
            source={localimag.icon_three_dot}
            style={[
              {width: (mobileW * 6) / 100, height: (mobileW * 6) / 100},
              {tintColor: Colors.whiteColor},
            ]}
          />
        </TouchableOpacity>
      </View>

      {/* user details  */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: (mobileW * 4) / 100,
          marginTop: (mobileW * 5) / 100,
          // backgroundColor: 'blue',
          marginBottom: (mobileW * 5) / 100,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigate('UserDetailsWithMessage')}>
          <View
            style={{
              marginHorizontal: (mobileW * 3) / 100,
              // backgroundColor: 'red',
              alignSelf: 'flex-start',
              //   alignItems: 'center',
            }}>
            <View
              style={{
                borderRadius: (mobileW * 7) / 100,
                overflow: 'hidden',
              }}>
              <Image
                source={require('../Icons/image_user_new1.png')}
                style={{
                  width: (mobileW * 10) / 100,
                  height: (mobileW * 10) / 100,
                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
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
                  width: (mobileW * 3.5) / 100,
                  height: (mobileW * 3.5) / 100,
                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                }}
              />
            </View>
          </View>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // marginLeft: (mobileW * 4) / 100,
          }}>
          <View style={{width: (mobileW * 58) / 100}}>
            <TouchableOpacity
              onPress={() => navigate('UserDetailsWithMessage')}
              style={{width: (mobileW * 30) / 100}}
              activeOpacity={0.8}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontRegular,
                  fontSize: (mobileW * 4) / 100,
                }}>{`Ankit K`}</Text>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontLight,
                  fontSize: (mobileW * 3) / 100,
                }}>{`Bella`}</Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: Colors.whiteColor,
              fontFamily: Font.FontLight,
              fontSize: (mobileW * 3) / 100,
            }}>{`Online`}</Text>
        </View>
      </View>

      {/* chat */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={(mobileH * 9) / 100}
        style={{
          flex: 1,
          backgroundColor: Colors.whiteColor,
          borderTopEndRadius: (mobileW * 8) / 100,
          borderTopLeftRadius: (mobileW * 8) / 100,
          overflow: 'hidden',
        }} // Make the KeyboardAvoidingView take up the full height of the screen
      >
        <View
          style={{
            backgroundColor: Colors.whiteColor,
            width: mobileW,
            // paddingHorizontal: (mobileW * 1.5) / 100,
            borderTopEndRadius: (mobileW * 8) / 100,
            borderTopLeftRadius: (mobileW * 8) / 100,
            // Make sure this view takes all available space (so the keyboard doesn't overlap)
            position: 'relative',
          }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: (mobileH * 15) / 100,
              // paddingTop: (mobileW * 3) / 100,
              backgroundColor: Colors.whiteColor,
              marginTop: (mobileW * 3) / 100,
              paddingHorizontal: (mobileW * 1.5) / 100,
            }}
            keyboardShouldPersistTaps="handled">
            <View
              style={{
                marginTop: (mobileW * 8) / 100,
                marginHorizontal: (mobileW * 1) / 100,
                borderTopEndRadius: (mobileW * 8) / 100,
                borderTopLeftRadius: (mobileW * 8) / 100,
                backgroundColor: Colors.whiteColor,
                flex: 1,
              }}>
              <View style={{alignSelf: 'center', alignItems: 'center'}}>
                <Text
                  style={{
                    color: Colors.themeColor,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {t('congratulations_txt')}
                </Text>

                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontBold,
                    fontSize: (mobileW * 7) / 100,
                  }}>
                  {t('itsAMatch_txt')}
                </Text>

                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 4) / 100,
                    textAlign: 'center',
                  }}>
                  {t('doNotWateTime_txt')}
                </Text>
              </View>
              <View>
                <View>
                  <View
                    style={{
                      // width: (mobileW * 70) / 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                      // backgroundColor: 'blue',
                      alignSelf: 'flex-start',
                      margin: (mobileW * 2) / 100,
                      borderRadius: (mobileW * 4) / 100,
                      overflow: 'hidden',
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View
                        style={{
                          borderRadius: (mobileW * 2) / 100,
                          // backgroundColor: 'red',
                          width: (mobileW * 50) / 100,
                          height: (mobileW * 50) / 100,
                        }}>
                        <Image
                          source={require('../Icons/dog_glass.png')}
                          style={{
                            width: (mobileW * 50) / 100,
                            height: (mobileW * 50) / 100,
                          }}
                          resizeMode="contain"
                        />
                      </View>
                      <Text
                        style={{
                          color: Colors.placeholderTextColor,
                          fontFamily: Font.FontRegular,
                          fontSize: (mobileW * 3) / 100,
                          alignSelf: 'flex-end',
                          marginHorizontal: (mobileW * 1) / 100,
                          textAlign: config.language == 1 ? 'left' : 'left',
                        }}>{`08: 33`}</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      alignSelf: 'flex-start',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      // backgroundColor: 'blue',
                      width: (mobileW * 50) / 100,
                    }}>
                    <View
                      style={{
                        alignSelf: 'flex-end',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          // marginHorizontal: (mobileW * 3) / 100,
                          // backgroundColor: 'red',
                          alignSelf: 'flex-start',
                          //   alignItems: 'center',
                        }}>
                        <View
                          style={{
                            borderRadius: (mobileW * 7) / 100,
                            overflow: 'hidden',
                          }}>
                          <Image
                            source={require('../Icons/image_user_new1.png')}
                            style={{
                              width: (mobileW * 7) / 100,
                              height: (mobileW * 7) / 100,
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
                              width: (mobileW * 3) / 100,
                              height: (mobileW * 3) / 100,
                            }}
                          />
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: '#FEE9E9',
                          padding: (mobileW * 2) / 100,
                          borderBottomLeftRadius: (mobileW * 5) / 100,
                          borderTopRightRadius: (mobileW * 5) / 100,
                          marginLeft: (mobileW * 2) / 100,
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
                            {tintColor: Colors.cancleColor},
                          ]}
                        />
                        <Image
                          source={localimag.icon_likePost}
                          style={[
                            {
                              width: (mobileW * 3.5) / 100,
                              height: (mobileW * 3.5) / 100,
                              marginLeft: (mobileW * 1) / 100,
                            },
                            {tintColor: Colors.cancleColor},
                          ]}
                        />

                        <Text
                          style={{
                            color: Colors.cancleColor,
                            fontFamily: Font.FontRegular,
                            fontSize: (mobileW * 3) / 100,
                            marginLeft: (mobileW * 1) / 100,
                          }}>{`Absolutely adorable`}</Text>

                        <Image
                          source={require('../Icons/emoji_icon.png')}
                          style={[
                            {
                              width: (mobileW * 3.5) / 100,
                              height: (mobileW * 3.5) / 100,
                              marginLeft: (mobileW * 1) / 100,
                            },
                            {tintColor: Colors.cancleColor},
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View>
                <View
                  style={{
                    width: (mobileW * 70) / 100,
                    elevation: (mobileW * 1) / 100,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.5,
                    shadowRadius: (mobileW * 5) / 100,
                    borderTopEndRadius: (mobileW * 2) / 100,
                    borderTopLeftRadius: (mobileW * 2) / 100,
                    borderBottomLeftRadius: (mobileW * 2) / 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: (mobileW * 1.5) / 100,
                    paddingVertical: (mobileW * 3) / 100,
                    backgroundColor: Colors.whiteColor,
                    alignSelf: 'flex-end',
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3) / 100,
                    }}>{`Hello i'm Jack, i have a little dog cooco how are you? `}</Text>
                </View>

                <View
                  style={{
                    alignSelf: 'flex-end',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // backgroundColor: 'blue',
                    width: (mobileW * 30) / 100,
                    marginTop: (mobileW * 1) / 100,
                  }}>
                  {/* <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontLight,
                      fontSize: (mobileW * 3) / 100,
                    }}>{`5: 34pm`}</Text> */}
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        // marginHorizontal: (mobileW * 3) / 100,
                        // backgroundColor: 'red',
                        alignSelf: 'flex-start',
                        //   alignItems: 'center',
                      }}>
                      <View
                        style={{
                          borderRadius: (mobileW * 7) / 100,
                          overflow: 'hidden',
                        }}>
                        <Image
                          source={require('../Icons/images_user2.jpg')}
                          style={{
                            width: (mobileW * 7) / 100,
                            height: (mobileW * 7) / 100,
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
                            width: (mobileW * 3) / 100,
                            height: (mobileW * 3) / 100,
                          }}
                        />
                      </View>
                    </View>
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3) / 100,
                        marginLeft: (mobileW * 2) / 100,
                      }}>{`Rahul Singh`}</Text>
                  </View>
                </View>
              </View>

              <View>
                <View
                  style={{
                    width: (mobileW * 70) / 100,
                    elevation: (mobileW * 1) / 100,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.5,
                    shadowRadius: (mobileW * 5) / 100,
                    borderTopEndRadius: (mobileW * 2) / 100,
                    borderTopLeftRadius: (mobileW * 2) / 100,
                    borderBottomLeftRadius: (mobileW * 2) / 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: (mobileW * 1.5) / 100,
                    paddingVertical: (mobileW * 3) / 100,
                    backgroundColor: Colors.whiteColor,
                    alignSelf: 'flex-end',
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3) / 100,
                    }}>{`Hello i'm Jack, i have a little dog cooco how are you? `}</Text>
                </View>

                <View
                  style={{
                    alignSelf: 'flex-end',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // backgroundColor: 'blue',
                    width: (mobileW * 30) / 100,
                    marginTop: (mobileW * 1) / 100,
                  }}>
                  {/* <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontLight,
                      fontSize: (mobileW * 3) / 100,
                    }}>{`5: 34pm`}</Text> */}
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        // marginHorizontal: (mobileW * 3) / 100,
                        // backgroundColor: 'red',
                        alignSelf: 'flex-start',
                        //   alignItems: 'center',
                      }}>
                      <View
                        style={{
                          borderRadius: (mobileW * 7) / 100,
                          overflow: 'hidden',
                        }}>
                        <Image
                          source={require('../Icons/images_user2.jpg')}
                          style={{
                            width: (mobileW * 7) / 100,
                            height: (mobileW * 7) / 100,
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
                            width: (mobileW * 3) / 100,
                            height: (mobileW * 3) / 100,
                          }}
                        />
                      </View>
                    </View>
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3) / 100,
                        marginLeft: (mobileW * 2) / 100,
                      }}>{`Rahul Singh`}</Text>
                  </View>
                </View>
              </View>

              <View>
                <View
                  style={{
                    width: (mobileW * 70) / 100,
                    elevation: (mobileW * 1) / 100,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.5,
                    shadowRadius: (mobileW * 5) / 100,
                    borderTopEndRadius: (mobileW * 2) / 100,
                    borderTopLeftRadius: (mobileW * 2) / 100,
                    borderBottomLeftRadius: (mobileW * 2) / 100,
                    // alignItems: 'center',
                    // justifyContent: 'center',
                    paddingHorizontal: (mobileW * 1.5) / 100,
                    paddingVertical: (mobileW * 1) / 100,
                    backgroundColor: Colors.themeColor2,
                    alignSelf: 'flex-end',
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View>
                      <Image
                        source={localimag.icon_play_icon}
                        style={{
                          width: (mobileW * 10) / 100,
                          height: (mobileW * 10) / 100,
                        }}
                      />
                    </View>
                    <View>
                      <Image
                        source={localimag.icon_voice_message}
                        style={{
                          width: (mobileW * 55) / 100,
                          height: (mobileW * 6) / 100,
                        }}
                      />
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    alignSelf: 'flex-end',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // backgroundColor: 'blue',
                    width: (mobileW * 70) / 100,
                    marginTop: (mobileW * 1) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontLight,
                      fontSize: (mobileW * 3) / 100,
                    }}>{`5: 34pm`}</Text>
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        // marginHorizontal: (mobileW * 1) / 100,
                        // backgroundColor: 'red',
                        alignSelf: 'flex-start',
                        //   alignItems: 'center',
                      }}>
                      <View
                        style={{
                          borderRadius: (mobileW * 7) / 100,
                          overflow: 'hidden',
                        }}>
                        <Image
                          source={require('../Icons/images_user2.jpg')}
                          style={{
                            width: (mobileW * 7) / 100,
                            height: (mobileW * 7) / 100,
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
                            width: (mobileW * 3) / 100,
                            height: (mobileW * 3) / 100,
                          }}
                        />
                      </View>
                    </View>
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 3) / 100,
                        marginHorizontal: (mobileW * 2) / 100,
                      }}>{`Rahul Singh`}</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={(mobileH * 8) / 100}
        style={{
          position: 'absolute',
          bottom: 0,
          // flex: 1,
          backgroundColor: Colors.whiteColor,
          width: mobileW,
        }}>
        <View
          style={{
            backgroundColor: Colors.ColorChatInput,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: (mobileW * 95) / 100,
            alignSelf: 'center',
            borderRadius: (mobileW * 2) / 100,
            marginVertical: (mobileW * 3) / 100,
            // position: 'absolute',
            // bottom: 0
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              borderRadius: (mobileW * 3) / 100,
              margin: (mobileW * 1) / 100,
              overflow: 'hidden',
            }}>
            <Image
              source={localimag.icon_plus}
              style={{
                width: (mobileW * 8) / 100,
                height: (mobileW * 8) / 100,
              }}
            />
          </TouchableOpacity>

          <TextInput
            style={{
              width: (mobileW * 60) / 100,
              color: Colors.ColorBlack,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 3.5) / 100,
              height: (mobileH * 7) / 100,
              textAlign: config.language == 1 ? 'right' : 'left',
            }}
            placeholder={t('typeMessageHere_txt')}
            placeholderTextColor={Colors.ColorBlack}
            keyboardType="default"
            value={chatMessage}
            onChangeText={val => setChatMessage(val)}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              // alignSelf: 'center',
              // marginVertical: (mobileW * 1) / 100,
              borderRadius: (mobileW * 3) / 100,
              margin: (mobileW * 1) / 100,
              overflow: 'hidden',
            }}>
            <Image
              source={localimag.icon_voice_mic}
              style={{
                width: (mobileW * 8) / 100,
                height: (mobileW * 8) / 100,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setChatMessage(null)}
            style={{
              // alignSelf: 'center',
              // marginVertical: (mobileW * 1) / 100,
              borderRadius: (mobileW * 3) / 100,
              margin: (mobileW * 1) / 100,
              overflow: 'hidden',
            }}>
            <Image
              source={localimag.icon_send}
              style={{
                width: (mobileW * 7) / 100,
                height: (mobileW * 7) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* </KeyboardAvoidingView> */}

      {/* pop up menu  */}

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
              top:
                Platform.OS === 'ios'
                  ? (mobileW * 15) / 100
                  : (mobileW * 7) / 100,
              paddingHorizontal: (mobileW * 3) / 100,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setUnMatchPopUp(true), setIsPopUpMenu(false);
              }}
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: (mobileW * 2) / 100,
              }}>
              <View>
                <Image
                  source={require('../Icons/unmatch_heart.png')}
                  style={[
                    {
                      width: (mobileW * 4) / 100,
                      height: (mobileW * 4) / 100,
                    },
                    {tintColor: Colors.themeColor},
                  ]}
                />
              </View>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 3.5) / 100,
                  marginLeft: (mobileW * 2) / 100,
                }}>
                {t('unmatch_txt')}
              </Text>
            </TouchableOpacity>

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
                }}>
                {t('reportProfile_txt')}
              </Text>
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
                }}>
                {t('block_txt')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* unmatch */}
      {/* <CommonModal
        message={Lang_chg.are_you_sure_txt[config.language]}
        visible={unMatchPopUp}
        content={`Unmatching will delete the match for both you and Ankit K.`}
        button={true}
        btnText={`Unmatch`}
        onCrosspress={() => setUnMatchPopUp(false)}
        onPress={() => {
          setUnMatchPopUp(false);
          setUnmatchReasonPopup(true);
        }}
      /> */}

      {/* unmatch reason */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={unmatchReasonPopup}
        requestClose={() => {
          setUnmatchReasonPopup(false);
          setSelectUnmatchReason(0);
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
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 6) / 100,
                    textAlign: 'center', // Ensure text is centered
                  }}>
                  {t('unmatch_txt')}
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
                    {tintColor: Colors.whiteColor},
                  ]}
                />
              </TouchableOpacity>
            </View>

            <View style={{backgroundColor: Colors.whiteColor}}>
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
                  {t('reportProfile_txt')}
                </Text>
              </View>

              <FlatList
                data={UNMATCH_REASON}
                style={{marginTop: (mobileW * 2) / 100}}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
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
                        {item?.reason[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />

              <CommonButton
                title={t('ok_txt')}
                containerStyle={{
                  backgroundColor: Colors.themeColor2,
                  marginVertical: (mobileW * 5) / 100,
                  width: (mobileW * 70) / 100,
                }}
                onPress={() => {
                  setUnmatchReasonPopup(false);
                  setSelectUnmatchReason(0);
                  navigate('Conversation');
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* --unmatch */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={unMatchPopUp}
        requestClose={() => {
          setUnMatchPopUp(false);
        }}>
        <TouchableOpacity
          onPress={() => {
            setUnMatchPopUp(false);
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
              onPress={() => setUnMatchPopUp(false)}
              style={{alignSelf: 'flex-end'}}>
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
              {t('are_you_sure_txt')}
            </Text>

            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 3.5) / 100,
                paddingHorizontal: (mobileW * 6) / 100,
                textAlign: 'center',
              }}>
              {`${t('unmatchingWillDelete_txt')} Ankit K.`}
            </Text>

            <CommonButton
              containerStyle={{
                width: (mobileW * 40) / 100,
                backgroundColor: Colors.themeColor2,
                borderRadius: (mobileW * 3) / 100,
                marginTop: (mobileW * 3) / 100,
              }}
              title={t('unmatch_txt')}
              onPress={() => {
                setUnMatchPopUp(false);
                setUnmatchReasonPopup(true);
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* report profile modal */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={reportProfilePopUp}
        requestClose={() => {
          setReportProfilePopUp(false);
          setReportReason(0);
        }}>
        <TouchableOpacity
          onPress={() => {
            setReportProfilePopUp(false);
            setReportReason(0);
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
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 6) / 100,
                    textAlign: 'center', // Ensure text is centered
                  }}>
                  {t('report_txt')}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setReportProfilePopUp(false);
                  setReportReason(0);
                }}>
                <Image
                  source={localimag.icon_cross}
                  style={[
                    {
                      width: (mobileW * 5) / 100,
                      height: (mobileW * 5) / 100,
                    },
                    {tintColor: Colors.whiteColor},
                  ]}
                />
              </TouchableOpacity>
            </View>

            <View style={{backgroundColor: Colors.whiteColor}}>
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
                  {t('what_do_you_want_to_report_txt')}
                </Text>

                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontLight,
                    fontSize: (mobileW * 3.5) / 100,
                    marginTop: (mobileW * 2) / 100,
                  }}>
                  {t('if_someone_immidate_danger_txt')}
                </Text>

                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 4.5) / 100,
                    marginTop: (mobileW * 2) / 100,
                  }}>
                  {t('why_are_you_reporting_this_profile_txt')}
                </Text>
              </View>

              <FlatList
                data={REPORT_DATA}
                style={{marginTop: (mobileW * 2) / 100}}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
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
                        {item?.report_reason[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />

              <CommonButton
                title={t('ok_txt')}
                containerStyle={{
                  backgroundColor: Colors.themeColor2,
                  marginVertical: (mobileW * 5) / 100,
                  width: (mobileW * 70) / 100,
                }}
                onPress={() => {
                  setReportProfilePopUp(false), setReportThanksModal(true);
                  setReportReason(0);
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Report Thanks modal */}

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
            <View style={{backgroundColor: Colors.whiteColor, flex: 1}}>
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
                  {t('thanks_for_letting_use_know')}
                </Text>

                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontLight,
                    fontSize: (mobileW * 3.5) / 100,
                    textAlign: 'center',
                  }}>
                  {t('we_use_your_feedback_txt')}
                </Text>
              </View>

              <View style={{marginHorizontal: (mobileW * 10) / 100}}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 4.5) / 100,
                    alignSelf: 'flex-start',
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  {t('other_steps_you_can_take')}
                </Text>

                <View style={{marginTop: (mobileW * 2) / 100}}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={localimag.icon_profile_block}
                      style={{
                        width: (mobileW * 6) / 100,
                        height: (mobileW * 6) / 100,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontMedium,
                          fontSize: (mobileW * 4) / 100,
                          marginLeft: (mobileW * 2) / 100,
                        }}>{`${t('block_txt')} John's Profile`}</Text>
                      <Text
                        style={{
                          color: Colors.themeColor2,
                          fontFamily: Font.FontLight,
                          fontSize: (mobileW * 3) / 100,
                        }}>
                        {t('youwontBeAbleTo_txt')}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  <Image
                    source={localimag.icon_hide_eye}
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                  />
                  <View>
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontMedium,
                        fontSize: (mobileW * 4) / 100,
                        marginLeft: (mobileW * 2) / 100,
                      }}>{`${t('hideAllFrom_txt')} John`}</Text>
                    <Text
                      style={{
                        color: Colors.themeColor2,
                        fontFamily: Font.FontLight,
                        fontSize: (mobileW * 3) / 100,
                      }}>
                      {t('stopSeeingThePerson_txt')}
                    </Text>
                  </View>
                </View>
              </View>

              <CommonButton
                title={t('done_txt')}
                containerStyle={{
                  backgroundColor: Colors.themeColor2,
                  marginVertical: (mobileW * 5) / 100,
                  width: (mobileW * 70) / 100,
                }}
                onPress={() => {
                  setReportThanksModal(false);
                  navigation.navigate('Conversation');
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* asking block modal */}

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
              }}>{`${t('block_txt')} Ankit K?`}</Text>

            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
              }}>{`John ${t('willNoLonger_txt')}`}</Text>

            <View style={{marginTop: (mobileW * 2) / 100}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    backgroundColor: Colors.themeColor2,
                    width: (mobileW * 2) / 100,
                    height: (mobileW * 2) / 100,
                    borderRadius: (mobileW * 30) / 100,
                  }}></View>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3) / 100,
                    marginLeft: (mobileW * 1) / 100,
                  }}>
                  {t('seeYourPost_txt')}
                </Text>
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
                  }}>
                  {t('tagYou_txt')}
                </Text>
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
                  }}>
                  {t('inviteYouToYourGroup_txt')}
                </Text>
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
                  }}>
                  {t('startConversationWith_txt')}
                </Text>
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
                title={t('cancel_txt')}
                onPress={() => setBlockModal(false)}
              />

              <CommonButton
                containerStyle={{
                  width: (mobileW * 35) / 100,
                  backgroundColor: Colors.themeColor2,
                  height: (mobileW * 10) / 100,
                  marginLeft: (mobileW * 3) / 100,
                }}
                title={t('block_txt')}
                onPress={() => {
                  setBlockedSuccessfully(true), setBlockModal(false);
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* blocked modal */}
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
              {`${t('youBlocked_txt')} Ankit K`}
            </Text>
            <Text
              style={{
                width: (mobileW * 55) / 100,
                color: Colors.ColorBlack,
                fontSize: (mobileW * 3) / 100,
                fontFamily: Font.FontRegular,
                textAlign: 'center',
              }}>
              {t('block_description_txt')}
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
                  navigation.navigate('Conversation');
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
                  {t('ok_txt')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MatchChat;

const styles = StyleSheet.create({});
