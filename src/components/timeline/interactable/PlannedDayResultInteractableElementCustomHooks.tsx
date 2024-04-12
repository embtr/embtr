import { DeviceEventEmitter } from 'react-native';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { Comment, PlannedDayResult } from 'resources/schema';
import { InteractableData, InteractableElementCustomHooks } from './InteractableElementCustomHooks';
import { ReportController } from 'src/controller/ReportController';
import { CreateReportDto } from 'resources/types/dto/Report';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';

export namespace PlannedDayResultInteractableElementCustomHooks {
    export const createOnLikePlannedDayResultEmitKey = (plannedDayResult: PlannedDayResult) => {
        return `onPlannedTaskLike_${plannedDayResult.id}`;
    };

    export const createOnCommentAddedPlannedDayResultEmitKey = (
        plannedDayResult: PlannedDayResult
    ) => {
        return `onPlannedTaskCommentAdded_${plannedDayResult.id}`;
    };

    export const createOnCommentDeletedPlannedDayResultEmitKey = (
        plannedDayResult: PlannedDayResult
    ) => {
        return `onPlannedTaskCommentDeleted_${plannedDayResult.id}`;
    };

    export const createPlannedDayResultInteractableEventListeners = (
        plannedDayResult: PlannedDayResult,
        interactableData: InteractableData
    ) => {
        DeviceEventEmitter.addListener(
            createOnLikePlannedDayResultEmitKey(plannedDayResult),
            () => {
                interactableData.wasLiked();
            }
        );

        DeviceEventEmitter.addListener(
            createOnCommentAddedPlannedDayResultEmitKey(plannedDayResult),
            () => {
                interactableData.commentWasAdded();
            }
        );

        DeviceEventEmitter.addListener(
            createOnCommentDeletedPlannedDayResultEmitKey(plannedDayResult),
            () => {
                interactableData.commentWasDeleted();
            }
        );
    };

    export const removePlannedDayResultInteractableEventListeners = (
        plannedDayResult: PlannedDayResult
    ) => {
        DeviceEventEmitter.removeAllListeners(
            createOnLikePlannedDayResultEmitKey(plannedDayResult)
        );
        DeviceEventEmitter.removeAllListeners(
            createOnCommentAddedPlannedDayResultEmitKey(plannedDayResult)
        );
        DeviceEventEmitter.removeAllListeners(
            createOnCommentDeletedPlannedDayResultEmitKey(plannedDayResult)
        );
    };

    export const usePlannedDayResultInteractableElement = (
        plannedDayResult: PlannedDayResult
    ): InteractableData => {
        const addLike = async () => {
            if (!plannedDayResult.id) {
                return;
            }

            DeviceEventEmitter.emit(createOnLikePlannedDayResultEmitKey(plannedDayResult));
            await DailyResultController.addLikeViaApi(plannedDayResult.id);
            DailyResultController.invalidate(plannedDayResult.id);
        };

        const addComment = async (text: string) => {
            if (!plannedDayResult.id) {
                return;
            }

            DeviceEventEmitter.emit(createOnCommentAddedPlannedDayResultEmitKey(plannedDayResult));
            const comment = await DailyResultController.addCommentViaApi(plannedDayResult.id, text);
            DailyResultController.invalidate(plannedDayResult.id);
            return comment;
        };

        const deleteComment = async (comment: Comment) => {
            if (!plannedDayResult.id) {
                return;
            }

            DeviceEventEmitter.emit(
                createOnCommentDeletedPlannedDayResultEmitKey(plannedDayResult)
            );
            await DailyResultController.deleteCommentViaApi(comment);
            DailyResultController.invalidate(plannedDayResult.id);
        };

        const report = async () => {
            if (!plannedDayResult.id) {
                return;
            }

            const createReportDto: CreateReportDto = {
                type: 'PLANNED_DAY_RESULT',
                id: plannedDayResult.id,
            };

            ReportController.createReport(createReportDto);
        };

        const currentUser = useAppSelector(getCurrentUser);
        return InteractableElementCustomHooks.useInteractableElement(
            plannedDayResult.likes?.length ?? 0,
            plannedDayResult.likes?.some((like) => like.userId === currentUser.id) ?? false,
            plannedDayResult.comments ?? [],
            addLike,
            addComment,
            deleteComment,
            report
        );
    };
}
