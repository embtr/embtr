import { DayOfWeek, PlannedTask, ScheduledHabit, Task, TimeOfDay, Unit } from 'resources/schema';
import React, { createContext, useContext } from 'react';
import { HabitCustomHooks } from 'src/controller/habit/HabitController';
import { PlannedHabitCustomHooks } from 'src/controller/habit/PlannedHabitController';
import { NewPlannedHabitData } from 'src/model/PlannedHabitModels';
import { ScheduledHabitCustomHooks } from 'src/controller/habit/ScheduledHabitController';
import { ScheduledHabitUtil } from 'src/util/ScheduledHabitUtil';

export enum CreateEditHabitMode {
    CREATE_CUSTOM_HABIT = 'CREATE_CUSTOM_HABIT',
    CREATE_NEW_SCHEDULED_HABIT = 'CREATE_NEW_SCHEDULED_HABIT',
    EDIT_EXISTING_SCHEDULED_HABIT = 'EDIT_EXISTING_SCHEDULED_HABIT',
    CREATE_NEW_PLANNED_HABIT = 'CREATE_NEW_PLANNED_HABIT',
    EDIT_EXISTING_PLANNED_HABIT = 'EDIT_EXISTING_PLANNED_HABIT',
    INVALID = 'INVALID',
}

export const getEditMode = (
    isCreateCustomHabit?: boolean,
    habit?: Task,
    plannedTask?: PlannedTask,
    scheduledHabit?: ScheduledHabit,
    newPlannedHabitScheduledHabit?: ScheduledHabit
) => {
    if (isCreateCustomHabit) {
        return CreateEditHabitMode.CREATE_CUSTOM_HABIT;
    }

    if (scheduledHabit) {
        return CreateEditHabitMode.EDIT_EXISTING_SCHEDULED_HABIT;
    }

    if (habit) {
        return CreateEditHabitMode.CREATE_NEW_SCHEDULED_HABIT;
    }

    if (plannedTask) {
        return CreateEditHabitMode.EDIT_EXISTING_PLANNED_HABIT;
    }

    if (newPlannedHabitScheduledHabit) {
        return CreateEditHabitMode.CREATE_NEW_PLANNED_HABIT;
    }

    return CreateEditHabitMode.INVALID;
};

interface CreateEditScheduledHabitType {
    remoteImageUrl: string;
    localImage: string;
    title: string;
    description: string;
    startDate?: Date;
    endDate?: Date;
    daysOfWeek: DayOfWeek[];
    timesOfDay: TimeOfDay[];
    quantity: number | null;
    completedQuantity?: number;
    unit?: Unit;

    setRemoteImageUrl: (remoteImageUrl: string) => void;
    setLocalImage: (localImage: string) => void;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setStartDate: (startDate: Date) => void;
    setEndDate: (endDate: Date) => void;
    setDaysOfWeek: (daysOfWeek: DayOfWeek[]) => void;
    setTimesOfDay: (timesOfDay: TimeOfDay[]) => void;
    setQuantity: (quantity: number | null) => void;
    setCompletedQuantity: (completedQuantity: number) => void;
    setUnit: (unit: Unit) => void;

    timesOfDayEnabled: boolean;
    daysOfWeekEnabled: boolean;
    detailsEnabled: boolean;
    setTimesOfDayEnabled: (enabled: boolean) => void;
    setDaysOfWeekEnabled: (enabled: boolean) => void;
    setDetailsEnabled: (enabled: boolean) => void;

    startDateDatePickerModalVisible: boolean;
    endDateDatePickerModalVisible: boolean;

    setStartDateDatePickerModalVisible: (visible: boolean) => void;
    setEndDateDatePickerModalVisible: (visible: boolean) => void;

    loading: boolean;

    editMode: CreateEditHabitMode;
}

export const CreateEditScheduledHabitContext = createContext<CreateEditScheduledHabitType>(
    undefined!
);

export const useCreateEditScheduleHabit = (): CreateEditScheduledHabitType => {
    return useContext(CreateEditScheduledHabitContext);
};

interface Props {
    children: React.ReactNode;
    habitId?: number;
    isCreateCustomHabit?: boolean;
    scheduledHabitId?: number;
    plannedTaskId?: number;
    newPlannedHabitData?: NewPlannedHabitData;
}

