import { getAuth } from "firebase/auth";
import { Firestore, addDoc, collection, setDoc, doc, getDocs } from "firebase/firestore";
import { PlannedDay } from "src/controller/planning/PlannedDayController";
import { DailyResultModel } from "src/controller/timeline/daily_result/DailyResultController";
import { getFirebaseConnection } from "src/firebase/firestore/ConnectionProvider";

const COLLECTION_NAME = "daily_results";

class DailyResultDao {
    public static async create(dailyResult: DailyResultModel) {
        const uid = getAuth().currentUser?.uid;

        if (!uid) {
            return;
        }

        const db: Firestore = getFirebaseConnection(this.name, "create");

        const result = await addDoc(collection(db, COLLECTION_NAME), dailyResult);
        return result;
    };

    public static async getAll() {
        const db: Firestore = getFirebaseConnection(this.name, "getAll");

        const result = await getDocs(collection(db, COLLECTION_NAME));
        return result;
    }
}

export default DailyResultDao;