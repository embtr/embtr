import { useQuery } from '@tanstack/react-query';
import { Constants } from 'resources/types/constants/constants';
import { Leaderboard } from 'resources/types/dto/Leaderboard';
import { GetLeaderboardResponse } from 'resources/types/requests/Leaderboard';
import axiosInstance from 'src/axios/axios';
import { ReactQueryStaleTimes } from 'src/util/constants';

export class LeaderboardController {
    public static async get(type: Constants.LeaderboardType): Promise<Leaderboard | undefined> {
        return axiosInstance
            .get<GetLeaderboardResponse>(`/leaderboard/${type}`)
            .then((success) => {
                return success.data.leaderboard;
            })
            .catch((error) => {
                return undefined;
            });
    }
}

export namespace LeaderboardCustomHooks {
    export const useLeaderboard = (type: Constants.LeaderboardType) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['leaderboard', type],
            queryFn: async () => LeaderboardController.get(type),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
