import axiosInstance from 'src/axios/axios';
import {
    GetHabitJourneyResponse,
    GetHabitSummariesResponse,
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
}
