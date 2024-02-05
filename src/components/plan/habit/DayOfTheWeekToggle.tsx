import React from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UI } from 'src/util/constants';

interface Props {
    dayOfTheWeek: string;
    value: boolean;
    setValue: Function;
}

export const DayOfTheWeekToggle = ({ dayOfTheWeek, value, setValue }: Props) => {
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
            }}
            onPress={toggle}
        >
            <Text style={{ textAlign: 'center', color: colors.text }}>{dayOfTheWeek}</Text>
        </Pressable>
    );
};
