import { DeviceEventEmitter } from 'react-native';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { Comment, PlannedDayResult } from 'resources/schema';
import { InteractableData, InteractableElementCustomHooks } from './InteractableElementCustomHooks';

export namespace PlannedDayResultInteractableElementCustomHooks {
    export const createOnLikePlannedDayResultEmitKey = (plannedDayResult: PlannedDayResult) => {
        return `onLike_${plannedDayResult.id}`;
    };

    export const createOnCommentAddedPlannedDayResultEmitKey = (
        plannedDayResult: PlannedDayResult
    ) => {
        return `onCommentAdded_${plannedDayResult.id}`;
    };

    export const createOnCommentDeletedPlannedDayResultEmitKey = (
        plannedDayResult: PlannedDayResult
    ) => {
        return `onCommentDeleted_${plannedDayResult.id}`;
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

        return InteractableElementCustomHooks.useInteractableElement(
            plannedDayResult.likes ?? [],
            plannedDayResult.comments ?? [],
            addLike,
            addComment,
            deleteComment
        );
    };
}
