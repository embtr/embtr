import { getAuth } from 'firebase/auth';
import { Firestore, collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class PlannedDayDao {
    public static async delete(plannedDayUid: string, callback: Function) {
        const db: Firestore = getFirebaseConnection(this.name, "delete");

        const userUid = getAuth().currentUser?.uid;
        if (!userUid) {
            return;
        }

        const result = await getDocs(collection(db, "planned_day", userUid, plannedDayUid));
        result.forEach(plannedDay => {
            deleteDoc(doc(db, "planned_day", userUid, plannedDayUid, plannedDay.id));
        });

        callback();
    }

    public static async create(plannedDay: PlannedDay) {
        const db: Firestore = getFirebaseConnection(this.name, "create");

        const userUid = getAuth().currentUser?.uid;
        if (!userUid) {
            return;
        }

        plannedDay.plannedTasks.forEach(plannedTask => {
            addDoc(collection(db, "planned_day", userUid, plannedDay.id!), plannedTask);
        });
    }
}

export default PlannedDayDao;