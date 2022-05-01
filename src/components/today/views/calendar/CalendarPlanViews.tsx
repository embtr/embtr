import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
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
            <View style={{
                height: plannedTask.duration ? plannedTask.duration : plannedTask.routine.duration,
                width: "100%",
                borderRadius: 5,
                backgroundColor: colors.background_light,
                justifyContent: "center",
                paddingLeft: 5,
                marginTop: plannedTask.routine.startMinute,
                borderColor: "red",
                borderWidth: .2,
                zIndex: zIndex,
                position: "absolute"
            }}>
                <Text style={{ color: colors.text }}>{plannedTask.routine.name}</Text>
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