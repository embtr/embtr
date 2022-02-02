import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { Comment, Like } from "src/controller/explore/ExploreController";
import StoryDao from "src/firebase/firestore/story/StoryDao";

export interface StoryModel {
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

export const createStory = (uid: string, title: string, story: string): StoryModel => {
    return {
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
}

export default StoryController;