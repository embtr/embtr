import { Timestamp } from "firebase/firestore";
import ExploreDao from "src/firebase/firestore/explore/ExploreDao";

export interface ChallengeParticipant {
    uid: string,
    accepted: Timestamp
}

export interface CommentModel {
    uid: string,
    comment: string,
    timestamp: Timestamp
}

export interface LikeModel {
    uid: string,
    added: Timestamp    
}

export interface ChallengeModel {
    id: string,
    added: Timestamp,
    participants: ChallengeParticipant[],
    likes: string[],
    comments: CommentModel[],
    synopsis: string,
    title: string
}

class ExploreController {
    public static getChallenges(callback: Function) {
        const result = ExploreDao.getChallenges();

        let challenges: ChallengeModel[] = [];
        result.then(response => {
            response.docs.forEach(doc => {
                const challenge: ChallengeModel = doc.data() as ChallengeModel;
                challenge.id = doc.id;
                challenges.push(challenge);
            });
        }).then(() => {
            callback(challenges);
        });
    }

    public static getChallenge(id: string, callback: Function) {
        const result = ExploreDao.getChallenge(id);
        result.then(challenge => {
            if (!challenge || !challenge.exists()) {
                callback(undefined);
                return;
            }

            let challengeModel: ChallengeModel = challenge.data() as ChallengeModel;
            challengeModel.id = challenge.id;
            callback(challengeModel);
        });
    }

    public static likeChallenge(challengeId: string, userUid: string) {
        ExploreDao.likeChallenge(challengeId, userUid);
    }

    public static addComment(challengeId: string, userUid: string, text: string, callback: Function) {
        const result = ExploreDao.addChallengeComment(challengeId, userUid, text);
        result.then(() => {
            callback();
        });
    }

    public static acceptChallenge(challengeId: string, userUid: string) {
        ExploreDao.acceptChallenge(challengeId, userUid);
    }
}

export default ExploreController;