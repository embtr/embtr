import {
    GetTimelineResponse,
    TimelineData,
    TimelineElement,
    TimelineRequestCursor,
} from 'resources/types/requests/Timeline';
import axiosInstance from 'src/axios/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { UserPost } from 'resources/schema';

export class TimelineController {
    public static async fetch(cursor: TimelineRequestCursor): Promise<TimelineData | undefined> {
        return await axiosInstance
            .get(`/timeline`, {
                params: {
                    cursor: cursor.cursor,
                    limit: cursor.limit,
                },
            })
            .then((success) => {
                const response: GetTimelineResponse = success.data;
                return response.timelineData;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async clearCache() {
        reactQueryClient.removeQueries(['timelineData']);
    }

    public static async invalidateCache() {
        await reactQueryClient.invalidateQueries(['timelineData']);
    }

    public static async likePostInCache(userPostId: number) {
        const currentData = reactQueryClient.getQueryData(['timelineData']);
        console.log(currentData);
    }
}

export namespace TimelineCustomHooks {
    export const useTimelineData = () => {
        const fetch = async ({
            pageParam = {
                cursor: new Date(),
                limit: 5,
            },
        }) => {
            return await TimelineController.fetch(pageParam);
        };

        const { status, fetchNextPage, hasNextPage, fetchStatus, error, data } = useInfiniteQuery({
            queryKey: ['timelineData'],
            queryFn: fetch,
            getNextPageParam: (lastPage) => {
                if (!lastPage) {
                    return undefined;
                }

                if (lastPage.elements.length == 0) {
                    return undefined;
                }

                const lastElement: TimelineElement =
                    lastPage.elements[lastPage.elements.length - 1];

                const cursor: TimelineRequestCursor = {
                    cursor: lastElement.createdAt,
                    limit: 5,
                };

                return cursor;
            },
            staleTime: ReactQueryStaleTimes.INFINITY,
            keepPreviousData: true,
        });

        return {
            isLoading: status === 'loading' && fetchStatus !== 'idle',
            data,
            fetchNextPage,
            hasNextPage,
        };
    };
}
