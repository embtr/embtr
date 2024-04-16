import { Timestamp } from 'firebase/firestore';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { getDateFormatted } from 'src/util/DateUtility';
import { PlannedTaskModel } from './PlannedTaskController';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { PLANNED_DAY_RESULT, PLANNED_DAY } from 'resources/endpoints';
import axiosInstance from 'src/axios/axios';
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
import { GetBooleanResponse } from 'resources/types/requests/GeneralTypes';
import { PlannedDay, User } from 'resources/schema';

export interface PlannedDayMetadata {
    added: Timestamp;
    modified: Timestamp;
}

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

    return getDayKeyFromDate(date);
};

export const getDayKeyFromDate = (date: Date) => {
    const dateString = getDateFormatted(date);
    return dateString;
};

export const getDayKeyForSelectedMonth = (dayKey: string, month: number) => {
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const newSelectedDayKey = dayKey.replace(/-\d\d-/, `-${monthString}-`);

    return newSelectedDayKey;
};

export const getDayKeyForSelectedDay = (dayKey: string, day: number) => {
    const dayString = day < 10 ? `0${day}` : `${day}`;
    const newSelectedDayKey = dayKey.substring(0, dayKey.length - 2) + dayString;

    return newSelectedDayKey;
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

    const result = getDayKeyFromDate(yesterday);
    return result;
};

export const getNextDayKey = (dayKey: string) => {
    const date = getDateFromDayKey(dayKey);

    const today = date;
    today.setDate(date.getDate() + 1);

    const result = getDayKeyFromDate(today);
    return result;
};

export const getDayKeyForTheFirstOfTheMonth = () => {
    const date = new Date();
    date.setDate(1);

    return getDayKeyFromDate(date);
};

export const getTomorrowKey = () => {
    return getKey(new Date().getDate() + 1);
};

export const getMonthFromDayKey = (dayKey: string) => {
    const date = getDateFromDayKey(dayKey);
    return getMonthFromDate(date);
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

export const getDateFromDayKey = (dayKey: string) => {
    let date = new Date();

    const year = parseInt(dayKey.substring(0, 4));
    const month = parseInt(dayKey.substring(5, 7)) - 1;
    const day = parseInt(dayKey.substring(8, 10));

    date.setFullYear(year);
    date.setMonth(month);
    date.setDate(day);

    const dateAsUtc = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
    );

    return dateAsUtc;
};

class PlannedDayController {
    public static async completeDayViaApi(plannedDay: PlannedDay): Promise<PlannedDay | undefined> {
        const body: CreatePlannedDayResultRequest = {
            plannedDayId: plannedDay.id ?? 0,
        };

        return await axiosInstance
            .post<GetPlannedDayResponse>(`${PLANNED_DAY_RESULT}`, body)
            .then((success) => {
                return success.data.plannedDay;
            })
            .catch((error) => {
                return plannedDay;
            });
    }

    public static async createViaApi(dayKey: string): Promise<PlannedDay | undefined> {
        const body: CreatePlannedDayRequest = {
            dayKey,
        };

        return await axiosInstance
            .post<CreatePlannedDayResponse>(`${PLANNED_DAY}`, body)
            .then((success) => {
                console.log('PlannedDayController.createViaApi', success.data);
                return success.data.plannedDay;
            })
            .catch((error) => {
                console.log('PlannedDayController.createViaApi', error);
                return undefined;
            });
    }

    public static async getForCurrentUserViaApi(dayKey: string): Promise<PlannedDay | undefined> {
        const userId = await getUserIdFromToken();
        if (!!userId) {
            return await this.getViaApi(userId, dayKey);
        }

        return undefined;
    }

    public static async getViaApi(userId: number, dayKey: string): Promise<PlannedDay | undefined> {
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

    public static async getOrCreateViaApi(
        userId: number,
        dayKey: string
    ): Promise<PlannedDay | undefined> {
        const plannedDay = await this.getViaApi(userId, dayKey);
        if (plannedDay) {
            return plannedDay;
        }

        const newPlannedDay = await this.createViaApi(dayKey);
        return newPlannedDay;
    }

    public static async isComplete(userId: number, dayKey: string): Promise<boolean | undefined> {
        return await axiosInstance
            .get(`${PLANNED_DAY}${userId}/${dayKey}/isComplete`)
            .then((success) => {
                const result = success.data as GetBooleanResponse;
                return result.result;
            })
            .catch((error) => {
                return false;
            });
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
            queryFn: () => PlannedDayController.getViaApi(currentUserId, dayKey),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });
    }

    public static async invalidatePlannedDay(userId: number, dayKey: string) {
        reactQueryClient.invalidateQueries(['plannedDay', userId, dayKey]);
        reactQueryClient.invalidateQueries(['plannedDayIsComplete', userId, dayKey]);
    }
}

export namespace PlannedDayCustomHooks {
    export const useGetOrCreatePlannedDayForCurentUser = (dayKey: string) => {
        const currentUser = useAppSelector(getCurrentUser);
        const userId = currentUser.id ?? 0;

        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['plannedDay', userId, dayKey],
            queryFn: () => PlannedDayController.getOrCreateViaApi(userId, dayKey),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            enabled:
                dayKey !== undefined && dayKey.length > 0 && userId !== undefined && userId > 0,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const usePlannedDayForCurrentUser = (dayKey: string) => {
        const plannedDay = useGetOrCreatePlannedDayForCurentUser(dayKey);
        return plannedDay;
    };

    export const useSelectedPlannedDayForCurrentUser = () => {
        const dayKey = useAppSelector(getSelectedDayKey);
        const plannedDay = PlannedDayCustomHooks.usePlannedDayForCurrentUser(dayKey);

        return { dayKey, plannedDay };
    };

    export const usePlannedDay = (userId: number, dayKey: string) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['plannedDay', userId, dayKey],
            queryFn: () => PlannedDayController.getViaApi(userId, dayKey),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            enabled:
                dayKey !== undefined && dayKey.length > 0 && userId !== undefined && userId > 0,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useTodaysPlannedDayForUser = (user: User) => {
        const todayDayKey = getTodayKey();
        const plannedDay = PlannedDayCustomHooks.usePlannedDay(user.id ?? 0, todayDayKey);

        return { todayDayKey, plannedDay };
    };

    export const usePlannedDayIsComplete = (dayKey: string) => {
        const currentUser = useAppSelector(getCurrentUser);
        const userId = currentUser.id ?? 0;

        const { data } = useQuery({
            queryKey: ['plannedDayIsComplete', userId, dayKey],
            queryFn: () => PlannedDayController.isComplete(userId, dayKey),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            enabled:
                dayKey !== undefined && dayKey.length > 0 && userId !== undefined && userId > 0,
        });

        return data ?? false;
    };
}

export default PlannedDayController;
