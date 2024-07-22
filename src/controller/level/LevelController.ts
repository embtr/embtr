import { useQuery } from '@tanstack/react-query';
import { Level } from 'resources/schema';
import { LevelDetails } from 'resources/types/dto/Level';
import { GetLevelDetailsResponse, GetLevelsResponse } from 'resources/types/requests/LevelTypes';
import axiosInstance from 'src/axios/axios';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { ReactQueryStaleTimes } from 'src/util/constants';

export class LevelController {
    public static async getLevelDetailsForUser(userId: number): Promise<LevelDetails | undefined> {
        return axiosInstance
            .get<GetLevelDetailsResponse>(`/user/${userId}/level/`)
            .then((success) => {
                const response = success.data;
                return response.levelDetails;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getAllLevels(): Promise<Level[] | undefined> {
        return axiosInstance
            .get<GetLevelsResponse>(`/level/`)
            .then((success) => {
                const response = success.data;
                return response.levels;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static invalidateLevelDetails(userId: number) {
        reactQueryClient.invalidateQueries(['levelDetails', userId]);
    }
}

export namespace LevelCustomHooks {
    export function useLevelDetails(userId?: number) {
        const { status, error, data, fetchStatus, refetch } = useQuery({
            queryKey: ['levelDetails', userId],
            queryFn: () => LevelController.getLevelDetailsForUser(userId ?? 0),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            enabled: !!userId,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data, refetch };
    }

    export function useAllLevels() {
        const { status, error, data, fetchStatus, refetch } = useQuery({
            queryKey: ['allLevels'],
            queryFn: () => LevelController.getAllLevels(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data, refetch };
    }
}
