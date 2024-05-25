import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { PADDING_LARGE, POPPINS_MEDIUM } from 'src/util/constants';
import UserController, { UserCustomHooks } from 'src/controller/user/UserController';

export const GetPremiumWidget = () => {
    const { colors } = useTheme();

    const userIsPremium = UserCustomHooks.useUserIsPremium();
    if (userIsPremium) {
        return <View />;
    }

    return (
        <View>
            <View style={{ height: PADDING_LARGE }} />

            <WidgetBase backgroundColor={colors.accent_color_dim}>
                <Pressable
                    onPress={() => {
                        UserController.runPremiumWorkflow('Upgrade To Premium Widget');
                    }}
                >
                    <View>
                        <Text
                            style={{ color: colors.text, fontFamily: POPPINS_MEDIUM, fontSize: 16 }}
                        >
                            Upgrade To{' '}
                            <Text style={{ color: colors.accent_color_light }}>Premium</Text>
                        </Text>

                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 12,
                            }}
                        >
                            unlock a verified profile, advanced reminders, and more!
                        </Text>
                    </View>
                </Pressable>
            </WidgetBase>
        </View>
    );
};
