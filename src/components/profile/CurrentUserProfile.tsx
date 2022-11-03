import * as React from 'react';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { Screen } from 'src/components/common/Screen';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { ProfileHeader } from 'src/components/profile/profile_component/ProfileHeader';
import { ProfileBody } from 'src/components/profile/profile_component/ProfileBody';
import { useFocusEffect } from '@react-navigation/native';
import FollowerController, { FollowCounts } from 'src/controller/follower/FollowerController';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { wait } from 'src/util/GeneralUtility';
import { getAuth } from 'firebase/auth';

export const CurrentUserProfile = () => {
    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);
    const [followerCount, setFollowerCount] = React.useState<number>(0);
    const [followingCount, setFollowingCount] = React.useState<number>(0);
    const [refreshing, setRefreshing] = React.useState(false);

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
        wait(500).then(() => setRefreshing(false));
    }, []);

    return (
        <Screen>
            <Banner name="You" rightIcon={'cog-outline'} rightRoute="UserSettings" />
            <EmbtrMenuCustom />
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ width: isDesktopBrowser() ? '45%' : '100%' }}>
                        {userProfileModel && (
                            <ProfileHeader
                                userProfileModel={userProfileModel}
                                onFollowUser={() => {}}
                                onUnfollowUser={() => {}}
                                followerCount={followerCount}
                                followingCount={followingCount}
                                isFollowingUser={false}
                            />
                        )}
                        {userProfileModel && <ProfileBody userProfileModel={userProfileModel} />}
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
};
