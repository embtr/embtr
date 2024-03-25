import React from 'react';
import { View } from 'react-native';
import { UserCustomHooks } from 'src/controller/user/UserController';
import { Screen } from '../common/Screen';
import { Banner } from '../common/Banner';
import { PADDING_LARGE } from 'src/util/constants';
import { HabitStreakWidget } from '../widgets/habit_streak/HabitStreakWidget';

export const Journey = () => {
    const currentUser = UserCustomHooks.useCurrentUser();

    if (!currentUser.data) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    return (
        <Screen>
            <View style={{ flex: 1 }}>
                <Banner name="My Journey" />

                <View style={{ height: '100%', width: '100%', paddingHorizontal: PADDING_LARGE }}>
                    <HabitStreakWidget user={currentUser.data} />
                </View>
            </View>
        </Screen>
    );
};
