import { WidgetBase } from './WidgetBase';

import { DayPicker } from 'src/components/plan/planning/DayPicker';
import { UpdatePlannedTaskModal } from '../plan/UpdatePlannedTaskModal';
import { EditHabitModal } from '../plan/habit/EditHabitModal';
import { RemoveHabitModal } from '../plan/habit/RemoveHabitModal';
import { MonthPicker } from '../plan/planning/MonthPicker';
import { PlanDay } from '../plan/planning/PlanDay';

export const PlanningWidget = () => {
    return (
        <WidgetBase>
            <UpdatePlannedTaskModal />
            <RemoveHabitModal />
            <EditHabitModal />

            <MonthPicker />
            <DayPicker />
            <PlanDay />
        </WidgetBase>
    );
};
