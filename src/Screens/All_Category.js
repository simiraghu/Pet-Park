import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  config,
  Lang_chg,
  localimag,
  mobileH,
  mobileW,
  Colors,
  Font,
  consolepro,
} from '../Provider/utilslib/Utils';
import {useNavigation, useRoute} from '@react-navigation/native';
import {t} from 'i18next';
import CommonButton from '../Components/CommonButton';
import {SafeAreaView} from 'react-native-safe-area-context';

const AllCategory = () => {
  const navigation = useNavigation();
  const {params} = useRoute();

  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [breedList, setBreedList] = useState([]);

  consolepro.consolelog('Category Array ======>>', params);

  useEffect(() => {
    if (params?.category_array?.length) {
      const updatedList = params?.category_array.map(item => ({
        ...item,
        status: params?.categorie?.includes(item?.pet_type_id) || false,
      }));
      setBreedList(updatedList);
    }

    if (params?.categorie?.length) {
      setSelectedBreeds(params?.categorie);
    }
  }, [params?.category_array, params?.categorie]);

  consolepro.consolelog('Selected Breed -======>>', selectedBreeds);
  consolepro.consolelog('Params Selected Breed======>>', params?.categorie);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.modalContainer}>
        {/* header */}
        <View
          style={{
            width: (mobileW * 90) / 100,
            marginTop: (mobileH * 3.5) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}>
            <Image
              source={localimag.icon_goBack}
              style={{
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: (mobileH * 3) / 100,
            width: (mobileW * 88) / 100,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              color: Colors.whiteColor,
              fontSize: (mobileW * 6.5) / 100,
              fontFamily: Font.FontMedium,
            }}>
            {t('pet_breed_txt')}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View
            style={{
              marginTop: (mobileH * 3) / 100,
              paddingHorizontal: (mobileW * 7) / 100,
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: (mobileW * 1.5) / 100,
            }}>
            {breedList.map((item, index) => (
              <TouchableOpacity
                key={index.toString()}
                onPress={() => {
                  const updatedBreeds = [...selectedBreeds];
                  const breedIndex = updatedBreeds.indexOf(item?.pet_type_id);
                  const newList = [...breedList];

                  if (breedIndex === -1) {
                    updatedBreeds.push(item?.pet_type_id);
                    newList[index].status = true;
                  } else {
                    updatedBreeds.splice(breedIndex, 1);
                    newList[index].status = false;
                  }

                  setBreedList(newList);
                  setSelectedBreeds(updatedBreeds);
                }}
                activeOpacity={0.8}
                style={{
                  paddingHorizontal: (mobileW * 4) / 100,
                  height: (mobileH * 3.8) / 100,
                  borderRadius: (mobileW * 30) / 100,
                  backgroundColor: item?.status
                    ? Colors.whiteColor
                    : Colors.filterDeactiveColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: (mobileH * 1.3) / 100,
                }}>
                <Text
                  style={{
                    color: item.status
                      ? Colors.themeColor_1
                      : Colors.whiteColor,
                    fontSize: (mobileW * 3) / 100,
                    fontFamily: Font.FontMedium,
                  }}>
                  {item?.title[config.language]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            bottom: (mobileW * 8) / 100,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <CommonButton
            title={t('continue_txt')}
            onPress={() => {
              const selectedItems = breedList.filter(item =>
                selectedBreeds.includes(item?.pet_type_id),
              );

              consolepro.consolelog('Selected items===>>', selectedItems);
              selectedItems.forEach(item => (item.status = true));

              if (
                params?.handle_category_select &&
                typeof params.handle_category_select === 'function'
              ) {
                params.handle_category_select(selectedBreeds, selectedItems);
              } else {
                console.warn('handleSelect is not passed or not a function');
              }

              if (params?.onSelecCategory) {
                params.onSelecCategory(selectedBreeds);
              }

              navigation.goBack();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AllCategory;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.themeColor_1,
  },
});
