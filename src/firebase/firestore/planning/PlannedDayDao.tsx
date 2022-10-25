import { getAuth } from 'firebase/auth';
import { Firestore, collection, getDocs, deleteDoc, doc, addDoc, setDoc } from 'firebase/firestore';
import { PlannedDay, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class PlannedDayDao {
    public static replace(plannedDay: PlannedDay) {
        this.delete(plannedDay.id!, () => {
            this.create(plannedDay);
        });
    }

    /*
     * move us to plannedTaskController/Dao
     */
    public static async updateTask(plannedDay: PlannedDay, plannedTask: PlannedTaskModel) {
        const userUid = getAuth().currentUser?.uid;
        if (!userUid) {
            return;
        }

        const db: Firestore = getFirebaseConnection(this.name, 'updateTask');

        await setDoc(doc(db, 'planned_day', userUid, plannedDay.id!, plannedTask.id!), plannedTask, { merge: true });
        return setDoc(doc(db, 'planned_day', userUid, plannedDay.id!, 'metadata'), plannedDay.metadata, { merge: true });
    }

    public static async createTask(plannedDay: PlannedDay, plannedTask: PlannedTaskModel) {
        const result = await this.createTasks(plannedDay, [plannedTask]);
        return result[0];
    }

    public static async createTasks(plannedDay: PlannedDay, plannedTasks: PlannedTaskModel[]): Promise<PlannedTaskModel[]> {
        const db: Firestore = getFirebaseConnection(this.name, 'createTasks');

        const userUid = getAuth().currentUser?.uid;
        if (!userUid) {
            return [];
        }

        let createdTasks = [];
        for (const plannedTask of plannedTasks) {
            const result = await addDoc(collection(db, 'planned_day', userUid, plannedDay.id!), plannedTask);
            plannedTask.id = result.id;
            createdTasks.push(plannedTask);
        }

        setDoc(doc(db, 'planned_day', userUid, plannedDay.id!, 'metadata'), plannedDay.metadata, { merge: true });
        return createdTasks;
    }

    public static async get(uid: string, id: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'get');

        const result = await getDocs(collection(db, 'planned_day', uid, id));
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

        const userUid = getAuth().currentUser?.uid;
        if (!userUid) {
            return;
        }

        for (let plannedTask of plannedDay.plannedTasks) {
            await addDoc(collection(db, 'planned_day', userUid, plannedDay.id!), plannedTask);
        }

        await setDoc(doc(db, 'planned_day/', userUid, plannedDay.id!, 'metadata'), plannedDay.metadata);
    }
}

export default PlannedDayDao;
