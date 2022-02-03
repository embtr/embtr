import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { Comment, Like } from "src/controller/explore/ExploreController";
import StoryDao from "src/firebase/firestore/story/StoryDao";

export interface StoryModel {
    id?: string,
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

    public static likeStory(challengeId: string, userUid: string) {
        StoryDao.likeStory(challengeId, userUid);
    }
}

export default StoryController;