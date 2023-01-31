import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import { TimelinePostModel } from 'src/controller/timeline/TimelineController';
import { UserModel } from 'src/controller/user/UserController';
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

export interface PaginatedGoalResults {
    results: GoalResultModel[];
    lastGoalResult: QueryDocumentSnapshot | undefined | null;
}

class GoalResultController {
    public static async getPaginated(lastGoalResult: QueryDocumentSnapshot | undefined | null, cutoffDate: Date): Promise<PaginatedGoalResults> {
        return this.getPaginatedForUser(undefined, lastGoalResult, cutoffDate);
    }

    public static async getPaginatedForUser(
        user: UserModel | undefined,
        lastGoalResult: QueryDocumentSnapshot | undefined | null,
        cutoffDate: Date
    ): Promise<PaginatedGoalResults> {
        if (lastGoalResult === null) {
            //disable prevention of looking in the past for now
            lastGoalResult = undefined;
            //return { results: [], lastDailyResult: null };
        }

        let results;
        if (user) {
            results = await GoalResultDao.getPaginatedForUser(user.uid, lastGoalResult, cutoffDate);
        } else {
            results = await GoalResultDao.getPaginated(lastGoalResult, cutoffDate);
        }

        let goalResults: GoalResultModel[] = [];
        let foundLastGoalResult: QueryDocumentSnapshot | undefined = undefined;
        for (const result of results.docs) {
            foundLastGoalResult = result;
            const goalResult = await this.getGoalResultFromData(result);

            if (!goalResult.active) {
                continue;
            }

            goalResults.push(goalResult);
        }

        let paginatedGoalResults: PaginatedGoalResults = {
            results: goalResults,
            lastGoalResult: foundLastGoalResult,
        };

        if (paginatedGoalResults.results.length === 0) {
            paginatedGoalResults.lastGoalResult = null;
        }

        return paginatedGoalResults;
    }

    public static async getByGoalId(goalId: string) {
        const result = await GoalResultDao.getByGoalId(goalId);
        const goalResults = await this.getGoalResultFromData(result.docs[0]);

        return goalResults;
    }

    public static async create(goalResult: GoalResultModel) {
        const sanitized = this.sanitizeForDatabase(goalResult);
        GoalResultDao.create(sanitized);

        return goalResult;
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
