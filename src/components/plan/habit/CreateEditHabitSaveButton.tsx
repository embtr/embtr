import { Keyboard, Text, TouchableOpacity, View } from 'react-native';
import { POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import {
    CreateEditHabitMode,
    useCreateEditScheduleHabit,
} from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { PlannedTask, ScheduledHabit } from 'resources/schema';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import { NewPlannedHabitData } from 'src/model/PlannedHabitModels';
import { Logger } from 'src/util/GeneralUtility';
import { ScheduledHabitController } from 'src/controller/habit/ScheduledHabitController';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentTab, getSelectedDayKey } from 'src/redux/user/GlobalState';
import PlannedDayController, {
    getDateFromDayKey,
    getTodayKey,
} from 'src/controller/planning/PlannedDayController';
import TaskController from 'src/controller/planning/TaskController';
import { HabitController } from 'src/controller/habit/HabitController';
import { TABS } from 'src/components/home/Dashboard';
import { CreateTaskRequest } from 'resources/types/requests/TaskTypes';

interface Props {
    habitId?: number;
    scheduledHabitId?: number;
    plannedHabitId?: number;
    newPlannedHabitData?: NewPlannedHabitData;
}

export const CreateEditHabitSaveButton = ({
    habitId,
    scheduledHabitId,
    plannedHabitId,
    newPlannedHabitData,
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
        timeOfDayEnabled,
        repeatingScheduleEnabled,
        detailsEnabled,
        startDate,
        endDate,
        timesOfDay,
        editMode,
    } = useCreateEditScheduleHabit();

    const currentTab = useAppSelector(getCurrentTab);
    const todayKey = useAppSelector(getTodayKey);
    const selectedDayKey = useAppSelector(getSelectedDayKey);
    const dayKeyToUse = currentTab === TABS.TODAY ? todayKey : selectedDayKey;

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
        const scheduledHabit: ScheduledHabit = {
            id: scheduledHabitId,
            taskId: customHabitId ?? habitId,
            description: description,
        };

        if (repeatingScheduleEnabled) {
            scheduledHabit.daysOfWeek = daysOfWeek.map((day) => {
                return {
                    id: day.id,
                };
            });
            scheduledHabit.startDate = startDate;
            scheduledHabit.endDate = endDate;
        } else {
            //adding for just the selected day
            const selectedDate = getDateFromDayKey(dayKeyToUse);
            const dayOfWeek = selectedDate.getUTCDay() + 1;

            scheduledHabit.daysOfWeek = [
                {
                    id: dayOfWeek,
                },
            ];

            scheduledHabit.startDate = selectedDate;
            scheduledHabit.endDate = selectedDate;
        }

        if (detailsEnabled) {
            scheduledHabit.quantity = quantity ?? 1;
            scheduledHabit.unitId = unit?.id ?? undefined;
        }

        if (timeOfDayEnabled) {
            scheduledHabit.timesOfDay = timesOfDay.map((timeOfDay) => {
                return {
                    id: timeOfDay.id,
                };
            });
        }

        return scheduledHabit;
    };

    const createCustomHabit = async () => {
        Keyboard.dismiss();

        //create habit
        const createTaskRequest: CreateTaskRequest = {
            title,
            description,
            localImage: localImage,
            removeImageUrl: remoteImageUrl,
        };

        const habit = await TaskController.createViaApi(createTaskRequest);
        if (!habit.id) {
            return;
        }

        HabitController.prefetchHabitCategories();

        const scheduledHabit: ScheduledHabit = createScheduledHabitRequest(habit.id);
        await ScheduledHabitController.create(scheduledHabit);
    };

    const createHabit = async () => {
        Keyboard.dismiss();
        const scheduledHabit: ScheduledHabit = createScheduledHabitRequest();
        await ScheduledHabitController.create(scheduledHabit);
    };

    const updateHabit = async () => {
        Keyboard.dismiss();
        const scheduledHabit: ScheduledHabit = createScheduledHabitRequest();
        await ScheduledHabitController.update(scheduledHabit);
    };

    const updatePlannedHabit = async () => {
        if (!plannedHabitId) {
            Logger.log('no planned habit id found');
            return;
        }

        const plannedTask: PlannedTask = createUpdatedPlannedTask(plannedHabitId);
        await PlannedTaskController.update(plannedTask);
    };

    const createPlannedHabit = async () => {
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
                await createCustomHabit();
                break;

            case CreateEditHabitMode.CREATE_NEW_HABIT:
                await createHabit();
                break;

            case CreateEditHabitMode.EDIT_EXISTING_HABIT:
                await updateHabit();
                break;

            case CreateEditHabitMode.EDIT_EXISTING_PLANNED_HABIT:
                await updatePlannedHabit();
                break;

            case CreateEditHabitMode.CREATE_NEW_PLANNED_HABIT:
                await createPlannedHabit();
                break;
        }

        await PlannedDayController.prefetchPlannedDayData(dayKeyToUse);
        navigation.popToTop();
    };

    const buttonText = editMode === CreateEditHabitMode.CREATE_NEW_HABIT ? 'Create' : 'Update';

    return (
        <TouchableOpacity onPress={onPress}>
            <View
                style={{
                    height: 50 - TIMELINE_CARD_PADDING,
                    marginHorizontal: TIMELINE_CARD_PADDING / 2,
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
                    {buttonText}
                </Text>
            </View>
        </TouchableOpacity>
    );
};
