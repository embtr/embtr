import { Habit } from 'resources/schema';
import { GetHabitJourneyResponse } from 'resources/types/requests/HabitTypes';
import axiosInstance from 'src/axios/axios';

export class HabitController {
    public static async getHabits(): Promise<Habit[]> {
        return await axiosInstance
            .get('/habit')
            .then((success) => {
                return success.data.habits;
            })
            .catch((error) => {
                return [];
            });
    }

    public static async getHabitJourneys(userId: number) {
        return await axiosInstance
            .get(`/user/${userId}/habit-journey`)
            .then((success) => {
                const body: GetHabitJourneyResponse = success.data;
                return body.habitJourneys;
            })
            .catch((error) => {
                return undefined;
            });
    }
}
