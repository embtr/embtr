import { HabitCategory } from 'resources/schema';
import {
    GetHabitCategoriesResponse,
    GetHabitJourneyResponse,
} from 'resources/types/requests/HabitTypes';
import axiosInstance from 'src/axios/axios';
import { useAppSelector } from 'src/redux/Hooks';
import { getHabitCategories } from 'src/redux/user/GlobalState';

export class HabitController {
    public static async getHabitCategories(): Promise<HabitCategory[]> {
        return await axiosInstance
            .get('/habit/categories/')
            .then((success) => {
                const habitCategoriesResponse: GetHabitCategoriesResponse = success.data;
                if (habitCategoriesResponse.habitCategories) {
                    return habitCategoriesResponse.habitCategories;
                } else {
                    return [];
                }
            })
            .catch((error) => {
                return [];
            });
    }

    public static getHabitFromCache(id: number): HabitCategory | undefined {
        const habitCategories = useAppSelector(getHabitCategories);
        for (const habitCategory of habitCategories) {
            if (habitCategory.id === id) {
                return habitCategory;
            }
        }

        return undefined;
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
