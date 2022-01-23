import { Timestamp } from "firebase/firestore";
import ExploreDao from "src/firebase/firestore/explore/ExploreDao";

interface Comment {
    comment: string
}

export interface ChallangeModel {
    id: string,
    added: Timestamp,
    likes: string[],
    comments: Comment[],
    synopsis: string,
    title: string
}

class ExploreController {
    public static getChallenges(callback: Function) {
        const result = ExploreDao.getChallenges();

        let challenges: ChallangeModel[] = [];
        result.then(response => {
            response.docs.forEach(doc => {
                const challenge: ChallangeModel = doc.data() as ChallangeModel;
                challenge.id = doc.id;
                challenges.push(challenge);
            });
        }).then(() => {
            callback(challenges);
        });
    }

    public static likeChallenge(challengeId: string, userUid: string) {
        ExploreDao.likeChallenge(challengeId, userUid);
    }

    public static addComment(challengeId: string, userUid: string, text: string) {
        ExploreDao.addChallengeComment(challengeId, userUid, text);
    }
}

export default ExploreController;