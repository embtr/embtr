import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { SettingsButtonElement } from '../generic/SettingsButtonElement';
import { Routes } from 'src/navigation/RootStackParamList';
import { View } from 'react-native';

export const SettingsFeatureVote = () => {
    const navigation = useEmbtrNavigation();

    return (
        <View>
            <SettingsButtonElement
                text={'New Feature Vote'}
                icon={'vote-outline'}
                onPress={() => {
                    navigation.navigate(Routes.FEATURE_VOTE);
                }}
            />
        </View>
    );
};
