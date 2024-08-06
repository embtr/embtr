import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { PADDING_LARGE, POPPINS_MEDIUM } from 'src/util/constants';
import { Constants } from 'resources/types/constants/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { User } from 'resources/schema';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { Ionicons } from '@expo/vector-icons';
import { UserPropertyUtil } from 'src/util/UserPropertyUtil';

interface Props {
    user: User;
}

export const SocialBlacklistWidget = ({ user }: Props) => {
    const { colors } = useTheme();

    const isCurrentUser = getCurrentUid() === user.uid;
    const messagePrefix = isCurrentUser ? 'You are ' : `${user.displayName} is `;
    const messageBody = isCurrentUser
        ? 'We have detected some suspicious activity on your account and have limited some features.\n\nPlease email blacklisted@embtr.com for support.'
        : `${user.displayName} has limited access to social features due to suspicious activity.`;

    const userIsSocialBlacklisted = UserPropertyUtil.isSocialBlacklisted(user);

    const toggleAwayMode = async () => { };

    if (!userIsSocialBlacklisted) {
        return <View />;
    }

    return (
        <WidgetBase backgroundColor={'#660000'}>
            <TouchableOpacity
                disabled={!isCurrentUser}
                onPress={() => {
                    toggleAwayMode();
                }}
            >
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ paddingRight: PADDING_LARGE, justifyContent: 'center' }}>
                        <Ionicons style={{ left: 2 }} name={'ban'} size={40} color={colors.link} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{ color: colors.text, fontFamily: POPPINS_MEDIUM, fontSize: 16 }}
                        >
                            {messagePrefix}
                            <Text style={{ color: colors.accent_color_light }}>Limited</Text>
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
                </View>
            </TouchableOpacity>
        </WidgetBase>
    );
};
