import { Timestamp } from "firebase/firestore";
import NotificationDao from "src/firebase/firestore/notification/NotificationDao";

export interface NotificationModel {
    id: string
    added: Timestamp
    read: boolean
    summary: string
    notifier_uid: string
    url: string
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
}

export default NotificationController;