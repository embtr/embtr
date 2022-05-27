import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, ColorValue, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { durationToString, TaskModel, startMinuteToString } from 'src/controller/planning/TaskController';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';

interface Props {
    plannedTask: PlannedTaskModel,
    backgroundColor?: ColorValue
}

export const PlannedTask = ({ plannedTask, backgroundColor }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    return (
        <View style={{ backgroundColor: backgroundColor || colors.card_background_active }}>
            <View style={{ height: "auto", paddingTop: 5, paddingBottom: 5 }}>
                <View style={{ padding: 5 }}>
                    <Text style={{ color: colors.text, textAlign: "center" }}>
                        {plannedTask.routine.name}
                    </Text>
                </View>

                <Text style={{ color: colors.text, textAlign: "center", paddingTop: 5 }}>
                    {startMinuteToString(plannedTask.startMinute ? plannedTask.startMinute : plannedTask.routine.startMinute)
                        + " for "
                        + durationToString(plannedTask.duration ? plannedTask.duration : plannedTask.routine.duration)}
                </Text>
                <View style={{ flex: 1 }} />
            </View>
        </View>
    );
};