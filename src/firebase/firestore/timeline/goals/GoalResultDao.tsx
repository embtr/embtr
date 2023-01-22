import { getAuth } from 'firebase/auth';
import { Firestore, collection, addDoc, query, getDocs, doc, setDoc, where } from 'firebase/firestore';
import { GoalModel } from 'src/controller/planning/GoalController';
import { GoalResultModel } from 'src/controller/timeline/goals/GoalResultController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';
import { getCurrentUid } from 'src/session/CurrentUserProvider';

class GoalResultDao {
    public static async create(goalResult: GoalResultModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'create');
        const result = await addDoc(collection(db, 'goal_results'), goalResult);

        return result;
    }

    public static async getByGoalId(goalId: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getByGoalId');

        const q = query(collection(db, 'goal_results'), where('data.goal.id', '==', goalId));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async update(goalResult: GoalResultModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'update');
        const result = await setDoc(doc(db, 'goal_results'), goalResult, { merge: true });

        return result;
    }
}

export default GoalResultDao;
