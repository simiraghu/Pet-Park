import React from 'react';
import OneSignal from 'react-native-onesignal';
import {config} from './configProvider';
import {localStorage} from './localStorageProvider';

global.propsnavigation;
class Pushnotificationredirection {
  //----------------- message buttons
  constructor() {}
  redirectfun(props) {
    propsnavigation = props;
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log('notification', notification);
      this.onOpened(notification);
    });
  }

  onOpened = async openResult => {
    let navigation = propsnavigation.navigation;

    console.log('openResult: ', openResult.notification.additionalData);

    var datajson = openResult.notification.additionalData.action_json;
    var action = datajson.action;
    var userdata = await localStorage.getItemObject('user_array');

    console.log('userdata:', userdata);
    console.log(
      'Action:',
      `"${action}"`,
      '| is Profile Like:',
      action.trim() === 'Profile Like',
    );

    if (userdata != null) {
      console.log('navigation run');

      if (action.trim() === 'Post Comment') {
        navigation.navigate('Community');
        return false;
      }

      if (action.trim() === 'Profile Like') {
        navigation.navigate('Match');
        return false;
      }

      if (action.trim() === 'Post Like') {
        navigation.navigate('Community');
        return false;
      }

      if (action.trim() === 'Match') {
        navigation.navigate('Conversation');
        return false;
      }
    } else {
      navigation.navigate('WelcomeScreen');
    }
  };
}

export const pushnotification = new Pushnotificationredirection();
