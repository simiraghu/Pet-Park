import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Keyboard, LogBox, Platform, Text} from 'react-native';
import {Colors, Font} from './Colorsfont';
import {
  apifuntion,
  config,
  consolepro,
  localimag,
  mobileH,
  mobileW,
  localStorage,
} from './utilslib/Utils';

// Piyush -------------------------------

import FriendshipHome from '../Screens/Friendship/FriendshipHome';
import Match from '../Screens/Friendship/Match';
import Community from '../Screens/Friendship/Community';
import Account from '../Screens/Friendship/Account';
import Conversation from '../Screens/Friendship/Conversation';
import Allcommunity from '../Screens/Friendship/Allcommunity';

import JoinCommunity from '../Screens/Friendship/JoinCommunity';
import Interest from '../Screens/Friendship/Interest';
import FilterModal from '../Components/FilterModal';
import Notification from '../Auth/Notification';
import NewpetHome from '../Screens/NewpetHome';

import NewPetNotification from '../Auth/NewPetNotification';
import NewpetProfile from '../Screens/NewpetProfile';

// Simi ------------------------------------

import Splash from '../Screens/Splash';
import WelcomScreen from '../Screens/WelcomScreen';
import EmailLogin from '../Auth/EmailLogin';
import MobileLogin from '../Auth/MobileLogin';
import OtpVerication from '../Auth/OtpVerication';
import HomeScreen from '../Screens/HomeScreen';
import AddPetDetails from '../Screens/AddPetDetails';
import AddUserDetails from '../Screens/AddUserDetails';
import AllowLocation from '../Screens/AllowLocation';
import AllowNotification from '../Screens/AllowNotification';
import KnowYourPet from '../Screens/KnowYourPet';
import PlanAPet from '../Screens/PlanAPet';
import AboutPetHealth from '../Screens/AboutPetHealth';
import UseCurrentLocation from '../Screens/UseCurrentLocation';
import CreateAccount from '../Auth/CreateAccount';
import Forgotpassword from '../Auth/ForgotPassword';
import ForgotOtpVerification from '../Auth/ForogotOtpVerification';
import Resetpassword from '../Auth/ResetPassword';
import UserDetails from '../Screens/UserDetails';
import UserMatch from '../Screens/UserMatch';
import GetPremium from '../Screens/GetPremium';
import ConversationScreen from '../Screens/ConversationScreen';
import ChatScreen from '../Screens/ChatScreen';
import ChangeLanguage from '../Screens/ChangeLanguage';
import SettingScreen from '../Screens/SettingScreen';
import AccountScreen from '../Screens/AccountScreen';
import BlockedAccount from '../Screens/BlockedAccount';
import PersonalInformation from '../Screens/PersonalInformation';
import DeleteAccountScreen from '../Screens/DeleteAccountScreen';
import FavouriteScreen from '../Screens/FavouriteScreen';
import ContactUs from '../Auth/ContactUs';
import Contentpage from '../Auth/ContentPage';
import UserProfile from '../Screens/UserProfile';
import UserProfileEdit from '../Screens/UserProfileEdit';
import PlanAPetEdit from '../Screens/PlanAPetEdit';
import ChangePassword from '../Auth/ChangePassword';
import FandQ from '../Screens/FandQ';
import FandQDetails from '../Screens/FandQdetails';
import DeleteAccount from '../Auth/DeleteAccount';
import CreateStory from '../Screens/CreateStory';
import ViewStory from '../Screens/ViewStory';
import TellUsPetNature from '../Screens/TellUsPetNature';
import UpdateProfileNew from '../Screens/Friendship/UpdateProfileNew';
import MatchChat from '../Screens/MatchChat';
import WithoutPetProfile from '../Screens/WithoutPetProfile';
import UserDetailsWithMessage from '../Screens/UserDetailsWithMessage';
import CreateCommunityScreen from '../Screens/CreateCommunityScreen';
import ChangeCountry from '../Screens/ChangeCountry';
import WishingPetParentUserDetails from '../Screens/WishingPetParentUserDetails';
import GetStartedOtp from '../Screens/GetStartedOtp';
import Subscription from '../Screens/Subscription';
import ViewSubscriptionPlan from '../Screens/ViewSubscriptionPlan';
import PaymentMethod from '../Screens/PaymentMethod';
import {useTranslation} from 'react-i18next';

