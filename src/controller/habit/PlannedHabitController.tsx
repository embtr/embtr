import axiosInstance from 'src/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { PlannedTask } from 'resources/schema';
import { GetPlannedHabitResponse } from 'resources/types/requests/PlannedTaskTypes';

export class PlannedHabitController {
    public static async get(id: number): Promise<PlannedTask | undefined> {
        return await axiosInstance
            .get<GetPlannedHabitResponse>(`/planned-habit/${id}`)
            .then((success) => {
                return success.data.plannedHabit;
            })
            .catch((error) => {
                return undefined;
            });
    }
}

export namespace PlannedHabitCustomHooks {
    export const usePlannedHabit = (id: number) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['plannedHabit', id],
            queryFn: () => PlannedHabitController.get(id),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            enabled: !!id,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
