import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { SettingsAccount } from './SettingsAccount';
import { SettingsMembership } from './SettingsMembership';
import { SettingsSignOut } from './SettingsSignOut';
import { SettingsClearCache } from './SettingsClearCache';
import { SettingsAdvancedButton } from './SettingsAdvancedButton';
import { NotificationsToggle } from './NotificationsToggle';
import { EditProfileSettingsButton } from './EditProfileSettingsButton';
import { SettingsVersion } from './SettingsVersion';

export const UserSettings = () => {

    return (
        <Screen>
            <Banner name="Settings" leftIcon={'arrow-back'} leftRoute="BACK" />

            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {/* <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <ThemeToggle />
                </View> */}

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
                    <SettingsClearCache />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <SettingsSignOut />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <SettingsAdvancedButton />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <SettingsVersion />
                </View>
            </View>
        </Screen>
    );
};
