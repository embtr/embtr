import { PlannedTask } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import { PlannedTaskUtil } from 'src/util/PlannedTaskUtil';

export namespace PlannedTaskService {
    const taskDebounceMap: { [taskId: string]: NodeJS.Timeout | null } = {};

    // Define the debounce duration
    const DEBOUNCE_DELAY = 1000;

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

        await debouncedCreateUpdatePlannedTask(clone, dayKey);
    };

    export const fail = async (plannedTask: PlannedTask, dayKey: string) => {
        const clone = { ...plannedTask };
        clone.status = Constants.CompletionState.FAILED;

        await debouncedCreateUpdatePlannedTask(clone, dayKey);
    };

    export const complete = async (plannedTask: PlannedTask, dayKey: string) => {
        const clone = { ...plannedTask };
        clone.status = Constants.CompletionState.COMPLETE;
        clone.completedQuantity = clone.quantity;

        await debouncedCreateUpdatePlannedTask(clone, dayKey);
    };

    export const incomplete = async (plannedTask: PlannedTask, dayKey: string) => {
        const clone = { ...plannedTask };
        clone.status = Constants.CompletionState.INCOMPLETE;
        clone.completedQuantity = 0;

        await debouncedCreateUpdatePlannedTask(clone, dayKey);
    };

    const debouncedCreateUpdatePlannedTask = async (plannedTask: PlannedTask, dayKey: string) => {
        const taskId = PlannedTaskUtil.getUniqueIdentifier(plannedTask);

        if (taskDebounceMap[taskId]) {
            clearTimeout(taskDebounceMap[taskId]!);
        }

        taskDebounceMap[taskId] = setTimeout(async () => {
            await createUpdatePlannedTask(plannedTask, dayKey);
            taskDebounceMap[taskId] = null;
        }, DEBOUNCE_DELAY);
    };

    const createUpdatePlannedTask = async (clone: PlannedTask, dayKey: string) => {
        if (clone.id) {
            await PlannedTaskController.update(clone);
        } else {
            await PlannedTaskController.create(clone, dayKey);
        }
    };
}
