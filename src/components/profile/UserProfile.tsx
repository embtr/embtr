import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { ProfileHeader } from 'src/components/profile/ProfileHeader';
import { Screen } from 'src/components/common/screen';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import FollowerController from 'src/controller/follower/FollowerController';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';

export const UserProfile = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'UserProfile'>>();

    const [user, setUser] = React.useState<UserProfileModel | undefined>(undefined);
    const [isFollowingUser, setIsFollowingUser] = React.useState(false);

    const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(undefined);
    React.useEffect(() => {
        getCurrentUserUid(setCurrentUserId);
    }, []);

    const onFollowUser = (uid: string) => {
        setIsFollowingUser(true);
        if (currentUserId) {
            FollowerController.followUser(currentUserId, uid, () => { })
        }
    };

    const onUnfollowUser = (uid: string) => {
        setIsFollowingUser(false);
        if (currentUserId) {
            FollowerController.unfollowUser(currentUserId, uid, () => { })
        }
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
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <Banner name='You' leftIcon={"arrow-back"} leftRoute="BACK" />

                    <View style={{ alignItems: "center" }}>
                        <View style={{ width: isDesktopBrowser() ? "45%" : "100%" }}>
                            <ProfileHeader userProfileModel={user} onFollowUser={onFollowUser} onUnfollowUser={onUnfollowUser} isFollowingUser={isFollowingUser} />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Screen>
    );
}