import React from 'react';
import { MonthPickerImproved } from './MonthPickerImproved';
import { DayPickerImproved } from './DayPickerImproved';
import { useAppDispatch } from 'src/redux/Hooks';
import { WidgetBase } from '../WidgetBase';
import {
    DAYS,
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
import { getDayKeyFromDate } from 'src/controller/planning/PlannedDayController';

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

interface SelectedDateData {
    selectedMonth: MonthPickerElementData;
    selectedDay: DayPickerElementData;
}

export const PlanningWidgetImproved = () => {
    const currentDayData = useCurrentDayData();

    const dispatch = useAppDispatch();
    const monthScrollRef = React.useRef<FlatList>(null);
    const dayScrollRef = React.useRef<FlatList>(null);

    const [selectedDateData, setSelectedDateData] = React.useState<SelectedDateData>({
        selectedMonth: currentDayData.currentMonth,
        selectedDay: currentDayData.currentDay,
    });

    React.useEffect(() => {
        const newDayKey = generateDayKey(
            selectedDateData.selectedDay,
            selectedDateData.selectedMonth
        );
        dispatch(setSelectedDayKey(newDayKey));
    }, []);

    const onMonthSelected = (monthData: MonthPickerElementData) => {
        const firstOfMonth = new Date(monthData.year, monthData.month, 1);
        const lastOfMonth = new Date(monthData.year, monthData.month + 1, 0);

        const newMonthAheadOfCurrentMonth =
            monthData.year > selectedDateData.selectedMonth.year ||
            (monthData.year === selectedDateData.selectedMonth.year &&
                monthData.month > selectedDateData.selectedMonth.month);

        const dateToUse = newMonthAheadOfCurrentMonth ? firstOfMonth : lastOfMonth;
        const dayData = DAYS[firstOfMonth.getDay()];
        const newDay = {
            dayKey: getDayKeyFromDate(dateToUse),
            dayShort: dayData.dayShort,
            dayFull: dayData.dayFull,
            displayNumber: dateToUse.getDate(),
            index: dateToUse.getDate() - 1,
        };

        const newSelectedDateData = {
            selectedMonth: monthData,
            selectedDay: newDay,
        };
        setSelectedDateData(newSelectedDateData);

        const newDayKey = generateDayKey(
            newSelectedDateData.selectedDay,
            newSelectedDateData.selectedMonth
        );
        dispatch(setSelectedDayKey(newDayKey));
    };

    const onDaySelected = (dayData: DayPickerElementData) => {
        const newSelectedDateData = {
            selectedMonth: selectedDateData.selectedMonth,
            selectedDay: dayData,
        };
        setSelectedDateData(newSelectedDateData);

        const newDayKey = generateDayKey(dayData, newSelectedDateData.selectedMonth);
        dispatch(setSelectedDayKey(newDayKey));
    };

    const scrollToToday = () => {
        setSelectedDateData({
            selectedMonth: currentDayData.currentMonth,
            selectedDay: currentDayData.currentDay,
        });

        dispatch(
            setSelectedDayKey(
                generateDayKey(currentDayData.currentDay, currentDayData.currentMonth)
            )
        );
    };

    return (
        <WidgetBase>
            <MonthPickerImproved
                ref={monthScrollRef}
                allMonths={currentDayData.months}
                selectedMonth={selectedDateData.selectedMonth}
                onSelectionChange={onMonthSelected}
                onScrollToToday={scrollToToday}
            />

            <View style={{ height: PADDING_LARGE / 2 }} />

            <DayPickerImproved
                ref={dayScrollRef}
                selectedDay={selectedDateData.selectedDay}
                selectedMonth={selectedDateData.selectedMonth}
                onSelectionChange={onDaySelected}
                daysOfTheMonth={currentDayData.daysOfMonth}
            />

            <PlanSelectedDay />
        </WidgetBase>
    );
};
