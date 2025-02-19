import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { SettingsButtonElement } from '../generic/SettingsButtonElement';
import { Routes } from 'src/navigation/RootStackParamList';
import { View } from 'react-native';
import { PADDING_SMALL } from 'src/util/constants';
import { PremiumFeatureBadge } from 'src/components/common/PremiumFeatureBadge';

export const SettingsNotifications = () => {
    const navigation = useEmbtrNavigation();

    return (
        <View>
            <View
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    right: 0,
                    marginTop: PADDING_SMALL * 0.75,
                    marginRight: PADDING_SMALL * 0.75,
                }}
            >
                <PremiumFeatureBadge tiny />
            </View>
            <SettingsButtonElement
                text={'Notifications'}
                icon={'rocket-outline'}
                onPress={() => {
                    navigation.navigate(Routes.USER_NOTIFICATIONS);
                }}
            />
        </View>
    );
};
