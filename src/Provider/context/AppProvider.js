import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Font, mediaprovider} from '../utilslib/Utils';
import AppLoader from './AppLoader';
import * as Animatable from 'react-native-animatable';
import NetInfo from '@react-native-community/netinfo';
import {AppContext} from '../context';

export const AppConsumer = AppContext.Consumer;

export function AppProvider(props) {
  const [backonline, setbackonline] = useState(false);
  const [isConnected, setisConnected] = useState(false);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      setisConnected(state.isConnected);
      if (state.isConnected == false) {
        checkconnection();
      }
    });
  });

  const funcs = {
    showLoader: showProgress,
    hideLoader: hideProgress,
  };

  function showProgress() {
    setloading(true);
  }
  function hideProgress() {
    setloading(false);
  }

  function checkconnection() {
    const mytimer = setInterval(() => {
      checkconnection2(mytimer);
    }, 800);
  }

  function checkconnection2(mytimer) {
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
        clearInterval(mytimer);
        setbackonline(true);
      }
    });
  }

  return (
    <AppContext.Provider value={{...funcs}}>
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        <StatusBar
          backgroundColor={Colors.whiteColor}
          hidden={false}
          barStyle={'dark-content'}
          statusbarColor={'dark-content'}
          translucent={false}
          networkActivityIndicatorVisible={true}
        />
        {props.children}
        <AppLoader loading={loading} />

        {/* {!isConnected && (
          <View
            style={{
              position: 'absolute',
              bottom: 5,
              width: '100%',
              backgroundColor: Colors.internetbackcolor,
            }}>
            <Text
              style={{
                textAlign: 'center',
                paddingVertical: 5,
                fontSize: 14,
                color: Colors.internettextcolor,
              }}>
              No Internet connection
            </Text>
          </View>
        )}
        {backonline && (
          <View
            style={{
              position: 'absolute',
              bottom: 5,
              width: '100%',
              backgroundColor: Colors.onlinebackcolor,
            }}>
            <TouchableOpacity>
              <Animatable.Text
                animation="zoomIn"
                duration={3000}
                iterationCount="infinite"
                style={{
                  textAlign: 'center',
                  color: Colors.onlinetextcolor,
                  paddingVertical: 5,
                  fontSize: 14,
                }}>
                Back online
              </Animatable.Text>
            </TouchableOpacity>
          </View>
        )} */}
      </SafeAreaView>
    </AppContext.Provider>
  );
}
