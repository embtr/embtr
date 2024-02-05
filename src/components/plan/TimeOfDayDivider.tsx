import { PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { Text, View } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import React from 'react';
import { useTheme } from 'src/components/theme/ThemeProvider';

export interface TimeOfDayDivider {
    id: number;
    name: string;
}

interface Props {
    timeOfDayDivider: TimeOfDayDivider;
}

export const TimeOfDayDivider = ({ timeOfDayDivider }: Props) => {
    const colors = useTheme().colors;

    return (
        <View
            style={{
                width: '100%',
                paddingBottom: PADDING_LARGE,
                paddingTop: PADDING_LARGE / 2,
            }}
        >
            <View style={{ width: '100%', flexDirection: 'row' }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                    }}
                >
                    <HorizontalLine />
                </View>
                <Text
                    style={{
                        textAlign: 'center',
                        fontFamily: POPPINS_REGULAR,
                        color: colors.secondary_text,
                        paddingHorizontal: PADDING_LARGE,
                    }}
                >
                    {timeOfDayDivider.name}
                </Text>

                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                    }}
                >
                    <HorizontalLine />
                </View>
            </View>
        </View>
    );
};
