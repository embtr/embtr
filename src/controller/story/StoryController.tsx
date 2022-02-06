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
                callback(story);
            }
        });
    }

    public static likeStory(storyId: string, userUid: string) {
        StoryDao.likeStory(storyId, userUid);
    }

    public static addComment(id: string, uid: string, commentText: string, callback: Function) {
        StoryDao.addComment(id, uid, commentText).then(() => {
            callback();
        });
    }
}

export default StoryController;