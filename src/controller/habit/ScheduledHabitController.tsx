import { ScheduledHabit } from 'resources/schema';
import axiosInstance from 'src/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import {
    ArchiveScheduledHabitRequest,
    CreateScheduledHabitRequest,
    GetScheduledHabitResponse,
    GetScheduledHabitsResponse,
} from 'resources/types/requests/ScheduledHabitTypes';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { PureDate } from 'resources/types/date/PureDate';
import { getTodayPureDate } from 'src/util/DateUtility';

export class ScheduledHabitController {
    public static async create(scheduledHabit: ScheduledHabit) {
        const createScheduledHabitRequest: CreateScheduledHabitRequest = {
            scheduledHabit: scheduledHabit,
        };

        return await axiosInstance
            .post('/habit/schedule', createScheduledHabitRequest)
            .then((success) => {
                return true;
            })
            .catch((error) => {
                return false;
            });
    }

    public static async update(scheduledHabit: ScheduledHabit) {
        return await this.create(scheduledHabit);
    }

    public static async archive(id: number) {
        const date: PureDate = PureDate.fromDateOnClient(new Date());
        const request: ArchiveScheduledHabitRequest = {
            date,
        };

        return await axiosInstance
            .post(`/habit/schedule/${id}/archive`, request)
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }

    public static async getPast() {
        const now = getTodayPureDate();

        try {
            const success = await axiosInstance.get<GetScheduledHabitsResponse>(
                '/scheduled-habit/past/',
                {
                    params: {
                        date: now,
                    },
                }
            );
            return success.data.scheduledHabits;
        } catch (error) {
            return undefined;
        }
    }

    public static async getActive() {
        const now = getTodayPureDate();

        try {
            const success = await axiosInstance.get<GetScheduledHabitsResponse>(
                '/scheduled-habit/active/',
                {
                    params: {
                        date: now,
                    },
                }
            );
            return success.data.scheduledHabits;
        } catch (error) {
            return undefined;
        }
    }

    public static async getFuture() {
        const now = getTodayPureDate();

        try {
            const success = await axiosInstance.get<GetScheduledHabitsResponse>(
                '/scheduled-habit/future/',
                {
                    params: {
                        date: now,
                    },
                }
            );
            return success.data.scheduledHabits;
        } catch (error) {
            return undefined;
        }
    }

    public static async getScheduledHabit(id: number) {
        try {
            const success = await axiosInstance.get<GetScheduledHabitResponse>(
                `/habit/schedule/${id}`
            );
            return success.data.scheduledHabit;
        } catch (error) {
            return undefined;
        }
    }

    public static async getScheduledHabitsByHabit(
        habitId: number
    ): Promise<ScheduledHabit[] | undefined> {
        try {
            const success = await axiosInstance.get<GetScheduledHabitResponse>(
                `/habit/${habitId}/schedules`
            );
            const data: GetScheduledHabitsResponse = success.data;
            return data.scheduledHabits;
        } catch (error) {
            return undefined;
        }
    }

    public static async invalidateScheduledHabitsByHabit(habitId: number) {
        await reactQueryClient.invalidateQueries(['scheduledHabitsByHabit', habitId]);
    }

    public static async invalidatePastScheduledHabits() {
        await reactQueryClient.invalidateQueries(['pastScheduledHabits']);
    }

    public static async invalidateActiveScheduledHabits() {
        await reactQueryClient.invalidateQueries(['activeScheduledHabits']);
    }

    public static async invalidateFutureScheduledHabits() {
        await reactQueryClient.invalidateQueries(['futureScheduledHabits']);
    }
}

export namespace ScheduledHabitCustomHooks {
    export const usePast = () => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['pastScheduledHabits'],
            queryFn: async () => await ScheduledHabitController.getPast(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useActive = () => {
        const { status, error, data, fetchStatus, refetch } = useQuery({
            queryKey: ['activeScheduledHabits'],
            queryFn: async () => await ScheduledHabitController.getActive(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data, refetch };
    };

    export const useFuture = () => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['futureScheduledHabits'],
            queryFn: async () => await ScheduledHabitController.getFuture(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useScheduledHabitsByHabit = (habitId: number) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['scheduledHabitsByHabit', habitId],
            queryFn: async () => await ScheduledHabitController.getScheduledHabitsByHabit(habitId),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            enabled: !!habitId,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useScheduledHabit = (id: number) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['scheduledHabit', id],
            queryFn: async () => await ScheduledHabitController.getScheduledHabit(id),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            enabled: !!id,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
