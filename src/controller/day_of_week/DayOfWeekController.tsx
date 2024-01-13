import axiosInstance from 'src/axios/axios';
import { GetDaysOfWeekResponse } from 'resources/types/requests/DayOfWeekTypes';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';

export class DayOfWeekController {
    public static async getAll() {
        return axiosInstance
            .get<GetDaysOfWeekResponse>(`/day-of-week/v1/`)
            .then((success) => {
                return success.data.daysOfWeek ?? [];
            })
            .catch((error) => {
                console.log(error);
                return [];
            });
    }
}

export namespace DayOfWeekCustomHooks {
    export const useDaysOfWeek = () => {
        const { status, error, data } = useQuery({
            queryKey: ['daysOfWeek'],
            queryFn: DayOfWeekController.getAll,
            staleTime: ReactQueryStaleTimes.INFINITY,
        });

        return data ?? [];
    };
}
