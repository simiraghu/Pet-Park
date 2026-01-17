import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {localimag} from '../Provider/Localimage';
import {Colors, Font} from '../Provider/Colorsfont';
import {
  config,
  consolepro,
  Lang_chg,
  mobileW,
} from '../Provider/utilslib/Utils';
import CommonButton from '../Components/CommonButton';
import {useTranslation} from 'react-i18next';
import {useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const AboutPetHealth = ({navigation}) => {
  const [isVaccinated, setIsVaccinated] = useState(1);
  const [governmentRegister, setGovernmentRegister] = useState(1);
  const [register, setRegister] = useState(2);

  const {t} = useTranslation();
  const {params} = useRoute();

  const pet_name = params?.pet_name;
  const pet_type = params?.petType;
  const breed = params?.breed;
  const pet_dob = params?.pet_dob;
  const pet_gender = params?.pet_gender;
  const size = params?.size;
  const image = params?.image;
  const frontImage = params?.frontImage;
  const backImage = params?.backImage;
  const selfieImage = params?.selfieImage;

  console.log(
    pet_name,
    pet_type,
    breed,
    pet_dob,
    pet_gender,
    size,
    image,
    frontImage,
    backImage,
    selfieImage,
    '<<PARAMS',
  );

  console.log(isVaccinated, governmentRegister, register, 'YES NO');

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        <View
          style={{
            marginTop: (mobileW * 5) / 100,
            marginHorizontal: (mobileW * 5) / 100,
          }}>
          {/* --------back ------ */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={{
              alignSelf: 'flex-start',
              width: (mobileW * 10) / 100,
              height: (mobileW * 10) / 100,
            }}>
            <Image
              source={localimag.icon_back_arrow}
              style={[
                {
                  width: (mobileW * 6) / 100,
                  height: (mobileW * 6) / 100,
                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                },
                {tintColor: Colors.ColorBlack},
              ]}
            />
          </TouchableOpacity>

          {/* -------- heading------- */}

          <View style={{marginTop: (mobileW * 3) / 100}}>
            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontSemibold,
                fontSize: (mobileW * 6) / 100,
              }}>
              {t('tell_us_about_your_pet_health_txt')}
            </Text>
          </View>

          {/* -------vaccination certificate ------- */}
          <View style={{marginTop: (mobileW * 4) / 100}}>
            <View
              style={{
                backgroundColor: Colors.themeColor,
                width: (mobileW * 45) / 100,
                height: (mobileW * 7) / 100,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: (mobileW * 1.5) / 100,
              }}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 4) / 100,
                }}>
                {t('vaccination_status')}
              </Text>
            </View>

            {/* -------vaccinated ------ */}
            <View style={{marginTop: (mobileW * 3) / 100}}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 5) / 100,
                }}>
                {t('is_your_pet_vaccinated_txt')}
              </Text>

              {/* --------- radio butons-------- */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: (mobileW * 2) / 100,
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsVaccinated(1)}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={
                      isVaccinated === 1
                        ? localimag.icon_filled_checkbox_theme1
                        : localimag.icon_empty_checkbox_theme1
                    }
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                  />
                  <Text
                    style={{
                      color: Colors.themeColor,
                      fontFamily: Font.FontSemibold,
                      fontSize: (mobileW * 4) / 100,
                      marginLeft: (mobileW * 2) / 100,
                    }}>
                    {t('yes_txt')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsVaccinated(2)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: (mobileW * 30) / 100,
                  }}>
                  <Image
                    source={
                      isVaccinated === 2
                        ? localimag.icon_filled_checkbox_theme1
                        : localimag.icon_empty_checkbox_theme1
                    }
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                  />
                  <Text
                    style={{
                      color: Colors.themeColor,
                      fontFamily: Font.FontSemibold,
                      fontSize: (mobileW * 4) / 100,
                      marginLeft: (mobileW * 2) / 100,
                    }}>
                    {t('no_txt')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ------- government registration ------- */}
          <View style={{marginTop: (mobileW * 6) / 100}}>
            <View
              style={{
                backgroundColor: Colors.themeColor,
                width: (mobileW * 60) / 100,
                height: (mobileW * 7) / 100,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: (mobileW * 1.5) / 100,
              }}>
              <Text
                style={{
                  color: Colors.whiteColor,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 4) / 100,
                }}>
                {t('government_registration_txt')}
              </Text>
            </View>

            {/* ------- registration ------ */}
            <View style={{marginTop: (mobileW * 2) / 100}}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontSemibold,
                  fontSize: (mobileW * 5) / 100,
                }}>
                {t('is_your_pet_registered_with_the_government_portal')}
              </Text>

              {/* --------- radio butons-------- */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: (mobileW * 2) / 100,
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setGovernmentRegister(1)}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={
                      governmentRegister === 1
                        ? localimag.icon_filled_checkbox_theme1
                        : localimag.icon_empty_checkbox_theme1
                    }
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                  />
                  <Text
                    style={{
                      color: Colors.themeColor,
                      fontFamily: Font.FontSemibold,
                      fontSize: (mobileW * 4) / 100,
                      marginLeft: (mobileW * 2) / 100,
                    }}>
                    {t('yes_txt')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setGovernmentRegister(2)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: (mobileW * 30) / 100,
                  }}>
                  <Image
                    source={
                      governmentRegister === 2
                        ? localimag.icon_filled_checkbox_theme1
                        : localimag.icon_empty_checkbox_theme1
                    }
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                  />
                  <Text
                    style={{
                      color: Colors.themeColor,
                      fontFamily: Font.FontSemibold,
                      fontSize: (mobileW * 4) / 100,
                      marginLeft: (mobileW * 2) / 100,
                    }}>
                    {t('no_txt')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* -------- pet register ----------- */}
          {governmentRegister === 2 && (
            <View style={{marginTop: (mobileW * 4) / 100}}>
              {/* ------- registration ------ */}
              <View style={{marginTop: (mobileW * 4) / 100}}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 5) / 100,
                  }}>
                  {t('would_you_like_to_register_your_pet_txt')}
                </Text>

                {/* --------- radio butons-------- */}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: (mobileW * 2) / 100,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setRegister(1)}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={
                        register === 1
                          ? localimag.icon_filled_checkbox_theme1
                          : localimag.icon_empty_checkbox_theme1
                      }
                      style={{
                        width: (mobileW * 6) / 100,
                        height: (mobileW * 6) / 100,
                      }}
                    />
                    <Text
                      style={{
                        color: Colors.themeColor,
                        fontFamily: Font.FontSemibold,
                        fontSize: (mobileW * 4) / 100,
                        marginLeft: (mobileW * 2) / 100,
                      }}>
                      {t('yes_txt')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setRegister(2)}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: (mobileW * 30) / 100,
                    }}>
                    <Image
                      source={
                        register === 2
                          ? localimag.icon_filled_checkbox_theme1
                          : localimag.icon_empty_checkbox_theme1
                      }
                      style={{
                        width: (mobileW * 6) / 100,
                        height: (mobileW * 6) / 100,
                      }}
                    />
                    <Text
                      style={{
                        color: Colors.themeColor,
                        fontFamily: Font.FontSemibold,
                        fontSize: (mobileW * 4) / 100,
                        marginLeft: (mobileW * 2) / 100,
                      }}>
                      {t('no_txt')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{marginTop: (mobileW * 10) / 100}}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {t('important_disclaimer_txt')}
                </Text>

                <Text
                  style={{
                    color: Colors.themeColor,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3.5) / 100,
                  }}>
                  {t('if_you_cant_register_txt')}
                </Text>
              </View>
            </View>
          )}

          <CommonButton
            title={t('continue_txt')}
            containerStyle={{
              backgroundColor: Colors.themeColor2,
              marginTop: (mobileW * 15) / 100,
            }}
            onPress={() =>
              governmentRegister === 2
                ? (navigation.navigate('TellUsPetNature', {
                    pet_name,
                    pet_type,
                    breed,
                    pet_dob,
                    pet_gender,
                    size,
                    image,
                    isVaccinated,
                    governmentRegister,
                    register,
                    frontImage,
                    backImage,
                    selfieImage,
                  }),
                  setIsVaccinated(1),
                  setGovernmentRegister(1),
                  setRegister(1))
                : (navigation.navigate('KnowYourPet', {
                    pet_name,
                    pet_type,
                    breed,
                    pet_dob,
                    pet_gender,
                    size,
                    image,
                    isVaccinated,
                    governmentRegister,
                    frontImage,
                    backImage,
                    selfieImage,
                    register,
                  }),
                  setIsVaccinated(1),
                  setGovernmentRegister(1),
                  setRegister(1))
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AboutPetHealth;

const styles = StyleSheet.create({});
