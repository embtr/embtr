import { Timestamp } from 'firebase/firestore';
import { TaskModel } from 'src/controller/planning/TaskController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import PlannedDayDao from 'src/firebase/firestore/planning/PlannedDayDao';
import LevelController from '../level/LevelController';
import PlannedDayController, { PlannedDay } from './PlannedDayController';

export interface PlannedTaskModel {
    id?: string;
    routine: TaskModel;
    status?: string;
    startMinute?: number;
    duration?: number;
    dayKey?: string;
}

export const clonePlannedTaskModel = (plannedTask: PlannedTaskModel) => {
    const clonedPlannedTask: PlannedTaskModel = {
        id: plannedTask.id,
        routine: plannedTask.routine,
        status: plannedTask.status,
        startMinute: plannedTask.startMinute,
        duration: plannedTask.duration,
        dayKey: plannedTask.dayKey,
    };

    return clonedPlannedTask;
};

class PlannedTaskController {
    public static get(uid: string, dayKey: string, plannedTaskId: string, callback: Function) {
        PlannedDayController.get(uid, dayKey, (plannedDay: PlannedDay) => {
            plannedDay.plannedTasks.forEach((plannedTask) => {
                if (plannedTask.id === plannedTaskId) {
                    callback(plannedTask);
                }
            });
        });
    }

    public static async update(plannedDay: PlannedDay, plannedTask: PlannedTaskModel, callback: Function) {
        if (!plannedDay.metadata) {
            plannedDay.metadata = PlannedDayController.createMetadata();
        }

        plannedDay.metadata!.modified = Timestamp.now();

        plannedDay.metadata!.status = PlannedDayController.getPlannedDayStatus(plannedDay, plannedTask);

        await PlannedDayDao.updateTask(plannedDay, plannedTask);
        PlannedDayController.refreshDailyResult(plannedDay);
        await LevelController.handlePlannedDayStatusChange(plannedDay);

        callback();
    }

    public static async add(plannedDay: PlannedDay, plannedTask: PlannedTaskModel, callback: Function) {
        await this.addTasks(plannedDay, [plannedTask]);
        callback();
    }

    public static async addTasks(plannedDay: PlannedDay, plannedTasks: PlannedTaskModel[]) {
        plannedDay.metadata!.modified = Timestamp.now();
        plannedDay.metadata!.status = 'INCOMPLETE';
        const createdPlannedTasks = await PlannedDayDao.createTasks(plannedDay, plannedTasks);

        PlannedDayController.refreshDailyResult(plannedDay);

        return createdPlannedTasks;
    }
}

export default PlannedTaskController;