import VideoRecorderScreen from '../Screens/VideoRecordingScreen';
import VideoPlayer from '../Screens/VideoPreview';
import EditCommunityScreen from '../Screens/EditCommunityScreen';
import PostEdit from '../Screens/PostEdit';
import SubscriptionHistory from '../Screens/SubscriptionHistory';
import ViewAllFollowedCommunities from '../Screens/ViewAllCommunities';
import LocationAccess from '../Screens/LocationAccess';
import IndentityProof from '../Screens/IndentityProof';
import FriendshipHomeStack from './Stack/FriendshipHomeStack';
import CommunityStack from './Stack/CommunityStack';
import MatchStack from './Stack/MatchStack';
import ConversationStack from './Stack/ConversationStack';
import AccountStack from './Stack/AccountStack';
import {
  getFocusedRouteNameFromRoute,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import UserCardProfileWithPet from '../Screens/UserCardProfileWithPet';
import CommunityPostScreen from '../Screens/CommunityPostScreen';
import {View} from 'react-native-animatable';
import All_Category from '../Screens/All_Category';
import {collection, onSnapshot, query, where} from 'firebase/firestore';
import {fireStoreDB} from '../Config/firebaseConfig';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyTabs() {
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [showTabBar, setShowTabBar] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const unsubscribersRef = useRef([]); // To clear old listeners

  const getChatDocumentId = (user1, user2) => {
    const sortedIds = [user1, user2].sort();
    const chatId = sortedIds.join('_');
    return chatId;
  };

  const listenToOverallUnreadCount = async setOverallUnread => {
    try {
      const user_array = await localStorage.getItemObject('user_array');
      const currentUserId = user_array?.user_id;

      // ✅ Fetch all chat users first (to know chatIds)
      const API_URL =
        config.baseURL + 'get_all_chat_users?user_id=' + currentUserId;
      await apifuntion
        .getApi(API_URL, 1)
        .then(res => {
          consolepro.consolelog('Footer API Response :', res);
          if (res?.success) {
            const users = res?.user_details || [];

            // ✅ Clear old Firestore listeners
            unsubscribersRef.current.forEach(unsub => unsub());
            unsubscribersRef.current = [];

            let totalUnread = 0; // running count

            users.forEach(user => {
              const chatId = getChatDocumentId(currentUserId, user?.user_id);
              const messagesRef = collection(
                fireStoreDB,
                'chats',
                chatId,
                'messages',
              );

              // ✅ Query for unread messages
              const unreadQuery = query(
                messagesRef,
                where('isRead', '==', false),
              );
              const unsubUnread = onSnapshot(unreadQuery, snapshot => {
                // ✅ Count only messages not sent by current user
                const unreadCount = snapshot.docs.filter(
                  doc => doc.data().senderId !== currentUserId,
                ).length;

                // ✅ Update total unread count across all users
                totalUnread = 0;
                users.forEach(u => {
                  if (u.user_id === user.user_id) {
                    u._unread = unreadCount; // temporary field for tracking
                  }
                  totalUnread += u._unread || 0;
                });

                setOverallUnread(totalUnread);
              });

              unsubscribersRef.current.push(unsubUnread);
            });

            consolepro.consolelog('Over All count===>', unreadCount);
          }
        })
        .catch(error => {
          consolepro.consolelog('Error =======>>', error);
        });
    } catch (error) {
      console.log('Error in listenToOverallUnreadCount:', error);
    }
  };

  // ✅ Cleanup when component unmounts
  useEffect(() => {
    return () => {
      unsubscribersRef.current.forEach(unsub => unsub());
    };
  }, []);

  useEffect(() => {
    listenToOverallUnreadCount(setUnreadCount); // pass state updater
  }, []);

  const {t} = useTranslation();
  const navigation = useNavigation();

  function getActiveRouteName(state) {
    const route = state.routes[state.index];

    if (route.state) {
      return getActiveRouteName(route.state);
    }

    return route.name;
  }

  const inputHeight =
    Platform.OS === 'android'
      ? Platform.Version >= 34
        ? (mobileH * 12) / 100 // Android 14+ (API 34+)
        : (mobileH * 11) / 100 // Older Android
      : (mobileH * 12) / 100; // iOS default

  const marginBottom =
    Platform.OS === 'android' && Platform.Version >= 34
      ? 0
      : (mobileH * 3) / 100;

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const state = navigation.getState();
      const activeRoute = getActiveRouteName(state);
      console.log('Active Route:', activeRoute);
      setShowTabBar(activeRoute !== 'ChatScreen');
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      console.log('84 open keyboard');
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      console.log('84 hide keyboard');
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          switch (route.name) {
            case 'FriendshipHome':
              iconName = localimag.icon_home;
              break;

            case 'Match':
              iconName = localimag.icon_match;
              break;

            case 'Conversation':
              iconName = localimag.icon_chat;
              break;

            case 'Community':
              iconName = localimag.icon_community;
              break;

            case 'Account':
              iconName = localimag.icon_account;
              break;
          }

          return (
            <View>
              <Image
                source={iconName}
                style={[
                  {
                    height: (mobileW * 7) / 100,
                    width: (mobileW * 7) / 100,
                    resizeMode: 'contain',
                    marginTop: (mobileH * 1) / 100,
                  },
                  {tintColor: focused && Colors.themeColor2},
                ]}
              />
              {route.name === 'Conversation' && unreadCount > 0 && (
                <View
                  style={{
                    width: 7,
                    height: 7,
                    backgroundColor: Colors.cancleColor,
                    borderRadius: (mobileW * 50) / 100,
                    position: 'absolute',
                    right: (-mobileW * 0.6) / 100,
                    top: (mobileW * 2) / 100,
                  }}></View>
              )}
            </View>
          );
        },

        tabBarLabel: ({focused, color}) => {
          let title;
          switch (route.name) {
            case 'FriendshipHome':
              title = t('home_txt');
              break;

            case 'Match':
              title = t('adore_you_txt');
              break;

            case 'Conversation':
              title = t('chat_txt');
              break;

            case 'Community':
              title = t('community_txt');
              break;

            case 'Account':
              title = t('account_txt');
              break;
          }

          return (
            <>
              {title != '' && (
                <Text
                  style={{
                    color: focused ? Colors.themeColor2 : Colors.themeColor,
                    fontSize: (mobileW * 2.5) / 100,
                    marginBottom: marginBottom,
                    fontFamily: Font.FontMedium,
                  }}>
                  {title}
                </Text>
              )}
            </>
          );
        },
      })}
      tabBarOptions={{
        style: {
          display: showTabBar ? 'flex' : 'none',
          borderTopLeftRadius: (mobileW * 10) / 100,
          borderTopRightRadius: (mobileW * 10) / 100,
          width: mobileW,
          height: inputHeight,
          borderWidth: 0.5,
          borderBottomWidth: 0,
          paddingHorizontal: (mobileW * 5) / 100,
          position: 'absolute',
          bottom: config.device_type == 'ios' ? (-mobileW * 5) / 100 : 0,
          borderColor: Colors.footerBorderColor,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,

          elevation: 7,
        },
        keyboardHidesTabBar: true,
      }}>
      <Tab.Screen name="FriendshipHome" component={FriendshipHomeStack} />
      <Tab.Screen name="Match" component={MatchStack} />
      <Tab.Screen
        name="Conversation"
        component={ConversationStack}
        options={({route}) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? 'Conversation';

          return {
            tabBarStyle: {
              display: routeName == 'ChatScreen' ? 'none' : 'flex',
            },
          };
        }}
      />
      <Tab.Screen name="Community" component={CommunityStack} />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
}

