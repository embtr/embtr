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
import { useSharedValue } from 'react-native-reanimated';

export const CurrentUserProfile = () => {
    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);
    const [followerCount, setFollowerCount] = React.useState<number>(0);
    const [followingCount, setFollowingCount] = React.useState<number>(0);
    const [refreshing, setRefreshing] = React.useState(false);
    const [refreshedTimestamp, setRefreshedTimestamp] = React.useState<Date>(new Date());

    // used for profile header scroll animation
    const [shouldExpand, setShouldExpand] = React.useState<boolean>(true);
    const [isExpanded, setIsExpanded] = React.useState<boolean>(true);

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

    React.useEffect(() => {
        if (shouldExpand) {
            if (!isExpanded) {
                console.log('expand!');
                setIsExpanded(true);
                growHeader();
            }
        } else if (!shouldExpand) {
            if (isExpanded) {
                console.log('collapsing!');
                setIsExpanded(false);
                shrinkHeader();
            }
        }
    }, [shouldExpand]);

    const animatedHeaderScale = useSharedValue(1);

    const shrinkHeader = () => {
        animatedHeaderScale.value = 0.33;
    };

    const growHeader = () => {
        animatedHeaderScale.value = 1;
    };

    return (
        <Screen>
            <Banner name="You" rightIcon={'cog-outline'} rightRoute="UserSettings" />
            <EmbtrMenuCustom />
            {userProfileModel && (
                <ProfileHeader
                    animatedHeaderScale={animatedHeaderScale}
                    userProfileModel={userProfileModel}
                    onFollowUser={() => {}}
                    onUnfollowUser={() => {}}
                    followerCount={followerCount}
                    followingCount={followingCount}
                    isFollowingUser={false}
                />
            )}
            {userProfileModel && <ProfileBody userProfileModel={userProfileModel} refreshedTimestamp={refreshedTimestamp} onShouldExpand={setShouldExpand} />}
        </Screen>
    );
};
