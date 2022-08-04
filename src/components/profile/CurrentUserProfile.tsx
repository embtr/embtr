import * as React from 'react';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import { Screen } from 'src/components/common/Screen';
import { ScrollView, View } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { ProfileHeader } from 'src/components/profile/profile_component/ProfileHeader';
import { ProfileBody } from 'src/components/profile/profile_component/ProfileBody';
import { useFocusEffect } from '@react-navigation/native';
import FollowerController, { FollowCounts } from 'src/controller/follower/FollowerController';


export const CurrentUserProfile = () => {

    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);
    const [followerCount, setFollowerCount] = React.useState<number>(0);
    const [followingCount, setFollowingCount] = React.useState<number>(0);

    const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(undefined);
    useFocusEffect(
        React.useCallback(() => {
            getCurrentUserUid(setCurrentUserId);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            if (!userProfileModel?.uid) {
                return;
            }

            FollowerController.getFollowCounts(userProfileModel.uid, (followCounts: FollowCounts) => {
                setFollowerCount(followCounts.follower_count);
                setFollowingCount(followCounts.following_count);
            });

        }, [userProfileModel])
    );

    useFocusEffect(
        React.useCallback(() => {
            if (currentUserId) {
                ProfileController.getProfile(currentUserId, (profile: UserProfileModel) => {
                    setUserProfileModel(profile);
                });
            }
        }, [currentUserId])
    );

    return (
        <Screen>
            <Banner name='You' rightIcon={"cog-outline"} rightRoute="UserSettings" />

            <ScrollView>
                <View style={{ alignItems: "center" }}>
                    <View style={{ width: isDesktopBrowser() ? "45%" : "100%" }}>
                        <ProfileHeader userProfileModel={userProfileModel} onFollowUser={() => { }} onUnfollowUser={() => { }} followerCount={followerCount} followingCount={followingCount} isFollowingUser={false} />
                        {userProfileModel && <ProfileBody userProfileModel={userProfileModel} />}
                    </View>
                </View>
            </ScrollView>
        </Screen>
    )

}