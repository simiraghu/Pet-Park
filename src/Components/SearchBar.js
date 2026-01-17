import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  mobileH,
  mobileW,
  Font,
  Colors,
  localimag,
  config,
} from '../Provider/utilslib/Utils';

const SearchBar = ({
  multiline,
  value,
  setValue = () => {},
  placeHolderText,
  maxLength,
  editable,
  secureText,
  inputStyle = {},
  containerStyle = {},
  onChangeFunction,
  iconStyle,
  iconSource,
  onIconPress,
}) => {
  return (
    <View style={[styles.mainView, containerStyle]}>
      <TextInput
        multiline={multiline}
        placeholderTextColor={Colors.headingColor}
        returnKeyLabel="done"
        returnKeyType="done"
        onSubmitEditing={() => {
          Keyboard.dismiss();
        }}
        value={value}
        keyboardType="default"
        style={[
          styles.inputFieldStyle,
          inputStyle,
          {
            textAlign: config.language == 1 ? 'right' : 'left',
          },
        ]}
        placeholder={placeHolderText}
        onChangeText={val => setValue(val)}
        maxLength={maxLength}
        editable={editable}
        secureTextEntry={secureText}
      />
      <TouchableOpacity activeOpacity={1} onPress={onIconPress}>
        <Image
          source={iconSource ? iconSource : localimag.icon_search}
          style={[
            {
              width: (mobileW * 6.5) / 100,
              height: (mobileW * 6.5) / 100,
            },
            iconStyle,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  mainView: {
    width: (mobileW * 90) / 100,
    backgroundColor: Colors.homeCardbackgroundColor,
    borderRadius: (mobileW * 30) / 100,
    height: (mobileH * 5) / 100,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: (mobileH * 3) / 100,
  },

  inputFieldStyle: {
    height: (mobileH * 5) / 100,
    paddingLeft: (mobileW * 5) / 100,
    color: Colors.headingColor,
    fontFamily: Font.FontMedium,
    fontSize: (mobileW * 3.5) / 100,
    width: (mobileW * 79) / 100,
    marginTop: (mobileH * 0.5) / 100,
  },
});
