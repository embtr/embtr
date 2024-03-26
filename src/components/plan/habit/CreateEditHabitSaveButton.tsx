import { Keyboard, Text, TouchableOpacity, View } from 'react-native';
import { POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';
import {
    CreateEditHabitMode,
    useCreateEditScheduleHabit,
} from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Routes } from 'src/navigation/RootStackParamList';
import { PlannedTask, ScheduledHabit, Task } from 'resources/schema';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import { NewPlannedHabitData } from 'src/model/PlannedHabitModels';
import { Logger } from 'src/util/GeneralUtility';
import { ScheduledHabitController } from 'src/controller/habit/ScheduledHabitController';
import { useAppSelector } from 'src/redux/Hooks';
import { getSelectedDayKey } from 'src/redux/user/GlobalState';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import TaskController from 'src/controller/planning/TaskController';
import { HabitController } from 'src/controller/habit/HabitController';
import { CreateTaskRequest } from 'resources/types/requests/TaskTypes';
import { DayOfWeekCustomHooks } from 'src/controller/day_of_week/DayOfWeekController';
import { UserCustomHooks } from 'src/controller/user/UserController';
import { HabitSummaryController } from 'src/controller/habit/HabitSummaryController';
import { TimesOfDayCustomHooks } from 'src/controller/time_of_day/TimeOfDayController';

interface Props {
    habitId?: number;
    scheduledHabitId?: number;
    plannedHabitId?: number;
    newPlannedHabitData?: NewPlannedHabitData;
    onExit?: () => void;
}

