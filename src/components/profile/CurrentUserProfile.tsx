import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { ProfileHeader } from 'src/components/profile/profile_component/ProfileHeader';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { wait } from 'src/util/GeneralUtility';
import { getAuth } from 'firebase/auth';
import { useSharedValue } from 'react-native-reanimated';
import { User } from 'resources/schema';
import UserController from 'src/controller/user/UserController';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl, ScrollView, View } from 'react-native';
import { SingleScrollUserBody } from 'src/components/profile/profile_component/single_scroll/SingleScrollUserBody';
import { NotificationController, NotificationCustomHooks } from 'src/controller/notification/NotificationController';

export const CurrentUserProfile = () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [user, setUser] = React.useState<User>();
    const [random, setRandom] = React.useState<number>(0);

    const unreadNotificationCount = NotificationCustomHooks.useUnreadNotificationCount();

    useFocusEffect(
        React.useCallback(() => {
            NotificationController.prefetchUnreadNotificationCount();
        }, [])
    );
    // used for profile header scroll animation
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
            setRandom(Math.random());
        });
    }, []);

    if (!user) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    return (
        <Screen>
            <Banner name="You" rightIcon={'cog-outline'} rightRoute="UserSettings" 
                  innerRightIcon={'notifications-outline'}
                  leftRoute={'Notifications'}
                  rightIconNotificationCount={unreadNotificationCount.data ?? 0}/>
            <EmbtrMenuCustom />
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <ProfileHeader
                    user={user}
                    onFollowUser={() => {}}
                    onUnfollowUser={() => {}}
                    followerCount={0}
                    followingCount={0}
                    isFollowingUser={false}
                    setHeight={() => {}}
                />
                {/* moving away from the tabs for now  */}
                {/*
                    <ProfileBody newUser={user} setHeight={setBodyHeightWrapper} />
                    */}
                <SingleScrollUserBody key={random} user={user} setHeight={() => {}} />
            </ScrollView>
        </Screen>
    );
};
