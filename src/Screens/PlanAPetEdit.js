import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  mobileH,
} from '../Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputField from '../Components/InputField';
import {InputWithIcon} from '../Components/InputWithIcon';
import CommonButton from '../Components/CommonButton';
import CommonModal from '../Components/CommonModal';
import DatePicker from 'react-native-date-picker';

const GenderDetails = [
  {label: 'Female', value: 'Female'},
  {label: 'Male', value: 'Male'},
  {label: 'Others', value: 'Others'},
];

const PlanAPetEdit = ({navigation}) => {
  const [name, setName] = useState(null);
  const [location, setLocation] = useState(null);
  const [whatDoYouDo, setWhatDoYouDo] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [updateProfileModal, setupdateProfileModal] = useState(false);
  const [isDatePicker, setIsDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isGenderModal, setIsGenderModal] = useState(false);

  const handleGenderDetails = category => {
    setGender(category?.value);
    setIsGenderModal(false);
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      <View
        style={{
          marginTop: (mobileW * 3) / 100,
          marginHorizontal: (mobileW * 5) / 100,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setName(null);
            setGender(null);
            setDateOfBirth(null);
            setLocation(null);
            setWhatDoYouDo(null);
            setAnswer(null);
            navigation.goBack();
            setDate(new Date());
          }}
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
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}>
        {/* ---------- heading ------- */}
        <View style={{marginTop: (mobileW * 5) / 100}}>
          <Text
            style={{
              color: Colors.themeColor2,
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 7) / 100,
              marginLeft: (mobileW * 5) / 100,
            }}>
            {Lang_chg.update_profile_txt[config.language]}
          </Text>

          <View
            style={{
              backgroundColor: Colors.ColorEditProfileBack,
              marginVertical: (mobileW * 3) / 100,
            }}>
            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontSemibold,
                fontSize: (mobileW * 5) / 100,
                marginLeft: (mobileW * 5) / 100,
              }}>
              {Lang_chg.your_detail_txt[config.language]}
            </Text>
          </View>
        </View>

        {/* ----------- user inputs -------- */}
        <KeyboardAwareScrollView
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* -------- header content -------- */}

          <View style={{marginHorizontal: (mobileW * 5) / 100}}>
            {/* ------add user photo ------- */}

            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={localimag.icon_add_user}
                  style={{
                    width: (mobileW * 22) / 100,
                    height: (mobileW * 22) / 100,
                    borderRadius: (mobileW * 3) / 100,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={localimag.icon_add_user}
                  style={{
                    width: (mobileW * 22) / 100,
                    height: (mobileW * 22) / 100,
                    borderRadius: (mobileW * 3) / 100,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={localimag.icon_add_user}
                  style={{
                    width: (mobileW * 22) / 100,
                    height: (mobileW * 22) / 100,
                    borderRadius: (mobileW * 3) / 100,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={localimag.icon_add_user}
                  style={{
                    width: (mobileW * 22) / 100,
                    height: (mobileW * 22) / 100,
                    borderRadius: (mobileW * 3) / 100,
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* ------ input fields ----- */}
            <View style={{marginTop: (mobileW * 3) / 100}}>
              <InputField
                title={Lang_chg.your_name_txt[config.language]}
                titleStyles={{color: Colors.themeColor2}}
                inputStyle={{
                  borderColor: Colors.themeColor2,
                  borderWidth: (mobileW * 0.3) / 100,
                }}
                placeholderText={Lang_chg.enter_your_name_txt[config.language]}
                keyboardType={'dafault'}
                containerStyle={{
                  marginTop: (mobileW * 1) / 100,
                }}
                maxLength={50}
                value={name}
                setValue={setName}
              />

              <InputWithIcon
                title={Lang_chg.gender_txt[config.language]}
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={Lang_chg.select_gender_txt[config.language]}
                iconSource={localimag.icon_down}
                iconStyle={{
                  with: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
                value={gender}
                onPress={() => setIsGenderModal(true)}
                onIconPress={() => setIsGenderModal(true)}
              />

              <InputWithIcon
                title={Lang_chg.DOB_txt[config.language]}
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={Lang_chg.select_date_of_birth_txt[config.language]}
                iconSource={localimag.icon_calendar}
                iconStyle={{
                  with: (mobileW * 6) / 100,
                  height: (mobileW * 6) / 100,
                }}
                editable={false}
                value={date.toLocaleDateString()}
                onPress={() => setIsDatePicker(true)}
                onIconPress={() => setIsDatePicker(true)}
              />

              <InputWithIcon
                title={Lang_chg.location_txt[config.language]}
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={Lang_chg.select_location_txt[config.language]}
                iconSource={localimag.icon_down}
                iconStyle={{
                  with: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
                value={location}
                setValue={setLocation}
              />

              <InputField
                title={Lang_chg.what_do_you_do_txt[config.language]}
                titleStyles={{color: Colors.themeColor2}}
                inputStyle={{
                  borderColor: Colors.themeColor2,
                  borderWidth: (mobileW * 0.3) / 100,
                }}
                containerStyle={{
                  marginTop: (mobileW * 1) / 100,
                }}
                placeholderText={
                  Lang_chg.enter_what_do_you_do_txt[config.language]
                }
                keyboardType={'dafault'}
                maxLength={250}
                value={whatDoYouDo}
                setValue={setWhatDoYouDo}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>

        {/* ---------- heading ------- */}
        <View style={{marginTop: (mobileW * 5) / 100}}>
          <View
            style={{
              backgroundColor: Colors.ColorEditProfileBack,
              marginVertical: (mobileW * 3) / 100,
            }}>
            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontSemibold,
                fontSize: (mobileW * 5) / 100,
                marginLeft: (mobileW * 5) / 100,
              }}>
              {`Plan A Pet`}
            </Text>
          </View>
        </View>

        {/* ----- pet details input ------- */}
        <KeyboardAwareScrollView
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* ------add pet photo ------- */}
          <View style={{marginHorizontal: (mobileW * 5) / 100}}>
            {/* ------ input fields ----- */}
            <View style={{marginTop: (mobileW * 3) / 100}}>
              <InputWithIcon
                title={
                  Lang_chg.what_type_of_pet_are_you_planning[config.language]
                }
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={Lang_chg.select_pet_type_txt[config.language]}
                iconSource={localimag.icon_down}
                iconStyle={{
                  with: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
              />
              <InputWithIcon
                title={
                  Lang_chg.what_is_the_preferred_breed_txt[config.language]
                }
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={Lang_chg.select_breed_txt[config.language]}
                iconSource={localimag.icon_down}
                iconStyle={{
                  with: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
              />

              <InputWithIcon
                title={
                  Lang_chg.what_gender_are_you_preferred_txt[config.language]
                }
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={Lang_chg.select_gender_txt[config.language]}
                iconSource={localimag.icon_down}
                iconStyle={{
                  with: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
              />

              <InputWithIcon
                title={
                  Lang_chg.what_age_range_are_you_looking_txt[config.language]
                }
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={Lang_chg.select_age_range_txt[config.language]}
                iconSource={localimag.icon_down}
                iconStyle={{
                  with: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
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
                  {Lang_chg.Note_txt[config.language]}
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
                  }}
                  placeholder={Lang_chg.write_your_note_txt[config.language]}
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
                  {answer !== null ? answer.length : 0}/250
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>

        <DatePicker
          date={date}
          onDateChange={setDate}
          modal
          open={isDatePicker}
          mode="date"
          dividerColor={Colors.themeColor}
          theme="light"
          title={Lang_chg.select_date_of_birth_txt[config.language]}
          onCancel={() => setIsDatePicker(false)}
          onConfirm={value => {
            setIsDatePicker(false);
            setDate(value);
          }}
          buttonColor={Colors.themeColor}
          onStateChange={setDate}
          maximumDate={new Date()}
        />

        {/* gender dropdown modal */}

        <Modal transparent={true} visible={isGenderModal} animationType="fade">
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setIsGenderModal(false)}>
            <View style={styles.dropdown}>
              <FlatList
                data={GenderDetails}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleGenderDetails(item)}>
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <CommonButton
          title={Lang_chg.update_btn_txt[config.language]}
          containerStyle={{
            backgroundColor: Colors.themeColor2,
            marginTop: (mobileW * 4) / 100,
            marginBottom: (mobileH * 6) / 100,
          }}
          onPress={() => {
            setName(null);
            setGender(null);
            setDateOfBirth(null);
            setLocation(null);
            setWhatDoYouDo(null);
            setupdateProfileModal(true);
            setAnswer(null);
            setDate(new Date());
          }}
        />
      </ScrollView>

      {/* --------- update modal -------- */}
      <CommonModal
        message={Lang_chg.profile_update_successfully_txt[config.language]}
        visible={updateProfileModal}
        button={true}
        btnText={Lang_chg.profile_txt[config.language]}
        onCrosspress={() => setupdateProfileModal(false)}
        onPress={() => {
          setupdateProfileModal(false);
          navigation.navigate('NewpetProfile');
        }}
        isIconTick={true}
        isIcon={localimag.icon_green_tick}
      />
    </View>
  );
};

export default PlanAPetEdit;

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
    maxHeight: 200,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
