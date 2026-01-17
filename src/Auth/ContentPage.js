import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {localimag} from '../Provider/Localimage';
import {
  Colors,
  config,
  consolepro,
  Font,
  Lang_chg,
  mobileH,
  mobileW,
} from '../Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native-safe-area-context';

const Contentpage = () => {
  const {goBack, navigate} = useNavigation();
  const {params} = useRoute();
  const pagename = params?.pagename;
  const contentpage = params?.contentpage;
  const user_type = params?.user_type;

  const content_data = params?.content_data;
  consolepro.consolelog(content_data, '<<Content DAta');

  // const pagename = 'Privacy Policy';
  // const contentpage = 1;
  // const user_type = params?.user_type;

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.whiteColor,
        }}>
        <View
          style={{
            width: (mobileW * 90) / 100,
            alignSelf: 'center',
            marginTop: (mobileH * 2) / 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => goBack()}
            style={{
              alignSelf: 'flex-start',
            }}>
            <Image
              source={localimag.icon_back_arrow}
              style={[
                {width: (mobileW * 6) / 100, height: (mobileW * 6) / 100},
                {
                  tintColor: Colors.ColorBlack,
                  transform: [
                    config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                  ],
                },
              ]}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: (mobileH * 2) / 100,
            width: (mobileW * 90) / 100,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              color: Colors.themeColor,
              fontSize: (mobileW * 6.5) / 100,
              fontFamily: Font.FontBold,
            }}>
            {pagename}
          </Text>
        </View>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          contentContainerStyle={{
            paddingBottom: (mobileH * 7) / 100,
            paddingHorizontal: (mobileW * 3) / 100,
            // backgroundColor: 'red'
          }}
          keyboardShouldPersistTaps="handled">
          {/* <View
          style={{
            width: (mobileW * 90) / 100,
            marginTop: (mobileH * 1.5) / 100,
            alignSelf: 'center',
            flex: 1
          }}> */}
          {/* <Text
            style={{
              fontFamily: Font.FontMedium,
              fontSize: (mobileW * 4) / 100,
              color: Colors.themeColor2,
            }}>
            {'1. Introduction'}
          </Text>

          {contentpage == 2 ? (
            <Text
              style={{
                marginTop: (mobileH * 1.5) / 100,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
                color: Colors.themeColor2,
              }}>
              {
                'Welcome to PetPark! By downloading, accessing, or using the PetPark app, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with these terms, please do not use our services.'
              }
            </Text>
          ) : (
            <Text
              style={{
                marginTop: (mobileH * 1.5) / 100,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
                color: Colors.themeColor2,
                width: (mobileW * 85) / 100,
              }}>
              {
                'Welcome to PetPark! We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our app and services.'
              }
            </Text>
          )}

          {contentpage == 2 ? (
            <Text
              style={{
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
                color: Colors.themeColor2,
                marginTop: (mobileH * 2) / 100,
              }}>
              {'2. User Account'}
            </Text>
          ) : (
            <Text
              style={{
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
                color: Colors.themeColor2,
                marginTop: (mobileH * 2) / 100,
              }}>
              {'2. Information We Collect'}
            </Text>
          )}

          {contentpage == 2 ? (
            <Text
              style={{
                width: (mobileW * 80) / 100,
                marginTop: (mobileH * 1.5) / 100,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
                color: Colors.themeColor2,
              }}>
              {
                'Eligibility: You must be at least 18 years old to create an account and use the PetPark app.'
              }
            </Text>
          ) : (
            <Text
              style={{
                width: (mobileW * 85) / 100,
                marginTop: (mobileH * 1.5) / 100,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
                color: Colors.themeColor2,
              }}>
              {
                'Personal Information: When you create an account or use our services, we may collect personal information such as your name, email address, phone number, payment information, and vehicle details.'
              }
            </Text>
          )}

          {contentpage == 2 ? (
            <Text
              style={{
                width: (mobileW * 90) / 100,
                marginTop: (mobileH * 1.5) / 100,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
                color: Colors.themeColor2,
              }}>
              {
                'Account Information: You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. Please notify us immediately of any unauthorized use.'
              }
            </Text>
          ) : (
            <Text
              style={{
                width: (mobileW * 90) / 100,
                marginTop: (mobileH * 1.5) / 100,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
                color: Colors.themeColor2,
              }}>
              {'Location Data:'}
            </Text>
          )}

          {contentpage == 2 ? (
            <Text
              style={{
                width: (mobileW * 90) / 100,
                marginTop: (mobileH * 1.5) / 100,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
                color: Colors.themeColor2,
              }}>
              {
                "Termination: We reserve the right to \nsuspend or terminate your account at any time if you violate these Terms and Conditions. #### **3. Use of Services** - **Service Availability:** PetPark provides a platform to find, reserve, and pay for parking spots. Availability of parking spaces may vary, and we do not guarantee that a spot will always be available. - **License:** We grant you a limited, non-exclusive, non-transferable, and revocable license to use the PetPark app for its intended purpose. - **Prohibited Conduct:** You agree not to misuse the app, engage in fraudulent activities, interfere with the app's operation, or violate any laws while using our services. #### **4. Payments and Fees** - **Payment Processing:** All payments for parking reservations are processed securely through our payment partners. You agree to pay all fees associated with your use of the services. - **Refunds:** Refund policies may vary depending on the specific parking provider. Please review the terms at the time of booking. PetPark is not responsible for any refunds or disputes between you and the parking provider. #### **5. Limitation of Liability** - **No Warranty:** The PetPark app is provided 'as is' without warranties of any kind, either express or implied. We do not guarantee that the app will be error-free or uninterrupted. - **Limitation:** To the maximum extent permitted by law, PetPark shall not be liable for any indirect, incidental, or consequential damages arising out of or related to your use of the app. #### **6. User Responsibilities** - **Parking Regulations:** You are responsible for complying with all parking regulations, including time limits, fees, and restrictions. PetPark is not responsible for any fines, penalties, or towing that may result from your use of the services. - **Accurate Information:** You agree to provide accurate and up-to-date information when using the PetPark app, including vehicle details and payment information. #### **7. Intellectual Property** - **Ownership:** All content, trademarks, and intellectual property on the PetPark app are owned by us or our licensors. You may not use any content from the app without our express written permission. - **User Content:** By submitting any content (e.g., reviews, feedback) to the PetPark app, you grant us a non-exclusive, royalty-free license to use, modify, and distribute that content in connection with our services. #### **8. Changes to Terms** We may update these Terms and Conditions from time to time. When we do, we will notify you by updating the 'Effective Date' at the top of this document. Your continued use of the app after changes are made constitutes your acceptance of the revised terms. #### **9. Governing Law** These Terms and Conditions are governed by and construed in accordance with the laws of [Insert Jurisdiction], without regard to its conflict of laws principles. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in [Insert Jurisdiction]. #### **10. Contact Information** If you have any questions or concerns about these Terms and Conditions, please contact us at [Insert Contact Information]. --- This document should be customized to your specific needs and legal requirements. Consulting a legal professional is recommended to ensure that the Terms and Conditions are comprehensive and compliant with applicable laws."
              }
            </Text>
          ) : (
            <Text
              style={{
                width: (mobileW * 90) / 100,
                marginTop: (mobileH * 1.5) / 100,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
                color: Colors.themeColor2,
              }}>
              {
                'We collect your location data to help you find nearby parking spots and provide location-based services.'
              }
            </Text>
          )}

          {contentpage == 1 && (
            <Text
              style={{
                width: (mobileW * 90) / 100,
                marginTop: (mobileH * 1.5) / 100,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
                color: Colors.themeColor2,
              }}>
              {'Usage Data:'}
            </Text>
          )}

          {contentpage == 1 && (
            <Text
              style={{
                width: (mobileW * 90) / 100,
                marginTop: (mobileH * 1.5) / 100,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 4) / 100,
                color: Colors.themeColor2,
              }}>
              {
                'We gather information on how you use the app, including your interactions, preferences, and app settings. - **Device Information:** We may collect data about your device, such as IP address, operating system, and app version, to ensure the app functions properly. #### **3. How We Use Your Information** - **To Provide Services:** We use your information to offer, maintain, and improve our parking services, including finding and reserving parking spots. - **To Process Payments:** Your payment information is used to process transactions securely. - **To Communicate with You:** We may send you notifications, updates, and promotional offers related to our services. - **To Enhance User Experience:** We analyze usage data to improve app performance and personalize your experience. #### **4. Sharing Your Information** We do not sell your personal information to third parties. However, we may share your data with: - **Service Providers:** Trusted third-party vendors who help us operate the app, process payments, and perform related services. - **Legal Requirements:** Authorities if required by law, or to protect our rights, privacy, safety, or property. #### **5. Data Security** We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or misuse. However, no online service can be entirely secure, so we cannot guarantee absolute security. #### **6. Your Choices** - **Account Information:** You can update or delete your account information at any time through the app settings. - **Location Sharing:** You can control location data sharing via your device’s settings, but disabling location services may limit app functionality. - **Communication Preferences:** Opt out of promotional communications by following the instructions in the messages you receive. #### **7. Children’s Privacy** PetPark is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that we have inadvertently collected such information, we will take steps to delete it. #### **8. Changes to This Privacy Policy** We may update this Privacy Policy'
              }
            </Text>
          )} */}
          {content_data != 'NA' ? (
            <WebView
              source={{uri: content_data}}
              style={{
                flex: 1,
                height: (mobileH * 85) / 100,
                paddingBottom: (mobileH * 2) / 100,
                fontSize: 19,
                color: Colors.ColorBlack,
                lineHeight: 24,
                letterSpacing: 0.8,
                paddingHorizontal: (mobileW * 4) / 100,
                // width: mobileW* 95 /100
              }}
            />
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                height: (mobileH * 60) / 100,
              }}></View>
          )}
          {/* </View> */}
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Contentpage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.themeColor2,
  },
});
