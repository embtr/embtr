import { getFirestore, Firestore, doc, getDoc } from 'firebase/firestore';
import firebaseApp from "src/firebase/Firebase"

class ProfileDao {

    public static async getProfile(email: string) {
        const db: Firestore = getFirestore(firebaseApp);
        const result = await getDoc(doc(db, "profiles/", email));

        return result;
    }

}

export default ProfileDao;