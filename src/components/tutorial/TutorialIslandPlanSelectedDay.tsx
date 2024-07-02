import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { View } from 'react-native';
import { TutorialIslandPlanDay } from './TutorialIslandPlanDay';

export const TutorialIslandPlanSelectedDay = () => {
    const { dayKey, plannedDay } = PlannedDayCustomHooks.useSelectedPlannedDayForCurrentUser();
    if (!plannedDay?.data) {
        return <View />;
    }

    return <TutorialIslandPlanDay plannedDay={plannedDay.data} dayKey={dayKey} />;
};
