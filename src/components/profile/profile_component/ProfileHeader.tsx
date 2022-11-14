import { Image, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { ProfileLevel } from 'src/components/profile/profile_component/ProfileLevel';
import { UserProfileProBadge } from 'src/components/profile/profile_component/badge/UserProfileProBadge';
import ProfileBannerImage from 'src/components/profile/profile_component/ProfileBannerImage';
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
    animatedHeaderHeight: SharedValue<number>;
    animatedHeaderBannerRatio: SharedValue<number>;
    animatedProfileTop: SharedValue<number>;
}

export const ProfileHeader = ({
    userProfileModel,
    onFollowUser,
    onUnfollowUser,
    followerCount,
    followingCount,
    isFollowingUser,
    animatedHeaderHeight,
    animatedHeaderBannerRatio,
    animatedProfileTop,
}: Props) => {
    const { colors } = useTheme();

    const shouldDisplayFollowButton =
        getAuth().currentUser!.uid !== undefined && userProfileModel !== undefined && userProfileModel.uid !== getAuth().currentUser!.uid;

    const style = useAnimatedStyle(() => {
        return {
            height: withTiming('' + (100 * animatedHeaderHeight.value) / 3 + '%', {
                duration: 300,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
        };
    });

    const headerContentsStyle = useAnimatedStyle(() => {
        return {
            top: withTiming(animatedProfileTop.value, {
                duration: 300,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
        };
    });

    const [bannerHeight, setBannerHeight] = React.useState<number>(0);
    const width = getWindowWidth() * 0.95;
    const height = width / 3;
    const bannerStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(height * animatedHeaderBannerRatio.value, {
                duration: 300,
                easing: Easing.bezier(0.25, 0, 0.25, 1),
            }),
            width: withTiming(width * animatedHeaderBannerRatio.value, {
                duration: 300,
                easing: Easing.bezier(0.25, 0, 0.25, 1),
            }),
        };
    });

    return (
        <Animated.View style={style}>
            <View style={{ alignItems: 'center', backgroundColor: 'red' }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'red', paddingTop: 10, paddingBottom: 10 }}>
                    {/* BANNER */}
                    <Animated.View style={bannerStyle}>
                        {userProfileModel.bannerUrl ? (
                            <CachedImage style={{ width: '100%', height: '100%', borderRadius: 15 }} uri={userProfileModel.bannerUrl} />
                        ) : (
                            <Image source={DEFAULT} style={{ width: '100%', height: '100%', maxHeight: 135, borderRadius: 15 }} />
                        )}
                    </Animated.View>

                    {/* BANNER */}
                    <View style={{ position: 'absolute', zIndex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            {userProfileModel.photoUrl && <CachedImage style={{ width: 100, height: 100, borderRadius: 50 }} uri={userProfileModel.photoUrl} />}
                            <View style={{ position: 'absolute', zIndex: 1, paddingBottom: 3, paddingRight: 3 }}>
                                <ProfileLevel userProfileModel={userProfileModel} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <Animated.View style={[{ width: '100%', alignItems: 'center', paddingTop: 18 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: colors.profile_name_text, paddingLeft: 90 }}>
                        {userProfileModel.name}
                    </Text>
                    <View style={{ flexDirection: 'row', paddingLeft: 10, width: 90 }}>
                        <UserProfileProBadge />
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
        </Animated.View>
    );
};
