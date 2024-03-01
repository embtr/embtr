import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { SettingsAccount } from './SettingsAccount';
import { SettingsMembership } from './SettingsMembership';
import { SettingsSignOut } from './SettingsSignOut';
import { SettingsAdvancedButton } from './SettingsAdvancedButton';
import { EditProfileSettingsButton } from './EditProfileSettingsButton';
import { SettingsVersion } from './SettingsVersion';
import { PADDING_LARGE } from 'src/util/constants';
import { ScrollView } from 'react-native-gesture-handler';

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
                        paddingHorizontal: PADDING_LARGE,
                    }}
                >
                    <View style={{ height: PADDING_LARGE }} />
                    {/*<NotificationsToggle />*/}
                    {/*<View style={{ height: TIMELINE_CARD_PADDING / 2 }} />*/}
                    <EditProfileSettingsButton />
                    <View style={{ height: PADDING_LARGE / 2 }} />
                    <SettingsAccount />
                    <View style={{ height: PADDING_LARGE / 2 }} />
                    <SettingsMembership />
                    <View style={{ height: PADDING_LARGE / 2 }} />
                    <SettingsSignOut />
                    <View style={{ height: PADDING_LARGE / 2 }} />
                    <SettingsAdvancedButton />
                    <View style={{ height: PADDING_LARGE / 2 }} />
                    <SettingsVersion />
                    <View style={{ height: PADDING_LARGE }} />
                </View>
            </ScrollView>
        </Screen>
    );
};
