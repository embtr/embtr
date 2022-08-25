import { getAuth } from "firebase/auth";
import { Firestore, addDoc, collection, setDoc, doc } from "firebase/firestore";
import { PlannedDay } from "src/controller/planning/PlannedDayController";
import { DailyResultModel } from "src/controller/timeline/daily_result/DailyResultController";
import { getFirebaseConnection } from "src/firebase/firestore/ConnectionProvider";


class DailyResultDao {
    public static async create(dailyResult: DailyResultModel) {
        const uid = getAuth().currentUser?.uid;

        if (!uid) {
            return;
        }

        const db: Firestore = getFirebaseConnection(this.name, "create");

        const result = await addDoc(collection(db, "daily_results"), dailyResult);
        return result;
    };
}

export default DailyResultDao;