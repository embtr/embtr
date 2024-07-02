import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { TutorialIslandBanner } from './TutorialIslandBanner';
import { Button, View } from 'react-native';
import { GlobalStateCustomHooks } from 'src/redux/user/GlobalStateCustomHooks';
import {
    TutorialIslandFlow,
    TutorialIslandOption,
} from 'src/model/tutorial_island/TutorialIslandModels';
import { TutorialIslandElement } from './TutorialIslandElement';

export const TutorialIslandTimeline = () => {
    const setTutorialIslandFlow = GlobalStateCustomHooks.useSetTutorialIslandFlow();

    return (
        <Screen>
            <TutorialIslandBanner
                name={'Timeline'}
                leftIcon={'people-outline'}
                leftRoute={'UserSearch'}
                innerLeftIcon={'add-outline'}
                rightIcon={'notifications-outline'}
                rightRoute={'Notifications'}
            />

            <View style={{ flex: 1 }}>
                <Button
                    title="Clear Create Habit Flow"
                    onPress={() => {
                        setTutorialIslandFlow(TutorialIslandFlow.INVALID);
                    }}
                />
                <View style={{ height: 10 }} />

                <Button
                    title="Start Create Habit Flow"
                    onPress={() => {
                        setTutorialIslandFlow(TutorialIslandFlow.CREATE_HABIT);
                    }}
                />

                <View style={{ height: 10 }} />

                <Button
                    title="Start Complete Habit Flow"
                    onPress={() => {
                        setTutorialIslandFlow(TutorialIslandFlow.COMPLETE_HABIT);
                    }}
                />

                <View style={{ height: 10 }} />

                <TutorialIslandElement
                    style={{ height: 50, width: 50 }}
                    onPress={() => {
                        alert('SUPER SECRET BUTTON');
                        setTutorialIslandFlow(TutorialIslandFlow.COMPLETE_HABIT);
                    }}
                    option={TutorialIslandOption.SUPER_SECRET_OPTION}
                >
                    <View style={{ height: 50, width: 50, backgroundColor: 'red' }} />
                </TutorialIslandElement>
            </View>
        </Screen>
    );
};
