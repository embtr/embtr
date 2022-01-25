import { Timestamp } from "firebase/firestore";
import ExploreDao from "src/firebase/firestore/explore/ExploreDao";

export interface ChallengeParticipant {
    uid: string,
    accepted: Timestamp
}

export interface Comment {
    uid: string,
    comment: string
}

export interface ChallangeModel {
    id: string,
    added: Timestamp,
    participants: ChallengeParticipant[],
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

    public static acceptChallenge(challengeId: string, userUid: string) {
        ExploreDao.acceptChallenge(challengeId, userUid);

    }
}

export default ExploreController;