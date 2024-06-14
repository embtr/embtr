import { Text, View } from 'react-native';
import { Screen } from '../common/Screen';
import { Banner } from '../common/Banner';
import { useEmbtrNavigation, useEmbtrRoute } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import {
    ScheduledHabitController,
    ScheduledHabitCustomHooks,
} from 'src/controller/habit/ScheduledHabitController';
import { HabitSummaryElementImproved } from '../manage_habits/HabitSummaryElementImproved';
import { ScheduledHabit, User } from 'resources/schema';
import { HabitStreakWidget } from '../widgets/habit_streak/HabitStreakWidget';
import { UserCustomHooks } from 'src/controller/user/UserController';
import { PADDING_LARGE } from 'src/util/constants';

interface Props {
    user: User;
    scheduledHabit: ScheduledHabit;
}

export const HabitDetailsImpl = ({ user, scheduledHabit }: Props) => {
    const navigation = useEmbtrNavigation();

    const navigateToEdit = () => {
        navigation.navigate(Routes.CREATE_EDIT_SCHEDULED_HABIT, {
            scheduledHabitId: scheduledHabit.id,
            onExit: () => {
                ScheduledHabitController.invalidateActiveScheduledHabits();
            },
        });
    };

    return (
        <Screen>
            <View style={{ flex: 1 }}>
                <Banner
                    name="Habit Details"
                    leftIcon="arrow-back"
                    leftRoute="BACK"
                    rightText="edit"
                    rightOnClick={navigateToEdit}
                />
                <HabitSummaryElementImproved scheduledHabit={scheduledHabit} />
                <View style={{ paddingHorizontal: PADDING_LARGE }}>
                    <HabitStreakWidget user={user} taskId={scheduledHabit.taskId ?? 0} />
                </View>
            </View>
        </Screen>
    );
};

export const HabitDetails = () => {
    const route = useEmbtrRoute(Routes.HABIT_DETAILS);
    const id = route.params?.id;

    const user = UserCustomHooks.useCurrentUser();
    const scheduledHabit = ScheduledHabitCustomHooks.useScheduledHabit(id);
    if (!user.data || !scheduledHabit.data) {
        return (
            <Screen>
                <View style={{ flex: 1 }}>
                    <Banner name="Habit Details" leftIcon="arrow-back" leftRoute="BACK" />
                </View>
            </Screen>
        );
    }

    return <HabitDetailsImpl user={user.data} scheduledHabit={scheduledHabit.data} />;
};
