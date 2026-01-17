import {
  FlatList,
  Image,
  Modal,
  ScrollView,
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
  mobileH,
} from '../Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputField from '../Components/InputField';
import {InputWithIcon} from '../Components/InputWithIcon';
import CommonButton from '../Components/CommonButton';
import CommonModal from '../Components/CommonModal';
import DatePicker from 'react-native-date-picker';
import SelectGenderModal from '../Components/SelectGenderModal';

const GenderDetails = [
  {label: 'Female', value: 'Female'},
  {label: 'Male', value: 'Male'},
  {label: 'Others', value: 'Others'},
];

const locationsData = [
  {label: 'New York, USA', value: 'New York, USA'},
  {label: 'Los Angeles, USA', value: 'Los Angeles, USA'},
  {label: 'London, UK', value: 'London, UK'},
];

const petBreedDetails = [
  {label: 'Bulldog', value: 'bulldog'},
  {label: 'Poodle', value: 'poodle'},
  {label: 'Beagle', value: 'beagle'},
  // {label: 'Dachshund', value: 'dachshund'},
];

const PetSize = [
  {label: 'Small', value: 'small'},
  {label: 'Medium', value: 'medium'},
  {label: 'Large', value: 'large'},
];

const UserProfileEdit = ({navigation}) => {
  const [name, setName] = useState(null);
  const [location, setLocation] = useState(null);
  const [whatDoYouDo, setWhatDoYouDo] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState(null);
  const [petName, setPetName] = useState(null);
  const [breed, setBreed] = useState(null);
  const [petDoB, setPetDoB] = useState(new Date());
  const [petGender, setPetGender] = useState(null);
  const [size, setSize] = useState(null);
  const [updateProfileModal, setupdateProfileModal] = useState(false);
  const [isDatePicker, setIsDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const [isGenderModal, setIsGenderModal] = useState(false);
  const [isLocationModal, setIsLocationModal] = useState(false);
  const [isBreedModal, setIsBreedModal] = useState(false);
  const [isPetGenderModal, setIsPetGenderModal] = useState(false);
  const [isSizeModal, setIsSizeModal] = useState(false);
  const [isPetDOBmodal, setIsPetDOBmodal] = useState(false);

  const handleGenderDetails = category => {
    setGender(category?.value);
    setIsGenderModal(false);
  };

  const handleLocationDetails = category => {
    setLocation(category?.value);
    setIsLocationModal(false);
  };

  const handlePetGender = category => {
    setPetGender(category?.value);
    setIsPetGenderModal(false);
  };

  const handlePetBreed = category => {
    setBreed(category?.value);
    setIsBreedModal(false);
  };

  const handlePetSize = category => {
    setSize(category?.value);
    setIsSizeModal(false);
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
            setDateOfBirth(new Date());
            setLocation(null);
            setWhatDoYouDo(null);
            setPetName(null);
            setBreed(null);
            setPetDoB(new Date());
            setPetGender(null);
            setSize(null);
            navigation.goBack();
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
                value={dateOfBirth.toLocaleDateString()}
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
                onPress={() => setIsLocationModal(true)}
                onIconPress={() => setIsLocationModal(true)}
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

        {/* ------- date picker ------- */}
        <DatePicker
          date={dateOfBirth}
          onDateChange={setDateOfBirth}
          modal
          open={isDatePicker}
          mode="date"
          dividerColor={Colors.themeColor}
          theme="light"
          title={Lang_chg.select_date_of_birth_txt[config.language]}
          onCancel={() => setIsDatePicker(false)}
          onConfirm={value => {
            setIsDatePicker(false);
            setDateOfBirth(value);
          }}
          buttonColor={Colors.themeColor}
          onStateChange={setDateOfBirth}
        />

        {/* <SelectGenderModal
          visible={isGenderModal}
          onPress={() => setIsGenderModal(false)}
          setModalStatus={() => setIsGenderModal(false)}
        /> */}

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

        {/* location dropdown modal */}

        <Modal
          transparent={true}
          visible={isLocationModal}
          animationType="fade">
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setIsLocationModal(false)}>
            <View style={styles.dropdown}>
              <FlatList
                data={locationsData}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleLocationDetails(item)}>
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

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
              {Lang_chg.your_pet_detail_txt[config.language]}
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
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={localimag.icon_add_pet_photo}
                  style={{
                    width: (mobileW * 22) / 100,
                    height: (mobileW * 22) / 100,
                    borderRadius: (mobileW * 3) / 100,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={localimag.icon_add_pet_photo}
                  style={{
                    width: (mobileW * 22) / 100,
                    height: (mobileW * 22) / 100,
                    borderRadius: (mobileW * 3) / 100,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={localimag.icon_add_pet_photo}
                  style={{
                    width: (mobileW * 22) / 100,
                    height: (mobileW * 22) / 100,
                    borderRadius: (mobileW * 3) / 100,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={localimag.icon_add_pet_photo}
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
                title={Lang_chg.pet_name_txt[config.language]}
                titleStyles={{color: Colors.themeColor2}}
                placeholder={Lang_chg.enter_pet_name_txt[config.language]}
                inputStyle={{
                  borderColor: Colors.themeColor2,
                  borderWidth: (mobileW * 0.3) / 100,
                }}
                placeholderText={Lang_chg.enter_pet_name_txt[config.language]}
                keyboardType={'dafault'}
                maxLength={50}
                value={petName}
                setValue={setPetName}
              />

              <InputWithIcon
                title={Lang_chg.pet_breed_txt[config.language]}
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
                value={breed}
                onPress={() => setIsBreedModal(true)}
                onIconPress={() => setIsBreedModal(true)}
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
                value={petGender}
                onPress={() => setIsPetGenderModal(true)}
                onIconPress={() => setIsPetGenderModal(true)}
              />

              <InputWithIcon
                title={Lang_chg.size_txt[config.language]}
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={Lang_chg.select_size[config.language]}
                iconSource={localimag.icon_down}
                iconStyle={{
                  with: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
                value={size}
                onPress={() => setIsSizeModal(true)}
                onIconPress={() => setIsSizeModal(true)}
              />

              <InputWithIcon
                title={Lang_chg.DOB_txt[config.language]}
                titleStyle={{color: Colors.themeColor2}}
                containerStyle={{borderColor: Colors.themeColor2}}
                inputwrapperStyle={{borderWidth: (mobileW * 0.3) / 100}}
                placeholder={Lang_chg.select_date_of_birth_txt[config.language]}
                iconSource={localimag.icon_calendar}
                iconStyle={{
                  with: (mobileW * 5) / 100,
                  height: (mobileW * 5) / 100,
                }}
                resizeMode={'contain'}
                editable={false}
                value={petDoB.toLocaleDateString()}
                onPress={() => setIsPetDOBmodal(true)}
                onIconPress={() => setIsPetDOBmodal(true)}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>

        {/* breed dropdown modal */}
        <Modal
          transparent={true}
          visible={isPetGenderModal}
          animationType="fade">
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setIsPetGenderModal(false)}>
            <View style={styles.dropdown}>
              <FlatList
                data={petBreedDetails}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handlePetBreed(item)}>
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* breed dropdown modal */}
        <Modal transparent={true} visible={isBreedModal} animationType="fade">
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setIsBreedModal(false)}>
            <View style={styles.dropdown}>
              <FlatList
                data={petBreedDetails}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handlePetBreed(item)}>
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* pet size modal */}
        <Modal transparent={true} visible={isSizeModal} animationType="fade">
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setIsSizeModal(false)}>
            <View style={styles.dropdown}>
              <FlatList
                data={PetSize}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handlePetSize(item)}>
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/*pet gender dropdown modal */}

        <Modal
          transparent={true}
          visible={isPetGenderModal}
          animationType="fade">
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setIsPetGenderModal(false)}>
            <View style={styles.dropdown}>
              <FlatList
                data={GenderDetails}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handlePetGender(item)}>
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* pet date of birht dropdown modal */}
        <DatePicker
          date={petDoB}
          onDateChange={setPetDoB}
          modal
          open={isPetDOBmodal}
          mode="date"
          dividerColor={Colors.themeColor}
          theme="light"
          title={Lang_chg.select_date_of_birth_txt[config.language]}
          onCancel={() => setIsPetDOBmodal(false)}
          onConfirm={value => {
            setIsPetDOBmodal(false);
            setPetDoB(value);
          }}
          buttonColor={Colors.themeColor}
          onStateChange={setPetDoB}
          maximumDate={new Date()}
        />

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
            setDateOfBirth(new Date());
            setLocation(null);
            setWhatDoYouDo(null);
            setPetName(null);
            setBreed(null);
            setPetDoB(new Date());
            setPetGender(null);
            setSize(null);
            setupdateProfileModal(true);
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
          navigation.navigate('UserProfile');
        }}
        isIconTick={true}
        isIcon={localimag.icon_green_tick}
      />
    </View>
  );
};

export default UserProfileEdit;

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
