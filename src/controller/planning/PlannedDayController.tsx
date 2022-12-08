import { Timestamp } from 'firebase/firestore';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import PlannedDayDao from 'src/firebase/firestore/planning/PlannedDayDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { getDateFormatted, getDaysOld } from 'src/util/DateUtility';
import MigrationController from '../audit_log/MigrationController';
import { UserModel } from '../user/UserController';
import PlannedTaskController, { PlannedTaskModel } from './PlannedTaskController';

export interface PlannedDay {
    id?: string;
    uid: string;
    metadata?: PlannedDayMetadata;
    plannedTasks: PlannedTaskModel[];
}

export interface PlannedDayMetadata {
    added: Timestamp;
    modified: Timestamp;
    status: string;
    locked: boolean;
}

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

export const getKey = (dayOfMonth: number) => {
    const date = new Date();
    date.setDate(dayOfMonth);

    return getKeyFromDate(date);
};

export const getKeyFromDate = (date: Date) => {
    const dateString = getDateFormatted(date);
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
    let date = new Date();

    const day = parseInt(dayKey.substring(2, 4));
    const month = parseInt(dayKey.substring(0, 2)) - 1;
    const year = parseInt(dayKey.substring(4));

    date.setFullYear(year);
    date.setMonth(month);
    date.setDate(day);

    return date;
};

export const getDayKeyDaysOld = (dayKey: string) => {
    const then: any = getDateFromDayKey(dayKey);
    const now: any = new Date();

    return getDaysOld(then, now);
};

export const createPlannedDayModel = (id: string) => {
    const plannedDay: PlannedDay = {
        id: id,
        uid: getCurrentUid(),
        plannedTasks: [],
    };

    return plannedDay;
};

export const createMetadata = () => {
    const metadata: PlannedDayMetadata = {
        added: Timestamp.now(),
        status: 'INCOMPLETE',
        modified: Timestamp.now(),
        locked: true,
    };

    return metadata;
};

class PlannedDayController {
    public static async getOrCreate(user: UserModel, id: string) {
        const found = await this.get(user, id);
        if (found) {
            return found;
        }

        const created = await this.create(createPlannedDayModel(id));
        return created;
    }

    public static async get(user: UserModel, id: string) {
        console.log(user.feature_versions?.pillar);
        if (MigrationController.requiresPlannedTaskMigration(user)) {
            return await this.getDeprecated(user.uid, id);
        }

        return await this.getCurrent(id);
    }

    public static async create(plannedDay: PlannedDay) {
        plannedDay.metadata = createMetadata();
        const result = await PlannedDayDao.create(plannedDay);

        plannedDay.id = result.id;

        return plannedDay;
    }

    public static delete(id: string, callback: Function) {
        PlannedDayDao.delete(id, callback);
    }

    public static replace(plannedDay: PlannedDay) {
        plannedDay.metadata!.modified = Timestamp.now();
        PlannedDayDao.replace(plannedDay);
        this.refreshDailyResult(plannedDay);
    }

    public static async refreshDailyResult(plannedDay: PlannedDay) {
        if (!plannedDay.id) {
            return;
        }

        const dailyResult = await DailyResultController.getOrCreate(plannedDay, 'INCOMPLETE');
        if (dailyResult) {
            DailyResultController.refresh(dailyResult);
        }
    }

    public static getPlannedDayStatus = (plannedDay: PlannedDay, plannedTask: PlannedTaskModel): string => {
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

    private static async getCurrent(id: string) {
        console.log('get current');
        const result = await PlannedDayDao.get(id);
        const plannedDay: PlannedDay = result.data() as PlannedDay;
        plannedDay.id = id;

        const plannedTasks = await PlannedTaskController.getAllInPlannedDay(plannedDay);
        plannedDay.plannedTasks = plannedTasks;

        return plannedDay;
    }

    private static async getDeprecated(uid: string, id: string) {
        console.log('get deprecated');
        let plannedDay: PlannedDay = {
            id: id,
            uid: uid,
            metadata: createMetadata(),
            plannedTasks: [],
        };

        const response = await PlannedDayDao.getDeprecated(uid, id);
        response.docs.forEach((currentPlannedTask) => {
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

        plannedDay.plannedTasks.sort((a, b) =>
            (a.startMinute ? a.startMinute : a.routine.added) > (b.startMinute ? b.startMinute : b.routine.added) ? 1 : -1
        );

        return plannedDay;
    }
}

export default PlannedDayController;
