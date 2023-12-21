import React from 'react';
import { MonthPickerImproved } from './MonthPickerImproved';
import { DayPickerImproved } from './DayPickerImproved';
import { useAppDispatch } from 'src/redux/Hooks';
import { WidgetBase } from '../WidgetBase';
import {
    DayPickerElementData,
    MonthPickerElementData,
    getDaysForMonth,
    getMonthData,
} from 'src/model/PlanningWidget';
import { View } from 'react-native';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { setSelectedDayKey } from 'src/redux/user/GlobalState';
import { PlanSelectedDay } from 'src/components/plan/planning/PlanSelectedDay';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

const months: MonthPickerElementData[] = getMonthData();
const daysOfMonth = getDaysForMonth();
const currentMonth = months[Math.floor(months.length / 2)];
const zeroPaddedMonth = currentMonth.month.toString().padStart(2, '0');
const currentDay: DayPickerElementData = daysOfMonth.get(currentMonth.year + zeroPaddedMonth)![
    new Date().getDate() - 1
];

const generateDayKey = (dayData: DayPickerElementData, monthData: MonthPickerElementData) => {
    const year = monthData.year;
    const month = (monthData.month + 1).toString().padStart(2, '0');
    const day = (dayData.index + 1).toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const PlanningWidgetImproved = () => {
    const dispatch = useAppDispatch();
    const monthScrollRef = React.useRef<FlatList>(null);
    const dayScrollRef = React.useRef<FlatList>(null);

    const [selectedMonth, setSelectedMonth] = React.useState<MonthPickerElementData>(currentMonth);
    const [selectedDay, setSelectedDay] = React.useState<DayPickerElementData>(currentDay);

    useFocusEffect(
        React.useCallback(() => {
            const newDayKey = generateDayKey(selectedDay, selectedMonth);
            dispatch(setSelectedDayKey(newDayKey));
        }, [])
    );

    const onMonthSelected = (monthData: MonthPickerElementData) => {
        setSelectedMonth(monthData);

        const newDayKey = generateDayKey(selectedDay, monthData);
        dispatch(setSelectedDayKey(newDayKey));
    };

    const onDaySelected = (dayData: DayPickerElementData) => {
        setSelectedDay(dayData);

        const newDayKey = generateDayKey(dayData, selectedMonth);
        dispatch(setSelectedDayKey(newDayKey));
    };

    const scrollToToday = () => {
        setSelectedMonth(currentMonth);
        setSelectedDay(currentDay);

        dispatch(setSelectedDayKey(generateDayKey(currentDay, currentMonth)));

        dayScrollRef.current?.scrollToIndex({
            index: currentDay.index,
            animated: true,
            viewPosition: 0.5, // Centers the selected item
        });

        monthScrollRef.current?.scrollToIndex({
            index: currentMonth.index,
            animated: true,
            viewPosition: 0.5, // Centers the selected item
        });
    };

    return (
        <WidgetBase>
            <MonthPickerImproved
                ref={monthScrollRef}
                allMonths={months}
                selectedMonth={selectedMonth}
                onSelectionChange={onMonthSelected}
                onScrollToToday={scrollToToday}
            />

            <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />
            <DayPickerImproved
                ref={dayScrollRef}
                selectedDay={selectedDay}
                selectedMonth={selectedMonth}
                onSelectionChange={onDaySelected}
                daysOfTheMonth={daysOfMonth}
            />

            <View style={{ height: TIMELINE_CARD_PADDING }} />
            <PlanSelectedDay />
        </WidgetBase>
    );
};
