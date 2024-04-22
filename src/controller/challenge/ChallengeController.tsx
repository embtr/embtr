import { ChallengeParticipant, Comment } from 'resources/schema';
import { Interactable } from 'resources/types/interactable/Interactable';
import {
    GetChallengeDetailsResponse,
    GetChallengeParticipationResponse,
    GetChallengeSummaryResponse,
    GetChallengesDetailsResponse,
    GetChallengesSummariesResponse,
} from 'resources/types/requests/ChallengeTypes';
import axiosInstance from 'src/axios/axios';
import { CommentController } from '../api/general/CommentController';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { ChallengeDetails, ChallengeSummary } from 'resources/types/dto/Challenge';
import { Keyboard } from 'react-native';
import { ScheduledHabitController } from '../habit/ScheduledHabitController';
import { TimelineController } from '../timeline/TimelineController';
import PlannedDayController from '../planning/PlannedDayController';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { getSelectedDayKey } from 'src/redux/user/GlobalState';
import { Store } from 'src/redux/store';
import { ReduxService } from 'src/redux/ReduxService';

export class ChallengeController {
    public static async getAllDetails(): Promise<ChallengeDetails[] | undefined> {
        return axiosInstance
            .get<GetChallengesDetailsResponse>(`/challenge/details`)
            .then((result) => {
                return result.data.challengesDetails;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getAllSummaries(): Promise<ChallengeSummary[] | undefined> {
        return axiosInstance
            .get<GetChallengesSummariesResponse>(`/challenge/summary`)
            .then((result) => {
                return result.data.challengesSummaries;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getDetails(id: number): Promise<ChallengeDetails | undefined> {
        return axiosInstance
            .get<GetChallengeDetailsResponse>(`/challenge/${id}/details`)
            .then((result) => {
                return result.data.challengeDetails;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getSummary(id: number): Promise<ChallengeSummary | undefined> {
        return axiosInstance
            .get<GetChallengeSummaryResponse>(`/challenge/${id}/summary`)
            .then((result) => {
                return result.data.challengeSummary;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getAllActiveForUser(userId: number): Promise<ChallengeParticipant[]> {
        return axiosInstance
            .get(`/user/${userId}/active-challenge-participation/`)
            .then((success) => {
                const body: GetChallengeParticipationResponse = success.data;
                return body.challengeParticipation ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

    public static async getAllForUser(userId: number) {
        return axiosInstance
            .get(`/user/${userId}/challenge-participation/`)
            .then((success) => {
                const body: GetChallengeParticipationResponse = success.data;
                return body.challengeParticipation ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

    public static async getAllCompletedForUser(userId: number) {
        return axiosInstance
            .get(`/user/${userId}/completed-challenges/`)
            .then((success) => {
                const body: GetChallengeParticipationResponse = success.data;
                return body.challengeParticipation ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

    public static async register(challengeId: number) {
        return axiosInstance
            .post(`/challenge/${challengeId}/register`)
            .then((success) => {
                ChallengeInvalidation.challengeJoinedLeft(challengeId);
                return true;
            })
            .catch((error) => {
                return false;
            });
    }

    public static async leave(challengeId: number) {
        return axiosInstance
            .post(`/challenge/${challengeId}/leave`)
            .then((success) => {
                ChallengeInvalidation.challengeJoinedLeft(challengeId);
                return true;
            })
            .catch((error) => {
                return false;
            });
    }

    public static async like(challengeId: number) {
        return axiosInstance
            .post(`/challenge/${challengeId}/like`)
            .then((success) => {
                return true;
            })
            .catch((error) => {
                return false;
            });
    }

    public static async comment(challengeId: number, comment: string) {
        const addedComment = await CommentController.add(
            Interactable.CHALLENGE,
            challengeId,
            comment
        );

        return addedComment;
    }

    public static async deleteComment(comment: Comment) {
        return await CommentController.delete(Interactable.CHALLENGE, comment);
    }

    public static async invalidateAllChallengeDetails() {
        await reactQueryClient.invalidateQueries([
            ChallengeCustomHooks.Keys.CHALLENGE_DETAILS_QUERY_KEY,
        ]);
    }

    public static async invalidateAllChallengeSummaries() {
        await reactQueryClient.invalidateQueries([
            ChallengeCustomHooks.Keys.CHALLENGE_SUMMARIES_QUERY_KEY,
        ]);
    }

    public static async invalidateChallengeDetails(id: number) {
        await reactQueryClient.invalidateQueries([
            ChallengeCustomHooks.Keys.CHALLENGE_DETAILS_QUERY_KEY,
            id,
        ]);
    }

    public static async invalidateChallengeSummary(id: number) {
        await reactQueryClient.invalidateQueries([
            ChallengeCustomHooks.Keys.CHALLENGE_SUMMARY_QUERY_KEY,
            id,
        ]);
    }

    public static async invalidateActiveParticipation(userId: number) {
        await reactQueryClient.invalidateQueries([
            ChallengeCustomHooks.Keys.ACTIVE_PARTICIPATION_QUERY_KEY,
            userId,
        ]);
    }

    public static async invalidateAllChallengeData(id: number, userId: number) {
        const promises = [
            this.invalidateChallengeDetails(id),
            this.invalidateChallengeSummary(id),

            this.invalidateAllChallengeDetails(),
            this.invalidateAllChallengeSummaries(),

            this.invalidateActiveParticipation(userId),
        ];

        await Promise.all(promises);
    }
}

namespace ChallengeInvalidation {
    export const challengeJoinedLeft = async (id: number) => {
        ScheduledHabitController.invalidateActiveScheduledHabits();
        TimelineController.invalidateCache();

        const currentUserId = await getUserIdFromToken();
        if (currentUserId) {
            ChallengeController.invalidateAllChallengeData(id, currentUserId);

            const selectedDayKey = ReduxService.get(ReduxService.ReduxKey.SELECTED_DAY_KEY);
            if (currentUserId && selectedDayKey) {
                PlannedDayController.invalidatePlannedDay(currentUserId, selectedDayKey);
            }
        }
    };
}

export namespace ChallengeCustomHooks {
    export namespace Keys {
        export const ACTIVE_PARTICIPATION_QUERY_KEY = 'activeChallengeParticipation';
        export const CHALLENGE_DETAILS_QUERY_KEY = 'challengeDetails';
        export const CHALLENGE_SUMMARY_QUERY_KEY = 'challengeSummary';
        export const CHALLENGE_SUMMARIES_QUERY_KEY = 'challengeSummaries';
    }

    export const useAllChallengeDetails = () => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: [Keys.CHALLENGE_DETAILS_QUERY_KEY],
            queryFn: async () => ChallengeController.getAllDetails(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useAllChallengeSummaries = () => {
        const { status, error, data, fetchStatus, refetch } = useQuery({
            queryKey: [Keys.CHALLENGE_SUMMARIES_QUERY_KEY],
            queryFn: async () => ChallengeController.getAllSummaries(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data, refetch };
    };

    export const useChallengeDetails = (id: number) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: [ChallengeCustomHooks.Keys.CHALLENGE_DETAILS_QUERY_KEY, id],
            queryFn: async () => ChallengeController.getDetails(id),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useChallengeSummary = (id: number) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: [Keys.CHALLENGE_SUMMARY_QUERY_KEY, id],
            queryFn: async () => ChallengeController.getSummary(id),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useActiveParticipation = (userId: number) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: [Keys.ACTIVE_PARTICIPATION_QUERY_KEY, userId],
            queryFn: async () => ChallengeController.getAllActiveForUser(userId),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
