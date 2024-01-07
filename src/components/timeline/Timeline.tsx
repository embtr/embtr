import * as React from 'react';
import { FilteredTimeline } from './FilteredTimeline';
import { TimelineElement, TimelineElementType } from 'resources/types/requests/Timeline';
import { Banner } from 'src/components/common/Banner';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import {
    NotificationController,
    NotificationCustomHooks,
} from 'src/controller/notification/NotificationController';
import { Screen } from 'src/components/common/Screen';
import {
    TimelineController,
    TimelineCustomHooks,
} from 'src/controller/timeline/TimelineController';
import { PlannedDayResult, UserPost } from 'resources/schema';

export const Timeline = () => {
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();
    const unreadNotificationCount = NotificationCustomHooks.useUnreadNotificationCount();

    useFocusEffect(
        React.useCallback(() => {
            NotificationController.prefetchUnreadNotificationCount();
        }, [])
    );

    const timelineElements = TimelineCustomHooks.useTimelineData();

    const timelineData: TimelineElement[] = [];
    timelineElements.data?.pages.forEach((page) => {
        timelineData.push(...(page?.elements ?? []));
    });

    console.log(timelineData[0]?.userPost?.comments?.length);

    return (
        <Screen>
            <Banner
                name={'Timeline'}
                leftIcon={'people-outline'}
                leftRoute={'UserSearch'}
                innerLeftIcon={'add-outline'}
                innerLeftOnClick={() => {
                    navigation.navigate('CreateUserPost');
                }}
                rightIcon={'notifications-outline'}
                rightRoute={'Notifications'}
                rightIconNotificationCount={unreadNotificationCount.data ?? 0}
            />
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
