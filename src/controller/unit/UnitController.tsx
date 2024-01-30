import axiosInstance from 'src/axios/axios';
import { GetUnitsResponse } from 'resources/types/requests/UnitTypes';
import { useQuery } from '@tanstack/react-query';
import { ScheduledHabitController } from 'src/controller/habit/ScheduledHabitController';
import { ReactQueryStaleTimes } from 'src/util/constants';

export class UnitController {
    public static async getAll() {
        return axiosInstance
            .get<GetUnitsResponse>(`/unit/`)
            .then((success) => {
                return success.data.units ?? [];
            })
            .catch((error) => {
                return [];
            });
    }
}

export namespace UnitCustomHooks {
    export function useUnits() {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['units'],
            queryFn: async () => await UnitController.getAll(),
            staleTime: ReactQueryStaleTimes.INFINITY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data: data ?? [] };
    }
}
