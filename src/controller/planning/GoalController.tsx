import { differenceInDays } from 'date-fns';
import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import GoalDao from 'src/firebase/firestore/planning/GoalDao';
import { Comment, Like } from 'src/controller/timeline/TimelineController';

export interface GoalModel {
    id?: string;
    uid: string;
    added: Timestamp;
    name: string;
    description: string;
    pillarId?: string;
    deadline: Timestamp;
    status: string;
    public: {
        comments: Comment[];
        likes: Like[];
    };
}

export const FAKE_GOAL: GoalModel = {
    uid: '',
    added: Timestamp.now(),
    name: '',
    description: '',
    deadline: Timestamp.now(),
    status: 'ACTIVE',
    public: {
        comments: [],
        likes: [],
    },
};

const ARCHIVED = 'ARCHIVED';

export const getProgressPercent = (goal: GoalModel) => {
    const totalDays = differenceInDays(goal.deadline.toDate(), goal.added.toDate());
    const daysRemaining = differenceInDays(goal.deadline.toDate(), new Date());
    const daysPassed = totalDays - daysRemaining;
    const daysRemainingPercent = Math.min(100, Math.floor((daysPassed / totalDays) * 100));

    return daysRemainingPercent;
};

class GoalController {
    public static clone(goal: GoalModel) {
        const clone: GoalModel = {
            uid: goal.uid,
            added: goal.added,
            name: goal.name,
            description: goal.description,
            deadline: goal.deadline,
            status: goal.status,
            public: {
                comments: goal.public.comments,
                likes: goal.public.likes,
            },
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

    public static async getGoalsAsync(uid: string) {
        const results = await GoalDao.getGoals(uid);

        const goals: GoalModel[] = [];
        results.docs.forEach((doc) => {
            const goal = this.createGoalFromData(uid, doc);
            goals.push(goal);
        });

        return goals;
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

    public static async addLike(goal: GoalModel, likerUid: string) {
        const clone = this.clone(goal);

        const likeObject: Like = { uid: likerUid, added: Timestamp.now() };
        clone.public.likes.push(likeObject);

        await this.update(clone);
    }

    public static async addComment(uid: string, goal: GoalModel, comment: string) {
        const clone = this.clone(goal);

        const commentObject: Comment = { uid: uid, comment: comment, timestamp: Timestamp.now() };
        clone.public.comments.push(commentObject);

        await this.update(clone);
    }

    public static async deleteComment(goal: GoalModel, commentToDelete: Comment) {
        const comments: Comment[] = [];

        goal.public.comments.forEach((comment) => {
            if (
                comment.uid === commentToDelete.uid &&
                comment.comment === comment.comment &&
                comment.timestamp.toString() === commentToDelete.timestamp.toString()
            ) {
                return;
            }

            comments.push(comment);
        });

        goal.public.comments = comments;
        await this.update(goal);
    }

    private static createGoalFromData(uid: string, document: DocumentSnapshot<DocumentData>): GoalModel {
        let goal: GoalModel = document.data() as GoalModel;
        goal.id = document.id;

        if (!goal.uid) {
            goal.uid = uid;
        }

        if (!goal.public) {
            goal.public = {
                likes: [],
                comments: [],
            };
        }

        return goal;
    }
}

export default GoalController;
