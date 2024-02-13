import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { PlanDay } from './PlanDay';
import { View } from 'react-native';
import { PlannedDayService } from 'src/service/PlannedDayService';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

interface Props {
    hideComplete: boolean;
}

export const PlanToday = ({ hideComplete }: Props) => {
    const [dayKey, setDayKey] = React.useState(PlannedDayService.getTodayDayKey());
    useFocusEffect(
        React.useCallback(() => {
            setDayKey(PlannedDayService.getTodayDayKey());
        }, [])
    );

    const plannedDay = PlannedDayCustomHooks.usePlannedDayForCurrentUser(dayKey);
    if (!plannedDay?.data) {
        return <View />;
    }

    const todayKey = PlannedDayService.getTodayDayKey();

    return <PlanDay plannedDay={plannedDay.data} hideComplete={hideComplete} dayKey={todayKey} />;
};
