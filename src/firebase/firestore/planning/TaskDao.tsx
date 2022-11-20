import { getAuth } from 'firebase/auth';
import { Firestore, collection, addDoc, getDocs, query, getDoc, doc, setDoc } from 'firebase/firestore';
import { TaskModel } from 'src/controller/planning/TaskController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';
import { getCurrentUid } from 'src/session/CurrentUserProvider';

class TaskDao {
    public static async createTask(task: TaskModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'createTask');

        const uid = getAuth().currentUser?.uid;
        if (!uid) {
            return undefined;
        }

        const result = await addDoc(collection(db, 'planning', uid, 'routines'), task);
        return result;
    }

    public static async update(task: TaskModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'update');
        const result = setDoc(doc(db, 'planning', getCurrentUid(), 'routines', task.id!), task, { merge: true });
        return result;
    }

    public static async getTask(uid: string, id: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getTask');
        const result = await getDoc(doc(db, 'planning', uid, 'routines', id));
        return result;
    }

    public static async getTasks(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getRoutines');

        const q = query(collection(db, 'planning', uid, 'routines'));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }
}

export default TaskDao;
