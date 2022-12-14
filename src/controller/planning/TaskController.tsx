import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import TaskDao from 'src/firebase/firestore/planning/TaskDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { getDateFromDayKey, plannedTaskIsComplete, plannedTaskIsFailed } from './PlannedDayController';
import { PlannedTaskModel } from './PlannedTaskController';

export interface HabitHistoryElementModel {
    dayKey: string;
    id: string;
    name: string;
    status: string;
}

export interface TaskModel {
    id?: string;
    uid: string;
    added: Timestamp;
    name: string;
    description: string;
    goalId?: string;
    active: boolean;
    history?: {
        incomplete: HabitHistoryElementModel[];
        complete: HabitHistoryElementModel[];
        failed: HabitHistoryElementModel[];
    };
}

export const EMPTY_HABIT: TaskModel = {
    uid: "",
    added: Timestamp.now(),
    name: '',
    description: '',
    active: true,
};

export const getDayOfWeekFromDayKey = (dayKey: string) => {
    const date = getDateFromDayKey(dayKey);
    const dayOfWeek = getDayOfWeek(date);
    return dayOfWeek;
};

export const getDayOfWeek = (date: Date) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const dayNumber = date.getDay();
    const dayOfWeek = days[dayNumber];
    return dayOfWeek;
};

export const startMinuteToString = (startMinute: number) => {
    const hours = Math.floor(startMinute / 60);
    const minutes = startMinute % 60;

    const hoursString = '' + (hours <= 12 ? hours : hours - 12);
    const minutesString = (minutes < 10 ? '0' : '') + minutes;
    const AMPMString = hours <= 12 ? 'AM' : 'PM';

    return '' + hoursString + ':' + minutesString + ' ' + AMPMString;
};

export const durationToString = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    let minutesString: string = minutes.toString();
    if (minutesString.length == 1) {
        minutesString = '0' + minutesString;
    }

    let value = '';
    if (hours > 0) {
        value += hours + ':';
    }
    value += minutesString + ':';
    value += '00';

    return value;
};

export const createTaskModel = (name: string, description: string, goalId?: string) => {
    const task: TaskModel = {
        uid: getCurrentUid(),
        added: Timestamp.now(),
        name: name,
        description: description,
        active: true,
        history: { incomplete: [], complete: [], failed: [] },
    };

    if (goalId) {
        task.goalId = goalId;
    }

    return task;
};

class TaskController {
    public static clone(task: TaskModel) {
        const clone: TaskModel = {
            id: task.id,
            uid: task.uid,
            added: task.added,
            name: task.name,
            description: task.description,
            goalId: task.goalId,
            active: task.active,
            history: task.history,
        };

        if (task.id) {
            clone.id = task.id;
        }

        if (!clone.history) {
            clone.history = { incomplete: [], complete: [], failed: [] };
        }

        return clone;
    }

    public static createTask(task: TaskModel, callback: Function) {
        const result = TaskDao.createTask(task);
        result.then(() => {
            callback();
        });
    }

    public static async update(task: TaskModel) {
        await TaskDao.update(task);
    }

    public static async archiveTask(task: TaskModel, callback: Function) {
        task.active = false;
        await TaskDao.update(task);
        callback();
    }

    public static getHabit(id: string, callback: Function) {
        const uid = getCurrentUid();
        const result = TaskDao.getTask(uid, id);
        result
            .then((document) => {
                const task = this.getTaskFromData(document);
                callback(task);
            })
            .catch(() => {
                callback(undefined);
            });
    }

    public static async updateHistory(plannedTask: PlannedTaskModel) {
        if (!plannedTask.id || !plannedTask.dayKey || !plannedTask.routine.id) {
            return;
        }

        const habitId: string = plannedTask.routine.id;
        const plannedTaskId: string = plannedTask.id;

        const habitHistoryElement: HabitHistoryElementModel = {
            dayKey: plannedTask.dayKey,
            id: plannedTaskId,
            name: plannedTask.routine.name,
            status: plannedTask.status ? plannedTask.status : 'INCOMPLETE',
        };

        this.getHabit(habitId, (habit: TaskModel) => {
            if (!habit.history) {
                habit.history = { incomplete: [], complete: [], failed: [] };
            }

            habit.history.incomplete = this.removeElementFromArray(habit.history.incomplete, habitHistoryElement);
            habit.history.complete = this.removeElementFromArray(habit.history.complete, habitHistoryElement);
            habit.history.failed = this.removeElementFromArray(habit.history.failed, habitHistoryElement);

            if (plannedTaskIsComplete(plannedTask)) {
                habit.history.complete.push(habitHistoryElement);
            } else if (plannedTaskIsFailed(plannedTask)) {
                habit.history.failed.push(habitHistoryElement);
            } else {
                habit.history.incomplete.push(habitHistoryElement);
            }

            this.update(habit);
        });
    }

    private static getTaskFromData(data: DocumentSnapshot<DocumentData>): TaskModel {
        let task: TaskModel = data.data() as TaskModel;
        task.id = data.id;

        if (!task.active) {
            task.active = true;
        }

        return task;
    }

    static getTasks(uid: string, callback: Function) {
        const result = TaskDao.getTasks(uid);

        let tasks: TaskModel[] = [];
        result
            .then((documents) => {
                documents.docs.forEach((document) => {
                    let task: TaskModel = document.data() as TaskModel;

                    if (task.active === false) {
                        return;
                    }

                    task.id = document.id;
                    tasks.push(task);
                });
            })
            .then(() => {
                tasks.sort((a, b) => (a.name > b.name ? 1 : -1)).reverse();
                callback(tasks);
            })
            .catch(() => {
                callback([]);
            });
    }

    private static removeElementFromArray(list: HabitHistoryElementModel[], element: HabitHistoryElementModel) {
        const newList: HabitHistoryElementModel[] = [];
        list.forEach((l) => {
            if (l.id === element.id) {
                return;
            }
            newList.push(l);
        });

        return newList;
    }
}

export default TaskController;
