import { PLANNED_DAY_RESULT } from 'resources/endpoints';
import { Comment, Image, PlannedDay, PlannedDayResult } from 'resources/schema';
import {
    CreatePlannedDayResultRequest,
    CreatePlannedDayResultResponse,
    GetPlannedDayResultResponse,
    GetPlannedDayResultSummariesResponse,
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
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { GetBooleanResponse } from 'resources/types/requests/GeneralTypes';

class DailyResultController {
    public static readonly UPLOAD_BUCKET = 'daily_results';

    public static async getAllSummariesForUser(userId: number): Promise<PlannedDayResultSummary[]> {
        try {
            const results = await axiosInstance.get<GetPlannedDayResultSummariesResponse>(
                `/user/${userId}/day-results`
            );
            const response: GetPlannedDayResultSummariesResponse = results.data;
            return response.plannedDayResultSummaries ?? [];
        } catch (error) {
            return [];
        }
    }

    public static async getViaApi(id: number): Promise<PlannedDayResult | undefined> {
        return this.get(id);
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

    public static async getByDayKey(dayKey: string): Promise<PlannedDayResult | undefined> {
        const userId = await getUserIdFromToken();

        return await axiosInstance
            .get(`${PLANNED_DAY_RESULT}${userId}/${dayKey}`)
            .then((success) => {
                const response = success.data as GetPlannedDayResultResponse;
                return response.plannedDayResult;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async create(
        plannedDayResult: PlannedDayResult
    ): Promise<PlannedDayResult | undefined> {
        const request: CreatePlannedDayResultRequest = { plannedDayResult };

        return await axiosInstance
            .post<CreatePlannedDayResultResponse>(`${PLANNED_DAY_RESULT}`, request)
            .then((response) => {
                return response.data.plannedDayResult;
            })
            .catch((error) => {
                return undefined;
            });
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

    public static async addCommentViaApi(
        id: number,
        comment: string
    ): Promise<Comment | undefined> {
        const result = await CommentController.add(Interactable.PLANNED_DAY_RESULT, id, comment);
        return result;
    }

    public static async deleteCommentViaApi(comment: Comment) {
        return await CommentController.delete(Interactable.PLANNED_DAY_RESULT, comment);
    }

    public static async existsByDayKey(dayKey: string): Promise<boolean> {
        const userId = await getUserIdFromToken();

        return await axiosInstance
            .get<GetBooleanResponse>(`planned-day-result/${userId}/${dayKey}/exists`)
            .then((success) => {
                return success.data.result === true;
            })
            .catch((error) => {
                return false;
            });
    }

    /*
     * OLD LOGIC
     */

    public static async uploadImages(imageUploadProgess?: Function): Promise<string[]> {
        const imgUrls: string[] = await ImageController.pickAndUploadImages(
            this.UPLOAD_BUCKET,
            imageUploadProgess
        );
        return imgUrls;
    }

    public static async invalidate(id: number) {
        reactQueryClient.invalidateQueries(['plannedDayResult', id]);
    }

    public static async invalidateByDayKey(dayKey: string) {
        reactQueryClient.invalidateQueries(['plannedDayResult', dayKey]);
        reactQueryClient.invalidateQueries(['plannedDayResultExists', dayKey]);
    }
}

export default DailyResultController;

export namespace PlannedDayResultCustomHooks {
    export const usePlannedDayResult = (id?: number) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['plannedDayResult', id],
            queryFn: async () => await DailyResultController.getViaApi(id!),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            enabled: !!id && id > 0,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const usePlannedDayResultByDayKey = (dayKey: string) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['plannedDayResult', dayKey],
            queryFn: async () => await DailyResultController.getByDayKey(dayKey),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return {
            isLoading: status === 'loading' && fetchStatus !== 'idle',
            data,
        };
    };

    export const usePlannedDayResultExistsByDayKey = (dayKey: string) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['plannedDayResultExists', dayKey],
            queryFn: async () => await DailyResultController.existsByDayKey(dayKey),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return {
            isLoading: status === 'loading' && fetchStatus !== 'idle',
            data,
        };
    };
}
