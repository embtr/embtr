import { Firestore, collection, addDoc, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { RoutineHabitModel } from 'src/controller/routine/RoutineHabitController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class RoutineHabitDao {
    public static async create(routineHabit: RoutineHabitModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'create');
        const result = await addDoc(collection(db, 'routine_habits'), routineHabit);

        return result;
    }

    public static async update(routineHabit: RoutineHabitModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'update');
        const result = await setDoc(doc(db, 'routine_habits', routineHabit.id!), routineHabit, { merge: true });

        return result;
    }

    public static async getAllInRoutine(id: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getAllInRoutine');
        const q = query(collection(db, 'routine_habits'), where('routineId', '==', id));

        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }
}

export default RoutineHabitDao;
