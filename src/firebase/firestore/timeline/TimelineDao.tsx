import { Firestore, collection, query, orderBy, getDocs, where  } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class TimelineDao {
    public static async getTimelinePosts() {
        const db: Firestore = getFirebaseConnection(this.name, "getTimelinePosts");

        const q = query(collection(db, "timeline"), where("active", "!=", false), orderBy("active"), orderBy("added", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async getTimelinePostsForUser(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, "getTimelinePostsForUser");

        const q = query(collection(db, "timeline"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }
}

export default TimelineDao;
