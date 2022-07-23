import { Timestamp } from "firebase/firestore";
import GoalDao from "src/firebase/firestore/planning/GoalDao";

export interface GoalModel {
    id?: string,
    added: Timestamp,
    name: string,
    description: string,
    pillarId?: string
    deadline: Timestamp,
    status: string
}

export const FAKE_GOAL: GoalModel = {
    added: Timestamp.now(),
    name: '',
    description: '',
    deadline: Timestamp.now(),
    status: "ACTIVE"
}

class GoalController {
    public static createGoal(goal: GoalModel, callback: Function) {
        const result = GoalDao.createGoal(goal);
        result.then(document => {
            callback();
        });
    }

    static getGoals(uid: string, callback: Function) {
        const result = GoalDao.getGoals(uid);

        let goals: GoalModel[] = [];
        result.then(documents => {
            documents.docs.forEach(document => {
                let goal: GoalModel = document.data() as GoalModel;

                if (goal.status === "ARCHIVED") {
                    return;
                }

                goal.id = document.id;
                goals.push(goal);
            });
        }).then(() => {
            goals.sort((a, b) => (a.deadline > b.deadline) ? 1 : -1).reverse();
            callback(goals);
        }).catch(() => {
            callback([]);
        });
    }

    static getGoal(userId: string, id: string, callback: Function) {
        const result = GoalDao.getGoal(userId, id);
        result.then(document => {
            let goal: GoalModel = document.data() as GoalModel;
            goal.id = document.id;
            callback(goal);
        }).catch(() => {
            callback(undefined);
        });
    }

    public static archiveGoal(userId: string, goal: GoalModel, callback: Function) {
        const result = GoalDao.archiveGoal(userId, goal);
        result.then((updatedGoal) => {
            callback(updatedGoal);
        });
    }
}

export default GoalController;