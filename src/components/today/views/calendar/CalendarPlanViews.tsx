import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CalendarPlanView } from 'src/components/today/views/calendar/CalendarPlanView';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';

interface Props {
    plannedToday?: PlannedDay
}

export const CalendarPlanViews = ({ plannedToday }: Props) => {
    const { colors } = useTheme();

    let zIndex = 99;
    let planViews: JSX.Element[] = [];
    plannedToday?.plannedTasks.forEach(plannedTask => {
        planViews.push(
            <View style={{ alignContent: "flex-end", alignItems: "flex-end" }} >
                <CalendarPlanView plannedTask={plannedTask} zIndex={zIndex} />
            </View>
        );
        zIndex++;
    });

    return (
        <View style={{ zIndex: 1, position: "absolute", height: "100%", width: "100%" }}>
            {planViews}
        </View>
    );
};