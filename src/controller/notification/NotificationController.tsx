import { Timestamp } from 'firebase/firestore';
import { NOTIFICATION } from 'resources/endpoints';
import { Notification } from 'resources/schema';
import {
    ClearNotificationsRequest,
    GetNotificationsResponse,
    GetUnreadNotificationCountResponse,
} from 'resources/types/requests/NotificationTypes';
import axiosInstance from 'src/axios/axios';
import { Notification as ApiNotificationModel } from 'resources/schema';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';

export enum NotificationType {
    TIMELINE_COMMENT,
    TIMELINE_TAG,
    TIMELINE_LIKE,
    CHALLENGE_COMMENT,
    DAILY_RESULT_TAG,
    DAILY_RESULT_COMMENT,
    COMPLETED_DAILY_RESULT_LIKE,
    FAILED_DAILY_RESULT_LIKE,
    NEW_FOLLOWER,
    QUOTE_LIKE,
    QUOTE_SELECTED,
    GOAL_COMMENT,
    GOAL_LIKE,
}

export const getUnreadNotificationCount = (notifications: ApiNotificationModel[]): number => {
    let count = 0;
    notifications.forEach((notification) => {
        if (!notification.read) {
            count++;
        }
    });

    return count;
};

export class NotificationController {
    public static async getUnreadNotificationCount(): Promise<number> {
        return await axiosInstance
            .get(`${NOTIFICATION}count`)
            .then((success) => {
                const response = success.data as GetUnreadNotificationCountResponse;
                return response.count ?? 0;
            })
            .catch((error) => {
                return 0;
            });
    }

    public static async getNotificationsViaApi(): Promise<Notification[]> {
        return await axiosInstance
            .get(`${NOTIFICATION}`)
            .then((success) => {
                const response = success.data as GetNotificationsResponse;
                return response.notifications ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

    public static async clearAll() {
        return await axiosInstance
            .post(`${NOTIFICATION}clear`)
            .then((success) => {
                //todo do something here
            })
            .catch((error) => {
                //
            });
    }

    public static async prefetchNotificationData() {
        await NotificationController.prefetchNotifications();
        await NotificationController.prefetchUnreadNotificationCount();
    }

    public static async prefetchNotifications() {
        reactQueryClient.prefetchQuery({
            queryKey: ['notifications'],
            queryFn: () => NotificationController.getNotificationsViaApi(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });
    }

    public static async prefetchUnreadNotificationCount() {
        reactQueryClient.prefetchQuery({
            queryKey: ['unreadNotificationCount'],
            queryFn: () => NotificationController.getUnreadNotificationCount(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });
    }
}

export namespace NotificationCustomHooks {
    export const useNotifications = () => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['notifications'],
            queryFn: () => NotificationController.getNotificationsViaApi(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useUnreadNotificationCount = () => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['unreadNotificationCount'],
            queryFn: () => NotificationController.getUnreadNotificationCount(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
