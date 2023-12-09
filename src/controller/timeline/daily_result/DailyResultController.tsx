import { PLANNED_DAY_RESULT } from 'resources/endpoints';
import { Comment as CommentModel, Image, PlannedDay, PlannedDayResult } from 'resources/schema';
import {
    CreatePlannedDayResultRequest,
    CreatePlannedDayResultResponse,
    GetPlannedDayResultResponse,
    GetPlannedDayResultSummariesResponse,
    GetPlannedDayResultSummaryResponse,
    GetPlannedDayResultsResponse,
    UpdatePlannedDayResultRequest,
    UpdatePlannedDayResultResponse,
} from 'resources/types/requests/PlannedDayResultTypes';
import { Interactable } from 'resources/types/interactable/Interactable';
import axiosInstance from 'src/axios/axios';
import { LikeController } from 'src/controller/api/general/LikeController';
import ImageController from 'src/controller/image/ImageController';
import { CommentController } from 'src/controller/api/general/CommentController';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { PlannedDayResultSummary } from 'resources/types/planned_day_result/PlannedDayResult';

class DailyResultController {
    public static async getAllSummariesForUser(userId: number): Promise<PlannedDayResultSummary[]> {
        return await axiosInstance
            .get(`/user/${userId}/day-results`)
            .then((success) => {
                const response = success.data as GetPlannedDayResultSummariesResponse;
                return response.plannedDayResultSummaries ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

    public static async getAllViaApi(
        upperBound: Date,
        lowerBound: Date
    ): Promise<PlannedDayResult[]> {
        const upperBoundDate = new Date(upperBound).toISOString();
        const lowerBoundDate = new Date(lowerBound).toISOString();

        return await axiosInstance
            .get(`${PLANNED_DAY_RESULT}`, {
                params: {
                    upperBound: upperBoundDate,
                    lowerBound: lowerBoundDate,
                },
            })
            .then((success) => {
                const response = success.data as GetPlannedDayResultsResponse;
                return response.plannedDayResults ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

    public static async getViaApi(id: number): Promise<PlannedDayResult | undefined> {
        return this.get(id);
    }

    public static async getAllSummaries(
        upperBound: Date,
        lowerBound: Date
    ): Promise<PlannedDayResultSummary[]> {
        const upperBoundDate = new Date(upperBound).toISOString();
        const lowerBoundDate = new Date(lowerBound).toISOString();

        return await axiosInstance
            .get(`${PLANNED_DAY_RESULT}summaries`, {
                params: {
                    upperBound: upperBoundDate,
                    lowerBound: lowerBoundDate,
                },
            })
            .then((success) => {
                const response = success.data as GetPlannedDayResultSummariesResponse;
                return response.plannedDayResultSummaries ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

    public static async getSummary(
        plannedDayResultId: number
    ): Promise<PlannedDayResultSummary | undefined> {
        return await axiosInstance
            .get(`${PLANNED_DAY_RESULT}summary/${plannedDayResultId}`)
            .then((success) => {
                const response = success.data as GetPlannedDayResultSummaryResponse;
                return response.plannedDayResultSummary;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async get(id: number): Promise<PlannedDayResult | undefined> {
        return await axiosInstance
            .get(`${PLANNED_DAY_RESULT}${id}`)
            .then((success) => {
                const response = success.data as GetPlannedDayResultResponse;
                return response.plannedDayResult!;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getByPlannedDay(
        plannedDay: PlannedDay
    ): Promise<PlannedDayResult | undefined> {
        if (!plannedDay.dayKey) {
            return undefined;
        }

        const userId = await getUserIdFromToken();

        return await axiosInstance
            .get(`${PLANNED_DAY_RESULT}${userId}/${plannedDay.dayKey}`)
            .then((success) => {
                const response = success.data as GetPlannedDayResultResponse;
                return response.plannedDayResult;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async create(plannedDayId: number): Promise<PlannedDayResult | undefined> {
        const body: CreatePlannedDayResultRequest = {
            plannedDayId,
        };

        return await axiosInstance
            .post(`${PLANNED_DAY_RESULT}`, body)
            .then((success) => {
                const results = success.data as CreatePlannedDayResultResponse;
                return results.plannedDayResult;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getOrCreate(plannedDay: PlannedDay): Promise<PlannedDayResult | undefined> {
        let result = await this.getByPlannedDay(plannedDay);
        if (!result) {
            result = await this.create(plannedDay.id ?? 0);
        }

        return result;
    }

    public static async addPhotos(images: Image[], plannedDayResult: PlannedDayResult) {
        plannedDayResult.images = [...(plannedDayResult.images ?? []), ...images];
        return await this.updateViaApi(plannedDayResult);
    }

    public static async updateViaApi(
        plannedDayResult: PlannedDayResult
    ): Promise<PlannedDayResult | undefined> {
        const body: UpdatePlannedDayResultRequest = {
            plannedDayResult,
        };

        return await axiosInstance
            .patch(`${PLANNED_DAY_RESULT}`, body)
            .then((success) => {
                const results = success.data as UpdatePlannedDayResultResponse;
                return results.plannedDayResult;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async addLikeViaApi(id: number) {
        return await LikeController.add(Interactable.PLANNED_DAY_RESULT, id);
    }

    public static async addCommentViaApi(id: number, comment: string) {
        return await CommentController.add(Interactable.PLANNED_DAY_RESULT, id, comment);
    }

    public static async deleteCommentViaApi(comment: CommentModel) {
        return await CommentController.delete(Interactable.PLANNED_DAY_RESULT, comment);
    }

    public static async hideCreateRecommendation(dayKey: string) {
        return await axiosInstance
            .post(`/planned-day-result/${dayKey}/hide-recommendation`)
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

    public static async uploadImages(imageUploadProgess?: Function): Promise<string[]> {
        const imgUrls: string[] = await ImageController.pickAndUploadImages(
            'daily_results',
            imageUploadProgess
        );
        return imgUrls;
    }
}

export default DailyResultController;
