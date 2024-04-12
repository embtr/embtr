import { DeviceEventEmitter } from 'react-native';
import { Comment } from 'resources/schema';
import { InteractableData, InteractableElementCustomHooks } from './InteractableElementCustomHooks';
import { ReportController } from 'src/controller/ReportController';
import { CreateReportDto } from 'resources/types/dto/Report';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { ChallengeSummary } from 'resources/types/dto/Challenge';

export namespace ChallengeSummaryInteractableElementCustomHooks {
  export const createOnLikeEmitKey = (challengeSummary: ChallengeSummary) => {
    return `onChallengeLike_${challengeSummary.id}`;
  };

  export const createOnCommentAddedEmitKey = (challengeSummary: ChallengeSummary) => {
    return `onChallengeCommentAdded_${challengeSummary.id}`;
  };

  export const createOnCommentDeletedEmitKey = (challengeSummary: ChallengeSummary) => {
    return `onChallengeCommentDeleted_${challengeSummary.id}`;
  };

  export const createEventListeners = (
    challengeSummary: ChallengeSummary,
    interactableData: InteractableData
  ) => {
    DeviceEventEmitter.addListener(createOnLikeEmitKey(challengeSummary), () => {
      interactableData.wasLiked();
    });

    DeviceEventEmitter.addListener(createOnCommentAddedEmitKey(challengeSummary), () => {
      interactableData.commentWasAdded();
    });

    DeviceEventEmitter.addListener(createOnCommentDeletedEmitKey(challengeSummary), () => {
      interactableData.commentWasDeleted();
    });
  };

  export const removeEventListeners = (challengeSummary: ChallengeSummary) => {
    DeviceEventEmitter.removeAllListeners(createOnLikeEmitKey(challengeSummary));

    DeviceEventEmitter.removeAllListeners(createOnCommentAddedEmitKey(challengeSummary));

    DeviceEventEmitter.removeAllListeners(createOnCommentDeletedEmitKey(challengeSummary));
  };

  export const useInteractableElement = (
    challengeSummary: ChallengeSummary
  ): InteractableData => {
    const addLike = async () => {
      if (!challengeSummary.id) {
        return;
      }

      DeviceEventEmitter.emit(createOnLikeEmitKey(challengeSummary));
      await ChallengeController.like(challengeSummary.id);
      ChallengeController.invalidateAllChallengeSummaries();
      ChallengeController.invalidateChallengeSummary(challengeSummary.id);
    };

    const addComment = async (text: string) => {
      const comment: Comment = {};
      return comment;
    };

    const deleteComment = async (comment: Comment) => { };

    const report = async () => {
      if (!challengeSummary.id) {
        return;
      }

      const createReportDto: CreateReportDto = {
        type: 'CHALLENGE',
        id: challengeSummary.id,
      };

      ReportController.createReport(createReportDto);
    };

    return InteractableElementCustomHooks.useInteractableElement(
      challengeSummary.likeCount,
      challengeSummary.isLiked,
      Array.from({ length: challengeSummary.commentCount }),
      addLike,
      addComment,
      deleteComment,
      report
    );
  };
}
