import { View, Text, Pressable } from 'react-native';
import { HabitSummaryCustomHooks } from 'src/controller/habit/HabitSummaryController';
import { ScheduledHabitCustomHooks } from 'src/controller/habit/ScheduledHabitController';
import { useEmbtrNavigation, useEmbtrRoute } from 'src/hooks/NavigationHooks';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Banner } from '../common/Banner';
import { Routes } from 'src/navigation/RootStackParamList';
import { HabitSummaryDetailsElement } from './HabitSummaryDetailsElement';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';

export const HabitSummaryDetails = () => {
    const colors = useTheme().colors;
    const navigation = useEmbtrNavigation();
    const route = useEmbtrRoute(Routes.HABIT_SUMMARY_DETAILS);

    const habitSummary = HabitSummaryCustomHooks.useHabitSummary(route.params.id);
    const scheduledHabits = ScheduledHabitCustomHooks.useScheduledHabitsByHabit(route.params.id);

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

            <View style={{ height: TIMELINE_CARD_PADDING }} />
            <View>{elements}</View>
        </Screen>
    );
};
