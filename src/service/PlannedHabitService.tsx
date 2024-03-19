import { PlannedTask } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';
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

    export const skip = async (plannedTask: PlannedTask, dayKey: string) => {
        const clone = { ...plannedTask };
        clone.status = Constants.CompletionState.SKIPPED;

        await createUpdatePlannedTask(clone, dayKey);
    };

    export const fail = async (plannedTask: PlannedTask, dayKey: string) => {
        const clone = { ...plannedTask };
        clone.status = Constants.CompletionState.FAILED;

        await createUpdatePlannedTask(clone, dayKey);
    };

    export const complete = async (plannedTask: PlannedTask, dayKey: string) => {
        const clone = { ...plannedTask };
        clone.status = Constants.CompletionState.COMPLETE;
        clone.completedQuantity = clone.quantity;

        await createUpdatePlannedTask(clone, dayKey);
    };

    export const incomplete = async (plannedTask: PlannedTask, dayKey: string) => {
        const clone = { ...plannedTask };
        clone.status = Constants.CompletionState.INCOMPLETE;
        clone.completedQuantity = 0;

        await createUpdatePlannedTask(clone, dayKey);
    };

    const createUpdatePlannedTask = async (clone: PlannedTask, dayKey: string) => {
        if (clone.id) {
            await PlannedTaskController.update(clone);
        } else {
            await PlannedTaskController.create(clone, dayKey);
        }
    };
}
