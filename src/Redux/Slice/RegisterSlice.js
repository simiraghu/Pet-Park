import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  player_id_me1: '123456',
  userData: null,
  password: null,
  onBoardStatus: true,
  language: 0,
  langSet: 0,
  guestLogin: false,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    saveUserData: (state, action) => {
      state.userData = action.payload;
    },
    savePassword: (state, action) => {
      state.password = action.payload;
    },

    changeOnBoardStatus: (state, action) => {
      state.onBoardStatus = false;
    },

    setLanguage: (state, action) => {
      state.language = action.payload;
    },

    setGuestLogin: (state, action) => {
      state.guestLogin = action.payload;
    },

    setLanguageset: (state, action) => {
      state.langSet = 1;
    },

    Logout: (state, action) => {
      state.userData = null;
      state.password = null;
      state.language = 0;
      state.langSet = 0;
    },
  },
});

export const {
  saveUserData,
  savePassword,
  changeOnBoardStatus,
  setLanguage,
  setGuestLogin,
  Logout,
  setLanguageset,
} = registerSlice.actions;

export default registerSlice.reducer;
