import { AnyAction } from '@reduxjs/toolkit';
import React from 'react';
import { Dispatch } from 'react';
import { HabitCategory } from 'resources/schema';
import {
    GetHabitCategoriesResponse,
    GetHabitJourneyResponse,
} from 'resources/types/requests/HabitTypes';
import axiosInstance from 'src/axios/axios';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getHabitCategories, setHabitCategories } from 'src/redux/user/GlobalState';

export class HabitController {
    public static async cacheHabitCategories() {
        const dispatch: Dispatch<AnyAction> = useAppDispatch();

        const habitCategories = await HabitController.getHabitCategories();
        dispatch(setHabitCategories(habitCategories));
    }

    public static useHabitCategory(id: number) {
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
}

export namespace HabitCustomHooks {
    export const useHabitCategories = () => {
        const [habitCategories, setHabitCategories] = React.useState<HabitCategory[]>([]);

        React.useEffect(() => {
            const fetch = async () => {
                const habitCategories = await HabitController.getHabitCategories();
                setHabitCategories(habitCategories);
            };

            fetch();
        }, []);

        return habitCategories;
    };
}
