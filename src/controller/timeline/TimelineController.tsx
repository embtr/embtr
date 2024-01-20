import {
    GetTimelineResponse,
    GetTimelineUserPostsResponse,
    TimelineData,
    TimelineElement,
    TimelineRequestCursor,
} from 'resources/types/requests/Timeline';
import axiosInstance from 'src/axios/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';

const PAGE_SIZE = 10;

export class TimelineController {
    public static async fetch(cursor: TimelineRequestCursor): Promise<TimelineData | undefined> {
        return await axiosInstance
            .get(`/timeline/v1/`, {
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

    public static async fetchTimelinePostsForUser(
        userId: number,
        cursor: TimelineRequestCursor
    ): Promise<TimelineData | undefined> {
        return await axiosInstance
            .get(`/user/v1/${userId}/timeline-posts/`, {
                params: {
                    cursor: cursor.cursor,
                    limit: cursor.limit,
                },
            })
            .then((success) => {
                const response: GetTimelineUserPostsResponse = success.data;
                return response.timelineData;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async fetchTimelinePlannedDayResultsForUser(
        userId: number,
        cursor: TimelineRequestCursor
    ): Promise<TimelineData | undefined> {
        return await axiosInstance
            .get(`/user/v1/${userId}/timeline-day-results/`, {
                params: {
                    cursor: cursor.cursor,
                    limit: cursor.limit,
                },
            })
            .then((success) => {
                const response: GetTimelineUserPostsResponse = success.data;
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

    public static async invalidateUserPostsCache(userId: number) {
        await reactQueryClient.invalidateQueries(['userPostsTimelineData', userId]);
    }

    public static async clearUserPostsCache(userId: number) {
        reactQueryClient.removeQueries(['userPostsTimelineData', userId]);
    }

    public static async invalidatePlannedDayResultsCache(userId: number) {
        await reactQueryClient.invalidateQueries(['plannedDayResultsTimelineData', userId]);
    }

    public static async clearPlannedDayResultsCache(userId: number) {
        reactQueryClient.removeQueries(['plannedDayResultsTimelineData', userId]);
    }
}

export namespace TimelineCustomHooks {
    export const usePlannedDayResultTimelineData = (userId: number) => {
        const fetch = async ({
            pageParam = {
                cursor: new Date(),
                limit: PAGE_SIZE,
            },
        }) => {
            return await TimelineController.fetchTimelinePlannedDayResultsForUser(
                userId,
                pageParam
            );
        };

        const { status, fetchNextPage, hasNextPage, fetchStatus, error, data } = useInfiniteQuery({
            queryKey: ['plannedDayResultsTimelineData', userId],
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
                    limit: PAGE_SIZE,
                };

                return cursor;
            },
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            keepPreviousData: true,
        });

        return {
            isLoading: status === 'loading' && fetchStatus !== 'idle',
            data,
            fetchNextPage,
            hasNextPage,
        };
    };

    export const useUserPostsTimelineData = (userId: number) => {
        const fetch = async ({
            pageParam = {
                cursor: new Date(),
                limit: PAGE_SIZE,
            },
        }) => {
            return await TimelineController.fetchTimelinePostsForUser(userId, pageParam);
        };

        const { status, fetchNextPage, hasNextPage, fetchStatus, error, data } = useInfiniteQuery({
            queryKey: ['userPostsTimelineData', userId],
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
                    limit: PAGE_SIZE,
                };

                return cursor;
            },
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            keepPreviousData: true,
        });

        return {
            isLoading: status === 'loading' && fetchStatus !== 'idle',
            data,
            fetchNextPage,
            hasNextPage,
        };
    };

    export const useTimelineData = () => {
        const fetch = async ({
            pageParam = {
                cursor: new Date(),
                limit: PAGE_SIZE,
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
                    limit: PAGE_SIZE,
                };

                return cursor;
            },
            staleTime: ReactQueryStaleTimes.INSTANTLY,
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
