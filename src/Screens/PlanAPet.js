import {
  FlatList,
  Image,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Colors,
  config,
  consolepro,
  Font,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  msgProvider,
  localStorage,
  apifuntion,
} from '../Provider/utilslib/Utils';
import {InputWithIcon} from '../Components/InputWithIcon';
import CommonButton from '../Components/CommonButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {validation} from '../Provider/Messageconsolevalidationprovider/Validation_provider';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const GenderDetails = [
  {label: ['Male', 'ذكر', '男'], value: 1},
  {label: ['Female', 'أنثى', '女'], value: 2},
  {label: ['Others', 'آخرون', '其他'], value: 3},
];

const petAgeRanges = [
  {label: ['0-1 Year', '٠-١ سنة', '0-1 岁'], value: 1},
  {label: ['1-3 Years', '١-٣ سنوات', '1-3 岁'], value: 2},
  {label: ['3-7 Years', '٣-٧ سنوات', '3-7 岁'], value: 3},
  {label: ['7-12 Years', '٧-١٢ سنة', '7-12 岁'], value: 4},
  {label: ['12-16 Years', '١٢-١٦ سنة', '12-16 岁'], value: 5},
  {label: ['16-20 Years', '١٦-٢٠ سنة', '16-20 岁'], value: 6},
];

