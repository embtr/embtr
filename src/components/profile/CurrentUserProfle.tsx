import * as React from 'react';
import { View } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { ProfileHeader } from 'src/components/profile/ProfileHeader';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { Screen } from 'src/components/common/screen';

interface Props {
    userProfileModel: UserProfileModel;
}

export const CurrentUserProfile = ({ userProfileModel }: Props) => {
    return (
        <Screen>
            <View>
                <Banner name='You' rightIcon={"cog-outline"} rightRoute="UserSettings" />

                <View style={{ alignItems: "center" }}>
                    <View style={{ width: isDesktopBrowser() ? "45%" : "100%" }}>
                        <ProfileHeader userProfileModel={userProfileModel} />
                    </View>
                </View>
            </View>
        </Screen>
    );
}