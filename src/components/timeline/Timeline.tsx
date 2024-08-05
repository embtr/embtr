import * as React from 'react';
import { FilteredTimeline } from './FilteredTimeline';
import { TimelineElement } from 'resources/types/requests/Timeline';
import { Screen } from 'src/components/common/Screen';
import {
    TimelineController,
    TimelineCustomHooks,
} from 'src/controller/timeline/TimelineController';

export const Timeline = () => {
    const timelineElements = TimelineCustomHooks.useTimelineData();

    const timelineData: TimelineElement[] = [];
    timelineElements.data?.pages.forEach((page) => {
        timelineData.push(...(page?.elements ?? []));
    });

    return (
        <Screen>
            <FilteredTimeline
                timelineElements={timelineData}
                hasMore={timelineElements?.hasNextPage ?? false}
                pullToRefresh={async () => {
                    await TimelineController.invalidateCache();
                }}
                loadMore={timelineElements.fetchNextPage}
            />
        </Screen>
    );
};
