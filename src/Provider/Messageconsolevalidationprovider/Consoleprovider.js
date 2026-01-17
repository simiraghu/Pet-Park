import React from 'react';
class Consoleprovider {
  //----------------- message buttons
  consolelog(key, message) {
    return __DEV__ ? console.log(key, message) : null
  }

}

export const consolepro = new Consoleprovider();
