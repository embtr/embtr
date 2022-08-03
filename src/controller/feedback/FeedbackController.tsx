import { Timestamp } from "firebase/firestore";
import FeedbackDao from "src/firebase/firestore/feedback/FeedbackDao";

export interface FeedbackModel {
    uid: string,
    feedback: string,
    added: Timestamp
}

class FeedbackController {
    public static async saveFeedback(uid: string, feedback: string, callback: Function) {
        const feedbackModel: FeedbackModel = {
            uid: uid,
            feedback: feedback,
            added: Timestamp.now()
        }

        await FeedbackDao.createFeedback(feedbackModel);
        callback();
    }
}

export default FeedbackController;