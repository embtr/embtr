import { PLANNED_DAY_RESULT } from 'resources/endpoints';
import {
    Comment as CommentModel,
    PlannedDayResult as PlannedDayResultModel,
} from 'resources/schema';
import {
    GetPlannedDayResultResponse,
    GetPlannedDayResultsResponse,
    UpdatePlannedDayResultRequest,
} from 'resources/types/requests/PlannedDayResultTypes';
import { Interactable } from 'resources/types/interactable/Interactable';
import axiosInstance from 'src/axios/axios';
import { LikeController } from 'src/controller/api/general/LikeController';
import ImageController from 'src/controller/image/ImageController';
import { CommentController } from 'src/controller/api/general/CommentController';
import { Timestamp } from 'firebase/firestore';
import { TimelinePostModel } from 'src/model/OldModels';

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

class DailyResultController {
    public static async getAllForUser(userId: number): Promise<PlannedDayResultModel[]> {
        return await axiosInstance
            .get(`/user/${userId}/day-results`)
            .then((success) => {
                const response = success.data as GetPlannedDayResultsResponse;
                return response.plannedDayResults ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

    public static async getAllViaApi(
        upperBound: Date,
        lowerBound: Date
    ): Promise<PlannedDayResultModel[]> {
        const upperBoundDate = new Date(upperBound).toISOString();
        const lowerBoundDate = new Date(lowerBound).toISOString();

        const middleTime = new Date().getTime();
        console.log('middleTime', middleTime);

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

    public static async getViaApi(id: number): Promise<PlannedDayResultModel | undefined> {
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
        return await LikeController.add(Interactable.PLANNED_DAY_RESULT, id);
    }

    public static async addCommentViaApi(id: number, comment: string) {
        return await CommentController.add(Interactable.PLANNED_DAY_RESULT, id, comment);
    }

    public static async deleteCommentViaApi(comment: CommentModel) {
        return await CommentController.delete(Interactable.PLANNED_DAY_RESULT, comment);
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
