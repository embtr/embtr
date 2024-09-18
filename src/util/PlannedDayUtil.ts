import { PlannedDay, PlannedTask } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';
import { PlannedTaskUtil } from './PlannedTaskUtil';

export namespace PlannedDayUtil {
    export const getAllHabitsAreComplete = (plannedDay: PlannedDay): boolean => {
        const hasPlannedTasks = plannedDay.plannedTasks && plannedDay.plannedTasks.length > 0;
        if (!hasPlannedTasks) {
            return false;
        }

        for (const task of plannedDay.plannedTasks ?? []) {
            if (task.status === Constants.CompletionState.COMPLETE) {
                continue;
            }

            if (
                task.status !== Constants.CompletionState.FAILED &&
                task.status !== Constants.CompletionState.SKIPPED &&
                (task.completedQuantity ?? 0) < (task.quantity ?? 1)
            ) {
                return false;
            }
        }

        return true;
    };

    export const getAllHabitsAreCompleteOptimistic = (
        plannedDay: PlannedDay,
        plannedTaskToAssumeComplete?: PlannedTask
    ): boolean => {
        const hasPlannedTasks = plannedDay.plannedTasks && plannedDay.plannedTasks.length > 0;
        if (!hasPlannedTasks) {
            return false;
        }

        for (const task of plannedDay.plannedTasks ?? []) {
            const isPlannedTaskToAssumeComplete =
                plannedTaskToAssumeComplete &&
                PlannedTaskUtil.isThePlannedTask(task, plannedTaskToAssumeComplete);

            if (isPlannedTaskToAssumeComplete) {
                continue;
            }

            if (task.status === Constants.CompletionState.COMPLETE) {
                continue;
            }

            if (
                task.status !== Constants.CompletionState.FAILED &&
                task.status !== Constants.CompletionState.SKIPPED &&
                (task.completedQuantity ?? 0) < (task.quantity ?? 1)
            ) {
                return false;
            }
        }

        return true;
    };
}
