import React from 'react';
import { ScrollView } from 'react-native';
import { Calendar } from 'src/components/today/views/calendar/Calendar';
import { CalendarPlanViews } from 'src/components/today/views/calendar/CalendarPlanViews';
import { TimeIndicator } from 'src/components/today/views/calendar/time_indicator/TimeIndicator';
import { getTodayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';
import { UserType } from 'src/controller/profile/ProfileController';

interface Props {
    plannedToday?: PlannedDay,
    updateTask?: Function,
    userType: UserType
}

export const CalendarView = ({ plannedToday, updateTask, userType }: Props) => {

    const scrollRef = React.useRef<ScrollView>(null);

    return (
        <ScrollView ref={scrollRef} style={{ flex: 1 }}>
            <Calendar />
            <CalendarPlanViews plannedToday={plannedToday} updateTask={updateTask} userType={userType} />
            { plannedToday?.id === getTodayKey() && <TimeIndicator />}
        </ScrollView>
    );
};