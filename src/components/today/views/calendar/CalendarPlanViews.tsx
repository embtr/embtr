import React from 'react';
import { View, LayoutRectangle } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CalendarPlanView } from 'src/components/today/views/calendar/CalendarPlanView';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';

interface Props {
    plannedToday?: PlannedDay
}

export const CalendarPlanViews = ({ plannedToday }: Props) => {
    const { colors } = useTheme();

    const [layout, setLayout] = React.useState<LayoutRectangle>();

    let zIndex = 99;
    let planViews: JSX.Element[] = [];
    plannedToday?.plannedTasks.forEach(plannedTask => {
        planViews.push(
            <View style={{ alignContent: "flex-end", alignItems: "flex-end" }} >
                <CalendarPlanView plannedTask={plannedTask} parentLayout={layout} zIndex={zIndex} />
            </View>
        );
        zIndex++;
    });

    return (
        <View onLayout={(event) => { setLayout(event.nativeEvent.layout) }} style={{ zIndex: 1, position: "absolute", height: "100%", width: "100%" }}>
            {planViews}
        </View>
    );
};