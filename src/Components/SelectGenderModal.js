import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {
  mobileH,
  mobileW,
  Colors,
  Font,
  localimag,
} from '../Provider/utilslib/Utils';

const SelectGenderModal = ({
  visible,
  requestClose = () => {},
  setModalStatus = () => {},
  onPress,
}) => {
  const [displayData, setDisplayData] = useState([
    {
      id: 1,
      value: 'Female',
    },
    {
      id: 2,
      value: 'Male',
    },
    {
      id: 3,
      value: 'Other',
    },
  ]);

  const [isSelectedValue, setIsSelectedValue] = useState(false);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onPress}>
      <TouchableOpacity
        onPress={onPress}
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
            paddingVertical: (mobileH * 1) / 100,
            paddingBottom: (mobileH * 2) / 100,
            borderRadius: (mobileW * 3) / 100,
            backgroundColor: Colors.whiteColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            data={displayData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View
                style={{
                  width: (mobileW * 70) / 100,
                  borderBottomColor: Colors.themeColor,
                  borderBottomWidth: (mobileW * 0.3) / 100,
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setIsSelectedValue(index);
                    setTimeout(() => {
                      setModalStatus(false);
                      setIsSelectedValue(null);
                    }, 700);
                  }}
                  style={{
                    paddingVertical: (mobileW * 4) / 100,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: (mobileW * 7) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.themeColor,
                      fontFamily: Font.FontMedium,
                      fontSize: (mobileW * 3.5) / 100,
                    }}>
                    {item.value}
                  </Text>
                  <Image
                    source={
                      isSelectedValue === index
                        ? localimag.icon_filled_checkbox_theme1
                        : localimag.icon_empty_radio
                    }
                    style={{
                      width: (mobileW * 4) / 100,
                      height: (mobileW * 4) / 100,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SelectGenderModal;

const styles = StyleSheet.create({});
