import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Colors, Font } from '../Provider/Colorsfont';
import { localimag, mobileH, mobileW } from '../Provider/utilslib/Utils';
import { Image } from 'react-native-animatable';

const CommonButton = ({
  containerStyle = {},
  btnTextStyle = {},
  onPress = () => { },
  title,
  leftIcon,
  leftIconStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      style={[styles.btnContainer, containerStyle]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {leftIcon && (
          <Image
            source={leftIcon}
            style={[
              {
                width: (mobileW * 5.5) / 100,
                height: (mobileW * 5.5) / 100,
                marginRight: (mobileW * 1) / 100,
              },
              leftIconStyle,
            ]}
          />
        )}

        <Text style={[styles.btnText, btnTextStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CommonButton;

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: Colors.themeColor,
    width: (mobileW * 75) / 100,
    height: (mobileH * 5) / 100,
    borderRadius: (mobileW * 5) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  btnText: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontRegular,
  },
});
