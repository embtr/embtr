import { id } from 'date-fns/locale';
import { Firestore, collection, getDocs, where, query, addDoc, arrayUnion, doc, setDoc, orderBy, limit } from 'firebase/firestore';
import { NotificationModel } from 'src/controller/notification/NotificationController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class NotificationDao {
    public static async getNotifications(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getNotifications');
        const q = query(collection(db, 'notifications'), where('uid', '==', uid), orderBy('added', 'desc'), limit(30));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async addNotification(notification: NotificationModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'addNotification');

        const result = await addDoc(collection(db, 'notifications'), notification);
        return result;
    }

    public static clearNotification(notification: NotificationModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'clearNotification');

        setDoc(
            doc(db, 'notifications/' + notification.id),
            {
                read: true,
            },
            { merge: true }
        );
    }
}

export default NotificationDao;
