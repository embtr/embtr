import { ProfileHeader } from 'src/components/profile/profile_component/ProfileHeader';
import { Screen } from 'src/components/common/Screen';
import { RouteProp, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import UserController from 'src/controller/user/UserController';
import { User } from 'resources/schema';
import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { SingleScrollUserBody } from 'src/components/profile/profile_component/single_scroll/SingleScrollUserBody';
import { TimelineController } from 'src/controller/timeline/TimelineController';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';

export const UserProfile = () => {
    const navigation = useEmbtrNavigation();
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

    const onOptionsPressed = () => {
        Alert.alert(
            'User Options',
            '',
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Block User',
                    onPress: async () => {
                        if (!user.id) {
                            return;
                        }

                        await UserController.blockUser(user.id);
                        await TimelineController.invalidateCache();

                        Alert.alert(
                            'User Is Blocked',
                            'You will no longer see this user in your feed.',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        navigation.goBack();
                                    },
                                },
                            ]
                        );
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <Screen>
            <Banner
                name="User Profile"
                leftIcon={'arrow-back'}
                rightIcon={'ellipsis-horizontal-outline'}
                rightOnClick={onOptionsPressed}
                leftRoute="BACK"
            />
            <EmbtrMenuCustom />
            <ScrollView showsVerticalScrollIndicator={false}>
                <ProfileHeader user={user} setHeight={() => {}} />
                <SingleScrollUserBody user={user} setHeight={() => {}} />
            </ScrollView>
        </Screen>
    );
};
