import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MasterScreens } from 'src/navigation/RootStackParamList';

export const useEmbtrNavigation = () => {
    const navigation = useNavigation<StackNavigationProp<MasterScreens>>();

    return navigation;
};
