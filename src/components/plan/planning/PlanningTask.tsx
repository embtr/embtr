import { View } from 'react-native';
import { PlannableTask } from 'src/components/plan/PlannableTask';
import { GoalModel } from 'src/controller/planning/GoalController';
import { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { TaskModel } from 'src/controller/planning/TaskController';
import { PillarModel } from 'src/model/PillarModel';

interface Props {
    plannedTask?: PlannedTaskModel;
    task?: TaskModel;
    isChecked: boolean;
    onUpdate?: Function;
    goal: GoalModel;
    pillar: PillarModel;
}

export const PlanningTask = ({ plannedTask, task, isChecked, onUpdate, goal, pillar }: Props) => {
    return (
        <View>
            <PlannableTask plannedTask={plannedTask} task={task} isEnabled={isChecked} onUpdateTask={onUpdate} goal={goal} pillar={pillar} />
        </View>
    );
};
