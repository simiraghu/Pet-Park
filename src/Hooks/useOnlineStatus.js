import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import {apifuntion} from '../Provider/Apicallingprovider/apiProvider';
import {consolepro} from '../Provider/Messageconsolevalidationprovider/Consoleprovider';
import {config} from '../Provider/configProvider';

import {localStorage} from '../Provider/utilslib/Utils';

const useOnlineStatus = () => {
  const appState = useRef(AppState.currentState);

  const updateOnlineStatus = async isOnline => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      if (!user_array || !user_array.user_id) {
        consolepro.consolelog('No user data found. Skipping status update.');
        return;
      }
      const API_URL =
        config.baseURL +
        'update_status?user_id=' +
        userId +
        '&online_status=' +
        isOnline; //0 - offline, 1- online

      consolepro.consolelog('api url ===> ', API_URL);

      apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog('<<online res', res);
          } else {
            consolepro.consolelog(res);
            if (res?.active_flag == 0) {
              localStorage.clear();
            } else {
              consolepro.consolelog('res', res);
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<ERROR');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground');
        updateOnlineStatus(true); // set online
      } else if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log('App is going to the background');
        updateOnlineStatus(false); // set offline
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // On mount, set online
    updateOnlineStatus(1);

    consolepro.consolelog('Online Status ========>>', useOnlineStatus);
    return () => {
      // On cleanup, set offline
      updateOnlineStatus(0);
      subscription.remove();
    };
  }, []);
};

export {useOnlineStatus};
