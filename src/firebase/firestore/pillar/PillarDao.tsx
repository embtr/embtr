import { getAuth } from 'firebase/auth';
import { Firestore, doc, setDoc, Timestamp, getDocs, collection } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';

class PillarDao {
    public static async addPillar(pillar: string) {
        getCurrentUserUid((uid: string | undefined) => {
            if (!uid) {
                return;
            }

            const db: Firestore = getFirebaseConnection(this.name, "addPillar");

            const timestamp = Timestamp.now()

            setDoc(doc(db, "pillars/" + uid + "/active/" + pillar), {
                "timestamp": timestamp
            }, { merge: true });
        });
    }

    public static async getPillars() {
        const uid = getAuth().currentUser?.uid;

        if (uid) {
            const db: Firestore = getFirebaseConnection(this.name, "getPillars");
            const result = await getDocs(collection(db, "pillars/" + uid + "/active"));
    
            return result;
        }
        
        return undefined;
    }
}

export default PillarDao;
