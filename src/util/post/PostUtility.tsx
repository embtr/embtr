import { UserPost } from 'resources/schema';
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
        plannedDayResultSummary: PlannedDayResultSummary
    ): TimelinePostModel => {
        const timelinePostModel = {
            title: plannedDayResultSummary.plannedDayResult.title,
            body:
                plannedDayResultSummary.plannedDayResult.description ??
                'Results for ' +
                    getDateStringFromDate(
                        plannedDayResultSummary.plannedDayResult.plannedDay?.date ?? new Date()
                    ),
            user: plannedDayResultSummary.plannedDayResult.plannedDay?.user!,
            type: TimelineType.PLANNED_DAY_RESULT,
            id: plannedDayResultSummary.plannedDayResult.id!,
            sortDate: plannedDayResultSummary.plannedDayResult.createdAt!,
            comments: plannedDayResultSummary.plannedDayResult.comments ?? [],
            likes: plannedDayResultSummary.plannedDayResult.likes ?? [],
            images: plannedDayResultSummary.plannedDayResult.images ?? [],
            plannedDayResult: plannedDayResultSummary.plannedDayResult,
            data: {
                plannedDayResultSummary,
            },
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
