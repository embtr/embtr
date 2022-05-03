import { getAuth } from 'firebase/auth';
import { Firestore, collection, getDocs, deleteDoc, doc, addDoc, setDoc, Timestamp } from 'firebase/firestore';
import { PlannedDay, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class PlannedDayDao {
    public static replace(plannedDay: PlannedDay) {
        this.delete(plannedDay.id!, () => {
            this.create(plannedDay);
        });
    }

    public static updateTask(plannedDay: PlannedDay, plannedTask: PlannedTaskModel) {
        const userUid = getAuth().currentUser?.uid;
        if (!userUid) {
            return;
        }

        const db: Firestore = getFirebaseConnection(this.name, "update");

        const result = setDoc(doc(db, "planned_day", userUid, plannedDay.id!, plannedTask.id!), plannedTask, { merge: true });
        return result;
    }

    public static async get(id: string) {
        const userUid = getAuth().currentUser?.uid;
        if (!userUid) {
            return;
        }

        const db: Firestore = getFirebaseConnection(this.name, "get");

        const result = await getDocs(collection(db, "planned_day", userUid, id));
        return result;
    }

    public static async delete(id: string, callback: Function) {
        const db: Firestore = getFirebaseConnection(this.name, "delete");

        const userUid = getAuth().currentUser?.uid;
        if (!userUid) {
            return;
        }

        const result = await getDocs(collection(db, "planned_day", userUid, id));
        result.forEach(plannedDay => {
            deleteDoc(doc(db, "planned_day", userUid, id, plannedDay.id));
        });

        callback();
    }

    public static create(plannedDay: PlannedDay) {
        const db: Firestore = getFirebaseConnection(this.name, "create");

        const userUid = getAuth().currentUser?.uid;
        if (!userUid) {
            return;
        }

        plannedDay.plannedTasks.forEach(plannedTask => {
            addDoc(collection(db, "planned_day", userUid, plannedDay.id!), plannedTask);
        });

        setDoc(doc(db, "planned_day/", userUid, plannedDay.id!, "metadata"), plannedDay.metadata);
    }
}

export default PlannedDayDao;