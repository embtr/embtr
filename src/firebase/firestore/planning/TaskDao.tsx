import { getAuth } from 'firebase/auth';
import { Firestore, collection, addDoc, getDocs, orderBy, query, where, getDoc, doc, setDoc } from 'firebase/firestore';
import { RoutineModel } from 'src/controller/planning/TaskController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class RoutineDao {
    public static async createRoutine(routineModel: RoutineModel) {
        const db: Firestore = getFirebaseConnection(this.name, "createRoutine");

        const uid = getAuth().currentUser?.uid;
        if (!uid) {
            return undefined;
        }

        const result = await addDoc(collection(db, "planning", uid, "routines"), routineModel);
        return result;
    }

    public static async archiveRoutine(routine: RoutineModel) {
        const db: Firestore = getFirebaseConnection(this.name, "archiveRoutine");

        const uid = getAuth().currentUser?.uid;
        if (!uid) {
            return undefined;
        }

        const result = setDoc(doc(db, "planning", uid, "routines", routine.id!), {
            active: false
        }, { merge: true });

        return result;
    }

    public static async getRoutine(uid: string, id: string) {
        const db: Firestore = getFirebaseConnection(this.name, "getRoutine");
        const result = await getDoc(doc(db, "planning", uid, "routines", id));
        return result;
    }

    public static async getRoutines(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, "getRoutines");

        const q = query(collection(db, "planning", uid, "routines"));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

}

export default RoutineDao;
