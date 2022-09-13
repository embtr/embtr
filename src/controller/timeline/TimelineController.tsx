import { Timestamp } from 'firebase/firestore';
import { ChallengeModel1 } from 'src/controller/timeline/challenge/ChallengeController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
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

class TimelineController {
    public static getTimelinePosts(callback: Function) {
        const result = TimelineDao.getTimelinePosts();

        let timelinePosts: TimelinePostModel[] = [];
        result
            .then((response) => {
                response.docs.forEach((doc) => {
                    const type = doc.data()['type'];

                    switch (type) {
                        case 'STORY':
                            let story: StoryModel = doc.data() as StoryModel;
                            story.id = doc.id;
                            timelinePosts.push(story);
                            break;

                        case 'TASK_RESULT':
                            let taskResult: StoryModel = doc.data() as StoryModel;
                            taskResult.id = doc.id;
                            timelinePosts.push(taskResult);
                            break;

                        case 'CHALLENGE':
                            let challenge: ChallengeModel1 = doc.data() as ChallengeModel1;
                            challenge.id = doc.id;
                            timelinePosts.push(challenge);
                            break;
                    }
                });
            })
            .then(async () => {
                const dailyResults = await DailyResultController.getAllFinished();
                timelinePosts = timelinePosts.concat(dailyResults);
            })
            .then(() => {
                timelinePosts = timelinePosts
                    .sort((a, b) => ((a.type === 'DAILY_RESULT' ? a.modified : a.added) > (b.type === 'DAILY_RESULT' ? b.modified : b.added) ? 1 : -1))
                    .reverse();
            })
            .then(() => {
                callback(timelinePosts);
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
}

export default TimelineController;
