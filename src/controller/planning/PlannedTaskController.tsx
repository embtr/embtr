import { Timestamp } from 'firebase/firestore';
import { TaskModel } from 'src/controller/planning/TaskController';
import axiosInstance from 'src/axios/axios';
import { PLANNED_DAY } from 'resources/endpoints';
import {
    CreateOrReplacePlannedTaskRequest,
    UpdatePlannedTaskRequest,
    UpdatePlannedTaskResponse,
} from 'resources/types/requests/PlannedTaskTypes';
import { PlannedTask } from 'resources/schema';
import axios from 'axios';

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

export const DEFAULT_PLANNED_TASK: PlannedTask = {
    completedQuantity: 0,
    quantity: 0,
};

class PlannedTaskController {
    public static async create(plannedTask: PlannedTask, dayKey: string) {
        return await this.createWithDayKey(plannedTask, dayKey);
    }

    public static async createWithDayKey(plannedTask: PlannedTask, dayKey: string) {
        const request: CreateOrReplacePlannedTaskRequest = {
            plannedTask,
        };

        return await axiosInstance
            .post(`${PLANNED_DAY}${dayKey}/planned-task/`, request)
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

        const startTimeA = Date.now();
        await fetch("https://api.embtr.com/health/");
        const endTimeA = Date.now();
        const responseTimeA = endTimeA - startTimeA;
        console.log(`health: ${responseTimeA}ms`);

        const startTime = Date.now();
        const response = await axiosInstance.get(`health/`);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`health: ${responseTime}ms`);

        try {
            const response = await axiosInstance.put(`${PLANNED_DAY}planned-task/`, request);
            const updatedPlannedTask: UpdatePlannedTaskResponse = response.data;
            return updatedPlannedTask;
        } catch (error) {
            return undefined;
        }
    }
}

export default PlannedTaskController;
