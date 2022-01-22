import { Firestore, query, collection, orderBy, getDocs } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class ExploreDao {
    public static async getChallenges() {
        const db: Firestore = getFirebaseConnection(this.name, "getChallenges");
        
        const q = query(collection(db, "challenges"), orderBy("added", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }
}

export default ExploreDao;
