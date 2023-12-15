import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { SettingsDeleteAccount } from './SettingsDeleteAccount';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { ScrollView } from 'react-native-gesture-handler';

export const AdvancedUserSettings = () => {
    return (
        <Screen>
            <Banner name="Advanced Settings" leftIcon={'arrow-back'} leftRoute="BACK" />

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
                    <SettingsDeleteAccount />
                    <View style={{ height: TIMELINE_CARD_PADDING }} />
                </View>
            </ScrollView>
        </Screen>
    );
};
