import { Firestore, collection, where, getDocs, query } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class RoutineDao {
    public static async getAll(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getAll');

        const q = query(collection(db, 'routines'), where('uid', '==', uid), where('active', '!=', false));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }
}

export default RoutineDao;
