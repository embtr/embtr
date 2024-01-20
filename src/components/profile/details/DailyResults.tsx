import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import React from 'react';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { RouteProp, useRoute } from '@react-navigation/native';
import { FilteredTimeline } from 'src/components/timeline/FilteredTimeline';
import {
    TimelineController,
    TimelineCustomHooks,
} from 'src/controller/timeline/TimelineController';
import { TimelineElement } from 'resources/types/requests/Timeline';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';

export const DailyResults = () => {
    const navigation = useEmbtrNavigation();
    const route = useRoute<RouteProp<TimelineTabScreens, 'UserPosts'>>();
    const userId = route.params.userId;

    const timelineElements = TimelineCustomHooks.usePlannedDayResultTimelineData(userId);

    const timelineData: TimelineElement[] = [];
    timelineElements.data?.pages.forEach((page) => {
        timelineData.push(...(page?.elements ?? []));
    });

    return (
        <Screen>
            <Banner
                name="Daily Results"
                leftText="back"
                leftOnClick={async () => {
                    navigation.goBack();
                }}
            />

            <FilteredTimeline
                timelineElements={timelineData}
                hasMore={timelineElements.hasNextPage ?? false}
                pullToRefresh={async () => {
                    await TimelineController.invalidateUserPostsCache(userId);
                }}
                loadMore={timelineElements.fetchNextPage}
            />
        </Screen>
    );
};
