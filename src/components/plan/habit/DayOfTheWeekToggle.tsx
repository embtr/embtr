import React from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    dayOfTheWeek: string;
    value: boolean;
    setValue: Function;
    size: number;
}

export const DayOfTheWeekToggle = ({ dayOfTheWeek, value, setValue, size }: Props) => {
    const { colors } = useTheme();

    const toggle = () => {
        setValue(!value);
    };

    return (
        <Pressable
            style={{
                height: size,
                width: size,
                alignContent: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                backgroundColor: value ? colors.accent_color : colors.text_input_background,
                borderColor: colors.text_input_border,
                borderWidth: 1,
            }}
            onPress={toggle}
        >
            <Text style={{ textAlign: 'center', color: colors.text }}>{dayOfTheWeek}</Text>
        </Pressable>
    );
};
