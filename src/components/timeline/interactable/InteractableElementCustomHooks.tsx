import React from 'react';
import { Comment, Like } from 'resources/schema';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';

// Two Electric Boogaloo - CherkimHS - 2024-01-18 @ 5:39 AM
export interface InteractableData {
    likeCount: number;
    onLike: () => {};
    isLiked: boolean;
    comments: Comment[];
    onCommentAdded: (comment: string) => Promise<void>;
    onCommentDeleted: (comment: Comment) => Promise<void>;
    wasLiked: () => void;
    commentWasAdded: () => void;
    commentWasDeleted: () => void;
}

export namespace InteractableElementCustomHooks {
    export const useInteractableElement = (
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

            wasLiked();
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

        const wasLiked = () => {
            setIsLiked(true);
            setLikeCount((old) => old + 1);
        };

        const commentAdded = () => {
            const dummyComment: Comment = {};
            setCurrentComments((old) => [dummyComment, ...old]);
        };

        const commentDeleted = () => {
            setCurrentComments((old) => old.slice(1));
        };

        return {
            likeCount,
            isLiked,
            onLike,
            onCommentAdded,
            onCommentDeleted,
            comments: currentComments,
            wasLiked,
            commentWasAdded: commentAdded,
            commentWasDeleted: commentDeleted,
        };
    };
}
