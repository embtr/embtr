import { Firestore, collection, getDocs, where, query } from 'firebase/firestore';
import { getFirebaseConnection as getFirestoreConnection } from 'src/firebase/firestore/ConnectionProvider';

class NotificationDao {
    public static async getNotifications(uid: string) {
        const db: Firestore = getFirestoreConnection(this.name, "getNotifications");
        const q = query(collection(db, "notifications"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }
}

export default NotificationDao;