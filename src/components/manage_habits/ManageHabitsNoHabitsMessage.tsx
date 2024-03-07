import React from 'react';
import { View, Text } from 'react-native';
import { PADDING_LARGE, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
    onPress: () => void;
}

export const ManageHabitsNoHabitsMessage = ({ onPress }: Props) => {
    const colors = useTheme().colors;

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }} />

            <TouchableOpacity onPress={onPress}>
                <View
                    style={{
                        marginHorizontal: PADDING_LARGE,
                        padding: PADDING_LARGE,
                        borderColor: '#404040',
                        backgroundColor: colors.card_background,
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                        borderRadius: 5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_MEDIUM,
                            fontSize: 16,
                            textAlign: 'center',
                        }}
                    >
                        No Habits... Yet!
                    </Text>

                    <View style={{ height: PADDING_LARGE }} />

                    <Text
                        style={{
                            top: 2,
                            fontSize: 15,
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            textAlign: 'center',
                        }}
                    >
                        You currently have no habits to work on! Press
                        <Text
                            style={{
                                color: colors.accent_color_light,
                            }}
                        >
                            {' '}
                            Add New Habit{' '}
                        </Text>
                        to get started.
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={{ flex: 4 }} />
        </View>
    );
};
