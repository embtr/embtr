import { PlannedTaskModel } from 'resources/models/PlannedTaskModel';
import { PlannableTask } from 'src/components/plan/PlannableTask';
import { TaskModel } from 'src/controller/planning/TaskController';

interface Props {
    plannedTask: PlannedTaskModel;
    isChecked: boolean;
    onUpdate: Function;
}

export const PlanningTask = ({ plannedTask, isChecked, onUpdate }: Props) => {
    return <PlannableTask plannedTask={plannedTask} isEnabled={isChecked} onUpdateTask={onUpdate} />;
};
