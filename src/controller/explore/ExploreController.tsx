import { Timestamp } from "firebase/firestore";
import ExploreDao from "src/firebase/firestore/explore/ExploreDao";

export interface ChallangeModel {
    added: Timestamp,
    comments: number,
    likes: number,
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
                challenges.push(challenge);
            });
        }).then(() => {
            callback(challenges);
        });
    }
}

export default ExploreController;