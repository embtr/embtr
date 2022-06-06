import React from "react";
import { View, ColorValue } from "react-native";
import { PlannableTask } from "src/components/plan/PlannableTask";
import { useTheme } from "src/components/theme/ThemeProvider";
import { TaskModel } from "src/controller/planning/TaskController";

interface Props {
    task: TaskModel,
    locked: boolean,
    isChecked: boolean,
    onCheckboxToggled: Function,
    onUpdate?: Function
}

export const PlanningTask = ({ task, locked, isChecked, onCheckboxToggled, onUpdate }: Props) => {
    const { colors } = useTheme();

    const backgroundColor: ColorValue = isChecked ? colors.card_background_active : colors.card_background_inactive;

    return (
        <View>
            <PlannableTask task={task} locked={locked} backgroundColor={backgroundColor} onPress={() => { onCheckboxToggled(task.id, !isChecked) }} onUpdate={onUpdate} />
        </View>
    );
};