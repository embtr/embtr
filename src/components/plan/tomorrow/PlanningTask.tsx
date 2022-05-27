import React from "react";
import { View, ColorValue } from "react-native";
import { Task } from "src/components/plan/Task";
import { useTheme } from "src/components/theme/ThemeProvider";
import { TaskModel } from "src/controller/planning/TaskController";

interface Props {
    task: TaskModel,
    isChecked: boolean,
    onCheckboxToggled: Function
}

export const PlanningTask = ({ task, isChecked, onCheckboxToggled }: Props) => {
    const { colors } = useTheme();

    const backgroundColor: ColorValue = isChecked ? colors.card_background_active : colors.card_background_inactive;

    return (
        <View>
            <Task task={task} backgroundColor={backgroundColor} onPress={() => { onCheckboxToggled(task.id, !isChecked) }} />
        </View>
    );
};