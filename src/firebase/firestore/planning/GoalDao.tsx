import { getAuth } from 'firebase/auth';
import { Firestore, collection, addDoc, query, getDocs, getDoc, doc } from 'firebase/firestore';
import { GoalModel } from 'src/controller/planning/GoalController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class GoalDao {
    public static async createGoal(goal: GoalModel) {
        const db: Firestore = getFirebaseConnection(this.name, "createGoal");

        const uid = getAuth().currentUser?.uid;
        if (!uid) {
            return undefined;
        }

        const result = await addDoc(collection(db, "goals", uid, "goals"), goal);
        return result;
    }

    public static async getGoals(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, "getGoals");

        const q = query(collection(db, "goals", uid, "goals"));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async getGoal(userId: string, id: string) {
        const db: Firestore = getFirebaseConnection(this.name, "getGoal");
        const result = await getDoc(doc(db, "goals", userId, "goals", id));
        return result;
    }
}

export default GoalDao;
