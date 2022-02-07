import { getAuth } from 'firebase/auth';
import { Firestore, collection, addDoc, query, orderBy, getDocs, setDoc, doc, arrayUnion, Timestamp, getDoc, where } from 'firebase/firestore';
import { ChallengeModel1, ChallengeParticipant } from 'src/controller/timeline/challenge/ChallengeController';
import { Like } from 'src/controller/timeline/TimelineController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class ChallengeDao {
    public static async addChallenge(challengeModel: ChallengeModel1, callback: Function) {
        const uid = getAuth().currentUser?.uid;

        if (!uid) {
            callback(undefined);
            return;
        }

        const db: Firestore = getFirebaseConnection(this.name, "addChallenge");

        await addDoc(collection(db, "timeline"), challengeModel);
    };

    public static async getChallenges() {
        const db: Firestore = getFirebaseConnection(this.name, "getChallenges");

        const q = query(collection(db, "timeline"), where("type", "==", "CHALLENGE"), orderBy("added", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async getChallenge(id: string) {
        const db: Firestore = getFirebaseConnection(this.name, "getChallenge");

        const result = await getDoc(doc(db, "timeline/" + id));
        return result;
    }

    public static likeChallenge(id: string, userUid: string) {
        const db: Firestore = getFirebaseConnection(this.name, "likeChallenge");

        const like: Like = {
            uid: userUid,
            added: Timestamp.now()
        };

        setDoc(doc(db, "timeline/" + id), {
            public: {
                likes: arrayUnion(like)
            }
        }, { merge: true })
    }

    public static addParticipant(id: string, userUid: string) {
        const db: Firestore = getFirebaseConnection(this.name, "addParticipant");

        const participant: ChallengeParticipant = {
            uid: userUid,
            added: Timestamp.now()
        };

        setDoc(doc(db, "timeline/" + id), {
            public: {
                participants: arrayUnion(participant)
            }
        }, { merge: true })
    }

    public static addComment(id: string, uid: string, comment: string) {
        const db: Firestore = getFirebaseConnection(this.name, "addComment");

        return setDoc(doc(db, "timeline/" + id), {
            public: {
                comments: arrayUnion({
                    uid: uid,
                    comment: comment,
                    timestamp: Timestamp.now()
                })
            }
        }, { merge: true });
    }
}

export default ChallengeDao;
