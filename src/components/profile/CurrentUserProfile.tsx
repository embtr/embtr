import * as React from 'react';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { ProfileHeader } from 'src/components/profile/profile_component/ProfileHeader';
import { ProfileBody } from 'src/components/profile/profile_component/ProfileBody';
import { useFocusEffect } from '@react-navigation/native';
import FollowerController, { FollowCounts } from 'src/controller/follower/FollowerController';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { wait } from 'src/util/GeneralUtility';
import { getAuth } from 'firebase/auth';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export const CurrentUserProfile = () => {
    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);
    const [followerCount, setFollowerCount] = React.useState<number>(0);
    const [followingCount, setFollowingCount] = React.useState<number>(0);
    const [refreshing, setRefreshing] = React.useState(false);
    const [refreshedTimestamp, setRefreshedTimestamp] = React.useState<Date>(new Date());
    const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

    useFocusEffect(
        React.useCallback(() => {
            fetch();
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            if (!userProfileModel?.uid) {
                return;
            }

            FollowerController.getFollowCounts(userProfileModel.uid, (followCounts: FollowCounts) => {
                setFollowerCount(followCounts.follower_count);
                setFollowingCount(followCounts.following_count);
            });
        }, [userProfileModel])
    );

    const fetch = () => {
        const userId = getAuth().currentUser?.uid;
        if (userId) {
            ProfileController.getProfile(userId, (profile: UserProfileModel) => {
                setUserProfileModel(profile);
            });
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setUserProfileModel(undefined);
        fetch();
        wait(500).then(() => {
            setRefreshing(false);
            setRefreshedTimestamp(new Date());
        });
    }, []);

    const onShouldExpand = (shouldExpand: boolean) => {
        if (shouldExpand) {
            if (!isExpanded) {
                setIsExpanded(true);
                console.log('expanding!');
                growHeader();
            }
        } else if (!shouldExpand) {
            if (isExpanded) {
                setIsExpanded(false);
                console.log('collapsing!');
                shrinkHeader();
            }
        }
    };

    const config = {
        damping: 25,
        mass: 1,
        stiffness: 300,
        overshootClamping: true,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
    };

    const [translateValue] = React.useState(new Animated.Value(0));
    const [animatedHeight, setAnimatedHeight] = React.useState(new Animated.Value(100));
    const shrinkHeader = () => {
        console.log('shrinkin!');
        width.value = 100;
        // Animation consists of a sequence of steps
    };

    const growHeader = () => {
        width.value = 300;
        console.log('growing!');
        // Animation consists of a sequence of steps
    };

    const interpolatedHeight = animatedHeight.interpolate({
        inputRange: [0, 100],
        outputRange: [100, 310],
    });

    const width = useSharedValue(300);

    const style = useAnimatedStyle(() => {
        return {
            height: withTiming(width.value, {
                duration: 300,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
        };
    });

    return (
        <Screen>
            <Banner name="You" rightIcon={'cog-outline'} rightRoute="UserSettings" />
            <EmbtrMenuCustom />
            {userProfileModel && (
                <Animated.View style={style}>
                    <ProfileHeader
                        userProfileModel={userProfileModel}
                        onFollowUser={() => {}}
                        onUnfollowUser={() => {}}
                        followerCount={followerCount}
                        followingCount={followingCount}
                        isFollowingUser={false}
                        animatedValue={translateValue}
                    />
                </Animated.View>
            )}
            {userProfileModel && <ProfileBody userProfileModel={userProfileModel} refreshedTimestamp={refreshedTimestamp} onShouldExpand={onShouldExpand} />}
        </Screen>
    );
};
