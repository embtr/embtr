import { ProfileHeader } from 'src/components/profile/profile_component/ProfileHeader';
import { Screen } from 'src/components/common/Screen';
import { RouteProp, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { getAuth } from 'firebase/auth';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { wait } from 'src/util/GeneralUtility';
import { ProfileBody } from './profile_component/ProfileBody';
import { ScrollChangeEvent } from 'src/util/constants';
import { useSharedValue } from 'react-native-reanimated';
import UserController from 'src/controller/user/UserController';
import { User } from 'resources/schema';
import React from 'react';
import { Banner } from '../common/Banner';

export const UserProfile = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'UserProfile'>>();

    const [refreshedTimestamp, setRefreshedTimestamp] = React.useState<Date>(new Date());
    const [refreshing, setRefreshing] = React.useState(false);

    const [newUser, setNewUser] = React.useState<User>();
    const [isFollowingUser, setIsFollowingUser] = React.useState(false);

    const [followerCount, setFollowerCount] = React.useState<number>(0);
    const [followingCount, setFollowingCount] = React.useState<number>(0);

    // used for profile header scroll animation
    const [isExpanded, setIsExpanded] = React.useState<boolean>(true);

    React.useEffect(() => {
        fetchInitial();
    }, [route.params.id]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchInitial();
        wait(500).then(() => {
            setRefreshing(false);
            setRefreshedTimestamp(new Date());
        });
    }, []);

    const fetchInitial = () => {
        fetchNewUser();
    };

    const fetchNewUser = async () => {
        const newUser = await UserController.getUserByUidViaApi(route.params.id);
        setNewUser(newUser.user);
    };

    const onFollowUser = (uid: string) => {
        setIsFollowingUser(true);
        setFollowerCount(followerCount + 1);
    };

    const onUnfollowUser = (uid: string) => {
        setIsFollowingUser(false);
        setFollowerCount(followerCount - 1);
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

            {newUser && (
                <ProfileHeader
                    user={newUser}
                    animatedBannerScale={animatedBannerScale}
                    animatedHeaderContentsScale={animatedHeaderContentsScale}
                    onFollowUser={onFollowUser}
                    onUnfollowUser={onUnfollowUser}
                    followerCount={followerCount}
                    followingCount={followingCount}
                    isFollowingUser={isFollowingUser}
                />
            )}
            {newUser && (
                <ProfileBody
                    isRefreshing={refreshing}
                    onRefresh={onRefresh}
                    newUser={newUser}
                    refreshedTimestamp={refreshedTimestamp}
                    onShouldExpand={shouldExpand}
                />
            )}
        </Screen>
    );
};
