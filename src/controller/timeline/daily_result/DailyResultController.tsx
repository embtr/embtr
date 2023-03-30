import { getAuth } from 'firebase/auth';
import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { PLANNED_DAY_RESULT } from 'resources/endpoints';
import { Comment as CommentModel, PlannedDayResult as PlannedDayResultModel } from 'resources/schema';
import {
    CreatePlannedDayResultCommentRequest,
    GetPlannedDayResultResponse,
    GetPlannedDayResultsResponse,
    UpdatePlannedDayResultRequest,
} from 'resources/types/PlannedDayResultTypes';
import axiosInstance from 'src/axios/axios';
import ImageController from 'src/controller/image/ImageController';
import NotificationController, { NotificationType } from 'src/controller/notification/NotificationController';
import PlannedDayController, {
    getDayKeyDaysOld,
    getPlannedDayStatus,
    getPreviousDayKey,
    getTodayKey,
    PlannedDay,
} from 'src/controller/planning/PlannedDayController';
import { Comment, TimelinePostModel } from 'src/controller/timeline/TimelineController';
import { UserModel } from 'src/controller/user/UserController';
import DailyResultDao from 'src/firebase/firestore/daily_result/DailyResultDao';

export interface DailyResultModel extends TimelinePostModel {
    data: {
        status: string;
        dayKey: string;
        plannedDayId?: string | null;
        description?: string;
        hasTasks: boolean;
        imageUrls?: string[];
        completionDate?: Timestamp;
    };
}

export interface DayResultTimelinePost extends TimelinePostModel {
    data: {
        dayResult: PlannedDayResultModel;
    };
}

export interface PaginatedDailyResults {
    results: DailyResultModel[];
    lastDailyResult: QueryDocumentSnapshot | undefined | null;
}

