import { ScheduledHabit } from 'resources/schema';
import axiosInstance from 'src/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import {
    CreateScheduledHabitRequest,
    GetScheduledHabitResponse,
    GetScheduledHabitsResponse,
} from 'resources/types/requests/ScheduledHabitTypes';

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
        return await axiosInstance
            .post(`/habit/schedule/${id}/archive`)
            .then((success) => {
                return true;
            })
            .catch((error) => {
                return false;
            });
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
}

export namespace ScheduledHabitCustomHooks {
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
