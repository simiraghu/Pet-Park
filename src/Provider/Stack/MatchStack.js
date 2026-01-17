import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import JoinCommunity from '../../Screens/Friendship/JoinCommunity';
import UserDetails from '../../Screens/UserDetails';
import Match from '../../Screens/Friendship/Match';
import WishingPetParentUserDetails from '../../Screens/WishingPetParentUserDetails';

const Stack = createStackNavigator();

const MatchStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Match" component={Match} />
      <Stack.Screen name="JoinCommunity" component={JoinCommunity} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
      <Stack.Screen
        name="WishingPetParentUserDetails"
        component={WishingPetParentUserDetails}
      />
    </Stack.Navigator>
  );
};

export default MatchStack;
