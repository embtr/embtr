import { Comment, UserPost } from 'resources/schema';
import { DeviceEventEmitter } from 'react-native';
import StoryController from 'src/controller/timeline/story/StoryController';
import { InteractableData, InteractableElementCustomHooks } from './InteractableElementCustomHooks';
import { CreateReportDto } from 'resources/types/dto/Report';
import { ReportController } from 'src/controller/ReportController';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';

export namespace UserPostInteractableElementCustomHooks {
    export const createOnLikeUserPostEmitKey = (userPost: UserPost) => {
        return `onUserPostLike_${userPost.id}`;
    };

    export const createOnCommentAddedUserPostEmitKey = (userPost: UserPost) => {
        return `onUserPostCommentAdded_${userPost.id}`;
    };

    export const createOnCommentDeletedUserPostEmitKey = (userPost: UserPost) => {
        return `onUserPostCommentDeleted_${userPost.id}`;
    };

    export const createUserPostInteractableEventListeners = (
        userPost: UserPost,
        interactableData: InteractableData
    ) => {
        DeviceEventEmitter.addListener(createOnLikeUserPostEmitKey(userPost), () => {
            interactableData.wasLiked();
        });

        DeviceEventEmitter.addListener(createOnCommentAddedUserPostEmitKey(userPost), () => {
            interactableData.commentWasAdded();
        });

        DeviceEventEmitter.addListener(createOnCommentDeletedUserPostEmitKey(userPost), () => {
            interactableData.commentWasDeleted();
        });
    };

    export const removeUserPostInteractableEventListeners = (userPost: UserPost) => {
        if (!userPost.id) {
            return;
        }

        setTimeout(() => {
            DeviceEventEmitter.removeAllListeners(createOnLikeUserPostEmitKey(userPost));
            DeviceEventEmitter.removeAllListeners(createOnCommentAddedUserPostEmitKey(userPost));
            DeviceEventEmitter.removeAllListeners(createOnCommentDeletedUserPostEmitKey(userPost));
        }, 0);
    };

    export const useUserPostInteractableElement = (userPost: UserPost): InteractableData => {
        const addLike = async () => {
            if (!userPost.id) {
                return;
            }

            DeviceEventEmitter.emit(createOnLikeUserPostEmitKey(userPost));
            await StoryController.addLikeViaApi(userPost.id);
            StoryController.invalidate(userPost.id);
        };

        const addComment = async (text: string) => {
            if (!userPost.id) {
                return;
            }

            DeviceEventEmitter.emit(createOnCommentAddedUserPostEmitKey(userPost));
            const comment = await StoryController.addCommentViaApi(userPost.id, text);
            StoryController.invalidate(userPost.id);
            return comment;
        };

        const deleteComment = async (comment: Comment) => {
            if (!userPost.id) {
                return;
            }

            DeviceEventEmitter.emit(createOnCommentDeletedUserPostEmitKey(userPost));
            await StoryController.deleteCommentViaApi(comment);
            StoryController.invalidate(userPost.id);
        };

        const report = async () => {
            if (!userPost.id) {
                return;
            }

            const createReportDto: CreateReportDto = {
                type: 'USER_POST',
                id: userPost.id,
            };

            ReportController.createReport(createReportDto);
        };

        const currentUser = useAppSelector(getCurrentUser);
        return InteractableElementCustomHooks.useInteractableElement(
            userPost.likes?.length ?? 0,
            userPost.likes?.some((like) => like.userId === currentUser.id) ?? false,
            userPost.comments ?? [],
            addLike,
            addComment,
            deleteComment,
            report
        );
    };
}
