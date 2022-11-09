import * as React from 'react';
import { RefreshControl, View } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { ProfileHeader } from 'src/components/profile/profile_component/ProfileHeader';
import { Screen } from 'src/components/common/Screen';
import { RouteProp, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import FollowerController, { FollowCounts } from 'src/controller/follower/FollowerController';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { getAuth } from 'firebase/auth';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { ScrollView } from 'react-native-gesture-handler';
import { wait } from 'src/util/GeneralUtility';
import { ProfileBody } from './profile_component/ProfileBody';

export const UserProfile = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'UserProfile'>>();

    const [refreshedTimestamp, setRefreshedTimestamp] = React.useState<Date>(new Date());
    const [refreshing, setRefreshing] = React.useState(false);

    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);
    const [isFollowingUser, setIsFollowingUser] = React.useState(false);

    const [followerCount, setFollowerCount] = React.useState<number>(0);
    const [followingCount, setFollowingCount] = React.useState<number>(0);

    React.useEffect(() => {
        fetch();
    }, [route.params.id]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetch();
        wait(500).then(() => {
            setRefreshing(false);
            setRefreshedTimestamp(new Date());
        });
    }, []);

    const fetch = () => {
        fetchProfileData();
        fetchFollowCounts();
    };

    const fetchProfileData = () => {
        if (!route.params.id) {
            return;
        }

        ProfileController.getProfile(route.params.id, setUserProfileModel);
        FollowerController.isFollowingUser(getCurrentUid(), route.params.id, setIsFollowingUser);
    };

    const fetchFollowCounts = () => {
        if (!userProfileModel?.uid) {
            return;
        }

        FollowerController.getFollowCounts(userProfileModel.uid, (followCounts: FollowCounts) => {
            setFollowerCount(followCounts.follower_count);
            setFollowingCount(followCounts.following_count);
        });
    };

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

    return (
        <Screen>
            <Banner name="User Profile" leftIcon={'arrow-back'} leftRoute="BACK" />

            <EmbtrMenuCustom />

            <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
                    {userProfileModel && <ProfileBody userProfileModel={userProfileModel} refreshedTimestamp={refreshedTimestamp} />}
                </View>
            </ScrollView>
        </Screen>
    );
};
