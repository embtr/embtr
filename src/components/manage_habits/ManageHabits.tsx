import React from 'react';
import { HabitSummaries } from 'src/components/manage_habits/HabitSummaries';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { View, Text } from 'react-native';
import { PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
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

            {scheduledHabits.data?.length === 0 && (
                <ManageHabitsNoHabitsMessage onPress={handleNavigation} />
            )}

            <HabitSummaries scheduledHabits={scheduledHabits.data ?? []} />

            <TouchableOpacity onPress={handleNavigation}>
                <View
                    style={{
                        height: 50 - PADDING_LARGE,
                        marginHorizontal: PADDING_LARGE,
                        marginTop: PADDING_LARGE,
                        backgroundColor: colors.accent_color,
                        justifyContent: 'center',
                        borderRadius: 3,
                    }}
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
        </Screen>
    );
};
