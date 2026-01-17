import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Community from '../../Screens/Friendship/Community';
import JoinCommunity from '../../Screens/Friendship/JoinCommunity';
import UserDetails from '../../Screens/UserDetails';
import WishingPetParentUserDetails from '../../Screens/WishingPetParentUserDetails';

const Stack = createStackNavigator();

const CommunityStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Community" component={Community} />
      <Stack.Screen name="JoinCommunity" component={JoinCommunity} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
      <Stack.Screen
        name="WishingPetParentUserDetails"
        component={WishingPetParentUserDetails}
      />
    </Stack.Navigator>
  );
};

export default CommunityStack;
