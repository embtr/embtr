import * as React from 'react';
import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { ThemeToggle } from 'src/components/theme/ThemeToggle';
import { getAuth } from 'firebase/auth';
import { useAppDispatch } from 'src/redux/Hooks';
import { setAccessLevel } from 'src/redux/user/GlobalState';
import { NotificationsToggle } from 'src/components/settings/NotificationsToggle';
import { SettingsButtonElement } from 'src/components/settings/SettingsButtonElement';
import { SettingsVersion } from 'src/components/settings/SettingsVersion';
import { EditProfileSettingsButton } from 'src/components/settings/EditProfileSettingsButton';
import { SettingsFeedback } from 'src/components/settings/SettingsFeedback';
import { useNavigation } from '@react-navigation/native';
import { EmbtrButton2 } from 'src/components/common/button/EmbtrButton2';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileTabScreens } from 'src/navigation/RootStackParamList';
import { EditUserProfile } from './EditUserProfile';

export const UserSettings = () => {
    const dispatch = useAppDispatch();

    const navigation = useNavigation<StackNavigationProp<ProfileTabScreens>>();

    const navigateToEditUserProfile = () => {
        navigation.navigate('EditUserProfile');
    }

    return (
        <Screen>
            <Banner name='Settings' leftIcon={"arrow-back"} leftRoute="BACK" />

            <View style={{ flex: 1, flexDirection: 'column', alignItems: "center" }}>
                <View style={{ paddingTop: 10 }}>
                    <ThemeToggle />
                </View>

                <View style={{ paddingTop: 10, alignItems: "center" }}>
                    <EmbtrButton2 text={"Edit Profile"} icon={"ios-pencil-sharp"} onPress={() => { navigateToEditUserProfile() }} />
                </View>

                <View style={{ paddingTop: 10 }}>
                    <NotificationsToggle />

                    <View style={{ paddingTop: 10, alignItems: "center" }}>
                        <EditProfileSettingsButton />
                    </View>

                    <View style={{ paddingTop: 10, alignItems: "center" }}>
                        <SettingsButtonElement text={"Edit Pillars"} icon={"pillar"} onPress={() => { alert("Tell Brent to get this working!") }} />
                    </View>

                    <View style={{ paddingTop: 10, alignItems: "center" }}>
                        <SettingsFeedback />
                    </View>

                    <View style={{ paddingTop: 10, alignItems: "center" }}>
                        <SettingsButtonElement text={"Sign Out"} icon={"exit-outline"} onPress={() => { getAuth().signOut(); dispatch(setAccessLevel("invalid")); }} />
                    </View>

                    <View style={{ paddingTop: 10, alignItems: "center" }}>
                        <SettingsVersion />
                    </View>
                </View>
            </View>
        </Screen>
    );
}
