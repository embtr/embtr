import { Pressable, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR, UI } from 'src/util/constants';

interface Props {
    timeOfDay: string;
    value: boolean;
    setValue: Function;
}

export const TimeOfDayToggle = ({ timeOfDay, value, setValue }: Props) => {
    const { colors } = useTheme();

    const toggle = () => {
        setValue(!value);
    };

    return (
        <Pressable
            style={{
                height: 50,
                width: UI.SCHEDULE_HABIT.TIME_OF_DAY.TIME_OF_DAY_WIDTH,
                alignContent: 'center',
                justifyContent: 'center',

                borderRadius: 12,
                backgroundColor: value ? colors.accent_color : colors.background_light,
            }}
            onPress={toggle}
        >
            <Text style={{ textAlign: 'center', color: colors.text, fontFamily: POPPINS_REGULAR }}>
                {timeOfDay}
            </Text>
        </Pressable>
    );
};
