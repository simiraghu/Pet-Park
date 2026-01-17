import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import CommonButton from './CommonButton';
import {
  localimag,
  mobileH,
  mobileW,
  Colors,
  Font,
} from '../Provider/utilslib/Utils';

const ConfirmModal = ({
  visible,
  requestClose = () => {},
  setModalStatus = () => {},
  onCrosspress = () => {},
  message,
  onCancelBtn,
  btnText,
  onPress = () => {},
  onCancelText,
  onCancelPress,
  button,
  content,
  popupicon,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={requestClose ?? requestClose}>
      <TouchableOpacity
        onPress={() => requestClose ?? setModalStatus(false)}
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
            paddingVertical: (mobileW * 1) / 100,
            paddingBottom: (mobileH * 2) / 100,
            borderRadius: (mobileW * 3) / 100,
            backgroundColor: Colors.whiteColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onCrosspress ? onCrosspress : requestClose}
            style={{
              alignSelf: 'flex-end',
              marginRight: (mobileW * 2) / 100,
            }}>
            <Image
              source={localimag.icon_cross}
              style={{
                width: (mobileW * 4) / 100,
                height: (mobileW * 4) / 100,
              }}
            />
          </TouchableOpacity>

          <Image
            source={popupicon}
            style={{
              width: (mobileW * 15) / 100,
              height: (mobileW * 15) / 100,
              resizeMode: 'contain',
              marginTop: (mobileH * 1) / 100,
            }}
          />
          <Text
            style={{
              color: Colors.themeColor,
              fontSize: (mobileW * 5) / 100,
              fontFamily: Font.FontSemibold,
              textAlign: 'center',
            }}>
            {message}
          </Text>

          <Text
            style={{
              color: Colors.themeColor2,
              fontSize: (mobileW * 3.2) / 100,
              fontFamily: Font.FontSemibold,
              textAlign: 'center',
            }}>
            {content}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {onCancelBtn && (
              <CommonButton
                containerStyle={{
                  marginTop: (mobileH * 1) / 100,
                  width: (mobileW * 28) / 100,
                  height: (mobileH * 4) / 100,
                  backgroundColor: Colors.ColorCancel,
                  borderRadius: (mobileW * 2) / 100,
                }}
                btnTextStyle={{
                  fontSize: (mobileW * 4) / 100,
                }}
                title={onCancelText}
                onPress={onCancelPress}
              />
            )}

            {button && (
              <CommonButton
                containerStyle={{
                  marginTop: (mobileH * 1) / 100,
                  width: (mobileW * 28) / 100,
                  height: (mobileH * 4) / 100,
                  backgroundColor: Colors.themeColor2,
                  marginLeft: (mobileW * 2) / 100,
                  borderRadius: (mobileW * 2) / 100,
                }}
                btnTextStyle={{
                  fontSize: (mobileW * 4) / 100,
                }}
                title={btnText}
                onPress={onPress}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({});
