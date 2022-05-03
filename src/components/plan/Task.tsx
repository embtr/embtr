import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, ColorValue, TouchableOpacity } from 'react-native';
import { DaysOfWeek } from 'src/components/plan/DaysOfWeek';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { durationToString, TaskModel, startMinuteToString } from 'src/controller/planning/TaskController';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';

interface Props {
    task: TaskModel,
    backgroundColor?: ColorValue
}

export const Task = ({ task, backgroundColor }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    return (
        <TouchableOpacity key={task.id} onPress={() => { navigation.navigate('TaskDetails', { id: task.id! }) }}>
            <View style={{ backgroundColor: backgroundColor || colors.card_background }}>
                <View style={{ height: "auto", paddingTop: 5, paddingBottom: 5 }}>
                    <View style={{ padding: 5 }}>
                        <Text style={{ color: colors.text, textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
                            {task.name}
                        </Text>
                    </View>

                    <View style={{ paddingTop: 5 }}>
                        <DaysOfWeek days={task.days} />
                    </View>

                    <View style={{ flex: 1 }} />

                    <View style={{ flexDirection: "row", paddingTop: 15 }}>
                        <View style={{ flex: .5 }} />
                        <Text style={{ flex: 1, fontSize: 12, color: colors.secondary_text, textAlign: "center" }}>
                            start time
                        </Text>

                        <Text style={{ flex: 1, fontSize: 12, color: colors.secondary_text, textAlign: "center" }}>
                            duration
                        </Text>

                        <View style={{ flex: .5 }} />
                    </View>

                    <View style={{ flexDirection: "row", paddingTop: 1 }}>
                        <View style={{ flex: .5 }} />

                        <Text style={{ flex: 1, color: colors.secondary_text, textAlign: "center" }}>
                            {startMinuteToString(task.startMinute)}
                        </Text>

                        <Text style={{ flex: 1, color: colors.secondary_text, textAlign: "center" }}>
                            {durationToString(task.duration)}
                        </Text>
                        <View style={{ flex: .5 }} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};