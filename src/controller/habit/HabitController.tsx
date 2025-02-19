import React from 'react';
import { HabitCategory, Icon, Task } from 'resources/schema';
import {
    GetHabitCategoriesResponse,
    GetHabitCategoryResponse,
    GetHabitJourneyResponse,
    GetHabitsResponse,
    TutorialHabitSelectedRequest,
} from 'resources/types/requests/HabitTypes';
import axiosInstance from 'src/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { GetTaskResponse } from 'resources/types/requests/TaskTypes';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { Logger } from 'src/util/GeneralUtility';
import { getTodayPureDate } from 'src/util/DateUtility';
import { GetIconsResponse } from 'resources/types/requests/IconTypes';

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

    public static async getTutorialRecommendedHabits(): Promise<Task[] | undefined> {
        return await axiosInstance
            .get<GetHabitsResponse>('/tutorial/recommended')
            .then((success) => {
                return success.data.habits;
            })
            .catch((error) => {
                Logger.titledLog('error from /tutorial/recommended', error);
                return undefined;
            });
    }

    public static async tutorialHabitSelected(id?: number, text?: string) {
        const request: TutorialHabitSelectedRequest = {
            id,
            text,
        };

        return await axiosInstance
            .post(`/tutorial/selected`, request)
            .then((success) => {
                return true;
            })
            .catch((error) => {
                Logger.titledLog('error from /tutorial/habit/:id/selected', error);
                return false;
            });
    }

    public static async getAllGenericHabitCategories(): Promise<HabitCategory[] | undefined> {
        return await axiosInstance
            .get<GetHabitCategoriesResponse>('/habit/categories/generic')
            .then((success) => {
                if (success.data.habitCategories) {
                    return success.data.habitCategories;
                } else {
                    return undefined;
                }
            })
            .catch((error) => {
                Logger.titledLog('error from /habit/categories/generic', error);
                return undefined;
            });
    }

    public static async getCustomHabitsCategory(): Promise<HabitCategory | undefined> {
        return await axiosInstance
            .get<GetHabitCategoriesResponse>('/habit/categories/custom')
            .then((success) => {
                const response: GetHabitCategoryResponse = success.data;
                if (response.habitCategory) {
                    return response.habitCategory;
                } else {
                    return undefined;
                }
            })
            .catch((error) => {
                Logger.titledLog('error from /habit/categories/custom', error);
                return undefined;
            });
    }

    public static async getRecentHabitsCategory(): Promise<HabitCategory | undefined> {
        return await axiosInstance
            .get<GetHabitCategoriesResponse>('/habit/categories/recent')
            .then((success) => {
                const response: GetHabitCategoryResponse = success.data;
                if (response.habitCategory) {
                    return response.habitCategory;
                } else {
                    return undefined;
                }
            })
            .catch((error) => {
                Logger.titledLog('error from /habit/categories/recent', error);
                return undefined;
            });
    }

    public static async getActiveHabitsCategory(): Promise<HabitCategory | undefined> {
        const today = getTodayPureDate();

        return await axiosInstance
            .get<GetHabitCategoriesResponse>('/habit/categories/active', {
                params: {
                    date: today,
                },
            })
            .then((success) => {
                const response: GetHabitCategoryResponse = success.data;
                if (response.habitCategory) {
                    return response.habitCategory;
                } else {
                    return undefined;
                }
            })
            .catch((error) => {
                Logger.titledLog('error from /habit/categories/active', error);
                return undefined;
            });
    }

    public static async getAllHabitCategories(): Promise<HabitCategory[]> {
        const requests = [HabitController.getAllGenericHabitCategories()];

        // consider using Promise.allSettled
        const [generic] = await Promise.all(requests);
        const allCategories: HabitCategory[] = [];
        if (generic) {
            allCategories.push(...(generic as HabitCategory[]));
        }

        return allCategories;
    }

    public static async getHabit(id: number): Promise<Task | undefined> {
        return await axiosInstance
            .get(`/habit/${id}`)
            .then((success) => {
                const result: GetTaskResponse = success.data;
                return result.task;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getIcons(): Promise<Icon[] | undefined> {
        return await axiosInstance
            .get<GetIconsResponse>(`/habit/icons`)
            .then((success) => {
                return success.data.icons;
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
            queryFn: () => HabitController.getAllHabitCategories(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });
    }
}

export namespace HabitCustomHooks {
    export const useHabitCategory = (id: number) => {
        const [habitCategory, setHabitCategory] = React.useState<HabitCategory | undefined>();
        const habitCategories = HabitCustomHooks.useAllHabitCategories();

        React.useEffect(() => {
            for (const habitCategory of habitCategories) {
                if (habitCategory.id === id) {
                    setHabitCategory(habitCategory);
                }
            }
        }, [habitCategories]);

        return habitCategory;
    };

    export const useAllHabitCategories = () => {
        const { status, error, data } = useQuery({
            queryKey: ['allHabitCategories'],
            queryFn: HabitController.getAllHabitCategories,
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

    export const useTutorialRecommendedHabits = () => {
        const { status, error, data } = useQuery({
            queryKey: ['tutorialRecommendedHabits'],
            queryFn: HabitController.getTutorialRecommendedHabits,
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return data ?? [];
    };

    export const useIcons = () => {
        const { status, error, data } = useQuery({
            queryKey: ['icons'],
            queryFn: HabitController.getIcons,
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return data ?? [];
    };
}
