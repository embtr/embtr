import React from 'react';
import { View } from 'react-native';
import UserController, { UserCustomHooks } from 'src/controller/user/UserController';
import { Screen } from '../common/Screen';
import { PADDING_LARGE } from 'src/util/constants';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { HabitStreakController } from 'src/controller/habit_streak/HabitStreakController';
import { User } from 'resources/schema';
import { ActiveChallengesWidget } from '../widgets/challenges/ActiveChallengesWidget';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { HabitStreakWidget } from '../widgets/habit_streak/HabitStreakWidget';
import { QuoteOfTheDayWidget } from '../widgets/quote_of_the_day/QuoteOfTheDayWidget';
import { OnHabitStreakWidget } from '../widgets/OnHabitStreakWidget';
import { PointsWidget } from '../widgets/PointsWidget';

const onRefresh = (user: User, setRefreshing: Function) => {
    setRefreshing(true);
    HabitStreakController.invalidateHabitStreak(user.id ?? 0);
    HabitStreakController.invalidateAdvancedHabitStreak(user.id ?? 0);
    UserController.invalidateNewUserChecklist();
    ChallengeController.invalidateActiveParticipation(user.id ?? 0);

    setTimeout(() => {
        setRefreshing(false);
    }, 500);
};

export const Journey = () => {
    const currentUser = UserCustomHooks.useCurrentUser();
    const [refreshing, setRefreshing] = React.useState(false);

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
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                if (!currentUser.data) {
                                    return;
                                }

                                onRefresh(currentUser.data, setRefreshing);
                            }}
                        />
                    }
                >
                    <View
                        style={{ height: '100%', width: '100%', paddingHorizontal: PADDING_LARGE }}
                    >
                        <PointsWidget user={currentUser.data} />
                        <OnHabitStreakWidget user={currentUser.data} />
                        <HabitStreakWidget user={currentUser.data} />
                        <ActiveChallengesWidget userId={currentUser.data.id ?? 0} />
                    </View>
                </ScrollView>
            </View>
        </Screen>
    );
};
