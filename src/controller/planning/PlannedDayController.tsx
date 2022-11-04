import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { TaskModel } from 'src/controller/planning/TaskController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import PlannedDayDao from 'src/firebase/firestore/planning/PlannedDayDao';
import { getDaysOld } from 'src/util/GeneralUtility';
import LevelController from '../level/LevelController';

export interface PlannedDay {
    id?: string;
    metadata?: PlannedDayMetadata;
    plannedTasks: PlannedTaskModel[];
}

export interface PlannedTaskModel {
    id?: string;
    routine: TaskModel;
    status?: string;
    startMinute?: number;
    duration?: number;
    dayKey?: string;
}

export interface PlannedDayMetadata {
    added: Timestamp;
    modified: Timestamp;
    status: string;
    locked: boolean;
}

export const clonePlannedTaskModel = (plannedTask: PlannedTaskModel) => {
    const clonedPlannedTask: PlannedTaskModel = {
        id: plannedTask.id,
        routine: plannedTask.routine,
        status: plannedTask.status,
        startMinute: plannedTask.startMinute,
        duration: plannedTask.duration,
        dayKey: plannedTask.dayKey,
    };

    return clonedPlannedTask;
};

export const plannedDayIsComplete = (plannedDay: PlannedDay): boolean => {
    return plannedDay.metadata?.status === 'COMPLETE';
};

export const plannedDayIsFailed = (plannedDay: PlannedDay): boolean => {
    return plannedDay.metadata?.status === 'FAILED';
};

export const plannedDayIsIncomplete = (plannedDay: PlannedDay): boolean => {
    return !plannedDayIsComplete(plannedDay) && !plannedDayIsFailed(plannedDay);
};

export const plannedTaskIsComplete = (plannedTask: PlannedTaskModel): boolean => {
    return plannedTask.status === 'COMPLETE';
};

export const plannedTaskIsFailed = (plannedTask: PlannedTaskModel): boolean => {
    return plannedTask.status === 'FAILED';
};

export const plannedTaskIsIncomplete = (plannedTask: PlannedTaskModel): boolean => {
    return !plannedTaskIsComplete(plannedTask) && !plannedTaskIsFailed(plannedTask);
};

export const createPlannedTaskByPlannedTask = (plannedTask: PlannedTaskModel, startMinute: number, duration: number) => {
    const newPlannedTask: PlannedTaskModel = {
        ...plannedTask,
    };
    newPlannedTask.startMinute = startMinute;
    newPlannedTask.duration = duration;

    return newPlannedTask;
};

export const createPlannedTask = (task: TaskModel, startMinute: number, duration: number) => {
    const plannedTask: PlannedTaskModel = {
        routine: task,
        startMinute: startMinute,
        duration: duration,
    };

    return plannedTask;
};

export const getKey = (dayOfMonth: number) => {
    const date = new Date();
    date.setDate(dayOfMonth);

    return getKeyFromDate(date);
};

export const getKeyFromDate = (date: Date) => {
    const dateString = date.toISOString();
    let month = dateString.split('-')[1];
    let day = dateString.split('-')[2].substring(0, 2);
    let year = dateString.split('-')[0];
    return month + day + year;
};

export const getDayKey = (day: number) => {
    return getKey(day);
};

export const getTodayKey = () => {
    return getKey(new Date().getDate());
};

export const getPreviousDayKey = (dayKey: string) => {
    const date = getDateFromDayKey(dayKey);

    const yesterday = date;
    yesterday.setDate(date.getDate() - 1);

    const result = getKeyFromDate(yesterday);
    return result;
};

export const getTomorrowKey = () => {
    return getKey(new Date().getDate() + 1);
};

export const getDayFromDayKey = (dayKey: string) => {
    return parseInt(dayKey.substring(2, 4));
};

export const getDateFromDayKey = (dayKey: string) => {
    const day = dayKey.substring(2, 4);
    const month = dayKey.substring(0, 2);
    const year = dayKey.substring(4);
    const dateStr = year + '-' + month + '-' + day;

    let date = new Date(dateStr);
    return date;
};

export const getDayKeyDaysOld = (dayKey: string) => {
    const then: any = getDateFromDayKey(dayKey);
    const now: any = new Date();

    return getDaysOld(then, now);
};

class PlannedDayController {
    public static getOrCreate(id: string, callback: Function) {
        let plannedDay: PlannedDay = {
            id: id,
            metadata: this.createMetadata(),
            plannedTasks: [],
        };

        const response = PlannedDayDao.get(getAuth().currentUser?.uid!, id);
        response
            .then((collection) => {
                if (collection?.empty) {
                    this.create(plannedDay, callback);
                } else {
                    collection?.forEach((currentPlannedTask) => {
                        if (currentPlannedTask.id === 'metadata') {
                            plannedDay.metadata = currentPlannedTask.data() as PlannedDayMetadata;
                        } else {
                            let plannedTask: PlannedTaskModel = currentPlannedTask.data() as PlannedTaskModel;
                            plannedTask.id = currentPlannedTask.id;
                            plannedTask.dayKey = id;
                            plannedDay.plannedTasks.push(plannedTask);
                        }
                    });
                }
            })
            .then(() => {
                plannedDay.plannedTasks.sort((a, b) =>
                    (a.startMinute ? a.startMinute : a.routine.added) > (b.startMinute ? b.startMinute : b.routine.added) ? 1 : -1
                );
                callback(plannedDay);
            });
    }

