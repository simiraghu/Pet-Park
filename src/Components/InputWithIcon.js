import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Colors,
  config,
  Font,
  mobileH,
  mobileW,
} from '../Provider/utilslib/Utils';

export const InputWithIcon = ({
  title,
  placeholder,
  value,
  setValue,
  keyboardType = 'default',
  secureTextEntry = false,
  iconSource,
  iconStyle = {},
  containerStyle = {},
  inputStyle = {},
  titleStyle = {},
  onIconPress = () => {},
  maxLength,
  inputwrapperStyle,
  editable,
  resizeMode,
  onPress,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      <TouchableOpacity
        style={[styles.inputWrapper, inputwrapperStyle]}
        onPress={onPress}
        activeOpacity={0.8}>
        <TextInput
          style={[
            styles.input,
            inputStyle,
            {
              textAlign: config.language == 1 ? 'right' : 'left',
            },
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={val => setValue(val)}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={Colors.placeholderTextColor}
          maxLength={maxLength}
          editable={editable}
        />
        {iconSource && (
          <TouchableOpacity onPress={onIconPress}>
            <Image
              source={iconSource}
              style={[styles.icon, iconStyle]}
              resizeMode={resizeMode}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 20,
    width: (mobileW * 90) / 100,
  },

  title: {
    marginBottom: 5,
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.5) / 100,
    marginTop: (mobileH * 1) / 100,
    fontFamily: Font.FontMedium,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.placeholderTextColor,
    borderRadius: (mobileW * 2) / 100,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: (mobileW * 3.5) / 100,
    height: (mobileH * 6) / 100,
  },

  input: {
    flex: 1,
    fontSize: (mobileW * 3.5) / 100,
    color: Colors.themeColor2,
    fontFamily: Font.FontMedium,
  },

  icon: {
    width: (mobileW * 6) / 100,
    height: (mobileH * 2) / 100,
  },
});
