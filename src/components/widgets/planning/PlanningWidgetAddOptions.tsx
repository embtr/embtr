import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, PADDING_LARGE, PADDING_SMALL, POPPINS_REGULAR } from 'src/util/constants';

export const PlanningWidgetAddOptions = () => {
    const colors = useTheme().colors;

    return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    style={[
                        {
                            flexDirection: 'row',
                            backgroundColor: colors.accent_color,
                            borderRadius: 5,
                            padding: PADDING_SMALL,
                        },
                        CARD_SHADOW,
                    ]}
                >
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 14,
                            fontFamily: POPPINS_REGULAR,
                            paddingHorizontal: PADDING_SMALL / 2,
                            top: 1,
                            textAlign: 'center',
                            flex: 1,
                        }}
                    >
                        Add Habit
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ width: PADDING_LARGE }} />

            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    style={[
                        {
                            flexDirection: 'row',
                            backgroundColor: colors.accent_color,
                            borderRadius: 5,
                            padding: PADDING_SMALL,
                        },
                        CARD_SHADOW,
                    ]}
                >
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 14,
                            fontFamily: POPPINS_REGULAR,
                            paddingHorizontal: PADDING_SMALL / 2,
                            top: 1,
                            textAlign: 'center',
                            flex: 1,
                        }}
                    >
                        Add To-Do
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
