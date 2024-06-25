import * as React from 'react';
import { TimelineElement } from 'resources/types/requests/Timeline';
import { Banner } from 'src/components/common/Banner';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import {
    NotificationController,
    NotificationCustomHooks,
} from 'src/controller/notification/NotificationController';
import { Screen } from 'src/components/common/Screen';
import { TimelineCustomHooks } from 'src/controller/timeline/TimelineController';

export const TutorialIslandTimeline = () => {
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
        </Screen>
    );
};
