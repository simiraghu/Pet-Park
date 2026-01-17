// src/Provider/context/NetworkProvider.js
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {Colors, consolepro, Font, localimag, mobileW} from '../utilslib/Utils';
import {useTranslation} from 'react-i18next';
import {useNavigationState} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function NetworkProvider({children}) {
  const [isConnected, setIsConnected] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  const currentRoute = useNavigationState(
    state => state?.routes[state?.index]?.name,
  );
  consolepro.consolelog(currentRoute, '<<Current Route image');

  // Log current route for debugging
  useEffect(() => {
    console.log('Current Route:', currentRoute);
  }, [currentRoute]);

  const {t} = useTranslation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Optionally delay the banner visibility for the splash screen
    const timer = setTimeout(() => setShowBanner(true), 1000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // Add route names to hide the offline banner
  const hideOfflineBanner = ['Splash'];

  return (
    <>
      {children}
      {showBanner &&
        !isConnected &&
        !hideOfflineBanner.includes(currentRoute) && (
          <View style={styles.banner}>
            <Image
              source={localimag.icon_offline_cloud}
              style={{
                width: (mobileW * 5) / 100,
                height: (mobileW * 5) / 100,
              }}
              tintColor={Colors.whiteColor}
            />
            <Text style={styles.text}>{t('you_are_offline_txt')}</Text>
          </View>
        )}
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 0,
    width: mobileW,
    backgroundColor: '#10090990',
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    color: Colors.whiteColor,
    fontFamily: Font.FontSemibold,
    fontSize: (mobileW * 3.5) / 100,
    marginLeft: (mobileW * 2) / 100,
  },
});
