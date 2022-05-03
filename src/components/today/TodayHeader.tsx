import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';

interface Props {
    plannedToday?: PlannedDay
}

export const TodayHeader = ({ plannedToday }: Props) => {
    const { colors } = useTheme();

    let completed = 0;
    let remaining = 0;
    let missed = 0;

    plannedToday?.plannedTasks.forEach(plannedTask => {
        if (plannedTask.complete) {
            completed++;
        } else {
            remaining++;
        }
    });

    return (
        <View style={{ backgroundColor: colors.background_medium, paddingTop: 25, paddingBottom: 25 }}>
            <View style={{ flexDirection: "row" }}>
                <Text style={{ flex: 1, textAlign: "center", color: colors.text }} >Completed: {completed}</Text>
                <Text style={{ flex: 1, textAlign: "center", color: colors.text }} >Remaining: {remaining}</Text>
                <Text style={{ flex: 1, textAlign: "center", color: colors.text }} >Missed: {missed}</Text>
            </View>
        </View>
    );
};