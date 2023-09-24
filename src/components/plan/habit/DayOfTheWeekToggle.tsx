import React from 'react';
import { Pressable, Text } from 'react-native';
import { ColorSpace } from 'react-native-reanimated';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    dayOfTheWeek: string;
    onToggle: Function;
}

export const DayOfTheWeekToggle = ({ dayOfTheWeek, onToggle }: Props) => {
    const { colors } = useTheme();

    const [isToggled, setIsToggled] = React.useState<boolean>(false);

    const toggle = () => {
        setIsToggled(!isToggled);
        onToggle();
    };

    return (
        <Pressable
            style={{
                height: 50,
                width: 50,
                alignContent: 'center',
                justifyContent: 'center',

                borderRadius: 12,
                backgroundColor: isToggled ? colors.accent_color : colors.text_input_background,
                borderColor: colors.text_input_border,
                borderWidth: 1,
            }}
            onPress={toggle}
        >
            <Text style={{ textAlign: 'center', color: colors.text }}>{dayOfTheWeek}</Text>
        </Pressable>
    );
};
