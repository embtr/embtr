import { WidgetBase } from './WidgetBase';

import { DayPicker } from 'src/components/plan/planning/DayPicker';
import { UpdatePlannedTaskModal } from '../plan/UpdatePlannedTaskModal';
import { EditHabitModal } from '../plan/habit/EditHabitModal';
import { RemoveHabitModal } from '../plan/habit/RemoveHabitModal';
import { MonthPicker } from '../plan/planning/MonthPicker';
import { PlanDay } from '../plan/planning/PlanDay';
import React from 'react';

export const PlanningWidget = () => {
    const dayKey = React.useRef<string>('2023-12-01');

    console.log("I AM RERENDERING")
    return (
        <WidgetBase>
            <UpdatePlannedTaskModal />
            <RemoveHabitModal />
            <EditHabitModal />

            <MonthPicker dayKeyRef={dayKey} />
            <DayPicker dayKeyRef={dayKey} />
            <PlanDay />
        </WidgetBase>
    );
};
