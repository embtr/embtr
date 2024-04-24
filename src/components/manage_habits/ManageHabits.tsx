import React from 'react';
import { HabitSummaries } from 'src/components/manage_habits/HabitSummaries';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { View, Text } from 'react-native';
import { CARD_SHADOW, PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { RefreshControl, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Routes } from 'src/navigation/RootStackParamList';
import { useTheme } from '../theme/ThemeProvider';
import {
    ScheduledHabitController,
    ScheduledHabitCustomHooks,
} from 'src/controller/habit/ScheduledHabitController';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { ManageHabitsNoHabitsMessage } from './ManageHabitsNoHabitsMessage';

export const ManageHabits = () => {
    const colors = useTheme().colors;
    const navigation = useEmbtrNavigation();

    const scheduledHabits = ScheduledHabitCustomHooks.useActive();

    const handleNavigation = () => {
        navigation.navigate(Routes.CREATE_EDIT_SCHEDULED_HABIT_SLIDE_UP, {
            isCreateCustomHabit: true,
            onExit: () => {
                ScheduledHabitController.invalidateActiveScheduledHabits();
            },
        });
    };

    return (
        <Screen>
            <Banner name={'My Habits'} />

            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={scheduledHabits.isLoading}
                            onRefresh={() => {
                                scheduledHabits.refetch();
                            }}
                        />
                    }
                >
                    <View style={{ flex: 1 }}>
                        {scheduledHabits.data?.length === 0 && (
                            <View style={{ paddingTop: PADDING_LARGE * 2 }}>
                                <ManageHabitsNoHabitsMessage onPress={handleNavigation} />
                            </View>
                        )}

                        <HabitSummaries scheduledHabits={scheduledHabits.data ?? []} />
                    </View>
                </ScrollView>

                <TouchableOpacity onPress={handleNavigation}>
                    <View
                        style={[
                            {
                                height: 50 - PADDING_LARGE,
                                marginHorizontal: PADDING_LARGE,
                                marginTop: PADDING_LARGE,
                                backgroundColor: colors.accent_color,
                                justifyContent: 'center',
                                borderRadius: 3,
                            },
                            CARD_SHADOW,
                        ]}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                color: colors.text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 16,
                            }}
                        >
                            Add New Habit
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={{ height: PADDING_LARGE * 2 }} />
            </View>
        </Screen>
    );
};
