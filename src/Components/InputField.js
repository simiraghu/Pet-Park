import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {
  Colors,
  config,
  Font,
  mobileH,
  mobileW,
} from '../Provider/utilslib/Utils';

const InputField = ({
  multiline,
  keyboardType,
  value,
  inputStyle = {},
  setValue = () => {},
  maxLength,
  editable,
  placeholderText,
  title,
  secureText,
  setSecureText,
  containerStyle,
  subtitle,
  titleStyles,
}) => {
  return (
    <View style={containerStyle}>
      <Text style={[styles.titleStyle, titleStyles]}>
        {title}{' '}
        {subtitle && <Text style={[styles.subtitleStyle]}>{subtitle}</Text>}{' '}
      </Text>
      <TextInput
        multiline={multiline}
        placeholderTextColor={Colors.placeholderTextColor}
        returnKeyLabel="done"
        returnKeyType="done"
        onSubmitEditing={() => {
          Keyboard.dismiss();
        }}
        value={value}
        keyboardType={keyboardType}
        style={[
          styles.inputFiledStyle,
          inputStyle,
          {
            textAlign: config.language == 1 ? 'right' : 'left',
          },
        ]}
        placeholder={placeholderText}
        onChangeText={val => setValue(val)}
        maxLength={maxLength}
        editable={editable}
        secureTextEntry={secureText}
      />
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  inputFiledStyle: {
    width: (mobileW * 90) / 100,
    backgroundColor: Colors.whiteColor,
    height: (mobileH * 6) / 100,
    borderRadius: (mobileW * 2) / 100,
    marginTop: (mobileH * 1) / 100,
    paddingHorizontal: (mobileW * 5) / 100,
    color: Colors.themeColor2,
    fontFamily: Font.FontMedium,
    fontSize: (mobileW * 3.5) / 100,
  },
  titleStyle: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
  },
  subtitleStyle: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.3) / 100,
    fontFamily: Font.FontLight,
  },
});
