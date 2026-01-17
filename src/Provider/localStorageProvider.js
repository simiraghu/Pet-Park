import AsyncStorage from '@react-native-async-storage/async-storage';

export const localStorage = {
  async setItemString(key, value) {
    console.log('setItemString key', key, value);
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('Error13', error);
    }
  },

  async getItemString(key) {
    console.log('getItemObject key', key);
    var item = await AsyncStorage.getItem(key);
    console.log(item, typeof item, '<<<<<get item key value');
    return item;
  },

  async setItemObject(key, item) {
    console.log('setItemObject key', key);
    console.log('setItemObject item', item);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.log('Error12', error);
    }
  },

  async getItemObject(key) {
    console.log('getItemObject key', key);
    var item = await AsyncStorage.getItem(key);
    return JSON.parse(item);
  },

  async removeItem(key) {
    console.log('removed key', key);
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log('Error ' + error.value);
    }
  },

  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log('Error ' + error.value);
    }
  },
};
