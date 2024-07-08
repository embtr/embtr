import React from 'react';
import { View } from 'react-native';
import { UI } from 'src/util/constants';
import { DayOfWeekCustomHooks } from 'src/controller/day_of_week/DayOfWeekController';
import { DayOfWeek } from 'resources/schema';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { DayOfTheWeekToggle } from '../plan/habit/DayOfTheWeekToggle';
import { getDayOfWeekFromIndex } from 'src/util/DateUtility';

interface Props {
    requiredDayOfTheWeekIndex?: number;
}

export const TutorialIslandDaysOfTheWeekToggle = ({ requiredDayOfTheWeekIndex }: Props) => {
    const allDaysOfWeek: DayOfWeek[] = DayOfWeekCustomHooks.useDaysOfWeek();

    const { setDaysOfWeek } = useCreateEditScheduleHabit();

    const requiredDayOfTheWeek = !requiredDayOfTheWeekIndex
        ? 'INVALID'
        : getDayOfWeekFromIndex(requiredDayOfTheWeekIndex);

    const [monday, setMonday] = React.useState<boolean>(requiredDayOfTheWeek === 'MONDAY');
    const [tuesday, setTuesday] = React.useState<boolean>(requiredDayOfTheWeek === 'TUESDAY');
    const [wednesday, setWednesday] = React.useState<boolean>(requiredDayOfTheWeek === 'WEDNESDAY');
    const [thursday, setThursday] = React.useState<boolean>(requiredDayOfTheWeek === 'THURSDAY');
    const [friday, setFriday] = React.useState<boolean>(requiredDayOfTheWeek === 'FRIDAY');
    const [saturday, setSaturday] = React.useState<boolean>(requiredDayOfTheWeek === 'SATURDAY');
    const [sunday, setSunday] = React.useState<boolean>(requiredDayOfTheWeek === 'SUNDAY');

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
            <DayOfTheWeekToggle
                dayOfTheWeek={'M'}
                value={monday}
                setValue={setMonday}
                required={requiredDayOfTheWeek === 'MONDAY'}
            />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle
                dayOfTheWeek={'T'}
                value={tuesday}
                setValue={setTuesday}
                required={requiredDayOfTheWeek === 'TUESDAY'}
            />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle
                dayOfTheWeek={'W'}
                value={wednesday}
                setValue={setWednesday}
                required={requiredDayOfTheWeek === 'WEDNESDAY'}
            />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle
                dayOfTheWeek={'T'}
                value={thursday}
                setValue={setThursday}
                required={requiredDayOfTheWeek === 'THURSDAY'}
            />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle
                dayOfTheWeek={'F'}
                value={friday}
                setValue={setFriday}
                required={requiredDayOfTheWeek === 'FRIDAY'}
            />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle
                dayOfTheWeek={'S'}
                value={saturday}
                setValue={setSaturday}
                required={requiredDayOfTheWeek === 'SATURDAY'}
            />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle
                dayOfTheWeek={'S'}
                value={sunday}
                setValue={setSunday}
                required={requiredDayOfTheWeek === 'SUNDAY'}
            />
        </View>
    );
};
