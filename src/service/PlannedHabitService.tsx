import { PlannedTask } from 'resources/schema';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';

export namespace PlannedTaskService {
    export const deactivate = async (plannedHabit: PlannedTask, dayKey: string) => {
        plannedHabit.active = false;

        if (plannedHabit.id) {
            await PlannedTaskController.update(plannedHabit);
        } else {
            await PlannedTaskController.create(plannedHabit, dayKey);
        }
    };
}
