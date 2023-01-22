import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import { TimelinePostModel } from 'src/controller/timeline/TimelineController';
import GoalResultDao from 'src/firebase/firestore/timeline/goals/GoalResultDao';

export interface GoalResultModel extends TimelinePostModel {
    data: {
        completionDate: Timestamp;
        status: string;
        goal: {
            id: string;
            goal?: GoalModel;
        };
    };
}

class GoalResultController {
    public static async getByGoalId(goalId: string) {
        const result = await GoalResultDao.getByGoalId(goalId);
        const goalResults = await this.getGoalResultFromData(result.docs[0]);

        return goalResults;
    }

    public static async update(goalResult: GoalResultModel) {
        const sanitized = this.sanitizeForDatabase(goalResult);
        GoalResultDao.update(sanitized);

        return goalResult;
    }

    public static async delete(goalResult: GoalResultModel) {
        goalResult.active = false;

        const sanitized = this.sanitizeForDatabase(goalResult);
        await GoalResultDao.update(sanitized);

        return goalResult;
    }

    private static async getGoalResultFromData(data: DocumentSnapshot<DocumentData>) {
        let goalResult = data.data() as GoalResultModel;
        goalResult.id = data.id;

        const goal: GoalModel = await new Promise((resolve) => {
            GoalController.getGoal(goalResult.uid, goalResult.data.goal.id, (goal: GoalModel) => {
                resolve(goal);
            });
        });

        goalResult.data.goal.goal = goal;

        return goalResult;
    }

    private static sanitizeForDatabase(goalResult: GoalResultModel) {
        delete goalResult.data.goal.goal;

        return goalResult;
    }
}

export default GoalResultController;
