import { Firestore, collection, where, getDocs, query, addDoc, setDoc, doc, getDoc } from 'firebase/firestore';
import { RoutineModel } from 'src/controller/routine/RoutineController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class RoutineDao {
    public static async get(id: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'get');
        const result = await getDoc(doc(db, 'routines/', id));

        return result;
    }

    public static async getAll(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getAll');

        const q = query(collection(db, 'routines'), where('uid', '==', uid), where('active', '!=', false));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async create(routine: RoutineModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'create');
        const result = await addDoc(collection(db, 'routines'), routine);

        return result;
    }

    public static async update(routine: RoutineModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'update');
        const result = await setDoc(doc(db, 'routines', routine.id!), routine, { merge: true });

        return result;
    }
}

export default RoutineDao;
