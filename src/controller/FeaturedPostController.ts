import axiosInstance from 'src/axios/axios';
import { CommentController } from './api/general/CommentController';
import { Interactable } from 'resources/types/interactable/Interactable';
import { Comment } from 'resources/schema';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { GetFeaturedPostResponse } from 'resources/types/requests/FeaturedPostTypes';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';

export class FeaturedPostController {
    public static async get(id: number) {
        return axiosInstance
            .get<GetFeaturedPostResponse>(`/featured-post/${id}`)
            .then((response) => {
                return response.data.featuredPost;
            })
            .catch(() => {
                return undefined;
            });
    }

    public static async like(featuredPostId: number) {
        return axiosInstance
            .post(`/featured-post/${featuredPostId}/like`)
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }

    public static async comment(featuredPostId: number, comment: string) {
        const addedComment = await CommentController.add(
            Interactable.FEATURED_POST,
            featuredPostId,
            comment
        );

        return addedComment;
    }

    public static async deleteComment(comment: Comment) {
        return await CommentController.delete(Interactable.FEATURED_POST, comment);
    }

    public static invalidate(id: number) {
        reactQueryClient.invalidateQueries(['featuredPost', id]);
    }
}

export namespace FeaturedPostCustomHooks {
    export const useFeaturedPost = (id?: number) => {
        const enabled = !!id && id > 0;

        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['featuredPost', id],
            queryFn: async () => await FeaturedPostController.get(id ?? 0),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            enabled: enabled,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
