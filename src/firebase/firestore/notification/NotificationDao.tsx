import { Firestore, collection, getDocs, where, query, addDoc } from 'firebase/firestore';
import { NotificationModel } from 'src/controller/notification/NotificationController';
import { getFirebaseConnection as getFirestoreConnection } from 'src/firebase/firestore/ConnectionProvider';

class NotificationDao {
    public static async getNotifications(uid: string) {
        const db: Firestore = getFirestoreConnection(this.name, "getNotifications");
        const q = query(collection(db, "notifications"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async addNotification(notification: NotificationModel) {
        const db: Firestore = getFirestoreConnection(this.name, "addNotification");

        await addDoc(collection(db, "notifications"), notification);
    }
}

export default NotificationDao;