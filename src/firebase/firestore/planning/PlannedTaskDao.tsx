import { addDoc, collection, doc, Firestore, getDoc, query, where, getDocs } from 'firebase/firestore';
import { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { getFirebaseConnection } from '../ConnectionProvider';

class PlannedTaskDao {
    public static async add(plannedTask: PlannedTaskModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'add');
        const result = await addDoc(collection(db, 'planned_tasks'), plannedTask);

        return result;
    }

    public static async get(id: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'get');
        const result = await getDoc(doc(db, 'planned_tasks/', id));

        return result;
    }

    public static async getAllInPlannedDayByDayKey(uid: string, dayKey: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getAllInPlannedDay');
        const q = query(collection(db, 'planned_tasks'), where('uid', '==', uid), where('dayKey', '==', dayKey));

        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }
}

export default PlannedTaskDao;
