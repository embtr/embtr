import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import GoalDao from 'src/firebase/firestore/planning/GoalDao';
import { PlannedTaskHistoryModel } from 'src/model/Models';
import { updatePlannedTaskHistory } from 'src/util/HistoryUtility';
import { plannedTaskIsFailed } from './PlannedDayController';
import { PlannedTaskModel } from './PlannedTaskController';

interface GoalHistoryModel {
    plannedTaskHistory: PlannedTaskHistoryModel;
}

export interface GoalModel {
    id?: string;
    uid: string;
    added: Timestamp;
    name: string;
    description: string;
    pillarId?: string;
    deadline: Timestamp;
    status: string;
    history: GoalHistoryModel;
}

const EMPTY_HISTORY: GoalHistoryModel = {
    plannedTaskHistory: {
        complete: [],
        incomplete: [],
        failed: [],
    },
};

export const FAKE_GOAL: GoalModel = {
    uid: '',
    added: Timestamp.now(),
    name: '',
    description: '',
    deadline: Timestamp.now(),
    status: 'ACTIVE',
    history: EMPTY_HISTORY,
};

const ARCHIVED = 'ARCHIVED';

class GoalController {
    public static clone(goal: GoalModel) {
        const clone: GoalModel = {
            uid: goal.uid,
            added: goal.added,
            name: goal.name,
            description: goal.description,
            deadline: goal.deadline,
            status: goal.status,
            history: goal.history,
        };

        if (goal.id) {
            clone.id = goal.id;
        }

        if (goal.pillarId) {
            clone.pillarId = goal.pillarId;
        }

        return clone;
    }

    public static createGoal(goal: GoalModel, callback: Function) {
        const result = GoalDao.createGoal(goal);
        result.then(() => {
            callback();
        });
    }

    public static getGoals(uid: string, callback: Function) {
        const result = GoalDao.getGoals(uid);

        let goals: GoalModel[] = [];
        result
            .then((documents) => {
                documents.docs.forEach((document) => {
                    const goal = this.createGoalFromData(uid, document);

                    if (goal.status === ARCHIVED) {
                        return;
                    }

                    goals.push(goal);
                });
            })
            .then(() => {
                goals.sort((a, b) => (a.deadline > b.deadline ? 1 : -1)).reverse();
                callback(goals);
            })
            .catch(() => {
                callback([]);
            });
    }

    public static getGoal(uid: string, id: string, callback: Function) {
        const result = GoalDao.getGoal(uid, id);
        result
            .then((document) => {
                const goal = this.createGoalFromData(uid, document);
                callback(goal);
            })
            .catch(() => {
                callback(undefined);
            });
    }

    public static async archiveGoal(goal: GoalModel) {
        goal.status = ARCHIVED;
        await GoalDao.update(goal);
    }

    public static async update(goal: GoalModel) {
        await GoalDao.update(goal);
    }

    public static async updateHistory(plannedTask: PlannedTaskModel) {
        if (!plannedTask.id || (!plannedTask.goalId && !plannedTask.routine.id)) {
            return;
        }

        let goalId = plannedTask.goalId ? plannedTask.goalId : plannedTask.routine.goalId;
        this.getGoal(plannedTask.uid, goalId!, (goal: GoalModel) => {
            goal.history.plannedTaskHistory = updatePlannedTaskHistory(goal.history.plannedTaskHistory, plannedTask);
            this.update(goal);
        });
    }

    private static createGoalFromData(uid: string, document: DocumentSnapshot<DocumentData>): GoalModel {
        let goal: GoalModel = document.data() as GoalModel;
        goal.id = document.id;

        if (!goal.history) {
            goal.history = EMPTY_HISTORY;
        }

        if (!goal.uid) {
            goal.uid = uid;
        }

        return goal;
    }
}

export default GoalController;
