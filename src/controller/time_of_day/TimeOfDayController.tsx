import axiosInstance from 'src/axios/axios';
import { GetTimesOfDayResponse } from 'resources/types/requests/TimeOfDayTypes';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';

export class TimeOfDayController {
    public static async getAll() {
        return axiosInstance
            .get<GetTimesOfDayResponse>(`/time-of-day/v1/`)
            .then((success) => {
                return success.data.timesOfDay ?? [];
            })
            .catch((error) => {
                console.log(error);
                return [];
            });
    }
}

export namespace TimesOfDayCustomHooks {
    export const useTimesOfDay = () => {
        const { status, error, data } = useQuery({
            queryKey: ['timesOfDay'],
            queryFn: TimeOfDayController.getAll,
            staleTime: ReactQueryStaleTimes.INFINITY,
        });

        return data ?? [];
    };
}
