import { getAuth } from 'firebase/auth';
import { Firestore, collection, getDocs, deleteDoc, doc, addDoc, setDoc, Timestamp } from 'firebase/firestore';
import { TodayModel } from 'src/controller/planning/TodayController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class TodayDao {
    public static update(todayModel: TodayModel) {
        this.delete(todayModel.id!, () => {
            this.create(todayModel);
        });
    }

    public static async get(id: string) {
        const db: Firestore = getFirebaseConnection(this.name, "get");

        const userUid = getAuth().currentUser?.uid;
        if (!userUid) {
            return;
        }

        const result = await getDocs(collection(db, "today", userUid, id));
        return result;
    }

    public static async delete(id: string, callback: Function) {
        const db: Firestore = getFirebaseConnection(this.name, "delete");

        const userUid = getAuth().currentUser?.uid;
        if (!userUid) {
            return;
        }

        const result = await getDocs(collection(db, "today", userUid, id));
        result.forEach(todayModel => {
            deleteDoc(doc(db, "today", userUid, id, todayModel.id));
        });

        callback();
    }

    public static create(todayModel: TodayModel) {
        const db: Firestore = getFirebaseConnection(this.name, "create");

        const userUid = getAuth().currentUser?.uid;
        if (!userUid) {
            return;
        }

        todayModel.plannedTasks.forEach(plannedTask => {
            addDoc(collection(db, "today", userUid, todayModel.id!), plannedTask);
        });

        setDoc(doc(db, "today/", userUid, todayModel.id!, "metadata"), todayModel.metadata);
    }
}

export default TodayDao;