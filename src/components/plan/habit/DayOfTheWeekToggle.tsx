import React from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    dayOfTheWeek: string;
    value: boolean;
    setValue: Function;
    required?: boolean;
}

export const DayOfTheWeekToggle = ({ dayOfTheWeek, value, setValue, required }: Props) => {
    const { colors } = useTheme();

    const toggle = () => {
        setValue(!value);
    };

    return (
        <Pressable
            style={{
                height: 50,
                flex: 1,
                alignContent: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                backgroundColor: value ? colors.accent_color : colors.background_light,
                opacity: required ? 0.35 : 1,
            }}
            onPress={() => {
                if (required) {
                    alert('This day is required for the tutorial');
                    return;
                }

                toggle();
            }}
        >
            <Text style={{ textAlign: 'center', color: colors.text }}>{dayOfTheWeek}</Text>
        </Pressable>
    );
};
