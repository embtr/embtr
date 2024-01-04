import { View, Pressable, FlatList } from 'react-native';
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
import { ScheduledHabit } from 'resources/schema';

export const HabitSummaryDetails = () => {
    const navigation = useEmbtrNavigation();
    const route = useEmbtrRoute(Routes.HABIT_SUMMARY_DETAILS);

    const habitId = route.params.id;

    const habitSummary = HabitSummaryCustomHooks.useHabitSummary(habitId);
    const scheduledHabits = ScheduledHabitCustomHooks.useScheduledHabitsByHabit(habitId);

    if (!habitSummary.data || !scheduledHabits.data) {
        return (
            <Screen>
                <Banner leftRoute="BACK" leftIcon={'arrow-back'} name={'Manage Habit'} />
            </Screen>
        );
    }

    const renderItem = ({ item }: { item: ScheduledHabit }) => {
        return (
            <Pressable
                onPress={() => {
                    if (!item.id) {
                        return;
                    }

                    navigation.navigate(Routes.CREATE_EDIT_SCHEDULED_HABIT, {
                        scheduledHabitId: item.id,
                        onExit: () => {
                            if (!item.id) {
                                return;
                            }

                            ScheduledHabitController.invalidateScheduledHabitsByHabit(habitId);
                        },
                    });
                }}
            >
                <HabitSummaryDetailsElement scheduledHabit={item} />
            </Pressable>
        );
    };

    const keyExtractor = (item: ScheduledHabit, index: number) => {
        return item.id ? item.id.toString() : '';
    };

    return (
        <Screen>
            <Banner leftRoute="BACK" leftIcon={'arrow-back'} name={'Manage Habit'} />

            <View style={{ padding: TIMELINE_CARD_PADDING }}>
                <HabitSummaryDetailsHeader habitSummary={habitSummary.data} />
            </View>
            <FlatList
                data={scheduledHabits.data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
            />
        </Screen>
    );
};
