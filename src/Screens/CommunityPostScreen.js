import {
    BackHandler,
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react'
import { Colors, Font } from '../Provider/Colorsfont'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
    config,
    consolepro,
    localimag,
    mobileH,
    mobileW,
    msgProvider,
    localStorage,
    apifuntion
}
    from '../Provider/utilslib/Utils'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

const CommunityPostScreen = () => {

    const { goBack, navigate } = useNavigation();
    const { t } = useTranslation();

    const [item, setitem] = useState({})
    const [community_postId, setCommunity_postId] = useState(null);
    const [showData, setShowData] = useState(false);
    const [userId, setUserId] = useState(null)

    const route = useRoute();
    const { community_post_id } = route?.params || {};

    const handleBackPress = useCallback(() => {
        navigate('FriendshipHome')
        return true;
    }, []);

    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                handleBackPress,
            );
            return () => backHandler.remove();
        }, [handleBackPress])
    )

    // get post details =====

    const get_post_details = async () => {
        try {

            const user_array = await localStorage.getItemObject('user_array');
            const userId = user_array?.user_id
            setUserId(userId)

            const API_URL = config.baseURL + `get_post_details?user_id=${userId}&community_post_id=${community_post_id}`;

            consolepro.consolelog(API_URL, "<API URL")
            apifuntion.getApi(API_URL, 1).then((res) => {
                if (res?.success == true) {
                    consolepro.consolelog("Res =====>>", res);
                    setitem(res?.post_details);
                    setCommunity_postId(res?.post_details?.community_post_id);
                    setShowData(true)
                } else {
                    if (res?.active_flage == 0) {
                        localStorage.clear()
                        navigate('WelcomeScreen')
                    } else {
                        consolepro.consolelog("res====>>", res)
                    }
                }
            }).catch((error) => {
                consolepro.consolelog("Error=======>>", error)
            })
        } catch (error) {
            consolepro.consolelog('Error=========>>', error)
        }
    }

    //  Like unlike 

    const handleLikeToggle = async (post, setPost) => {
        const user_array = await localStorage.getItemObject('user_array');
        const userId = user_array?.user_id;
        const userImage = user_array?.image;

        if (!post) return;

        const newLikeState = !post.like_status;

        let updatedLikeMembers = Array.isArray(post.like_members_images)
            ? [...post.like_members_images]
            : [];

        if (newLikeState) {
            if (!updatedLikeMembers.some(member => member.user_id == userId)) {
                updatedLikeMembers.unshift({
                    user_id: userId,
                    image: userImage,
                });
            }
        } else {
            updatedLikeMembers = updatedLikeMembers.filter(
                member => member.user_id != userId,
            );
        }

        const updatedPost = {
            ...post,
            like_status: newLikeState,
            total_likes: newLikeState
                ? Number(post.total_likes) + 1
                : Number(post.total_likes) - 1,
            like_members_images: updatedLikeMembers,
        };

        setPost(updatedPost);

        const API_URL = config.baseURL + 'like_community_post';
        const data = new FormData();
        data.append('user_id', userId);
        data.append('community_post_id', post.community_post_id);

        apifuntion
            .postApi(API_URL, data, 1)
            .then(res => {
                if (!res.success) {
                    let rollbackMembers = Array.isArray(post.like_members_images)
                        ? [...post.like_members_images]
                        : [];

                    if (!newLikeState) {
                        if (!rollbackMembers.some(m => m.user_id == userId)) {
                            rollbackMembers.unshift({
                                user_id: userId,
                                image: userImage,
                            });
                        }
                    } else {
                        rollbackMembers = rollbackMembers.filter(
                            m => m.user_id !== userId,
                        );
                    }

                    const rollbackPost = {
                        ...post,
                        like_status: !newLikeState,
                        total_likes: !newLikeState
                            ? Number(post.total_likes) + 1
                            : Number(post.total_likes) - 1,
                        like_members_images: rollbackMembers,
                    };

                    setPost(rollbackPost);
                }
            })
            .catch(err => {
                console.log('Like error', err);
                setPost(post); // revert to old post
            });
    };

    const get_user_details = async () => {
        const user_array = await localStorage.getItemObject('user_array');
        return user_array;
    };

    useFocusEffect(
        useCallback(() => {
            const checkUserAndFetch = async () => {
                const user = await get_user_details();
                if (user && user?.user_id) {
                    get_post_details();
                } else {
                    navigate('WelcomeScreen')
                }
            };

            checkUserAndFetch();
        }, [])
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: (mobileH * 3) / 100,
                }}>
                <TouchableOpacity
                    onPress={() => navigate('FriendshipHome')}
                    activeOpacity={0.8}
                    style={{
                        paddingHorizontal: (mobileW * 5) / 100,
                    }}>
                    <Image
                        source={localimag.icon_goBack}
                        style={{
                            width: (mobileW * 6) / 100,
                            height: (mobileW * 6) / 100,
                            transform: [
                                config.language == 1 ? { scaleX: -1 } : { scaleX: 1 },
                            ],
                        }}
                        tintColor={Colors.themeColor2}
                    />
                </TouchableOpacity>

                <Text
                    style={
                        {
                            color: Colors.themeColor2,
                            fontFamily: Font.FontSemibold,
                            fontSize: mobileW * 4.5 / 100
                        }
                    }>
                    {t('post_txt')}
                </Text>
            </View>

            {showData && <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: (mobileH * 8) / 100,
                }}
                scrollEnabled={true}
                keyboardShouldPersistTaps="handled">
                {(item?.user_id == userId || item?.join_status == 1 || item?.private_public == 0)
                    ?
                    <View
                        key={''}
                        style={{
                            width: (mobileW * 90) / 100,
                            alignSelf: 'center',
                            borderWidth: 1,
                            paddingTop: (mobileH * 1.5) / 100,
                            paddingBottom: (mobileH * 2) / 100,
                            borderColor: Colors.borderColor,
                            borderRadius: (mobileW * 2) / 100,
                            marginTop: (mobileH * 4) / 100,
                            paddingHorizontal: (mobileW * 3) / 100,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <Text
                                style={{
                                    color: Colors.placeholderTextColor,
                                    fontSize: (mobileW * 3.2) / 100,
                                    fontFamily: Font.FontSemibold,
                                }}>
                                {t('postedIn_txt')}{' '}
                                <Text
                                    style={{
                                        color: Colors.themeColor,
                                        fontSize: (mobileW * 3.2) / 100,
                                        fontFamily: Font.FontSemibold,
                                    }}>
                                    {item?.community_name?.length > 16
                                        ? config.language == 1
                                            ? '...' + item?.community_name?.slice(0, 16)
                                            : item?.community_name?.slice(0, 16) + '...'
                                        : item?.community_name}
                                </Text>
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    navigate('JoinCommunity',
                                        {
                                            community_id: item?.community_id
                                        })
                                }}>
                                <Text
                                    style={
                                        {
                                            color: Colors.themeColor,
                                            fontFamily: Font.FontSemibold,
                                            fontSize: mobileW * 3 / 100
                                        }}>
                                    {t('viewCommunity_txt')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* divider */}

                        <View
                            style={{
                                marginVertical: (mobileH * 1.4) / 100,
                                borderWidth: 0.5,
                                borderColor: Colors.borderColor,
                                width: (mobileW * 82) / 100,
                                alignSelf: 'center',
                            }}></View>

                        {/* ------------- */}

                        <View
                            style={{
                                borderRadius: (mobileW * 3) / 100,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity activeOpacity={0.8}
                                onPress={() => {
                                    // consolepro.consolelog("other user id ========>>", item?.user_id)
                                    // if (item?.bring_type == 0) {

                                    //     navigate('UserDetails', {
                                    //         other_user_id: item?.user_id
                                    //     })
                                    // } else if (item?.bring_type == 1) {
                                    //     navigate('WishingPetParentUserDetails', {
                                    //         other_user_id: item?.user_id
                                    //     })
                                    // }
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: (mobileH * 1) / 100,
                                }}>
                                <View>
                                    <View
                                        style={{
                                            // backgroundColor: 'blue',
                                            // alignSelf: 'flex-start',
                                            borderRadius: (mobileW * 30) / 100,
                                            overflow: 'hidden',
                                        }}>
                                        <Image
                                            source={
                                                item?.community_image
                                                    ? { uri: config.img_url + item?.community_image }
                                                    : localimag.icon_profile_user
                                            }
                                            style={{
                                                width: (mobileH * 5.5) / 100,
                                                height: (mobileH * 5.5) / 100,
                                                transform: [
                                                    config.language == 1 ? { scaleX: -1 } : { scaleX: 1 },
                                                ],
                                            }}
                                        />
                                    </View>
                                    {/* 
                                    <View
                                        style={{
                                            // backgroundColor: 'blue',
                                            alignSelf: 'flex-start',
                                            borderRadius: (mobileW * 30) / 100,
                                            overflow: 'hidden',
                                            position: 'absolute',
                                            right: 0,
                                        }}>
                                        <Image
                                            source={
                                                item?.pet_image
                                                    ? { uri: config.img_url + item?.pet_image }
                                                    : localimag?.icon_add_pet_photo
                                            }
                                            style={{
                                                width: (mobileW * 4) / 100,
                                                height: (mobileW * 4) / 100,
                                                transform: [
                                                    config.language == 1 ? { scaleX: -1 } : { scaleX: 1 },
                                                ],
                                            }}
                                        />
                                    </View> */}
                                </View>

                                <View
                                    style={{
                                        width: (mobileW * 37) / 100,
                                        marginLeft: (mobileW * 3) / 100,
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: (mobileW * 3.5) / 100,
                                            fontFamily: Font.FontSemibold,
                                            color: Colors.blackColor,
                                        }}>
                                        {item?.title?.length > 16
                                            ? config.language == 1
                                                ? '...' + item?.title?.slice(0, 16)
                                                : item?.title?.slice(0, 16) + '...'
                                            : item?.title}
                                    </Text>
                                    {/* <Text
                                        numberOfLines={1}
                                        style={{
                                            fontSize: (mobileW * 2.9) / 100,
                                            fontFamily: Font.FontMedium,
                                            color: Colors.blackColor,
                                        }}>
                                        {item?.address}
                                    </Text> */}
                                </View>
                            </TouchableOpacity>

                            {/* ---- 4k view---- */}

                            <View
                                style={{
                                    // flexDirection: 'row',
                                    // alignItems: 'center',
                                    // marginTop: (-mobileH * 1) / 100,
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        // marginTop: (-mobileH * 1) / 100,
                                    }}>
                                    <View
                                        style={{
                                            height: (mobileH * 3) / 100,
                                            borderRadius: (mobileW * 30) / 100,
                                            backgroundColor: Colors.homeCardbackgroundColor,
                                            paddingHorizontal: (mobileW * 1.5) / 100,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {item?.like_members_images != 'NA' &&
                                                item?.like_members_images?.slice(0, 3).map((user, index) => (
                                                    <Image
                                                        key={''}
                                                        source={
                                                            user?.image
                                                                ? { uri: config.img_url + user?.image }
                                                                : localimag?.icon_profile_user
                                                        }
                                                        style={{
                                                            width: (mobileW * 5) / 100,
                                                            height: (mobileW * 5) / 100,
                                                            borderRadius: (mobileW * 30) / 100,
                                                            marginLeft: index === 0 ? 0 : (-mobileW * 2.2) / 100,
                                                            borderWidth: 1,
                                                            borderColor: '#fff',
                                                        }}
                                                    />
                                                ))}

                                            {/* Show "+X" if more than 3 likes */}
                                            {item?.like_members_images != 'NA' &&
                                                item?.like_members_images?.length > 3 && (
                                                    <View
                                                        style={{
                                                            width: (mobileW * 5) / 100,
                                                            height: (mobileW * 5) / 100,
                                                            borderRadius: (mobileW * 30) / 100,
                                                            backgroundColor: '#ccc',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            marginLeft: (-mobileW * 2.2) / 100,
                                                            borderWidth: 1,
                                                            borderColor: '#fff',
                                                        }}>
                                                        <Text
                                                            style={{
                                                                fontSize: (mobileW * 2.5) / 100,
                                                                color: Colors.blackColor,
                                                                fontFamily: Font.FontMedium,
                                                            }}>
                                                            +{item?.like_members_images?.length - 3}
                                                        </Text>
                                                    </View>
                                                )}
                                        </View>

                                        <Text
                                            style={{
                                                color: Colors.blackColor,
                                                fontSize: (mobileW * 2.8) / 100,
                                                fontFamily: Font.FontSemibold,
                                                marginLeft: (mobileW * 3) / 100,
                                            }}>
                                            {item?.total_likes}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => handleLikeToggle(item, setitem)}
                                        style={{
                                            marginLeft: (mobileW * 3) / 100,
                                        }}>
                                        <Image
                                            source={
                                                item?.like_status
                                                    ? localimag?.icon_like_heart
                                                    : localimag.icon_likePost
                                            }
                                            style={{
                                                width: (mobileW * 7) / 100,
                                                height: (mobileW * 7) / 100,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {item?.username_visible_status == 0 && <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        //   if (item?.bring_type == 0) {
                                        //     navigate('UserDetails', {
                                        //       other_user_id: item?.user_id
                                        //     })
                                        //   } else if (item?.bring_type == 1) {
                                        //     navigate('WishingPetParentUserDetails', {
                                        //       other_user_id: item?.user_id
                                        //     })
                                        //   }
                                    }}
                                    style={
                                        {
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: mobileW * 2 / 100,
                                            alignSelf: 'flex-end'
                                        }}>
                                    {/* Profile Image Stack (Community + User) */}
                                    <View
                                        style={
                                            {
                                                position: 'relative',
                                                marginRight: mobileW * 2 / 100
                                            }}>
                                        {/* Community Image */}
                                        <View
                                            style={{
                                                borderRadius: (mobileH * 3.5) / 2 / 100,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Image
                                                source={
                                                    item?.image
                                                        ? { uri: config.img_url + item.image }
                                                        : localimag.icon_profile_user
                                                }
                                                style={{
                                                    width: (mobileH * 3.5) / 100,
                                                    height: (mobileH * 3.5) / 100,
                                                    transform: [
                                                        config.language == 1 ? { scaleX: -1 } : { scaleX: 1 },
                                                    ],
                                                }}
                                            />
                                        </View>

                                        {/* User Image Overlay */}

                                        {
                                            item?.bring_type == 0 && <View
                                                style={{
                                                    position: 'absolute',
                                                    top: -mobileW * 1 / 100,
                                                    right: -mobileW * 1 / 100,
                                                    borderRadius: (mobileW * 4) / 2 / 100,
                                                    overflow: 'hidden',
                                                    borderWidth: 1,
                                                    borderColor: '#fff',
                                                    backgroundColor: '#fff',
                                                }}
                                            >
                                                <Image
                                                    source={
                                                        item?.pet_image
                                                            ? { uri: config.img_url + item.pet_image }
                                                            : localimag.icon_profile_user
                                                    }
                                                    style={{
                                                        width: (mobileW * 3) / 100,
                                                        height: (mobileW * 3) / 100,
                                                        transform: [
                                                            config.language == 1 ? { scaleX: -1 } : { scaleX: 1 },
                                                        ],
                                                    }}
                                                />
                                            </View>
                                        }

                                    </View>

                                    {/* Text Section */}
                                    <View style={{ justifyContent: 'center' }}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => { }}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginBottom: 2,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: Colors.placeholderTextColor,
                                                    fontFamily: Font.FontMedium,
                                                    fontSize: mobileW * 2 / 100,
                                                }}
                                            >
                                                Posted By
                                            </Text>

                                        </TouchableOpacity>

                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                color: Colors.themeColor2,
                                                fontFamily: Font.FontMedium,
                                                fontSize: mobileW * 2.5 / 100,
                                                maxWidth: mobileW * 20 / 100,
                                            }}
                                        >
                                            {item?.name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>}
                            </View>
                        </View>

                        {/* video image view */}

                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginVertical: (mobileW * 5) / 100,
                                width: (mobileW * 80) / 100,
                                height: (mobileH * 60) / 100,
                                alignSelf: 'center',
                            }}>
                            {item?.type == 2 ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        navigate('VideoPreview', {
                                            uri: config.img_url + item?.image_video,
                                            type: 1,
                                        });
                                    }}
                                    style={{ width: (mobileW * 80) / 100, height: (mobileH * 60) / 100 }}>
                                    <Image
                                        source={
                                            item?.image_video ? { uri: config.img_url + item?.thumbnail } : ''
                                        }
                                        style={{
                                            width: (mobileW * 80) / 100,
                                            height: (mobileH * 60) / 100,
                                        }}
                                    />
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            navigate('VideoPreview', {
                                                uri: config.img_url + item?.image_video,
                                                type: 1,
                                            });
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: [
                                                { translateX: -(mobileW * 5) / 100 },
                                                { translateY: -(mobileW * 5) / 100 },
                                            ],
                                        }}>
                                        <Image
                                            source={localimag.icon_play_icon}
                                            style={{
                                                width: (mobileW * 10) / 100,
                                                height: (mobileW * 10) / 100,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        navigate('VideoPreview', {
                                            uri: config.img_url + item?.image_video,
                                            type: 0,
                                        });
                                    }}>
                                    <Image
                                        source={
                                            item?.image_video
                                                ? { uri: config.img_url + item?.image_video }
                                                : ''
                                        }
                                        style={{
                                            width: (mobileW * 80) / 100,
                                            height: (mobileH * 60) / 100,
                                        }}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                        {/* ----------- */}

                        <View
                            style={{
                                marginTop: (mobileH * 0.8) / 100,
                            }}>
                            <Text
                                style={{
                                    color: Colors.blackColor,
                                    fontSize: (mobileW * 3.3) / 100,
                                    fontFamily: Font.FontMedium,
                                    textAlign: config.language == 1 ? 'left' : 'left',
                                }}>
                                {item?.description}
                            </Text>
                        </View>

                        {/* divider */}

                    </View>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View
                            style={{
                                width: (mobileW * 90) / 100,
                                alignSelf: 'center',
                                borderWidth: 1,
                                borderColor: Colors.borderColor,
                                borderRadius: (mobileW * 2) / 100,
                                paddingHorizontal: (mobileW * 5) / 100,
                                alignItems: 'center',
                                backgroundColor: Colors.homeCardbackgroundColor,
                                paddingVertical: mobileW * 10 / 100
                            }}>

                            <Image
                                source={localimag.icon_lock} // Replace with your lock/lock-post image
                                style={{
                                    width: (mobileW * 12) / 100,
                                    height: (mobileW * 12) / 100,
                                    marginBottom: (mobileH * 2) / 100,
                                }}
                                tintColor={Colors.themeColor2}
                            />

                            <Text
                                style={{
                                    fontSize: (mobileW * 3.5) / 100,
                                    fontFamily: Font.FontSemibold,
                                    color: Colors.blackColor,
                                    textAlign: 'center',
                                    marginBottom: (mobileH * 1.5) / 100,
                                }}>
                                {t('this_is_a_private_post_to_view_this_post_join_txt')}
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    navigate('JoinCommunity', {
                                        community_id: item?.community_id,
                                    });
                                }}
                                style={{
                                    paddingVertical: (mobileH * 1.2) / 100,
                                    paddingHorizontal: (mobileW * 6) / 100,
                                    backgroundColor: Colors.themeColor,
                                    borderRadius: (mobileW * 2) / 100,
                                }}>
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontFamily: Font.FontSemibold,
                                        fontSize: (mobileW * 3.2) / 100,
                                    }}>
                                    {t('viewCommunity_txt')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </KeyboardAwareScrollView>}
        </View>
    )
}

export default CommunityPostScreen

const styles = StyleSheet.create({})