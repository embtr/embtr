import { Firestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { LevelDbModel } from 'src/controller/level/LevelController';
import { getFirebaseConnection as getFirestoreConnection } from 'src/firebase/firestore/ConnectionProvider';

class LevelDao {
    public static async get(id: string) {
        const db: Firestore = getFirestoreConnection(this.name, 'get');
        const result = await getDoc(doc(db, 'levels/', id));
        return result;
    }

    public static async create(uid: string, level: LevelDbModel) {
        const db: Firestore = getFirestoreConnection(this.name, 'create');
        await setDoc(doc(db, 'levels', uid), level);
    }

    public static async update(uid: string, level: LevelDbModel) {
        const db: Firestore = getFirestoreConnection(this.name, 'update');
        const result = await setDoc(doc(db, 'levels', uid), level, { merge: true });

        return result;
    }
}

export default LevelDao;
