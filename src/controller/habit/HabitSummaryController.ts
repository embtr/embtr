import axiosInstance from 'src/axios/axios';
import {
    GetHabitSummariesResponse,
    GetHabitSummaryResponse,
} from 'resources/types/requests/HabitTypes';
import { HabitSummary } from 'resources/types/habit/Habit';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { getTodayPureDate } from 'src/util/DateUtility';

export class HabitSummaryController {
    public static async getHabitSummaries(): Promise<HabitSummary[] | undefined> {
        const now = getTodayPureDate();

        try {
            const success = await axiosInstance.get(`/habit/summary`, {
                params: {
                    cutoffDate: now,
                },
            });
            const body: GetHabitSummariesResponse = success.data;
            return body.habitSummaries;
        } catch (error) {
            return undefined;
        }
    }

    public static async getHabitSummary(id: number): Promise<HabitSummary | undefined> {
        try {
            const now = getTodayPureDate();

            const success = await axiosInstance.get(`/habit/summary/${id}`, {
                params: {
                    cutoffDate: now,
                },
            });
            const body: GetHabitSummaryResponse = success.data;

            return body.habitSummary;
        } catch (error) {
            return undefined;
        }
    }
}

export namespace HabitSummaryCustomHooks {
    export const useHabitSummaries = () => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['habitSummaries'],
            queryFn: () => HabitSummaryController.getHabitSummaries(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useHabitSummary = (id: number) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['habitSummary', id],
            queryFn: () => HabitSummaryController.getHabitSummary(id),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
