import {config} from '../configProvider';
import {Dimensions} from 'react-native';
import {localStorage} from '../localStorageProvider';
import {Lang_chg} from '../Language_provider';
import {consolepro} from '../Messageconsolevalidationprovider/Consoleprovider';
import {
  msgProvider,
  msgText,
  msgTitle,
} from '../Messageconsolevalidationprovider/messageProvider';
import {Colors, Font} from '../Colorsfont';
import {styles} from '../Styles';
import {localimag} from '../Localimage';
import {apifuntion} from '../Apicallingprovider/apiProvider';
import {checkUserDeactivate} from '../configProvider';
import {mediaprovider} from '../Mediaprovider/Mediaprovider';
import Cameragallery from '../Mediaprovider/Cameragallery';
const mobileH = Math.round(Dimensions.get('window').height);
const mobileW = Math.round(Dimensions.get('window').width);

export {
  config,
  localimag,
  Colors,
  Font,
  mobileH,
  mobileW,
  localStorage,
  Lang_chg,
  consolepro,
  styles,
  msgProvider,
  msgText,
  msgTitle,
  apifuntion,
  mediaprovider,
  Cameragallery,
  checkUserDeactivate,
};
