import { Firestore, collection, query, orderBy, getDocs  } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class TimelineDao {
    public static async getTimelinePosts() {
        const db: Firestore = getFirebaseConnection(this.name, "getTimelinePosts");

        const q = query(collection(db, "timeline"), orderBy("added", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }
}

export default TimelineDao;
