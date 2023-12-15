import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { NotificationsToggle } from 'src/components/settings/NotificationsToggle';

export const AdvancedUserSettings = () => {
    return (
        <Screen>
            <Banner name="Settings" leftIcon={'arrow-back'} leftRoute="BACK" />

            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <NotificationsToggle />
                </View>
            </View>
        </Screen>
    );
};
