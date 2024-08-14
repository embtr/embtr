import { Comment, FeaturedPost } from 'resources/schema';
import { DeviceEventEmitter } from 'react-native';
import { InteractableData, InteractableElementCustomHooks } from './InteractableElementCustomHooks';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { FeaturedPostController } from 'src/controller/FeaturedPostController';

export namespace FeaturedPostInteractableElementCustomHooks {
    export const createOnLikeFeaturedPostEmitKey = (featuredPost: FeaturedPost) => {
        return `onFeaturedPostLike_${featuredPost.id}`;
    };

    export const createOnCommentAddedFeaturedPostEmitKey = (featuredPost: FeaturedPost) => {
        return `onFeaturedPostCommentAdded_${featuredPost.id}`;
    };

    export const createOnCommentDeletedFeaturedPostEmitKey = (featuredPost: FeaturedPost) => {
        return `onFeaturedPostCommentDeleted_${featuredPost.id}`;
    };

    export const createFeaturedPostInteractableEventListeners = (
        featuredPost: FeaturedPost,
        interactableData: InteractableData
    ) => {
        DeviceEventEmitter.addListener(createOnLikeFeaturedPostEmitKey(featuredPost), () => {
            interactableData.wasLiked();
        });

        DeviceEventEmitter.addListener(
            createOnCommentAddedFeaturedPostEmitKey(featuredPost),
            () => {
                interactableData.commentWasAdded();
            }
        );

        DeviceEventEmitter.addListener(
            createOnCommentDeletedFeaturedPostEmitKey(featuredPost),
            () => {
                interactableData.commentWasDeleted();
            }
        );
    };

    export const removeFeaturedPostInteractableEventListeners = (featuredPost: FeaturedPost) => {
        if (!featuredPost.id) {
            return;
        }

        setTimeout(() => {
            DeviceEventEmitter.removeAllListeners(createOnLikeFeaturedPostEmitKey(featuredPost));
            DeviceEventEmitter.removeAllListeners(
                createOnCommentAddedFeaturedPostEmitKey(featuredPost)
            );
            DeviceEventEmitter.removeAllListeners(
                createOnCommentDeletedFeaturedPostEmitKey(featuredPost)
            );
        }, 0);
    };

    export const useFeaturedPostInteractableElement = (
        featuredPost: FeaturedPost
    ): InteractableData => {
        const addLike = async () => {
            if (!featuredPost.id) {
                return;
            }

            DeviceEventEmitter.emit(createOnLikeFeaturedPostEmitKey(featuredPost));
            await FeaturedPostController.like(featuredPost.id);
            FeaturedPostController.invalidate(featuredPost.id);
        };

        const addComment = async (text: string) => {
            if (!featuredPost.id) {
                return;
            }

            DeviceEventEmitter.emit(createOnCommentAddedFeaturedPostEmitKey(featuredPost));
            const comment = await FeaturedPostController.comment(featuredPost.id, text);
            FeaturedPostController.invalidate(featuredPost.id);
            return comment;
        };

        const deleteComment = async (comment: Comment) => {
            if (!featuredPost.id) {
                return;
            }

            DeviceEventEmitter.emit(createOnCommentDeletedFeaturedPostEmitKey(featuredPost));
            await FeaturedPostController.deleteComment(comment);
            FeaturedPostController.invalidate(featuredPost.id);
        };

        // TODO - badges on user comments, expiration date

        const report = async () => {
            // cannot report featured posts
        };

        const currentUser = useAppSelector(getCurrentUser);
        return InteractableElementCustomHooks.useInteractableElement(
            featuredPost.likes?.length ?? 0,
            featuredPost.likes?.some((like) => like.userId === currentUser.id) ?? false,
            featuredPost.comments ?? [],
            addLike,
            addComment,
            deleteComment,
            report
        );
    };
}
