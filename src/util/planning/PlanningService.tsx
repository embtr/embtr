import { PlannedDay, PlannedTask } from 'resources/schema';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';

export class PlanningService {
    public static async onTaskUpdated(plannedDay: PlannedDay, onAllTasksCompleted: Function) {
        if (!plannedDay.dayKey) {
            return;
        }

        const allTasksAreCompleteBefore = this.allTasksAreComplete(plannedDay);
        const result = await PlannedDayController.getOrCreateViaApi(plannedDay.dayKey);
        const allTasksAreCompleteAfter = this.allTasksAreComplete(result);

        if (!allTasksAreCompleteBefore && allTasksAreCompleteAfter) {
            onAllTasksCompleted();
        }

        return result;
    }

    public static async sharePlannedDayResults(plannedDay: PlannedDay) {
        if (plannedDay.plannedDayResults?.length) {
            const plannedDayResult = plannedDay!.plannedDayResults![0];
            plannedDayResult.active = true;
            return await DailyResultController.updateViaApi(plannedDayResult);
        } else if (plannedDay) {
            return await PlannedDayController.completeDayViaApi(plannedDay);
        }
    }

    private static allTasksAreComplete(plannedDay?: PlannedDay) {
        if (plannedDay?.plannedTasks === undefined || plannedDay.plannedTasks.length === 0) {
            return false;
        }

        let allTasksAreComplete = true;
        plannedDay?.plannedTasks?.forEach((plannedTask) => {
            if (!(plannedTask.status !== 'FAILED')) {
                allTasksAreComplete = false;
                return;
            }

            if (plannedTask.quantity !== plannedTask.completedQuantity) {
                allTasksAreComplete = false;
                return;
            }
        });

        return allTasksAreComplete;
    }

    public static getPlannedHabitUniqueKey(plannedHabit: PlannedTask) {
        const key =
            '' +
            plannedHabit.plannedDayId +
            '_' +
            plannedHabit.id +
            '_' +
            plannedHabit.scheduledHabitId +
            '_' +
            plannedHabit.timeOfDayId +
            '_' +
            plannedHabit.completedQuantity +
            '_' +
            plannedHabit.quantity +
            '_' +
            plannedHabit.unitId +
            '_' +
            plannedHabit.timeOfDayId +
            '_' +
            plannedHabit.description +
            '_' +
            plannedHabit.title;

        return key;
    }
}