export default function Routenavigation() {
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    LogBox.ignoreLogs(['Require cycle:']);
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={'Splash'}
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name="FriendshipHome"
        component={MyTabs}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="Allcommunity"
        component={Allcommunity}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="JoinCommunity"
        component={JoinCommunity}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Interest"
        component={Interest}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FilterModal"
        component={FilterModal}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NewpetHome"
        component={NewpetHome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NewPetNotification"
        component={NewPetNotification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NewpetProfile"
        component={NewpetProfile}
        options={{headerShown: false}}
      />

      {/* ---Simi----------------- */}

      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false, gestureEnabled: false}}
      />

      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />

      <Stack.Screen
        name="EmailLogin"
        component={EmailLogin}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="MobileLogin"
        component={MobileLogin}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="OtpVerification"
        component={OtpVerication}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />

      <Stack.Screen
        name="AddPetDetails"
        component={AddPetDetails}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AddUserDetails"
        component={AddUserDetails}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AllowLocation"
        component={AllowLocation}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AllowNotification"
        component={AllowNotification}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="KnowYourPet"
        component={KnowYourPet}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="PlanAPet"
        component={PlanAPet}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AboutPetHealth"
        component={AboutPetHealth}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="UseCurrentLocation"
        component={UseCurrentLocation}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="CreateAccount"
        component={CreateAccount}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={Forgotpassword}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ForgotOtpVerification"
        component={ForgotOtpVerification}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ResetPassword"
        component={Resetpassword}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="UserDetails"
        component={UserDetails}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="UserMatch"
        component={UserMatch}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="GetPremium"
        component={GetPremium}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ConversationScreen"
        component={ConversationScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ChangeLanguage"
        component={ChangeLanguage}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="BlockedAccounts"
        component={BlockedAccount}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="PersonalInformation"
        component={PersonalInformation}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="DeleteAccountScreen"
        component={DeleteAccountScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="FavouriteScreen"
        component={FavouriteScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ContentPage"
        component={Contentpage}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="UserProfileEdit"
        component={UserProfileEdit}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="PlanAPetEdit"
        component={PlanAPetEdit}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="FandQ"
        component={FandQ}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="FandQdetails"
        component={FandQDetails}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="DeleteAccountNew"
        component={DeleteAccount}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="CreateStory"
        component={CreateStory}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ViewStory"
        component={ViewStory}
        options={{headerShown: false}}
      />

      {/* ----------- new --------- */}
      <Stack.Screen
        name="TellUsPetNature"
        component={TellUsPetNature}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="UpdateProfileNew"
        component={UpdateProfileNew}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="MatchChat"
        component={MatchChat}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="WithoutPetProfile"
        component={WithoutPetProfile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="UserDetailsWithMessage"
        component={UserDetailsWithMessage}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="CreateCommunity"
        component={CreateCommunityScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ChangeCountry"
        component={ChangeCountry}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="WishingPetParentUserDetails"
        component={WishingPetParentUserDetails}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="GetStartedOtp"
        component={GetStartedOtp}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Subscription"
        component={Subscription}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ViewSubscriptionPlan"
        component={ViewSubscriptionPlan}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethod}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="VideoRecordingScreen"
        component={VideoRecorderScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="VideoPreview"
        component={VideoPlayer}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="EditCommunity"
        component={EditCommunityScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="PostEdit"
        component={PostEdit}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SubscriptionHistory"
        component={SubscriptionHistory}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ViewAllFollowedCommunities"
        component={ViewAllFollowedCommunities}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="LocationAccess"
        component={LocationAccess}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="IdentityProof"
        component={IndentityProof}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="UserCardProfileWithPet"
        component={UserCardProfileWithPet}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="CommunityPostScreen"
        component={CommunityPostScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AllCategory"
        component={All_Category}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
