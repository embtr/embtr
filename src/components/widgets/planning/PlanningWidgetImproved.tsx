import React from 'react';
import { View } from 'react-native';
import { MonthPickerImproved } from './MonthPickerImproved';
import { DayPickerImproved } from './DayPickerImproved';
import { PlanDay } from 'src/components/plan/planning/PlanDay';
import { useAppDispatch } from 'src/redux/Hooks';
import { setSelectedDayKey } from 'src/redux/user/GlobalState';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';

export const PlanningWidgetImproved = () => {
    const [selectedMonthIndex, setSelectedMonthIndex] = React.useState(1);
    const [selectedDayIndex, setSelectedDayIndex] = React.useState(1);

    const dispatch = useAppDispatch();
    const onMonthChanged = (monthIndex: number) => {
        const day = selectedDayIndex.toString().padStart(2, '0');
        const month = monthIndex.toString().padStart(2, '0');

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
                selectedIndex={selectedMonthIndex}
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
