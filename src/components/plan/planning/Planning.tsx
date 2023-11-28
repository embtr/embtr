import { View } from 'react-native';
import { DayPicker } from 'src/components/plan/planning/DayPicker';
import { PlanDay } from './PlanDay';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { UpdatePlannedTaskModal } from '../UpdatePlannedTaskModal';
import { RemoveHabitModal } from '../habit/RemoveHabitModal';
import { EditHabitModal } from '../habit/EditHabitModal';

export const Planning = () => {
    return (
        <View>
            <UpdatePlannedTaskModal />
            <RemoveHabitModal />
            <EditHabitModal />

            <View style={{ paddingBottom: TIMELINE_CARD_PADDING }}>
                <DayPicker />
            </View>

            <PlanDay />
        </View>
    );
};
