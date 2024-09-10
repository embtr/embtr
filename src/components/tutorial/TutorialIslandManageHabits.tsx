import React from 'react';
import { HabitSummaries } from 'src/components/manage_habits/HabitSummaries';
import { Screen } from 'src/components/common/Screen';
import { View, Text, TouchableOpacity } from 'react-native';
import { CARD_SHADOW, PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { TutorialIslandRoutes } from 'src/navigation/RootStackParamList';
import { useTheme } from '../theme/ThemeProvider';
import {
    ScheduledHabitController,
    ScheduledHabitCustomHooks,
} from 'src/controller/habit/ScheduledHabitController';
import { useEmbtrTutorialIslandNavigation } from 'src/hooks/NavigationHooks';
import { ManageHabitsNoHabitsMessage } from '../manage_habits/ManageHabitsNoHabitsMessage';
import { TutorialIslandElement, TutorialIslandElementRef } from './TutorialIslandElement';
import { TutorialIslandOptionKey } from 'src/model/tutorial_island/TutorialIslandModels';
import { TutorialIslandBanner } from './TutorialIslandBanner';
import { GlobalStateCustomHooks } from 'src/redux/user/GlobalStateCustomHooks';

export const TutorialIslandManageHabits = () => {
    const colors = useTheme().colors;
    const navigation = useEmbtrTutorialIslandNavigation();

    const scheduledHabits = ScheduledHabitCustomHooks.useActive();
    const ref = React.useRef<TutorialIslandElementRef>(null);

    const handleNavigation = () => {
        navigation.navigate(TutorialIslandRoutes.TUTORIAL_ISLAND_CREATE_EDIT_SCHEDULED_HABIT, {
            isCreateCustomHabit: true,
            onExit: () => {
                ScheduledHabitController.invalidateActiveScheduledHabits();
            },
        });
    };

    const skipTutorialIsland = GlobalStateCustomHooks.useSkipTutorialIsland();

    return (
        <Screen>
            <TutorialIslandBanner
                name={'My Habits'}
                rightButton="Skip Tutorial"
                rightOnClick={skipTutorialIsland}
            />

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
                    ref={ref}
                    optionKey={TutorialIslandOptionKey.MY_HABITS__ADD_NEW_HABIT_BUTTON}
                >
                    <TouchableOpacity
                        onPress={() => {
                            ref.current?.reportOptionPressed();
                            handleNavigation();
                        }}
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
                </TutorialIslandElement>

                <View style={{ height: PADDING_LARGE * 2 }} />
            </View>
        </Screen>
    );
};
