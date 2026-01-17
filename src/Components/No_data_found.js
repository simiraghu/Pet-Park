import React from 'react';
import {View, Image} from 'react-native';
import {localimag} from '../Provider/Localimage';
export const Nodata_foundimage = props => {
  return (
    <View
      style={{
        alignContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 20,
      }}>
      <Image
        source={localimag.icon_no_data_found}
        style={{width: 150, height: 150, alignSelf: 'center'}}
      />
    </View>
  );
};
