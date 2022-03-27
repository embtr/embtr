import { Timestamp } from "firebase/firestore";
import NotificationDao from "src/firebase/firestore/notification/NotificationDao";
import { UserProfileModel } from "src/firebase/firestore/profile/ProfileDao";

export interface NotificationModel {
    id?: string
    added: Timestamp
    read: boolean
    summary: string
    uid: string
    notifier_uid: string
    target_uid: string
    target_page: string
}

export enum NotificationType {
    TIMELINE_COMMENT,
    CHALLENGE_COMMENT
}

export const getUnreadNotificationCount = (notifications: NotificationModel[]): number => {
    let count = 0;
    notifications.forEach(notification => {
        if (!notification.read) {
            count++;
        }
    });

    return count;
}

class NotificationController {
    public static getNotifications(uid: string, callback: Function) {
        let notifications: NotificationModel[] = [];

        const result = NotificationDao.getNotifications(uid);
        result.then(documents => {
            if (documents === undefined) {
                callback([]);
                return;
            }

            documents.forEach(document => {
                let notification: NotificationModel = document.data() as NotificationModel;
                notification.id = document.id;
                notifications.push(notification);
            });
        }).then(() => {
            callback(notifications);
        }).catch(() => {
            callback(notifications);
        });
    }

    public static addNotifications(fromUid: string, toUsers: UserProfileModel[], notificationType: NotificationType, targetUid: string) {
        toUsers.forEach(toUser => {
            this.addNotification(fromUid, toUser.uid!, notificationType, targetUid);
        });
    }

    public static clearNotifications(notifications: NotificationModel[]) {
        notifications.forEach(notification => {
            NotificationDao.clearNotification(notification);
        });
    }

    private static addNotification(fromUid: string, toUid: string, notificationType: NotificationType, targetUid: string) {
        const summary: string = this.getSummary(notificationType);
        const targetPage: string = this.getTargetPage(notificationType);

        const notificationModel: NotificationModel = {
            added: Timestamp.now(),
            read: false,
            summary: summary,
            notifier_uid: fromUid,
            uid: toUid,
            target_uid: targetUid,
            target_page: targetPage
        };

        NotificationDao.addNotification(notificationModel);
    }

    private static getSummary(notificationType: NotificationType): string {
        return "tagged you in a comment.";
    }

    private static getTargetPage(notificationType: NotificationType): string {
        switch(notificationType) {
            case NotificationType.CHALLENGE_COMMENT:
                return "ChallengeComments";
            case NotificationType.TIMELINE_COMMENT:
                return "TimelineComments";
            default:
                return "";
        }
    }
}

export default NotificationController;

