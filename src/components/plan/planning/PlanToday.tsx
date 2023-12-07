import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { PlanDay } from './PlanDay';
import { View } from 'react-native';

interface Props {
    hideComplete: boolean;
}

export const PlanToday = ({ hideComplete }: Props) => {
    const plannedDay = PlannedDayCustomHooks.useTodaysPlannedDay();
    if (!plannedDay.data) {
        return <View />;
    }

    return <PlanDay plannedDay={plannedDay.data} hideComplete={hideComplete} />;
};
