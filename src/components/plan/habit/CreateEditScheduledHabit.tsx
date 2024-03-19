import React from 'react';
import { Banner } from 'src/components/common/Banner';
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
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ArchiveScheduledHabitModal } from './ArchiveScheduledHabitModal';
import { ScheduledHabitController } from 'src/controller/habit/ScheduledHabitController';
import { useDispatch } from 'react-redux';
import { getCurrentUser, getSelectedDayKey, setGlobalLoading } from 'src/redux/user/GlobalState';
import { useEmbtrNavigation, useEmbtrRoute } from 'src/hooks/NavigationHooks';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import { useAppSelector } from 'src/redux/Hooks';
import { PlannedDayService } from 'src/service/PlannedDayService';
import getTodayDayKey = PlannedDayService.getTodayDayKey;
import { ScheduleHabitDescription } from './ScheduleHabitDescription';

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
    const { colors } = useTheme();
    const navigation = useEmbtrNavigation();
    const route = useEmbtrRoute(Routes.CREATE_EDIT_SCHEDULED_HABIT);

    const habitId = route.params.habitId; // creating a new habit from a template
    const scheduledHabitId = route.params.scheduledHabitId; // we are editing the scheduled habit
    const isCreateCustomHabit = route.params.isCreateCustomHabit; // creating a new custom habit
    const onExit = route.params.onExit;

    const isCreatedNewScheduledHabit = !!habitId;

    const [archiveModalVisible, setArchiveModalVisible] = React.useState(false);
    const currentUser = useAppSelector(getCurrentUser);
    const selectedDayKey = useAppSelector(getSelectedDayKey);

    const dispatch = useDispatch();

    return (
        <CreateEditScheduledHabitProvider
            isCreateCustomHabit={isCreateCustomHabit}
            habitId={habitId}
            scheduledHabitId={scheduledHabitId}
        >
            <Screen>
                {!isCreatedNewScheduledHabit && (
                    <ArchiveScheduledHabitModal
                        visible={archiveModalVisible}
                        onArchive={async () => {
                            if (!scheduledHabitId) {
                                return;
                            }

                            setArchiveModalVisible(!archiveModalVisible);

                            dispatch(setGlobalLoading(true));
                            await ScheduledHabitController.archive(scheduledHabitId);

                            await PlannedDayController.invalidatePlannedDay(
                                currentUser.id ?? 0,
                                getTodayDayKey()
                            );
                            await PlannedDayController.invalidatePlannedDay(
                                currentUser.id ?? 0,
                                selectedDayKey
                            );

                            onExit?.();

                            dispatch(setGlobalLoading(false));
                            navigation.goBack();
                        }}
                        onDismiss={() => {
                            setArchiveModalVisible(!archiveModalVisible);
                        }}
                    />
                )}

                <Banner
                    name={'Schedule Habit'}
                    leftRoute={'BACK'}
                    leftIcon={'arrow-back'}
                    rightText={
                        isCreateCustomHabit
                            ? 'discovery'
                            : !isCreatedNewScheduledHabit && !isCreateCustomHabit
                                ? 'archive'
                                : undefined
                    }
                    rightColor={isCreateCustomHabit ? colors.link : colors.archive}
                    rightOnClick={
                        isCreateCustomHabit
                            ? () => {
                                navigation.navigate(Routes.ADD_HABIT_CATEGORIES);
                            }
                            : !isCreatedNewScheduledHabit
                                ? () => {
                                    setArchiveModalVisible(true);
                                }
                                : undefined
                    }
                />

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View
                        style={{
                            flex: 1,
                            paddingHorizontal: PADDING_LARGE,
                        }}
                    >
                        <View style={{ height: PADDING_LARGE }} />
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
