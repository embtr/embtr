import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import ImageController from 'src/controller/image/ImageController';
import NotificationController, { NotificationType } from 'src/controller/notification/NotificationController';
import { getDayKeyDaysOld, PlannedDay } from 'src/controller/planning/PlannedDayController';
import { TimelinePostModel } from 'src/controller/timeline/TimelineController';
import DailyResultDao from 'src/firebase/firestore/daily_result/DailyResultDao';

export interface DailyResultModel extends TimelinePostModel {
    data: {
        status: string;
        plannedDayId: string;
        description?: string;
        imageUrls?: string[];
    };
}

class DailyResultController {
    public static clone(dailyResult: DailyResultModel): DailyResultModel {
        let clone: DailyResultModel = {
            data: {
                plannedDayId: dailyResult.data.plannedDayId,
                description: dailyResult.data.description,
                status: dailyResult.data.status,
                imageUrls: dailyResult.data.imageUrls,
            },
            added: dailyResult.added,
            modified: dailyResult.modified,
            active: dailyResult.active,
            id: dailyResult.id,
            uid: dailyResult.uid,
            type: dailyResult.type,
            public: {
                comments: dailyResult.public.comments,
                likes: dailyResult.public.likes,
            },
        };

        return clone;
    }

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
            active: true,
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

    public static async delete(dailyResult: DailyResultModel) {
        dailyResult.active = false;
        this.update(dailyResult);
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
                const daysOld = getDayKeyDaysOld(dailyResult.data.plannedDayId);
                if (daysOld <= 0) {
                    return;
                }
            }

            dailyResult.id = doc.id;
            dailyResults.push(dailyResult);
        });

        return dailyResults;
    }

    public static async getAllFinishedForUser(uid: string) {
        const result = await DailyResultDao.getAllForUser(uid);

        let dailyResults: DailyResultModel[] = [];
        result.forEach((doc) => {
            let dailyResult = doc.data() as DailyResultModel;
            if (!['FAILED', 'COMPLETE'].includes(dailyResult.data.status)) {
                const daysOld = getDayKeyDaysOld(dailyResult.data.plannedDayId);
                if (daysOld <= 0) {
                    return;
                }
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

    public static addComment(id: string, uid: string, commentText: string, callback: Function) {
        DailyResultDao.addComment(id, uid, commentText).then(() => {
            callback();
        });
    }

    public static async uploadImages(imageUploadProgess?: Function): Promise<string[]> {
        const imgUrls: string[] = await ImageController.pickAndUploadImages('daily_results', imageUploadProgess);
        return imgUrls;
    }
}

export default DailyResultController;
