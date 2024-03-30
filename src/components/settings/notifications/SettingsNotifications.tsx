import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { SettingsButtonElement } from '../generic/SettingsButtonElement';
import { Routes } from 'src/navigation/RootStackParamList';

export const SettingsNotifications = () => {
    const navigation = useEmbtrNavigation();

    return (
        <SettingsButtonElement
            text={'Notifications'}
            icon={'rocket-outline'}
            onPress={() => {
                navigation.navigate(Routes.USER_NOTIFICATIONS);
            }}
        />
    );
};