export const CreateEditHabitSaveButton = ({
    habitId,
    scheduledHabitId,
    plannedHabitId,
    newPlannedHabitData,
    onExit,
}: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const {
        title,
        description,
        daysOfWeek,
        quantity,
        completedQuantity,
        unit,
        remoteImageUrl,
        localImage,
        timesOfDayEnabled,
        daysOfWeekEnabled,
        detailsEnabled,
        timesOfDay,
        editMode,
    } = useCreateEditScheduleHabit();

    const formIsValid = () => {
        if (timesOfDayEnabled && (timesOfDay.length < 1 || timesOfDay[0].id === 5)) {
            return false;
        }

        if (daysOfWeekEnabled && daysOfWeek.length < 1) {
            return false;
        }

        if (title.length < 1) {
            return false;
        }

        return true;
    };

    const formValid = formIsValid();

    const currentUserId = UserCustomHooks.useCurrentUserId();
    const selectedDayKey = useAppSelector(getSelectedDayKey);
    const dayKeyToUse = selectedDayKey;

    const routes = navigation.getState().routes;
    const previousRoute = routes[routes.length - 2];
    const isFromHabitSummaryDetails = previousRoute.name.toString() === Routes.MANAGE_HABITS;
    const allDaysOfWeek = DayOfWeekCustomHooks.useDaysOfWeek();
    const allTimesOfDay = TimesOfDayCustomHooks.useTimesOfDay();

    const createUpdatedPlannedTask = (id: number) => {
        const plannedTask: PlannedTask = {
            id: id,
            scheduledHabitId: scheduledHabitId,
            title: title,
            description: description,
            quantity: quantity ?? 1,
            completedQuantity: completedQuantity,
            remoteImageUrl: remoteImageUrl,
            localImage: localImage,
        };

        if (unit) {
            plannedTask.unitId = unit.id;
        }

        if (timesOfDay.length > 0) {
            plannedTask.timeOfDayId = timesOfDay[0].id;
        }

        return plannedTask;
    };

    const createCreatePlannedTask = () => {
        const plannedTask: PlannedTask = {
            scheduledHabitId: newPlannedHabitData?.scheduledHabitId,
            title: title,
            description: description,
            quantity: quantity ?? 1,
            completedQuantity: completedQuantity,
            remoteImageUrl: remoteImageUrl,
            localImage: localImage,
        };

        if (unit) {
            plannedTask.unitId = unit.id;
        }

        if (timesOfDay.length > 0) {
            plannedTask.timeOfDayId = timesOfDay[0].id;
        }

        plannedTask.originalTimeOfDayId = newPlannedHabitData?.originalTimeOfDayId;

        return plannedTask;
    };

    const createScheduledHabitRequest = (customHabitId?: number) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const scheduledHabit: ScheduledHabit = {
            id: scheduledHabitId,
            taskId: customHabitId ?? habitId,
            description: description,
            title: title,
            localImage: localImage,
            remoteImageUrl: remoteImageUrl,
            daysOfWeekEnabled: daysOfWeekEnabled,
            timesOfDayEnabled: timesOfDayEnabled,
            detailsEnabled: detailsEnabled,
            startDate: today,
        };

        if (daysOfWeekEnabled) {
            scheduledHabit.daysOfWeek = daysOfWeek.map((day) => {
                return {
                    id: day.id,
                };
            });
        } else {
            scheduledHabit.daysOfWeek = allDaysOfWeek.map((day) => {
                return {
                    id: day.id,
                };
            });
        }

        if (timesOfDayEnabled) {
            scheduledHabit.timesOfDay = timesOfDay.map((timeOfDay) => {
                return {
                    id: timeOfDay.id,
                };
            });
        }

        if (scheduledHabit.timesOfDay?.length === 0) {
            const allDay = allTimesOfDay.find((timeOfDay) => timeOfDay.id === 5);
            scheduledHabit.timesOfDay = allDay ? [allDay] : [];
        }

        if (detailsEnabled) {
            scheduledHabit.quantity = quantity ?? 1;
            scheduledHabit.unitId = unit?.id ?? undefined;
        } else {
            scheduledHabit.quantity = 1;
            scheduledHabit.unitId = undefined;
        }

        return scheduledHabit;
    };

    const createNewCustomHabit = async () => {
        Keyboard.dismiss();

        const task: Task = {
            title,
            description,
            localImage: localImage,
            remoteImageUrl: remoteImageUrl,
        };

        //create habit
        const createTaskRequest: CreateTaskRequest = {
            task,
        };

        const habit = await TaskController.createViaApi(createTaskRequest);
        if (!habit.id) {
            return;
        }

        HabitController.prefetchHabitCategories();

        const scheduledHabit: ScheduledHabit = createScheduledHabitRequest(habit.id);
        await ScheduledHabitController.create(scheduledHabit);
    };

    const createNewScheduledHabit = async () => {
        Keyboard.dismiss();
        const scheduledHabit: ScheduledHabit = createScheduledHabitRequest();
        await ScheduledHabitController.create(scheduledHabit);
    };

    const editExistingScheduledHabit = async () => {
        Keyboard.dismiss();
        const scheduledHabit: ScheduledHabit = createScheduledHabitRequest();
        await ScheduledHabitController.update(scheduledHabit);
    };

    const editExistingPlannedHabit = async () => {
        if (!plannedHabitId) {
            Logger.log('no planned habit id found');
            return;
        }

        const plannedTask: PlannedTask = createUpdatedPlannedTask(plannedHabitId);
        await PlannedTaskController.update(plannedTask);
    };

    const createNewPlannedHabit = async () => {
        if (!newPlannedHabitData?.dayKey || !newPlannedHabitData?.scheduledHabitId) {
            Logger.log('invalid data to create planned habit');
            return;
        }

        const plannedTask: PlannedTask = createCreatePlannedTask();
        await PlannedTaskController.createWithDayKey(plannedTask, newPlannedHabitData!.dayKey);
    };

    const onPress = async () => {
        switch (editMode) {
            case CreateEditHabitMode.CREATE_CUSTOM_HABIT:
                await createNewCustomHabit();
                break;

            case CreateEditHabitMode.CREATE_NEW_SCHEDULED_HABIT:
                await createNewScheduledHabit();
                break;

            case CreateEditHabitMode.EDIT_EXISTING_SCHEDULED_HABIT:
                await editExistingScheduledHabit();
                break;

            case CreateEditHabitMode.EDIT_EXISTING_PLANNED_HABIT:
                await editExistingPlannedHabit();
                break;

            case CreateEditHabitMode.CREATE_NEW_PLANNED_HABIT:
                await createNewPlannedHabit();
                break;
        }

        if (currentUserId.data && dayKeyToUse) {
            const promises = [
                HabitSummaryController.invalidateHabitSummaries(),
                PlannedDayController.invalidatePlannedDay(currentUserId.data, dayKeyToUse),
                PlannedDayController.prefetchPlannedDayData(dayKeyToUse),
            ];
            await Promise.all(promises);
        }

        if (onExit) {
            onExit();
        }

        if (isFromHabitSummaryDetails) {
            navigation.goBack();
        } else {
            navigation.popToTop();
        }
    };

    const createModes = [
        CreateEditHabitMode.CREATE_NEW_SCHEDULED_HABIT,
        CreateEditHabitMode.CREATE_CUSTOM_HABIT,
    ];
    const buttonText = createModes.includes(editMode) ? 'Create' : 'Update';

    return (
        <TouchableOpacity disabled={!formValid} onPress={onPress}>
            <View
                style={{
                    height: 50 - PADDING_LARGE,
                    marginHorizontal: PADDING_LARGE,
                    backgroundColor: formValid ? colors.accent_color : colors.accent_color_dim,
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
                    {buttonText}
                </Text>
            </View>
        </TouchableOpacity>
    );
};
