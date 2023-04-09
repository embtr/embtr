import { GetDailyHistoryResponse } from 'resources/types/requests/DailyHistoryTypes';
import axiosInstance from 'src/axios/axios';

export class DailyHistoryController {
    public static async get(userId: number) {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29);

        return axiosInstance
            .get(`/user/${userId}/daily-history/`, { params: { start, end } })
            .then((success) => {
                const response: GetDailyHistoryResponse = success.data;
                return response.dailyHistory;
            })
            .catch((error) => {
                console.log(error);
                return error.response.data;
            });
    }
}
