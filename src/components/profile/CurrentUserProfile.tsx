import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { ProfileHeader } from 'src/components/profile/profile_component/ProfileHeader';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { wait } from 'src/util/GeneralUtility';
import { RefreshControl, ScrollView, View } from 'react-native';
import { SingleScrollUserBody } from 'src/components/profile/profile_component/single_scroll/SingleScrollUserBody';
import { UserCustomHooks } from 'src/controller/user/UserController';
import { User } from 'resources/schema';

interface Props {
    user: User;
}

export const CurrentUserProfileImpl = ({ user }: Props) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [random, setRandom] = React.useState<number>(0);

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
            <Banner
                name="You"
                rightIcon={'cog-outline'}
                rightRoute="UserSettings"
                innerRightPoints={true}
            />
            <EmbtrMenuCustom />
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <ProfileHeader user={user} setHeight={() => { }} />
                {/* moving away from the tabs for now  */}
                {/*
                    <ProfileBody newUser={user} setHeight={setBodyHeightWrapper} />
                    */}
                <SingleScrollUserBody key={random} user={user} setHeight={() => { }} />
            </ScrollView>
        </Screen>
    );
};

export const CurrentUserProfile = () => {
    const user = UserCustomHooks.useCurrentUser();
    if (!user.data) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    return <CurrentUserProfileImpl user={user.data} />;
};
