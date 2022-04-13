import { id } from 'date-fns/locale';
import { Firestore, collection, getDocs, where, query, addDoc, arrayUnion, doc, setDoc, orderBy } from 'firebase/firestore';
import { NotificationModel } from 'src/controller/notification/NotificationController';
import { getFirebaseConnection} from 'src/firebase/firestore/ConnectionProvider';

class NotificationDao {
    public static async getNotifications(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, "getNotifications");
        const q = query(collection(db, "notifications"), where("uid", "==", uid) );
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async addNotification(notification: NotificationModel) {
        const db: Firestore = getFirebaseConnection(this.name, "addNotification");

        await addDoc(collection(db, "notifications"), notification);
    }

    public static clearNotification(notification: NotificationModel) {
        const db: Firestore = getFirebaseConnection(this.name, "clearNotification");

        setDoc(doc(db, "notifications/" + notification.id), {
            read: true
        }, { merge: true });
    }
}

export default NotificationDao;