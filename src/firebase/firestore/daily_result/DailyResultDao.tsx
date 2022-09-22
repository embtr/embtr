import { getAuth } from 'firebase/auth';
import { Firestore, addDoc, collection, setDoc, doc, getDocs, getDoc, query, where, Timestamp, arrayUnion } from 'firebase/firestore';
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
    
    public static async get(id: string) {
        const db: Firestore = getFirebaseConnection(this.name, "get");
        const result = await getDoc(doc(db, COLLECTION_NAME, id));

        return result;
    }
    
    public static async getByDayKey(uid: string, dayKey: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getByDayKey');
        const q = query(collection(db, COLLECTION_NAME), where('uid', '==', uid), where('data.plannedDayId', '==', dayKey));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async getAll() {
        const db: Firestore = getFirebaseConnection(this.name, 'getAll');

        const q = query(collection(db, COLLECTION_NAME), where('active', '!=', false));
        const querySnapshot = await getDocs(q);
        return querySnapshot;
    }
    
    public static async getAllForUser(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getAllForUser');

        const q = query(collection(db, COLLECTION_NAME), where("uid", "==", uid), where("active", "!=", false));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
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

    public static addComment(id: string, uid: string, comment: string) {
        const db: Firestore = getFirebaseConnection(this.name, "addComment");

        return setDoc(doc(db, COLLECTION_NAME + "/" + id), {
            public: {
                comments: arrayUnion({
                    uid: uid,
                    comment: comment,
                    timestamp: Timestamp.now()
                })
            }
        }, { merge: true });
    }
}

export default DailyResultDao;
