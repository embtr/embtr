import React from 'react';
import { ScrollView } from 'react-native';
import { Calendar } from 'src/components/today/views/calendar/Calendar';
import { CalendarPlanViews } from 'src/components/today/views/calendar/CalendarPlanViews';
import { TimeIndicator } from 'src/components/today/views/calendar/time_indicator/TimeIndicator';
import { TimeIndicatorDot } from 'src/components/today/views/calendar/time_indicator/TimeIndicatorDot';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';

interface Props {
    plannedToday?: PlannedDay,
    updateTask: Function
}

export const CalendarView = ({ plannedToday, updateTask }: Props) => {

    const scrollRef = React.useRef<ScrollView>(null);

    return (
        <ScrollView ref={scrollRef} style={{ flex: 1 }}>
            <Calendar />
            <CalendarPlanViews plannedToday={plannedToday} updateTask={updateTask} />
            <TimeIndicator />
        </ScrollView>
    );
};