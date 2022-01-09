import * as React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Screen } from 'src/components/common/screen';
import { Banner } from 'src/components/common/Banner';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { ProfileHeader } from 'src/components/profile/ProfileHeader';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { getCurrentUserEmail } from 'src/session/CurrentUserProvider';

export const UserProfile = () => {

    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);

    React.useEffect(() => {
        ProfileController.getProfile(getCurrentUserEmail()!, (profile: UserProfileModel) => {
            setUserProfileModel(profile);
        });
    }, []);

    return (
        <Screen>
            <SafeAreaView style={{ flex: 1 }}>
                <Banner name='You' rightIcon={"cog-outline"} rightRoute="UserSettings" />

                <View style={{ alignItems: "center" }}>
                    <View style={{ width: isDesktopBrowser() ? "45%" : "100%" }}>
                        <ProfileHeader userProfileModel={userProfileModel} />
                    </View>
                </View>

            </SafeAreaView>
        </Screen>

    );
}