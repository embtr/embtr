import { getAuth } from 'firebase/auth';
import { Firestore, collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { StoryModel } from 'src/controller/story/StoryController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class StoryDao {
    public static async addStory(story: StoryModel, callback: Function) {
        const uid = getAuth().currentUser?.uid;

        if (!uid) {
            callback(undefined);
            return;
        }

        const db: Firestore = getFirebaseConnection(this.name, "addStory");

        await addDoc(collection(db, "timeline"), story);
    };

    public static async getStories() {
        const db: Firestore = getFirebaseConnection(this.name, "getStories");

        const q = query(collection(db, "timeline"), orderBy("added", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

}

export default StoryDao;
