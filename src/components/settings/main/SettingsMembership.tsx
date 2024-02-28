import { UserCustomHooks } from 'src/controller/user/UserController';
import { SettingsTextElement } from '../generic/SettingsTextElement';
import { UserService } from 'src/service/UserService';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TextStyle } from 'react-native';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';

export const SettingsMembership = () => {
    const navigation = useEmbtrNavigation();

    const currentUser = UserCustomHooks.useCurrentUser();
    const colors = useTheme().colors;

    const onPress = () => {
        navigation.navigate(Routes.PREMIUM_MODAL);
    };

    const text = 'Membership';

    let value = 'Free';
    let color: TextStyle = {
        color: colors.secondary_text,
    };

    if (currentUser.data?.roles && UserService.userHasPremiumRole(currentUser.data)) {
        value = 'Premium';
        color = {
            color: colors.accent_color_light,
        };
    }

    return (
        <SettingsTextElement
            onPress={onPress}
            text={text}
            secondaryText={value}
            secondaryTextStyle={color}
            thirdaryText={'Get Premium'}
        />
    );
};
