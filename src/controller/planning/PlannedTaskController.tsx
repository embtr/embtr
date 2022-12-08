import { Timestamp } from 'firebase/firestore';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import PlannedDayDao from 'src/firebase/firestore/planning/PlannedDayDao';
import PlannedTaskDao from 'src/firebase/firestore/planning/PlannedTaskDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import MigrationController from '../audit_log/MigrationController';
import LevelController from '../level/LevelController';
import { UserModel } from '../user/UserController';
import GoalController, { GoalModel } from './GoalController';
import PlannedDayController, { PlannedDay } from './PlannedDayController';

export interface PlannedTaskModel {
    id?: string;
    uid: string;
    dayKey: string;
    routine: TaskModel;
    status?: string;
    goalId?: string;
    startMinute?: number;
    duration?: number;
}

export const clonePlannedTaskModel = (plannedTask: PlannedTaskModel) => {
    const clonedPlannedTask: PlannedTaskModel = {
        id: plannedTask.id,
        uid: plannedTask.uid,
        dayKey: plannedTask.dayKey,
        routine: plannedTask.routine,
        status: plannedTask.status,
        startMinute: plannedTask.startMinute,
        duration: plannedTask.duration,
    };

    if (plannedTask.goalId) {
        clonedPlannedTask.goalId = plannedTask.goalId;
    }

    if (!clonedPlannedTask.status) {
        clonedPlannedTask.status = 'INCOMPLETE';
    }

    delete plannedTask.routine['history'];

    return clonedPlannedTask;
};

export const createPlannedTaskModel = (dayKey: string, task: TaskModel, startMinute: number, duration: number, goalId?: string) => {
    const plannedTask: PlannedTaskModel = {
        routine: task,
        uid: getCurrentUid(),
        dayKey: dayKey,
        startMinute: startMinute,
        duration: duration,
        status: 'INCOMPLETE',
    };

    if (goalId) {
        plannedTask.goalId = goalId;
    }

    delete plannedTask.routine.history;

    return plannedTask;
};

export const getPlannedTaskGoalId = (plannedTask: PlannedTaskModel) => {
    if ('' === plannedTask.goalId) {
        return undefined;
    }

    return plannedTask.goalId ? plannedTask.goalId : plannedTask.routine.goalId;
};

class PlannedTaskController {
    public static async add(plannedTask: PlannedTaskModel) {
        const results = await PlannedTaskDao.add(plannedTask);
        plannedTask.id = results.id;

        return plannedTask;
    }

    public static async addTasks(plannedTasks: PlannedTaskModel[]) {
        const createdPlannedTasks: PlannedTaskModel[] = [];
        for (const plannedTask of plannedTasks) {
            const result = await this.add(plannedTask);
            createdPlannedTasks.push(result);
        }

        return createdPlannedTasks;

        //plannedDay.metadata!.modified = Timestamp.now();
        //plannedDay.metadata!.status = 'INCOMPLETE';

        //PlannedDayController.refreshDailyResult(plannedDay);

        //createdPlannedTasks.forEach((createdPlannedTask) => {
        //    TaskController.updateHistory(createdPlannedTask);
        //    this.updateGoalTask(createdPlannedTask);
        //});
    }

    public static async get(user: UserModel, dayKey: string, id: string) {
        let plannedTask: PlannedTaskModel | undefined;
        if (MigrationController.requiresPlannedTaskMigration(user)) {
            plannedTask = await this.getDeprecated(user, dayKey, id);
        } else {
            plannedTask = await this.getCurrent(id);
        }

        return plannedTask;
    }

    public static async getAllInPlannedDay(plannedDay: PlannedDay) {
        const plannedTasks: PlannedTaskModel[] = [];

        const results = await PlannedTaskDao.getAllInPlannedDay(plannedDay.id!);
        results.docs.forEach((doc) => {
            const plannedTask: PlannedTaskModel = doc.data() as PlannedTaskModel;
            plannedTask.id = doc.id;
            plannedTasks.push(plannedTask);
        });

        return plannedTasks;
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
        TaskController.updateHistory(plannedTask);

        callback();
    }

    private static async updateGoalTask(plannedTask: PlannedTaskModel) {
        const goalId = plannedTask.goalId ? plannedTask.goalId : plannedTask.routine.goalId;
        if (goalId) {
            GoalController.getGoal(getCurrentUid(), goalId, (goal: GoalModel) => {
                GoalController.updateGoalTask(goal, plannedTask);
            });
        }
    }

    private static async getCurrent(id: string) {
        const results = await PlannedTaskDao.get(id);
        const plannedTask: PlannedTaskModel = results.data() as PlannedTaskModel;
        plannedTask.id = results.id;

        return plannedTask;
    }

    private static async getDeprecated(user: UserModel, dayKey: string, id: string): Promise<PlannedTaskModel | undefined> {
        const plannedDay = await PlannedDayController.get(user, dayKey);

        plannedDay.plannedTasks.forEach((plannedTask) => {
            if (plannedTask.id === id) {
                return plannedTask;
            }
        });

        return undefined;
    }
}

export default PlannedTaskController;
