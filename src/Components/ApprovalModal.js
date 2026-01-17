import React, { useCallback, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { localimag } from '../Provider/Localimage';
import { Colors, consolepro, Font, mobileH, mobileW, localStorage } from '../Provider/utilslib/Utils';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';


const ApprovalModal = ({ isVisible, onClose }) => {

    const { t } = useTranslation();

    const [bring_type, setBring_type] = useState(null)

    const get_user_details = async () => {
        try {
            const user_array = await localStorage.getItemObject('user_array');
            const userId = user_array?.user_id;

            const bring_type = user_array?.bring_type;
            setBring_type(bring_type);
        } catch (error) {
            consolepro.consolelog('Error fetching user details:', error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            get_user_details();
        }, [])
    )
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            requestClose={onClose}>
            <TouchableOpacity
                onPress={onClose}
                activeOpacity={1}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#00000090',
                }}>
                <View
                    style={{
                        width: (mobileW * 70) / 100,
                        paddingVertical: (mobileH * 1.5) / 100,
                        borderRadius: (mobileW * 5) / 100,
                        backgroundColor: Colors.whiteColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text
                        style={{
                            width: (mobileW * 60) / 100,
                            color: Colors.themeColor2,
                            fontSize: (mobileW * 5.5) / 100,
                            fontFamily: Font.FontBold,
                            textAlign: 'center',
                            marginTop: (mobileH * 1) / 100,
                        }}>
                        {`${t('information_txt')}`}
                    </Text>
                    <Text
                        style={{
                            width: (mobileW * 55) / 100,
                            color: Colors.ColorBlack,
                            fontSize: (mobileW * 3) / 100,
                            fontFamily: Font.FontRegular,
                            textAlign: 'center',
                        }}>
                        {bring_type == 0 ? t('profile_approval_desc_txt') : t('profile_approval_desc_without_pet_txt')}
                    </Text>

                    <View
                        style={{
                            width: (mobileW * 55) / 100,
                            alignItems: 'center',
                            alignSelf: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: (mobileH * 1.5) / 100,
                        }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                onClose()
                            }}
                            style={{
                                height: (mobileH * 4.5) / 100,
                                width: (mobileW * 30) / 100,
                                backgroundColor: Colors.themeColor2,
                                borderRadius: (mobileW * 5) / 100,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Text
                                style={{
                                    fontSize: (mobileW * 3.5) / 100,
                                    fontFamily: Font.FontMedium,
                                    color: Colors.whiteColor,
                                }}>
                                {t('ok_txt')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>

    );
};

export default ApprovalModal;
