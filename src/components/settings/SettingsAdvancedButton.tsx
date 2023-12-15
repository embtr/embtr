import { useNavigation } from '@react-navigation/native';
import { SettingsButtonElement } from './SettingsButtonElement';
import { StackNavigationProp } from '@react-navigation/stack';
import { MasterScreens, RootStackParamList, Routes } from 'src/navigation/RootStackParamList';

export const SettingsAdvancedButton = () => {
    const navigation = useNavigation<StackNavigationProp<MasterScreens>>();

    const navigateToAdvanced = () => {
        navigation.navigate(Routes.ADVANCED_USER_SETTINGS);
    }

    return <SettingsButtonElement text={'Advanced'} icon={'cog-outline'} onPress={navigateToAdvanced} />;
};

