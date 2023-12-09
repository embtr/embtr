import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { PlanDay } from './PlanDay';
import { View } from 'react-native';

export const PlanSelectedDay = () => {
    const { dayKey, plannedDay } = PlannedDayCustomHooks.useSelectedPlannedDay();
    if (!plannedDay.data) {
        return <View />;
    }

    return <PlanDay plannedDay={plannedDay.data} dayKey={dayKey} />;
};
