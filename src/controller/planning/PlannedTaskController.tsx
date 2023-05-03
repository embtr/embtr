import { Timestamp } from 'firebase/firestore';
import { TaskModel } from 'src/controller/planning/TaskController';
import { plannedTaskIsComplete } from './PlannedDayController';
import axiosInstance from 'src/axios/axios';
import { PLANNED_DAY } from 'resources/endpoints';
import {
    CreatePlannedTaskRequest,
    UpdatePlannedTaskRequest,
} from 'resources/types/requests/PlannedTaskTypes';
import { Habit, PlannedDay as PlannedDayModel } from 'resources/schema';
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
    public static async addTaskViaApi(
        plannedDay: PlannedDayModel,
        task: NewTaskModel,
        habit?: Habit
    ) {
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
}

export default PlannedTaskController;