class DailyResultController {
    public static async getAllViaApi(): Promise<PlannedDayResultModel[]> {
        return await axiosInstance
            .get(`${PLANNED_DAY_RESULT}`)
            .then((success) => {
                const response = success.data as GetPlannedDayResultsResponse;
                return response.plannedDayResults ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

    public static async getViaApi(id: number): Promise<PlannedDayResultModel> {
        return await axiosInstance
            .get(`${PLANNED_DAY_RESULT}${id}`)
            .then((success) => {
                const response = success.data as GetPlannedDayResultResponse;
                return response.plannedDayResult!;
            })
            .catch((error) => {
                return error.response.data as PlannedDayResultModel;
            });
    }

    public static async updateViaApi(plannedDayResult: PlannedDayResultModel) {
        const body: UpdatePlannedDayResultRequest = {
            plannedDayResult,
        };

        return await axiosInstance
            .patch(`${PLANNED_DAY_RESULT}`, body)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async addLikeViaApi(id: number) {
        return await axiosInstance
            .post(`${PLANNED_DAY_RESULT}${id}/like/`)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async addCommentViaApi(id: number, comment: string) {
        const request: CreatePlannedDayResultCommentRequest = {
            comment,
        };

        return await axiosInstance
            .post(`${PLANNED_DAY_RESULT}${id}/comment/`, request)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async deleteCommentViaApi(comment: CommentModel) {
        return await axiosInstance
            .delete(`${PLANNED_DAY_RESULT}/comment/${comment.id}`)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    /*
     * OLD LOGIC
     */

    public static clone(dailyResult: DailyResultModel): DailyResultModel {
        let clone: DailyResultModel = {
            data: {
                dayKey: dailyResult.data.dayKey,
                description: dailyResult.data.description,
                status: dailyResult.data.status,
                hasTasks: dailyResult.data.hasTasks,
                imageUrls: dailyResult.data.imageUrls,
                completionDate: dailyResult.data.completionDate,
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

    public static createDailyResultModel(plannedDay: PlannedDay): DailyResultModel {
        const uid = getAuth().currentUser!.uid;

        const dailyResult: DailyResultModel = {
            data: {
                status: getPlannedDayStatus(plannedDay),
                hasTasks: plannedDay.plannedTasks.length > 0,
                dayKey: plannedDay.dayKey,
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

    public static async getOrCreate(plannedDay: PlannedDay) {
        const uid = getAuth().currentUser!.uid;

        if (!plannedDay.dayKey) {
            return undefined;
        }

        const existing = await DailyResultController.getByDayKey(uid, plannedDay.dayKey);
        if (existing) {
            return existing;
        }

        const dailyResult: DailyResultModel = this.createDailyResultModel(plannedDay);
        const created = await this.create(dailyResult);
        return created;
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
        const dailyResult = this.getDailyResultFromData(result);

        callback(dailyResult);
    }

    public static async refresh(user: UserModel, dailyResult: DailyResultModel) {
        const plannedDay = await PlannedDayController.get(user, dailyResult.data.dayKey);
        if (!plannedDay || !plannedDay.id) {
            return;
        }

        if (plannedDay.metadata) {
            dailyResult.data.status = getPlannedDayStatus(plannedDay);
        }

        const completionDateIsSet = dailyResult.data.completionDate !== undefined;
        const shouldSetCompletionDate = !completionDateIsSet && dailyResult.data.status && ['FAILED', 'COMPLETE'].includes(dailyResult.data.status);
        if (shouldSetCompletionDate) {
            dailyResult.data.completionDate = Timestamp.now();
        }

        dailyResult.data.hasTasks = plannedDay.plannedTasks.length > 0;
        dailyResult.modified = Timestamp.now();
        dailyResult.active = true;

        this.update(dailyResult);
    }

    public static async getAll() {
        const results = await DailyResultDao.getAllForAllUsers();

        let dailyResults: DailyResultModel[] = [];
        for (const result of results.docs) {
            const dailyResult = DailyResultController.getDailyResultFromData(result);
            dailyResults.push(dailyResult);
        }

        return dailyResults;
    }

    public static async getAllFinished() {
        const results = await DailyResultDao.getAllFinished();

        let dailyResults: DailyResultModel[] = [];
        for (const result of results.docs) {
            const dailyResult = DailyResultController.getDailyResultFromData(result);

            if (!['FAILED', 'COMPLETE'].includes(dailyResult.data.status)) {
                const daysOld = getDayKeyDaysOld(dailyResult.data.dayKey);
                if (daysOld <= 0) {
                    continue;
                }
            }

            dailyResults.push(dailyResult);
        }

        return dailyResults;
    }

    public static async getPaginatedFinished(lastDailyResult: QueryDocumentSnapshot | undefined | null, cutoffDate: Date): Promise<PaginatedDailyResults> {
        return await this.getPaginatedFinishedForUser(undefined, lastDailyResult, cutoffDate);
    }

    public static async getPaginatedFinishedForUser(
        user: UserModel | undefined,
        lastDailyResult: QueryDocumentSnapshot | undefined | null,
        cutoffDate: Date
    ): Promise<PaginatedDailyResults> {
        if (lastDailyResult === null) {
            //disable prevention of looking in the past for now
            lastDailyResult = undefined;
            //return { results: [], lastDailyResult: null };
        }

        let results;
        if (user) {
            results = await DailyResultDao.getPaginatedFinishedForUser(user.uid, lastDailyResult, cutoffDate);
        } else {
            results = await DailyResultDao.getPaginatedFinished(lastDailyResult, cutoffDate);
        }

        let dailyResults: DailyResultModel[] = [];
        let foundLastDailyResult: QueryDocumentSnapshot | undefined = undefined;
        for (const result of results.docs) {
            foundLastDailyResult = result;
            const dailyResult = this.getDailyResultFromData(result);
            if (!dailyResult.active) {
                continue;
            }

            if (!['FAILED', 'COMPLETE'].includes(dailyResult.data.status)) {
                const daysOld = getDayKeyDaysOld(dailyResult.data.dayKey);
                if (daysOld <= 0) {
                    continue;
                }
            }

            dailyResults.push(dailyResult);
        }

        let paginatedDailyResults: PaginatedDailyResults = {
            results: dailyResults,
            lastDailyResult: foundLastDailyResult,
        };

        if (paginatedDailyResults.results.length === 0) {
            paginatedDailyResults.lastDailyResult = null;
        }

        return paginatedDailyResults;
    }

    public static async getAllFinishedForUser(uid: string) {
        const results = await DailyResultDao.getAllForUser(uid);

        let dailyResults: DailyResultModel[] = [];
        for (const result of results.docs) {
            const dailyResult = DailyResultController.getDailyResultFromData(result);
            if (!['FAILED', 'COMPLETE'].includes(dailyResult.data.status)) {
                const daysOld = getDayKeyDaysOld(dailyResult.data.dayKey);
                if (daysOld <= 0) {
                    continue;
                }
            }

            dailyResults.push(dailyResult);
        }

        return dailyResults;
    }

    public static async like(dailyResult: DailyResultModel, likerUid: string) {
        if (!dailyResult.id) {
            return;
        }

        await DailyResultDao.like(dailyResult, likerUid);
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

    public static async deleteComment(dailyResult: DailyResultModel, commentToDelete: Comment) {
        const comments: Comment[] = [];

        dailyResult.public.comments.forEach((comment) => {
            if (
                comment.uid === commentToDelete.uid &&
                comment.comment === comment.comment &&
                comment.timestamp.toString() === commentToDelete.timestamp.toString()
            ) {
                return;
            }

            comments.push(comment);
        });

        dailyResult.public.comments = comments;
        await this.update(dailyResult);
    }

    public static async uploadImages(imageUploadProgess?: Function): Promise<string[]> {
        const imgUrls: string[] = await ImageController.pickAndUploadImages('daily_results', imageUploadProgess);
        return imgUrls;
    }

    public static async getDailyResultHistory(uid: string) {
        const results = await DailyResultDao.getAllForUserWithLimit(uid, 30);

        let dailyResults: DailyResultModel[] = [];
        results.forEach((dailyResultData) => {
            const dailyResult = this.getDailyResultFromData(dailyResultData);
            dailyResults.push(dailyResult);
        });

        let dayKeyToResultMap: Map<string, DailyResultModel> = new Map<string, DailyResultModel>();
        dailyResults.forEach((dailyResult) => {
            dayKeyToResultMap.set(dailyResult.data.dayKey, dailyResult);
        });

        let successResults = [];
        let currentDayKey: string = getTodayKey();
        for (let i = 0; i < 30; i++) {
            currentDayKey = getPreviousDayKey(currentDayKey);
            let successResult = 'INVALID';
            if (dayKeyToResultMap.has(currentDayKey)) {
                const result = dayKeyToResultMap.get(currentDayKey);
                if (result?.data.hasTasks) {
                    successResult = result.data.status;
                }
            }
            //c.log(currentDayKey + ": " + successResult);
            successResults.unshift(successResult);
        }

        return successResults;
    }

    public static async getCachedDailyResultHistory() {}

    private static async getByDayKey(uid: string, dayKey: string) {
        const results = await DailyResultDao.getByDayKey(uid, dayKey);

        let dailyResult: DailyResultModel | undefined = undefined;
        if (!results.empty) {
            dailyResult = this.getDailyResultFromData(results.docs[0]);
        }

        return dailyResult;
    }

    private static getDailyResultFromData(result: DocumentSnapshot<DocumentData>): DailyResultModel {
        let dailyResult: DailyResultModel = result.data() as DailyResultModel;
        dailyResult.id = result.id;
        //if (true) {
        //    console.log('saving: ', dailyResult.id);
        //DailyResultController.update(dailyResult);
        //}

        return dailyResult;
    }
}

export default DailyResultController;
