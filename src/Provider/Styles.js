import React, {Component, useState} from 'react';
import {
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import {
  config,
  Lang_chg,
  Font,
  Colors,
  mobileH,
  mobileW,
  localimag,
  Footer,
  consolepro,
  firebaseprovider,
} from './utilslib/Utils';

const styles = StyleSheet.create({
  // --------------------------------
  // // ----------LoginPage----------
  // --------------------------------
  ComomFlexDirection: {
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  LoginiconDensity: {
    width: (mobileW * 4.5) / 100,
    height: (mobileW * 4.5) / 100,
  },
  LoginDensitytxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 5.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  LoginWelcomwtxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 6.3) / 100,
    fontFamily: Font.FontBold,
  },
  Labeltxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.9) / 100,
    fontFamily: Font.FontRegular,
  },
  LoginTxtInputConainer: {
    width: (mobileW * 90) / 100,
    marginTop: (mobileH * 1) / 100,
    height: (mobileH * 7) / 100,
    backgroundColor: Colors.textbackground_color,
    borderRadius: (mobileW * 1) / 100,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.text_color2,
    borderWidth: 0.5,
    alignSelf: 'center',
  },
  input: {
    fontFamily: Font.FontRegular,
    width: (mobileW * 80) / 100,
    fontSize: (mobileW * 4) / 100,
    backgroundColor: Colors.textbackground_color,
    marginLeft: (mobileW * 2) / 100,
    color: Colors.placeholder_color,
  },
  rememberMeImage: {
    width: (mobileW * 3.5) / 100,
    height: (mobileW * 3.5) / 100,
  },
  RemeberForgottxt: {
    color: Colors.yellow_color,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4) / 100,
  },
  justifyContentStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
  },
  ButtonViewLogin: {
    backgroundColor: Colors.whiteColor,
    height: (mobileH * 6.5) / 100,
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (mobileH * 20) / 100,
  },
  ButtonViewTxtLogin: {
    color: Colors.black_color,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 4) / 100,
  },
  lineForOr: {
    height: (mobileW * 0.4) / 100,
    backgroundColor: Colors.placeholder_color,
    width: (mobileW * 34) / 100,
  },
  orTxt: {
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4.7) / 100,
    color: Colors.text_color,
  },
  socialButtonView: {
    height: (mobileH * 6.5) / 100,
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    borderColor: Colors.placeholder_color,
    borderWidth: (mobileW * 0.3) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (mobileH * 1) / 100,
  },
  icon1s: {
    width: (mobileW * 5) / 100,
    height: (mobileW * 5) / 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  notRegisteredYetView: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: (mobileH * 2) / 100,
    marginBottom: (mobileH * 4) / 100,
    justifyContent: 'center',
  },
  notRegisteredYettxt: {
    color: Colors.res_time_color,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4) / 100,
  },
  signUpHeretxt: {
    color: Colors.yellow_color,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 4) / 100,
  },
  signUpHeretxtBottomBorder: {
    width: (mobileW * 22.5) / 100,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: Colors.BorderColor,
    borderWidth: (mobileW * 0.2) / 100,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#ffffff',
  },
  loginUpHeretxtBottomBorder: {
    width: (mobileW * 20) / 100,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: Colors.BorderColor,
    borderWidth: (mobileW * 0.2) / 100,
    marginRight: (mobileW * 0.7) / 100,
  },

  // --------------------------------
  // -----------SignupPage-----------
  // --------------------------------
  LoginiconDensity: {
    width: (mobileW * 4.5) / 100,
    height: (mobileW * 4.5) / 100,
  },
  LoginDensitytxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 5.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  LoginWelcomwtxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 6.3) / 100,
    fontFamily: Font.FontBold,
  },
  Labeltxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.9) / 100,
    fontFamily: Font.FontRegular,
  },
  LoginTxtInputConainer: {
    width: (mobileW * 90) / 100,
    marginTop: (mobileH * 1) / 100,
    height: (mobileH * 7) / 100,
    backgroundColor: Colors.RedButton,
    borderRadius: (mobileW * 1) / 100,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.text_color2,
    borderWidth: 0.5,
    alignSelf: 'center',
  },

  refferalImageSize: {
    width: (mobileW * 3.5) / 100,
    height: (mobileW * 3.5) / 100,
  },
  refferalTxt: {
    color: Colors.yellow_color,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 3.9) / 100,
    marginLeft: (mobileW * 2) / 100,
  },
  PasswordGuidtxtlabel: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.7) / 100,
    fontFamily: Font.FontRegular,
  },
  PasswordGuidtxtView: {
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: (mobileH * 1.5) / 100,
  },
  PasswordGuidtxt: {
    color: Colors.placeholder_color,
    fontFamily: Font.FontRegular,
    fontSize: (mobileW * 3.7) / 100,
    marginLeft: (mobileW * 2) / 100,
  },
  termsAndPrivacytxt: {
    color: Colors.yellow_color,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 3.8) / 100,
  },
  BySigningUptxt: {
    color: Colors.TermsColor,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 3.7) / 100,
  },
  ButtonViewSinup: {
    backgroundColor: Colors.whiteColor,
    height: (mobileH * 6.5) / 100,
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (mobileH * 1) / 100,
  },
  ButtonViewTxtSignup: {
    color: Colors.black_color,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 4) / 100,
  },
  lineForOr: {
    height: (mobileW * 0.4) / 100,
    backgroundColor: Colors.placeholder_color,
    width: (mobileW * 34) / 100,
  },
  orTxt: {
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4.7) / 100,
    color: Colors.text_color,
  },
  socialButtonView: {
    height: (mobileH * 6.5) / 100,
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    borderColor: Colors.placeholder_color,
    borderWidth: (mobileW * 0.3) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (mobileH * 1) / 100,
  },
  icon1s: {
    width: (mobileW * 5) / 100,
    height: (mobileW * 5) / 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  notRegisteredYetView: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: (mobileH * 2) / 100,
    marginBottom: (mobileH * 1.5) / 100,
    justifyContent: 'center',
  },
  notRegisteredYettxt: {
    color: Colors.res_time_color,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4) / 100,
  },
  signUpHeretxt: {
    color: Colors.yellow_color,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 4) / 100,
  },
  signUpHeretxtBottomBorder: {
    width: (mobileW * 22.5) / 100,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: Colors.BorderColor,
    borderWidth: (mobileW * 0.2) / 100,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#ffffff',
  },
  // ---------------------------------

  // ----------------------------------------
  // ------------OTPVarification-------------
  // ----------------------------------------
  BackImageView: {
    width: (mobileW * 9) / 100,
    height: (mobileW * 9) / 100,
    marginLeft: (mobileW * 2) / 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: (mobileW * 4.5) / 100,
  },

  OTPValidationHeadingTxtView: {
    paddingHorizontal: (mobileW * 4) / 100,
    paddingVertical: (mobileW * 2) / 100,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: (mobileH * 2) / 100,
  },
  OTPValidationHeadingTxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 6.3) / 100,
    fontFamily: Font.FontBold,
  },

  OTPValidationTxtView: {
    flexDirection: 'row',
    paddingHorizontal: (mobileW * 4) / 100,
    paddingVertical: (mobileW * 0) / 100,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  OTPValidationTxt: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.7) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
  },
  OtpEmailImage: {
    flexDirection: 'row',
    paddingHorizontal: (mobileW * 4) / 100,
    marginTop: (mobileH * 5) / 100,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ----------------------------------------------
  // // ----------RegisterPhoneNumberPage----------
  // ----------------------------------------------

  densityWhiteImage: {
    width: (mobileW * 4.5) / 100,
    height: (mobileW * 4.5) / 100,
  },
  densityWhiteText: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 5.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  ButtonView: {
    backgroundColor: Colors.whiteColor,
    height: (mobileH * 6.5) / 100,
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (mobileH * 10) / 100,
  },
  ButtonViewTxt: {
    color: Colors.black_color,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 4) / 100,
  },

  // -----------------------------------------
  // --------------ConfirmEmail---------------
  // -----------------------------------------

  yellowDensityImage: {
    width: (mobileW * 5.5) / 100,
    height: (mobileW * 5.5) / 100,
  },
  yellowDensityTxt: {
    color: Colors.yellow_color,
    fontSize: (mobileW * 7) / 100,
    fontFamily: Font.FontSemiBold,
  },
  EmailCoverimage: {
    width: (mobileW * 90) / 100,
    height: (mobileW * 90) / 100,
  },
  confirmEmailtxtView: {
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: (mobileH * 7) / 100,
  },
  confirmEmailtxt: {
    color: Colors.whiteColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 9) / 100,
  },
  dontRecieveEmailtxtView: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: (mobileH * 2) / 100,
    marginBottom: (mobileH * 4) / 100,
  },
  dontRecieveEmailtxt: {
    color: Colors.TermsColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4) / 100,
  },
  sendAgaintxt: {
    color: Colors.yellow_color,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 4) / 100,
  },
  signUpHeretxtBottomBorder: {
    width: (mobileW * 22.5) / 100,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: Colors.BorderColor,
    borderWidth: (mobileW * 0.2) / 100,
  },

  // ----------------------------------------
  // ----------------Trade-------------------
  // ----------------------------------------

  BitcoinImage: {
    height: (mobileH * 4.4) / 100,
    width: (mobileW * 8.8) / 100,
  },
  BTCUSDTtxt: {
    color: Colors.whiteColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4.3) / 100,
  },
  YellowDownArrow: {
    height: (mobileH * 2) / 100,
    width: (mobileW * 4) / 100,
  },
  Perpetualtxt: {
    color: Colors.PnlTextColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 3.3) / 100,
  },
  GreenUpArrow: {
    height: (mobileH * 2) / 100,
    width: (mobileW * 4) / 100,
  },
  BTCUSDTtopAmount: {
    color: Colors.GreenText,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 4.3) / 100,
  },
  BTCUSDTtopPercent: {
    color: Colors.GreenText,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 2.3) / 100,
    textAlign: 'right',
  },
  // ---------------------
  pricetxt: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 2.8) / 100,
    fontFamily: Font.FontMedium,
    textAlign: 'center',
  },
  pricetxt1: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.1) / 100,
    fontFamily: Font.FontMedium,
    textAlign: 'center',
  },

  Tradeactivetabstyle: {
    color: Colors.whiteColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4) / 100,
    paddingVertical: (mobileW * 1) / 100,
    marginTop: (mobileH * 0.5) / 100,
  },
  Tradeinactivetabstyle: {
    color: Colors.PnlTextColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4) / 100,
    paddingVertical: (mobileW * 1) / 100,
    marginTop: (mobileH * 0.5) / 100,
  },
  tabinsideChartview: {
    alignSelf: 'center',
    borderRightWidth: (mobileW * 0.5) / 100,
    borderRightColor: Colors.BorderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabstyle: {
    color: Colors.whiteColor,
    fontFamily: Font.FontRegular,
    fontSize: (mobileW * 3) / 100,
    textAlign: config.textalign,
    alignSelf: 'center',
    paddingVertical: (mobileW * 1.2) / 100,
  },
  DownArrowStyle: {
    height: (mobileH * 1) / 100,
    width: (mobileW * 2) / 100,
    marginLeft: (mobileW * 2) / 100,
  },
  WidepngImage: {
    width: (mobileW * 16) / 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: (mobileH * 0.7) / 100,
    paddingLeft: (mobileW * 3) / 100,
  },
  TradeImage: {
    height:
      config.device_type == 'android'
        ? (mobileH * 50.6) / 100
        : (mobileH * 47.9) / 100,
    width: (mobileW * 100) / 100,
    marginLeft: (mobileW * 2) / 100,
  },
  BuySellButtonViewStyle: {
    marginVertical:
      config.device_type == 'ios' ? (mobileH * 0.8) / 100 : (mobileH * 1) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (mobileW * 84) / 100,
    alignSelf: 'center',
  },

  TextStyle: {
    fontSize: (mobileW * 3.8) / 100,
    fontFamily: Font.FontSemiBold,
    color: Colors.whiteColor,
  },
  SliderText: {
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.whiteColor,
  },
  OverbookTabtxt: {
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontSemiBold,
    marginLeft: (mobileW * 4) / 100,
    color: Colors.PnlTextColor,
  },
  ThreeButtonText: {
    fontSize: (mobileW * 3) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  ThreeButtonView: {
    height: (mobileH * 2.5) / 100,
    width: (mobileW * 9) / 100,
    justifyContent: 'center',
    marginTop: (mobileH * 2) / 100,
    borderWidth: (mobileW * 0.3) / 100,
    marginRight: (mobileW * 2) / 100,
  },
  FlatelistHeaderTxtView: {
    width: (mobileW * 30) / 100,
  },
  FlatelistHeaderTxtView1: {
    width: (mobileW * 26) / 100,
  },
  FlatelistHeaderTxt: {
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontSemiBold,
    color: Colors.PnlTextColor,
  },
  FlatelistTxtView: {
    width: (mobileW * 20) / 100,
  },
  FlatelistTxt: {
    fontSize: (mobileW * 3) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'left',
    paddingVertical:
      config.device_type == 'ios'
        ? (mobileH * 0.5) / 100
        : (mobileH * 0.1) / 100,
  },
  BuySellButtonView: {
    height: (mobileH * 5.5) / 100,
    width: (mobileW * 40) / 100,
    justifyContent: 'center',
  },
  BuySellButtonTxt: {
    fontSize: (mobileW * 4.5) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.whiteColor,
  },

  //   -------ModelTxt-------
  activetabstyle1: {
    color: Colors.whiteColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4) / 100,
    textAlign: config.textalign,
    alignSelf: 'center',
    paddingVertical: (mobileW * 0.8) / 100,
  },
  inactivetabstyle1: {
    color: Colors.PnlTextColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4) / 100,
    textAlign: config.textalign,
    alignSelf: 'center',
    paddingVertical: (mobileW * 0.8) / 100,
  },
  AvailableBalancetxt: {
    fontSize: (mobileW * 4.5) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.whiteColor,
  },
  SizeBoxView: {
    height: (mobileH * 5) / 100,
    width: (mobileW * 28) / 100,
    justifyContent: 'center',
    backgroundColor: Colors.ModelInsideButton,
  },
  SizeFirstboxtxt: {
    fontSize: (mobileW * 3) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.PnlTextColor,
  },
  SizeSecondboxtxt: {
    fontSize: (mobileW * 3.6) / 100,
    fontFamily: Font.FontSemiBold,
    color: Colors.whiteColor,
  },
  USDT20txtSize: {
    fontSize: (mobileW * 3.2) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.whiteColor,
  },

  // -------MarginUsed---------
  MarginUsedContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    width: (mobileW * 90) / 100,
    marginTop: (mobileH * 0.4) / 100,
  },
  MarginUsedContainer1: {
    height: (mobileH * 5) / 100,
    width: (mobileW * 25) / 100,
    justifyContent: 'space-between',
    borderWidth: (mobileW * 0.3) / 100,
    borderColor: Colors.PnlTextColor,
    backgroundColor: Colors.ModelInsideButton,
    flexDirection: 'row',
    alignItems: 'center',
  },
  MarginUsedContainer2: {
    width: (mobileW * 21) / 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: (mobileW * 2) / 100,
  },
  MarginUsedPertxtView: {
    height: (mobileH * 3) / 100,
    paddingHorizontal: (mobileW * 1) / 100,
    justifyContent: 'center',
    borderWidth: (mobileW * 0.3) / 100,
    borderColor: Colors.PnlTextColor,
  },
  MarginUsedPertxt: {
    fontSize: (mobileW * 3) / 100,
    fontFamily: Font.FontRegular,
    color: Colors.whiteColor,
  },
  MarginUsedCounttxt: {
    fontSize: (mobileW * 6) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.whiteColor,
  },

  // ---------Toggle---------
  ToggleViewLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: (mobileW * 9) / 100,
  },
  ToggleViewRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: (mobileW * 9) / 100,
    marginLeft: (mobileW * 11) / 100,
  },
  ToggleTxt: {
    fontSize: (mobileW * 3.2) / 100,
    fontFamily: Font.FontSemiBold,
    color: Colors.whiteColor,
  },
  ProfitlossView: {
    height: (mobileH * 5) / 100,
    width: (mobileW * 28) / 100,
    justifyContent: 'center',
    backgroundColor: Colors.ModelInsideButton,
    marginTop: (mobileH * 0.5) / 100,
  },
  ProfitlossTxt: {
    fontSize: (mobileW * 3) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.PnlTextColor,
  },

  Bottomtxt: {
    fontSize: (mobileW * 3.2) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.PnlTextColor,
    marginLeft: (mobileW * 2) / 100,
  },
  Bottomtxt1: {
    fontSize: (mobileW * 3.2) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.whiteColor,
  },

  listTab: {
    flexDirection: 'row',
    padding: (mobileW * 3.5) / 100,
    alignSelf: 'center',
  },
  btnTab: {
    width: (mobileW * 30) / 100,
  },
  btnTabActive: {
    width: (mobileW * 30) / 100,
  },
  textTab: {
    color: Colors.PnlTextColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4) / 100,
  },
  textTabActive: {
    color: Colors.whiteColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4) / 100,
  },

  // -------------------------------------

  // ------------------------------------------
  // ----------------Position------------------
  // ------------------------------------------
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //  backgroundColor: Colors.HomeBackColor
  },
  Positionstxt: {
    color: Colors.whiteColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 6.3) / 100,
  },
  PositionsYellowSearchIcon: {
    height: (mobileH * 3.3) / 100,
    width: (mobileW * 6.6) / 100,
    marginTop: (mobileH * 1) / 100,
  },
  // ----------------
  TotalPnlBoxView: {
    width: '99.5%',
    alignSelf: 'center',
    borderWidth: (mobileW * 0.5) / 100,
    borderColor: Colors.BorderColor,
    backgroundColor: Colors.CartBackColor,
  },
  TotalPnLtxt: {
    color: Colors.GreyTextColor,
    fontSize: (mobileW * 4.5) / 100,
    fontFamily: Font.FontMedium,
  },
  TotalPnLtxtNumber: {
    color: Colors.GreenText,
    fontSize: (mobileW * 4.5) / 100,
    fontFamily: Font.FontMedium,
    textAlign: 'center',
  },

  // ----------------
  SecondBoxContainer: {
    width: (mobileW * 84) / 100,
    paddingVertical: (mobileH * 1) / 100,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: (mobileH * 1) / 100,
  },

  SizeInContractView: {
    width: (mobileW * 27) / 100,
    // alignItems: 'center',
  },
  SizeInContracttxt: {
    color: Colors.GreyTextColor,
    fontSize: (mobileW * 3.2) / 100,
    fontFamily: Font.FontMedium,
  },
  SizeInContracttxt1: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
  },
  EditModeltxt: {
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.GreyTextColor,
  },
  EditModeltxt1: {
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.whiteColor,
  },
  BuyOrderModelTextstyle: {
    marginLeft: (mobileW * 1) / 100,
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontMedium,
    paddingTop: (mobileH * 2) / 100,
    color: Colors.whiteColor,
    textAlign: 'center',
  },
  ModelButtonContainer: {
    marginVertical: (mobileH * 1) / 100,
    paddingTop: (mobileH * 3) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (mobileW * 74) / 100,
    alignSelf: 'center',
  },
  ModelButtonView: {
    backgroundColor: Colors.ModelColor,
    borderWidth: (mobileW * 0.5) / 100,
    borderColor: Colors.whiteColor,
    height: (mobileH * 5) / 100,
    width: (mobileW * 35) / 100,
    justifyContent: 'center',
  },
  ModelButtontxt: {
    fontSize: (mobileW * 4.5) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.whiteColor,
  },

  LongShorttxtcolor: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 2.7) / 100,
    fontFamily: Font.FontMedium,
    paddingVertical: (mobileH * 0.1) / 100,
    textAlign: 'center',
  },
  BTCUSDTlargetxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 4.4) / 100,
    fontFamily: Font.FontSemiBold,
    paddingTop:
      config.device_type == 'android'
        ? (mobileH * 0.4) / 100
        : (mobileH * 0.7) / 100,
  },

  AddremoveButtonView: {
    borderWidth: (mobileW * 0.5) / 100,
    borderColor: Colors.whiteColor,
    height: (mobileH * 5) / 100,
    width: (mobileW * 42.5) / 100,
    justifyContent: 'center',
  },
  AddremoveButtontxt: {
    fontSize: (mobileW * 4.5) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
  },
  PnlLTPtxt: {
    color: Colors.GreyTextColor,
    fontSize: (mobileW * 2.8) / 100,
    fontFamily: Font.FontMedium,
  },
  PriceUSDTView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: (mobileH * 0.5) / 100,
  },
  ShareView: {
    alignItems: 'center',
    alignSelf: 'center',
    width: (mobileW * 15) / 100,
  },
  ShareImageStyle: {
    height: (mobileH * 3.5) / 100,
    width: (mobileW * 7) / 100,
  },
  ShareTxtStyle: {
    fontSize: (mobileW * 2.7) / 100,
    fontFamily: Font.FontMedium,
    color: Colors.whiteColor,
    marginTop: (mobileH * 2) / 100,
  },
  ButtonView1: {
    backgroundColor: Colors.whiteColor,
    height: (mobileH * 5.4) / 100,
    width: (mobileW * 67) / 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonViewTxt1: {
    color: Colors.black_color,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 3.7) / 100,
  },

  Availablettxt: {
    fontSize: (mobileW * 3) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.GreyTextColor,
  },
  AvailablettxtAmount: {
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.whiteColor,
    marginLeft: (mobileW * 1.5) / 100,
  },

  ButtonView: {
    backgroundColor: Colors.whiteColor,
    height: (mobileH * 6.5) / 100,
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (mobileH * 1) / 100,
  },
  ButtonViewTxt: {
    color: Colors.black_color,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 4) / 100,
  },
  PosijustifyContentStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
  },
  // input: {
  //     fontFamily: Font.FontRegular,
  //     width: mobileW * 78 / 100,
  //     fontSize: mobileW * 4 / 100,
  //     color: Colors.placeholder_color,
  //     alignItems: 'center'
  // },
  PosAmountUSDTtxt: {
    fontSize: (mobileW * 4.5) / 100,
    fontFamily: Font.FontSemiBold,
    color: Colors.whiteColor,
    marginTop: (mobileH * 1) / 100,
  },
  PosViewAfterAmountUSDTtxt: {
    height: (mobileH * 5) / 100,
    width: (mobileW * 90) / 100,
    justifyContent: 'center',
    backgroundColor: Colors.ModelInsideButton,
    marginTop: (mobileH * 1) / 100,
  },

  // -----------------------------------------
  // -----------------Wallet------------------
  // -----------------------------------------

  INRUSDTWallettxtView: {
    height: (mobileH * 5.5) / 100,
    width: (mobileW * 25) / 100,
    justifyContent: 'center',
  },
  INRUSDTWallettxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.3) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
  },

  TotalINRBalancetxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 4.6) / 100,
    fontFamily: Font.FontBold,
    width: (mobileW * 45) / 100,
  },
  TotalINRBalanceNumbertxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.8) / 100,
    fontFamily: Font.FontBold,
  },

  TotalMarginBaltxt: {
    color: Colors.PnlTextColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 3.5) / 100,
    marginTop: (mobileW * 1.4) / 100,
    textAlign: 'center',
  },
  TotalMarginBaltxt1: {
    color: Colors.whiteColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 6) / 100,
    marginTop: (mobileW * 1.4) / 100,
    textAlign: 'center',
  },
  TotalMarginBaltxt2: {
    color: Colors.GreenText,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 3.2) / 100,
    marginTop: (mobileW * 1.4) / 100,
    textAlign: 'center',
  },
  TotalMarginBalanceContainer: {
    marginTop: (mobileH * 2) / 100,
    width: '99.5%',
    alignSelf: 'center',
    borderWidth: (mobileW * 0.5) / 100,
    borderColor: Colors.BorderColor,
    backgroundColor: Colors.CartBackColor,
  },

  DepostWithdrowtxtView: {
    height: (mobileH * 5.5) / 100,
    width: (mobileW * 43) / 100,
    justifyContent: 'center',
    borderWidth: (mobileW * 0.3) / 100,
    borderColor: Colors.whiteColor,
  },
  DepostWithdrowtxt: {
    fontSize: (mobileW * 4.5) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
  },
  MarginRealisedtxt: {
    color: Colors.PnlTextColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 3.5) / 100,
    textAlign: 'center',
  },
  MarginRealisedtxt1: {
    color: Colors.whiteColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4) / 100,
    marginTop: (mobileW * 0.2) / 100,
    textAlign: 'center',
  },
  BuySellButtonnView: {
    height: (mobileH * 5) / 100,
    width: (mobileW * 42.5) / 100,
    borderColor: Colors.white_color,
    borderWidth: (mobileW * 0.3) / 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BuySellButtonntxt: {
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 3.75) / 100,
  },
  radioButtontxt: {
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 3) / 100,
    marginLeft: (mobileW * 2) / 100,
    paddingTop: (mobileH * 0.2) / 100,
  },

  FlatListDeposittxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.6) / 100,
    fontFamily: Font.FontMedium,
    paddingVertical: (mobileH * 0.2) / 100,
  },
  FlatListDateTimetxt: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 3) / 100,
    fontFamily: Font.FontSemiBold,
  },
  FlatListReferancetxt: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 3) / 100,
    fontFamily: Font.FontSemiBold,
  },
  FlatListPricetxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 4.3) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'right',
  },
  FlatListStatustxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.3) / 100,
    fontFamily: Font.FontMedium,
    textAlign: 'center',
  },

  // -----------------------------------
  // -------------Depostit--------------
  // -----------------------------------
  HeaderView: {
    width: (mobileW * 95) / 100,
    alignItems: 'center',
    marginTop: (mobileH * 2) / 100,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingBottom: (mobileH * 0.6) / 100,
  },
  HeaderDeposittxt: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 5) / 100,
    fontFamily: Font.FontSemiBold,
    marginTop:
      config.device_type == 'ios' ? (mobileH * 0.3) / 100 : (mobileH * 0) / 100,
  },
  RegisteredAccNumView: {
    flexDirection: 'row',
    marginTop: (mobileH * 2) / 100,
    alignItems: 'center',
    paddingBottom: (mobileH * 1.2) / 100,
  },
  RegisteredAccNumtxt: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 3.6) / 100,
    fontFamily: Font.FontSemiBold,
  },
  RegisteredAccNumtxt1: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 3) / 100,
    paddingVertical:
      config.device_type == 'android'
        ? (mobileH * 1.9) / 100
        : (mobileH * 2.23) / 100,
  },
  Labeltxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.9) / 100,
    fontFamily: Font.FontRegular,
  },
  LoginTxtInputConainer: {
    width: (mobileW * 90) / 100,
    marginTop: (mobileH * 1) / 100,
    height: (mobileH * 7) / 100,
    backgroundColor: Colors.textbackground_color,
    borderRadius: (mobileW * 1) / 100,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.text_color2,
    borderWidth: 0.5,
    alignSelf: 'center',
  },

  DepositButtonAmount: {
    borderColor: Colors.PnlTextColor,
    borderWidth: (mobileW * 0.25) / 100,
    fontFamily: Font.FontMedium,
    alignSelf: 'center',
    paddingVertical: (mobileH * 0.5) / 100,
    paddingHorizontal: (mobileW * 3) / 100,
    fontSize: (mobileW * 3.75) / 100,
  },
  BankAccountHeadTxtView: {
    flexDirection: 'row',
    marginTop: (mobileH * 2) / 100,
    alignItems: 'center',
    paddingBottom: (mobileH * 1.2) / 100,
  },
  BankAccountHeadTxt: {
    color: Colors.white_color,
    fontSize: (mobileW * 4.25) / 100,
    fontFamily: Font.FontSemiBold,
  },
  TranseferMoneyArrView: {
    flexDirection: 'row',
    marginTop: (mobileH * 2) / 100,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  TranseferMoneyArrtxt: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  TranseferMoneyArrCpyImage: {
    top: (mobileH * 1.5) / 100,
    width: (mobileW * 4) / 100,
    height: (mobileW * 4) / 100,
  },
  TranseferMoneyArrDetailtxt: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  DepositEmptyImage: {
    top: (mobileH * 0.5) / 100,
    width: (mobileW * 4) / 100,
    height: (mobileW * 4) / 100,
    tintColor: Colors.PnlTextColor,
  },
  DepositEmptyDepositmsgtxt: {
    color: Colors.PnlTextColor,
    marginLeft: (mobileW * 2) / 100,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  DepositCheckInageTransfertxt: {
    color: Colors.whiteColor,
    marginLeft: (mobileW * 2) / 100,
    fontSize: (mobileW * 3.4) / 100,
    fontFamily: Font.FontSemiBold,
  },

  ButtonView: {
    backgroundColor: Colors.whiteColor,
    height: (mobileH * 6.5) / 100,
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (mobileH * 1) / 100,
  },
  ButtonViewTxt: {
    color: Colors.black_color,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 4) / 100,
  },

  // -------------------------------------
  // ---------------Withdrow--------------
  // -------------------------------------
  WithdrowHeaderView: {
    width: (mobileW * 91.25) / 100,
    alignItems: 'center',
    marginTop: (mobileH * 2) / 100,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  HeaderWithdrowtxt: {
    marginLeft: (mobileW * 2.5) / 100,
    color: Colors.placeholder_color,
    fontSize: (mobileW * 5) / 100,
    fontFamily: Font.FontSemiBold,
    marginTop:
      config.device_type == 'ios' ? (mobileH * 0.3) / 100 : (mobileH * 0) / 100,
  },
  Labeltxt: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.9) / 100,
    fontFamily: Font.FontRegular,
  },
  LoginTxtInputConainer: {
    width: (mobileW * 90) / 100,
    marginTop: (mobileH * 1) / 100,
    height: (mobileH * 7) / 100,
    backgroundColor: Colors.textbackground_color,
    borderRadius: (mobileW * 1) / 100,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.text_color2,
    borderWidth: 0.5,
    alignSelf: 'center',
  },

  WithdrowButtonAmount: {
    borderColor: Colors.PnlTextColor,
    borderWidth: (mobileW * 0.25) / 100,
    fontFamily: Font.FontMedium,
    alignSelf: 'center',
    paddingVertical: (mobileH * 0.5) / 100,
    paddingHorizontal: (mobileW * 3) / 100,
    fontSize: (mobileW * 3.75) / 100,
  },
  TranseferMoneyArrView: {
    flexDirection: 'row',
    marginTop: (mobileH * 2) / 100,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  TranseferMoneyArrtxt: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  TranseferMoneyArrCpyImage: {
    top: (mobileH * 1.5) / 100,
    width: (mobileW * 4) / 100,
    height: (mobileW * 4) / 100,
  },
  TranseferMoneyArrDetailtxt: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontSemiBold,
  },

  ButtonView: {
    backgroundColor: Colors.whiteColor,
    height: (mobileH * 6.5) / 100,
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (mobileH * 1) / 100,
  },
  ButtonViewTxt: {
    color: Colors.black_color,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 4) / 100,
  },

  // -------------------------------------
  // ---------------Home------------------
  // -------------------------------------
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.HomeBackColor,
  },
  topView: {
    flex: 1,
    backgroundColor: Colors.themeblack_color,
  },
  densityView: {
    width: (mobileW * 70) / 100,
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: (mobileH * 2) / 100,
    alignItems: 'center',
  },
  densityImage: {
    width: (mobileW * 4.5) / 100,
    height: (mobileW * 4.5) / 100,
  },
  densityText: {
    color: Colors.yellow_color,
    fontSize: (mobileW * 5.3) / 100,
    fontFamily: Font.FontSemiBold,
  },
  densityTextView: {
    paddingHorizontal: (mobileW * 2) / 100,
  },
  walletAndProfileView: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: (mobileH * 3) / 100,
    alignItems: 'center',
    left: (mobileW * 2) / 100,
  },

  homeBorderBelowAllText: {
    marginTop: (mobileH * 1) / 100,
    borderBottomWidth: (mobileW * 0.25) / 100,
    marginLeft: (mobileW * 5) / 100,
    borderColor: Colors.greyColor,
    width: (mobileW * 90) / 100,
  },
  homeDensityAndWallet: {
    width: (mobileW * 90) / 100,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  walletImage: {
    width: (mobileW * 7) / 100,
    height: (mobileW * 7) / 100,
  },

  profileImageView: {
    paddingHorizontal: (mobileW * 2) / 100,
  },
  profileImage: {
    width: (mobileW * 7) / 100,
    height: (mobileW * 7) / 100,
    left: (mobileW * 2) / 100,
  },
  marketAndBorderView: {
    flexDirection: 'row',
    marginTop: (mobileH * 2) / 100,
    marginBottom: (mobileH * 2) / 100,
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
  },
  marketText: {
    color: Colors.whiteColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 6.3) / 100,
  },
  greenBorderBelowMarket: {
    width: (mobileW * 15) / 100,
    backgroundColor: Colors.yellow_color,
    borderColor: Colors.yellow_color,
    borderWidth: (mobileW * 0.7) / 100,
  },
  loremHeadingView: {
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  loremText: {
    color: Colors.text_color3,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  mainViewHorizontalFlatlist: {
    width: (mobileW * 70) / 100,
    marginHorizontal: (mobileW * 5) / 100,
    marginTop: (mobileH * 1.5) / 100,
  },
  hFlatlistBox: {
    width: (mobileW * 70) / 100,
    paddingHorizontal: (mobileW * 5) / 100,
    backgroundColor: Colors.CartBackColor,
    paddingTop: (mobileH * 1.25) / 100,
    paddingBottom: (mobileH * 1) / 100,
    borderColor: Colors.BorderColor,
    borderWidth: (mobileW * 0.2) / 100,
  },

  hFlatlisttitleText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 4.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  borderBelowTitle: {
    marginTop: (mobileH * 0.6) / 100,
    borderBottomWidth: 1,
    borderColor: Colors.BorderColor,
    width: (mobileW * 60) / 100,
    alignSelf: 'center',
  },
  scriptNameImageRiseFall: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (mobileW * 60) / 100,
  },
  scriptNameImage: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (mobileW * 51) / 100,
  },
  iconHFlatlist: {
    width: (mobileW * 4.3) / 100,
    height: (mobileW * 8.5) / 100,
  },
  hFlatlistScriptName: {
    marginLeft: (mobileW * 1) / 100,
    color: Colors.placeholder_color,
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontSemiBold,
  },
  hFlatlistCurrencyView: {
    marginLeft: (mobileW * 1) / 100,
    alignItems: 'center',
  },
  hFlatlistCurrencytext: {
    color: Colors.placeholder_color,
    backgroundColor: Colors.usdt_bg,
    fontSize: (mobileW * 1.8) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 1) / 100,
    borderColor: Colors.placeholder_color,
    borderWidth: (mobileW * 0.1) / 100,
  },
  risePercentageText: {
    color: Colors.green_type_color,
    fontSize: (mobileW * 3.25) / 100,
    fontFamily: Font.FontSemiBold,
  },
  priceView: {
    justifyContent: 'center',
    width: (mobileW * 60) / 100,
  },
  priceValueText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 4.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  volumeView: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: (mobileW * 60) / 100,
  },
  volumeText: {
    color: Colors.YellowTextColor,
    fontSize: (mobileW * 2.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  afterVolumeUsdtTextView: {
    paddingHorizontal: (mobileW * 2) / 100,
  },
  afterVolumeUsdtText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 2.8) / 100,
    fontFamily: Font.FontSemiBold,
  },
  allFavMainView: {
    flexDirection: 'row',
    marginTop: (mobileH * 4) / 100,
    marginBottom: (mobileH * 1) / 100,
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
  },
  allFavView: {
    flexDirection: 'row',
    width: (mobileW * 83.5) / 100,
    alignContent: 'center',
    alignItems: 'center',
  },
  allText: {
    color: Colors.black_color,
    backgroundColor: Colors.whiteColor,
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 1.5) / 100,
    paddingVertical: (mobileW * 0.5) / 100,
    borderColor: Colors.placeholder_color,
  },
  favText: {
    marginLeft: (mobileW * 3) / 100,
    color: Colors.placeholder_color,
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 1.5) / 100,
    paddingVertical: (mobileW * 0.5) / 100,
    borderColor: Colors.placeholder_color,
    borderWidth: (mobileW * 0.2) / 100,
  },
  searchImageView: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: (mobileW * 1) / 100,
    paddingTop: (mobileH * 0.6) / 100,
  },
  searchImage: {
    width: (mobileW * 5) / 100,
    height: (mobileW * 5) / 100,
    tintColor: Colors.yellow_color,
  },
  borderBelowFav: {
    marginTop: (mobileH * 1) / 100,
    borderBottomWidth: (mobileW * 0.25) / 100,
    marginLeft: (mobileW * 5) / 100,
    borderColor: Colors.greyColor,
    width: (mobileW * 90) / 100,
  },
  flatlistMainView: {
    marginTop: (mobileH * 2) / 100,
  },

  flatlistMainView2: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
  },
  scriptsStarImageMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (mobileW * 75) / 100,
  },
  flatliststarImage: {
    width: (mobileW * 4.5) / 100,
    height: (mobileW * 4.5) / 100,
  },
  flatlistScriptImage: {
    marginLeft: (mobileW * 1.5) / 100,
    marginRight: (mobileW * 1.5) / 100,
    width: (mobileW * 7) / 100,
    height: (mobileW * 7) / 100,
  },
  flatlistScriptName: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontSemiBold,
  },
  currencyUsdtView: {
    marginLeft: (mobileW * 1) / 100,
  },
  flatlistCurrencyText: {
    color: Colors.placeholder_color,
    alignSelf: 'center',
    backgroundColor: Colors.usdt_bg,
    fontSize: (mobileW * 2.25) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 1) / 100,
    paddingVertical: (mobileH * 0.05) / 100,
    borderRadius: (mobileW * 0.5) / 100,
    textAlign: 'center',
  },

  faltlistScriptPriceView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (mobileW * 75) / 100,
  },

  faltlistScriptPriceText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.25) / 100,
    fontFamily: Font.FontSemiBold,
  },

  volumeAndRiseFallMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: (mobileW * 14.3) / 100,
    width: (mobileW * 75) / 100,
    alignSelf: 'center',
  },

  flatlistVolumeView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (mobileW * 60) / 100,
  },

  flatlistVolumeText: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 3) / 100,
    fontFamily: Font.FontSemiBold,
  },

  flatlistRiseFallMainView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: (mobileW * 15) / 100,
  },

  flatlistArrowImage: {
    width: (mobileW * 2.5) / 100,
    height: (mobileW * 2.5) / 100,
    marginRight: (mobileW * 1) / 100,
  },

  flatlistRisePercentageText: {
    fontSize: (mobileW * 3.25) / 100,
    fontFamily: Font.FontSemiBold,
  },

  footerImageStyle: {
    width: (mobileW * 6) / 100,
    height: (mobileW * 6) / 100,
    backgroundColor: Colors.themeblack_color,
    countcolor: Colors.white_color,
  },

  // ----------------------------------------------------
  // -------------search Home Page Styles----------------
  // ----------------------------------------------------
  searchHomeMainViewSearchBar: {
    marginTop: (mobileH * 3) / 100,
    borderRadius: (mobileW * 2) / 100,
    alignSelf: 'center',
    borderColor: Colors.PnlTextColor,
    width: (mobileW * 87.5) / 100,
  },
  searchHomeMainView2SearchBar: {
    paddingHorizontal: (mobileW * 2) / 100,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.placeholder_color,
    borderWidth: (mobileW * 0.25) / 100,
    height: (mobileH * 7) / 100,
  },
  searchHomeSearchIconView: {
    paddingHorizontal: (mobileW * 3) / 100,
    // paddingVertical: mobileH * 0.5 / 100,
  },
  searchHomeSearchIcon: {
    width: (mobileW * 4) / 100,
    height: (mobileW * 4) / 100,
    tintColor: Colors.PnlTextColor,
  },
  searchHomeSearchTextInput: {
    color: Colors.white_color,
    backgroundColor: Colors.textinput_back,
    borderTopRightRadius: (mobileW * 2) / 100,
    borderBottomRightRadius: (mobileW * 2) / 100,
    paddingVertical: (mobileW * 3) / 100,
    width: (mobileW * 62.5) / 100,
    fontSize: (mobileW * 3.5) / 100,
  },
  searchHomeWrongIconView: {
    paddingHorizontal: (mobileW * 3) / 100,
    // paddingVertical: mobileH * 0.5 / 100,
  },
  searchHomeMostSearchedTextView: {
    width: (mobileW * 87.5) / 100,
    alignItems: 'center',
    marginTop: (mobileH * 3) / 100,
  },
  searchHomeMostSearchedText: {
    color: Colors.placeholder_color,
    width: (mobileW * 87.5) / 100,
    fontSize: (mobileW * 4.4) / 100,
    fontFamily: Font.FontSemiBold,
  },
  searchHomeCryptosHeadingView: {
    width: (mobileW * 87.5) / 100,
    alignItems: 'center',
    marginTop: (mobileH * 1) / 100,
  },
  searchHomeCryptosHeadingText: {
    color: Colors.text_color2,
    width: (mobileW * 87.5) / 100,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  searchHomeScriptNamePriceView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    marginTop: (mobileH * 2) / 100,
  },
  searchHomeScriptNamePriceView2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: (mobileW * 90) / 100,
  },
  searchHomeScriptNameText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.8) / 100,
    fontFamily: Font.FontSemiBold,
  },
  searchHomeScriptPriceText: {
    textAlign: 'justify',
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.25) / 100,
    fontFamily: Font.FontSemiBold,
  },
  searchHomeriseFallTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: (mobileW * 14.3) / 100,
    width: (mobileW * 75) / 100,
    alignSelf: 'flex-end',
  },
  searchHomeriseFallTextView2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: (mobileW * 75) / 100,
  },
  searchHomeriseFallText: {
    fontSize: (mobileW * 3) / 100,
    fontFamily: Font.FontSemiBold,
  },
  searchHomeBorderBelowEveryContent: {
    marginTop: (mobileH * 1) / 100,
    borderBottomWidth: (mobileW * 0.25) / 100,
    borderColor: Colors.greyColor,
    width: (mobileW * 90) / 100,
  },

  // -----------------------------------------
  // -------------Orders Styles---------------
  // -----------------------------------------

  ordersOrdersHeadingView: {
    marginTop: (mobileH * 3) / 100,
    marginBottom: (mobileH * 1) / 100,
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
  },
  ordersOrdersTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: (mobileW * 90) / 100,
  },
  ordersOrdersText: {
    color: Colors.whiteColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 6.3) / 100,
    width: (mobileW * 83) / 100,
  },
  ordersSearchIconGreen: {
    marginTop: (mobileH * 1) / 100,
    width: (mobileW * 7) / 100,
    height: (mobileW * 7) / 100,
    tintColor: Colors.yellow_color,
  },
  ordersBorderBelowOrdersText: {
    width: (mobileW * 16) / 100,
    backgroundColor: Colors.yellow_color,
    borderColor: Colors.yellow_color,
    borderWidth: (mobileW * 0.7) / 100,
  },
  ordersLoremHeadingView: {
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  ordersLoremText: {
    color: Colors.LoremColor,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  ordersViewForHorizontalTabs: {
    width: (mobileW * 96) / 100,
    alignSelf: 'center',
    marginTop: (mobileH * 2) / 100,
    alignItems: 'center',
  },
  ordersMainViewHorizonatalFlatlist: {
    marginTop: (mobileH * 1.5) / 100,
  },
  clickableFlatlistView: {
    borderBottomWidth: (mobileW * 0.7) / 100,
    borderBottomColor: Colors.ButtonBarColor,
    paddingHorizontal: (mobileW * 3) / 100,
  },
  clickableFlatlistView2: {
    paddingHorizontal: (mobileW * 3) / 100,
  },
  ordersScriptNameText: {
    color: Colors.white_color,
    fontSize: (mobileW * 4.3) / 100,
    paddingVertical: (mobileW * 1.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  ordersScriptNameText2: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 4.3) / 100,
    paddingVertical: (mobileW * 1.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  ordersBorderBelowFlatlist: {
    borderBottomWidth: (mobileW * 0.25) / 100,
    borderColor: Colors.greyColor,
    width: mobileW,
  },
  ordersOpenOrdersMainView: {
    marginTop: (mobileW * 6) / 100,
    width: (mobileW * 85) / 100,
    alignSelf: 'center',
  },
  ordersOpenOrdersMainView2: {
    alignSelf: 'center',
    borderColor: Colors.BorderColor,
    borderWidth: (mobileW * 0.5) / 100,
    paddingVertical: (mobileH * 1.5) / 100,
    backgroundColor: Colors.CartBackColor,
  },
  ordersBuyCurrencydateTimeView: {
    borderColor: Colors.faltlistBorderHome,
    borderBottomWidth: (mobileW * 0.5) / 100,
    paddingHorizontal: (mobileW * 2) / 100,
  },
  // ordersMainViewBuyTextView: {
  //     paddingVertical: mobileH * 0.5 / 100,
  // },
  // ordersMainViewBuyView2: {
  //     width: mobileW * 15 / 100,
  //     alignItems: 'center',
  //     backgroundColor: Colors.green_color,
  // },
  ordersBuyText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
  },
  ordersCurrencyFilledView: {
    width: (mobileW * 85) / 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  ordersScriptsNameInBox: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
  },
  ordersFilledViewInBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ordersFilledTextInBox: {
    color: Colors.placeholder_color,
    backgroundColor: Colors.usdt_bg,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 1) / 100,
    borderRadius: (mobileW * 0.5) / 100,
  },
  ordersDateTimeLtpView: {
    width: (mobileW * 85) / 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: (mobileH * 1) / 100,
  },
  ordersDateTimeinBox: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
  },
  ordersLTPandPriceView: {
    flexDirection: 'row',
  },
  ordersLTPText: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 1) / 100,
  },
  ordersLtpPriceText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
  },
  orderSizePriceMainView: {
    paddingHorizontal: (mobileW * 2) / 100,
    marginTop: (mobileH * 1) / 100,
  },
  ordersBuyCurrencydateTimeView2: {
    width: (mobileW * 85) / 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: (mobileH * 2) / 100,
  },
  ordersFirstboxtxt: {
    color: Colors.GreyTextColor,
    fontSize: (mobileW * 2.7) / 100,
    fontFamily: Font.FontMedium,
  },
  ordersFirstboxtxt1: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.2) / 100,
    fontFamily: Font.FontMedium,
  },
  ordersSizeusdtText: {
    color: Colors.GreyTextColor,
    fontSize: (mobileW * 2.7) / 100,
    fontFamily: Font.FontMedium,
    marginTop: (mobileH * 2) / 100,
  },
  ordersPriceText: {
    color: Colors.GreyTextColor,
    fontSize: (mobileW * 2.7) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 2) / 100,
  },
  ordersnum92: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.2) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 2) / 100,
  },
  ordersTriggerPrice: {
    marginTop: (mobileH * 2) / 100,
    paddingHorizontal: (mobileW * 2) / 100,
    color: Colors.GreyTextColor,
    fontSize: (mobileW * 2.7) / 100,
    fontFamily: Font.FontMedium,
  },
  ordersReduceOnlyView: {
    alignItems: 'flex-end',
  },
  ordersReduceOnlyText: {
    color: Colors.GreyTextColor,
    fontSize: (mobileW * 2.7) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 1) / 100,
  },
  ordersNoText: {
    alignSelf: 'flex-start',
    paddingHorizontal: (mobileW * 1) / 100,
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.2) / 100,
    fontFamily: Font.FontMedium,
  },
  ordersOrderIDView: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: (mobileH * 2) / 100,
  },

  ordersOrderIdText: {
    color: Colors.GreyTextColor,
    fontSize: (mobileW * 2.7) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 1) / 100,
  },
  ordersCopyImage: {
    width: (mobileW * 2.5) / 100,
    height: (mobileW * 2.5) / 100,
  },
  ordersNum38Text: {
    alignSelf: 'flex-start',
    paddingHorizontal: (mobileW * 1) / 100,
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.2) / 100,
    fontFamily: Font.FontMedium,
  },
  orderArrFlatlist: {
    paddingBottom: (mobileH * 12) / 100,
    marginTop: (mobileW * 3) / 100,
  },
  orderArrMainView: {
    alignSelf: 'center',
    marginTop: (mobileW * 3) / 100,
    borderColor: Colors.BorderColor,
    borderWidth: (mobileW * 0.5) / 100,
    paddingVertical: (mobileH * 1.5) / 100,
    paddingHorizontal: (mobileW * 2) / 100,
    backgroundColor: Colors.CartBackColor,
  },
  orderArrBuyView1: {
    paddingVertical: (mobileH * 0.5) / 100,
  },
  orderArrBuyView2: {
    width: (mobileW * 15) / 100,
    alignItems: 'center',
    backgroundColor: Colors.green_color,
  },
  orderArrBuyText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
  },
  orderArrCurrencyFilled: {
    width: (mobileW * 85) / 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: (mobileH * 0.5) / 100,
  },
  orderArrScriptNameText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
  },
  orderArrFilledView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderArrFilledText: {
    color: Colors.placeholder_color,
    backgroundColor: Colors.usdt_bg,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 2) / 100,
    borderRadius: (mobileW * 0.5) / 100,
  },
  orderArrDropDownBg: {
    top: (mobileH * 1) / 100,
    width: (mobileW * 5) / 100,
    height: (mobileW * 5) / 100,
  },
  orderArrDateTimeLtpView: {
    width: (mobileW * 85) / 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  orderArrDateTimeText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
  },
  orderArrLtpView: {
    flexDirection: 'row',
    marginRight: (mobileW * 5.75) / 100,
  },
  orderArrLtpText: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
  },
  orderArrLtpPriceText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 1) / 100,
  },

  //--------------Tab2 OrderHistory styles----------------------
  tab2KeyBoardScrollView: {
    paddingBottom: (mobileH * 1) / 100,
    marginTop: (mobileW * 4) / 100,
  },
  tab2FirstBoxMainView: {
    alignSelf: 'center',
    marginTop: (mobileW * 3) / 100,
    marginLeft: (mobileW * 1) / 100,
    borderColor: Colors.BorderColor,
    backgroundColor: Colors.CartBackColor,
    borderWidth: (mobileW * 0.5) / 100,
    paddingVertical: (mobileH * 1.5) / 100,
    paddingHorizontal: (mobileW * 2) / 100,
  },
  tab2BuyMainView: {
    paddingVertical: (mobileH * 0.5) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tab2BuyMainView2: {
    width: (mobileW * 15) / 100,
    alignItems: 'center',
    backgroundColor: Colors.green_color,
  },
  tab2FirstBoxBuyText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
  },
  tab2FirstBoxFilledText: {
    color: Colors.placeholder_color,
    backgroundColor: Colors.usdt_bg,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 2) / 100,
    borderRadius: (mobileW * 0.5) / 100,
  },
  tab2FirstBoxCurrencyFilledMainView: {
    width: (mobileW * 85) / 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  tab2FirstBoxCurrencyFilledMainView2: {
    flexDirection: 'row',
  },
  tab2FirstBoxBtcText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.75) / 100,
    fontFamily: Font.FontMedium,
  },
  tab2LineAfterBtc: {
    marginHorizontal: (mobileW * 2) / 100,
    borderRightWidth: (mobileW * 0.35) / 100,
    borderColor: Colors.placeholder_color,
  },
  tab2FirstBoxDateTimeText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.75) / 100,
    fontFamily: Font.FontMedium,
  },
  tab2FirstBoxMarketTextView: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.75) / 100,
    fontFamily: Font.FontMedium,
  },
  tab2FirstBoxMarketText: {
    color: Colors.text_color3,
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontMedium,
  },
  tab2FirstBoxSizePriceView: {
    paddingHorizontal: (mobileW * 2) / 100,
    marginLeft: (mobileW * 1) / 100,
    alignSelf: 'center',
    backgroundColor: Colors.CartBackColor,
    borderColor: Colors.BorderColor,
    borderBottomWidth: (mobileW * 0.5) / 100,
    borderRightWidth: (mobileW * 0.5) / 100,
    borderLeftWidth: (mobileW * 0.5) / 100,
    paddingVertical: (mobileH * 1) / 100,
  },
  tab2FirstBoxSizePriceView2: {
    width: (mobileW * 85) / 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: (mobileH * 2) / 100,
  },
  WidthAlignStyle: {
    width: (mobileW * 20) / 100,
    alignItems: 'center',
    alignItems: 'flex-start',
  },
  tab2FirstBoxnum193: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.25) / 100,
    fontFamily: Font.FontMedium,
  },
  tab2FirstBoxPriceText: {
    color: Colors.GreyTextColor,
    fontSize: (mobileW * 2.7) / 100,
    fontFamily: Font.FontMedium,
    marginLeft: (mobileW * 7) / 100,
  },
  tab2FirstBoxPriceValueText: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.2) / 100,
    fontFamily: Font.FontMedium,
    marginLeft: (mobileW * 7) / 100,
  },
  tab2FirstBoxExecutedText: {
    color: Colors.GreyTextColor,
    fontSize: (mobileW * 2.7) / 100,
    fontFamily: Font.FontMedium,
    marginLeft: (mobileW * 6) / 100,
  },
  tab2FirstBoxExecutedValueText: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.2) / 100,
    fontFamily: Font.FontMedium,
    marginLeft: (mobileW * 6) / 100,
  },
  tab2FirstBoxAmountText: {
    color: Colors.GreyTextColor,
    fontSize: (mobileW * 2.7) / 100,
    fontFamily: Font.FontMedium,
    marginLeft: (mobileW * 9) / 100,
  },
  tab2FirstBoxAmountValueText: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.2) / 100,
    fontFamily: Font.FontMedium,
    marginLeft: (mobileW * 9) / 100,
  },
  tab2FlatlistBuyMainView: {
    alignSelf: 'center',
    marginTop: (mobileW * 3) / 100,
    marginLeft: (mobileW * 1) / 100,
    borderColor: Colors.BorderColor,
    backgroundColor: Colors.CartBackColor,
    borderWidth: (mobileW * 0.5) / 100,
    paddingVertical: (mobileH * 1.5) / 100,
    paddingHorizontal: (mobileW * 2) / 100,
  },
  tab2FlatlistBuyView1: {
    paddingVertical: (mobileH * 0.5) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tab2FlatlistBuyView2: {
    width: (mobileW * 15) / 100,
    alignItems: 'center',
    backgroundColor: Colors.green_color,
  },
  tab2FlatlistBuyText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
  },
  tab2FlatlistFilledView1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab2FlatlistDropdownImage: {
    top: (mobileH * 2) / 100,
    width: (mobileW * 5) / 100,
    height: (mobileW * 5) / 100,
  },
  tab2FlatlistCurrencyMainView: {
    width: (mobileW * 85) / 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  tab2FlatlistCurrencyMainView2: {
    flexDirection: 'row',
  },
  tab2FlatlistCurrencyName: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.75) / 100,
    fontFamily: Font.FontMedium,
  },
  tab2BorderBelowFlatlist: {
    marginHorizontal: (mobileW * 2) / 100,
    borderRightWidth: (mobileW * 0.35) / 100,
    borderColor: Colors.placeholder_color,
  },
  tab2FlatlistStyle: {
    paddingBottom: (mobileH * 12) / 100,
    marginTop: (mobileW * 3) / 100,
  },
  tab2FlatlistDatetime: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.75) / 100,
    fontFamily: Font.FontMedium,
  },
  tab2FlatlistMarketText: {
    marginRight: (mobileW * 7) / 100,
    color: Colors.text_color3,
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontMedium,
  },
  tab2FlatlistFilledText: {
    marginRight: (mobileW * 2) / 100,
    color: Colors.placeholder_color,
    backgroundColor: Colors.usdt_bg,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
    paddingHorizontal: (mobileW * 2) / 100,
    borderRadius: (mobileW * 0.5) / 100,
  },
  tab3HFlatlistMainView: {
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    marginTop: (mobileH * 2) / 100,
  },
  tab3HFlatlistMainView1: {
    paddingVertical: (mobileH * 1.5) / 100,
    borderColor: Colors.BorderColor,
    borderBottomWidth: (mobileW * 0.5) / 100,
    paddingHorizontal: (mobileW * 0.5) / 100,
  },
  tab3HFlatlistMainView2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: (mobileW * 1) / 100,
  },
  tab3HFlatlistRadioActiveImage: {
    height: (mobileW * 4) / 100,
    width: (mobileW * 4) / 100,
  },
  tab3HFlatlistTextTimepPeriod: {
    fontSize: (mobileW * 3) / 100,
    paddingHorizontal: (mobileW * 2) / 100,
    fontFamily: Font.FontMedium,
    paddingTop: (mobileH * 0.2) / 100,
  },
  tab3ScrollViewStyle: {
    paddingBottom: (mobileH * 1) / 100,
    marginTop: (mobileW * 4) / 100,
  },
  tab3Box1BuyTextMainView: {
    alignSelf: 'center',
    marginTop: (mobileW * 3) / 100,
    marginLeft: (mobileW * 1) / 100,
    borderColor: Colors.BorderColor,
    backgroundColor: Colors.CartBackColor,
    borderWidth: (mobileW * 0.5) / 100,
    paddingVertical: (mobileH * 1.5) / 100,
    paddingHorizontal: (mobileW * 2) / 100,
  },
  tab3Box1BuyTextMainView1: {
    paddingVertical: (mobileH * 0.5) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tab3Box1BuyTextMainView2: {
    width: (mobileW * 15) / 100,
    alignItems: 'center',
    backgroundColor: Colors.green_color,
  },
  tab3Box1BuyText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
  },
  tab3Box1CurrencyTextMainView1: {
    width: (mobileW * 85) / 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  tab3Box1CurrencyTextMainView2: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.75) / 100,
    fontFamily: Font.FontMedium,
  },
  tab3Box1BorderBelowCurrency: {
    marginHorizontal: (mobileW * 2) / 100,
    borderRightWidth: (mobileW * 0.35) / 100,
    borderColor: Colors.placeholder_color,
  },
  tab3Box1DateTimeText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.75) / 100,
    fontFamily: Font.FontMedium,
  },
  tab3Box1PriceTextView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab3Box1PriceValueText: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontMedium,
  },
  tab3Box1DetailsMainView: {
    paddingHorizontal: (mobileW * 2) / 100,
    marginLeft: (mobileW * 1) / 100,
    alignSelf: 'center',
    backgroundColor: Colors.CartBackColor,
    borderColor: Colors.BorderColor,
    borderBottomWidth: (mobileW * 0.5) / 100,
    borderRightWidth: (mobileW * 0.5) / 100,
    borderLeftWidth: (mobileW * 0.5) / 100,
    paddingVertical: (mobileH * 1) / 100,
  },
  tab3Box1PriceFeeTextMainView: {
    width: (mobileW * 85) / 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: (mobileH * 2) / 100,
  },
  tab3Box1DetailsQuantityText: {
    color: Colors.GreyTextColor,
    fontSize: (mobileW * 2.7) / 100,
    fontFamily: Font.FontMedium,
    marginLeft: (mobileW * 0.8) / 100,
  },
  tab3Box1DetailsQuantityValueText: {
    color: Colors.whiteColor,
    fontSize: (mobileW * 3.2) / 100,
    fontFamily: Font.FontMedium,
    marginLeft: (mobileW * 0.8) / 100,
  },
  tab3Box2BuyTextMainView: {
    alignSelf: 'center',
    marginTop: (mobileW * 3) / 100,
    marginLeft: (mobileW * 1) / 100,
    borderColor: Colors.BorderColor,
    backgroundColor: Colors.CartBackColor,
    borderWidth: (mobileW * 0.5) / 100,
    paddingVertical: (mobileH * 1.5) / 100,
    paddingHorizontal: (mobileW * 2) / 100,
  },
  tab3Box2BuyTextMainView1: {
    paddingVertical: (mobileH * 0.5) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tab3Box2BuyTextMainView2: {
    width: (mobileW * 15) / 100,
    alignItems: 'center',
    backgroundColor: Colors.green_color,
  },
  tab3Box2BuyText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontMedium,
  },
  tab3Box2CurencyTextMainView1: {
    width: (mobileW * 85) / 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  tab3Box2CurencyTextMainView2: {
    flexDirection: 'row',
  },
  tab3Box2CurrencyText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.75) / 100,
    fontFamily: Font.FontMedium,
  },
  tab3Box2BorderBelowCurrency: {
    marginHorizontal: (mobileW * 2) / 100,
    borderRightWidth: (mobileW * 0.35) / 100,
    borderColor: Colors.placeholder_color,
  },
  tab3Box2DateTimeText: {
    color: Colors.placeholder_color,
    fontSize: (mobileW * 3.75) / 100,
    fontFamily: Font.FontMedium,
  },
  tab3Box2PriceValueTextMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab3Box2PriceValueText: {
    marginRight: (mobileW * 2) / 100,
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 3.75) / 100,
    fontFamily: Font.FontMedium,
  },
  tab3Box2DropDownImage: {
    top: (mobileH * 0.15) / 100,
    width: (mobileW * 5) / 100,
    height: (mobileW * 5) / 100,
  },
  selectDateTextMainView: {
    width: (mobileW * 90) / 100,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectDateTextMainView1: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: (mobileH * 2) / 100,
    alignItems: 'center',
  },
  selectDateText: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontSemiBold,
  },
  resetImageTextMainView: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: (mobileH * 3) / 100,
    alignItems: 'center',
  },
  selectDateResetImage: {
    width: (mobileW * 4) / 100,
    height: (mobileW * 4) / 100,
    tintColor: Colors.PnlTextColor,
  },
  resetTextStyle: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontSemiBold,
    paddingLeft: (mobileW * 2) / 100,
  },
  datePickerBoxesMainView: {
    paddingVertical: (mobileH * 1.5) / 100,
    justifyContent: 'space-between',
    alignSelf: 'center',
    flexDirection: 'row',
    width: (mobileW * 90) / 100,
  },
  datePickerBoxesMainView1: {
    borderColor: Colors.PnlTextColor,
    borderWidth: (mobileW * 0.5) / 100,
    width: (mobileW * 35) / 100,
    paddingVertical: (mobileH * 0.75) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerBoxesMainView2: {
    width: (mobileW * 28) / 100,
  },
  myDateTextStyle: {
    fontFamily: Font.FontMedium,
    alignSelf: 'center',
    color: Colors.white_color,
    fontSize: (mobileW * 4) / 100,
  },
  selectDateCalenderIcon: {
    height: (mobileW * 5.5) / 100,
    width: (mobileW * 5.5) / 100,
  },
  datePicker2BoxesMainView: {
    borderColor: Colors.PnlTextColor,
    borderWidth: (mobileW * 0.5) / 100,
    width: (mobileW * 35) / 100,
    paddingVertical: (mobileH * 0.75) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // -----------------------------------------
  // ---------------BuySellUSDT---------------
  // -----------------------------------------
  buyUsdtEnterAmountView: {
    alignSelf: 'center',
    width: (mobileW * 90) / 100,
    marginTop: (mobileH * 6) / 100,
  },
  buyUsdtEnterAmountText: {
    fontSize: (mobileW * 3.8) / 100,
    fontFamily: Font.FontSemiBold,
    color: Colors.whiteColor,
  },

  buyUsdtEnterAmountUsdTextView: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: (mobileW * 90) / 100,
    marginTop: (mobileH * 3) / 100,
  },

  buyUsdtEnterAmountUsdText: {
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.whiteColor,
  },

  buyUsdtEnterAmountUsdText: {
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.whiteColor,
  },

  buyUsdtBorderbelowTextInput: {
    borderBottomWidth: (mobileW * 0.5) / 100,
    borderBottomColor: Colors.BorderColor,
    marginTop: (mobileW * 5) / 100,
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
  },

  buyUsdtTextViewBelowBorder: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: (mobileW * 90) / 100,
    marginTop: (mobileH * 3) / 100,
  },
  buyUsdtTextViewBelowBorder1: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: (mobileW * 90) / 100,
    paddingBottom: (mobileH * 2) / 100,
  },

  buyUsdtOneUsdtText: {
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.whiteColor,
  },

  buyUsdtMoneyValue: {
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.FontSemiBold,
    textAlign: 'center',
    color: Colors.whiteColor,
  },

  buyUsdtReverseRefreshImage: {
    height: (mobileH * 2) / 100,
    width: (mobileW * 4) / 100,
    marginLeft: (mobileW * 1.6) / 100,
  },

  buyUsdtCheckIconWithdraw: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: (mobileW * 90) / 100,
    marginTop: (mobileH * 10) / 100,
    alignItems: 'center',
    paddingBottom: (mobileH * 0.2) / 100,
  },

  // --------------------------------------
  // --------------Portfolio---------------
  // --------------------------------------

  activetabstyle: {
    color: Colors.whiteColor,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 4) / 100,
    textAlign: config.textalign,
    alignSelf: 'center',
    paddingVertical: (mobileW * 2) / 100,
  },

  inactivetabstyle: {
    color: Colors.PnlTextColor,
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 4) / 100,
    textAlign: config.textalign,
    alignSelf: 'center',
    paddingVertical: (mobileW * 2) / 100,
  },
  MarginBuyingtxt: {
    color: Colors.PnlTextColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 3.5) / 100,
    textAlign: 'center',
  },
  MarginBuyingtxt1: {
    color: Colors.whiteColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4) / 100,
    marginTop: (mobileW * 0.2) / 100,
    textAlign: 'center',
  },
  LifetimeProfitLosstxt: {
    color: Colors.PnlTextColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 3.5) / 100,
    marginTop: (mobileW * 1.4) / 100,
    textAlign: 'center',
  },
  Largetxt: {
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 8) / 100,
    marginTop: (mobileW * 1.4) / 100,
    textAlign: 'center',
    color: Colors.whiteColor,
  },
  Largetxt1: {
    fontFamily: Font.FontBold,
    fontSize: (mobileW * 8) / 100,
    marginTop: (mobileW * 1.4) / 100,
    textAlign: 'center',
    color: Colors.GreenText,
  },
  Boxtxt: {
    color: Colors.PnlTextColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 3) / 100,
    marginLeft: (mobileW * 1.5) / 100,
  },

  Boxtxt1: {
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4.2) / 100,
    marginTop: (mobileW * 0.2) / 100,
    marginLeft: (mobileW * 1.5) / 100,
  },
  Boxtxt2: {
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4.2) / 100,
    marginTop: (mobileW * 0.2) / 100,
    marginLeft: (mobileW * 1.5) / 100,
    color: Colors.GreenText,
  },
  Boxtxt3: {
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4.2) / 100,
    marginTop: (mobileW * 0.2) / 100,
    marginLeft: (mobileW * 1.5) / 100,
    color: Colors.whiteColor,
  },
  portfolioHeadingMainView: {
    flexDirection: 'row',
    marginTop: (mobileH * 2) / 100,
    marginBottom: (mobileH * 1.2) / 100,
    paddingHorizontal: (mobileW * 5) / 100,
  },
  portfolioHeadingMainView1: {
    width: (mobileW * 89) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
  },
  portfolioHeadingText: {
    color: Colors.whiteColor,
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 6.3) / 100,
  },
  borderBelowPortfolioHeading: {
    width: (mobileW * 22) / 100,
    backgroundColor: Colors.yellow_color,
    borderColor: Colors.yellow_color,
    borderWidth: (mobileW * 0.9) / 100,
  },
  portfolioYellowSearchIcon: {
    height: (mobileH * 3.3) / 100,
    width: (mobileW * 6.6) / 100,
    marginTop: (mobileH * 1) / 100,
  },
  portfolioLoremHeadingView: {
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    paddingBottom: (mobileH * 1.5) / 100,
  },
  portfolioLoremTextStyle: {
    color: Colors.LoremColor,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  portfolioMainView: {
    width: (mobileW * 100) / 100,
    alignSelf: 'center',
  },
  portfolioMainView2: {
    width: (mobileW * 96) / 100,
    alignSelf: 'center',
    marginTop: (mobileH * 2) / 100,
    alignItems: 'center',
  },
  portfolioFlatlistMainView1: {
    marginTop: (mobileH * 1.5) / 100,
  },
  portfolioFlatlistMainView2: {
    borderBottomWidth: (mobileW * 0.6) / 100,
    borderBottomColor: Colors.ButtonBarColor,
    paddingHorizontal: (mobileW * 3) / 100,
    width: (mobileW * 42) / 100,
    alignItems: 'center',
  },
  portfolioFlatlistScriptNameText: {
    color: Colors.white_color,
    fontSize: (mobileW * 4) / 100,
    paddingVertical: (mobileW * 1.5) / 100,
    fontFamily: Font.FontSemiBold,
  },
  portfolioFlatlistMainView3: {
    borderBottomWidth: (mobileW * 0.6) / 100,
    borderBottomColor: Colors.whiteColor,
    paddingHorizontal: (mobileW * 3) / 100,
    width: (mobileW * 42) / 100,
    alignItems: 'center',
  },
  portflioTab1PortfolioValueText: {
    color: Colors.PnlTextColor,
    fontSize: (mobileW * 3) / 100,
    fontFamily: Font.FontMedium,
    paddingVertical: (mobileH * 0.2) / 100,
    textAlign: 'center',
    marginTop: (mobileH * 2) / 100,
  },
  portflioTab1elevenDollarText: {
    color: Colors.GreenText,
    fontSize: (mobileW * 3) / 100,
    fontFamily: Font.FontMedium,
    paddingVertical: (mobileH * 0.2) / 100,
    textAlign: 'center',
  },
  portflioTab1MarginBuyPowerView: {
    width: (mobileW * 43) / 100,
    paddingVertical: (mobileH * 0.5) / 100,
  },
  portflioTab1MarginBuyPowerView: {
    alignSelf: 'center',
    width: (mobileW * 100) / 100,
    alignItems: 'center',
  },
  portflioTab1PortfolioImageView: {
    alignSelf: 'center',
    width: (mobileW * 100) / 100,
    alignItems: 'center',
  },
  portflioTab1PortfolioImageStyle: {
    height: (mobileH * 50) / 100,
    width: (mobileW * 100) / 100,
  },
  portflioTab1HrFlatlistTopView: {
    alignSelf: 'center',
    width: (mobileW * 90) / 100,
    alignItems: 'center',
  },
  portfolioMarginBuyingtxtView1: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: (mobileW * 88) / 100,
    marginTop: (mobileH * 3) / 100,
  },
  portfolioMarginBuyingtxtView2: {
    width: (mobileW * 43) / 100,
    paddingVertical: (mobileH * 0.5) / 100,
    borderRightWidth: (mobileW * 0.4) / 100,
    borderRightColor: Colors.whiteColor,
  },
  portflioTab1HrFlatlistView1: {
    paddingVertical: (mobileH * 0.75) / 100,
    flexDirection: 'row',
    paddingHorizontal: (mobileW * 1.5) / 100,
    alignItems: 'center',
  },
  portflioTab1HrFlatlistAmountFlatlist: {
    borderColor: Colors.PnlTextColor,
    borderWidth: (mobileW * 0.25) / 100,
    fontFamily: Font.FontMedium,
    textAlign: 'center',
    paddingVertical: (mobileH * 0.5) / 100,
    width: (mobileW * 10) / 100,
    fontSize: (mobileW * 3.75) / 100,
  },
  portflioTab1HrFlatlistBelowBorder: {
    marginTop: (mobileH * 2) / 100,
    borderBottomWidth: (mobileW * 0.3) / 100,
    borderColor: Colors.greyColor,
  },
  portfoliotTab1BoxView1: {
    width: '90%',
    alignSelf: 'center',
    borderWidth: (mobileW * 0.5) / 100,
    borderColor: Colors.BorderColor,
    backgroundColor: Colors.themeblack_color,
    marginTop: (mobileH * 2) / 100,
  },
  portfoliotTab1BoxView2: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: (mobileW * 88) / 100,
  },
  portfoliotTab1BoxView3: {
    width: (mobileW * 43) / 100,
    borderRightWidth: (mobileW * 0.5) / 100,
    borderRightColor: Colors.BorderColor,
    paddingVertical: (mobileH * 1) / 100,
  },
  portfoliotTab1BoxView4: {
    width: (mobileW * 42) / 100,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  portfolioTab1BoxText123percent: {
    fontSize: (mobileW * 2) / 100,
    color: Colors.GreenText,
  },
  portfoliotTab1BoxView5: {
    width: (mobileW * 43) / 100,
    paddingVertical: (mobileH * 0.5) / 100,
  },
});
