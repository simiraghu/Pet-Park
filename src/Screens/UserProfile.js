import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {localimag} from '../Provider/Localimage';
import {mobileH, mobileW} from '../Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const UserProfile = ({navigation}) => {
  const [bestMemoWithLike1, setBestMemoWithLike1] = useState(false);
  const [bestMemoWithLike2, setBestMemoWithLike2] = useState(true);
  const [isFavoriteToy, setisFavoriteToy] = useState(false);
  return (
    <View style={styles.mainView}>
      {/* --------- header ------- */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: (mobileW * 5) / 100,
          marginHorizontal: (mobileW * 5) / 100,
          borderBottomColor: Colors.ColorUser_profile_border,
          borderBottomWidth: (mobileW * 0.3) / 100,
          paddingBottom: (mobileW * 4) / 100,
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
            style={[{width: (mobileW * 6) / 100, height: (mobileW * 6) / 100}]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{alignSelf: 'flex-end'}}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('UserProfileEdit')}>
          <Text
            style={{
              color: Colors.whiteColor,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 5) / 100,
            }}>{`Edit`}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
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
                source={localimag.icon_profile_girl}
                style={{
                  width: (mobileW * 12) / 100,
                  height: (mobileW * 12) / 100,
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
            }}>{`Julia R`}</Text>
        </View>

        <View style={{alignSelf: 'center'}}>
          <View
            style={{
              alignSelf: 'center',
              marginTop: (mobileW * 5) / 100,
              borderRadius: (mobileW * 7) / 100,
              overflow: 'hidden',
              //   backgroundColor: 'black'
            }}>
            <View>
              <Image
                source={localimag.icon_profile_girl}
                style={{
                  width: (mobileW * 95) / 100,
                  height: (mobileW * 70) / 100,
                }}
              />
            </View>
          </View>

          {/* ------location---- */}
          <View
            style={{
              backgroundColor: Colors.ColorGrayTransparent,
              // width: (mobileW * 25) / 100,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: (mobileW * 1) / 100,
              borderRadius: (mobileW * 4) / 100,
              position: 'absolute',
              right: (mobileW * 4) / 100,
              top: (mobileW * 8) / 100,
              paddingHorizontal: (mobileW * 5) / 100,
            }}>
            <Image
              source={localimag.icon_location_without_background}
              style={{width: (mobileW * 4) / 100, height: (mobileW * 4) / 100}}
            />
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 3) / 100,
                marginLeft: (mobileW * 1) / 100,
              }}>{`Delhi`}</Text>
          </View>
        </View>

        {/* -------- user details----- */}
        <View
          style={{
            marginTop: (mobileW * 3) / 100,
            marginHorizontal: (mobileW * 2) / 100,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: Colors.ColorGrayTransparent,
              alignSelf: 'flex-start',
              borderRadius: (mobileW * 5) / 100,
              paddingVertical: (mobileW * 1) / 100,
              justifyContent: 'center',
              alignItems: 'center',
              width: (mobileW * 25) / 100,
              marginLeft: (mobileW * 1) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 3) / 100,
              }}>{`29 Years old`}</Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.ColorGrayTransparent,
              alignSelf: 'flex-start',
              borderRadius: (mobileW * 5) / 100,
              paddingVertical: (mobileW * 1) / 100,

              justifyContent: 'center',
              alignItems: 'center',
              width: (mobileW * 22) / 100,
              marginLeft: (mobileW * 1) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 3) / 100,
              }}>{`Single`}</Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.ColorGrayTransparent,
              alignSelf: 'flex-start',
              borderRadius: (mobileW * 5) / 100,
              paddingVertical: (mobileW * 1) / 100,
              justifyContent: 'center',
              alignItems: 'center',
              width: (mobileW * 22) / 100,
              marginLeft: (mobileW * 1) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 3) / 100,
              }}>{`Doctor`}</Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.ColorGrayTransparent,
              alignSelf: 'flex-start',
              borderRadius: (mobileW * 5) / 100,
              paddingVertical: (mobileW * 1) / 100,
              justifyContent: 'center',
              alignItems: 'center',
              width: (mobileW * 22) / 100,
              marginLeft: (mobileW * 1) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 3) / 100,
              }}>{`Pet Owner`}</Text>
          </View>
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
          <View
            style={{
              // backgroundColor: 'blue',
              borderRadius: (mobileW * 3) / 100,
            }}>
            <Image
              source={localimag.icon_dog_1}
              style={{
                width: (mobileW * 50) / 100,
                height: (mobileW * 50) / 100,
              }}
            />
          </View>

          <View style={{marginLeft: (mobileW * 5) / 100}}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontSemibold,
                fontSize: (mobileW * 8) / 100,
              }}>{`Dusky`}</Text>

            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontLight,
                fontSize: (mobileW * 3) / 100,
              }}>{`3-4 year old`}</Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: (mobileW * 3) / 100,
              }}>
              <View>
                <Image
                  source={localimag.icon_friendliness}
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
                }}>{`Friendliness`}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: (mobileW * 3) / 100,
              }}>
              <View>
                <Image
                  source={localimag.icon_active}
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
                }}>{`Active`}</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: (mobileW * 3) / 100,
            marginHorizontal: (mobileW * 2) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: Colors.ColorGrayTransparent,
              alignSelf: 'flex-start',
              borderRadius: (mobileW * 5) / 100,
              paddingVertical: (mobileW * 1) / 100,
              justifyContent: 'center',
              alignItems: 'center',
              //   width: (mobileW * 25) / 100,
              marginLeft: (mobileW * 1) / 100,
              paddingHorizontal: (mobileW * 3) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 3) / 100,
              }}>{`Female`}</Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.ColorGrayTransparent,
              alignSelf: 'flex-start',
              borderRadius: (mobileW * 5) / 100,
              paddingVertical: (mobileW * 1) / 100,

              justifyContent: 'center',
              alignItems: 'center',
              //   width: (mobileW * 22) / 100,
              marginLeft: (mobileW * 1) / 100,
              paddingHorizontal: (mobileW * 3) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 3) / 100,
              }}>{`Fully vaccinated`}</Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.ColorGrayTransparent,
              alignSelf: 'flex-start',
              borderRadius: (mobileW * 5) / 100,
              paddingVertical: (mobileW * 1) / 100,
              justifyContent: 'center',
              alignItems: 'center',
              //   width: (mobileW * 22) / 100,
              marginLeft: (mobileW * 1) / 100,
              paddingHorizontal: (mobileW * 3) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 3) / 100,
              }}>{`Maltese`}</Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.ColorGrayTransparent,
              alignSelf: 'flex-start',
              borderRadius: (mobileW * 5) / 100,
              paddingVertical: (mobileW * 1) / 100,
              justifyContent: 'center',
              alignItems: 'center',
              //   width: (mobileW * 22) / 100,
              marginLeft: (mobileW * 1) / 100,
              paddingHorizontal: (mobileW * 3) / 100,
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontRegular,
                fontSize: (mobileW * 3) / 100,
              }}>{`Friendship`}</Text>
          </View>
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

          <View style={{marginTop: (mobileW * 3) / 100}}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontLight,
                fontSize: (mobileW * 3.5) / 100,
              }}>{`When dusky barked at a stranger approaching the house, showing her loyalty and  protective instints.`}</Text>
          </View>

          {/* ------dog image container ------- */}
          <View
            style={{
              backgroundColor: Colors.whiteColor,
              width: (mobileW * 85) / 100,
              height: (mobileW * 90) / 100,
              borderTopLeftRadius: (mobileW * 5) / 100,
              borderTopEndRadius: (mobileW * 5) / 100,
              marginTop: (mobileW * 5) / 100,
              overflow: 'hidden',
            }}>
            <Image
              source={localimag.icon_dog_2}
              style={{
                width: (mobileW * 85) / 100,
                height: (mobileW * 70) / 100,
                borderBottomLeftRadius: (mobileW * 5) / 100,
                borderBottomRightRadius: (mobileW * 5) / 100,
              }}
            />

            <View
              style={{
                // backgroundColor: 'blue',
                alignSelf: 'flex-start',
                borderRadius: (mobileW * 10) / 100,
                overflow: 'hidden',
                position: 'absolute',
                right: (mobileW * 3) / 100,
                bottom: (mobileW * 22) / 100,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setBestMemoWithLike1(!bestMemoWithLike1);
                }}>
                <Image
                  source={
                    bestMemoWithLike1
                      ? localimag.icon_filled_like
                      : localimag.icon_blank_like
                  }
                  style={{
                    width: (mobileW * 8) / 100,
                    height: (mobileW * 8) / 100,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                height: (mobileW * 0.5) / 100,
                backgroundColor: Colors.ColorSearchBar,
                marginTop: (mobileW * 5) / 100,
                marginHorizontal: (mobileW * 3) / 100,
              }}></View>

            {/* ------comment view------- */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: (mobileH * 0.3) / 100,
                backgroundColor: Colors.whiteColor,
                flex: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: (mobileW * 3) / 100,
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
                <Image
                  source={localimag.icon_send}
                  style={{
                    width: (mobileW * 5) / 100,
                    height: (mobileW * 5) / 100,
                  }}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: Colors.whiteColor,
              width: (mobileW * 85) / 100,
              height: (mobileW * 90) / 100,
              borderTopLeftRadius: (mobileW * 5) / 100,
              borderTopEndRadius: (mobileW * 5) / 100,
              marginTop: (mobileW * 5) / 100,
              overflow: 'hidden',
            }}>
            <Image
              source={localimag.icon_dog_3}
              style={{
                width: (mobileW * 85) / 100,
                height: (mobileW * 70) / 100,
                borderBottomLeftRadius: (mobileW * 5) / 100,
                borderBottomRightRadius: (mobileW * 5) / 100,
              }}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setBestMemoWithLike2(!bestMemoWithLike2)}
              style={{
                // backgroundColor: 'blue',
                alignSelf: 'flex-start',
                borderRadius: (mobileW * 10) / 100,
                overflow: 'hidden',
                position: 'absolute',
                right: (mobileW * 3) / 100,
                bottom: (mobileW * 22) / 100,
              }}>
              <Image
                source={
                  bestMemoWithLike2
                    ? localimag.icon_filled_like
                    : localimag.icon_blank_like
                }
                style={{
                  width: (mobileW * 8) / 100,
                  height: (mobileW * 8) / 100,
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                height: (mobileW * 0.5) / 100,
                backgroundColor: Colors.ColorSearchBar,
                marginTop: (mobileW * 5) / 100,
                marginHorizontal: (mobileW * 3) / 100,
              }}></View>

            {/* ------comment view------- */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: (mobileH * 0.3) / 100,
                backgroundColor: Colors.whiteColor,
                flex: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: (mobileW * 3) / 100,
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

                <Image
                  source={localimag.icon_send}
                  style={{
                    width: (mobileW * 5) / 100,
                    height: (mobileW * 5) / 100,
                  }}
                />
              </View>
            </View>
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

          <View style={{marginTop: (mobileW * 3) / 100}}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontFamily: Font.FontLight,
                fontSize: (mobileW * 3.5) / 100,
              }}>{`Dusky's favorite toy is her squeaky ball, and she absolutely loves peanut butter treats!`}</Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.whiteColor,
              width: (mobileW * 85) / 100,
              height: (mobileW * 90) / 100,
              borderTopLeftRadius: (mobileW * 5) / 100,
              borderTopEndRadius: (mobileW * 5) / 100,
              marginTop: (mobileW * 5) / 100,
              overflow: 'hidden',
            }}>
            <Image
              source={localimag.icon_dog_4}
              style={{
                width: (mobileW * 85) / 100,
                height: (mobileW * 70) / 100,
                borderBottomLeftRadius: (mobileW * 5) / 100,
                borderBottomRightRadius: (mobileW * 5) / 100,
              }}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setisFavoriteToy(!isFavoriteToy)}
              style={{
                // backgroundColor: 'blue',
                alignSelf: 'flex-start',
                borderRadius: (mobileW * 10) / 100,
                overflow: 'hidden',
                position: 'absolute',
                right: (mobileW * 3) / 100,
                bottom: (mobileW * 22) / 100,
              }}>
              <Image
                source={
                  isFavoriteToy
                    ? localimag.icon_filled_like
                    : localimag.icon_blank_like
                }
                style={{
                  width: (mobileW * 8) / 100,
                  height: (mobileW * 8) / 100,
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                height: (mobileW * 0.5) / 100,
                backgroundColor: Colors.ColorSearchBar,
                marginTop: (mobileW * 5) / 100,
                marginHorizontal: (mobileW * 3) / 100,
              }}></View>

            {/* ------comment view------- */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: (mobileH * 0.3) / 100,
                backgroundColor: Colors.whiteColor,
                flex: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: (mobileW * 3) / 100,
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

                <Image
                  source={localimag.icon_send}
                  style={{
                    width: (mobileW * 5) / 100,
                    height: (mobileW * 5) / 100,
                  }}
                />
              </View>
            </View>
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
              paddingBottom: (mobileH * 7) / 100,
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
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.themeColor2,
  },
});
