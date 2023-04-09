import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { ProfileHeader } from 'src/components/profile/profile_component/ProfileHeader';
import { ProfileBody } from 'src/components/profile/profile_component/ProfileBody';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { wait } from 'src/util/GeneralUtility';
import { getAuth } from 'firebase/auth';
import { useSharedValue } from 'react-native-reanimated';
import { ScrollChangeEvent } from 'src/util/constants';
import { User } from 'resources/schema';
import UserController from 'src/controller/user/UserController';
import { useFocusEffect } from '@react-navigation/native';

export const CurrentUserProfile = () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [refreshedTimestamp, setRefreshedTimestamp] = React.useState<Date>(new Date());
    const [user, setUser] = React.useState<User>();

    // used for profile header scroll animation
    const [isExpanded, setIsExpanded] = React.useState<boolean>(true);
    useFocusEffect(
        React.useCallback(() => {
            fetchUser();
        }, [])
    );

    const fetchUser = async () => {
        const uid = getAuth().currentUser?.uid;
        if (!uid) {
            return;
        }

        const user = await UserController.getUserByUidViaApi(uid);
        setUser(user.user);
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(500).then(() => {
            setRefreshing(false);
            setRefreshedTimestamp(new Date());
        });
    }, []);

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

    if (!user) {
        return null;
    }

    return (
        <Screen>
            <Banner name="You" rightIcon={'cog-outline'} rightRoute="UserSettings" />
            <EmbtrMenuCustom />
            <ProfileHeader
                user={user}
                animatedHeaderContentsScale={animatedHeaderContentsScale}
                animatedBannerScale={animatedBannerScale}
                onFollowUser={() => {}}
                onUnfollowUser={() => {}}
                followerCount={0}
                followingCount={0}
                isFollowingUser={false}
            />
            {user && (
                <ProfileBody
                    onRefresh={onRefresh}
                    isRefreshing={refreshing}
                    newUser={user}
                    refreshedTimestamp={refreshedTimestamp}
                    onShouldExpand={shouldExpand}
                />
            )}
        </Screen>
    );
};
