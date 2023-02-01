import { Firestore, collection, addDoc, query, getDocs, doc, setDoc, where, QueryDocumentSnapshot, orderBy, startAfter } from 'firebase/firestore';
import { GoalResultModel } from 'src/controller/timeline/goals/GoalResultController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

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

    public static async getPaginatedForUser(uid: string, lastGoalResult: QueryDocumentSnapshot | undefined, cutoffDate: Date) {
        const db: Firestore = getFirebaseConnection(this.name, 'getPaginatedForUser');

        const q = lastGoalResult
            ? query(
                  collection(db, 'goal_results'),
                  where('data.completionDate', '>', cutoffDate),
                  where('uid', '==', uid),
                  orderBy('data.completionDate', 'desc'),
                  startAfter(lastGoalResult)
              )
            : query(
                  collection(db, 'goal_results'),
                  where('data.completionDate', '>', cutoffDate),
                  where('uid', '==', uid),
                  orderBy('data.completionDate', 'desc')
              );
        const querySnapshot = await getDocs(q);
        return querySnapshot;
    }

    public static async getPaginated(lastGoalResult: QueryDocumentSnapshot | undefined, cutoffDate: Date) {
        const db: Firestore = getFirebaseConnection(this.name, 'getPaginated');

        const q = lastGoalResult
            ? query(
                  collection(db, 'goal_results'),
                  where('data.completionDate', '>', cutoffDate),
                  orderBy('data.completionDate', 'desc'),
                  startAfter(lastGoalResult)
              )
            : query(collection(db, 'goal_results'), where('data.completionDate', '>', cutoffDate), orderBy('data.completionDate', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot;
    }

    public static async update(goalResult: GoalResultModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'update');
        const result = await setDoc(doc(db, 'goal_results', goalResult.id!), goalResult, { merge: true });

        return result;
    }
}

export default GoalResultDao;
