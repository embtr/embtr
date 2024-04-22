import React from 'react';
import { View, Text } from 'react-native';
import { ScheduledHabit } from 'resources/schema';
import { useTheme } from '../theme/ThemeProvider';
import { CARD_SHADOW, PADDING_SMALL, POPPINS_MEDIUM } from 'src/util/constants';

interface Props {
    scheduledHabit: ScheduledHabit;
}

export const HabitSummaryDaysOfTheWeek = ({ scheduledHabit }: Props) => {
    const monday = scheduledHabit.daysOfWeek?.some((day) => day.day === 'MONDAY') ?? false;
    const tuesday = scheduledHabit.daysOfWeek?.some((day) => day.day === 'TUESDAY') ?? false;
    const wednesday = scheduledHabit.daysOfWeek?.some((day) => day.day === 'WEDNESDAY') ?? false;
    const thursday = scheduledHabit.daysOfWeek?.some((day) => day.day === 'THURSDAY') ?? false;
    const friday = scheduledHabit.daysOfWeek?.some((day) => day.day === 'FRIDAY') ?? false;
    const saturday = scheduledHabit.daysOfWeek?.some((day) => day.day === 'SATURDAY') ?? false;
    const sunday = scheduledHabit.daysOfWeek?.some((day) => day.day === 'SUNDAY') ?? false;

    return (
        <View style={{ flexDirection: 'row', width: '100%' }}>
            <DayOfTheWeek dayOfTheWeek={'M'} value={monday} />
            <View style={{ width: PADDING_SMALL / 2 }} />
            <DayOfTheWeek dayOfTheWeek={'T'} value={tuesday} />
            <View style={{ width: PADDING_SMALL / 2 }} />
            <DayOfTheWeek dayOfTheWeek={'W'} value={wednesday} />
            <View style={{ width: PADDING_SMALL / 2 }} />
            <DayOfTheWeek dayOfTheWeek={'T'} value={thursday} />
            <View style={{ width: PADDING_SMALL / 2 }} />
            <DayOfTheWeek dayOfTheWeek={'F'} value={friday} />
            <View style={{ width: PADDING_SMALL / 2 }} />
            <DayOfTheWeek dayOfTheWeek={'S'} value={saturday} />
            <View style={{ width: PADDING_SMALL / 2 }} />
            <DayOfTheWeek dayOfTheWeek={'S'} value={sunday} />
        </View>
    );
};

const DayOfTheWeek = ({ dayOfTheWeek, value }: { dayOfTheWeek: string; value: boolean }) => {
    const { colors } = useTheme();
    const size = PADDING_SMALL * 6.5;

    return (
        <View
            style={[
                {
                    height: size,
                    width: size,
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
                    color: colors.text,
                }}
            >
                {dayOfTheWeek}
            </Text>
        </View>
    );
};
