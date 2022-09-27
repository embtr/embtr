import { getAuth } from 'firebase/auth';
import React from 'react';
import { ScrollView } from 'react-native';
import { Calendar } from 'src/components/plan/planning/views/calendar/Calendar';
import { CalendarPlanViews } from 'src/components/plan/planning/views/calendar/CalendarPlanViews';
import { TimeIndicator } from 'src/components/plan/planning/views/calendar/time_indicator/TimeIndicator';
import PlannedDayController, { getTodayKey, PlannedDay, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { UserType } from 'src/controller/profile/ProfileController';

interface Props {
    plannedToday?: PlannedDay;
    onPlanTodayUpdated: Function;
    userType: UserType;
}

export const CalendarView = ({ plannedToday, userType, onPlanTodayUpdated }: Props) => {
    const scrollRef = React.useRef<ScrollView>(null);

    const updateTask = (updatedPlannedTask: PlannedTaskModel) => {
        PlannedDayController.updateTask(plannedToday!, updatedPlannedTask, () => {
            if (plannedToday?.id) {
                PlannedDayController.get(getAuth().currentUser?.uid!, plannedToday?.id, onPlanTodayUpdated);
            }
        });
    };

    return (
        <ScrollView ref={scrollRef} style={{ flex: 1 }}>
            <Calendar />
            <CalendarPlanViews plannedToday={plannedToday} updateTask={updateTask} userType={userType} />
            {plannedToday?.id === getTodayKey() && <TimeIndicator />}
        </ScrollView>
    );
};
