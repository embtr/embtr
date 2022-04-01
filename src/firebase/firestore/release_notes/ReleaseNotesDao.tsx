import { getAuth } from 'firebase/auth';
import { Firestore, collection, getDocs, deleteDoc, doc, addDoc, setDoc, Timestamp } from 'firebase/firestore';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class ReleaseNotesDao {
    public static async getAll() {
        const db: Firestore = getFirebaseConnection(this.name, "getAll");

        const result = await getDocs(collection(db, "release_notes"));
        return result;
    }
}

export default ReleaseNotesDao;