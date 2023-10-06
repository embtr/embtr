import React from 'react';
import { View } from 'react-native';
import { DayOfTheWeekToggle } from './DayOfTheWeekToggle';
import { UI } from 'src/util/constants';
import { DayOfWeekCustomHooks } from 'src/controller/day_of_week/DayOfWeekController';
import { DayOfWeek } from 'resources/schema';

interface Props {
    onDaysChanged: Function;
    daysOfWeek1?: DayOfWeek[];
}

export const DaysOfTheWeekToggle = ({ onDaysChanged, daysOfWeek1 }: Props) => {
    const daysOfWeek: DayOfWeek[] = DayOfWeekCustomHooks.useDaysOfWeek();

    const [monday, setMonday] = React.useState<boolean>(false);
    const [tuesday, setTuesday] = React.useState<boolean>(false);
    const [wednesday, setWednesday] = React.useState<boolean>(false);
    const [thursday, setThursday] = React.useState<boolean>(false);
    const [friday, setFriday] = React.useState<boolean>(false);
    const [saturday, setSaturday] = React.useState<boolean>(false);
    const [sunday, setSunday] = React.useState<boolean>(false);

    React.useEffect(() => {
        setMonday(daysOfWeek1?.some((day) => day.day === 'MONDAY') ?? false);
        setTuesday(daysOfWeek1?.some((day) => day.day === 'TUESDAY') ?? false);
        setWednesday(daysOfWeek1?.some((day) => day.day === 'WEDNESDAY') ?? false);
        setThursday(daysOfWeek1?.some((day) => day.day === 'THURSDAY') ?? false);
        setFriday(daysOfWeek1?.some((day) => day.day === 'FRIDAY') ?? false);
        setSaturday(daysOfWeek1?.some((day) => day.day === 'SATURDAY') ?? false);
        setSunday(daysOfWeek1?.some((day) => day.day === 'SUNDAY') ?? false);
    }, [daysOfWeek1]);

    React.useEffect(() => {
        if (daysOfWeek?.length === 0) {
            return;
        }

        const toggledDaysOfWeek: DayOfWeek[] = [];
        for (const dayOfWeek of daysOfWeek) {
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

        onDaysChanged(toggledDaysOfWeek);
    }, [daysOfWeek, monday, tuesday, wednesday, thursday, friday, saturday, sunday]);

    return (
        <View style={{ flex: 1, flexDirection: 'row', width: '100%' }}>
            <DayOfTheWeekToggle
                dayOfTheWeek={'M'}
                value={monday}
                setValue={setMonday}
                size={UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.DAY_OF_WEEK_WIDTH}
            />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle
                dayOfTheWeek={'T'}
                value={tuesday}
                setValue={setTuesday}
                size={UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.DAY_OF_WEEK_WIDTH}
            />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle
                dayOfTheWeek={'W'}
                value={wednesday}
                setValue={setWednesday}
                size={UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.DAY_OF_WEEK_WIDTH}
            />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle
                dayOfTheWeek={'T'}
                value={thursday}
                setValue={setThursday}
                size={UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.DAY_OF_WEEK_WIDTH}
            />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle
                dayOfTheWeek={'F'}
                value={friday}
                setValue={setFriday}
                size={UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.DAY_OF_WEEK_WIDTH}
            />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle
                dayOfTheWeek={'S'}
                value={saturday}
                setValue={setSaturday}
                size={UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.DAY_OF_WEEK_WIDTH}
            />
            <View style={{ width: UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.GAP_BETWEEN_DAYS }} />

            <DayOfTheWeekToggle
                dayOfTheWeek={'S'}
                value={sunday}
                setValue={setSunday}
                size={UI.SCHEDULE_HABIT.REPEATING_SCHEDULE.DAY_OF_WEEK_WIDTH}
            />
        </View>
    );
};
