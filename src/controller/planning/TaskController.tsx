import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import TaskDao from 'src/firebase/firestore/planning/TaskDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { getDateFromDayKey } from './PlannedDayController';
import axiosInstance from 'src/axios/axios';
import { TASK } from 'resources/endpoints';
import { Task as NewTaskModel } from 'resources/schema';
import { CreateTaskRequest, CreateTaskResponse } from 'resources/types/TaskTypes';

export interface TaskModel {
    id?: string;
    uid: string;
    added: Timestamp;
    modified: Timestamp;
    name: string;
    description: string;
    goalId?: string;
    active: boolean;
}

export const getDayOfWeekFromDayKey = (dayKey: string) => {
    const date = getDateFromDayKey(dayKey);
    const dayOfWeek = getDayOfWeek(date);
    return dayOfWeek;
};

export const getDayOfWeek = (date: Date) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const dayNumber = date.getDay();
    const dayOfWeek = days[dayNumber];
    return dayOfWeek;
};

export const startMinuteToString = (startMinute: number) => {
    const hours = Math.floor(startMinute / 60);
    const minutes = startMinute % 60;

    const hoursString = '' + (hours <= 12 ? hours : hours - 12);
    const minutesString = (minutes < 10 ? '0' : '') + minutes;
    const AMPMString = hours <= 12 ? 'AM' : 'PM';

    return '' + hoursString + ':' + minutesString + ' ' + AMPMString;
};

export const durationToString = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    let hoursString = '00';
    if (hours > 0) {
        hoursString = hours.toString();
    }

    let minutesString = '00';
    if (minutes > 0) {
        minutesString = minutes.toString();
    }

    if (minutesString.length == 1) {
        minutesString = '0' + minutesString;
    }

    return hoursString + ':' + minutesString;
};

export const createTaskModel = (name: string, description: string, goalId?: string) => {
    const task: TaskModel = {
        uid: getCurrentUid(),
        added: Timestamp.now(),
        modified: Timestamp.now(),
        name: name,
        description: description,
        active: true,
    };

    if (goalId) {
        task.goalId = goalId;
    }

    return task;
};

export const FAKE_HABIT: TaskModel = {
    uid: '',
    added: Timestamp.now(),
    modified: Timestamp.now(),
    name: '',
    description: '',
    active: true,
};

class TaskController {
    public static async createViaApi(title: string): Promise<NewTaskModel> {
        const request: CreateTaskRequest = {
            title,
        };

        return await axiosInstance
            .post(`${TASK}`, request)
            .then((success) => {
                const response: CreateTaskResponse = success.data;
                return response.task;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async search(query: string): Promise<NewTaskModel[]> {
        return await axiosInstance
            .get(`${TASK}`, { params: { q: query } })
            .then((success) => {
                return success.data.tasks;
            })
            .catch((error) => {
                return [];
            });
    }

    /*
     * OLD LOGIC BELOW ~~~~~
     */
    public static clone(task: TaskModel) {
        const clone: TaskModel = {
            id: task.id,
            uid: task.uid,
            added: task.added,
            modified: task.modified,
            name: task.name,
            description: task.description,
            goalId: task.goalId,
            active: task.active,
        };

        if (task.id) {
            clone.id = task.id;
        }

        return clone;
    }

    public static createTask(task: TaskModel, callback: Function) {
        const result = TaskDao.createTask(task);
        result.then(() => {
            callback();
        });
    }

    public static async update(task: TaskModel) {
        task.modified = Timestamp.now();
        await TaskDao.update(task);
    }

    public static async archiveTask(task: TaskModel, callback: Function) {
        task.active = false;
        await TaskDao.update(task);
        callback();
    }

    public static async getHabitAsync(id: string) {
        const uid = getCurrentUid();
        const result = await TaskDao.getTask(uid, id);

        const habit = this.getHabitFromData(result);
        return habit;
    }

    public static getHabit(id: string, callback: Function) {
        const uid = getCurrentUid();
        const result = TaskDao.getTask(uid, id);
        result
            .then((document) => {
                const task = this.getHabitFromData(document);
                callback(task);
            })
            .catch(() => {
                callback(undefined);
            });
    }

    private static getHabitFromData(data: DocumentSnapshot<DocumentData>): TaskModel {
        let habit: TaskModel = data.data() as TaskModel;
        habit.id = data.id;

        if (!habit.active) {
            habit.active = true;
        }

        return habit;
    }

    static getTasks(uid: string, callback: Function) {
        const result = TaskDao.getTasks(uid);

        let tasks: TaskModel[] = [];
        result
            .then((documents) => {
                documents.docs.forEach((document) => {
                    let task: TaskModel = document.data() as TaskModel;

                    if (task.active === false) {
                        return;
                    }

                    task.id = document.id;
                    tasks.push(task);
                });
            })
            .then(() => {
                tasks.sort((a, b) => (a.name > b.name ? 1 : -1)).reverse();
                callback(tasks);
            })
            .catch(() => {
                callback([]);
            });
    }
}

export default TaskController;
