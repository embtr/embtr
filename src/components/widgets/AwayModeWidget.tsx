import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { POPPINS_MEDIUM } from 'src/util/constants';
import { UserPropertyController } from 'src/controller/user/UserPropertyController';
import { Constants } from 'resources/types/constants/constants';
import UserController, { UserCustomHooks } from 'src/controller/user/UserController';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { User } from 'resources/schema';

interface ImplProps {
    currentUserId: number;
    user: User;
}

export const AwayModeWidgetImpl = ({ currentUserId, user }: ImplProps) => {
    const { colors } = useTheme();

    const isCurrentUser = currentUserId === user.id;
    const messagePrefix = isCurrentUser ? 'You are ' : `${user.displayName} is `;
    const messageBody = isCurrentUser
        ? 'Press here to turn off away mode and get back to the action!'
        : 'While away, habit notifications are silenced and streak data is preserved.';

    const userIsAway = user.properties?.some(
        (property) =>
            property.key === Constants.UserPropertyKey.AWAY_MODE &&
            property.value === Constants.AwayMode.ENABLED
    );

    const toggleAwayMode = async () => {
        await UserPropertyController.setAwayMode(Constants.AwayMode.DISABLED);
        UserController.invalidateCurrentUser();
        UserController.invalidateUser(user.uid ?? '');
    };

    if (!userIsAway) {
        return <View />;
    }

    return (
        <WidgetBase backgroundColor={'#224377'}>
            <TouchableOpacity
                disabled={!isCurrentUser}
                onPress={() => {
                    toggleAwayMode();
                }}
            >
                <View>
                    <Text style={{ color: colors.text, fontFamily: POPPINS_MEDIUM, fontSize: 16 }}>
                        {messagePrefix}
                        <Text style={{ color: colors.accent_color_light }}>Away</Text>
                    </Text>

                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_MEDIUM,
                            fontSize: 12,
                        }}
                    >
                        {messageBody}
                    </Text>
                </View>
            </TouchableOpacity>
        </WidgetBase>
    );
};

interface Props {
    user: User;
}

export const AwayModeWidget = ({ user }: Props) => {
    const currentUserId = UserCustomHooks.useCurrentUserId();
    if (!currentUserId.data) {
        return null;
    }

    return <AwayModeWidgetImpl currentUserId={currentUserId.data} user={user} />;
};
