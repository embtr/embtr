import React from 'react';
import { View } from 'react-native';
import { MonthPickerImproved } from './MonthPickerImproved';
import { DayPickerImproved } from './DayPickerImproved';
import { PlanDay } from 'src/components/plan/planning/PlanDay';
import { useAppDispatch } from 'src/redux/Hooks';
import { setSelectedDayKey } from 'src/redux/user/GlobalState';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';

const CURRENT_DATE = new Date();
const CURRENT_MONTH_INDEX = CURRENT_DATE.getMonth();
const CURRENT_DAY_INDEX = CURRENT_DATE.getDate() - 1;

console.log('CURRENT_MONTH_INDEX', CURRENT_MONTH_INDEX);
console.log('CURRENT_DAY_INDEX', CURRENT_DAY_INDEX)

export const PlanningWidgetImproved = () => {
    const [selectedMonthIndex, setSelectedMonthIndex] = React.useState(CURRENT_MONTH_INDEX);
    const [selectedDayIndex, setSelectedDayIndex] = React.useState(CURRENT_DAY_INDEX);

    const dispatch = useAppDispatch();
    const onMonthChanged = (monthIndex: number) => {
        const day = (selectedDayIndex + 1).toString().padStart(2, '0');
        const month = (monthIndex + 1).toString().padStart(2, '0');

        const dayKey = '2023' + '-' + month + '-' + day;
        dispatch(setSelectedDayKey(dayKey));

        setSelectedMonthIndex(monthIndex);
    };

    const onDayChanged = (dayIndex: number) => {
        setSelectedDayIndex(dayIndex);

        const day = dayIndex.toString().padStart(2, '0');
        const month = selectedMonthIndex.toString().padStart(2, '0');

        const dayKey = '2023' + '-' + month + '-' + day;
        dispatch(setSelectedDayKey(dayKey));
    };

    return (
        <WidgetBase>
            <MonthPickerImproved
                selectedMonthIndex={selectedMonthIndex}
                onSelectionChange={onMonthChanged}
            />

            <View style={{ paddingTop: TIMELINE_CARD_PADDING }}>
                <DayPickerImproved
                    selectedMonthIndex={selectedMonthIndex}
                    selectedDayIndex={selectedDayIndex}
                    onSelectionChange={onDayChanged}
                />
            </View>

            <View style={{ paddingTop: TIMELINE_CARD_PADDING }}>
                <PlanDay />
            </View>
        </WidgetBase>
    );
};
