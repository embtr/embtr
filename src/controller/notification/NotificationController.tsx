import { Timestamp } from 'firebase/firestore';
import { NOTIFICATION } from 'resources/endpoints';
import { Notification } from 'resources/schema';
import { ClearNotificationsRequest, GetNotificationsResponse } from 'resources/types/requests/NotificationTypes';
import axiosInstance from 'src/axios/axios';
import { Notification as ApiNotificationModel } from 'resources/schema';

export interface NotificationModel {
    id?: string;
    added: Timestamp;
    read: boolean;
    summary: string;
    uid: string;
    notifier_uid: string;
    target_uid: string;
    target_page: string;
}

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

class NotificationController {
    public static async getNotificationsViaApi(): Promise<Notification[]> {
        return await axiosInstance
            .get(`${NOTIFICATION}`)
            .then((success) => {
                const response = success.data as GetNotificationsResponse;
                return response.notifications ?? [];
            })
            .catch((error) => {
                console.log(error);
                return [];
            });
    }

    public static async clearNotificationsViaApi(notifications: Notification[]) {
        const notificationIds: number[] = [];
        notifications.forEach((notification) => {
            if (notification.id) {
                notificationIds.push(notification.id);
            }
        });

        const request: ClearNotificationsRequest = {
            notificationIds,
        };

        return await axiosInstance
            .post(`${NOTIFICATION}clear`, request)
            .then((success) => {
                //todo do something here
            })
            .catch((error) => {
                //
            });
    }
}

export default NotificationController;
