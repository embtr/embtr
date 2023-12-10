import { PlannedDayResult, UserPost } from 'resources/schema';
import { TimelineType } from 'resources/types/Types';
import { PlannedDayResultSummary } from 'resources/types/planned_day_result/PlannedDayResult';
import { getDateStringFromDate } from 'src/controller/planning/PlannedDayController';
import { TimelinePostModel } from 'src/model/OldModels';

export namespace PostUtility {
    export const createUserPostTimelineModel = (userPost: UserPost): TimelinePostModel => {
        const userPostTimelinePost: TimelinePostModel = {
            user: userPost.user!,
            type: TimelineType.USER_POST,
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
            type: TimelineType.PLANNED_DAY_RESULT,
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
