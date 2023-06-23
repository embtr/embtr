import { GetChallengesResponse } from 'resources/types/requests/ChallengeTypes';
import axiosInstance from 'src/axios/axios';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';

export class ChallengeController {
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
}
