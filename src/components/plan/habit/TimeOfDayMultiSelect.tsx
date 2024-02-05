import React from 'react';
import { View } from 'react-native';
import { TimeOfDayToggle } from './TimeOfDayToggle';
import { TimeOfDay } from 'resources/schema';
import { TimesOfDayCustomHooks } from 'src/controller/time_of_day/TimeOfDayController';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { UI } from 'src/util/constants';

export const TimeOfDayMultiSelect = () => {
    const timesOfDay: TimeOfDay[] = TimesOfDayCustomHooks.useTimesOfDay();
    const { timesOfDay: toggledTimesOfDay, setTimesOfDay: onTimesChanged } =
        useCreateEditScheduleHabit();

    const [morning, setMorning] = React.useState<boolean>(false);
    const [afternoon, setAfternoon] = React.useState<boolean>(false);
    const [evening, setEvening] = React.useState<boolean>(false);
    const [night, setNight] = React.useState<boolean>(false);

    React.useEffect(() => {
        setMorning(toggledTimesOfDay?.some((time) => time.period === 'MORNING') ?? false);
        setAfternoon(toggledTimesOfDay?.some((time) => time.period === 'AFTERNOON') ?? false);
        setEvening(toggledTimesOfDay?.some((time) => time.period === 'EVENING') ?? false);
        setNight(toggledTimesOfDay?.some((time) => time.period === 'NIGHT') ?? false);
    }, [toggledTimesOfDay]);

    React.useEffect(() => {
        if (timesOfDay?.length === 0) {
            return;
        }

        const toggledTimesOfDay: TimeOfDay[] = [];
        for (const timeOfDay of timesOfDay) {
            switch (timeOfDay.period) {
                case 'MORNING':
                    if (morning) {
                        toggledTimesOfDay.push(timeOfDay);
                    }
                    break;
                case 'AFTERNOON':
                    if (afternoon) {
                        toggledTimesOfDay.push(timeOfDay);
                    }
                    break;
                case 'EVENING':
                    if (evening) {
                        toggledTimesOfDay.push(timeOfDay);
                    }
                    break;
                case 'NIGHT':
                    if (night) {
                        toggledTimesOfDay.push(timeOfDay);
                    }
                    break;
            }
        }
        onTimesChanged(toggledTimesOfDay);
    }, [timesOfDay, morning, afternoon, evening, night]);

    return (
        <View style={{ flexDirection: 'row', width: '100%' }}>
            <TimeOfDayToggle timeOfDay={'Morning'} value={morning} setValue={setMorning} />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />
            <TimeOfDayToggle timeOfDay={'Afternoon'} value={afternoon} setValue={setAfternoon} />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />
            <TimeOfDayToggle timeOfDay={'Evening'} value={evening} setValue={setEvening} />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />
            <TimeOfDayToggle timeOfDay={'Night'} value={night} setValue={setNight} />
        </View>
    );
};
