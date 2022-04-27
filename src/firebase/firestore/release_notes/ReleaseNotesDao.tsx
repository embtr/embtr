import { Firestore, collection, getDocs } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class ReleaseNotesDao {
    public static async getAll() {
        const db: Firestore = getFirebaseConnection(this.name, "getAll");

        const result = await getDocs(collection(db, "release_notes"));
        return result;
    }
}

export default ReleaseNotesDao;