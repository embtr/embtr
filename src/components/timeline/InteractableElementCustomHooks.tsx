import React from 'react';
import { Comment, Like, PlannedDayResult, UserPost } from 'resources/schema';
import StoryController from 'src/controller/timeline/story/StoryController';
import { UserCustomHooks } from 'src/controller/user/UserController';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { HabitController } from 'src/controller/habit/HabitController';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';

export interface InteractableData {
    likes: Like[];
    onLike: () => {};
    isLiked: boolean;
    comments: Comment[];
    onCommentAdded: (comment: string) => void;
    onCommentDeleted: (comment: Comment) => void;
}

// Two Electric Boogaloo - CherkimHS - 2024-01-18 @ 5:39 AM

export namespace InteractableElementCustomHooks {
    const useInteractableElement = (
        likes: Like[],
        comments: Comment[],
        addLike: () => Promise<void>,
        addComment: (comment: string) => Promise<Comment | undefined>,
        deleteComment: (comment: Comment) => Promise<void>
    ): InteractableData => {
        const currentUser = useAppSelector(getCurrentUser);

        const [likeCount, setLikeCount] = React.useState(likes?.length ?? 0);
        const [isLiked, setIsLiked] = React.useState(
            likes?.some((like) => like.user?.uid === currentUser?.uid) ?? false
        );
        const [currentComments, setCurrentComments] = React.useState(comments ?? []);

        React.useEffect(() => {
            const isLiked = likes?.some((like) => like.user?.uid === currentUser?.uid) ?? false;
            setIsLiked(isLiked);
            setLikeCount(likes?.length ?? 0);
            setCurrentComments(comments ?? []);
        }, [likes, comments]);

        const onLike = async () => {
            if (isLiked) {
                return;
            }

            setIsLiked(true);
            setLikeCount(likeCount + 1);
            addLike();
        };

        const onCommentAdded = async (comment: string) => {
            const temporaryComment: Comment = {
                userId: currentUser.id,
                user: currentUser,
                active: true,
                comment,
            };

            // 1. create temporary comment
            const initialComments = [...currentComments];
            const temporaryComments = [...initialComments, temporaryComment];
            setCurrentComments(temporaryComments);

            // 2. save and get actual comment
            const createdComment = await addComment(comment);

            // 3. replace temporary comment with actual comment
            if (!createdComment) {
                setCurrentComments(initialComments);
                return;
            }
            const newComments = [...initialComments, createdComment];
            setCurrentComments(newComments);
        };

        const onCommentDeleted = async (comment: Comment) => {
            setCurrentComments(currentComments.filter((c) => c.id !== comment.id));
            deleteComment(comment);
        };

        return {
            likes,
            isLiked,
            onLike,
            onCommentAdded,
            onCommentDeleted,
            comments: currentComments,
        };
    };

    export const usePlannedDayResultInteractableElement = (
        plannedDayResult: PlannedDayResult
    ): InteractableData => {
        const addLike = async () => {
            if (!plannedDayResult.id) {
                return;
            }

            await DailyResultController.addLikeViaApi(plannedDayResult.id);
        };

        const addComment = async (text: string) => {
            if (!plannedDayResult.id) {
                return;
            }

            const comment = DailyResultController.addCommentViaApi(plannedDayResult.id, text);
            return comment;
        };

        const deleteComment = async (comment: Comment) => {
            if (!plannedDayResult.id) {
                return;
            }

            await StoryController.deleteCommentViaApi(comment);
        };

        return useInteractableElement(
            plannedDayResult.likes ?? [],
            plannedDayResult.comments ?? [],
            addLike,
            addComment,
            deleteComment
        );
    };

    export const useUserPostInteractableElement = (userPost: UserPost): InteractableData => {
        const addLike = async () => {
            if (!userPost.id) {
                return;
            }

            StoryController.addLikeViaApi(userPost.id);
        };

        const addComment = async (text: string) => {
            if (!userPost.id) {
                return;
            }

            const comment = StoryController.addCommentViaApi(userPost.id, text);
            return comment;
        };

        const deleteComment = async (comment: Comment) => {
            if (!userPost.id) {
                return;
            }

            StoryController.deleteCommentViaApi(comment);
        };

        return useInteractableElement(
            userPost.likes ?? [],
            userPost.comments ?? [],
            addLike,
            addComment,
            deleteComment
        );
    };
}
