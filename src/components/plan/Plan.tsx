import React from 'react';
import { View, Text, ColorValue } from 'react-native';
import { DaysOfWeek } from 'src/components/plan/DaysOfWeek';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { durationToString, TaskModel, startMinuteToString } from 'src/controller/planning/TaskController';

interface Props {
    task: TaskModel,
    backgroundColor?: ColorValue
}

export const Plan = ({ task, backgroundColor }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ backgroundColor: backgroundColor || colors.card_background }}>
            <View style={{ height: "auto", paddingTop: 5, paddingBottom: 5 }}>
                <View style={{ padding: 5 }}>
                    <Text style={{ color: colors.text, textAlign: "center" }}>
                        {task.name}
                    </Text>
                </View>

                <View style={{ paddingTop: 5 }}>
                    <DaysOfWeek days={task.days} />
                </View>

                <Text style={{ color: colors.text, textAlign: "center", paddingTop: 5 }}>
                    {startMinuteToString(task.startMinute) + " for " + durationToString(task.duration)}
                </Text>
                <View style={{ flex: 1 }} />

                <View style={{ flexDirection: "row", paddingTop: 15 }}>
                    <Text style={{ flex: 1, fontSize: 12, color: colors.secondary_text, textAlign: "center" }}>
                        attribute 1
                    </Text>

                    <Text style={{ flex: 1, fontSize: 12, color: colors.secondary_text, textAlign: "center" }}>
                        attribute 2
                    </Text>

                    <Text style={{ flex: 1, fontSize: 12, color: colors.secondary_text, textAlign: "center" }}>
                        attribute 3
                    </Text>

                    <Text style={{ flex: 1, fontSize: 12, color: colors.secondary_text, textAlign: "center" }}>
                        attribute 4
                    </Text>
                </View>

                <View style={{ flexDirection: "row", paddingTop: 1 }}>
                    <Text style={{ flex: 1, color: colors.secondary_text, textAlign: "center" }}>
                        value 1
                    </Text>

                    <Text style={{ flex: 1, color: colors.secondary_text, textAlign: "center" }}>
                        value 2
                    </Text>

                    <Text style={{ flex: 1, color: colors.secondary_text, textAlign: "center" }}>
                        value 3
                    </Text>

                    <Text style={{ flex: 1, color: colors.secondary_text, textAlign: "center" }}>
                        value 4
                    </Text>
                </View>
            </View>
        </View>
    );
};