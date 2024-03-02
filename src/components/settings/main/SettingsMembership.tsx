import React from 'react';
import UserController, { UserCustomHooks } from 'src/controller/user/UserController';
import { SettingsTextElement } from '../generic/SettingsTextElement';
import { UserService } from 'src/service/UserService';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TextStyle } from 'react-native';
import { RevenueCat } from 'src/controller/revenuecat/RevenueCat';
import { RevenueCatImpl } from 'src/controller/revenuecat/RevenueCatImpl';

const text = 'Membership';

export const SettingsMembership = () => {
    const revenueCat: RevenueCat = new RevenueCatImpl();

    const currentUser = UserCustomHooks.useCurrentUser();
    const colors = useTheme().colors;

    const [premiumPurchased, setPremiumPurchased] = React.useState(false);

    const purchasePremium = async () => {
        const purchased = await revenueCat.executePaywallWorkflow();
        await UserController.forceRefreshIdToken();
        setPremiumPurchased(purchased);
    };

    const isPremium =
        premiumPurchased ||
        (currentUser.data?.roles && UserService.userHasPremiumRole(currentUser.data));

    const onPress = isPremium ? undefined : purchasePremium;
    const thirdaryText = isPremium ? '' : 'Get Premium';
    const value = isPremium ? 'Premium' : 'Free';
    const color: TextStyle = {
        color: isPremium ? colors.accent_color_light : colors.secondary_text,
    };

    return (
        <SettingsTextElement
            onPress={onPress}
            text={text}
            secondaryText={value}
            secondaryTextStyle={color}
            thirdaryText={thirdaryText}
        />
    );
};
