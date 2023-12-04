import React from 'react';
import { WidgetBase } from './WidgetBase';
import { DayPicker, MemoizedDayPicker } from 'src/components/plan/planning/DayPicker';
import { UpdatePlannedTaskModal } from '../plan/UpdatePlannedTaskModal';
import { EditHabitModal } from '../plan/habit/EditHabitModal';
import { RemoveHabitModal } from '../plan/habit/RemoveHabitModal';
import { MonthPicker } from '../plan/planning/MonthPicker';
import { PlanDay } from '../plan/planning/PlanDay';
import { View } from 'react-native';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { getDayKeyFromDate } from 'src/controller/planning/PlannedDayController';

export const PlanningWidget = () => {
    const currentDate = new Date();
    const dayKeyRef = React.useRef(getDayKeyFromDate(currentDate));

    const [rerenderTimestamp, setRerenderTimestamp] = React.useState(Date.now());

    return (
        <WidgetBase>
            <UpdatePlannedTaskModal />
            <RemoveHabitModal />
            <EditHabitModal />

            <View style={{ paddingBottom: TIMELINE_CARD_PADDING }}>
                <MonthPicker
                    dayKeyRef={dayKeyRef}
                    forceRerender={() => {
                        setRerenderTimestamp(Date.now());
                    }}
                />
            </View>

            <MemoizedDayPicker dayKeyRef={dayKeyRef} selectedDayKey={dayKeyRef.current} />

            <PlanDay />
        </WidgetBase>
    );
};
