import * as React from 'react';
import { TimelineElement } from 'resources/types/requests/Timeline';
import { useFocusEffect } from '@react-navigation/native';
import { NotificationController } from 'src/controller/notification/NotificationController';
import { Screen } from 'src/components/common/Screen';
import { TimelineCustomHooks } from 'src/controller/timeline/TimelineController';
import { TutorialIslandBanner } from './TutorialIslandBanner';
import { View } from 'react-native';
import { TutorialIslandPlanningWidgetImproved } from './TutorialIslandPlanningWidgetImproved';
import { PADDING_LARGE } from 'src/util/constants';
import { GlobalStateCustomHooks } from 'src/redux/user/GlobalStateCustomHooks';

export const TutorialIslandToday = () => {
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

    const skipTutorialIsland = GlobalStateCustomHooks.useSkipTutorialIsland();

    return (
        <Screen>
            <TutorialIslandBanner
                name={'Today'}
                rightButton="Skip Tutorial"
                rightOnClick={skipTutorialIsland}
            />

            <View style={{ flex: 1, paddingHorizontal: PADDING_LARGE }}>
                <TutorialIslandPlanningWidgetImproved />
            </View>
        </Screen>
    );
};
