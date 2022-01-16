import { Firestore, doc, setDoc, getDoc, Timestamp} from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class CurrentUserDao {
    public static async getBetaRequestStatus(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, "getBetaRequestStatus");
        const result = await getDoc(doc(db, "users/", uid));

        return result;
    }

    public static async requestBetaAccess(uid: string, email: string) {
        const db: Firestore = getFirebaseConnection(this.name, "requestBetaAccess");

        const result = await getDoc(doc(db, "users/", uid))
            .then(result => {
                if (!result.exists()) {
                    setDoc(doc(db, "users/", uid), {
                        "email": email,
                        "access_level": "beta_pending",
                        "timestamp": Timestamp.now()
                    });
                }
            });

        return result;
    }
}

export default CurrentUserDao;