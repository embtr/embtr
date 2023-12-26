import * as React from 'react';
import { FilteredTimeline } from './FilteredTimeline';
import { TimelineElementType, TimelineRequestCursor } from 'resources/types/requests/Timeline';
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

    const userPosts: UserPost[] = [];
    const plannedDayResults: PlannedDayResult[] = [];
    timelineElements.data?.pages.forEach((page) => {
        if (!page?.results) {
            return;
        }

        page.results.forEach((result) => {
            if (result.type === TimelineElementType.USER_POST && result.userPost) {
                userPosts.push(result.userPost);
            } else if (
                result.type === TimelineElementType.PLANNED_DAY_RESULT &&
                result.plannedDayResult
            ) {
                plannedDayResults.push(result.plannedDayResult);
            }
        });
    });

    return (
        <Screen>
            <Banner
                name={'Timeline' + ': ' + userPosts.length}
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
                userPosts={userPosts}
                plannedDayResults={plannedDayResults}
                hasMore={timelineElements?.hasNextPage ?? false}
                pullToRefresh={async () => {
                    await TimelineController.invalidate();
                }}
                loadMore={timelineElements.fetchNextPage}
            />
        </Screen>
    );
};
