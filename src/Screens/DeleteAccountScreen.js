import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {localimag} from '../Provider/Localimage';
import {
  Colors,
  config,
  consolepro,
  Font,
  Lang_chg,
  mobileH,
  mobileW,
  localStorage,
  apifuntion,
  msgProvider,
} from '../Provider/utilslib/Utils';
import CommonButton from '../Components/CommonButton';
import ConfirmModal from '../Components/ConfirmModal';
import {TextInput} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const DeleteAccountScreen = ({navigation}) => {
  const [deactiveModal, setDeactiveModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmDeactivationModal, setConfirmDeactivationModal] =
    useState(false);
  const [confimDeleteModal, setConfimDeleteModal] = useState(false);

  const [isdeactivateSecure, setIsdeactivateSecure] = useState(true);
  const [isDeleteSecure, setIsDeleteSeuce] = useState(true);
  const [password, setPassword] = useState(null);
  const [deletePassword, setDeletePassword] = useState(null);

  const [user_name, setUser_name] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [petImage, setPetImage] = useState(null);
  const [bring_type, setBring_type] = useState(null);
  const [googleId, setGoogleId] = useState(null);
  const [appleID, setAppleID] = useState(null);
  const [reason, setReason] = useState(null);
  const [deleteReason, setDeleteReason] = useState(null);

  const {t} = useTranslation();

  useEffect(() => {
    const getUserValues = async () => {
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;
      consolepro.consolelog(user_array?.user_images, '<<USER ARRAY');
      setUser_name(user_array?.name ?? '');
      setUserImage(user_array?.user_images[0]?.image ?? '');
      setPetImage(user_array?.pet_images[0]?.image ?? '');
      setBring_type(user_array?.bring_type);

      setAppleID(user_array?.apple_id);
      setGoogleId(user_array?.google_id);
      const social_data = await localStorage.getItemObject('socialdata');
      consolepro.consolelog('Social Data=========>>', social_data);
    };

    getUserValues();
  }, []);

  consolepro.consolelog(petImage, '<<PET image');
  consolepro.consolelog('ggid======>>>', googleId);
  consolepro.consolelog('appleID =======>>', appleID);
  // handle deactivation ===========

  const handleDeactivation = async () => {
    try {
      if (!password) {
        msgProvider.toast(t('emptyPassword'), 'bottom');
        return false;
      }

      if (!reason) {
        msgProvider.toast(t('emptyReason'), 'bottom');
        return false;
      }

      const API_URL = config.baseURL + 'deactivate_account';
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();
      data.append('user_id', userId);
      data.append('password', password);
      data.append('reason', reason);

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              localStorage.clear();
              setConfirmDeactivationModal(false);
              navigation.navigate('WelcomeScreen');
            }, 500);
          } else {
            consolepro.consolelog(res);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              msgProvider.alert(
                t('information_txt'),
                res?.msg[config.language],
                false,
              );
              return false;
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  const handleDeativationForSocial = async () => {
    try {
      if (!reason) {
        msgProvider.toast(t('emptyReason'), 'bottom');
        return false;
      }

      const API_URL = config.baseURL + 'deactivate_account';
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();
      data.append('user_id', userId);
      data.append('reason', reason);

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              localStorage.clear();
              setConfirmDeactivationModal(false);
              navigation.navigate('WelcomeScreen');
            }, 500);
          } else {
            consolepro.consolelog(res);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              msgProvider.alert(
                t('information_txt'),
                res?.msg[config.language],
                false,
              );
              return false;
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<ERROR');
    }
  };

  // handle delete ============

  const handleDeleteAccount = async () => {
    try {
      consolepro.consolelog(password, '<<PAsswpord');
      if (!deletePassword) {
        msgProvider.toast(t('emptyPassword'), 'bottom');
        return false;
      }

      if (!deleteReason) {
        msgProvider.toast(t('emptyReason'), 'bottom');
        return false;
      }

      const API_URL = config.baseURL + 'delete_account';
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();
      data.append('user_id', userId);
      data.append('password', deletePassword);
      data.append('reason', deleteReason);

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              localStorage.clear();

              setConfimDeleteModal(false);
              navigation.navigate('WelcomeScreen');
            }, 500);
          } else {
            consolepro.consolelog(res);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              msgProvider.alert(
                t('information_txt'),
                res?.msg[config.language],
                false,
              );
              return false;
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Error');
    }
  };

  const handleDeleteForsocial = async () => {
    try {
      consolepro.consolelog(deleteReason, '<<dele reason');
      if (!deleteReason) {
        msgProvider.toast(t('emptyReason'), 'bottom');
        return false;
      }

      const API_URL = config.baseURL + 'delete_account';
      const user_array = await localStorage.getItemObject('user_array');
      const userId = user_array?.user_id;

      const data = new FormData();
      data.append('user_id', userId);
      data.append('reason', deleteReason);

      apifuntion
        .postApi(API_URL, data, 0)
        .then(res => {
          if (res?.success == true) {
            consolepro.consolelog(res, '<<RES');
            setTimeout(() => {
              localStorage.clear();

              setConfimDeleteModal(false);
              navigation.navigate('WelcomeScreen');
            }, 500);
          } else {
            consolepro.consolelog(res);
            if (res?.active_flag == 0) {
              localStorage.clear();
              navigation.navigate('WelcomeScreen');
            } else {
              msgProvider.alert(
                t('information_txt'),
                res?.msg[config.language],
                false,
              );
              return false;
            }
          }
        })
        .catch(error => {
          consolepro.consolelog(error, '<<Error');
        });
    } catch (error) {
      consolepro.consolelog(error, '<<Error');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.whiteColor}}>
        <View
          style={{
            marginTop: (mobileW * 4) / 100,
            marginLeft: (mobileW * 4) / 100,
          }}>
          {/* -------back------- */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
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

          {/*  heading  */}

          <View
            style={{
              marginTop: (mobileW * 5) / 100,
              marginHorizontal: (mobileW * 3) / 100,
            }}>
            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 6) / 100,
              }}>
              {t('delete_account_txt')}
            </Text>
          </View>
        </View>

        {/*  deactive  */}
        <View
          style={{
            alignSelf: 'center',
            marginTop: (mobileW * 10) / 100,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{alignSelf: 'center'}}>
            <View
              style={{
                marginHorizontal: (mobileW * 5) / 100,
                //   backgroundColor: 'red',
                alignSelf: 'flex-start',
                //   alignItems: 'center',
              }}>
              <View
                style={{
                  // backgroundColor: 'blue',
                  // alignSelf: 'flex-start',
                  borderRadius: (mobileW * 30) / 100,
                  overflow: 'hidden',
                }}>
                <Image
                  source={
                    userImage
                      ? {uri: config.img_url + userImage}
                      : localimag.icon_profile_user
                  }
                  style={{
                    width: (mobileW * 25) / 100,
                    height: (mobileW * 25) / 100,
                    transform: [
                      config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                />
              </View>

              {bring_type == 0 && (
                <View
                  style={{
                    // backgroundColor: 'blue',
                    alignSelf: 'flex-start',
                    borderRadius: (mobileW * 50) / 100,
                    overflow: 'hidden',
                    position: 'absolute',
                    right: 0,
                  }}>
                  <Image
                    source={
                      petImage
                        ? {uri: config.img_url + petImage}
                        : localimag?.icon_add_pet_photo
                    }
                    style={{
                      width: (mobileW * 9) / 100,
                      height: (mobileW * 9) / 100,
                      transform: [
                        config.language == 1 ? {scaleX: -1} : {scaleX: 1},
                      ],
                    }}
                  />
                </View>
              )}
            </View>

            <Text
              style={{
                color: Colors.themeColor,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 7) / 100,
                textAlign: 'center',
              }}>
              {user_name ?? ''}
            </Text>
          </View>

          <View style={{marginHorizontal: (mobileW * 15) / 100}}>
            <Text
              style={{
                color: Colors.themeColor2,
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 5) / 100,
                textAlign: 'center',
              }}>
              {t('deactivate_account_txt')}
            </Text>
          </View>
        </View>

        {/*  delete  */}
        <View
          style={{
            paddingHorizontal: (mobileW * 9) / 100,
            marginTop: (mobileW * 5) / 100,
            // backgroundColor: 'red',
            alignSelf: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: (mobileW * 5) / 100,
            }}>
            <View>
              <Image
                source={localimag.icon_deactivate}
                style={{
                  width: (mobileW * 10) / 100,
                  height: (mobileW * 10) / 100,
                }}
              />
            </View>

            <View style={{marginHorizontal: (mobileW * 3) / 100}}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 4.5) / 100,
                }}>
                {t('deactivate_account_temprary_txt')}
              </Text>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontLight,
                  fontSize: (mobileW * 3) / 100,
                }}>
                {t('your_profile_photo_comment_hidden_txt')}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: (mobileW * 3) / 100,
              marginHorizontal: (mobileW * 5) / 100,
            }}>
            <View>
              <Image
                source={localimag.icon_warning}
                style={{
                  width: (mobileW * 10) / 100,
                  height: (mobileW * 10) / 100,
                }}
              />
            </View>

            <View style={{marginHorizontal: (mobileW * 3) / 100}}>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontMedium,
                  fontSize: (mobileW * 4.5) / 100,
                }}>
                {t('deleting_your_account_txt')}
              </Text>
              <Text
                style={{
                  color: Colors.themeColor2,
                  fontFamily: Font.FontLight,
                  fontSize: (mobileW * 3) / 100,
                }}>
                {t('it_may_take_days_txt')}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            // position: 'absolute',
            // bottom: (mobileW * 4) / 100,
            marginTop: (mobileW * 20) / 100,
            alignSelf: 'center',
            flex: 1,
          }}>
          {/*  buttons */}
          <CommonButton
            title={t('deactivate_account_btn_txt')}
            containerStyle={{backgroundColor: Colors.themeColor2}}
            onPress={() => setDeactiveModal(true)}
          />

          {/* delete account button  */}
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            activeOpacity={0.8}
            onPress={() => setDeleteModal(true)}>
            <Text
              style={{
                color: Colors.themeColor,
                fontFamily: Font.FontSemibold,
                fontSize: (mobileW * 4) / 100,
                marginTop: (mobileW * 5) / 100,
              }}>
              {t('delete_account_txt')}
            </Text>
          </TouchableOpacity>
        </View>

        {/*  deactive modal  */}
        <ConfirmModal
          visible={deactiveModal}
          message={t('are_you_sure_txt')}
          content={t('you_want_to_deactivate_your_acccout')}
          popupicon={localimag.icon_deactivate_background}
          btnText={t('deactivate_btn_txt')}
          onCancelText={t('cancel_txt')}
          button={true}
          onCancelBtn={true}
          onCancelPress={() => setDeactiveModal(false)}
          onPress={() => {
            setDeactiveModal(false);
            setConfirmDeactivationModal(true);
          }}
          onCrosspress={() => setDeactiveModal(false)}
        />

        {/* delete modal  */}
        <ConfirmModal
          visible={deleteModal}
          message={t('are_you_sure_txt')}
          content={t('you_want_to_delete_your_acccout')}
          popupicon={localimag.icon_delete_background}
          btnText={t('delete_btn_txt')}
          onCancelText={t('cancel_txt')}
          button={true}
          onCancelBtn={true}
          onCancelPress={() => setDeleteModal(false)}
          onPress={() => {
            setDeleteModal(false);
            setConfimDeleteModal(true);
          }}
          onCrosspress={() => setDeleteModal(false)}
        />

        {/* confirm deactivate */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={confirmDeactivationModal}
          requestClose={() => {
            setConfirmDeactivationModal(false);
            setReason(null);
            setPassword(null);
          }}>
          <TouchableOpacity
            onPress={() => {
              setConfirmDeactivationModal(false);
              setReason(null);
              setPassword(null);
            }}
            activeOpacity={1}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#00000090',
            }}>
            <View
              style={{
                width: (mobileW * 80) / 100,
                paddingVertical: (mobileH * 2) / 100,
                borderRadius: (mobileW * 3) / 100,
                backgroundColor: Colors.whiteColor,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: (mobileW * 5) / 100,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setConfirmDeactivationModal(false);
                  setReason(null);
                  setPassword(null);
                }}
                style={{
                  width: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                  alignSelf: 'flex-end',
                }}>
                <Image
                  source={localimag.icon_crossIcon}
                  style={[
                    {
                      width: (mobileW * 4) / 100,
                      height: (mobileW * 4) / 100,
                    },
                    {tintColor: Colors.themeColor2},
                  ]}
                />
              </TouchableOpacity>

              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.themeColor,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {t('confirm_account_deactivation_txt')}
                </Text>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3.5) / 100,
                    textAlign: 'center',
                  }}>
                  {appleID || googleId
                    ? t('to_proceed_deactivation_account__for_social_txt')
                    : t('to_proceed_deactivation_account_txt')}
                </Text>

                {!(googleId || appleID) && (
                  <View
                    style={{
                      width: (mobileW * 72) / 100,
                      height: (mobileW * 13) / 100,
                      borderColor: Colors.placeholderTextColor,
                      borderRadius: (mobileW * 2) / 100,
                      borderWidth: (mobileW * 0.5) / 100,
                      marginTop: (mobileW * 3) / 100,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {/* {googleId || appleID ? ( */}
                    <>
                      <TextInput
                        placeholder={t('enter_your_password')}
                        placeholderTextColor={Colors.placeholderTextColor}
                        style={{
                          width: (mobileW * 63) / 100,
                          height: (mobileW * 13) / 100,
                          borderRadius: (mobileW * 2) / 100,
                          paddingHorizontal: (mobileW * 3) / 100,
                          color: Colors.placeholderTextColor,
                          textAlign: config.language == 1 ? 'right' : 'left',
                        }}
                        keyboardType="default"
                        secureTextEntry={isdeactivateSecure}
                        maxLength={16}
                        value={password}
                        onChangeText={val => setPassword(val)}
                      />
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                          setIsdeactivateSecure(!isdeactivateSecure)
                        }>
                        <Image
                          source={
                            isdeactivateSecure
                              ? localimag.icon_hide_eye
                              : localimag.icon_eye_open
                          }
                          style={{
                            width: (mobileW * 5) / 100,
                            height: (mobileW * 5) / 100,
                          }}
                        />
                      </TouchableOpacity>
                    </>
                    {/* )} */}
                  </View>
                )}
                <View
                  style={{
                    width: (mobileW * 72) / 100,
                    height: (mobileW * 13) / 100,
                    borderColor: Colors.placeholderTextColor,
                    borderRadius: (mobileW * 2) / 100,
                    borderWidth: (mobileW * 0.5) / 100,
                    marginTop: (mobileW * 3) / 100,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    placeholder={t('enteryourReason_txt')}
                    placeholderTextColor={Colors.placeholderTextColor}
                    style={{
                      width: (mobileW * 68) / 100,
                      height: (mobileW * 13) / 100,
                      borderRadius: (mobileW * 2) / 100,
                      paddingHorizontal: (mobileW * 3) / 100,
                      color: Colors.placeholderTextColor,
                      textAlign: config.language == 1 ? 'right' : 'left',
                    }}
                    keyboardType="default"
                    maxLength={250}
                    value={reason}
                    onChangeText={val => setReason(val)}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: (mobileW * 5) / 100,
                    paddingBottom: (mobileH * 3) / 100,
                  }}>
                  <CommonButton
                    title={t('cancel_txt')}
                    containerStyle={{
                      width: (mobileW * 30) / 100,
                      height: (mobileW * 10) / 100,
                      backgroundColor: Colors.cancleColor,
                      borderRadius: (mobileW * 2) / 100,
                    }}
                    onPress={() => {
                      setConfirmDeactivationModal(false);
                      setPassword(null);
                      setReason(null);
                    }}
                  />
                  <CommonButton
                    title={t('deactivate_btn_txt')}
                    containerStyle={{
                      width: (mobileW * 30) / 100,
                      height: (mobileW * 10) / 100,
                      backgroundColor: Colors.themeColor2,
                      marginLeft: (mobileW * 7) / 100,
                      borderRadius: (mobileW * 2) / 100,
                    }}
                    onPress={() => {
                      appleID || googleId
                        ? handleDeativationForSocial()
                        : handleDeactivation();
                    }}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* confrim delete */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={confimDeleteModal}
          requestClose={() => {
            setConfimDeleteModal(false);
            setDeletePassword(null);
            setDeleteReason(null);
          }}>
          <TouchableOpacity
            onPress={() => {
              setConfimDeleteModal(false);
              setDeletePassword(null);
              setDeleteReason(null);
            }}
            activeOpacity={1}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#00000090',
            }}>
            <View
              style={{
                width: (mobileW * 80) / 100,
                paddingVertical: (mobileH * 2) / 100,
                borderRadius: (mobileW * 3) / 100,
                backgroundColor: Colors.whiteColor,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: (mobileW * 5) / 100,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setConfimDeleteModal(false);
                  setDeletePassword(null);
                  setDeleteReason(null);
                }}
                style={{
                  width: (mobileW * 4) / 100,
                  height: (mobileW * 4) / 100,
                  alignSelf: 'flex-end',
                }}>
                <Image
                  source={localimag.icon_crossIcon}
                  style={[
                    {
                      width: (mobileW * 4) / 100,
                      height: (mobileW * 4) / 100,
                    },
                    {tintColor: Colors.themeColor2},
                  ]}
                />
              </TouchableOpacity>

              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.themeColor,
                    fontFamily: Font.FontSemibold,
                    fontSize: (mobileW * 4) / 100,
                  }}>
                  {t('confrim_delete_account_txt')}
                </Text>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3.5) / 100,
                    textAlign: 'center',
                  }}>
                  {appleID || googleId
                    ? t('to_proceed_delete_account_for_social_txt')
                    : t('to_proceed_delete_account_txt')}
                </Text>

                {!(googleId || appleID) && (
                  <View
                    style={{
                      width: (mobileW * 72) / 100,
                      height: (mobileW * 13) / 100,
                      borderColor: Colors.placeholderTextColor,
                      borderRadius: (mobileW * 2) / 100,
                      borderWidth: (mobileW * 0.5) / 100,
                      marginTop: (mobileW * 3) / 100,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <>
                      <TextInput
                        placeholder={t('enter_your_password')}
                        placeholderTextColor={Colors.placeholderTextColor}
                        style={{
                          width: (mobileW * 63) / 100,
                          height: (mobileW * 13) / 100,
                          borderRadius: (mobileW * 2) / 100,
                          paddingHorizontal: (mobileW * 3) / 100,
                          color: Colors.placeholderTextColor,
                        }}
                        keyboardType="default"
                        secureTextEntry={isDeleteSecure}
                        maxLength={16}
                        value={deletePassword}
                        onChangeText={val => setDeletePassword(val)}
                      />
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setIsDeleteSeuce(!isDeleteSecure)}>
                        <Image
                          source={
                            isDeleteSecure
                              ? localimag.icon_hide_eye
                              : localimag.icon_eye_open
                          }
                          style={{
                            width: (mobileW * 5) / 100,
                            height: (mobileW * 5) / 100,
                          }}
                        />
                      </TouchableOpacity>
                    </>
                  </View>
                )}
                <View
                  style={{
                    width: (mobileW * 72) / 100,
                    height: (mobileW * 13) / 100,
                    borderColor: Colors.placeholderTextColor,
                    borderRadius: (mobileW * 2) / 100,
                    borderWidth: (mobileW * 0.5) / 100,
                    marginTop: (mobileW * 3) / 100,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {/* {googleId || appleID ? ( */}
                  <TextInput
                    placeholder={t('enteryourReason_txt')}
                    placeholderTextColor={Colors.placeholderTextColor}
                    style={{
                      width: (mobileW * 68) / 100,
                      height: (mobileW * 13) / 100,
                      borderRadius: (mobileW * 2) / 100,
                      paddingHorizontal: (mobileW * 3) / 100,
                      color: Colors.placeholderTextColor,
                      textAlign: config.language == 1 ? 'right' : 'left',
                    }}
                    keyboardType="default"
                    maxLength={250}
                    value={deleteReason}
                    onChangeText={val => setDeleteReason(val)}
                  />
                  {/* ) : ( */}

                  {/* )} */}
                </View>
                <Text
                  style={{
                    color: Colors.themeColor2,
                    fontFamily: Font.FontMedium,
                    fontSize: (mobileW * 3.5) / 100,
                    marginTop: (mobileW * 3) / 100,
                    textAlign: 'center',
                  }}>
                  {t('deletingYourAccountWillResultIn_txt')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  <CommonButton
                    title={t('cancel_txt')}
                    containerStyle={{
                      width: (mobileW * 30) / 100,
                      height: (mobileW * 10) / 100,
                      backgroundColor: Colors.cancleColor,
                      borderRadius: (mobileW * 2) / 100,
                    }}
                    onPress={() => {
                      setConfimDeleteModal(false);
                      setDeletePassword(null);
                      setDeleteReason(null);
                    }}
                  />
                  <CommonButton
                    title={t('delete_btn_txt')}
                    containerStyle={{
                      width: (mobileW * 30) / 100,
                      height: (mobileW * 10) / 100,
                      backgroundColor: Colors.themeColor2,
                      marginLeft: (mobileW * 7) / 100,
                      borderRadius: (mobileW * 2) / 100,
                    }}
                    onPress={() => {
                      googleId || appleID
                        ? handleDeleteForsocial()
                        : handleDeleteAccount();
                    }}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default DeleteAccountScreen;

const styles = StyleSheet.create({});
