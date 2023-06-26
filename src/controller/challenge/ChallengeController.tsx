import {
    GetChallengeResponse,
    GetChallengesResponse,
} from 'resources/types/requests/ChallengeTypes';
import axiosInstance from 'src/axios/axios';

export class ChallengeController {
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
        return axiosInstance
            .post(`/challenge/${challengeId}/comment`, { comment })
            .then((success) => {
                return true;
            })
            .catch((error) => {
                return false;
            });
    }
}
