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

export const UserProfile = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'UserProfile'>>();

    const [isFollowingUser, setIsFollowingUser] = React.useState(false);
    
    const onFollowUser = (uid: string) => {
        setIsFollowingUser(true);
        FollowerController.followUser(getCurrentUserUid(), uid, () => {})
    };

    const onUnfollowUser = (uid: string) => {
        setIsFollowingUser(false);
        FollowerController.unfollowUser(getCurrentUserUid(), uid, () => {})
    };

    useFocusEffect(
        React.useCallback(() => {
            FollowerController.isFollowingUser(getCurrentUserUid(), route.params.userProfileModel.uid!, setIsFollowingUser);

        }, [getCurrentUserUid(), route.params.userProfileModel.uid])
    );

    return (
        <Screen>
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <Banner name='You' leftIcon={"arrow-back"} leftRoute="BACK" />

                    <View style={{ alignItems: "center" }}>
                        <View style={{ width: isDesktopBrowser() ? "45%" : "100%" }}>
                            <ProfileHeader userProfileModel={route.params.userProfileModel} onFollowUser={onFollowUser} onUnfollowUser={onUnfollowUser} isFollowingUser={isFollowingUser} />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Screen>
    );
}