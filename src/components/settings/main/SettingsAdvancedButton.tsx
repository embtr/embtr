import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MasterScreens, Routes } from 'src/navigation/RootStackParamList';
import { SettingsButtonElement } from '../generic/SettingsButtonElement';

export const SettingsAdvancedButton = () => {
    const navigation = useNavigation<StackNavigationProp<MasterScreens>>();

    const navigateToAdvanced = () => {
        navigation.navigate(Routes.ADVANCED_USER_SETTINGS);
    }

    return <SettingsButtonElement text={'Advanced'} icon={'cog-outline'} onPress={navigateToAdvanced} />;
};

