import { Habit } from 'resources/schema';
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
}
