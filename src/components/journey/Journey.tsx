import React from 'react';
import { View } from 'react-native';
import UserController, { UserCustomHooks } from 'src/controller/user/UserController';
import { Screen } from '../common/Screen';
import { Banner } from '../common/Banner';
import { PADDING_LARGE } from 'src/util/constants';
import { HabitStreakWidget } from '../widgets/habit_streak/HabitStreakWidget';
import { NewUserChecklistWidget } from '../widgets/new_user_checklist/NewUserChecklistWidget';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { HabitStreakController } from 'src/controller/habit_streak/HabitStreakController';
import { User } from 'resources/schema';
import { NewUserCustomHooks } from 'src/controller/new_user/NewUserController';

const onRefresh = (user: User, setRefreshing: Function) => {
    setRefreshing(true);
    HabitStreakController.invalidateHabitStreak(user.id ?? 0);
    UserController.invalidateNewUserChecklist();

    setTimeout(() => {
        setRefreshing(false);
    }, 500);
};

interface Props {
    hasFinishedChecklist: boolean;
}

const JourneyImpl = ({ hasFinishedChecklist }: Props) => {
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
                <Banner name="My Journey" />

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
                        {!hasFinishedChecklist ? (
                            <NewUserChecklistWidget />
                        ) : (
                            <HabitStreakWidget user={currentUser.data} />
                        )}
                    </View>
                </ScrollView>
            </View>
        </Screen>
    );
};

export const Journey = () => {
    const hasFinishedChecklist = NewUserCustomHooks.useUserHasFinishedNewUserChecklist();
    return <JourneyImpl hasFinishedChecklist={hasFinishedChecklist} />;
};
