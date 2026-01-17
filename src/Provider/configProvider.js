import {Platform} from 'react-native';
// import i18next from '../Services/i18next';
// import { useTranslation } from 'react-i18next';
// import {
//   msgProvider,
//   localStorage,
//   msgText,
//   msgTitle,
//   apifuntion,
//   consolepro,
// } from './utilslib/Utils';

global.player_id_me1 = '123456';
//--------------------------- Config Provider Start -----------------------
export const config = {
  baseURL: 'https://pomsse.com/pomsse/server/webservice/',
  img_url: 'https://pomsse.com/pomsse/server/webservice/images/',
  login_type: 'app',
  onesignalappid: '9522d039-3026-40e7-a362-21f5e9cb3f38',
  oneSignalAuthorization:
    'os_v2_app_surnaojqezaopi3ceh26tsz7hbvsiok7ajdekvusvp2jr4odb43nizk4rlr76fyhqv4ruchduhzrvetcids3rsrpjskhpfsp36eolyq',
  firebaseServerKey:
    'AAAAaNh4peI:APA91bFkc-R-88j9-0czRpw4bQxz6luJTIxLP2XAJMiNaQKiRe5ZMGT_IKhxd-nsdcJresdPrU7xQXduO89CT7wfuLO_Og4W4iwOy03XnF4bqO5XLUOixF92iyy-4Q-2B4S8igkUHUPz',
  mapkey: 'AIzaSyDj_pyaNczgbO3MB0ZIn0d-T_vzmqCVCKI',
  maplanguage: 'en',
  // useTranslation:useTranslation,
  // i18next:i18next,
  language: 0, // 0 - english, 1 -> arabic, 2 -> chinese
  currency: ['₹'],
  player_id: '123456',
  player_id_me: '123456',
  device_type: Platform.OS,
  loading_type: false,
  latitude: 23.1815,
  longitude: 79.9864,
  country_code: '+33',
  demoemail: 'demo@mailinator.com',
  password: '123456',
  //namevalidation: /^[^-\s][a-zA-Z0-9_\s-]+$/,
  Namevalidation: /^[A-Za-z]+$/,
  emailvalidation:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  mobilevalidation: /^[0-9\_]+$/,
  amountvalidation: /^[0-9\_.]+$/,
  passwordvalidation: /^\S{3,}$/,
  messagevalidation: /^[^-\s][a-zA-Z0-9_\s- ,]+$/,
  url_validation: new RegExp('^(http|https)://', 'i'),
  textalign: 'right',
  app_status: 1, //---0:prototype,1:dynamic
  appname: 'Pomsse',
  // headersapi: {
  //   Authorization:
  //     'Basic ' +
  //     base64.encode(base64.encode('mario') + ':' + base64.encode('carbonell')),
  //   Accept: 'application/json',
  //   'Content-Type': 'multipart/form-data',
  //   'Cache-Control': 'no-cache,no-store,must-revalidate',
  //   Pragma: 'no-cache',
  //   Expires: 0,
  // },

  user_type: 1,
  razorpay_key_id: 'rzp_test_sYjlg6zHsGMY4V',
  razorpay_secret_key: 'CFw8QJfjBxiPb0muMz9BsN64',
  show_overall_chat_count: 0,
};
//--------------------------- Config Provider End -----------------------
