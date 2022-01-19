import * as React from 'react';
import { View } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { ProfileHeader } from 'src/components/profile/profile_component/ProfileHeader';
import { Screen } from 'src/components/common/Screen';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import FollowerController from 'src/controller/follower/FollowerController';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { ProfileBody } from 'src/components/profile/profile_component/ProfileBody';

export const UserProfile = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'UserProfile'>>();

    const [user, setUser] = React.useState<UserProfileModel | undefined>(undefined);
    const [isFollowingUser, setIsFollowingUser] = React.useState(false);

    const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(undefined);
    React.useEffect(() => {
        getCurrentUserUid(setCurrentUserId);
    }, []);

    const onFollowUser = (uid: string) => {
        setIsFollowingUser(true);
    };

    const onUnfollowUser = (uid: string) => {
        setIsFollowingUser(false);
    };

    useFocusEffect(
        React.useCallback(() => {
            if (!route.params.id || !currentUserId) {
                return;
            }

            ProfileController.getProfile(route.params.id, (user: UserProfileModel) => {
                setUser(user);
            });

            FollowerController.isFollowingUser(currentUserId, route.params.id, setIsFollowingUser);

        }, [currentUserId, route.params.id])
    );

    return (
        <Screen>
            <View>
                <Banner name='User Profile' leftIcon={"arrow-back"} leftRoute="BACK" />

                <View style={{ alignItems: "center" }}>
                    <View style={{ width: isDesktopBrowser() ? "45%" : "100%" }}>
                        <ProfileHeader userProfileModel={user} onFollowUser={onFollowUser} onUnfollowUser={onUnfollowUser} isFollowingUser={isFollowingUser} />
                        {user && <ProfileBody userProfileModel={user} />}
                    </View>
                </View>
            </View>
        </Screen>
    );
}