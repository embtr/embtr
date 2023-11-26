import { Timestamp } from 'firebase/firestore';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { COMPLETE, FAILED, INCOMPLETE, ReactQueryStaleTimes } from 'src/util/constants';
import { getDateFormatted, getDaysOld } from 'src/util/DateUtility';
import { PlannedTaskModel } from './PlannedTaskController';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { PLANNED_DAY_RESULT, PLANNED_DAY } from 'resources/endpoints';
import axiosInstance from 'src/axios/axios';
import { PlannedDay as PlannedDayModel } from 'resources/schema';
import {
    CreatePlannedDayRequest,
    CreatePlannedDayResponse,
    GetPlannedDayResponse,
} from 'resources/types/requests/PlannedDayTypes';
import { CreatePlannedDayResultRequest } from 'resources/types/requests/PlannedDayResultTypes';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser, getSelectedDayKey } from 'src/redux/user/GlobalState';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';

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

export const createPlannedTaskByPlannedTask = (
    plannedTask: PlannedTaskModel,
    startMinute: number,
    duration: number
) => {
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

export const getDayKeyForTheFirstOfTheMonth = () => {
    const date = new Date();
    date.setDate(1);

    return getKeyFromDate(date);
};

export const getTomorrowKey = () => {
    return getKey(new Date().getDate() + 1);
};

export const getDateStringFromDate = (date: Date) => {
    const dayOfTheWeek = getDayOfTheWeekFromDate(date);
    const month = getMonthFromDate(date);
    const day = getDayFromDate(date);

    return `${dayOfTheWeek}, ${month} ${day}`;
};

export const getDayOfTheWeekFromDate = (date: Date) => {
    switch (date.getDay()) {
        case 0:
            return 'Monday';
        case 1:
            return 'Tuesday';
        case 2:
            return 'Wednesday';
        case 3:
            return 'Thursday';
        case 4:
            return 'Friday';
        case 5:
            return 'Saturday';
        case 6:
            return 'Sunday';
    }
};

export const getMonthFromDate = (date: Date) => {
    switch (date.getMonth()) {
        case 0:
            return 'January';
        case 1:
            return 'Febuary';
        case 2:
            return 'March';
        case 3:
            return 'April';
        case 4:
            return 'May';
        case 5:
            return 'June';
        case 6:
            return 'July';
        case 7:
            return 'August';
        case 8:
            return 'September';
        case 9:
            return 'October';
        case 10:
            return 'November';
        case 11:
            return 'December';
    }
};

export const getDayFromDate = (date: Date) => {
    return date.getDate() + 1;
};

export const getDayFromDayKey = (dayKey: string) => {
    return parseInt(dayKey.substring(8, 10));
};

export const getDateFromDayKey = (dayKey: string) => {
    let date = new Date();

    const year = parseInt(dayKey.substring(0, 4));
    const month = parseInt(dayKey.substring(5, 7)) - 1;
    const day = parseInt(dayKey.substring(8, 10));

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
    public static async completeDayViaApi(
        plannedDay: PlannedDayModel
    ): Promise<GetPlannedDayResponse> {
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

    public static async getForCurrentUserViaApi(
        dayKey: string
    ): Promise<PlannedDayModel | undefined> {
        const userId = await getUserIdFromToken();
        if (!!userId) {
            return await this.getViaApi(userId, dayKey);
        }

        return undefined;
    }

    public static async getViaApi(
        userId: number,
        dayKey: string
    ): Promise<PlannedDayModel | undefined> {
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

    public static async getOrCreateForUser(userId: number, dayKey: string) {
        const plannedDay = await this.getViaApi(userId, dayKey);
        if (plannedDay) {
            return plannedDay;
        }

        const createResult: CreatePlannedDayResponse = await this.createViaApi(dayKey);
        if (createResult.plannedDay) {
            return createResult.plannedDay;
        }

        return undefined;
    }

    public static async prefetchAllPlannedDayData() {
        const currentUserId = await getUserIdFromToken();
        if (!currentUserId) {
            return;
        }

        let dayKey = getDayKeyForTheFirstOfTheMonth();
        for (let i = 0; i < 31; i++) {
            dayKey = getNextDayKey(dayKey);
            this.prefetchPlannedDayData(dayKey);
        }
    }

    public static async prefetchPlannedDayData(dayKey: string) {
        const currentUserId = await getUserIdFromToken();
        if (!currentUserId) {
            return;
        }

        reactQueryClient.prefetchQuery({
            queryKey: ['plannedDay', currentUserId, dayKey],
            queryFn: () => PlannedDayController.getOrCreateForUser(currentUserId, dayKey),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });
    }
}

export namespace PlannedDayCustomHooks {
    export const usePlannedDay = (userId: number, dayKey: string) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['plannedDay', userId, dayKey],
            queryFn: () => PlannedDayController.getOrCreateForUser(userId, dayKey),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            enabled:
                dayKey !== undefined && dayKey.length > 0 && userId !== undefined && userId > 0,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useSelectedPlannedDay = () => {
        const currentUser = useAppSelector(getCurrentUser);
        const dayKey = useAppSelector(getSelectedDayKey);
        const plannedDay = PlannedDayCustomHooks.usePlannedDay(currentUser.id ?? 0, dayKey);

        return {dayKey, plannedDay};
    };

    export const useTodaysPlannedDay = () => {
        const currentUser = useAppSelector(getCurrentUser);
        const todayDayKey = getTodayKey();
        const plannedDay = PlannedDayCustomHooks.usePlannedDay(currentUser.id ?? 0, todayDayKey);

        return plannedDay;
    };
}

export default PlannedDayController;
