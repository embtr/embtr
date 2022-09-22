import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import ImageController from 'src/controller/image/ImageController';
import NotificationController, { NotificationType } from 'src/controller/notification/NotificationController';
import { TimelinePostModel } from 'src/controller/timeline/TimelineController';
import StoryDao from 'src/firebase/firestore/story/StoryDao';

export interface StoryModel extends TimelinePostModel {
    data: {
        title: string;
        story: string;
        images: string[]
    };
}

export const timelineEntryWasLikedBy = (timelinePost: TimelinePostModel, uid: string): boolean => {
    let isLiked = false;
    timelinePost.public.likes.forEach((like) => {
        if (like.uid === uid) {
            isLiked = true;
            return;
        }
    });

    return isLiked;
};

export const copyStory = (story: StoryModel): StoryModel => {
    const newStory: StoryModel = {
        id: story.id,
        added: story.added,
        modified: story.modified,
        type: story.type,
        uid: story.uid,
        active: story.active,
        public: {
            comments: story.public.comments,
            likes: story.public.likes,
        },
        data: {
            title: story.data.title,
            story: story.data.story,
            images: [...story.data.images]
        },
    };

    return newStory;
};

export const createStory = (uid: string, title: string, story: string, images: string[]): StoryModel => {
    return {
        id: '',
        added: Timestamp.now(),
        modified: Timestamp.now(),
        type: 'STORY',
        uid: uid,
        active: true,
        public: {
            comments: [],
            likes: [],
        },
        data: {
            title: title,
            story: story,
            images: images 
        },
    };
};

class StoryController {
    public static addStory(title: string, story: string, images: string[], callback: Function) {
        const uid = getAuth().currentUser?.uid;
        if (!uid) {
            return;
        }

        const storyModel = createStory(uid, title, story, images);
        StoryDao.addStory(storyModel, callback);
    }

    public static getStories(callback: Function) {
        const result = StoryDao.getStories();

        let stories: StoryModel[] = [];
        result
            .then((response) => {
                response.docs.forEach((doc) => {
                    let story: StoryModel = doc.data() as StoryModel;
                    story.id = doc.id;
                    stories.push(story);
                });
            })
            .then(() => {
                callback(stories);
            });
    }

    public static getStory(id: string, callback: Function) {
        const result = StoryDao.getStory(id);
        result.then((doc) => {
            if (!doc || !doc.exists()) {
                callback(undefined);
            } else {
                let story: StoryModel = doc.data() as StoryModel;
                story.id = doc.id;
                if (!story.data.images) {
                    story.data.images = [];
                }
                story.public.comments = story.public.comments.sort((a, b) => (a.timestamp! > b.timestamp! ? 1 : -1));
                callback(story);
            }
        });
    }

    public static async delete(story: StoryModel) {
        story.active = false;
        await this.update(story);
    }

    public static async update(story: StoryModel) {
    story.modified = Timestamp.now();
        await StoryDao.update(story);
    }

    public static likeStory(story: StoryModel, userUid: string) {
        if (!story.id) {
            return;
        }

        StoryDao.likeStory(story.id, userUid);
        NotificationController.addNotification(userUid, story.uid, NotificationType.TIMELINE_LIKE, story.id);
    }

    public static addComment(id: string, uid: string, commentText: string, callback: Function) {
        StoryDao.addComment(id, uid, commentText).then(() => {
            callback();
        });
    }

    public static async uploadImages(imageUploadProgess?: Function): Promise<string[]> {
        const imgUrls: string[] = await ImageController.pickAndUploadImages('user_posts', imageUploadProgess);
        return imgUrls;
    }
}

export default StoryController;
