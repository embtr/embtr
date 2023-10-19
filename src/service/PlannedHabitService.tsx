import { PlannedDay, PlannedTask } from 'resources/schema';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';

export class PlannedHabitService {
    public static async deactivate(plannedHabit: PlannedTask, plannedDay: PlannedDay) {
        plannedHabit.active = false;

        if (plannedHabit.id) {
            await PlannedTaskController.update(plannedHabit);
        } else {
            await PlannedTaskController.create(plannedDay, plannedHabit);
        }
    }
}
