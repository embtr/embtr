import { PlannedDayResult, UserPost } from 'resources/schema';
import { getDateStringFromDate } from 'src/controller/planning/PlannedDayController';
import { TimelinePostModel } from 'src/model/OldModels';
import { TimelineElementType } from 'resources/types/requests/Timeline';

export namespace PostUtility {
    export const createUserPostTimelineModel = (userPost: UserPost): TimelinePostModel => {
        const userPostTimelinePost: TimelinePostModel = {
            user: userPost.user!,
            type: TimelineElementType.USER_POST,
            id: userPost.id!,
            sortDate: userPost.createdAt!,
            comments: userPost.comments ?? [],
            likes: userPost.likes ?? [],
            images: userPost.images ?? [],
            title: userPost.title ?? '',
            body: userPost.body ?? '',
            data: {
                userPost,
            },
        };

        return userPostTimelinePost;
    };

    export const createDayResultTimelineModel = (
        plannedDayResult: PlannedDayResult
    ): TimelinePostModel => {
        const timelinePostModel = {
            title: plannedDayResult.title,
            body:
                plannedDayResult.description ??
                'Results for ' +
                    getDateStringFromDate(plannedDayResult.plannedDay?.date ?? new Date()),
            user: plannedDayResult.plannedDay?.user!,
            type: TimelineElementType.PLANNED_DAY_RESULT,
            id: plannedDayResult.id!,
            sortDate: plannedDayResult.createdAt!,
            comments: plannedDayResult.comments ?? [],
            likes: plannedDayResult.likes ?? [],
            images: plannedDayResult.images ?? [],
            plannedDayResult: plannedDayResult,
            data: {},
        };

        return timelinePostModel;
    };

    // const joinedChallengesTimelinePosts = joinedChallenges.map((joinedChallenge) => ({
    //     user: joinedChallenge.participants?.[0]?.user!,
    //     secondaryHeaderText: getRecentlyJoinedMessage(joinedChallenge),
    //     title: joinedChallenge.challenge.name,
    //     body: joinedChallenge.challenge.description ?? '',
    //     type: TimelineType.JOINED_CHALLENGE,
    //     id: joinedChallenge.challenge.id!,
    //     sortDate: joinedChallenge.participants?.[0]?.createdAt!,
    //     comments: joinedChallenge.challenge.comments ?? [],
    //     likes: joinedChallenge.challenge.likes ?? [],
    //     images: joinedChallenge.challenge.images ?? [],
    //     joinedChallenge,

    //     data: {
    //         joinedChallenge,
    //     },
    // }));
}