export const CreateEditScheduledHabitProvider = ({
    children,
    habitId,
    isCreateCustomHabit,
    scheduledHabitId,
    plannedTaskId,
    newPlannedHabitData,
}: Props) => {
    const habit = HabitCustomHooks.useHabit(Number(habitId));
    const plannedHabit = PlannedHabitCustomHooks.usePlannedHabit(Number(plannedTaskId));
    const scheduledHabit = ScheduledHabitCustomHooks.useScheduledHabit(Number(scheduledHabitId));
    const newPlannedHabitScheduledHabit = ScheduledHabitCustomHooks.useScheduledHabit(
        Number(newPlannedHabitData?.scheduledHabitId)
    );

    const [remoteImageUrl, setRemoteImageUrl] = React.useState('');
    const [localImage, setLocalImage] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
    const [daysOfWeek, setDaysOfWeek] = React.useState<DayOfWeek[]>([]);
    const [timesOfDay, setTimesOfDay] = React.useState<TimeOfDay[]>([]);
    const [quantity, setQuantity] = React.useState<number | null>(1);
    const [completedQuantity, setCompletedQuantity] = React.useState(0);
    const [unit, setUnit] = React.useState<Unit | undefined>(undefined);

    const [daysOfWeekEnabled, setDaysOfWeekEnabled] = React.useState(false);
    const [timesOfDayEnabled, setTimesOfDayEnabled] = React.useState(false);

    const [detailsEnabled, setDetailsEnabled] = React.useState(false);

    const [startDateDatePickerModalVisible, setStartDateDatePickerModalVisible] =
        React.useState(false);
    const [endDateDatePickerModalVisible, setEndDateDatePickerModalVisible] = React.useState(false);

    /*
     * creating new scheduled habit
     */
    React.useEffect(() => {
        if (!isCreateCustomHabit && habit.data) {
            setRemoteImageUrl(habit.data.remoteImageUrl ?? '');
            setLocalImage(habit.data.localImage ?? '');
            setTitle(habit.data.title ?? '');
            setDescription(habit.data.description ?? '');
            setDaysOfWeek([]);
            setTimesOfDay([]);
            setQuantity(1);
            setCompletedQuantity(0);
            setUnit(undefined);
            setStartDate(new Date());
        } else if (isCreateCustomHabit) {
            setRemoteImageUrl(
                'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/habits%2Fcustom_habits_placeholder.svg?alt=media'
            );
            setLocalImage('HABIT.CUSTOM_HABITS_PLACEHOLDER');
        }
    }, [habit.data]);

    /*
     * editing existing scheduled habit
     */
    React.useEffect(() => {
        if (scheduledHabit.data) {
            setRemoteImageUrl(ScheduledHabitUtil.getRemoteImageUrl(scheduledHabit.data));
            setLocalImage(ScheduledHabitUtil.getLocalImage(scheduledHabit.data));
            setTitle(ScheduledHabitUtil.getTitle(scheduledHabit.data));
            setDescription(ScheduledHabitUtil.getDescription(scheduledHabit.data));
            setStartDate(scheduledHabit.data.startDate ?? undefined);
            setEndDate(scheduledHabit.data.endDate ?? undefined);
            setDaysOfWeek(scheduledHabit.data.daysOfWeek ?? []);
            setTimesOfDay(scheduledHabit.data.timesOfDay ?? []);
            setDetailsEnabled(scheduledHabit.data.detailsEnabled === true);
            setQuantity(scheduledHabit.data.quantity ?? 1);
            setCompletedQuantity(0);
            setUnit(scheduledHabit.data.unit ?? undefined);

            setDaysOfWeekEnabled(scheduledHabit.data.daysOfWeekEnabled === true);
            setTimesOfDayEnabled(scheduledHabit.data.timesOfDayEnabled === true);
            setDetailsEnabled(scheduledHabit.data.detailsEnabled === true);
        }
    }, [scheduledHabit.data]);

    /*
     * creating new planned habit
     */
    React.useEffect(() => {
        if (newPlannedHabitScheduledHabit.data) {
            setRemoteImageUrl(newPlannedHabitScheduledHabit.data.task?.remoteImageUrl ?? '');
            setLocalImage(newPlannedHabitScheduledHabit.data.task?.localImage ?? '');
            setTitle(newPlannedHabitScheduledHabit.data.task?.title ?? '');
            setDescription(newPlannedHabitScheduledHabit.data.description ?? '');
            setStartDate(newPlannedHabitScheduledHabit.data.startDate ?? undefined);
            setEndDate(newPlannedHabitScheduledHabit.data.endDate ?? undefined);
            setDaysOfWeek(newPlannedHabitScheduledHabit.data.daysOfWeek ?? []);
            setTimesOfDay(newPlannedHabitData?.timeOfDay ? [newPlannedHabitData.timeOfDay] : []);
            setQuantity(newPlannedHabitScheduledHabit.data.quantity ?? 1);
            setCompletedQuantity(0);
            setUnit(newPlannedHabitScheduledHabit.data.unit ?? undefined);

            setDaysOfWeekEnabled(newPlannedHabitScheduledHabit.data.daysOfWeek?.length !== 0);
            setTimesOfDayEnabled(newPlannedHabitScheduledHabit.data.timesOfDay?.length !== 0);
            setDetailsEnabled(
                newPlannedHabitScheduledHabit.data.quantity !== undefined ||
                newPlannedHabitScheduledHabit.data.unit !== undefined
            );
        }
    }, [newPlannedHabitScheduledHabit.data]);

    /*
     * editing existing planned habit
     */
    React.useEffect(() => {
        if (plannedHabit.data) {
            setRemoteImageUrl(plannedHabit.data.remoteImageUrl ?? '');
            setLocalImage(plannedHabit.data.localImage ?? '');
            setTitle(plannedHabit.data.title ?? '');
            setDescription(plannedHabit.data.description ?? '');
            setDaysOfWeek([]);
            setTimesOfDay(plannedHabit.data.timeOfDay ? [plannedHabit.data.timeOfDay] : []);
            setQuantity(plannedHabit.data.quantity ?? 1);
            setCompletedQuantity(plannedHabit.data.completedQuantity ?? 0);
            setUnit(plannedHabit.data.unit ?? undefined);

            setTimesOfDayEnabled(!!plannedHabit.data.timeOfDay);
            setDetailsEnabled(
                plannedHabit.data.quantity !== undefined || plannedHabit.data.unit !== undefined
            );
        }
    }, [plannedHabit.data]);

    const contextValue: CreateEditScheduledHabitType = {
        remoteImageUrl: remoteImageUrl,
        localImage: localImage,
        title: title,
        description: description,
        startDate: startDate,
        endDate: endDate,
        daysOfWeek: daysOfWeek,
        timesOfDay: timesOfDay,
        quantity: quantity,
        completedQuantity: completedQuantity,
        unit: unit,
        setRemoteImageUrl: setRemoteImageUrl,
        setLocalImage: setLocalImage,
        setTitle: setTitle,
        setDescription: setDescription,
        setStartDate: setStartDate,
        setEndDate: setEndDate,
        setDaysOfWeek: setDaysOfWeek,
        setTimesOfDay: setTimesOfDay,
        setQuantity: setQuantity,
        setCompletedQuantity: setCompletedQuantity,
        setUnit: setUnit,

        daysOfWeekEnabled: daysOfWeekEnabled,
        timesOfDayEnabled: timesOfDayEnabled,
        detailsEnabled: detailsEnabled,
        setDaysOfWeekEnabled: setDaysOfWeekEnabled,
        setTimesOfDayEnabled: setTimesOfDayEnabled,
        setDetailsEnabled: setDetailsEnabled,

        startDateDatePickerModalVisible: startDateDatePickerModalVisible,
        endDateDatePickerModalVisible: endDateDatePickerModalVisible,
        setStartDateDatePickerModalVisible: setStartDateDatePickerModalVisible,
        setEndDateDatePickerModalVisible: setEndDateDatePickerModalVisible,

        loading: habit.isLoading || plannedHabit.isLoading || scheduledHabit.isLoading,

        editMode: getEditMode(
            isCreateCustomHabit,
            habit.data,
            plannedHabit.data,
            scheduledHabit.data,
            newPlannedHabitScheduledHabit.data
        ),
    };

    return (
        <CreateEditScheduledHabitContext.Provider value={contextValue}>
            {children}
        </CreateEditScheduledHabitContext.Provider>
    );
};
