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

export enum ReminderNotificationsSettingsOption {
    OFF = 'OFF',
    DAILY = 'DAILY',
    TIME_OF_DAY = 'TIME_OF_DAY',
}

interface Props {
    title: string;
    description: string;
    option: ReminderNotificationsSettingsOption;
    selected: boolean;
    premiumRequired?: boolean;
    onPress: (option: ReminderNotificationsSettingsOption) => void;
}

export const ReminderNotificationsSettingsElement = ({
    title,
    description,
    option,
    selected,
    premiumRequired,
    onPress,
}: Props) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity disabled={premiumRequired} onPress={() => onPress(option)} style={{}}>
            <View>
                {premiumRequired && (
                    <Text
                        style={{
                            position: 'absolute',
                            zIndex: 1,
                            right: 0,
                            marginTop: PADDING_SMALL,
                            marginRight: PADDING_SMALL,
                            fontFamily: POPPINS_SEMI_BOLD,
                            backgroundColor: colors.accent_color_light,
                            borderRadius: 50,
                            fontSize: 7,
                            height: 12,
                            color: colors.text,
                            textAlign: 'center',
                            paddingHorizontal: PADDING_SMALL,
                        }}
                    >
                        PREMIUM FEATURE
                    </Text>
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
                        opacity: premiumRequired ? 0.5 : 1,
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                        }}
                    >
                        {premiumRequired ? (
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
                                fontSize: 10,
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
