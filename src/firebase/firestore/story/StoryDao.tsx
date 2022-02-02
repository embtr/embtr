import { getAuth } from 'firebase/auth';
import { Firestore, Timestamp, collection, addDoc } from 'firebase/firestore';
import { Story } from 'src/controller/story/StoryController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class StoryDao {
    public static async addStory(story: Story, callback: Function) {
        const uid = getAuth().currentUser?.uid;

        if (!uid) {
            callback(undefined);
            return;
        }

        const db: Firestore = getFirebaseConnection(this.name, "addStory");

        await addDoc(collection(db, "timeline"), story);
    };

}

export default StoryDao;
