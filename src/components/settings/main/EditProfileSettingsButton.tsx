import { MasterScreens } from 'src/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { SettingsButtonElement } from '../generic/SettingsButtonElement';

export const EditProfileSettingsButton = () => {
    const navigation = useNavigation<StackNavigationProp<MasterScreens>>();

    return (
        <SettingsButtonElement
            text={'Edit Profile'}
            icon={'pencil-sharp'}
            onPress={() => {
                navigation.navigate('EditUserProfile');
            }}
        />
    );
};
