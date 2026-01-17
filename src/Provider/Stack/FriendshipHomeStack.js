import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import FriendshipHome from '../../Screens/Friendship/FriendshipHome';
import UserDetails from '../../Screens/UserDetails';
import JoinCommunity from '../../Screens/Friendship/JoinCommunity';
import WishingPetParentUserDetails from '../../Screens/WishingPetParentUserDetails';

const Stack = createStackNavigator();

const FriendshipHomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="FriendshipHome" component={FriendshipHome} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
      <Stack.Screen name="JoinCommunity" component={JoinCommunity} />
      <Stack.Screen
        name="WishingPetParentUserDetails"
        component={WishingPetParentUserDetails}
      />
    </Stack.Navigator>
  );
};

export default FriendshipHomeStack;
