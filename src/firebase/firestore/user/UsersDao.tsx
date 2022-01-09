import { getFirestore, Firestore, getDocs, query, collection, where } from 'firebase/firestore';
import firebaseApp from "src/firebase/Firebase"

class UsersDao {

    public static async getUsersByDisplayName(name: string) {
        const nameLower = name.toLowerCase();

        const db: Firestore = getFirestore(firebaseApp);
        
        const q = query(collection(db, "profiles"), where("nameLower", ">=", nameLower), where("nameLower", "<=", nameLower + "\uF7FF"));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }
}

export default UsersDao;