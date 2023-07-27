import { Challenge, Comment, JoinedChallenge } from 'resources/schema';
import { Interactable } from 'resources/types/interactable/Interactable';
import {
    GetChallengeParticipationResponse,
    GetChallengeResponse,
    GetChallengesResponse,
    GetJoinedChallengesResponse,
} from 'resources/types/requests/ChallengeTypes';
import axiosInstance from 'src/axios/axios';
import { TimelinePostModel } from 'src/model/OldModels';
import { CommentController } from '../api/general/CommentController';

export interface JoinedChallengeTimelinePost extends TimelinePostModel {
    data: {
        joinedChallenge: JoinedChallenge;
    };
}

export class ChallengeController {
    public static async getAllRecentJoined(upperBound: Date, lowerBound: Date) {
        const upperBoundDate = new Date(upperBound).toISOString();
        const lowerBoundDate = new Date(lowerBound).toISOString();

        return axiosInstance
            .get(`/challenge/recently-joined/`, {
                params: {
                    upperBound: upperBoundDate,
                    lowerBound: lowerBoundDate,
                },
            })

            .then((success) => {
                const body: GetJoinedChallengesResponse = success.data;
                return body.joinedChallenges ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

    public static async get(id: number) {
        return axiosInstance
            .get(`/challenge/${id}`)
            .then((success) => {
                const body: GetChallengeResponse = success.data;
                return body.challenge;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getAll() {
        return axiosInstance
            .get(`/challenge/`)
            .then((success) => {
                const body: GetChallengesResponse = success.data;
                return body.challenges ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

    public static async getAllActiveForUser(userId: number) {
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
        return await CommentController.add(Interactable.CHALLENGE, challengeId, comment);
    }

    public static async deleteComment(comment: Comment) {
        return await CommentController.delete(Interactable.CHALLENGE, comment);
    }
}
