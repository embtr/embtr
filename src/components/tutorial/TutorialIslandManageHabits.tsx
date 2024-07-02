import React from 'react';
import { HabitSummaries } from 'src/components/manage_habits/HabitSummaries';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { View, Text } from 'react-native';
import { PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { TutorialIslandRoutes } from 'src/navigation/RootStackParamList';
import { useTheme } from '../theme/ThemeProvider';
import {
    ScheduledHabitController,
    ScheduledHabitCustomHooks,
} from 'src/controller/habit/ScheduledHabitController';
import { useEmbtrTutorialIslandNavigation } from 'src/hooks/NavigationHooks';
import { ManageHabitsNoHabitsMessage } from '../manage_habits/ManageHabitsNoHabitsMessage';
import { TutorialIslandElement } from './TutorialIslandElement';
import { TutorialIslandOptionKey } from 'src/model/tutorial_island/TutorialIslandModels';

export const TutorialIslandManageHabits = () => {
    const colors = useTheme().colors;
    const navigation = useEmbtrTutorialIslandNavigation();

    const scheduledHabits = ScheduledHabitCustomHooks.useActive();

    const handleNavigation = () => {
        navigation.navigate(TutorialIslandRoutes.TUTORIAL_ISLAND_CREATE_EDIT_SCHEDULED_HABIT, {
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
                {scheduledHabits.data?.length === 0 && (
                    <TutorialIslandElement
                        optionKey={TutorialIslandOptionKey.MY_HABITS__NO_HABITS_NOTICE}
                        onPress={handleNavigation}
                        style={{ flex: 1 }}
                    >
                        <ManageHabitsNoHabitsMessage onPress={() => { }} />
                    </TutorialIslandElement>
                )}

                <TutorialIslandElement optionKey={TutorialIslandOptionKey.MY_HABITS__HABITS_LIST}>
                    <HabitSummaries scheduledHabits={scheduledHabits.data ?? []} />
                </TutorialIslandElement>
                <View style={{ flex: 1 }} />

                <TutorialIslandElement
                    optionKey={TutorialIslandOptionKey.MY_HABITS__ADD_NEW_HABIT_BUTTON}
                    onPress={handleNavigation}
                >
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
                </TutorialIslandElement>

                <View style={{ height: PADDING_LARGE * 2 }} />
            </View>
        </Screen>
    );
};
