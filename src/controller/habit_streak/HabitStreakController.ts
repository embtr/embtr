import { useQuery } from '@tanstack/react-query';
import { HabitStreak } from 'resources/types/dto/HabitStreak';
import { GetHabitStreakResponse } from 'resources/types/requests/HabitTypes';
import axiosInstance from 'src/axios/axios';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { ReactQueryStaleTimes } from 'src/util/constants';

export class HabitStreakController {
    public static async get(userId: number): Promise<HabitStreak | undefined> {
        return axiosInstance
            .get<GetHabitStreakResponse>(`/habit-streak/${userId}`)
            .then((success) => {
                const response: GetHabitStreakResponse = success.data;
                return response.habitStreak;
            })
            .catch((error) => {
                console.log(error);
                return undefined;
            });
    }

    public static async getForHabit(
        userId: number,
        habitId: number
    ): Promise<HabitStreak | undefined> {
        return axiosInstance
            .get<GetHabitStreakResponse>(`/habit-streak/${userId}/${habitId}`)
            .then((success) => {
                const response: GetHabitStreakResponse = success.data;
                return response.habitStreak;
            })
            .catch((error) => {
                console.log(error);
                return undefined;
            });
    }

    public static async getAdvanced(userId: number): Promise<HabitStreak | undefined> {
        return axiosInstance
            .get<GetHabitStreakResponse>(`/habit-streak/advanced/${userId}`)
            .then((success) => {
                const response: GetHabitStreakResponse = success.data;
                return response.habitStreak;
            })
            .catch((error) => {
                console.log(error);
                return undefined;
            });
    }

    public static async getAdvancedForHabit(
        userId: number,
        habitId: number
    ): Promise<HabitStreak | undefined> {
        return axiosInstance
            .get<GetHabitStreakResponse>(`/habit-streak/advanced/${userId}/${habitId}`)
            .then((success) => {
                const response: GetHabitStreakResponse = success.data;
                return response.habitStreak;
            })
            .catch((error) => {
                console.log(error);
                return undefined;
            });
    }

    public static invalidateHabitStreak(userId: number) {
        reactQueryClient.invalidateQueries(['habitStreak', userId]);
    }

    public static invalidateHabitStreakForHabit(userId: number, habitId: number) {
        reactQueryClient.invalidateQueries(['habitStreak', userId, habitId]);
    }

    public static invalidateAdvancedHabitStreak(userId: number) {
        reactQueryClient.invalidateQueries(['advancedHabitStreak', userId]);
    }

    public static invalidateAdvancedHabitStreakForHabit(userId: number, habitId: number) {
        reactQueryClient.invalidateQueries(['advancedHabitStreak', userId, habitId]);
    }
}

export namespace HabitStreakCustomHooks {
    export function useHabitStreak(userId: number) {
        const { status, error, data, fetchStatus, refetch } = useQuery({
            queryKey: ['habitStreak', userId],
            queryFn: () => HabitStreakController.get(userId),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data, refetch };
    }

    export function useHabitStreakForHabit(userId: number, habitId: number) {
        const { status, error, data, fetchStatus, refetch } = useQuery({
            queryKey: ['habitStreak', userId, habitId],
            queryFn: () => HabitStreakController.getForHabit(userId, habitId),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data, refetch };
    }

    export function useAdvancedHabitStreak(userId: number) {
        const { status, error, data, fetchStatus, refetch } = useQuery({
            queryKey: ['advancedHabitStreak', userId],
            queryFn: () => HabitStreakController.getAdvanced(userId),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data, refetch };
    }

    export function useAdvancedHabitStreakForHabit(userId: number, habitId: number) {
        const { status, error, data, fetchStatus, refetch } = useQuery({
            queryKey: ['advancedHabitStreak', userId, habitId],
            queryFn: () => HabitStreakController.getAdvancedForHabit(userId, habitId),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data, refetch };
    }
}
