import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider, AppConsumer } from './src/Provider/context/AppProvider';
import Stacknav from './src/Provider/Routenavigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/Redux/Store';
import { LogBox, AppState } from 'react-native';
import { serverTimestamp, updateDoc } from 'firebase/firestore';
import { fireStoreDB } from './src/Config/firebaseConfig';
import { useOnlineStatus } from './src/Hooks/useOnlineStatus';
import NetworkProvider from './src/Provider/context/NetworkProvider';
import CommunityPostScreen from './src/Screens/CommunityPostScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
LogBox.ignoreLogs([
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
]);
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

export default function App() {
  useOnlineStatus();

  const linking = {
    prefixes: ['pomsse://'], //prefixes can be anything depend on what you have wrote in intent filter

    config: {
      initialRouteName: 'FriendshipHome', //Define the initial page for redirection.

      screens: {
        JoinCommunity: {
          path: 'view_community/:community_id', //Define the URL path. The :id parameter is optional and should be used only if required on this page.
        },
        CommunityPostScreen: {
          path: 'get_post_details/:community_post_id',
        },
      },
    },
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer linking={linking}>
            <NetworkProvider>
              <AppProvider {...this.props}>
                <AppConsumer>
                  {funcs => {
                    global.props = { ...funcs };
                    return <Stacknav {...funcs} />;
                  }}
                </AppConsumer>
              </AppProvider>
            </NetworkProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
