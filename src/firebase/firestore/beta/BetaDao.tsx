import { getFirestore, Firestore, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import firebaseApp from "src/firebase/Firebase"

class BetaDao {

    public static async getBetaRequestStatus(email: string) {
        const db: Firestore = getFirestore(firebaseApp);
        const result = await getDoc(doc(db, "beta/", email));

        return result;
    }

    public static async requestBetaAccess(email: string) {
        const db: Firestore = getFirestore(firebaseApp);

        const result = await getDoc(doc(db, "beta/", email))
            .then(result => {
                if (!result.exists()) {
                    setDoc(doc(db, "beta/", email), {
                        "status": "pending",
                        "timestamp": Timestamp.now()
                    });
                }
            });

            return result;
    }
}

export default BetaDao;