import { useQuery } from '@tanstack/react-query';
import { PointDefinition } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';
import { GetPointDefinitionsResponse } from 'resources/types/requests/PointsTypes';
import axiosInstance from 'src/axios/axios';
import { ReactQueryStaleTimes } from 'src/util/constants';

export class PointController {
    public static async getDefinitions(): Promise<PointDefinition[]> {
        return axiosInstance
            .get<GetPointDefinitionsResponse>(`/point/definitions/`)
            .then((success) => {
                return success.data.definitions ?? [];
            })
            .catch((error) => {
                return [];
            });
    }
}

export namespace PointCustomHooks {
    export const usePointDefinitions = () => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['pointDefinitions'],
            queryFn: async () => PointController.getDefinitions(),
            staleTime: ReactQueryStaleTimes.ONE_HOUR,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const usePoints = (type: Constants.PointDefinitionType) => {
        const { isLoading, data } = usePointDefinitions();
        if (!data) {
            return 0;
        }

        return data.find((definition) => definition.type === type)?.points ?? 0;
    };

    export const useHabitCompletePoints = () => {
        const points = usePoints(Constants.PointDefinitionType.HABIT_COMPLETE);
        return points;
    };

    export const useDayCompletePoints = () => {
        const points = usePoints(Constants.PointDefinitionType.DAY_COMPLETE);
        return points;
    };
}
