import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import JoinCommunity from '../../Screens/Friendship/JoinCommunity';
import UserDetails from '../../Screens/UserDetails';
import Conversation from '../../Screens/Friendship/Conversation';
import WishingPetParentUserDetails from '../../Screens/WishingPetParentUserDetails';
import ChatScreen from '../../Screens/ChatScreen';

const Stack = createStackNavigator();

const ConversationStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="JoinCommunity" component={JoinCommunity} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
      <Stack.Screen
        name="WishingPetParentUserDetails"
        component={WishingPetParentUserDetails}
      />
    </Stack.Navigator>
  );
};

export default ConversationStack;
