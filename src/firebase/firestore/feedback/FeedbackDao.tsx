import { getAuth } from 'firebase/auth';
import { Firestore, doc, setDoc, getDoc, Timestamp, addDoc, collection } from 'firebase/firestore';
import { FeedbackModel } from 'src/controller/feedback/FeedbackController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class FeedbackDao {
    public static async createFeedback(feedback: FeedbackModel) {
        const db: Firestore = getFirebaseConnection(this.name, "createFeedback");

        const result = await addDoc(collection(db, "feedback"), feedback);
        return result;
    }
}

export default FeedbackDao;