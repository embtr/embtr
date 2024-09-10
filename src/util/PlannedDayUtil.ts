import { PlannedDay, PlannedTask } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';

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
        plannedTaskIdsToAssumeComplete: PlannedTask[],
        plannedTaskIdsToAssumeIncomplete: PlannedTask[]
    ): boolean => {
        const hasPlannedTasks = plannedDay.plannedTasks && plannedDay.plannedTasks.length > 0;
        if (!hasPlannedTasks) {
            return false;
        }

        for (const task of plannedDay.plannedTasks ?? []) {
            if (
                plannedTaskIdsToAssumeIncomplete?.some((plannedTask) => {
                    const isThePlannedTask =
                        task.scheduledHabitId === plannedTask.scheduledHabitId &&
                        task.timeOfDayId === plannedTask.timeOfDayId &&
                        task.originalTimeOfDayId === plannedTask.originalTimeOfDayId;

                    return (
                        (task.id && plannedTask.id && task.id === plannedTask.id) ||
                        isThePlannedTask
                    );
                })
            ) {
                return false;
            }

            if (
                plannedTaskIdsToAssumeComplete?.some((plannedTask) => {
                    const isThePlannedTask =
                        task.scheduledHabitId === plannedTask.scheduledHabitId &&
                        task.timeOfDayId === plannedTask.timeOfDayId &&
                        task.originalTimeOfDayId === plannedTask.originalTimeOfDayId;

                    return (
                        (task.id && plannedTask.id && task.id === plannedTask.id) ||
                        isThePlannedTask
                    );
                })
            ) {
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
