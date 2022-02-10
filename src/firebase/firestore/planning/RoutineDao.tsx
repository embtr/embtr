import { getAuth } from 'firebase/auth';
import { Firestore, collection, addDoc } from 'firebase/firestore';
import { RoutineModel } from 'src/controller/planning/RoutineController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class RoutineDao {

    public static async createRoutine(routineModel: RoutineModel) {
        const db: Firestore = getFirebaseConnection(this.name, "createRoutine");

        const uid = getAuth().currentUser?.uid;
        if (!uid) {
            return undefined;
        }

        const result = await addDoc(collection(db, "planning", uid, "routines"), {
            routineModel
        });

        return result;
    }

}

export default RoutineDao;
