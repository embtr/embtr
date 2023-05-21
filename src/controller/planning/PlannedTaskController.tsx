import { Timestamp } from 'firebase/firestore';
import { TaskModel } from 'src/controller/planning/TaskController';
import axiosInstance from 'src/axios/axios';
import { PLANNED_DAY } from 'resources/endpoints';
import {
    CreatePlannedTaskRequest,
    UpdatePlannedTaskRequest,
} from 'resources/types/requests/PlannedTaskTypes';
import { Habit, PlannedDay } from 'resources/schema';
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
    public static async addTaskViaApi(plannedDay: PlannedDay, task: Task, habit?: Habit) {
        if (!plannedDay.id || !task.id) {
            return;
        }

        const request: CreatePlannedTaskRequest = {
            plannedDayId: plannedDay.id,
            taskId: task.id,
            habitId: habit?.id,
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

    public static async incrementCount(plannedTask: PlannedTask) {
        plannedTask.count = Math.max(0, (plannedTask.count ?? 0) + 1);
        return await this.update(plannedTask);
    }

    public static async decrementCount(plannedTask: PlannedTask) {
        plannedTask.count = Math.max(0, (plannedTask.count ?? 0) - 1);
        plannedTask.completedCount = Math.min(
            plannedTask.count ?? 0,
            plannedTask.completedCount ?? 0
        );

        return await this.update(plannedTask);
    }

    public static async incrementCompletedCount(plannedTask: PlannedTask) {
        const clone = { ...plannedTask };
        clone.completedCount = Math.max(0, (clone.completedCount ?? 0) + 1);
        clone.completedCount = Math.min(clone.count ?? 0, clone.completedCount ?? 0);

        return await this.update(clone);
    }

    public static async decrementCompletedCount(plannedTask: PlannedTask) {
        const clone = { ...plannedTask };
        clone.completedCount = Math.max(0, (clone.completedCount ?? 0) - 1);
        return await this.update(clone);
    }

    public static async complete(plannedTask: PlannedTask) {
        plannedTask.completedCount = plannedTask.count ?? 0;
        return await this.update(plannedTask);
    }

    public static async reset(plannedTask: PlannedTask) {
        const clone = { ...plannedTask };
        clone.completedCount = 0;
        clone.status = 'INCOMPLETE';

        return await this.update(clone);
    }

    public static async fail(plannedTask: PlannedTask) {
        plannedTask.status = 'FAILED';
        return await this.update(plannedTask);
    }

    public static async delete(plannedTask: PlannedTask) {
        plannedTask.count = 0;
        return await this.update(plannedTask);
    }

    public static async get(plannedDayId: string) {
        return await axiosInstance
            .get(`${PLANNED_DAY}planned-task/${plannedDayId}`)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    private static async update(plannedTask: PlannedTask) {
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
}

export default PlannedTaskController;
