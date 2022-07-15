import React from "react";
import { View } from "react-native";
import { PlannableTask } from "src/components/plan/PlannableTask";
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

    return (
        <View>
            <PlannableTask plannedTask={plannedTask} task={task} locked={locked} isEnabled={isChecked} onPress={() => { onCheckboxToggled(task?.id ? task.id : plannedTask?.routine?.id ? plannedTask.routine.id : plannedTask?.id, !isChecked) }} onUpdate={onUpdate} />
        </View>
    );
};