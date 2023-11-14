import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { ThemeToggle } from 'src/components/theme/ThemeToggle';
import { getAuth } from 'firebase/auth';
import { NotificationsToggle } from 'src/components/settings/NotificationsToggle';
import { SettingsButtonElement } from 'src/components/settings/SettingsButtonElement';
import { SettingsVersion } from 'src/components/settings/SettingsVersion';
import { EditProfileSettingsButton } from 'src/components/settings/EditProfileSettingsButton';
import UserController from 'src/controller/user/UserController';
import { SettingsAccount } from '../settings/SettingsAccount';
import { SettingsMembership } from '../settings/SettingsMembership';
import { useAppDispatch } from 'src/redux/Hooks';
import { setCurrentUser, setUserProfileImage } from 'src/redux/user/GlobalState';
import { SettingsSignOut } from '../settings/SettingsSignOut';

export const UserSettings = () => {
    const dispatch = useAppDispatch();

    return (
        <Screen>
            <Banner name="Settings" leftIcon={'arrow-back'} leftRoute="BACK" />

            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <ThemeToggle />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <NotificationsToggle />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <EditProfileSettingsButton />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <SettingsAccount />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <SettingsMembership />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <SettingsSignOut />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <SettingsVersion />
                </View>
            </View>
        </Screen>
    );
};
