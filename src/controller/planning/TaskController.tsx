import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { getDateFromDayKey } from './PlannedDayController';
import axiosInstance from 'src/axios/axios';
import { TASK } from 'resources/endpoints';
import { Habit, Task as NewTaskModel, Task } from 'resources/schema';
import { CreateTaskRequest, CreateTaskResponse } from 'resources/types/requests/TaskTypes';
import { Timestamp } from 'firebase/firestore';

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
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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

    public static async updateHabitPreference(task: Task, habit: Habit) {
        const request = {
            habitId: habit.id,
        };

        return await axiosInstance
            .put(`/task/${task.id}/habit-preference`, request)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }
}

export default TaskController;
