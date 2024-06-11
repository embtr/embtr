import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { SettingsButtonElement } from '../generic/SettingsButtonElement';
import { Routes } from 'src/navigation/RootStackParamList';
import { View } from 'react-native';
import { PADDING_SMALL } from 'src/util/constants';
import { PremiumFeatureBadge } from 'src/components/common/PremiumFeatureBadge';

export const SettingsAwayMode = () => {
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
                text={'Away Mode'}
                icon={'airplane-outline'}
                onPress={() => {
                    navigation.navigate(Routes.AWAY_MODE);
                }}
            />
        </View>
    );
};