    public static getAsync(uid: string, id: string): Promise<PlannedDay> {
        let promise = new Promise<PlannedDay>(function (resolve, reject) {
            PlannedDayController.get(uid, id, resolve);
        });

        return promise;
    }

    public static get(uid: string, id: string, callback: Function) {
        let plannedDay: PlannedDay = {
            id: id,
            metadata: this.createMetadata(),
            plannedTasks: [],
        };

        const response = PlannedDayDao.get(uid, id);
        response
            .then((collection) => {
                collection?.forEach((currentPlannedTask) => {
                    if (currentPlannedTask.id === 'metadata') {
                        plannedDay.metadata = currentPlannedTask.data() as PlannedDayMetadata;
                    } else {
                        let plannedTask: PlannedTaskModel = currentPlannedTask.data() as PlannedTaskModel;
                        if (plannedTask.status === 'DELETED') {
                            return;
                        }

                        plannedTask.id = currentPlannedTask.id;
                        plannedTask.dayKey = id;
                        plannedDay.plannedTasks.push(plannedTask);
                    }
                });
            })
            .then(() => {
                plannedDay.plannedTasks.sort((a, b) =>
                    (a.startMinute ? a.startMinute : a.routine.added) > (b.startMinute ? b.startMinute : b.routine.added) ? 1 : -1
                );
                callback(plannedDay);
            });
    }

    public static delete(id: string, callback: Function) {
        PlannedDayDao.delete(id, callback);
    }

    public static create(plannedDay: PlannedDay, callback: Function) {
        plannedDay.metadata = this.createMetadata();
        PlannedDayDao.create(plannedDay);

        callback(plannedDay);
    }

    public static replace(plannedDay: PlannedDay) {
        plannedDay.metadata!.modified = Timestamp.now();
        PlannedDayDao.replace(plannedDay);
        this.refreshDailyResult(plannedDay);
    }

    public static getTask(uid: string, dayKey: string, plannedTaskId: string, callback: Function) {
        this.get(uid, dayKey, (plannedDay: PlannedDay) => {
            plannedDay.plannedTasks.forEach((plannedTask) => {
                if (plannedTask.id === plannedTaskId) {
                    callback(plannedTask);
                }
            });
        });
    }

    public static async updateTask(plannedDay: PlannedDay, plannedTask: PlannedTaskModel, callback: Function) {
        plannedDay.metadata!.modified = Timestamp.now();
        if (!plannedDay.metadata) {
            plannedDay.metadata = this.createMetadata();
        }

        plannedDay.metadata!.status = this.getPlannedDayStatus(plannedDay, plannedTask);

        await PlannedDayDao.updateTask(plannedDay, plannedTask);
        this.refreshDailyResult(plannedDay);
        await LevelController.handlePlannedDayStatusChange(plannedDay);

        callback();
    }

    public static async addTask(plannedDay: PlannedDay, plannedTask: PlannedTaskModel, callback: Function) {
        await this.addTasks(plannedDay, [plannedTask]);
        callback();
    }

    public static async addTasks(plannedDay: PlannedDay, plannedTasks: PlannedTaskModel[]) {
        plannedDay.metadata!.modified = Timestamp.now();
        plannedDay.metadata!.status = 'INCOMPLETE';
        const createdPlannedTasks = await PlannedDayDao.createTasks(plannedDay, plannedTasks);

        this.refreshDailyResult(plannedDay);

        return createdPlannedTasks;
    }

    private static async refreshDailyResult(plannedDay: PlannedDay) {
        if (!plannedDay.id) {
            return;
        }

        const dailyResult = await DailyResultController.getOrCreate(plannedDay, 'INCOMPLETE');
        if (dailyResult) {
            DailyResultController.refresh(dailyResult);
        }
    }

    private static createMetadata(): PlannedDayMetadata {
        const metadata: PlannedDayMetadata = {
            added: Timestamp.now(),
            status: 'INCOMPLETE',
            modified: Timestamp.now(),
            locked: true,
        };

        return metadata;
    }

    private static getPlannedDayStatus = (plannedDay: PlannedDay, plannedTask: PlannedTaskModel): string => {
        let status = 'COMPLETE';
        plannedDay.plannedTasks.forEach((currentPlannedTask) => {
            let taskStatus = currentPlannedTask.status;
            if (plannedTask.id === currentPlannedTask.id) {
                if (plannedTask.status === 'DELETED') {
                    return;
                }

                taskStatus = plannedTask.status;
            }

            if (currentPlannedTask.status === 'DELETED') {
                return;
            }

            if (taskStatus !== 'COMPLETE') {
                if (taskStatus === 'FAILED') {
                    status = 'FAILED';
                    return;
                }

                status = 'INCOMPLETE';
            }
        });

        return status;
    };
}

export default PlannedDayController;
