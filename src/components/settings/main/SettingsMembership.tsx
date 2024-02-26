import { UserCustomHooks } from 'src/controller/user/UserController';
import { SettingsTextElement } from '../generic/SettingsTextElement';
import { UserService } from 'src/service/UserService';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TextStyle } from 'react-native';

export const SettingsMembership = () => {
    const currentUser = UserCustomHooks.useCurrentUser();
    const colors = useTheme().colors;

    const text = 'Membership';

    let value = 'Free';
    let color: TextStyle = {
        color: colors.secondary_text,
    };

    console.log(currentUser.data?.roles);

    if (currentUser.data?.roles && UserService.userHasPremiumRole(currentUser.data)) {
        value = 'Premium';
        color = {
            color: colors.accent_color_light,
        };
    }

    return (
        <SettingsTextElement
            text={text}
            secondaryText={value}
            thirdaryText={''}
            secondaryTextStyle={color}
        />
    );
};
