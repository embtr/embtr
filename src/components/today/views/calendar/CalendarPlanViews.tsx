import React from 'react';
import { LayoutRectangle, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CalendarPlanView } from 'src/components/today/views/calendar/CalendarPlanView';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';

interface Props {
    plannedToday?: PlannedDay
    updateTask: Function
}

export const CalendarPlanViews = ({ plannedToday, updateTask }: Props) => {
    const { colors } = useTheme();

    const [layout, setLayout] = React.useState<LayoutRectangle>();

    let planViews: JSX.Element[] = [];
    plannedToday?.plannedTasks.forEach(plannedTask => {
        planViews.push(
            <View key={plannedTask.id} style={{ alignContent: "flex-end", alignItems: "flex-end" }} >
                <CalendarPlanView plannedTask={plannedTask} onUpdateTask={updateTask} parentLayout={layout} />
            </View>
        );
    });

    return (
        <View onLayout={(event) => { setLayout(event.nativeEvent.layout) }} style={{ zIndex: 2, position: "absolute", height: "100%", width: "100%", paddingRight: 30 }}>
            {planViews}
        </View>
    );
};