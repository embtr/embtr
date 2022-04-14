import { getAuth } from 'firebase/auth';
import { Firestore, collection, addDoc, getDocs, orderBy, query, where, getDoc, doc, setDoc } from 'firebase/firestore';
import { TaskModel } from 'src/controller/planning/TaskController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class TaskDao {
    public static async createTask(task: TaskModel) {
        const db: Firestore = getFirebaseConnection(this.name, "createTask");

        const uid = getAuth().currentUser?.uid;
        if (!uid) {
            return undefined;
        }

        const result = await addDoc(collection(db, "planning", uid, "routines"), task);
        return result;
    }

    public static async archiveTask(task: TaskModel) {
        const db: Firestore = getFirebaseConnection(this.name, "archiveTasks");

        const uid = getAuth().currentUser?.uid;
        if (!uid) {
            return undefined;
        }

        const result = setDoc(doc(db, "planning", uid, "routines", task.id!), {
            active: false
        }, { merge: true });

        return result;
    }

    public static async getTask(uid: string, id: string) {
        const db: Firestore = getFirebaseConnection(this.name, "getTask");
        const result = await getDoc(doc(db, "planning", uid, "routines", id));
        return result;
    }

    public static async getTasks(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, "getRoutines");

        const q = query(collection(db, "planning", uid, "routines"));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

}

export default TaskDao;
