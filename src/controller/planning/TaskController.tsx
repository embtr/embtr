import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { getDateFromDayKey } from './PlannedDayController';
import axiosInstance from 'src/axios/axios';
import { TASK } from 'resources/endpoints';
import { Task as NewTaskModel, Task, Unit } from 'resources/schema';
import {
    CreateTaskRequest,
    CreateTaskResponse,
    TaskPreferenceRequest,
} from 'resources/types/requests/TaskTypes';
import { Timestamp } from 'firebase/firestore';
import { MetadataController, MetadataKey } from '../metadata/MetadataController';

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

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const getDayOfWeekFromDayKey = (dayKey: string) => {
    const date = getDateFromDayKey(dayKey);
    const dayOfWeek = getUTCDayOfWeek(date);
    return dayOfWeek;
};

export const getLocalDayOfWeek = (date: Date) => {
    const dayNumber = date.getDay();
    const dayOfWeek = days[dayNumber];

    return dayOfWeek;
};

export const getUTCDayOfWeek = (date: Date) => {
    const dayNumber = date.getUTCDay();
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
        const startTime = Date.now();
        return await axiosInstance
            .get(`${TASK}`, { params: { q: query } })
            .then((success) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                return success.data.tasks;
            })
            .catch((error) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                return [];
            });
    }

    public static async getRecent(): Promise<NewTaskModel[]> {
        return await axiosInstance
            .get(`${TASK}recent`)
            .then((success) => {
                return success.data.tasks;
            })
            .catch((error) => {
                return [];
            });
    }

    public static async getRecommended(): Promise<NewTaskModel[]> {
        return await axiosInstance
            .get(`${TASK}recommended`)
            .then((success) => {
                return success.data.tasks;
            })
            .catch((error) => {
                return [];
            });
    }

    public static async updatePreference(task: Task, unit?: Unit, quantity?: number) {
        const request: TaskPreferenceRequest = {
            unitId: unit?.id,
            quantity: quantity,
        };

        return await axiosInstance
            .put(`/task/${task.id}/preference`, request)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }
}

export default TaskController;
