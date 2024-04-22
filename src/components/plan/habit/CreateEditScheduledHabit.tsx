import React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Routes } from 'src/navigation/RootStackParamList';
import { PADDING_LARGE } from 'src/util/constants';
import { View, Animated, Easing } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ScheduleHabitRepeatingSchedule } from 'src/components/plan/habit/ScheduledHabitRepeatingSchedule';
import { CreateEditScheduledHabitProvider } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { ScheduledHabitTitle } from 'src/components/plan/habit/ScheduledHabitTitle';
import { ScheduledHabitTimeOfDay } from 'src/components/plan/habit/ScheduledHabitTimeOfDay';
import { ScheduledHabitDetails } from 'src/components/plan/habit/ScheduledHabitDetails';
import { CreateEditHabitSaveButton } from 'src/components/plan/habit/CreateEditHabitSaveButton';
import { useEmbtrRoute } from 'src/hooks/NavigationHooks';
import { ScheduleHabitDescription } from './ScheduleHabitDescription';
import { ScheduledHabitChallengeNotice } from './ScheduledHabitChallengeNotice';
import { ScheduledHabitBanner } from './ScheduledHabitBanner';
import { ScheduledHabitModals } from './ScheduledHabitModals';

// 600 lines? Thems rookie numbers - TheCaptainCoder - 2023-10-06

export const runCreateEditScheduledHabitAnimation = (
    expand: boolean,
    viewHeight: Animated.Value,
    maxHeight: number = 50
) => {
    const height = expand ? maxHeight : 0;

    Animated.timing(viewHeight, {
        toValue: height, // Set the desired height
        duration: 125, // Adjust the duration as needed
        easing: Easing.ease, // Adjust the easing function as needed
        useNativeDriver: false, // Make sure to set this to false for height animation
    }).start();
};

export const CreateEditScheduledHabit = () => {
    const route = useEmbtrRoute(Routes.CREATE_EDIT_SCHEDULED_HABIT);

    const [archiveModalVisible, setArchiveModalVisible] = React.useState(false);
    const [leaveChallengeModalVisible, setLeaveChallengeModalVisible] = React.useState(false);

    const habitId = route.params.habitId; // creating a new habit from a template
    const scheduledHabitId = route.params.scheduledHabitId; // we are editing the scheduled habit
    const isCreateCustomHabit = route.params.isCreateCustomHabit; // creating a new custom habit
    const onExit = route.params.onExit;

    const isCreatedNewScheduledHabit = !!habitId;

    return (
        <CreateEditScheduledHabitProvider
            isCreateCustomHabit={isCreateCustomHabit}
            habitId={habitId}
            scheduledHabitId={scheduledHabitId}
        >
            <Screen>
                <ScheduledHabitModals
                    scheduledHabitId={scheduledHabitId}
                    isCreatedNewScheduledHabit
                    onExit={() => {
                        console.log('Exiting scheduled habit');
                        onExit?.();
                    }}
                    archiveModalVisible={archiveModalVisible}
                    leaveChallengeModalVisible={leaveChallengeModalVisible}
                    closeModals={() => {
                        setArchiveModalVisible(false);
                        setLeaveChallengeModalVisible(false);
                    }}
                />

                <ScheduledHabitBanner
                    isCreateCustomHabit={!!isCreateCustomHabit}
                    isCreatedNewScheduledHabit={isCreatedNewScheduledHabit}
                    onArchiveSheduledHabit={() => {
                        setArchiveModalVisible(true);
                    }}
                    onLeaveChallenge={() => {
                        setLeaveChallengeModalVisible(true);
                    }}
                />

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View
                        style={{
                            flex: 1,
                            paddingHorizontal: PADDING_LARGE,
                        }}
                    >
                        <View style={{ height: PADDING_LARGE }} />

                        <ScheduledHabitChallengeNotice />
                        <ScheduledHabitTitle />
                        <ScheduleHabitDescription />
                        <ScheduleHabitRepeatingSchedule />
                        <ScheduledHabitTimeOfDay />
                        <ScheduledHabitDetails />
                    </View>
                    <View style={{ height: 10 * PADDING_LARGE }} />
                </ScrollView>

                <CreateEditHabitSaveButton
                    habitId={habitId}
                    scheduledHabitId={scheduledHabitId}
                    onExit={onExit}
                />
                <View style={{ height: PADDING_LARGE * 2 }} />
            </Screen>
        </CreateEditScheduledHabitProvider>
    );
};
