import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import NotificationController, { NotificationType } from "src/controller/notification/NotificationController";
import { TimelinePostModel } from "src/controller/timeline/TimelineController";
import StoryDao from "src/firebase/firestore/story/StoryDao";

export interface StoryModel extends TimelinePostModel {
    data: {
        title: string,
        story: string
    }
}

export const storyWasLikedBy = (storyModel: StoryModel, uid: string) : boolean => {
    let isLiked = false;
    storyModel.public.likes.forEach(like => {
        if (like.uid === uid) {
            isLiked = true;
            return;
        }
    });

    return isLiked;
};

export const createStory = (uid: string, title: string, story: string): StoryModel => {
    return {
        id: "",
        added: Timestamp.now(),
        type: "STORY",
        uid: uid,
        public: {
            comments: [],
            likes: []
        },
        data: {
            title: title,
            story: story
        }
    };
};

class StoryController {
    public static addStory(title: string, story: string, callback: Function) {
        const uid = getAuth().currentUser?.uid;
        if (!uid) {
            return;
        }
        
        const storyModel = createStory(uid, title, story);
        StoryDao.addStory(storyModel, callback);
    }

    public static getStories(callback: Function) {
        const result = StoryDao.getStories();

        let stories: StoryModel[] = [];
        result.then(response => {
            response.docs.forEach(doc => {
                let story: StoryModel = doc.data() as StoryModel;
                story.id = doc.id;
                stories.push(story);
            });
        }).then(() => {
            callback(stories);
        });
    }

    public static getStory(id: string, callback: Function) {
        const result = StoryDao.getStory(id);
        result.then(doc => {
            if (!doc || !doc.exists()) {
                callback(undefined);
            } else {
                let story : StoryModel = doc.data() as StoryModel;
                story.id = doc.id;
                story.public.comments = story.public.comments.sort((a, b) => (a.timestamp! > b.timestamp!) ? 1 : -1);
                callback(story);
            }
        });
    }

    public static likeStory(story: StoryModel, userUid: string) {
        StoryDao.likeStory(story.id, userUid);
        NotificationController.addNotification(userUid, story.uid, NotificationType.TIMELINE_LIKE, story.id);
    }

    public static addComment(id: string, uid: string, commentText: string, callback: Function) {
        StoryDao.addComment(id, uid, commentText).then(() => {
            callback();
        });
    }
}

export default StoryController;