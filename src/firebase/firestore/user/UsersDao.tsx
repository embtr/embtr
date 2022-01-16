import { Firestore, getDocs, query, collection, where } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class UsersDao {

    public static async getUsersByDisplayName(name: string) {
        const nameLower = name.toLowerCase();

        const db: Firestore = getFirebaseConnection(this.name, "getUsersByDisplayName");
        
        const q = query(collection(db, "profiles"), where("nameLower", ">=", nameLower), where("nameLower", "<=", nameLower + "\uF7FF"));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }
}

export default UsersDao;