const PlanAPet = ({navigation}) => {
  const [isGenderModal, setIsGenderModal] = useState(false);
  const [isPetBreedModal, setIsPetBreedModal] = useState(false);
  const [isAgeRangeModal, setIsAgeRangeModal] = useState(false);
  const [ispetType, setIspetType] = useState(false);

  const [answer, setAnswer] = useState(null);
  const [gender, setGender] = useState(null);
  const [breed, setBreed] = useState(null);
  const [ageRange, setAgeRange] = useState(null);
  const [petType, setPetType] = useState(null);

  const {t} = useTranslation();
  const {params} = useRoute();

  const frontImage = params?.frontImage;
  const backImage = params?.backImage;
  const selfieImage = params?.selfieImage;
  console.log(frontImage, backImage, selfieImage, '<<PARAMS');

  const [petTypeData, setPetTypeData] = useState([
    {label: 'Dogs', value: 'dogs'},
    {label: 'Cats', value: 'cats'},
    {label: 'Birds', value: 'birds'},
  ]);

  const [petBreedDetails, setPetBreedDetails] = useState([]);

  const handleGenderDetails = category => {
    setGender(category);
    setIsGenderModal(false);
    consolepro.consolelog(category, 'Gender');
    Keyboard.dismiss();
  };

  const handlePetBreed = category => {
    setBreed(category);
    setIsPetBreedModal(false);
    Keyboard.dismiss();
  };

  const handleAgeRange = category => {
    setAgeRange(category);
    setIsAgeRangeModal(null);
    consolepro.consolelog(category, '<<Age Range');
    Keyboard.dismiss();
  };

  const handlePetType = category => {
    consolepro.consolelog(category, '<<CAtegory');
    setPetType(category);
    setIspetType(false);
    setBreed(null);
    Keyboard.dismiss();
  };

  // handle next ========

  const handleNext = async () => {
    try {
      if (!petType) {
        msgProvider.toast(t('emptyPetType'), 'bottom');
        return false;
      }

      if (!breed) {
        msgProvider.toast(t('emptyBreedType'), 'bottom');
        return false;
      }

      if (!gender) {
        msgProvider.toast(t('emptyGender'), 'bottom');
        return false;
      }

      if (!ageRange) {
        msgProvider.toast(t('emptyAgeRange'), 'bottom');
        return false;
      }

      if (!answer) {
        msgProvider.toast(t('emptyNote'), 'bottom');
        return false;
      }

      if (answer && answer.trim().length <= 0) {
        msgProvider.toast(t('emptyNote'), 'bottom');
        return false;
      }
      consolepro.consolelog({
        petType: petType?.pet_type_id,
        breed: breed?.breed_id,
        gender: gender?.value,
        ageRange: ageRange?.value,
        note: answer,
      });

      setTimeout(() => {
        navigation.navigate('AddUserDetails', {
          pagename: 'PlanAPet',
          petType: petType?.pet_type_id,
          breed: breed?.breed_id,
          gender: gender?.value,
          ageRange: ageRange?.value,
          note: answer,
          frontImage: frontImage,
          backImage: backImage,
          selfieImage: selfieImage,
        });
      }, 500);
    } catch (error) {
      consolepro.consolelog(error, '<<<Line 87');
    }
  };

  // get pet type ==========

  const GetPetType = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_array');
      const userId = user_arr?.user_id;

      const API_URL = config.baseURL + 'get_pet_type?user_id=' + userId;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<REs');
            setPetTypeData(res?.pet_type_arr);
          } else {
            consolepro.consolelog(res, '<<REs');
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              setPetTypeData([]);
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERror');
    }
  };

  // Pet Breed ============

  const GetPetBreed = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_array');
      const userId = user_arr?.user_id;

      const API_URL =
        config.baseURL +
        `get_pet_breed?user_id=${userId}&pet_type_id=${petType?.pet_type_id}`;

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<REs');
            setPetBreedDetails(res?.breed_arr);
          } else {
            consolepro.consolelog(res, '<<REs');
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              consolepro.consolelog(res, '<<RES');
              setPetBreedDetails([]);
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERror');
    }
  };

  useFocusEffect(
    useCallback(() => {
      GetPetType();
    }, []),
  );

  useEffect(() => {
    GetPetBreed();
  }, [petType, petType?.breed_id]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        <View
          style={{
            marginTop: (mobileW * 5) / 100,
            marginHorizontal: (mobileW * 5) / 100,
            flex: 1,
          }}>
          {/* --------back ------ */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.goBack(), setAnswer(null);
            }}
            style={{
              alignSelf: 'flex-start',
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

          <KeyboardAwareScrollView
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={Platform.OS === 'android' ? 100 : 0} // Important for Android
            enableOnAndroid={true}
            contentContainerStyle={{
              paddingBottom: (mobileW * 5) / 100,
              flexGrow: 1, // This allows the scroll view to grow and become scrollable
            }}>
            {/* ----------heading----- */}

            <View style={{marginTop: (mobileW * 5) / 100}}>
              <Text
                style={{
                  color: Colors.themeColor,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 7) / 100,
                }}>
                {t('plan_a_pet_txt')}
              </Text>

              <View style={{marginTop: (mobileW * 2) / 100}}>
                {/* ----- input field ------ */}
                <InputWithIcon
                  title={t('what_type_of_pet_are_you_planning')}
                  titleStyle={{color: Colors.themeColor2}}
                  iconSource={localimag.icon_down}
                  iconStyle={{
                    width: (mobileW * 3) / 100,
                    height: (mobileW * 3) / 100,
                  }}
                  resizeMode={'contain'}
                  placeholder={t('select_pet_type_txt')}
                  editable={false}
                  onPress={() => setIspetType(true)}
                  value={petType?.title[config.language]}
                  onIconPress={() => setIspetType(true)}
                />

                <InputWithIcon
                  title={t('what_is_the_preferred_breed_txt')}
                  titleStyle={{color: Colors.themeColor2}}
                  iconSource={localimag.icon_down}
                  iconStyle={{
                    width: (mobileW * 3) / 100,
                    height: (mobileW * 3) / 100,
                  }}
                  resizeMode={'contain'}
                  placeholder={t('select_breed_type')}
                  editable={false}
                  value={breed?.breed_name[config.language]}
                  onPress={() => setIsPetBreedModal(true)}
                  onIconPress={() => setIsPetBreedModal(true)}
                />

                <InputWithIcon
                  title={t('what_gender_are_you_preferred_txt')}
                  titleStyle={{color: Colors.themeColor2}}
                  iconSource={localimag.icon_down}
                  iconStyle={{
                    width: (mobileW * 3) / 100,
                    height: (mobileW * 3) / 100,
                  }}
                  resizeMode={'contain'}
                  placeholder={t('select_gender_txt')}
                  editable={false}
                  onPress={() => setIsGenderModal(true)}
                  value={gender?.label?.[config.language]}
                  onIconPress={() => setIsGenderModal(true)}
                />

                <InputWithIcon
                  title={t('what_age_range_are_you_looking_txt')}
                  titleStyle={{color: Colors.themeColor2}}
                  iconSource={localimag.icon_down}
                  iconStyle={{
                    width: (mobileW * 3) / 100,
                    height: (mobileW * 3) / 100,
                  }}
                  resizeMode={'contain'}
                  placeholder={t('select_age_range_txt')}
                  editable={false}
                  value={ageRange?.label?.[config.language]}
                  onPress={() => setIsAgeRangeModal(true)}
                  onIconPress={() => setIsAgeRangeModal(true)}
                />

                <View
                  style={{
                    paddingVertical: (mobileW * 2) / 100,
                    position: 'relative',
                  }}>
                  <Text
                    style={{
                      color: Colors.themeColor2,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3.5) / 100,
                    }}>
                    {t('Note_txt')}
                  </Text>

                  <TextInput
                    multiline
                    // numberOfLines={7}
                    style={{
                      backgroundColor: Colors.whiteColor,
                      borderColor: Colors.themeColor2,
                      borderWidth: 1,
                      borderRadius: (mobileW * 2) / 100,
                      marginTop: (mobileW * 2) / 100,
                      textAlignVertical: 'top',
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3.5) / 100,
                      padding: (mobileW * 3) / 100,
                      paddingRight: (mobileW * 10) / 100,
                      color: Colors.ColorBlack,
                      height: (mobileW * 40) / 100,
                      textAlign: config.language == 1 ? 'right' : 'left',
                    }}
                    placeholder={t('write_your_note_txt')}
                    value={answer}
                    onChangeText={val => setAnswer(val)}
                    placeholderTextColor={Colors.placeholderTextColor}
                    maxLength={250}
                  />
                  <Text
                    style={{
                      position: 'absolute',
                      right: (mobileW * 4) / 100,
                      bottom: (mobileW * 4) / 100,
                      color: Colors.themeColor,
                      fontSize: (mobileW * 3) / 100,
                      fontFamily: Font.FontMedium,
                    }}>
                    {answer !== null ? answer.trim().length : 0}/250
                  </Text>
                </View>

                <CommonButton
                  title={t('next_txt')}
                  containerStyle={{
                    backgroundColor: Colors.themeColor2,
                    marginTop: (mobileH * 5) / 100,
                    marginBottom: (mobileW * 5) / 100,
                  }}
                  onPress={() => {
                    handleNext();
                  }}
                />
              </View>
            </View>

            {/* gender dropdown modal */}

            <Modal
              transparent={true}
              visible={isGenderModal}
              animationType="fade">
              <TouchableOpacity
                style={styles.overlay}
                onPress={() => setIsGenderModal(false)}>
                <View style={styles.dropdown}>
                  <FlatList
                    data={GenderDetails}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => (
                      <TouchableOpacity
                        style={[
                          styles.option,
                          index === GenderDetails.length - 1 &&
                            styles.lastOption,
                        ]}
                        onPress={() => handleGenderDetails(item)}>
                        <Text style={styles.optionText}>
                          {item.label?.[config.language]}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>

            {/* breed dropdown modal */}
            <Modal
              transparent={true}
              visible={isPetBreedModal}
              animationType="fade">
              <TouchableOpacity
                style={styles.overlay}
                onPress={() => setIsPetBreedModal(false)}>
                <View style={styles.dropdown}>
                  <FlatList
                    data={petBreedDetails}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => (
                      <TouchableOpacity
                        style={[
                          styles.option,
                          index === petBreedDetails.length - 1 &&
                            styles.lastOption,
                        ]}
                        onPress={() => handlePetBreed(item)}>
                        <Text style={styles.optionText}>
                          {item?.breed_name[config.language]}
                        </Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingVertical: (mobileW * 2) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.ColorBlack,
                            fontSize: (mobileW * 4) / 100,
                            fontFamily: Font.FontMedium,
                          }}>
                          {t('emptyBreed_Validation_txt')}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>

            {/* age range */}
            <Modal
              transparent={true}
              visible={isAgeRangeModal}
              animationType="fade">
              <TouchableOpacity
                style={styles.overlay}
                onPress={() => setIsAgeRangeModal(false)}>
                <View style={styles.dropdown}>
                  <FlatList
                    data={petAgeRanges}
                    keyExtractor={item => item.value}
                    renderItem={({item, index}) => (
                      <TouchableOpacity
                        style={[
                          styles.option,
                          index === petAgeRanges.length - 1 &&
                            styles.lastOption,
                        ]}
                        onPress={() => handleAgeRange(item)}>
                        <Text style={styles.optionText}>
                          {item?.label[config.language]}
                        </Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingVertical: (mobileW * 2) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.ColorBlack,
                            fontSize: (mobileW * 4) / 100,
                            fontFamily: Font.FontMedium,
                          }}>
                          {t('no_data_found_txt')}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>

            {/* pet type dropdown */}
            {petTypeData && petTypeData?.length > 0 && (
              <Modal
                transparent={true}
                visible={ispetType}
                animationType="fade">
                <TouchableOpacity
                  style={styles.overlay}
                  onPress={() => setIspetType(false)}>
                  <View style={styles.dropdown}>
                    <FlatList
                      data={petTypeData}
                      keyExtractor={item => item.value}
                      renderItem={({item, index}) => (
                        <TouchableOpacity
                          style={[
                            styles.option,
                            index === petTypeData.length - 1 &&
                              styles.lastOption,
                          ]}
                          onPress={() => handlePetType(item)}>
                          <Text style={styles.optionText}>
                            {item?.title[config.language]}
                          </Text>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={() => (
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: (mobileW * 2) / 100,
                          }}>
                          <Text
                            style={{
                              color: Colors.ColorBlack,
                              fontSize: (mobileW * 4) / 100,
                              fontFamily: Font.FontMedium,
                            }}>
                            {t('no_data_found_txt')}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>
            )}
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PlanAPet;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdown: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
    // maxHeight: 200,
    marginVertical: (mobileW * 10) / 100,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: (mobileW * 4) / 100,
    color: '#333',
    fontFamily: Font.FontMedium,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
});
