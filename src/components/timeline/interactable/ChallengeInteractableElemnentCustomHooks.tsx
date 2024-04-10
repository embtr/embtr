import { DeviceEventEmitter } from 'react-native';
import { Comment, Challenge } from 'resources/schema';
import { InteractableData, InteractableElementCustomHooks } from './InteractableElementCustomHooks';
import { ReportController } from 'src/controller/ReportController';
import { CreateReportDto } from 'resources/types/dto/Report';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';

export namespace ChallengeInteractableElementCustomHooks {
    export const createOnLikeChallengeEmitKey = (challenge: Challenge) => {
        return `onChallengeLike_${challenge.id}`;
    };

    export const createOnCommentAddedChallengeEmitKey = (
        challenge: Challenge
    ) => {
        return `onChallengeCommentAdded_${challenge.id}`;
    };

    export const createOnCommentDeletedChallengeEmitKey = (
        challenge: Challenge
    ) => {
        return `onChallengeCommentDeleted_${challenge.id}`;
    };

    export const createChallengeInteractableEventListeners = (
        challenge: Challenge,
        interactableData: InteractableData
    ) => {
        DeviceEventEmitter.addListener(
            createOnLikeChallengeEmitKey(challenge),
            () => {
                interactableData.wasLiked();
            }
        );

        console.log('adding', createOnCommentAddedChallengeEmitKey(challenge));
        DeviceEventEmitter.addListener(
            createOnCommentAddedChallengeEmitKey(challenge),
            () => {
                interactableData.commentWasAdded();
            }
        );

        DeviceEventEmitter.addListener(
            createOnCommentDeletedChallengeEmitKey(challenge),
            () => {
                interactableData.commentWasDeleted();
            }
        );
    };

    export const removeChallengeInteractableEventListeners = (
        challenge: Challenge
    ) => {
        console.log('removing emitters');

        DeviceEventEmitter.removeAllListeners(
            createOnLikeChallengeEmitKey(challenge)
        );
        DeviceEventEmitter.removeAllListeners(
            createOnCommentAddedChallengeEmitKey(challenge)
        );
        DeviceEventEmitter.removeAllListeners(
            createOnCommentDeletedChallengeEmitKey(challenge)
        );
    };

    export const useChallengeInteractableElement = (
        challenge: Challenge
    ): InteractableData => {
        const addLike = async () => {
            if (!challenge.id) {
                return;
            }

            DeviceEventEmitter.emit(createOnLikeChallengeEmitKey(challenge));
            await ChallengeController.like(challenge.id);
            ChallengeController.invalidate(challenge.id);
        };

        const addComment = async (text: string) => {
            if (!challenge.id) {
                return;
            }

            DeviceEventEmitter.emit(createOnCommentAddedChallengeEmitKey(challenge));
            const comment = await ChallengeController.comment(challenge.id, text);
            ChallengeController.invalidate(challenge.id);
            return comment;
        };

        const deleteComment = async (comment: Comment) => {
            if (!challenge.id) {
                return;
            }

            DeviceEventEmitter.emit(
                createOnCommentDeletedChallengeEmitKey(challenge)
            );

            await ChallengeController.deleteComment(comment);
            ChallengeController.invalidate(challenge.id);
        };

        const report = async () => {
            if (!challenge.id) {
                return;
            }

            const createReportDto: CreateReportDto = {
                type: 'CHALLENGE',
                id: challenge.id,
            };

            ReportController.createReport(createReportDto);
        };

        return InteractableElementCustomHooks.useInteractableElement(
            challenge.likes ?? [],
            challenge.comments ?? [],
            addLike,
            addComment,
            deleteComment,
            report
        );
    };
}
