import React from 'react';
import { WidgetBase } from './WidgetBase';
import { MemoizedDayPicker } from 'src/components/plan/planning/DayPicker';
import { UpdatePlannedTaskModal } from '../plan/UpdatePlannedTaskModal';
import { EditHabitModal } from '../plan/habit/EditHabitModal';
import { RemoveHabitModal } from '../plan/habit/RemoveHabitModal';
import { MemoizedMonthPicker, MonthPicker } from '../plan/planning/MonthPicker';
import { PlanDay } from '../plan/planning/PlanDay';
import { View } from 'react-native';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { getDayKeyFromDate } from 'src/controller/planning/PlannedDayController';

const currentDate = new Date();

const updatePlannedTakModel = <UpdatePlannedTaskModal />;
const removeHabitModal = <RemoveHabitModal />;
const editHabitModal = <EditHabitModal />;

export const PlanningWidget = () => {
    const [rerenderTimestamp, setRerenderTimestamp] = React.useState(Date.now());

    const dayKeyRef = React.useRef(getDayKeyFromDate(currentDate));

    return (
        <WidgetBase>
            {updatePlannedTakModel}
            {removeHabitModal}
            {editHabitModal}

            <View style={{ paddingBottom: TIMELINE_CARD_PADDING }}>
                <MemoizedMonthPicker
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
