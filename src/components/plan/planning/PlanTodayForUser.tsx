import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { PlanDay } from './PlanDay';
import { View } from 'react-native';
import { User } from 'resources/schema';

interface Props {
    user: User;
}

export const PlanTodayForUser = ({ user }: Props) => {
    const { todayDayKey, plannedDay } = PlannedDayCustomHooks.useTodaysPlannedDayForUser(user);
    if (!plannedDay.data) {
        return <View />;
    }

    return <PlanDay plannedDay={plannedDay.data} dayKey={todayDayKey} />;
};
