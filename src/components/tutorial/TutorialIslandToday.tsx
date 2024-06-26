import * as React from 'react';
import { TimelineElement } from 'resources/types/requests/Timeline';
import { useFocusEffect } from '@react-navigation/native';
import { NotificationController } from 'src/controller/notification/NotificationController';
import { Screen } from 'src/components/common/Screen';
import { TimelineCustomHooks } from 'src/controller/timeline/TimelineController';
import { TutorialIslandBanner } from './TutorialIslandBanner';
import { Button, View } from 'react-native';
import { GlobalStateCustomHooks } from 'src/redux/user/GlobalStateCustomHooks';
import { TutorialIslandFlow } from 'src/model/TutorialIslandModels';

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
                        setTutorialIslandState(TutorialIslandFlow.INVALID);
                    }}
                />
                <View style={{ height: 10 }} />

                <Button
                    title="Start Create Habit Flow"
                    onPress={() => {
                        setTutorialIslandState(TutorialIslandFlow.CREATE_HABIT);
                    }}
                />

                <View style={{ height: 10 }} />

                <Button
                    title="Start Complete Habit Flow"
                    onPress={() => {
                        setTutorialIslandState(TutorialIslandFlow.COMPLETE_HABIT);
                    }}
                />
            </View>
        </Screen>
    );
};
