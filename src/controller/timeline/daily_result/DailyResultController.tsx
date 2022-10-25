import { getAuth } from 'firebase/auth';
import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import ImageController from 'src/controller/image/ImageController';
import NotificationController, { NotificationType } from 'src/controller/notification/NotificationController';
import PlannedDayController, { getDayKeyDaysOld, PlannedDay } from 'src/controller/planning/PlannedDayController';
import { TimelinePostModel } from 'src/controller/timeline/TimelineController';
import DailyResultDao from 'src/firebase/firestore/daily_result/DailyResultDao';

export interface DailyResultModel extends TimelinePostModel {
    data: {
        status: string;
        plannedDayId: string;
        description?: string;
        hasTasks: boolean;
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
                hasTasks: dailyResult.data.hasTasks,
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

    public static createDailyResultModel(plannedDay: PlannedDay, status: string): DailyResultModel {
        const uid = getAuth().currentUser!.uid;

        const dailyResult: DailyResultModel = {
            data: {
                status: status,
                hasTasks: plannedDay.plannedTasks.length > 0,
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

    public static async create(dailyResult: DailyResultModel) {
        const result = await DailyResultDao.create(dailyResult);
        dailyResult.id = result?.id;

        return dailyResult;
    }

    public static async update(dailyResult: DailyResultModel) {
        await DailyResultDao.update(dailyResult);
        return dailyResult;
    }

    public static async delete(dailyResult: DailyResultModel) {
        dailyResult.active = false;
        this.update(dailyResult);
    }

    public static async get(id: string, callback: Function) {
        const result = await DailyResultDao.get(id);
        const dailyResult = await this.getDailyResultFromData(result);

        callback(dailyResult);
    }

    public static async refresh(dailyResult: DailyResultModel) {
        const plannedDay: PlannedDay = await PlannedDayController.getAsync(dailyResult.uid, dailyResult.data.plannedDayId);
        if (!plannedDay.id) {
            return;
        }

        if (plannedDay.metadata) {
            dailyResult.data.status = plannedDay.metadata?.status;
        }
        dailyResult.data.hasTasks = plannedDay.plannedTasks.length > 0;
        dailyResult.modified = Timestamp.now();
        dailyResult.active = true;

        this.update(dailyResult);
    }

    public static async getAllFinished() {
        const results = await DailyResultDao.getAllFinished();

        let dailyResults: DailyResultModel[] = [];
        for (const result of results.docs) {
            const dailyResult = await DailyResultController.getDailyResultFromData(result);

            if (!['FAILED', 'COMPLETE'].includes(dailyResult.data.status)) {
                const daysOld = getDayKeyDaysOld(dailyResult.data.plannedDayId);
                if (daysOld <= 0) {
                    continue;
                }
            }

            dailyResults.push(dailyResult);
        }

        return dailyResults;
    }

    public static async getAllFinishedForUser(uid: string) {
        const results = await DailyResultDao.getAllForUser(uid);

        let dailyResults: DailyResultModel[] = [];
        for (const result of results.docs) {
            const dailyResult = await DailyResultController.getDailyResultFromData(result);
            if (!['FAILED', 'COMPLETE'].includes(dailyResult.data.status)) {
                const daysOld = getDayKeyDaysOld(dailyResult.data.plannedDayId);
                if (daysOld <= 0) {
                    continue;
                }
            }

            dailyResults.push(dailyResult);
        }

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

    private static async getByDayKey(uid: string, dayKey: string) {
        const results = await DailyResultDao.getByDayKey(uid, dayKey);

        let dailyResult: DailyResultModel | undefined = undefined;
        dailyResult = await this.getDailyResultFromData(results.docs[0]);

        return dailyResult;
    }

    private static async getDailyResultFromData(result: DocumentSnapshot<DocumentData>): Promise<DailyResultModel> {
        let dailyResult: DailyResultModel = result.data() as DailyResultModel;
        dailyResult.id = result.id;
        //if (true) {
        //    const plannedDay: PlannedDay = await PlannedDayController.getAsync(dailyResult.uid, dailyResult.data.plannedDayId);
        //    dailyResult.data.hasTasks = plannedDay.plannedTasks.length > 0;
        //    DailyResultController.update(dailyResult);
        //}

        return dailyResult;
    }
}

export default DailyResultController;
