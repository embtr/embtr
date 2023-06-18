import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { ProfileHeader } from 'src/components/profile/profile_component/ProfileHeader';
import { ProfileBody } from 'src/components/profile/profile_component/ProfileBody';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { wait } from 'src/util/GeneralUtility';
import { getAuth } from 'firebase/auth';
import { useSharedValue } from 'react-native-reanimated';
import { User } from 'resources/schema';
import UserController from 'src/controller/user/UserController';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import { SingleScrollUserBody } from 'src/components/profile/profile_component/single_scroll/SingleScrollUserBody';

export const CurrentUserProfile = () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [refreshedTimestamp, setRefreshedTimestamp] = React.useState<Date>(new Date());
    const [user, setUser] = React.useState<User>();
    const [bodyHeight, setBodyHeight] = React.useState<number>(10000);
    const [headerHeight, setHeaderHeight] = React.useState<number>(1000);

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
            setRefreshedTimestamp(new Date());
        });
    }, []);

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
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const setBodyHeightWrapper = (n: number) => {
        if (n > 30) {
            setBodyHeight(n);
        }
    };

    const setHeaderHeightWrapper = (n: number) => {
        if (n > 30) {
            setHeaderHeight(n);
        }
    };

    if (!user) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    return (
        <Screen>
            <Banner name="You" rightIcon={'cog-outline'} rightRoute="UserSettings" />
            <EmbtrMenuCustom />
            <ScrollView>
                <ProfileHeader
                    user={user}
                    onFollowUser={() => {}}
                    onUnfollowUser={() => {}}
                    followerCount={0}
                    followingCount={0}
                    isFollowingUser={false}
                    setHeight={setHeaderHeightWrapper}
                />

                {/* moving away from the tabs for now  */}

                {/*
                    <ProfileBody newUser={user} setHeight={setBodyHeightWrapper} />
                    */}

                <SingleScrollUserBody user={user} setHeight={setBodyHeight} />
            </ScrollView>
        </Screen>
    );
};
