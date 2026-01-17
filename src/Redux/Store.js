import {combineReducers, configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
import thunk from 'redux-thunk';
import HomeSlice from './Slice/HomeSlice';
import StoreSlice from './Slice/StoreSlice';
import registerSlice from './Slice/RegisterSlice';

const rootReducer = combineReducers({
  home: HomeSlice,
  stores: StoreSlice,
  register: registerSlice,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
