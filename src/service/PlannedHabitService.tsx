import { PlannedTask } from 'resources/schema';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';

export class PlannedHabitService {
    public static deactivate = async (plannedHabit: PlannedTask) => {
        const clone = { ...plannedHabit };
        clone.active = false;
        await PlannedTaskController.update(clone);
    };
}
