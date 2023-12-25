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
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { ScrollView } from 'react-native-gesture-handler';
import { SettingsPing } from './SettingsPing';
import { SettingsDatabasePing } from './SettingsDatabasePing';

export const UserSettings = () => {
    return (
        <Screen>
            <Banner name="Settings" leftIcon={'arrow-back'} leftRoute="BACK" />

            <ScrollView>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        paddingHorizontal: TIMELINE_CARD_PADDING / 2,
                    }}
                >
                    <View style={{ height: TIMELINE_CARD_PADDING }} />
                    <NotificationsToggle />
                    <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />
                    <EditProfileSettingsButton />
                    <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />
                    <SettingsAccount />
                    <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />
                    <SettingsMembership />
                    <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />
                    <SettingsClearCache />
                    <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />
                    <SettingsDatabasePing />
                    <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />
                    <SettingsPing />
                    <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />
                    <SettingsSignOut />
                    <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />
                    <SettingsAdvancedButton />
                    <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />
                    <SettingsVersion />
                    <View style={{ height: TIMELINE_CARD_PADDING }} />
                </View>
            </ScrollView>
        </Screen>
    );
};
