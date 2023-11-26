import { da } from 'date-fns/locale';
import { PlannedDay, PlannedTask } from 'resources/schema';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';

export class PlannedHabitService {
    public static async deactivate(plannedHabit: PlannedTask, dayKey: string) {
        plannedHabit.active = false;

        if (plannedHabit.id) {
            await PlannedTaskController.update(plannedHabit);
        } else {
            await PlannedTaskController.create(plannedHabit, dayKey);
        }
    }
}
