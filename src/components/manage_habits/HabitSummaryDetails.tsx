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
import { PADDING_LARGE } from 'src/util/constants';
import { HabitSummaryDetailsHeader } from './HabitSummaryDetailsHeader';
import { ScheduledHabit } from 'resources/schema';
import { Checkbox } from 'src/components/checkbox/Checkbox';
import React from 'react';
import { getDayKey, getTodayKey } from 'src/controller/planning/PlannedDayController';
import { PureDate } from 'resources/types/date/PureDate';

export const HabitSummaryDetails = () => {
    const navigation = useEmbtrNavigation();
    const route = useEmbtrRoute(Routes.HABIT_SUMMARY_DETAILS);
    const [showExpired, setShowExpired] = React.useState<boolean>(false);

    const habitId = route.params.id;

    const habitSummary = HabitSummaryCustomHooks.useHabitSummary(habitId);
    const scheduledHabits = ScheduledHabitCustomHooks.useScheduledHabitsByHabit(habitId);
    const currentDayKey = getTodayKey();
    const filteredScheduledHabits = !showExpired
        ? scheduledHabits.data?.filter((scheduledHabit) => {
            if (!scheduledHabit.endDate) {
                return true;
            }

            const pureCurrentDayKey = PureDate.fromString(currentDayKey);
            const pureScheduledHabitEndDate = PureDate.fromDateFromServer(scheduledHabit.endDate);
            const isExpired = pureScheduledHabitEndDate < pureCurrentDayKey;

            return !isExpired;
        })
        : scheduledHabits.data;

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

            <View style={{ padding: PADDING_LARGE }}>
                <HabitSummaryDetailsHeader habitSummary={habitSummary.data} />
            </View>

            <FlatList
                data={filteredScheduledHabits}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
            />
        </Screen>
    );
};
