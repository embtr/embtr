import React from 'react';
import { ScrollView } from 'react-native';
import { Calendar } from 'src/components/plan/planning/views/calendar/Calendar';
import { CalendarPlanViews } from 'src/components/plan/planning/views/calendar/CalendarPlanViews';
import { TimeIndicator } from 'src/components/plan/planning/views/calendar/time_indicator/TimeIndicator';
import { getTodayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';

interface Props {
    plannedToday?: PlannedDay;
    onTaskUpdated: Function;
}

export const CalendarView = ({ plannedToday, onTaskUpdated }: Props) => {
    const scrollRef = React.useRef<ScrollView>(null);

    return (
        <ScrollView ref={scrollRef} style={{ flex: 1 }}>
            <Calendar />
            <CalendarPlanViews plannedToday={plannedToday} updateTask={onTaskUpdated} />
            {plannedToday?.dayKey === getTodayKey() && <TimeIndicator />}
        </ScrollView>
    );
};
