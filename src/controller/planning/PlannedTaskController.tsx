import { Timestamp } from 'firebase/firestore';
import { TaskModel } from 'src/controller/planning/TaskController';
import PlannedDayDao from 'src/firebase/firestore/planning/PlannedDayDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import LevelController from '../level/LevelController';
import GoalController, { GoalModel } from './GoalController';
import PlannedDayController, { PlannedDay } from './PlannedDayController';

export interface PlannedTaskModel {
    id?: string;
    routine: TaskModel;
    status?: string;
    goalId?: string;
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

    if (plannedTask.goalId) {
        clonedPlannedTask.goalId = plannedTask.goalId;
    }

    if (!clonedPlannedTask.status) {
        clonedPlannedTask.status = 'INCOMPLETE';
    }

    return clonedPlannedTask;
};

export const createPlannedTaskModel = (task: TaskModel, startMinute: number, duration: number, goalId?: string) => {
    const plannedTask: PlannedTaskModel = {
        routine: task,
        startMinute: startMinute,
        duration: duration,
        status: 'INCOMPLETE',
    };

    if (goalId) {
        plannedTask.goalId = goalId;
    }

    return plannedTask;
};

export const getPlannedTaskGoalId = (plannedTask: PlannedTaskModel) => {
    if ('' === plannedTask.goalId) {
        return undefined;
    }

    return plannedTask.goalId ? plannedTask.goalId : plannedTask.routine.goalId;
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
        this.updateGoalTask(plannedTask);
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

        createdPlannedTasks.forEach((createdPlannedTask) => {
            this.updateGoalTask(createdPlannedTask);
        });

        return createdPlannedTasks;
    }

    private static async updateGoalTask(plannedTask: PlannedTaskModel) {
        const goalId = plannedTask.goalId ? plannedTask.goalId : plannedTask.routine.goalId;
        if (goalId) {
            GoalController.getGoal(getCurrentUid(), goalId, (goal: GoalModel) => {
                GoalController.updateGoalTask(goal, plannedTask);
            });
        }
    }
}

export default PlannedTaskController;
