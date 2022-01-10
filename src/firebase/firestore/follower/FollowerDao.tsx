import { getFirestore, Firestore, collection, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import firebaseApp from "src/firebase/Firebase"

class FollowerDao {
    public static async getFollowers(uid: string) {
        const db: Firestore = getFirestore(firebaseApp);
        const result = await getDocs(collection(db, "follows/" + uid + "/followers"));

        return result;
    }

    public static async getFollowing(uid: string) {
        const db: Firestore = getFirestore(firebaseApp);
        const result = await getDocs(collection(db, "follows/" + uid + "/following"));

        return result;
    }

    public static async followUser(uid: string, uidToFollow: string) {
        const db: Firestore = getFirestore(firebaseApp);

        const timestamp = Timestamp.now()

        setDoc(doc(db, "follows/" + uid + "/following/" + uidToFollow), {
            "active": true,
            "timestamp": timestamp
        }, { merge: true });

        setDoc(doc(db, "follows/" + uidToFollow + "/followers/" + uid), {
            "active": true,
            "timestamp": timestamp
        }, { merge: true });
    }

    public static async unfollowUser(uid: string, uidToUnfollow: string) {
        const db: Firestore = getFirestore(firebaseApp);

        const timestamp = Timestamp.now()

        setDoc(doc(db, "follows/" + uid + "/following/" + uidToUnfollow), {
            "active": false,
            "timestamp": timestamp
        }, { merge: true });

        setDoc(doc(db, "follows/" + uidToUnfollow + "/followers/" + uid), {
            "active": false,
            "timestamp": timestamp
        }, { merge: true });
    }
}

export default FollowerDao;