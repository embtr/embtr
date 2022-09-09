import { Firestore, doc, getDoc } from 'firebase/firestore';
import { getFirebaseConnection as getFirestoreConnection } from 'src/firebase/firestore/ConnectionProvider';

class LevelDao {
    public static async get(uid: string) {
        const db: Firestore = getFirestoreConnection(this.name, 'get');

        const result = await getDoc(doc(db, "levels/", uid));
        return result;
    }
}

export default LevelDao;
