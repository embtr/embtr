import { Timestamp } from 'firebase/firestore';
import { TaskModel } from 'src/controller/planning/TaskController';
import axiosInstance from 'src/axios/axios';
import { PLANNED_DAY } from 'resources/endpoints';
import {
    CreatePlannedTaskRequest,
    UpdatePlannedTaskRequest,
    UpdatePlannedTaskResponse,
} from 'resources/types/requests/PlannedTaskTypes';
import { Habit, PlannedDay, Unit } from 'resources/schema';
import { PlannedTask } from 'resources/schema';
import { Task } from 'resources/schema';

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
    public static async addTaskViaApi(
        plannedDay: PlannedDay,
        task: Task,
        habit?: Habit,
        unit?: Unit,
        quantity?: number
    ) {
        if (!plannedDay.id || !task.id) {
            return;
        }

        const request: CreatePlannedTaskRequest = {
            plannedDayId: plannedDay.id,
            taskId: task.id,
            habitId: habit?.id,
            unitId: unit?.id,
            quantity,
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

    public static async complete(plannedTask: PlannedTask) {
        return await this.update(plannedTask);
    }

    public static async reset(plannedTask: PlannedTask) {
        const clone = { ...plannedTask };
        clone.status = 'INCOMPLETE';

        return await this.update(clone);
    }

    public static async fail(plannedTask: PlannedTask) {
        plannedTask.status = 'FAILED';
        return await this.update(plannedTask);
    }

    public static async delete(plannedTask: PlannedTask) {
        const clone = { ...plannedTask };
        clone.active = false;
        return await this.update(clone);
    }

    public static async get(plannedTaskId: number) {
        return await axiosInstance
            .get(`${PLANNED_DAY}planned-task/${plannedTaskId}`)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async update(plannedTask: PlannedTask) {
        const request: UpdatePlannedTaskRequest = {
            plannedTask,
        };

        return await axiosInstance
            .patch(`${PLANNED_DAY}planned-task/`, request)
            .then((success) => {
                const updatedPlannedTask: UpdatePlannedTaskResponse = success.data;
                return updatedPlannedTask.plannedTask;
            })
            .catch((error) => {
                return undefined;
            });
    }
}

export default PlannedTaskController;
