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
import { PADDING_LARGE } from 'src/util/constants';
import { setSelectedDayKey } from 'src/redux/user/GlobalState';
import { PlanSelectedDay } from 'src/components/plan/planning/PlanSelectedDay';
import { FlatList } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const generateDayKey = (dayData: DayPickerElementData, monthData: MonthPickerElementData) => {
    const year = monthData.year;
    const month = (monthData.month + 1).toString().padStart(2, '0');
    const day = (dayData.index + 1).toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const useCurrentDayData = () => {
    const [date, setDate] = React.useState(new Date());

    const months: MonthPickerElementData[] = getMonthData(date);
    const daysOfMonth = getDaysForMonth();
    const currentMonth = months[Math.floor(months.length / 2)];

    const zeroPaddedMonth = currentMonth.month.toString().padStart(2, '0');
    const currentDay: DayPickerElementData = daysOfMonth.get(currentMonth.year + zeroPaddedMonth)![
        new Date().getDate() - 1
    ];

    useFocusEffect(
        React.useCallback(() => {
            setDate(new Date());
        }, [])
    );

    return { months, daysOfMonth, currentMonth, currentDay };
};

export const PlanningWidgetImproved = () => {
    const currentDayData = useCurrentDayData();

    const dispatch = useAppDispatch();
    const monthScrollRef = React.useRef<FlatList>(null);
    const dayScrollRef = React.useRef<FlatList>(null);

    const [selectedMonth, setSelectedMonth] = React.useState<MonthPickerElementData>(
        currentDayData.currentMonth
    );
    const [selectedDay, setSelectedDay] = React.useState<DayPickerElementData>(
        currentDayData.currentDay
    );

    React.useEffect(() => {
        const newDayKey = generateDayKey(selectedDay, selectedMonth);
        dispatch(setSelectedDayKey(newDayKey));
    }, []);

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
        setSelectedMonth(currentDayData.currentMonth);
        setSelectedDay(currentDayData.currentDay);

        dispatch(
            setSelectedDayKey(
                generateDayKey(currentDayData.currentDay, currentDayData.currentMonth)
            )
        );

        dayScrollRef.current?.scrollToIndex({
            index: currentDayData.currentDay.index,
            animated: true,
            viewPosition: 0.5, // Centers the selected item
        });

        monthScrollRef.current?.scrollToIndex({
            index: currentDayData.currentMonth.index,
            animated: true,
            viewPosition: 0.5, // Centers the selected item
        });
    };

    return (
        <WidgetBase>
            <MonthPickerImproved
                ref={monthScrollRef}
                allMonths={currentDayData.months}
                selectedMonth={selectedMonth}
                onSelectionChange={onMonthSelected}
                onScrollToToday={scrollToToday}
            />

            <View style={{ height: PADDING_LARGE / 2 }} />
            <DayPickerImproved
                ref={dayScrollRef}
                selectedDay={selectedDay}
                selectedMonth={selectedMonth}
                onSelectionChange={onDaySelected}
                daysOfTheMonth={currentDayData.daysOfMonth}
            />

            <View style={{ height: PADDING_LARGE }} />
            <PlanSelectedDay />
        </WidgetBase>
    );
};
