import { View } from 'react-native';
import { DayPicker } from 'src/components/plan/planning/DayPicker';
import { PlanDay } from './PlanDay';
import { UpdatePlannedTaskModal } from '../UpdatePlannedTaskModal';
import { RemoveHabitModal } from '../habit/RemoveHabitModal';
import { EditHabitModal } from '../habit/EditHabitModal';

export const Planning = () => {
    return (
        <View>
            <UpdatePlannedTaskModal />
            <RemoveHabitModal />
            <EditHabitModal />

            <DayPicker />
            <PlanDay />
        </View>
    );
};
