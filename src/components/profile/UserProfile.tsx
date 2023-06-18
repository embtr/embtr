import { ProfileHeader } from 'src/components/profile/profile_component/ProfileHeader';
import { Screen } from 'src/components/common/Screen';
import { RouteProp, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import UserController from 'src/controller/user/UserController';
import { User } from 'resources/schema';
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { SingleScrollUserBody } from 'src/components/profile/profile_component/single_scroll/SingleScrollUserBody';

export const UserProfile = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'UserProfile'>>();
    const [user, setUser] = React.useState<User>();

    const fetchNewUser = async () => {
        const newUser = await UserController.getUserByUidViaApi(route.params.id);
        setUser(newUser.user);
    };

    const fetchInitial = () => {
        fetchNewUser();
    };

    React.useEffect(() => {
        fetchInitial();
    }, [route.params.id]);

    if (!user) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    return (
        <Screen>
            <Banner name="User Profile" leftIcon={'arrow-back'} leftRoute="BACK" />
            <EmbtrMenuCustom />
            <ScrollView showsVerticalScrollIndicator={false}>
                <ProfileHeader user={user} setHeight={() => {}} />
                <SingleScrollUserBody user={user} setHeight={() => {}} />
            </ScrollView>
        </Screen>
    );
};
