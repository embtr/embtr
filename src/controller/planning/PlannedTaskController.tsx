import { DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { TaskModel } from 'src/controller/planning/TaskController';
import PlannedTaskDao from 'src/firebase/firestore/planning/PlannedTaskDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { DELETED } from 'src/util/constants';
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
    added: Timestamp;
    modified: Timestamp;
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
        added: plannedTask.added,
        modified: plannedTask.modified,
    };

    if (plannedTask.goalId) {
        clonedPlannedTask.goalId = plannedTask.goalId;
    }

    if (!clonedPlannedTask.status) {
        clonedPlannedTask.status = 'INCOMPLETE';
    }

    return clonedPlannedTask;
};

export const createPlannedTaskModel = (dayKey: string, task: TaskModel, startMinute: number, duration: number, goalId?: string) => {
    const plannedTask: PlannedTaskModel = {
        uid: getCurrentUid(),
        dayKey: dayKey,
        routine: task,
        startMinute: startMinute,
        duration: duration,
        status: 'INCOMPLETE',
        added: Timestamp.now(),
        modified: Timestamp.now(),
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

    public static async get(id: string) {
        const plannedTask: PlannedTaskModel = await this.getCurrent(id);
        return plannedTask;
    }

    public static async getAllInPlannedDay(plannedDay: PlannedDay) {
        const plannedTasks: PlannedTaskModel[] = [];

        const results = await PlannedTaskDao.getAllInPlannedDayByDayKey(plannedDay.uid, plannedDay.dayKey);
        results.docs.forEach((doc) => {
            const plannedTask: PlannedTaskModel = this.getPlannedTaskFromData(plannedDay, doc);
            if (plannedTask.status === 'DELETED') {
                return;
            }
            plannedTasks.push(plannedTask);
        });

        return plannedTasks;
    }

    public static async update(user: UserModel, plannedTask: PlannedTaskModel) {
        //update old goal
        const oldPlannedTask = await this.get(plannedTask.id!);
        const oldGoalId = getPlannedTaskGoalId(oldPlannedTask);
        const newGoalId = getPlannedTaskGoalId(plannedTask);
        if (oldGoalId && oldGoalId !== newGoalId) {
            GoalController.getGoal(plannedTask.uid, oldGoalId, (oldGoal: GoalModel) => {
                GoalController.removePlannedTaskFromGoal(oldGoal, plannedTask);
            });
        }

        //update task
        await PlannedTaskDao.update(plannedTask);

        //update daily result
        await PlannedDayController.refreshDailyResult(user, plannedTask.dayKey);

        //update history
        GoalController.updateHistory(plannedTask);

        //await LevelController.handlePlannedDayStatusChange(plannedDay);
    }

    public static async getHabitHistory(habitId: string) {
        const results = await PlannedTaskDao.getAllWithHabitId(habitId);

        const plannedTasks: PlannedTaskModel[] = [];
        results.docs.forEach((doc) => {
            const plannedTask: PlannedTaskModel = doc.data() as PlannedTaskModel;
            plannedTask.id = doc.id;

            if (plannedTask.status === DELETED) {
                return;
            }

            if (!this.isValidDayKey(plannedTask.dayKey)) {
                return;
            }

            plannedTasks.push(plannedTask);
        });

        return plannedTasks;
    }

    public static async getGoalHistory(goalId: string) {
        const results = await PlannedTaskDao.getAllWithGoalId(goalId);

        const plannedTasks: PlannedTaskModel[] = [];
        results.docs.forEach((doc) => {
            const plannedTask: PlannedTaskModel = doc.data() as PlannedTaskModel;
            plannedTask.id = doc.id;

            if (plannedTask.status === DELETED) {
                return;
            }

            if (!this.isValidDayKey(plannedTask.dayKey)) {
                return;
            }

            plannedTasks.push(plannedTask);
        });

        return plannedTasks;
    }

    private static async getCurrent(id: string) {
        const results = await PlannedTaskDao.get(id);
        const plannedTask: PlannedTaskModel = results.data() as PlannedTaskModel;
        plannedTask.id = results.id;

        return plannedTask;
    }

    private static getPlannedTaskFromData(plannedDay: PlannedDay, doc: QueryDocumentSnapshot<DocumentData>) {
        const plannedTask: PlannedTaskModel = doc.data() as PlannedTaskModel;
        plannedTask.id = doc.id;

        if (plannedDay.dayKey) {
            plannedTask.dayKey = plannedDay.dayKey;
        }

        return plannedTask;
    }

    private static isValidDayKey(dayKey: string) {
        return dayKey && dayKey.length === 8 && /^\d+$/.test(dayKey);
    }
}

export default PlannedTaskController;
