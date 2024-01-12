import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { SettingsDeleteAccount } from './SettingsDeleteAccount';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { ScrollView } from 'react-native-gesture-handler';
import { SettingsTextDetailedElement } from '../generic/SettingsTextDetailedElement';
import { SettingsClearCache } from 'src/components/settings/main/SettingsClearCache';

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
                    <SettingsClearCache />
                    <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />
                    <SettingsDeleteAccount />
                    <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />
                    <SettingsTextDetailedElement
                        firstaryText={'Request Data'}
                        secondaryText={
                            'To request a copy of your data, please email gdpr@embtr.com'
                        }
                    />
                    <View style={{ height: TIMELINE_CARD_PADDING }} />
                </View>
            </ScrollView>
        </Screen>
    );
};
