import { NOTIFICATION } from 'resources/endpoints';
import { Notification } from 'resources/schema';
import {
    GetNotificationsResponse,
    GetUnreadNotificationCountResponse,
} from 'resources/types/requests/NotificationTypes';
import axiosInstance from 'src/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';

export class NotificationController {
    public static async getUnreadNotificationCount(): Promise<number> {
        return await axiosInstance
            .get(`${NOTIFICATION}v1/count`)
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
            .get(`${NOTIFICATION}v1/`)
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
            .post(`${NOTIFICATION}v1/clear`)
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
