import { getAuth } from 'firebase/auth';
import { Firestore, addDoc, collection, setDoc, doc, getDocs, getDoc, query, where, Timestamp, arrayUnion } from 'firebase/firestore';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { Like } from 'src/controller/timeline/TimelineController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

const COLLECTION_NAME = 'daily_results';

class DailyResultDao {
    public static async create(dailyResult: DailyResultModel) {
        const uid = getAuth().currentUser?.uid;

        if (!uid) {
            return;
        }

        const db: Firestore = getFirebaseConnection(this.name, 'create');

        const result = await addDoc(collection(db, COLLECTION_NAME), dailyResult);
        return result;
    }

    public static async get(uid: string, dayKey: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'get');
        const q = query(collection(db, COLLECTION_NAME), where('uid', '==', uid), where('data.plannedDayId', '==', dayKey));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async getAll() {
        const db: Firestore = getFirebaseConnection(this.name, 'getAll');

        const result = await getDocs(collection(db, COLLECTION_NAME));
        return result;
    }

    public static async update(dailyResult: DailyResultModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'update');

        dailyResult.modified = Timestamp.now();
        const result = await setDoc(doc(db, COLLECTION_NAME, dailyResult.id!), dailyResult, { merge: true });
 
        return result;
    }
    
    public static like(dailyResult: DailyResultModel, likerUid: string) {
        const db: Firestore = getFirebaseConnection(this.name, "like");

        const like: Like = {
            uid: likerUid,
            added: Timestamp.now()
        };

        setDoc(doc(db, "daily_results/" + dailyResult.id), {
            public: {
                likes: arrayUnion(like)
            }
        }, { merge: true })
    }
}

export default DailyResultDao;
