import React from 'react';
import { HabitCategory, Task } from 'resources/schema';
import {
    GetHabitCategoriesResponse,
    GetHabitJourneyResponse,
} from 'resources/types/requests/HabitTypes';
import axiosInstance from 'src/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import TaskController from '../planning/TaskController';
import { GetTaskResponse } from 'resources/types/requests/TaskTypes';

export class HabitController {
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

    public static async getHabit(id: number): Promise<Task | undefined> {
        return await axiosInstance
            .get(`/task/${id}`)
            .then((success) => {
                const result: GetTaskResponse = success.data;
                return result.task;
            })
            .catch((error) => {
                return undefined;
            });
    }
}

export namespace HabitCustomHooks {
    export const useHabitCategory = (id: number) => {
        const [habitCategory, setHabitCategory] = React.useState<HabitCategory | undefined>();
        const habitCategories = HabitCustomHooks.useHabitCategories();

        React.useEffect(() => {
            for (const habitCategory of habitCategories) {
                if (habitCategory.id === id) {
                    setHabitCategory(habitCategory);
                }
            }
        }, [habitCategories]);

        return habitCategory;
    };

    export const useHabitCategories = () => {
        const { status, error, data } = useQuery({
            queryKey: ['habitCategories'],
            queryFn: HabitController.getHabitCategories,
            staleTime: ReactQueryStaleTimes.HABIT_CATEGORIES,
        });

        return data ?? [];
    };

    export const useHabit = (id: number) => {
        const [habit, setHabit] = React.useState<Task | undefined>();

        const { status, error, data } = useQuery({
            queryKey: ['habit', id],
            queryFn: () => HabitController.getHabit(id),
            staleTime: ReactQueryStaleTimes.HABIT,
        });

        return data;
    };
}
