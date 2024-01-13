import { useQuery } from '@tanstack/react-query';
import { GetDailyHistoryResponse } from 'resources/types/requests/DailyHistoryTypes';
import axiosInstance from 'src/axios/axios';
import { ReactQueryStaleTimes } from 'src/util/constants';

export class DailyHistoryController {
    public static async get(userId: number) {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29);

        return axiosInstance
            .get(`/user/v1/${userId}/daily-history/`, { params: { start, end } })
            .then((success) => {
                const response: GetDailyHistoryResponse = success.data;
                return response.dailyHistory;
            })
            .catch((error) => {
                console.log(error);
                return error.response.data;
            });
    }
}

export namespace DailyHistoryCustomHooks {
    export const useDailyHistory = (userId: number) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['dailyHistory', userId],
            queryFn: () => DailyHistoryController.get(userId),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
