import React from 'react';
import { View } from 'react-native';
import { TimeOfDayToggle } from './TimeOfDayToggle';
import { TimeOfDay } from 'resources/schema';
import { TimesOfDayCustomHooks } from 'src/controller/time_of_day/TimeOfDayController';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { UI } from 'src/util/constants';

export const TimeOfDaySingleSelect = () => {
    const timesOfDay: TimeOfDay[] = TimesOfDayCustomHooks.useTimesOfDay();
    const { timesOfDay: toggledTimesOfDay, setTimesOfDay: onTimesChanged } =
        useCreateEditScheduleHabit();

    const [state, setState] = React.useState({
        morning: toggledTimesOfDay.some((time) => time.period === 'MORNING'),
        afternoon: toggledTimesOfDay.some((time) => time.period === 'AFTERNOON'),
        evening: toggledTimesOfDay.some((time) => time.period === 'EVENING'),
        night: toggledTimesOfDay.some((time) => time.period === 'NIGHT'),
    });

    React.useEffect(() => {
        setState({
            morning: toggledTimesOfDay.some((time) => time.period === 'MORNING'),
            afternoon: toggledTimesOfDay.some((time) => time.period === 'AFTERNOON'),
            evening: toggledTimesOfDay.some((time) => time.period === 'EVENING'),
            night: toggledTimesOfDay.some((time) => time.period === 'NIGHT'),
        });
    }, [toggledTimesOfDay]);

    const updateMorning = (morningIsSet: boolean) => {
        if (morningIsSet) {
            const morningTimeOfDay = timesOfDay.find((time) => time.period === 'MORNING');
            onTimesChanged([morningTimeOfDay!]);
        } else {
            onTimesChanged([]);
        }

        setState({
            morning: morningIsSet,
            afternoon: false,
            evening: false,
            night: false,
        });
    };

    const updateAfternoon = (afternoonIsSet: boolean) => {
        if (afternoonIsSet) {
            const afternoonTimeOfDay = timesOfDay.find((time) => time.period === 'AFTERNOON');
            onTimesChanged([afternoonTimeOfDay!]);
        } else {
            onTimesChanged([]);
        }

        setState({
            morning: false,
            afternoon: afternoonIsSet,
            evening: false,
            night: false,
        });
    };

    const updateEvening = (eveningIsSet: boolean) => {
        if (eveningIsSet) {
            const eveningTimeOfDay = timesOfDay.find((time) => time.period === 'EVENING');
            onTimesChanged([eveningTimeOfDay!]);
        } else {
            onTimesChanged([]);
        }

        setState({
            morning: false,
            afternoon: false,
            evening: eveningIsSet,
            night: false,
        });
    };

    const updateNight = (nightIsSet: boolean) => {
        if (nightIsSet) {
            const nightTimeOfDay = timesOfDay.find((time) => time.period === 'NIGHT');
            onTimesChanged([nightTimeOfDay!]);
        } else {
            onTimesChanged([]);
        }

        setState({
            morning: false,
            afternoon: false,
            evening: false,
            night: nightIsSet,
        });
    };

    React.useEffect(() => {
        const morning = toggledTimesOfDay?.some((time) => time.period === 'MORNING') ?? false;
        const afternoon = toggledTimesOfDay?.some((time) => time.period === 'AFTERNOON') ?? false;
        const evening = toggledTimesOfDay?.some((time) => time.period === 'EVENING') ?? false;
        const night = toggledTimesOfDay?.some((time) => time.period === 'NIGHT') ?? false;

        if (toggledTimesOfDay?.length === 0) {
            setState({
                morning,
                afternoon,
                evening,
                night,
            });
        }
    }, [toggledTimesOfDay]);

    return (
        <View style={{ flexDirection: 'row', width: '100%' }}>
            <TimeOfDayToggle timeOfDay={'Morning'} value={state.morning} setValue={updateMorning} />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />
            <TimeOfDayToggle
                timeOfDay={'Afternoon'}
                value={state.afternoon}
                setValue={updateAfternoon}
            />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />
            <TimeOfDayToggle timeOfDay={'Evening'} value={state.evening} setValue={updateEvening} />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />
            <TimeOfDayToggle timeOfDay={'Night'} value={state.night} setValue={updateNight} />
        </View>
    );
};
