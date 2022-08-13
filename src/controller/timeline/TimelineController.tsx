import { Timestamp } from "firebase/firestore";
import { ChallengeModel1 } from "src/controller/timeline/challenge/ChallengeController";
import { StoryModel } from "src/controller/timeline/story/StoryController";
import TimelineDao from "src/firebase/firestore/timeline/TimelineDao";

export interface Comment {
    uid: string,
    comment: string,
    timestamp: Timestamp
}

export interface Like {
    uid: string,
    added: Timestamp
}

export interface TimelinePostModel {
    id: string,
    added: Timestamp,
    type: string,
    uid: string,
    public: {
        comments: Comment[],
        likes: Like[]
    },
    data: {
        title: string,
        story: string
    }
}

class TimelineController {
    public static   getTimelinePosts(callback: Function) {
        const result = TimelineDao.getTimelinePosts();

        let timelinePosts: TimelinePostModel[] = [];
        result.then(response => {
            response.docs.forEach(doc => {
                const type = doc.data()['type'];

                switch (type) {
                    case "STORY":
                        let story: StoryModel = doc.data() as StoryModel;
                        story.id = doc.id;
                        timelinePosts.push(story);
                        break;
                    
                    case "TASK_RESULT":
                        let taskResult: StoryModel = doc.data() as StoryModel;
                        taskResult.id = doc.id;
                        timelinePosts.push(taskResult);
                        break;

                    case "CHALLENGE":
                        let challenge: ChallengeModel1 = doc.data() as ChallengeModel1;
                        challenge.id = doc.id;
                        timelinePosts.push(challenge);
                        break;
                }
            });
        }).then(() => {
            callback(timelinePosts);
        });
    }

    public static getTimelinePostsForUser(uid: string, callback: Function) {
        const result = TimelineDao.getTimelinePostsForUser(uid);

        let timelinePosts: TimelinePostModel[] = [];
        result.then(response => {
            response.docs.forEach(doc => {
                let story: StoryModel = doc.data() as StoryModel;
                story.id = doc.id;
                timelinePosts.push(story);
            });
        }).then(() => {
            timelinePosts.sort((a, b) => (b.added > a.added) ? 1 : -1);
            callback(timelinePosts);
        });
    }
}

export default TimelineController;