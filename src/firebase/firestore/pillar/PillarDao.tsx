import { getAuth } from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, Timestamp, getDocs, collection } from 'firebase/firestore';
import firebaseApp from "src/firebase/Firebase"
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';

class PillarDao {
    public static async addPillar(pillar: string) {
        getCurrentUserUid((uid: string | undefined) => {
            if (!uid) {
                return;
            }

            const db: Firestore = getFirestore(firebaseApp);

            const timestamp = Timestamp.now()

            setDoc(doc(db, "pillars/" + uid + "/active/" + pillar), {
                "timestamp": timestamp
            }, { merge: true });
        });
    }

    public static async getPillars() {
        const uid = getAuth().currentUser?.uid;

        if (uid) {
            const db: Firestore = getFirestore(firebaseApp);
            const result = await getDocs(collection(db, "pillars/" + uid + "/active"));
    
            return result;
        }
        
        return undefined;
    }
}

export default PillarDao;