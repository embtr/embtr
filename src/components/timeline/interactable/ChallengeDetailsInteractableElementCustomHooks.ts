import { DeviceEventEmitter } from 'react-native';
import { Comment } from 'resources/schema';
import { InteractableData, InteractableElementCustomHooks } from './InteractableElementCustomHooks';
import { ReportController } from 'src/controller/ReportController';
import { CreateReportDto } from 'resources/types/dto/Report';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { ChallengeDetails } from 'resources/types/dto/Challenge';

export namespace ChallengeDetailsInteractableElementCustomHooks {
  export const createOnLikeEmitKey = (challengeDetails: ChallengeDetails) => {
    return `onChallengeLike_${challengeDetails.id}`;
  };

  export const createOnCommentAddedEmitKey = (challengeDetails: ChallengeDetails) => {
    return `onChallengeCommentAdded_${challengeDetails.id}`;
  };

  export const createOnCommentDeletedEmitKey = (challengeDetails: ChallengeDetails) => {
    return `onChallengeCommentDeleted_${challengeDetails.id}`;
  };

  export const createEventListeners = (
    challengeDetails: ChallengeDetails,
    interactableData: InteractableData
  ) => {
    DeviceEventEmitter.addListener(createOnLikeEmitKey(challengeDetails), () => {
      interactableData.wasLiked();
    });

    DeviceEventEmitter.addListener(createOnCommentAddedEmitKey(challengeDetails), () => {
      interactableData.commentWasAdded();
    });

    DeviceEventEmitter.addListener(createOnCommentDeletedEmitKey(challengeDetails), () => {
      interactableData.commentWasDeleted();
    });
  };

  export const removeEventListeners = (challengeDetails: ChallengeDetails) => {
    DeviceEventEmitter.removeAllListeners(createOnLikeEmitKey(challengeDetails));
    DeviceEventEmitter.removeAllListeners(createOnCommentAddedEmitKey(challengeDetails));
    DeviceEventEmitter.removeAllListeners(createOnCommentDeletedEmitKey(challengeDetails));
  };

  export const useInteractableElement = (
    challengeDetails: ChallengeDetails
  ): InteractableData => {
    const addLike = async () => {
      if (!challengeDetails.id) {
        return;
      }

      DeviceEventEmitter.emit(createOnLikeEmitKey(challengeDetails));
      await ChallengeController.like(challengeDetails.id);
      ChallengeController.invalidateChallengeDetails(challengeDetails.id);
      ChallengeController.invalidateAllChallengeDetails();
    };

    const addComment = async (text: string) => {
      if (!challengeDetails.id) {
        return;
      }

      DeviceEventEmitter.emit(createOnCommentAddedEmitKey(challengeDetails));
      const comment = await ChallengeController.comment(challengeDetails.id, text);
      ChallengeController.invalidateChallengeDetails(challengeDetails.id);
      ChallengeController.invalidateAllChallengeDetails();
      return comment;
    };

    const deleteComment = async (comment: Comment) => {
      if (!challengeDetails.id) {
        return;
      }

      DeviceEventEmitter.emit(createOnCommentDeletedEmitKey(challengeDetails));

      await ChallengeController.deleteComment(comment);
      ChallengeController.invalidateChallengeDetails(challengeDetails.id);
      ChallengeController.invalidateAllChallengeDetails();
    };

    const report = async () => {
      if (!challengeDetails.id) {
        return;
      }

      const createReportDto: CreateReportDto = {
        type: 'CHALLENGE',
        id: challengeDetails.id,
      };

      ReportController.createReport(createReportDto);
    };

    return InteractableElementCustomHooks.useInteractableElement(
      challengeDetails.likeCount,
      challengeDetails.isLiked,
      challengeDetails.comments,
      addLike,
      addComment,
      deleteComment,
      report
    );
  };
}
