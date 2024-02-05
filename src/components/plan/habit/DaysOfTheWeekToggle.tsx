import React from 'react';
import { View } from 'react-native';
import { DayOfTheWeekToggle } from './DayOfTheWeekToggle';
import { UI } from 'src/util/constants';
import { DayOfWeekCustomHooks } from 'src/controller/day_of_week/DayOfWeekController';
import { DayOfWeek } from 'resources/schema';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';

export const DaysOfTheWeekToggle = () => {
    const allDaysOfWeek: DayOfWeek[] = DayOfWeekCustomHooks.useDaysOfWeek();

    const { daysOfWeek, setDaysOfWeek } = useCreateEditScheduleHabit();

    const [monday, setMonday] = React.useState<boolean>(false);
    const [tuesday, setTuesday] = React.useState<boolean>(false);
    const [wednesday, setWednesday] = React.useState<boolean>(false);
    const [thursday, setThursday] = React.useState<boolean>(false);
    const [friday, setFriday] = React.useState<boolean>(false);
    const [saturday, setSaturday] = React.useState<boolean>(false);
    const [sunday, setSunday] = React.useState<boolean>(false);

    React.useEffect(() => {
        setMonday(daysOfWeek?.some((day) => day.day === 'MONDAY') ?? false);
        setTuesday(daysOfWeek?.some((day) => day.day === 'TUESDAY') ?? false);
        setWednesday(daysOfWeek?.some((day) => day.day === 'WEDNESDAY') ?? false);
        setThursday(daysOfWeek?.some((day) => day.day === 'THURSDAY') ?? false);
        setFriday(daysOfWeek?.some((day) => day.day === 'FRIDAY') ?? false);
        setSaturday(daysOfWeek?.some((day) => day.day === 'SATURDAY') ?? false);
        setSunday(daysOfWeek?.some((day) => day.day === 'SUNDAY') ?? false);
    }, [daysOfWeek]);

    React.useEffect(() => {
        if (allDaysOfWeek?.length === 0) {
            return;
        }

        const toggledDaysOfWeek: DayOfWeek[] = [];
        for (const dayOfWeek of allDaysOfWeek) {
            switch (dayOfWeek.day) {
                case 'MONDAY':
                    if (monday) {
                        toggledDaysOfWeek.push(dayOfWeek);
                    }
                    break;
                case 'TUESDAY':
                    if (tuesday) {
                        toggledDaysOfWeek.push(dayOfWeek);
                    }
                    break;
                case 'WEDNESDAY':
                    if (wednesday) {
                        toggledDaysOfWeek.push(dayOfWeek);
                    }
                    break;
                case 'THURSDAY':
                    if (thursday) {
                        toggledDaysOfWeek.push(dayOfWeek);
                    }
                    break;
                case 'FRIDAY':
                    if (friday) {
                        toggledDaysOfWeek.push(dayOfWeek);
                    }
                    break;
                case 'SATURDAY':
                    if (saturday) {
                        toggledDaysOfWeek.push(dayOfWeek);
                    }
                    break;
                case 'SUNDAY':
                    if (sunday) {
                        toggledDaysOfWeek.push(dayOfWeek);
                    }
                    break;

                default:
                    break;
            }
        }

        setDaysOfWeek(toggledDaysOfWeek);
    }, [allDaysOfWeek, monday, tuesday, wednesday, thursday, friday, saturday, sunday]);

    return (
        <View style={{ flexDirection: 'row', width: '100%', height: 50 }}>
            <DayOfTheWeekToggle dayOfTheWeek={'M'} value={monday} setValue={setMonday} />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle dayOfTheWeek={'T'} value={tuesday} setValue={setTuesday} />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle dayOfTheWeek={'W'} value={wednesday} setValue={setWednesday} />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle dayOfTheWeek={'T'} value={thursday} setValue={setThursday} />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle dayOfTheWeek={'F'} value={friday} setValue={setFriday} />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle dayOfTheWeek={'S'} value={saturday} setValue={setSaturday} />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle dayOfTheWeek={'S'} value={sunday} setValue={setSunday} />
        </View>
    );
};
