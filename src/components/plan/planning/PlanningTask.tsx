import { PlannedTask as PlannedTaskModel } from 'resources/schema';
import { PlannableTask } from 'src/components/plan/PlannableTask';

interface Props {
    plannedTask: PlannedTaskModel;
    isChecked: boolean;
    onUpdate: Function;
}

export const PlanningTask = ({ plannedTask, isChecked, onUpdate }: Props) => {
    return <PlannableTask plannedTask={plannedTask} isEnabled={isChecked} onUpdateTask={onUpdate} />;
};
