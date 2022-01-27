import { Firestore, query, collection, orderBy, getDocs, setDoc, doc, increment, arrayUnion, Timestamp, getDoc } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';


class ExploreDao {
    public static async getChallenges() {
        const db: Firestore = getFirebaseConnection(this.name, "getChallenges");

        const q = query(collection(db, "challenges"), orderBy("added", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async getChallenge(id: string) {
        const db: Firestore = getFirebaseConnection(this.name, "getChallenge");

        const result = await getDoc(doc(db, "challenges/" + id));
        return result;
    }

    public static likeChallenge(challengeId: string, userUid: string) {
        const db: Firestore = getFirebaseConnection(this.name, "likeChallenge");

        setDoc(doc(db, "challenges/" + challengeId), {
            likes: arrayUnion(userUid)
        }, { merge: true })
    }

    public static addChallengeComment(challengeId: string, userUid: string, comment: string) {
        const db: Firestore = getFirebaseConnection(this.name, "addChallengeComment");


        setDoc(doc(db, "challenges/" + challengeId), {
            comments: arrayUnion({
                uid: userUid,
                comment: comment,
                timestamp: Timestamp.now()
            })
        }, { merge: true });
    }

    public static acceptChallenge(challengeId: string, userUid: string) {
        const db: Firestore = getFirebaseConnection(this.name, "acceptChallenge");


        setDoc(doc(db, "challenges/" + challengeId), {
            participants: arrayUnion({
                uid: userUid,
                timestamp: Timestamp.now()
            })
        }, { merge: true });
    }
}

export default ExploreDao;
