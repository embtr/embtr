import React from 'react';
import { HabitCategory, Task } from 'resources/schema';
import {
    GetHabitCategoriesResponse,
    GetHabitJourneyResponse,
} from 'resources/types/requests/HabitTypes';
import axiosInstance from 'src/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { GetTaskResponse } from 'resources/types/requests/TaskTypes';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';

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
            .get<GetHabitCategoriesResponse>('/habit/categories/')
            .then((success) => {
                if (success.data.habitCategories) {
                    return success.data.habitCategories;
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

    public static async prefetchHabitCategory(id: number) {
        reactQueryClient.prefetchQuery({
            queryKey: ['habit', id],
            queryFn: () => HabitController.getHabit(id),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });
    }

    public static async prefetchHabitCategories() {
        reactQueryClient.prefetchQuery({
            queryKey: ['habitCategories'],
            queryFn: () => HabitController.getHabitCategories(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
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
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return data ?? [];
    };

    export const useHabit = (id: number) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['habit', id],
            queryFn: () => HabitController.getHabit(id),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            enabled: !!id,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
