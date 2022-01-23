import { Firestore, query, collection, orderBy, getDocs, setDoc, doc, increment, arrayUnion } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';


class ExploreDao {
    public static async getChallenges() {
        const db: Firestore = getFirebaseConnection(this.name, "getChallenges");

        const q = query(collection(db, "challenges"), orderBy("added", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static likeChallenge(challengeId: string, userUid: string) {
        const db: Firestore = getFirebaseConnection(this.name, "likeChallenge");

        setDoc(doc(db, "challenges/" + challengeId), {
            likes: arrayUnion(userUid)
        }, { merge: true })
    }

    static addChallengeComment(challengeId: string, userUid: string, comment: string) {
        const db: Firestore = getFirebaseConnection(this.name, "likeChallenge");


        setDoc(doc(db, "challenges/" + challengeId), {
            comments: arrayUnion({
                uid: userUid,
                comment: comment
            })
        }, { merge: true })
    }
}

export default ExploreDao;
