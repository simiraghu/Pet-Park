import {createSlice} from '@reduxjs/toolkit';
import {localimag} from '../../Provider/Localimage';

const initialState = {
  storedData: {
    featured: [
      {
        id: 0,
        image: localimag.image_store,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 1,
        image: localimag.image_store_2,
        title: 'The Flex Collective',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 2,
        image: localimag.image_store,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 3,
        image: localimag.image_store_2,
        title: 'The Flex Collective',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 4,
        image: localimag.image_store,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 5,
        image: localimag.image_store_2,
        title: 'The Flex Collective',
        location: 'Paris',
        rating: 5,
        save: false,
      },
    ],
    newStore: [
      {
        id: 0,
        image: localimag.image_store_3,
        title: 'The Dashing Haber',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 1,
        image: localimag.image_store_4,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 2,
        image: localimag.image_store_3,
        title: 'The Dashing Haber',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 3,
        image: localimag.image_store_4,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 4,
        image: localimag.image_store_3,
        title: 'The Dashing Haber',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 5,
        image: localimag.image_store_4,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
    ],
    men: [
      {
        id: 0,
        image: localimag.image_store_4,
        title: 'DSW - Designer Warehouse',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 1,
        image: localimag.image_store,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 2,
        image: localimag.image_store_4,
        title: 'DSW - Designer Warehouse',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 3,
        image: localimag.image_store,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 4,
        image: localimag.image_store_4,
        title: 'DSW - Designer Warehouse',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 5,
        image: localimag.image_store,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
    ],
    women: [
      {
        id: 0,
        image: localimag.image_christmas,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 1,
        image: localimag.icon_purse,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 2,
        image: localimag.image_christmas,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 3,
        image: localimag.icon_purse,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 4,
        image: localimag.image_christmas,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 5,
        image: localimag.icon_purse,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
    ],
    electronics: [
      {
        id: 0,
        image: localimag.image_white_headphone,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 1,
        image: localimag.image__brown_headPhone,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 2,
        image: localimag.image_white_headphone,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 3,
        image: localimag.image__brown_headPhone,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 4,
        image: localimag.image_white_headphone,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 5,
        image: localimag.image__brown_headPhone,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
    ],
    car: [
      {
        id: 0,
        image: localimag.image_redIphone,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 1,
        image: localimag.image_store,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 2,
        image: localimag.image_redIphone,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 3,
        image: localimag.image_store,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 4,
        image: localimag.image_redIphone,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
      {
        id: 5,
        image: localimag.image_store,
        title: 'The Hidden Gem Emporium',
        location: 'Paris',
        rating: 5,
        save: false,
      },
    ],
  },

  storeTabdata: [],
};

const storesSlice = createSlice({
  name: 'storesData',
  initialState,
  reducers: {
    likeDislike: (state, action) => {
      const {arrayName, index} = action.payload;
      if (state.storedData[arrayName] && state.storedData[arrayName][index]) {
        state.storedData[arrayName][index].save =
          !state.storedData[arrayName][index].save;
      }
    },

    storetabData: (state, action) => {
      state.storeTabdata = action.payload;
    },
  },
});

export const {likeDislike, storetabData} = storesSlice.actions;

export default storesSlice.reducer;
