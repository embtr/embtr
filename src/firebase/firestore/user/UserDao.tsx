import { getFirestore, Firestore, doc, setDoc, getDoc, Timestamp} from 'firebase/firestore';
import firebaseApp from "src/firebase/Firebase"

class UserDao {
    public static async getBetaRequestStatus(email: string) {
        const db: Firestore = getFirestore(firebaseApp);
        const result = await getDoc(doc(db, "users/", email));

        return result;
    }

    public static async requestBetaAccess(email: string) {
        const db: Firestore = getFirestore(firebaseApp);

        const result = await getDoc(doc(db, "users/", email))
            .then(result => {
                if (!result.exists()) {
                    setDoc(doc(db, "users/", email), {
                        "access_level": "beta_pending",
                        "timestamp": Timestamp.now()
                    });
                }
            });

        return result;
    }
}

export default UserDao;