import * as React from 'react';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import { Screen } from 'src/components/common/screen';
import { View } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { ProfileHeader } from 'src/components/profile/ProfileHeader';


export const CurrentUserProfile = () => {

    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);

    const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(undefined);
    React.useEffect(() => {
        getCurrentUserUid(setCurrentUserId);
    }, []);

    React.useEffect(() => {
        if (currentUserId) {
            ProfileController.getProfile(currentUserId, (profile: UserProfileModel) => {
                setUserProfileModel(profile);
            });
        }
    }, [currentUserId]);

    return (
        <Screen>
            <View>
                <Banner name='You' rightIcon={"cog-outline"} rightRoute="UserSettings" />

                <View style={{ alignItems: "center" }}>
                    <View style={{ width: isDesktopBrowser() ? "45%" : "100%" }}>
                        <ProfileHeader userProfileModel={userProfileModel} onFollowUser={() => { }} onUnfollowUser={() => { }} isFollowingUser={false} />
                    </View>
                </View>
            </View>
        </Screen>
    )

}