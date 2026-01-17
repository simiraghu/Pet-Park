import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors, Font} from '../Provider/Colorsfont';
import {localimag} from '../Provider/Localimage';
import {
  config,
  consolepro,
  Lang_chg,
  mobileW,
  localStorage,
  msgProvider,
} from '../Provider/utilslib/Utils';
import {useTranslation} from 'react-i18next';
import OneSignal from 'react-native-onesignal';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const SettingScreen = ({navigation}) => {
  const [isNotifications, setIsNotifications] = useState(false);
  const {t} = useTranslation();

  useFocusEffect(
    useCallback(() => {
      const fetchNotificationPreference = async () => {
        const savedPref = await localStorage.getItemString('push_notification');

        consolepro.consolelog('saved ======>>', savedPref);
        if (savedPref != null) {
          const enabled = savedPref == 'true'; // Compare directly
          consolepro.consolelog('Enabled ======>>', enabled);
          setIsNotifications(enabled);
          OneSignal.disablePush(!enabled);
        }
      };
      fetchNotificationPreference();
    }, []),
  );

  consolepro.consolelog('isNotifications =========>>', isNotifications);

  const toggleNotification = value => {
    consolepro.consolelog('values ======>>', value);
    setIsNotifications(value);

    // Disable push notifications when toggled off
    OneSignal.disablePush(!value);

    // Save the new value (not the old state)
    localStorage.setItemString('push_notification', String(value));

    consolepro.consolelog(
      `Push Notifications ${value ? 'Enabled' : 'Disabled'}`,
    );

    msgProvider.toast(
      value ? t('enabled_notifications_txt') : t('disabled_notifications_txt'),
      'bottom',
    );
    return false;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        {/* --------back ------ */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={{
            alignSelf: 'flex-start',
          }}>
          <Image
            source={localimag.icon_back_arrow}
            style={[
              {
                width: (mobileW * 6) / 100,
                height: (mobileW * 6) / 100,
                marginLeft: (mobileW * 5) / 100,
                marginTop: (mobileW * 5) / 100,
                transform: [config.language == 1 ? {scaleX: -1} : {scaleX: 1}],
              },
              {tintColor: Colors.ColorBlack},
            ]}
          />
        </TouchableOpacity>

        {/* -------setting heading ----- */}

        <View
          style={{
            marginHorizontal: (mobileW * 7) / 100,
            marginTop: (mobileW * 4) / 100,
          }}>
          <Text
            style={{
              color: Colors.themeColor2,
              fontFamily: Font.FontSemibold,
              fontSize: (mobileW * 6.5) / 100,
            }}>
            {t('setting_txt')}
          </Text>
        </View>

        {/* ------ list -------- */}
        <View style={{marginTop: (mobileW * 5) / 100}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AccountScreen')}
            style={{
              width: mobileW,
              borderBottomWidth: (mobileW * 0.2) / 100,
              borderBottomColor: Colors.themeColor2,
              paddingVertical: (mobileW * 3) / 100,
              borderTopWidth: (mobileW * 0.2) / 100,
              borderTopColor: Colors.themeColor2,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: (mobileW * 5) / 100,
              }}>
              <View>
                <Image
                  source={localimag.icon_setting_profile}
                  style={{
                    width: (mobileW * 5) / 100,
                    height: (mobileW * 5) / 100,
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: (mobileW * 80) / 100,
                  marginLeft: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {t('account_txt')}
                </Text>

                <Image
                  source={localimag.icon_arrow_forward}
                  style={{
                    width: (mobileW * 3) / 100,
                    height: (mobileW * 3) / 100,
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            // onPress={() => setIsNotifications(!isNotifications)}
            style={{
              width: mobileW,
              borderBottomWidth: (mobileW * 0.2) / 100,
              borderBottomColor: Colors.themeColor2,
              paddingVertical: (mobileW * 2) / 100,
              borderTopWidth: (mobileW * 0.2) / 100,
              borderTopColor: Colors.themeColor2,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: (mobileW * 5) / 100,
              }}>
              <View>
                <Image
                  source={localimag.icon_setting_notifications}
                  style={{
                    width: (mobileW * 5) / 100,
                    height: (mobileW * 5) / 100,
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: (mobileW * 80) / 100,
                  marginLeft: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {t('notifications_txt')}
                </Text>

                {/* <Image
                source={localimag.icon_notification_on}
                style={{
                  width: (mobileW * 8) / 100,
                  height: (mobileW * 8) / 100,
                }}
                resizeMode="contain"
              /> */}
                <Switch
                  trackColor={{false: '#767577', true: Colors.ColorSearchBar}}
                  thumbColor={Colors.themeColor}
                  ios_backgroundColor="#767577"
                  style={{
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      {scaleY: 0.8},
                    ], // Increase width, decrease height
                  }}
                  onValueChange={toggleNotification}
                  value={isNotifications}
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('BlockedAccounts')}
            style={{
              width: mobileW,
              borderBottomWidth: (mobileW * 0.2) / 100,
              borderBottomColor: Colors.themeColor2,
              paddingVertical: (mobileW * 3) / 100,
              borderTopWidth: (mobileW * 0.2) / 100,
              borderTopColor: Colors.themeColor2,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: (mobileW * 5) / 100,
              }}>
              <View>
                <Image
                  source={localimag.icon_setting_block}
                  style={{
                    width: (mobileW * 5) / 100,
                    height: (mobileW * 5) / 100,
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: (mobileW * 80) / 100,
                  marginLeft: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {t('blocked_account_txt')}
                </Text>

                <Image
                  source={localimag.icon_arrow_forward}
                  style={{
                    width: (mobileW * 3) / 100,
                    height: (mobileW * 3) / 100,
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({});
