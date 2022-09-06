import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import NotificationController, { NotificationType } from 'src/controller/notification/NotificationController';
import PlannedDayController, { PlannedDay, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { TimelinePostModel } from 'src/controller/timeline/TimelineController';
import DailyResultDao from 'src/firebase/firestore/daily_result/DailyResultDao';

export interface DailyResultModel extends TimelinePostModel {
    data: {
        day: string;
        status: string;
        plannedDayId: string;
    };
}

class DailyResultController {
    public static async getOrCreate(plannedDay: PlannedDay, status: string) {
        const uid = getAuth().currentUser!.uid;

        if (plannedDay.id) {
            const existing = await DailyResultController.getByDayKey(uid, plannedDay.id);

            if (existing) {
                return existing;
            } else {
                const dailyResult: DailyResultModel = DailyResultController.createDailyResultModel(plannedDay, status);
                const created = await DailyResultController.create(dailyResult);
                return created;
            }
        }
    }

    public static createDailyResultModel(plannedDay: PlannedDay, status: string): DailyResultModel {
        const uid = getAuth().currentUser!.uid;

        const dailyResult: DailyResultModel = {
            data: {
                day: plannedDay.id!,
                status: status,
                plannedDayId: plannedDay.id!,
            },
            added: Timestamp.now(),
            modified: Timestamp.now(),
            type: 'DAILY_RESULT',
            uid: uid,
            public: {
                comments: [],
                likes: [],
            },
        };

        return dailyResult;
    }

    public static async create(dailyResult: DailyResultModel) {
        const result = await DailyResultDao.create(dailyResult);
        dailyResult.id = result?.id;

        return dailyResult;
    }

    public static async update(dailyResult: DailyResultModel) {
        const result = await DailyResultDao.update(dailyResult);
        return dailyResult;
    }

    public static async get(id: string, callback: Function) {
        const result = await DailyResultDao.get(id);

        let dailyResult: DailyResultModel = result.data() as DailyResultModel; 
        dailyResult.id = id;
        
        callback(dailyResult);
    }

    private static async getByDayKey(uid: string, dayKey: string) {
        const result = await DailyResultDao.getByDayKey(uid, dayKey);

        let dailyResult: DailyResultModel | undefined = undefined;
        result.forEach((doc) => {
            dailyResult = doc.data() as DailyResultModel;
            dailyResult.id = doc.id;
            return;
        });

        return dailyResult;
    }

    public static async getAllFinished() {
        const result = await DailyResultDao.getAll();

        let dailyResults: DailyResultModel[] = [];
        result.forEach((doc) => {
            let dailyResult = doc.data() as DailyResultModel;
            if (!['FAILED', 'COMPLETE'].includes(dailyResult.data.status)) {
                return;
            }

            dailyResult.id = doc.id;
            dailyResults.push(dailyResult);
        });

        return dailyResults;
    }

    public static like(dailyResult: DailyResultModel, likerUid: string) {
        if (!dailyResult.id) {
            return;
        }

        DailyResultDao.like(dailyResult, likerUid);
        NotificationController.addNotification(
            likerUid,
            dailyResult.uid,
            dailyResult.data.status === 'COMPLETE' ? NotificationType.COMPLETED_DAILY_RESULT_LIKE : NotificationType.FAILED_DAILY_RESULT_LIKE,
            dailyResult.id
        );
    }
}

export default DailyResultController;
