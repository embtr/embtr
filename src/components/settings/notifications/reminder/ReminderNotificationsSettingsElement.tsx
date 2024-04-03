import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import {
    PADDING_LARGE,
    PADDING_SMALL,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
} from 'src/util/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Constants } from 'resources/types/constants/constants';
import UserController from 'src/controller/user/UserController';

interface Props {
    title: string;
    description: string;
    option: Constants.ReminderNotificationSetting;
    selected: boolean;
    premiumRequired?: boolean;
    hasPremium?: boolean;
    onPress: (option: Constants.ReminderNotificationSetting) => void;
}

export const ReminderNotificationsSettingsElement = ({
    title,
    description,
    option,
    selected,
    premiumRequired,
    hasPremium,
    onPress,
}: Props) => {
    const { colors } = useTheme();

    const hasInsufficientPremium = premiumRequired && !hasPremium;
    const handlePress = () => {
        if (!hasInsufficientPremium) {
            onPress(option);
        } else {
            UserController.runPremiumWorkflow();
        }
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <View>
                {premiumRequired && (
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 1,
                            right: 0,
                            marginTop: PADDING_SMALL,
                            marginRight: PADDING_SMALL,
                            backgroundColor: colors.accent_color_light,
                            borderRadius: 50,
                            height: 13,
                            paddingHorizontal: PADDING_SMALL,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: POPPINS_SEMI_BOLD,
                                fontSize: 9,
                                color: colors.text,
                                textAlign: 'center',
                            }}
                        >
                            Embtr Premium
                        </Text>
                    </View>
                )}
                <View
                    style={{
                        borderColor: '#404040',
                        backgroundColor: selected ? colors.accent_color_dim : '#343434',
                        borderWidth: 1,
                        borderRadius: 5,
                        flexDirection: 'row',
                        paddingVertical: PADDING_SMALL,
                        paddingHorizontal: PADDING_SMALL,
                        opacity: hasInsufficientPremium ? 0.5 : 1,
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                        }}
                    >
                        {hasInsufficientPremium ? (
                            <Ionicons name={'lock-closed'} size={10} color={'gold'} />
                        ) : (
                            <View
                                style={{
                                    height: 10,
                                    width: 10,
                                    bottom: 1,
                                    borderRadius: 25,
                                    backgroundColor: selected
                                        ? colors.accent_color_light
                                        : colors.secondary_text,
                                }}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: PADDING_LARGE,
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                style={{
                                    color: colors.text,
                                    includeFontPadding: false,
                                    fontSize: 16,
                                    fontFamily: POPPINS_REGULAR,
                                }}
                            >
                                {title}
                            </Text>

                            <View style={{ flex: 1 }} />
                        </View>

                        <Text
                            style={{
                                color: colors.secondary_text,
                                paddingTop: PADDING_SMALL,
                                fontSize: 13,
                                includeFontPadding: false,
                                fontFamily: POPPINS_REGULAR,
                            }}
                        >
                            {description}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
