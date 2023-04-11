import { Timestamp } from 'firebase/firestore';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { COMPLETE, FAILED, INCOMPLETE } from 'src/util/constants';
import { getDateFormatted, getDaysOld } from 'src/util/DateUtility';
import { PlannedTaskModel } from './PlannedTaskController';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { PLANNED_DAY_RESULT, PLANNED_DAY } from 'resources/endpoints';
import axiosInstance from 'src/axios/axios';
import { PlannedDay as PlannedDayModel } from 'resources/schema';
import { CreatePlannedDayRequest, CreatePlannedDayResponse, GetPlannedDayResponse } from 'resources/types/requests/PlannedDayTypes';
import { CreatePlannedDayResultRequest } from 'resources/types/requests/PlannedDayResultTypes';

export interface PlannedDay {
    id?: string;
    dayKey: string;
    uid: string;
    metadata?: PlannedDayMetadata;
    plannedTasks: PlannedTaskModel[];
}

export interface PlannedDayMetadata {
    added: Timestamp;
    modified: Timestamp;
}

export const getPlannedDayStatus = (plannedDay: PlannedDay): string => {
    if (plannedDayIsComplete(plannedDay)) {
        return COMPLETE;
    }

    if (plannedDayIsFailed(plannedDay)) {
        return FAILED;
    }

    return INCOMPLETE;
};

export const plannedDayIsComplete = (plannedDay: PlannedDay): boolean => {
    for (const plannedTask of plannedDay.plannedTasks) {
        if (!plannedTaskIsComplete(plannedTask)) {
            return false;
        }
    }

    return true;
};

export const plannedDayIsFailed = (plannedDay: PlannedDay): boolean => {
    for (const plannedTask of plannedDay.plannedTasks) {
        if (plannedTaskIsFailed(plannedTask)) {
            return true;
        }
    }

    return false;
};

export const plannedDayIsIncomplete = (plannedDay: PlannedDay): boolean => {
    return !plannedDayIsComplete(plannedDay) && !plannedDayIsFailed(plannedDay);
};

export const plannedTaskIsComplete = (plannedTask: PlannedTaskModel): boolean => {
    return plannedTask.status === COMPLETE;
};

export const plannedTaskIsFailed = (plannedTask: PlannedTaskModel): boolean => {
    return plannedTask.status === FAILED;
};

export const plannedTaskIsIncomplete = (plannedTask: PlannedTaskModel): boolean => {
    return !plannedTaskIsComplete(plannedTask) && !plannedTaskIsFailed(plannedTask);
};

export const createPlannedTaskByPlannedTask = (plannedTask: PlannedTaskModel, startMinute: number, duration: number) => {
    const newPlannedTask: PlannedTaskModel = {
        ...plannedTask,
    };
    newPlannedTask.startMinute = startMinute;
    newPlannedTask.duration = duration;

    return newPlannedTask;
};

export const getKey = (dayOfMonth: number) => {
    const date = new Date();
    date.setDate(dayOfMonth);

    return getKeyFromDate(date);
};

export const getKeyFromDate = (date: Date) => {
    const dateString = getDateFormatted(date);
    return dateString;
};

export const getDayKey = (day: number) => {
    return getKey(day);
};

export const getTodayKey = () => {
    const todayKey = getKey(new Date().getDate());
    return todayKey;
};

export const getPreviousDayKey = (dayKey: string) => {
    const date = getDateFromDayKey(dayKey);

    const yesterday = date;
    yesterday.setDate(date.getDate() - 1);

    const result = getKeyFromDate(yesterday);
    return result;
};

export const getNextDayKey = (dayKey: string) => {
    const date = getDateFromDayKey(dayKey);

    const today = date;
    today.setDate(date.getDate() + 1);

    const result = getKeyFromDate(today);
    return result;
};

export const getTomorrowKey = () => {
    return getKey(new Date().getDate() + 1);
};

export const getDayFromDayKey = (dayKey: string) => {
    return parseInt(dayKey.substring(8, 10));
};

export const getDateFromDayKey = (dayKey: string) => {
    let date = new Date();

    const day = parseInt(dayKey.substring(2, 4));
    const month = parseInt(dayKey.substring(0, 2)) - 1;
    const year = parseInt(dayKey.substring(4));

    date.setFullYear(year);
    date.setMonth(month);
    date.setDate(day);

    return date;
};

export const getDayKeyDaysOld = (dayKey: string) => {
    const then: any = getDateFromDayKey(dayKey);
    const now: any = new Date();

    return getDaysOld(then, now);
};

export const createPlannedDayModel = (uid: string, dayKey: string) => {
    const plannedDay: PlannedDay = {
        dayKey: dayKey,
        uid: getCurrentUid(),
        plannedTasks: [],
    };

    return plannedDay;
};

export const createMetadata = () => {
    const metadata: PlannedDayMetadata = {
        added: Timestamp.now(),
        modified: Timestamp.now(),
    };

    return metadata;
};

class PlannedDayController {
    public static async completeDayViaApi(plannedDay: PlannedDayModel): Promise<GetPlannedDayResponse> {
        const body: CreatePlannedDayResultRequest = {
            plannedDayId: plannedDay.id ?? 0,
        };

        return await axiosInstance
            .post(`${PLANNED_DAY_RESULT}`, body)
            .then((success) => {
                return success.data as GetPlannedDayResponse;
            })
            .catch((error) => {
                return error.response.data as GetPlannedDayResponse;
            });
    }

    public static async createViaApi(dayKey: string): Promise<CreatePlannedDayResponse> {
        const body: CreatePlannedDayRequest = {
            dayKey,
        };

        return await axiosInstance
            .post(`${PLANNED_DAY}`, body)
            .then((success) => {
                return success.data as CreatePlannedDayResponse;
            })
            .catch((error) => {
                return error.response.data as CreatePlannedDayResponse;
            });
    }

    public static async getForCurrentUserViaApi(dayKey: string): Promise<PlannedDayModel | undefined> {
        const userId = await getUserIdFromToken();
        return await this.getViaApi(userId, dayKey);
    }

    public static async getViaApi(userId: number, dayKey: string): Promise<PlannedDayModel | undefined> {
        return await axiosInstance
            .get(`${PLANNED_DAY}${userId}/${dayKey}`)
            .then((success) => {
                const result = success.data as GetPlannedDayResponse;
                if (result.plannedDay) {
                    return result.plannedDay;
                }
                return undefined;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getOrCreateViaApi(dayKey: string): Promise<PlannedDayModel | undefined> {
        let plannedDay = await this.getForCurrentUserViaApi(dayKey);
        if (plannedDay) {
            return plannedDay;
        }

        const createResult: CreatePlannedDayResponse = await this.createViaApi(dayKey);
        if (createResult.plannedDay) {
            return createResult.plannedDay;
        }

        return undefined;
    }
}

export default PlannedDayController;
