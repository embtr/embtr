import { addDoc, collection, doc, Firestore, getDoc, query, where, getDocs, setDoc } from 'firebase/firestore';
import { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { getFirebaseConnection } from '../ConnectionProvider';

class PlannedTaskDao {
    public static async create(plannedTask: PlannedTaskModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'create');
        const result = await addDoc(collection(db, 'planned_tasks'), plannedTask);

        return result;
    }

    public static async get(id: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'get');
        const result = await getDoc(doc(db, 'planned_tasks/', id));

        return result;
    }

    public static async update(plannedTask: PlannedTaskModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'update');
        const result = await setDoc(doc(db, 'planned_tasks', plannedTask.id!), plannedTask, { merge: true });

        return result;
    }

    public static async getAllInPlannedDayByDayKey(uid: string, dayKey: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getAllInPlannedDay');
        const q = query(collection(db, 'planned_tasks'), where('uid', '==', uid), where('dayKey', '==', dayKey));

        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async getAllWithHabitId(habitId: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getAllWithHabitId');
        const q = query(collection(db, 'planned_tasks'), where('routine.id', '==', habitId));

        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async getAllWithGoalId(goalId: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getAllWithGoalId');
        const q = query(collection(db, 'planned_tasks'), where('goalId', '==', goalId));

        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async getAllWithPillarId(pillarId: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getAllWithPillarId');
        const q = query(collection(db, 'planned_tasks'), where('pillarId', '==', pillarId));

        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }
}

export default PlannedTaskDao;
