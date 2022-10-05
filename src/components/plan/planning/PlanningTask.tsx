import { View } from 'react-native';
import { PlannableTask } from 'src/components/plan/PlannableTask';
import { GoalModel } from 'src/controller/planning/GoalController';
import { PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { TaskModel } from 'src/controller/planning/TaskController';
import { PillarModel } from 'src/model/PillarModel';

interface Props {
    plannedTask?: PlannedTaskModel;
    task?: TaskModel;
    locked: boolean;
    isChecked: boolean;
    onUpdate?: Function;
    goal: GoalModel;
    pillar: PillarModel;
}

export const PlanningTask = ({ plannedTask, task, locked, isChecked, onUpdate, goal, pillar }: Props) => {
    return (
        <View>
            <PlannableTask plannedTask={plannedTask} task={task} locked={locked} isEnabled={isChecked} onUpdateTask={onUpdate} goal={goal} pillar={pillar} />
        </View>
    );
};
