import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { USER_POST } from 'resources/endpoints';
import { Like as LikeModel, UserPost, Comment as CommentModel, Image } from 'resources/schema';
import {
    CreateUserPostRequest,
    CreateUserPostResponse,
    GetAllUserPostResponse,
    GetUserPostResponse,
    UpdateUserPostRequest,
} from 'resources/types/requests/UserPostTypes';
import { Interactable } from 'resources/types/interactable/Interactable';
import axiosInstance from 'src/axios/axios';
import { LikeController } from 'src/controller/api/general/LikeController';
import ImageController from 'src/controller/image/ImageController';
import NotificationController, { NotificationType } from 'src/controller/notification/NotificationController';
import { CommentController } from 'src/controller/api/general/CommentController';
import { TimelinePostModel } from 'src/model/OldModels';

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
    public static async getAllForUser(userId: number): Promise<UserPost[]> {
        return await axiosInstance
            .get(`/user/${userId}/posts`)
            .then((success) => {
                const response = success.data as GetAllUserPostResponse;
                return response.userPosts ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

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

    public static async deleteViaApi(userPost: UserPost) {
        userPost.active = false;
        return this.updateViaApi(userPost);
    }

    public static async updateViaApi(userPost: UserPost) {
        const request: UpdateUserPostRequest = {
            userPost,
        };

        return await axiosInstance
            .patch(`${USER_POST}`, request)
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

    public static async uploadImages(imageUploadProgess?: Function): Promise<string[]> {
        const imgUrls: string[] = await ImageController.pickAndUploadImages('user_posts', imageUploadProgess);
        return imgUrls;
    }
}

export default StoryController;
