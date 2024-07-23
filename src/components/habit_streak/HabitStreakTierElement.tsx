import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { OptimalImage } from '../common/images/OptimalImage';
import { Icon } from 'resources/schema';

interface Props {
    titlePrefix: string;
    titlePostfix: string;
    body: string;
    icon: Icon;
    note?: string;
}

export const HabitStreakTierElement = ({ titlePrefix, titlePostfix, body, icon, note }: Props) => {
    const { colors } = useTheme();
    const size = 40;

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ paddingRight: PADDING_LARGE }}>
                <View
                    style={{
                        height: size,
                        width: size,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <OptimalImage data={icon} style={{ height: size, width: size }} />
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        color: colors.text,
                        fontFamily: POPPINS_MEDIUM,
                        fontSize: 16,
                    }}
                >
                    {titlePrefix}
                    <Text style={{ color: colors.accent_color_light }}>{titlePostfix}</Text>
                </Text>

                <Text
                    style={{
                        color: colors.secondary_text,
                        fontFamily: POPPINS_MEDIUM,
                        fontSize: 12,
                    }}
                >
                    {body}
                </Text>
            </View>

            <View
                style={{
                    right: -PADDING_SMALL,
                    top: -PADDING_SMALL - 2.5,
                    position: 'absolute',
                    zIndex: 1,
                }}
            >
                <Text
                    style={{
                        color: colors.secondary_text,
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 9,
                        includeFontPadding: false,
                    }}
                >
                    {note}
                </Text>
            </View>
        </View>
    );
};
