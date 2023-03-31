import { Timestamp } from 'firebase/firestore';
import { NOTIFICATION } from 'resources/endpoints';
import { Notification } from 'resources/schema';
import { ClearNotificationsRequest, GetNotificationsResponse } from 'resources/types/NotificationTypes';
import axiosInstance from 'src/axios/axios';
import PushNotificationController from 'src/controller/notification/PushNotificationController';
import NotificationDao from 'src/firebase/firestore/notification/NotificationDao';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
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

    /*
     * OLD LOGIC
     */
    public static getNotifications(uid: string, callback: Function) {
        let notifications: NotificationModel[] = [];

        const result = NotificationDao.getNotifications(uid);
        result
            .then((documents) => {
                if (documents === undefined) {
                    callback([]);
                    return;
                }

                documents.forEach((document) => {
                    let notification: NotificationModel = document.data() as NotificationModel;
                    notification.id = document.id;
                    notifications.push(notification);
                });
            })
            .then(() => {
                notifications.sort((a, b) => (a.added > b.added ? 1 : -1)).reverse();
                callback(notifications);
            })
            .catch(() => {
                callback(notifications);
            });
    }

    public static addNotifications(fromUid: string, toUsers: UserProfileModel[], notificationType: NotificationType, targetUid: string) {
        toUsers.forEach((toUser) => {
            this.addNotification(fromUid, toUser.uid!, notificationType, targetUid);
        });
    }

    public static addNotification(fromUid: string, toUid: string, notificationType: NotificationType, targetId: string) {
        const summary: string = this.getSummary(notificationType);
        const targetPage: string = this.getTargetPage(notificationType);

        const notificationModel: NotificationModel = {
            added: Timestamp.now(),
            read: false,
            summary: summary,
            notifier_uid: fromUid,
            uid: toUid,
            target_uid: targetId,
            target_page: targetPage,
        };

        const result = NotificationDao.addNotification(notificationModel);

        result.then((addedNotification) => {
            PushNotificationController.sendPostNotificationApiRequest(addedNotification.id);
        });
    }

    public static clearNotifications(notifications: NotificationModel[]) {
        notifications.forEach((notification) => {
            NotificationDao.clearNotification(notification);
        });
    }

    private static getSummary(notificationType: NotificationType): string {
        switch (notificationType) {
            case NotificationType.TIMELINE_COMMENT:
                return 'commented on your post';
            case NotificationType.TIMELINE_LIKE:
                return 'liked your post';
            case NotificationType.COMPLETED_DAILY_RESULT_LIKE:
                return 'liked your completed day';
            case NotificationType.FAILED_DAILY_RESULT_LIKE:
                return 'sent you encouragement';
            case NotificationType.DAILY_RESULT_COMMENT:
                return 'commented on your daily results';
            case NotificationType.NEW_FOLLOWER:
                return 'now follows you!';
            case NotificationType.QUOTE_LIKE:
                return 'liked your quote of the day!';
            case NotificationType.QUOTE_SELECTED:
                return "Your quote was selected for today's Quote Of The Day!";
            case NotificationType.GOAL_COMMENT:
                return 'commented on your goal';
            case NotificationType.GOAL_LIKE:
                return 'liked your goal';

            default:
                return 'tagged you in a comment';
        }
    }

    private static getTargetPage(notificationType: NotificationType): string {
        switch (notificationType) {
            case NotificationType.CHALLENGE_COMMENT:
                return 'ChallengeDetails';
            case NotificationType.TIMELINE_COMMENT:
            case NotificationType.TIMELINE_TAG:
            case NotificationType.TIMELINE_LIKE:
                return 'UserPostDetails';
            case NotificationType.DAILY_RESULT_TAG:
            case NotificationType.DAILY_RESULT_COMMENT:
            case NotificationType.FAILED_DAILY_RESULT_LIKE:
            case NotificationType.COMPLETED_DAILY_RESULT_LIKE:
                return 'DailyResultDetails';
            case NotificationType.NEW_FOLLOWER:
                return 'UserProfile';
            case NotificationType.QUOTE_LIKE:
            case NotificationType.QUOTE_SELECTED:
                return 'Today';
            case NotificationType.GOAL_COMMENT:
            case NotificationType.GOAL_LIKE:
                return 'GoalDetails';
            default:
                return '';
        }
    }
}

export default NotificationController;
