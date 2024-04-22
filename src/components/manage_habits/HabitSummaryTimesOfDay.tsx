import React from 'react';
import { View, Text } from 'react-native';
import { ScheduledHabit } from 'resources/schema';
import { useTheme } from '../theme/ThemeProvider';
import { CARD_SHADOW, PADDING_SMALL, POPPINS_MEDIUM } from 'src/util/constants';

interface Props {
    scheduledHabit: ScheduledHabit;
}

export const HabitSummaryTimesOfDay = ({ scheduledHabit }: Props) => {
    const monday = scheduledHabit.daysOfWeek?.some((day) => day.day === 'MONDAY') ?? false;
    const friday = scheduledHabit.daysOfWeek?.some((day) => day.day === 'FRIDAY') ?? false;
    const saturday = scheduledHabit.daysOfWeek?.some((day) => day.day === 'SATURDAY') ?? false;
    const sunday = scheduledHabit.daysOfWeek?.some((day) => day.day === 'SUNDAY') ?? false;

    const [width, setWidth] = React.useState<number>(0);
    const elementwidth = width / 4 - PADDING_SMALL / 2;

    return (
        <View
            onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
            style={{ flexDirection: 'row', width: '100%', backgroundColor: 'red' }}
        >
            <View style={{ flexDirection: 'row', width: '100%' }}>
                <TimeOfTheDay timeOfTheDay={'Morning'} value={monday} width={elementwidth} />
                <TimeOfTheDay timeOfTheDay={'Afternoon'} value={friday} width={elementwidth} />
                <TimeOfTheDay timeOfTheDay={'Evening'} value={saturday} width={elementwidth} />
                <TimeOfTheDay timeOfTheDay={'Night'} value={sunday} width={elementwidth} />
            </View>
        </View>
    );
};

const TimeOfTheDay = ({
    timeOfTheDay,
    value,
    width,
}: {
    timeOfTheDay: string;
    value: boolean;
    width: number;
}) => {
    const { colors } = useTheme();
    const size = PADDING_SMALL * 6.5;

    return (
        <View
            style={[
                {
                    height: size,
                    width: width,
                    alignContent: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    backgroundColor: value ? colors.accent_color : colors.background_light,
                },
                CARD_SHADOW,
            ]}
        >
            <Text
                style={{
                    fontSize: 12,
                    fontFamily: POPPINS_MEDIUM,
                    textAlign: 'center',
                    includeFontPadding: false,
                    paddingHorizontal: PADDING_SMALL,
                    color: colors.text,
                }}
            >
                {timeOfTheDay}
            </Text>
        </View>
    );
};
