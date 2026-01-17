import {initializeApp, getApp, getApps} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC2g1edmyAM-P5RrtGNz25zBNKFED1WssQ',
  authDomain: 'pomsss.firebaseapp.com',
  projectId: 'pomsss',
  storageBucket: 'pomsss.firebasestorage.app',
  messagingSenderId: '445893500447',
  appId: '1:445893500447:web:6504c5b2e62c2b676aff2a',
  measurementId: 'G-GWV03738YX',
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const fireStoreDB = getFirestore(app);

export {app, fireStoreDB};
