import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import GoalDao from 'src/firebase/firestore/planning/GoalDao';
import { PlannedTaskModel } from './PlannedTaskController';

export interface GoalModel {
    id?: string;
    added: Timestamp;
    name: string;
    description: string;
    pillarId?: string;
    deadline: Timestamp;
    status: string;
    tasks: PlannedTaskModel[];
}

export const FAKE_GOAL: GoalModel = {
    added: Timestamp.now(),
    name: '',
    description: '',
    deadline: Timestamp.now(),
    status: 'ACTIVE',
    tasks: [],
};

export const getCompletedTasksFromGoal = (goal: GoalModel): PlannedTaskModel[] => {
    let completedTasks: PlannedTaskModel[] = [];

    goal.tasks.forEach((plannedTask: PlannedTaskModel) => {
        if (plannedTask.status === 'COMPLETE') {
            completedTasks.push(plannedTask);
        }
    });

    return completedTasks;
};

class GoalController {
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
                    const goal = this.createGoalFromData(document);

                    if (goal.status === 'ARCHIVED') {
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

    public static getGoal(userId: string, id: string, callback: Function) {
        const result = GoalDao.getGoal(userId, id);
        result
            .then((document) => {
                const goal = this.createGoalFromData(document);
                callback(goal);
            })
            .catch(() => {
                callback(undefined);
            });
    }

    public static archiveGoal(userId: string, goal: GoalModel, callback: Function) {
        const result = GoalDao.archiveGoal(userId, goal);
        result.then((updatedGoal) => {
            callback(updatedGoal);
        });
    }

    private static createGoalFromData(document: DocumentSnapshot<DocumentData>): GoalModel {
        let goal: GoalModel = document.data() as GoalModel;
        goal.id = document.id;

        if (!goal.tasks) {
            goal.tasks = [];
        }

        return goal;
    }
}

export default GoalController;
