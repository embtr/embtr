import { Timestamp } from 'firebase/firestore';
import { TaskModel } from 'src/controller/planning/TaskController';
import axiosInstance from 'src/axios/axios';
import { PLANNED_DAY } from 'resources/endpoints';
import {
    CreatePlannedTaskRequest,
    UpdatePlannedTaskRequest,
    UpdatePlannedTaskResponse,
} from 'resources/types/requests/PlannedTaskTypes';
import { PlannedDay } from 'resources/schema';
import { PlannedTask } from 'resources/schema';

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

class PlannedTaskController {
    public static async create(plannedDay: PlannedDay, plannedTask: PlannedTask) {
        if (!plannedDay.dayKey) {
            console.log('no day key found')
            return;
        }

        const request: CreatePlannedTaskRequest = {
            plannedTask,
        };

        console.log('sending request:', request)
        return await axiosInstance
            .post(`${PLANNED_DAY}${plannedDay.dayKey}/planned-task/`, request)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async complete(plannedTask: PlannedTask) {
        return await this.update(plannedTask);
    }

    public static async update(plannedTask: PlannedTask) {
        const request: UpdatePlannedTaskRequest = {
            plannedTask,
        };

        return await axiosInstance
            .patch(`${PLANNED_DAY}planned-task/`, request)
            .then((success) => {
                const updatedPlannedTask: UpdatePlannedTaskResponse = success.data;
                return updatedPlannedTask;
            })
            .catch((error) => {
                return undefined;
            });
    }
}

export default PlannedTaskController;
