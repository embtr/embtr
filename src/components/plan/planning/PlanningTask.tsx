import React from "react";
import { View } from "react-native";
import { PlannableTask } from "src/components/plan/PlannableTask";
import { GoalModel } from "src/controller/planning/GoalController";
import { PlannedTaskModel } from "src/controller/planning/PlannedDayController";
import { TaskModel } from "src/controller/planning/TaskController";
import { PillarModel } from "src/model/PillarModel";

interface Props {
    plannedTask?: PlannedTaskModel,
    task?: TaskModel,
    locked: boolean,
    isChecked: boolean,
    onCheckboxToggled: Function,
    onUpdate?: Function,
    goal: GoalModel,
    pillar: PillarModel
}

export const PlanningTask = ({ plannedTask, task, locked, isChecked, onCheckboxToggled, onUpdate, goal, pillar }: Props) => {

    return (
        <View>
            <PlannableTask plannedTask={plannedTask} task={task} locked={locked} isEnabled={isChecked} onPress={() => { onCheckboxToggled(task?.id ? task.id : plannedTask?.routine?.id ? plannedTask.routine.id : plannedTask?.id, !isChecked) }} onUpdate={onUpdate} goal={goal} pillar={pillar} />
        </View>
    );
};