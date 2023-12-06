import React from 'react';
import { MonthPickerImproved } from './MonthPickerImproved';
import { DayPickerImproved } from './DayPickerImproved';
import { PlanDay } from 'src/components/plan/planning/PlanDay';
import { useAppDispatch } from 'src/redux/Hooks';
import { WidgetBase } from '../WidgetBase';
import {
    DayPickerElementData,
    MonthPickerElementData,
    getMonthData,
} from 'src/model/PlanningWidget';
import { View } from 'react-native';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { setSelectedDayKey } from 'src/redux/user/GlobalState';

const generateDayKey = (dayData: DayPickerElementData, monthData: MonthPickerElementData) => {
    const year = monthData.year;
    const month = (monthData.month + 1).toString().padStart(2, '0');
    const day = (dayData.index + 1).toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const months: MonthPickerElementData[] = getMonthData();
export const PlanningWidgetImproved = () => {
    const dispatch = useAppDispatch();

    const [selectedMonth, setSelectedMonth] = React.useState<MonthPickerElementData>(
        months[Math.floor(months.length / 2)]
    );
    const [selectedDay, setSelectedDay] = React.useState<DayPickerElementData>({
        day: '',
        index: 0,
        displayNumber: 0,
    });

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

    return (
        <WidgetBase>
            <MonthPickerImproved
                allMonths={months}
                selectedMonth={selectedMonth}
                onSelectionChange={onMonthSelected}
            />

            <View style={{ height: TIMELINE_CARD_PADDING }} />

            <DayPickerImproved
                selectedDay={selectedDay}
                selectedMonth={selectedMonth}
                onSelectionChange={onDaySelected}
            />

            <View style={{ height: TIMELINE_CARD_PADDING }} />
            <PlanDay />
        </WidgetBase>
    );
};
