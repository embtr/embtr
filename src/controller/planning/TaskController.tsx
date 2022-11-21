import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import TaskDao from 'src/firebase/firestore/planning/TaskDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { getDateFromDayKey } from './PlannedDayController';

export interface TaskModel {
    id?: string;
    added: Timestamp;
    name: string;
    description: string;
    goalId?: string;
    active: boolean;
}

export const EMPTY_HABIT: TaskModel = {
    added: Timestamp.now(),
    name: '',
    description: '',
    active: true,
};

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

    let minutesString: string = minutes.toString();
    if (minutesString.length == 1) {
        minutesString = '0' + minutesString;
    }

    let value = '';
    if (hours > 0) {
        value += hours + ':';
    }
    value += minutesString + ':';
    value += '00';

    return value;
};

export const createTaskModel = (name: string, description: string, goalId: string) => {
    const task: TaskModel = {
        added: Timestamp.now(),
        name: name,
        description: description,
        goalId: goalId,
        active: true,
    };

    return task;
};

class TaskController {
    public static clone(task: TaskModel) {
        const clone: TaskModel = {
            added: task.added,
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
        await TaskDao.update(task);
    }

    public static async archiveTask(task: TaskModel, callback: Function) {
        task.active = false;
        await TaskDao.update(task);
        callback();
    }

    static getTask(id: string, callback: Function) {
        const uid = getCurrentUid();
        const result = TaskDao.getTask(uid, id);
        result
            .then((document) => {
                const task = this.getTaskFromData(document);
                callback(task);
            })
            .catch(() => {
                callback(undefined);
            });
    }

    private static getTaskFromData(data: DocumentSnapshot<DocumentData>): TaskModel {
        let task: TaskModel = data.data() as TaskModel;
        task.id = data.id;

        if (!task.active) {
            task.active = true;
        }

        return task;
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
