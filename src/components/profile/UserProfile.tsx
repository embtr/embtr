import * as React from 'react';
import { View } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { ProfileHeader } from 'src/components/profile/profile_component/ProfileHeader';
import { Screen } from 'src/components/common/Screen';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import FollowerController, { FollowCounts } from 'src/controller/follower/FollowerController';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { ProfileBody } from 'src/components/profile/profile_component/ProfileBody';
import { getAuth } from 'firebase/auth';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { ScrollView } from 'react-native-gesture-handler';

export const UserProfile = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'UserProfile'>>();

    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);
    const [isFollowingUser, setIsFollowingUser] = React.useState(false);

    const [followerCount, setFollowerCount] = React.useState<number>(0);
    const [followingCount, setFollowingCount] = React.useState<number>(0);

    const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(undefined);
    useFocusEffect(
        React.useCallback(() => {
            getCurrentUserUid(setCurrentUserId);
        }, [])
    );

    const onFollowUser = (uid: string) => {
        setIsFollowingUser(true);
        setFollowerCount(followerCount + 1);
        FollowerController.followUser(getAuth().currentUser!.uid, uid, () => {});
    };

    const onUnfollowUser = (uid: string) => {
        setIsFollowingUser(false);
        setFollowerCount(followerCount - 1);
        FollowerController.unfollowUser(getAuth().currentUser!.uid, uid, () => {});
    };

    useFocusEffect(
        React.useCallback(() => {
            if (!userProfileModel?.uid) {
                return;
            }

            FollowerController.getFollowCounts(userProfileModel.uid, (followCounts: FollowCounts) => {
                setFollowerCount(followCounts.follower_count);
                setFollowingCount(followCounts.following_count);
            });

            getCurrentUserUid(setCurrentUserId);
        }, [userProfileModel])
    );

    useFocusEffect(
        React.useCallback(() => {
            if (!route.params.id || !currentUserId) {
                return;
            }

            ProfileController.getProfile(route.params.id, setUserProfileModel);
            FollowerController.isFollowingUser(currentUserId, route.params.id, setIsFollowingUser);
        }, [currentUserId, route.params.id])
    );

    return (
        <Screen>
            <Banner name="User Profile" leftIcon={'arrow-back'} leftRoute="BACK" />

            <EmbtrMenuCustom />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ width: isDesktopBrowser() ? '45%' : '100%' }}>
                        {userProfileModel && (
                            <ProfileHeader
                                userProfileModel={userProfileModel}
                                onFollowUser={onFollowUser}
                                onUnfollowUser={onUnfollowUser}
                                followerCount={followerCount}
                                followingCount={followingCount}
                                isFollowingUser={isFollowingUser}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
};
