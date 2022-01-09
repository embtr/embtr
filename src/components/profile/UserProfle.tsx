import * as React from 'react';
import { useAppSelector } from "src/redux/hooks";
import { View, SafeAreaView } from 'react-native';
import { Screen } from 'src/components/common/screen';
import { Banner } from 'src/components/common/Banner';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import ProfileController from 'src/controller/profile/ProfileController';
import { Profile } from 'src/components/profile/Profile';
import { ProfileHeader } from 'src/components/profile/ProfileHeader';

export const UserProfile = () => {

    const [userProfile, setUserProfile] = React.useState<Profile | undefined>(undefined);

    //React.useEffect(() => {
    //    ProfileController.getProfile(user.email!, (profile: Profile) => {
    //        setUserProfile(profile);
    //    });
    //}, [user]);

    return (
        <Screen>
            <SafeAreaView style={{ flex: 1 }}>
                <Banner name='You' rightIcon={"cog-outline"} rightRoute="UserSettings" />

                <View style={{ alignItems: "center" }}>
                    <View style={{ width: isDesktopBrowser() ? "45%" : "100%" }}>
                        <ProfileHeader profile={userProfile} />
                    </View>
                </View>



            </SafeAreaView>
        </Screen>

    );
}