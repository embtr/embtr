import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { USER_POST } from 'resources/endpoints';
import { Like as LikeModel, UserPost, Comment as CommentModel } from 'resources/schema';
import { CreateUserPostRequest, CreateUserPostResponse, GetAllUserPostResponse, GetUserPostResponse } from 'resources/types/requests/UserPostTypes';
import { Interactable } from 'resources/types/interactable/Interactable';
import axiosInstance from 'src/axios/axios';
import { LikeController } from 'src/controller/api/general/LikeController';
import ImageController from 'src/controller/image/ImageController';
import NotificationController, { NotificationType } from 'src/controller/notification/NotificationController';
import { Comment, TimelinePostModel } from 'src/controller/timeline/TimelineController';
import StoryDao from 'src/firebase/firestore/story/StoryDao';
import { CreateCommentRequest } from 'resources/types/requests/GeneralTypes';
import { CommentController } from 'src/controller/api/general/CommentController';

export interface StoryModel extends TimelinePostModel {
    data: {
        userPost: UserPost;
        title: string;
        story: string;
        images: string[];
    };
}

export const timelineEntryWasLikedBy = (likes: LikeModel[], uid: string): boolean => {
    let isLiked = false;
    likes.forEach((like) => {
        if (like.user?.uid === uid) {
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
            userPost: story.data.userPost,
            title: story.data.title,
            story: story.data.story,
            images: [...story.data.images],
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
            userPost: {},
            title: title,
            story: story,
            images: images,
        },
    };
};

class StoryController {
    public static async getAllViaApi(): Promise<UserPost[]> {
        return await axiosInstance
            .get(`${USER_POST}`)
            .then((success) => {
                const response = success.data as GetAllUserPostResponse;
                return response.userPosts ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

    public static async getViaApi(id: number) {
        return await axiosInstance
            .get(`${USER_POST}${id}`)
            .then((success) => {
                const response = success.data as GetUserPostResponse;
                return response.userPost;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async createViaApi(title: string, body: string, images: string[]) {
        const request: CreateUserPostRequest = {
            userPost: {
                title,
                body,
                images: images.map((image) => {
                    return {
                        url: image,
                    };
                }),
            },
        };

        return await axiosInstance
            .post(`${USER_POST}`, request)
            .then((success) => {
                const response: CreateUserPostResponse = success.data;
                return response.userPost;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async addLikeViaApi(id: number) {
        return await LikeController.add(Interactable.USER_POST, id);
    }

    public static async addCommentViaApi(id: number, comment: string) {
        return await CommentController.add(Interactable.USER_POST, id, comment);
    }

    public static async deleteCommentViaApi(comment: CommentModel) {
        return await CommentController.delete(Interactable.USER_POST, comment);
    }

    /*
     * OLD LOGIC
     */
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

    public static async likeStory(story: StoryModel, userUid: string) {
        if (!story.id) {
            return;
        }

        await StoryDao.likeStory(story.id, userUid);
        NotificationController.addNotification(userUid, story.uid, NotificationType.TIMELINE_LIKE, story.id);
    }

    public static addComment(id: string, uid: string, commentText: string, callback: Function) {
        StoryDao.addComment(id, uid, commentText).then(() => {
            callback();
        });
    }

    public static async deleteComment(story: StoryModel, commentToDelete: Comment) {
        const comments: Comment[] = [];

        story.public.comments.forEach((comment) => {
            if (
                comment.uid === commentToDelete.uid &&
                comment.comment === comment.comment &&
                comment.timestamp.toString() === commentToDelete.timestamp.toString()
            ) {
                return;
            }

            comments.push(comment);
        });

        story.public.comments = comments;
        await this.update(story);
    }

    public static async uploadImages(imageUploadProgess?: Function): Promise<string[]> {
        const imgUrls: string[] = await ImageController.pickAndUploadImages('user_posts', imageUploadProgess);
        return imgUrls;
    }
}

export default StoryController;
