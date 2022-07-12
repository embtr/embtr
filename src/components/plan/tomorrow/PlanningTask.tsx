import React from "react";
import { View, ColorValue } from "react-native";
import { PlannableTask } from "src/components/plan/PlannableTask";
import { useTheme } from "src/components/theme/ThemeProvider";
import { PlannedTaskModel } from "src/controller/planning/PlannedDayController";
import { TaskModel } from "src/controller/planning/TaskController";

interface Props {
    plannedTask?: PlannedTaskModel,
    task?: TaskModel,
    locked: boolean,
    isChecked: boolean,
    onCheckboxToggled: Function,
    onUpdate?: Function
}

export const PlanningTask = ({ plannedTask, task, locked, isChecked, onCheckboxToggled, onUpdate }: Props) => {
    const { colors } = useTheme();

    const backgroundColor: ColorValue = isChecked ? colors.card_background_active : colors.card_background_inactive;

    return (
        <View>
            <PlannableTask plannedTask={plannedTask} task={task} locked={locked} backgroundColor={backgroundColor} onPress={() => { onCheckboxToggled(task?.id ? task.id : plannedTask?.routine?.id ? plannedTask.routine.id : plannedTask?.id, !isChecked) }} onUpdate={onUpdate} />
        </View>
    );
};