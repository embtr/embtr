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
    url: string
}

export enum NotificationType {
    TIMELINE_COMMENT
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

    static addNotifications(fromUid: string, toUsers: UserProfileModel[], notificationType: NotificationType, targetUid: string) {
        toUsers.forEach(toUser => {
            this.addNotification(fromUid, toUser.uid!, notificationType, targetUid);
        });
    }

    private static addNotification(fromUid: string, toUid: string, notificationType: NotificationType, targetUid: string) {
        const summary: string = this.getSummary(notificationType);
        const url: string = this.getUrl(notificationType, targetUid);

        const notificationModel: NotificationModel = {
            added: Timestamp.now(),
            read: false,
            summary: summary,
            notifier_uid: fromUid,
            uid: toUid,
            url: url
        };

        NotificationDao.addNotification(notificationModel);
    }

    private static getSummary(notificationType: NotificationType): string {
        return "tagged you in a comment";
    }
    
    static getUrl(notificationType: NotificationType, targetUid: string): string {
        return "timeline/" + targetUid + "/comments";
    }
}

export default NotificationController;

