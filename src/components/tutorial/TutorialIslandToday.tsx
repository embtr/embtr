import * as React from 'react';
import { TimelineElement } from 'resources/types/requests/Timeline';
import { useFocusEffect } from '@react-navigation/native';
import { NotificationController } from 'src/controller/notification/NotificationController';
import { Screen } from 'src/components/common/Screen';
import { TimelineCustomHooks } from 'src/controller/timeline/TimelineController';
import { TutorialIslandBanner } from './TutorialIslandBanner';
import { Button, View } from 'react-native';
import { GlobalStateCustomHooks } from 'src/redux/user/GlobalStateCustomHooks';
import { TutorialIslandPlanningWidgetImproved } from './TutorialIslandPlanningWidgetImproved';
import { TutorialIslandInvalidFlow } from 'src/model/tutorial_island/flows/TutorialIslandInvalidFlow';
import { TutorialIslandCreateHabitFlow } from 'src/model/tutorial_island/flows/TutorialIslandCreateHabitFlow';
import { TutorialIslandCompleteHabitFlow } from 'src/model/tutorial_island/flows/TutorialIslandCompleteHabitFlow';

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

    const setTutorialIslandState = GlobalStateCustomHooks.useSetTutorialIslandState();

    return (
        <Screen>
            <TutorialIslandBanner name={'Today'} />

            <View style={{ flex: 1 }}>
                <Button
                    title="Clear Create Habit Flow"
                    onPress={() => {
                        setTutorialIslandState(TutorialIslandInvalidFlow);
                    }}
                />

                <Button
                    title="Start Create Habit Flow"
                    onPress={() => {
                        setTutorialIslandState(TutorialIslandCreateHabitFlow);
                    }}
                />

                <Button
                    title="Start Complete Habit Flow"
                    onPress={() => {
                        setTutorialIslandState(TutorialIslandCompleteHabitFlow);
                    }}
                />

                <View style={{ flex: 1 }}>
                    <TutorialIslandPlanningWidgetImproved />
                </View>
            </View>
        </Screen>
    );
};
