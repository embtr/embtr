import { DocumentData, QueryDocumentSnapshot, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { TaskModel } from 'src/controller/planning/TaskController';
import PlannedTaskDao from 'src/firebase/firestore/planning/PlannedTaskDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { DELETED } from 'src/util/constants';
import { UserModel } from '../user/UserController';
import { GoalModel } from './GoalController';
import PlannedDayController, { PlannedDay, plannedTaskIsComplete } from './PlannedDayController';
import axiosInstance from 'src/axios/axios';
import { PLANNED_DAY } from 'resources/endpoints';
import { CreatePlannedTaskRequest, UpdatePlannedTaskRequest } from 'resources/types/requests/PlannedTaskTypes';
import { PlannedDay as PlannedDayModel } from 'resources/schema';
import { PlannedTask as NewPlannedTaskModel } from 'resources/schema';
import { Task as NewTaskModel } from 'resources/schema';

export interface PlannedTaskModel {
    id?: string;
    uid: string;
    dayKey: string;
    routine: TaskModel;
    status?: string;
    goalId?: string;
    pillarId?: string;
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

    if (plannedTask.pillarId) {
        clonedPlannedTask.pillarId = plannedTask.pillarId;
    }

    if (!clonedPlannedTask.status) {
        clonedPlannedTask.status = 'INCOMPLETE';
    }

    return clonedPlannedTask;
};

export const createPlannedTaskModel = (dayKey: string, task: TaskModel, startMinute: number, duration: number, goal?: GoalModel) => {
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

    if (goal) {
        plannedTask.goalId = goal.id;
        plannedTask.pillarId = goal.pillarId;
    }

    return plannedTask;
};

export const getPlannedTaskGoalId = (plannedTask: PlannedTaskModel) => {
    if ('' === plannedTask.goalId) {
        return undefined;
    }

    return plannedTask.goalId ? plannedTask.goalId : plannedTask.routine.goalId;
};

export const getLongestStreak = (plannedTasks: PlannedTaskModel[]): number => {
    let currentLength = 0;
    let longestLength = 0;

    for (const plannedTask of plannedTasks.sort((a, b) => (a.dayKey > b.dayKey ? 1 : -1))) {
        if (plannedTaskIsComplete(plannedTask)) {
            currentLength++;
            longestLength = Math.max(longestLength, currentLength);
        } else {
            currentLength = 0;
        }
    }

    return longestLength;
};

class PlannedTaskController {
    public static async addTaskViaApi(plannedDay: PlannedDayModel, task: NewTaskModel) {
        if (!plannedDay.id || !task.id) {
            return;
        }

        const request: CreatePlannedTaskRequest = {
            plannedDayId: plannedDay.id,
            taskId: task.id,
        };

        return await axiosInstance
            .post(`${PLANNED_DAY}planned-task/`, request)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async updateViaApi(plannedTask: NewPlannedTaskModel) {
        const request: UpdatePlannedTaskRequest = {
            plannedTask,
        };

        return await axiosInstance
            .patch(`${PLANNED_DAY}planned-task/`, request)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    /*
     * OLD CODE
     */
    public static async create(plannedTask: PlannedTaskModel) {
        const results = await PlannedTaskDao.create(plannedTask);
        plannedTask.id = results.id;

        return plannedTask;
    }

    public static async createTasks(plannedTasks: PlannedTaskModel[]) {
        const createdPlannedTasks: PlannedTaskModel[] = [];
        for (const plannedTask of plannedTasks) {
            const result = await this.create(plannedTask);
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

    public static async getAll(user: UserModel) {
        const results = await PlannedTaskDao.getAll(user.uid);

        const plannedTasks: PlannedTaskModel[] = this.getPlannedTasksFromResults(results);
        return plannedTasks;
    }

    public static async getAllInPlannedDay(plannedDay: PlannedDay) {
        const results = await PlannedTaskDao.getAllInPlannedDayByDayKey(plannedDay.uid, plannedDay.dayKey);

        const plannedTasks: PlannedTaskModel[] = this.getPlannedTasksFromResults(results);
        return plannedTasks;
    }

    public static async getHabitHistory(habitId: string) {
        const results = await PlannedTaskDao.getAllWithHabitId(habitId);

        const plannedTasks: PlannedTaskModel[] = this.getPlannedTasksFromResults(results);
        return plannedTasks;
    }

    public static async getGoalHistory(goalId: string) {
        const results = await PlannedTaskDao.getAllWithGoalId(goalId);

        const plannedTasks: PlannedTaskModel[] = this.getPlannedTasksFromResults(results);
        return plannedTasks;
    }

    public static async getPillarHistory(pillarId: string) {
        const results = await PlannedTaskDao.getAllWithPillarId(pillarId);

        const plannedTasks: PlannedTaskModel[] = this.getPlannedTasksFromResults(results);
        return plannedTasks;
    }

    public static async update(user: UserModel, plannedTask: PlannedTaskModel) {
        //update task
        await PlannedTaskDao.update(plannedTask);

        //update daily result
        await PlannedDayController.refreshDailyResult(user, plannedTask.dayKey);

        //await LevelController.handlePlannedDayStatusChange(plannedDay);
    }

    private static async getCurrent(id: string) {
        const results = await PlannedTaskDao.get(id);
        const plannedTask: PlannedTaskModel = results.data() as PlannedTaskModel;
        plannedTask.id = results.id;

        return plannedTask;
    }

    private static getPlannedTasksFromResults(results: QuerySnapshot<DocumentData>) {
        const plannedTasks: PlannedTaskModel[] = [];
        results.docs.forEach((doc) => {
            const plannedTask: PlannedTaskModel = this.getPlannedTaskFromData(doc);

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

    private static getPlannedTaskFromData(doc: QueryDocumentSnapshot<DocumentData>) {
        const plannedTask: PlannedTaskModel = doc.data() as PlannedTaskModel;
        plannedTask.id = doc.id;

        return plannedTask;
    }

    private static isValidDayKey(dayKey: string) {
        return dayKey && dayKey.length === 8 && /^\d+$/.test(dayKey);
    }
}

export default PlannedTaskController;
