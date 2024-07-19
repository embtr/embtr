import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { POPPINS_MEDIUM } from 'src/util/constants';
import { UserCustomHooks } from 'src/controller/user/UserController';

export const GetPremiumWidget = () => {
    const { colors } = useTheme();

    const purchasePremiumWorkflow = UserCustomHooks.usePurchasePremium();

    const userIsPremium = UserCustomHooks.useUserIsPremium();
    if (userIsPremium) {
        return <View />;
    }

    return (
        <WidgetBase backgroundColor={colors.accent_color_soft}>
            <Pressable
                onPress={() => {
                    purchasePremiumWorkflow('Upgrade To Premium Widget');
                }}
            >
                <View>
                    <Text style={{ color: colors.text, fontFamily: POPPINS_MEDIUM, fontSize: 16 }}>
                        Upgrade To <Text style={{ color: colors.accent_color_light }}>Premium</Text>
                    </Text>

                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_MEDIUM,
                            fontSize: 12,
                            top: 2,
                        }}
                    >
                        Upgrade now to unlock detailed statistics, detailed reminders, streakhabit
                        preservation and much more!
                    </Text>
                </View>
            </Pressable>
        </WidgetBase>
    );
};
