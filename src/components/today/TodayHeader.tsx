import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';

interface Props {
    plannedToday?: PlannedDay
}

export const TodayHeader = ({ plannedToday }: Props) => {
    const { colors } = useTheme();
    return (
        <View style={{ backgroundColor: colors.background_medium, paddingTop: 25, paddingBottom: 25 }}>
            <View style={{ flexDirection: "row" }}>
                <Text style={{ flex: 1, textAlign: "center", color: colors.text }} >Completed: 0</Text>
                <Text style={{ flex: 1, textAlign: "center", color: colors.text }} >Remaining: {plannedToday?.plannedTasks.length}</Text>
                <Text style={{ flex: 1, textAlign: "center", color: colors.text }} >Missed: 0</Text>
            </View>
        </View>
    );
};