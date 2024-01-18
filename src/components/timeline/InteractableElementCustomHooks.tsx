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
    likeCount: number;
    isLiked: boolean;
    onLike: () => {};
    commentCount: number;
}

// Two Electric Boogaloo - CherkimHS - 2024-01-18 @ 5:39 AM

export namespace InteractableElementCustomHooks {
    const useInteractableElement = (
        likes: Like[],
        comments: Comment[],
        addLike: () => Promise<void>
    ): InteractableData => {
        const currentUser = useAppSelector(getCurrentUser);

        const [likeCount, setLikeCount] = React.useState(likes?.length ?? 0);
        const [isLiked, setIsLiked] = React.useState(
            likes?.some((like) => like.user?.uid === currentUser?.uid) ?? false
        );
        const [commentCount, setCommentCount] = React.useState(comments?.length ?? 0);

        const onLike = async () => {
            if (isLiked) {
                return;
            }

            setIsLiked(true);
            setLikeCount(likeCount + 1);
            addLike();
        };

        return { likeCount, isLiked, onLike, commentCount };
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

        return useInteractableElement(
            plannedDayResult.likes ?? [],
            plannedDayResult.comments ?? [],
            addLike
        );
    };

    export const useUserPostInteractableElement = (userPost: UserPost): InteractableData => {
        const addLike = async () => {
            if (!userPost.id) {
                return;
            }

            await StoryController.addLikeViaApi(userPost.id);
        };

        return useInteractableElement(userPost.likes ?? [], userPost.comments ?? [], addLike);
    };
}
