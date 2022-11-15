import { Image, LayoutChangeEvent, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { ProfileLevel } from 'src/components/profile/profile_component/ProfileLevel';
import { UserProfileProBadge } from 'src/components/profile/profile_component/badge/UserProfileProBadge';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getAuth } from 'firebase/auth';
import { CachedImage } from 'src/components/common/images/CachedImage';
import Animated, { Easing, SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import DEFAULT from 'assets/banner.png';
import { getWindowWidth } from 'src/util/GeneralUtility';
import React from 'react';

interface Props {
    userProfileModel: UserProfileModel;
    onFollowUser: Function;
    onUnfollowUser: Function;
    followerCount: number;
    followingCount: number;
    isFollowingUser: boolean;
    animatedHeaderContentsScale: SharedValue<number>;
    animatedBannerScale: SharedValue<number>;
}

export const ProfileHeader = ({
    userProfileModel,
    onFollowUser,
    onUnfollowUser,
    followerCount,
    followingCount,
    isFollowingUser,
    animatedHeaderContentsScale,
    animatedBannerScale,
}: Props) => {
    const { colors } = useTheme();
    const [initialHeaderContentsHeight, setInitialHeaderContentsHeight] = React.useState<number>(0);

    const shouldDisplayFollowButton =
        getAuth().currentUser!.uid !== undefined && userProfileModel !== undefined && userProfileModel.uid !== getAuth().currentUser!.uid;

    const animatedHeaderContentsStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(initialHeaderContentsHeight * animatedHeaderContentsScale.value, {
                duration: 200,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
        };
    });

    const width = getWindowWidth() * 0.95;
    const height = width * 0.33;
    const animatedBannerStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(height * animatedBannerScale.value, {
                duration: 200,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            width: withTiming(width * animatedBannerScale.value, {
                duration: 200,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
        };
    });

    const animatedHeaderStyle = useAnimatedStyle(() => {
        return {
            paddingBottom: withTiming(
                animatedHeaderContentsScale.value === 0
                    ? (height * animatedBannerScale.value * 1.2 - height * animatedBannerScale.value) / 2
                    : height * animatedBannerScale.value * 0.75 * 0.33,
                {
                    duration: 200,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                }
            ),
        };
    });

    const animatedProfileImageStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(height * animatedBannerScale.value * (animatedHeaderContentsScale.value === 1 ? 0.75 : 1.2), {
                duration: 200,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            width: withTiming(height * animatedBannerScale.value * (animatedHeaderContentsScale.value === 1 ? 0.75 : 1.2), {
                duration: 200,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            borderWidth: withTiming(animatedHeaderContentsScale.value === 1 ? 0 : 3, {
                duration: 200,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
        };
    });

    const storeInitialHeaderContentsHeight = (event: LayoutChangeEvent) => {
        setInitialHeaderContentsHeight(event.nativeEvent.layout.height);
    };

    return (
        <View>
            <View style={{ alignItems: 'center' }}>
                <Animated.View style={[animatedHeaderStyle, { alignItems: 'center', justifyContent: 'flex-end', paddingTop: 10 }]}>
                    {/* BANNER */}
                    <Animated.View style={[animatedBannerStyle, { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }]}>
                        {userProfileModel.bannerUrl ? (
                            <CachedImage style={{ width: '100%', height: '100%', borderRadius: 15 }} uri={userProfileModel.bannerUrl} />
                        ) : (
                            <Image source={DEFAULT} style={{ width: '100%', height: '100%', maxHeight: 135, borderRadius: 15 }} />
                        )}
                    </Animated.View>

                    {/* PROFILE PHOTO */}
                    <View style={{ position: 'absolute', zIndex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Animated.View
                            style={[
                                animatedProfileImageStyle,
                                { alignItems: 'flex-end', justifyContent: 'flex-end', borderColor: colors.background, borderRadius: 1000 },
                            ]}
                        >
                            {userProfileModel.photoUrl && (
                                <CachedImage style={{ width: '100%', height: '100%', borderRadius: 1000 }} uri={userProfileModel.photoUrl} />
                            )}
                            <View style={{ position: 'absolute', zIndex: 1, paddingBottom: 3, paddingRight: 3 }}>
                                <ProfileLevel userProfileModel={userProfileModel} />
                            </View>
                        </Animated.View>
                    </View>
                </Animated.View>
            </View>

            {/* PROFILE CONTENT */}
            <Animated.View
                onLayout={initialHeaderContentsHeight === 0 ? storeInitialHeaderContentsHeight : undefined}
                style={[
                    initialHeaderContentsHeight !== 0 ? animatedHeaderContentsStyle : undefined,
                    { overflow: 'hidden', width: '100%', alignItems: 'center' },
                ]}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 41 }} />
                    <Text style={{ fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: colors.profile_name_text }}>{userProfileModel.name}</Text>
                    <View style={{ width: 3 }} />
                    <UserProfileProBadge />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', paddingLeft: 10, width: 90 }}>
                        {shouldDisplayFollowButton && (
                            <TouchableOpacity
                                onPress={() => {
                                    if (isFollowingUser) {
                                        onUnfollowUser(userProfileModel.uid);
                                    } else {
                                        onFollowUser(userProfileModel.uid);
                                    }
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: colors.profile_following_background,
                                        borderRadius: 8,
                                        borderColor: colors.profile_following_border,
                                        borderWidth: 1,
                                        marginLeft: 10,
                                        height: 20,
                                        width: 80,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: colors.profile_following_text, fontFamily: 'Poppins_500Medium' }}>
                                        {isFollowingUser ? ' Following ' : ' Follow '}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <Text style={{ fontSize: 10, fontFamily: 'Poppins_500Medium', color: colors.profile_bio_text }}>{userProfileModel?.location}</Text>
                <Text style={{ fontSize: 12, fontFamily: 'Poppins_500Medium', color: colors.profile_bio_text, paddingTop: 3 }}>{userProfileModel?.bio}</Text>

                {/* FOLLOWERS/ FOLLOWING */}
                <View style={{ paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 10, backgroundColor: colors.background }}>
                        {/* FOLLOWERS */}
                        <View
                            style={{
                                paddingLeft: 15,
                                paddingRight: 15,
                                paddingTop: 10,
                                paddingBottom: 10,
                                backgroundColor: colors.profile_following_background,
                                borderRadius: 10,
                                marginRight: 15,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1.5,
                                borderColor: colors.profile_following_border,
                            }}
                        >
                            <Text style={{ fontSize: 14, fontFamily: 'Poppins_500Medium', color: colors.profile_following_text }}>
                                {followerCount} Followers
                            </Text>
                        </View>

                        {/* FOLLOWING */}
                        <View
                            style={{
                                paddingLeft: 15,
                                paddingRight: 15,
                                paddingTop: 10,
                                paddingBottom: 10,
                                backgroundColor: colors.profile_following_background,
                                borderRadius: 10,
                                marginLeft: 15,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1.5,
                                borderColor: colors.profile_following_border,
                            }}
                        >
                            <Text style={{ fontSize: 14, fontFamily: 'Poppins_500Medium', color: colors.profile_following_text }}>
                                {followingCount} Following
                            </Text>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};
