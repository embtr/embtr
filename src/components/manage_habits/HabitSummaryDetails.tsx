import { View, Pressable } from 'react-native';
import { HabitSummaryCustomHooks } from 'src/controller/habit/HabitSummaryController';
import {
    ScheduledHabitController,
    ScheduledHabitCustomHooks,
} from 'src/controller/habit/ScheduledHabitController';
import { useEmbtrNavigation, useEmbtrRoute } from 'src/hooks/NavigationHooks';
import { Screen } from 'src/components/common/Screen';
import { Banner } from '../common/Banner';
import { Routes } from 'src/navigation/RootStackParamList';
import { HabitSummaryDetailsElement } from './HabitSummaryDetailsElement';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { HabitSummaryDetailsHeader } from './HabitSummaryDetailsHeader';

export const HabitSummaryDetails = () => {
    const navigation = useEmbtrNavigation();
    const route = useEmbtrRoute(Routes.HABIT_SUMMARY_DETAILS);

    const habitId = route.params.id;

    const habitSummary = HabitSummaryCustomHooks.useHabitSummary(habitId);
    const scheduledHabits = ScheduledHabitCustomHooks.useScheduledHabitsByHabit(habitId);

    if (!habitSummary.data || !scheduledHabits.data) {
        return (
            <Screen>
                <Banner
                    name={'Habit Summary'}
                    leftText={'close'}
                    leftOnClick={() => navigation.goBack()}
                />
            </Screen>
        );
    }

    const elements = scheduledHabits.data.map((scheduledHabit) => {
        return (
            <View key={scheduledHabit.id}>
                <Pressable
                    onPress={() => {
                        if (!scheduledHabit.id) {
                            return;
                        }

                        navigation.navigate(Routes.CREATE_EDIT_SCHEDULED_HABIT, {
                            scheduledHabitId: scheduledHabit.id,
                            onExit: () => {
                                if (!scheduledHabit.id) {
                                    return;
                                }

                                ScheduledHabitController.invalidateScheduledHabitsByHabit(habitId);
                            },
                        });
                    }}
                >
                    <HabitSummaryDetailsElement scheduledHabit={scheduledHabit} />
                </Pressable>
            </View>
        );
    });

    return (
        <Screen>
            <Banner
                name={'Manage Habit'}
                leftText={'close'}
                leftOnClick={() => navigation.goBack()}
            />

            <View style={{ padding: TIMELINE_CARD_PADDING }}>
                <HabitSummaryDetailsHeader habitSummary={habitSummary.data} />
            </View>
            <View style={{ height: TIMELINE_CARD_PADDING }} />
            <View>{elements}</View>
        </Screen>
    );
};
