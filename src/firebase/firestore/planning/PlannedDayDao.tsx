import { getAuth } from 'firebase/auth';
import { Firestore, collection, getDocs, deleteDoc, doc, addDoc, getDoc, query, where } from 'firebase/firestore';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';
import { getCurrentUid } from 'src/session/CurrentUserProvider';

class PlannedDayDao {
    public static async replace(plannedDay: PlannedDay) {
        this.delete(plannedDay.id!, () => {
            this.create(plannedDay);
        });
    }

    public static async getByDayKey(uid: string, dayKey: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getByDayKey');

        const q = query(collection(db, 'planned_day'), where('dayKey', '==', dayKey), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async get(id: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'get');

        const result = await getDoc(doc(db, 'planned_day', id));
        return result;
    }

    public static async getDeprecated(uid: string, id: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getDeprecated');

        const result = await getDocs(collection(db, 'planned_day', uid, id));
        return result;
    }

    public static async getAllDeprecated() {
        const db: Firestore = getFirebaseConnection(this.name, 'getAllDeprecated');

        const result = await getDoc(doc(db, 'planned_day', getCurrentUid()));
        return result;
    }

    public static async delete(id: string, callback: Function) {
        const db: Firestore = getFirebaseConnection(this.name, 'delete');

        const userUid = getAuth().currentUser?.uid;
        if (!userUid) {
            return;
        }

        const result = await getDocs(collection(db, 'planned_day', userUid, id));
        result.forEach((plannedDay) => {
            deleteDoc(doc(db, 'planned_day', userUid, id, plannedDay.id));
        });

        callback();
    }

    public static async create(plannedDay: PlannedDay) {
        const db: Firestore = getFirebaseConnection(this.name, 'create');

        const result = await addDoc(collection(db, 'planned_day/'), plannedDay);
        return result;
    }
}

export default PlannedDayDao;
