import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Calendar } from 'src/components/today/views/calendar/Calendar';
import { CalendarPlanViews } from 'src/components/today/views/calendar/CalendarPlanViews';
import { TimeIndicator } from 'src/components/today/views/calendar/TimeIndicator';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';

interface Props {
    plannedToday?: PlannedDay,
    updateTask: Function
}

export const CalendarView = ({ plannedToday, updateTask }: Props) => {
    const { colors } = useTheme();

    const scrollRef = React.useRef<ScrollView>(null);

    // onLayout={() => { scrollRef.current?.scrollTo(60 * (new Date().getHours() - 6)) }}
    return (
        <ScrollView ref={scrollRef} style={{ flex: 1 }}>
            <Calendar />
            <CalendarPlanViews plannedToday={plannedToday} updateTask={updateTask} />
            <TimeIndicator />
        </ScrollView>
    );
};