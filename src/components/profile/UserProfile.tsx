import * as React from 'react';
import { Banner } from 'src/components/common/Banner';
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
import { wait } from 'src/util/GeneralUtility';
import { ProfileBody } from './profile_component/ProfileBody';
import { ScrollChangeEvent } from 'src/util/constants';
import { useSharedValue } from 'react-native-reanimated';
import UserController, { UserModel } from 'src/controller/user/UserController';

export const UserProfile = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'UserProfile'>>();

    const [refreshedTimestamp, setRefreshedTimestamp] = React.useState<Date>(new Date());
    const [refreshing, setRefreshing] = React.useState(false);

    const [user, setUser] = React.useState<UserModel>();
    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);
    const [isFollowingUser, setIsFollowingUser] = React.useState(false);

    const [followerCount, setFollowerCount] = React.useState<number>(0);
    const [followingCount, setFollowingCount] = React.useState<number>(0);

    // used for profile header scroll animation
    const [isExpanded, setIsExpanded] = React.useState<boolean>(true);

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
        fetchUser();
        fetchProfileData();
        fetchFollowCounts();
    };

    const fetchUser = async () => {
        if (!route.params.id) {
            return;
        }

        const user = await UserController.get(route.params.id);
        setUser(user);
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

    const shouldExpand = (e: ScrollChangeEvent) => {
        if (e === ScrollChangeEvent.BEYOND_TOP) {
            if (!isExpanded) {
                setIsExpanded(true);
                growHeader();
            }
        } else if (e === ScrollChangeEvent.BELOW_TOP) {
            if (isExpanded) {
                setIsExpanded(false);
                shrinkHeader();
            }
        }
    };

    const animatedHeaderContentsScale = useSharedValue(1);
    const animatedBannerScale = useSharedValue(1);

    const shrinkHeader = () => {
        animatedHeaderContentsScale.value = 0;
        animatedBannerScale.value = 0.66;
    };

    const growHeader = () => {
        animatedHeaderContentsScale.value = 1;
        animatedBannerScale.value = 1;
    };

    return (
        <Screen>
            <Banner name="User Profile" leftIcon={'arrow-back'} leftRoute="BACK" />
            <EmbtrMenuCustom />

            {userProfileModel && (
                <ProfileHeader
                    animatedBannerScale={animatedBannerScale}
                    animatedHeaderContentsScale={animatedHeaderContentsScale}
                    userProfileModel={userProfileModel}
                    onFollowUser={onFollowUser}
                    onUnfollowUser={onUnfollowUser}
                    followerCount={followerCount}
                    followingCount={followingCount}
                    isFollowingUser={isFollowingUser}
                />
            )}
            {user && userProfileModel && (
                <ProfileBody
                    isRefreshing={refreshing}
                    onRefresh={onRefresh}
                    user={user}
                    userProfileModel={userProfileModel}
                    refreshedTimestamp={refreshedTimestamp}
                    onShouldExpand={shouldExpand}
                />
            )}
        </Screen>
    );
};
