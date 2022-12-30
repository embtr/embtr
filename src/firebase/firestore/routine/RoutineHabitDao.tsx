import { Firestore, collection, addDoc } from 'firebase/firestore';
import { RoutineHabitModel } from 'src/controller/routine/RoutineHabitController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class RoutineHabitDao {
    public static async create(routineHabit: RoutineHabitModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'create');
        const result = await addDoc(collection(db, 'routine_habits'), routineHabit);

        return result;
    }
}

export default RoutineHabitDao;
