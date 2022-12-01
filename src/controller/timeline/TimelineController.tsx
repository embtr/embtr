import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { ChallengeModel1 } from 'src/controller/timeline/challenge/ChallengeController';
import DailyResultController, { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { StoryModel } from 'src/controller/timeline/story/StoryController';
import TimelineDao from 'src/firebase/firestore/timeline/TimelineDao';

export interface Comment {
    uid: string;
    comment: string;
    timestamp: Timestamp;
}

export interface Like {
    uid: string;
    added: Timestamp;
}

export interface TimelinePostModel {
    id?: string;
    added: Timestamp;
    modified: Timestamp;
    type: string;
    uid: string;
    public: {
        comments: Comment[];
        likes: Like[];
    };
    data: {};
    active: boolean;
}

export interface PaginatedTimelinePosts {
    posts: TimelinePostModel[];
    lastTimelinePost: QueryDocumentSnapshot | undefined | null;
}

export const getTimelinePostAddedDate = (timelinePost: TimelinePostModel) => {
    let addedDate = timelinePost.added;
    if (timelinePost.type === 'DAILY_RESULT') {
        const timelinePostAsDailyResult: DailyResultModel = timelinePost as DailyResultModel;
        if (timelinePostAsDailyResult.data.completionDate) {
            addedDate = timelinePostAsDailyResult.data.completionDate;
        }
    }

    return addedDate;
};

class TimelineController {
    public static async getPaginatedTimelinePosts(lastTimelinePost: QueryDocumentSnapshot | undefined | null, cutoffDate: Date, callback: Function) {
        if (lastTimelinePost === null) {
            callback({ posts: [], lastTimelinePost: null });
            return;
        }

        const result = TimelineDao.getPaginatedTimelinePosts(lastTimelinePost, cutoffDate);

        let timelinePosts: TimelinePostModel[] = [];
        let foundLastTimelinePost: QueryDocumentSnapshot | undefined = undefined;
        result
            .then((response) => {
                response.docs.forEach((doc) => {
                    foundLastTimelinePost = doc;

                    const type = doc.data()['type'];

                    switch (type) {
                        case 'STORY':
                            const story = this.getStoryFromData(doc);
                            if (story.active) {
                                timelinePosts.push(story);
                            }
                            break;

                        case 'CHALLENGE':
                            const challenge = this.getChallengeFromData(doc);
                            if (challenge.active) {
                                timelinePosts.push(challenge);
                            }
                            break;
                    }
                });
            })
            .then(() => {
                let paginatedTimelinePosts: PaginatedTimelinePosts = {
                    posts: timelinePosts,
                    lastTimelinePost: foundLastTimelinePost,
                };

                callback(paginatedTimelinePosts);
            });
    }

    public static getTimelinePostsForUser(uid: string, callback: Function) {
        const result = TimelineDao.getTimelinePostsForUser(uid);

        let timelinePosts: TimelinePostModel[] = [];
        result
            .then((response) => {
                response.docs.forEach((doc) => {
                    let story: StoryModel = doc.data() as StoryModel;
                    story.id = doc.id;
                    timelinePosts.push(story);
                });
            })
            .then(async () => {
                const dailyResults = await DailyResultController.getAllFinishedForUser(uid);
                timelinePosts = timelinePosts.concat(dailyResults);
            })
            .then(() => {
                timelinePosts = timelinePosts
                    .sort((a, b) => ((a.type === 'DAILY_RESULT' ? a.modified : a.added) > (b.type === 'DAILY_RESULT' ? b.modified : b.added) ? 1 : -1))
                    .reverse();
                callback(timelinePosts);
            });
    }

    private static getStoryFromData(data: DocumentSnapshot<DocumentData>): StoryModel {
        let story: StoryModel = data.data() as StoryModel;
        story.id = data.id;

        return story;
    }

    private static getChallengeFromData(data: DocumentSnapshot<DocumentData>): ChallengeModel1 {
        let challenge: ChallengeModel1 = data.data() as ChallengeModel1;
        challenge.id = data.id;

        return challenge;
    }
}

export default TimelineController;
