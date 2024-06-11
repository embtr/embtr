import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { PADDING_LARGE, POPPINS_MEDIUM } from 'src/util/constants';
import {
    UserPropertyController,
    UserPropertyCustomHooks,
} from 'src/controller/user/UserPropertyController';
import { Constants } from 'resources/types/constants/constants';
import UserController from 'src/controller/user/UserController';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const AwayModeWidget = () => {
    const { colors } = useTheme();

    const awayModeSetting = UserPropertyCustomHooks.useAwayModeSetting();
    const userIsAway = awayModeSetting.data === Constants.AwayMode.ENABLED;

    const toggleAwayMode = async () => {
        await UserPropertyController.setAwayMode(Constants.AwayMode.DISABLED);
        UserController.invalidateCurrentUser();
        awayModeSetting.refetch();
    };

    if (!userIsAway) {
        return <View />;
    }

    return (
        <WidgetBase backgroundColor={'#224377'}>
            <TouchableOpacity
                onPress={() => {
                    toggleAwayMode();
                }}
            >
                <View>
                    <Text style={{ color: colors.text, fontFamily: POPPINS_MEDIUM, fontSize: 16 }}>
                        You Are <Text style={{ color: colors.accent_color_light }}>Away</Text>
                    </Text>

                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_MEDIUM,
                            fontSize: 12,
                        }}
                    >
                        press here to turn off away mode and get back to the action!
                    </Text>
                </View>
            </TouchableOpacity>
        </WidgetBase>
    );
};
