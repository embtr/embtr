import { Timestamp } from "firebase/firestore";
import GoalDao from "src/firebase/firestore/planning/GoalDao";

export interface GoalModel {
    id?: string,
    added: Timestamp,
    name: string,
    description: string,
    deadline: Timestamp
}

class GoalController {
    public static createGoal(goal: GoalModel, callback: Function) {
        const result = GoalDao.createGoal(goal);
        result.then(document => {
            callback();
        });
    }
}

export default GoalController;