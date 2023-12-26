import {
    GetTimelineResponse,
    TimelineElement,
    TimelineRequestCursor,
} from 'resources/types/requests/Timeline';
import axiosInstance from 'src/axios/axios';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';

export class TimelineController {
    public static async fetch(cursor: TimelineRequestCursor) {
        return await axiosInstance
            .get(`/timeline`, {
                params: {
                    cursor: cursor.cursor,
                    limit: cursor.limit,
                },
            })
            .then((success) => {
                const results: GetTimelineResponse = success.data;
                return results;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async invalidate() {
        await reactQueryClient.invalidateQueries(['timelineData']);
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

                if (lastPage.results.length == 0) {
                    return undefined;
                }

                const lastElement: TimelineElement = lastPage.results[lastPage.results.length - 1];

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
