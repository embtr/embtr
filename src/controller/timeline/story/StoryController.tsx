import { USER_POST } from 'resources/endpoints';
import { UserPost, Comment as CommentModel } from 'resources/schema';
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
import { CommentController } from 'src/controller/api/general/CommentController';
import { TimelinePostModel } from 'src/model/OldModels';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';

export interface StoryModel extends TimelinePostModel {
    data: {
        userPost: UserPost;
        title: string;
        story: string;
        images: string[];
    };
}

class StoryController {
    public static async getPosts(userId: number): Promise<UserPost[]> {
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
            .post(`${USER_POST}v1`, request)
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
            .patch(`${USER_POST}v1`, request)
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
        const imgUrls: string[] = await ImageController.pickAndUploadImages(
            'user_posts',
            imageUploadProgess
        );
        return imgUrls;
    }

    public static async invalidate(id: number) {
        reactQueryClient.invalidateQueries(['story', id]);
    }

    public static async setCache(id: number, story: StoryModel) {
        reactQueryClient.setQueryData(['story', id], story);
    }
}

export default StoryController;

export namespace StoryCustomHooks {
    export const useStory = (id?: number) => {
        const enabled = !!id && id > 0;
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['story', id],
            queryFn: async () => await StoryController.getViaApi(id ?? 0),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            enabled: enabled,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
