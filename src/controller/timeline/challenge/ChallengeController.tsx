import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { Comment, Like, TimelinePostModel } from "src/controller/timeline/TimelineController";
import ChallengeDao from "src/firebase/firestore/challenge/ChallengeDao";

export interface ChallengeParticipant {
    uid: string,
    added: Timestamp
}

export interface ChallengeModel1 extends TimelinePostModel {
    public: {
        comments: Comment[],
        likes: Like[],
        participants: ChallengeParticipant[]
    },
}

export const challengeWasLikedBy = (challengeModel: ChallengeModel1, uid: string): boolean => {
    let isLiked = false;
    challengeModel.public.likes.forEach(like => {
        if (like.uid === uid) {
            isLiked = true;
            return;
        }
    });

    return isLiked;
};

export const challengeWasAcceptedBy = (challengeModel: ChallengeModel1, uid: string): boolean => {
    let isAccepted = false;
    challengeModel.public.participants.forEach(like => {
        if (like.uid === uid) {
            isAccepted = true;
            return;
        }
    });

    return isAccepted;
};

export const createChallenge = (uid: string, title: string, story: string): ChallengeModel1 => {
    return {
        id: "",
        added: Timestamp.now(),
        type: "CHALLENGE",
        uid: uid,
        public: {
            comments: [],
            likes: [],
            participants: []
        },
        data: {
            title: title,
            story: story
        }
    };
};

class ChallengeController {
    public static addChallenge(title: string, story: string, callback: Function) {
        const uid = getAuth().currentUser?.uid;
        if (!uid) {
            return;
        }
        const challengeModel = createChallenge(uid, title, story);
        ChallengeDao.addChallenge(challengeModel, callback);
    }

    public static getChallenges(callback: Function) {
        const result = ChallengeDao.getChallenges();

        let challenges: ChallengeModel1[] = [];
        result.then(response => {
            response.docs.forEach(doc => {
                let challenge: ChallengeModel1 = doc.data() as ChallengeModel1;
                challenge.id = doc.id;
                challenges.push(challenge);
            });
        }).then(() => {
            callback(challenges);
        });
    }

    public static getChallenge(id: string, callback: Function) {
        const result = ChallengeDao.getChallenge(id);
        result.then(doc => {
            if (!doc || !doc.exists()) {
                callback(undefined);
            } else {
                let challenge: ChallengeModel1 = doc.data() as ChallengeModel1;
                challenge.id = doc.id;
                callback(challenge);
            }
        });
    }

    public static addParticipant(id: string, userUid: string) {
        ChallengeDao.addParticipant(id, userUid);
    }

    public static likeChallenge(id: string, userUid: string) {
        ChallengeDao.likeChallenge(id, userUid);
    }

    public static addComment(id: string, uid: string, commentText: string, callback: Function) {
        ChallengeDao.addComment(id, uid, commentText).then(() => {
            callback();
        });
    }
}

export default ChallengeController;