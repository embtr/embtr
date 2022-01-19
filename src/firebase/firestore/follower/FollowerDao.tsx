import { Firestore, collection, getDocs, doc, setDoc, Timestamp, getDoc, updateDoc, increment } from 'firebase/firestore';
import { FollowCounts } from 'src/controller/follower/FollowerController';
import { getFirebaseConnection as getFirestoreConnection } from 'src/firebase/firestore/ConnectionProvider';

class FollowerDao {
    public static async getFollowers(uid: string) {
        const db: Firestore = getFirestoreConnection(this.name, "getFollowers");
        const result = await getDocs(collection(db, "follows/" + uid + "/followers"));

        return result;
    }

    public static async getFollowing(uid: string) {
        const db: Firestore = getFirestoreConnection(this.name, "getFollowing");
        const result = await getDocs(collection(db, "follows/" + uid + "/following"));

        return result;
    }

    public static async getFollow(uid: string) {
        const db: Firestore = getFirestoreConnection(this.name, "getFollow");

        const result = await getDoc(doc(db, "follows/" + uid));
        return result;
    }

    public static async setFollow(uid: string, followCounts: FollowCounts) {
        const db: Firestore = getFirestoreConnection(this.name, "setFollow");

        setDoc(doc(db, "follows/" + uid), {
            "follower_count": followCounts.follower_count, "following_count": followCounts.following_count
        }, { merge: true });
    }

    public static async followUser(uid: string, uidToFollow: string) {
        const db: Firestore = getFirestoreConnection(this.name, "followUser");

        const timestamp = Timestamp.now()

        setDoc(doc(db, "follows/" + uid + "/following/" + uidToFollow), {
            "active": true,
            "timestamp": timestamp
        }, { merge: true })

            .then(() => {
                setDoc(doc(db, "follows/" + uidToFollow + "/followers/" + uid), {
                    "active": true,
                    "timestamp": timestamp
                }, { merge: true });
            })

            .then(() => {
                updateDoc(doc(db, "follows/" + uid), { following_count: increment(1) })
                updateDoc(doc(db, "follows/" + uidToFollow), { follower_count: increment(1) })
            });
    }

    public static async unfollowUser(uid: string, uidToUnfollow: string) {
        const db: Firestore = getFirestoreConnection(this.name, "unfollowUser");

        const timestamp = Timestamp.now()

        setDoc(doc(db, "follows/" + uid + "/following/" + uidToUnfollow), {
            "active": false,
            "timestamp": timestamp
        }, { merge: true })
        
        .then(() => {
            setDoc(doc(db, "follows/" + uidToUnfollow + "/followers/" + uid), {
                "active": false,
                "timestamp": timestamp
            }, { merge: true })
            
            .then(() => {
                updateDoc(doc(db, "follows/" + uid), { following_count: increment(-1) })
                updateDoc(doc(db, "follows/" + uidToUnfollow), { follower_count: increment(-1) })
            });
        });
    }
}

export default FollowerDao;