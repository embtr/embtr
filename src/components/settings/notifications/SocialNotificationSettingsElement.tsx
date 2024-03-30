import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_REGULAR } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Constants } from 'resources/types/constants/constants';

export enum SocialNotificationsSettingsOption {
    OFF = 'OFF',
    DAILY = 'DAILY',
    TIME_OF_DAY = 'TIME_OF_DAY',
}

interface Props {
    title: string;
    description: string;
    option: Constants.SocialNotificationsSetting;
    selected: boolean;
    onPress: (option: Constants.SocialNotificationsSetting) => void;
}

export const SocialNotificationsSettingsElement = ({
    title,
    description,
    option,
    selected,
    onPress,
}: Props) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            onPress={() => onPress(option)}
            style={{
                borderColor: '#404040',
                backgroundColor: selected ? colors.accent_color_dim : '#343434',
                borderWidth: 1,
                borderRadius: 5,
                flexDirection: 'row',
                paddingVertical: PADDING_SMALL,
                paddingHorizontal: PADDING_SMALL,
            }}
        >
            <View
                style={{
                    justifyContent: 'center',
                }}
            >
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
            </View>
            <View
                style={{
                    flex: 1,
                    paddingLeft: PADDING_LARGE,
                }}
            >
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

                <Text
                    style={{
                        paddingTop: PADDING_SMALL,
                        color: colors.secondary_text,
                        fontSize: 13,
                        includeFontPadding: false,
                        fontFamily: POPPINS_REGULAR,
                    }}
                >
                    {description}
                </Text>
            </View>

            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: PADDING_LARGE,
                }}
            >
                {false && (
                    <Ionicons
                        name={'information-circle-outline'}
                        size={16}
                        color={colors.accent_color_light}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};
