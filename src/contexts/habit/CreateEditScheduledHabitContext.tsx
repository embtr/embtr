import { DayOfWeek, PlannedTask, ScheduledHabit, Task, TimeOfDay, Unit } from 'resources/schema';
import React, { createContext, useContext } from 'react';
import { HabitCustomHooks } from 'src/controller/habit/HabitController';
import { PlannedHabitCustomHooks } from 'src/controller/habit/PlannedHabitController';
import { NewPlannedHabitData } from 'src/model/PlannedHabitModels';
import { ScheduledHabitCustomHooks } from 'src/controller/habit/ScheduledHabitController';

export enum CreateEditHabitMode {
    CREATE_CUSTOM_HABIT = 'CREATE_CUSTOM_HABIT',
    CREATE_NEW_HABIT = 'CREATE_NEW_HABIT',
    EDIT_EXISTING_HABIT = 'EDIT_EXISTING_HABIT',
    EDIT_EXISTING_PLANNED_HABIT = 'EDIT_EXISTING_PLANNED_HABIT',
    CREATE_NEW_PLANNED_HABIT = 'CREATE_NEW_PLANNED_HABIT',
    INVALID = 'INVALID',
}

export const getEditMode = (
    isCreateCustomHabit?: boolean,
    habit?: Task,
    plannedTask?: PlannedTask,
    scheduledHabit?: ScheduledHabit,
    newPlannedHabitScheduledHabit?: ScheduledHabit
) => {
    const editMode: CreateEditHabitMode = isCreateCustomHabit
        ? CreateEditHabitMode.CREATE_CUSTOM_HABIT
        : habit
        ? CreateEditHabitMode.CREATE_NEW_HABIT
        : scheduledHabit
        ? CreateEditHabitMode.EDIT_EXISTING_HABIT
        : plannedTask
        ? CreateEditHabitMode.EDIT_EXISTING_PLANNED_HABIT
        : newPlannedHabitScheduledHabit
        ? CreateEditHabitMode.CREATE_NEW_PLANNED_HABIT
        : CreateEditHabitMode.INVALID;

    return editMode;
};

interface CreateEditScheduledHabitType {
    iconUrl: string;
    title: string;
    description: string;
    startDate?: Date;
    endDate?: Date;
    daysOfWeek: DayOfWeek[];
    timesOfDay: TimeOfDay[];
    quantity: number;
    completedQuantity?: number;
    unit?: Unit;

    setIcon: (iconUrl: string) => void;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setStartDate: (startDate: Date) => void;
    setEndDate: (endDate: Date) => void;
    setDaysOfWeek: (daysOfWeek: DayOfWeek[]) => void;
    setTimesOfDay: (timesOfDay: TimeOfDay[]) => void;
    setQuantity: (quantity: number) => void;
    setCompletedQuantity: (completedQuantity: number) => void;
    setUnit: (unit: Unit) => void;

    timeOfDayEnabled: boolean;
    repeatingScheduleEnabled: boolean;
    detailsEnabled: boolean;
    setTimeOfDayEnabled: (enabled: boolean) => void;
    setRepeatingScheduleEnabled: (enabled: boolean) => void;
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

    const [icon, setIcon] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
    const [daysOfWeek, setDaysOfWeek] = React.useState<DayOfWeek[]>([]);
    const [timesOfDay, setTimesOfDay] = React.useState<TimeOfDay[]>([]);
    const [quantity, setQuantity] = React.useState(1);
    const [completedQuantity, setCompletedQuantity] = React.useState(0);
    const [unit, setUnit] = React.useState<Unit | undefined>(undefined);

    const [repeatingScheduleEnabled, setRepeatingScheduleEnabled] = React.useState(false);
    const [detailsEnabled, setDetailsEnabled] = React.useState(false);

    const [startDateDatePickerModalVisible, setStartDateDatePickerModalVisible] =
        React.useState(false);
    const [endDateDatePickerModalVisible, setEndDateDatePickerModalVisible] = React.useState(false);
    const [timeOfDayEnabled, setTimeOfDayEnabled] = React.useState(false);

    /*
     * creating new scheduled habit
     */
    React.useEffect(() => {
        if (!isCreateCustomHabit && habit.data) {
            setIcon(habit.data.iconUrl ?? '');
            setTitle(habit.data.title ?? '');
            setDescription(habit.data.description ?? '');
            setDaysOfWeek([]);
            setTimesOfDay([]);
            setQuantity(1);
            setCompletedQuantity(0);
            setUnit(undefined);
        }
    }, [habit.data]);

    /*
     * editing existing scheduled habit
     */
    React.useEffect(() => {
        if (scheduledHabit.data) {
            setIcon(scheduledHabit.data.task?.iconUrl ?? '');
            setTitle(scheduledHabit.data.task?.title ?? '');
            setDescription(scheduledHabit.data.description ?? '');
            setStartDate(scheduledHabit.data.startDate ?? undefined);
            setEndDate(scheduledHabit.data.endDate ?? undefined);
            setDaysOfWeek(scheduledHabit.data.daysOfWeek ?? []);
            setTimesOfDay(scheduledHabit.data.timesOfDay ?? []);
            setQuantity(scheduledHabit.data.quantity ?? 1);
            setCompletedQuantity(0);
            setUnit(scheduledHabit.data.unit ?? undefined);

            setRepeatingScheduleEnabled(scheduledHabit.data.daysOfWeek?.length !== 0);
            setTimeOfDayEnabled(scheduledHabit.data.timesOfDay?.length !== 0);
            setDetailsEnabled(
                scheduledHabit.data.quantity !== undefined || scheduledHabit.data.unit !== undefined
            );
        }
    }, [scheduledHabit.data]);

    /*
     * creating new planned habit
     */
    React.useEffect(() => {
        if (newPlannedHabitScheduledHabit.data) {
            setIcon(newPlannedHabitScheduledHabit.data.task?.iconUrl ?? '');
            setTitle(newPlannedHabitScheduledHabit.data.task?.title ?? '');
            setDescription(newPlannedHabitScheduledHabit.data.description ?? '');
            setStartDate(newPlannedHabitScheduledHabit.data.startDate ?? undefined);
            setEndDate(newPlannedHabitScheduledHabit.data.endDate ?? undefined);
            setDaysOfWeek(newPlannedHabitScheduledHabit.data.daysOfWeek ?? []);
            setTimesOfDay(newPlannedHabitData?.timeOfDay ? [newPlannedHabitData.timeOfDay] : []);
            setQuantity(newPlannedHabitScheduledHabit.data.quantity ?? 1);
            setCompletedQuantity(0);
            setUnit(newPlannedHabitScheduledHabit.data.unit ?? undefined);

            setRepeatingScheduleEnabled(
                newPlannedHabitScheduledHabit.data.daysOfWeek?.length !== 0
            );
            setTimeOfDayEnabled(newPlannedHabitScheduledHabit.data.timesOfDay?.length !== 0);
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
            setIcon(plannedHabit.data.iconUrl ?? '');
            setTitle(plannedHabit.data.title ?? '');
            setDescription(plannedHabit.data.description ?? '');
            setDaysOfWeek([]);
            setTimesOfDay(plannedHabit.data.timeOfDay ? [plannedHabit.data.timeOfDay] : []);
            setQuantity(plannedHabit.data.quantity ?? 1);
            setCompletedQuantity(plannedHabit.data.completedQuantity ?? 0);
            setUnit(plannedHabit.data.unit ?? undefined);

            setTimeOfDayEnabled(!!plannedHabit.data.timeOfDay);
            setDetailsEnabled(
                plannedHabit.data.quantity !== undefined || plannedHabit.data.unit !== undefined
            );
        }
    }, [plannedHabit.data]);

    const contextValue: CreateEditScheduledHabitType = {
        iconUrl: icon,
        title: title,
        description: description,
        startDate: startDate,
        endDate: endDate,
        daysOfWeek: daysOfWeek,
        timesOfDay: timesOfDay,
        quantity: quantity,
        completedQuantity: completedQuantity,
        unit: unit,
        setIcon: setIcon,
        setTitle: setTitle,
        setDescription: setDescription,
        setStartDate: setStartDate,
        setEndDate: setEndDate,
        setDaysOfWeek: setDaysOfWeek,
        setTimesOfDay: setTimesOfDay,
        setQuantity: setQuantity,
        setCompletedQuantity: setCompletedQuantity,
        setUnit: setUnit,

        repeatingScheduleEnabled: repeatingScheduleEnabled,
        timeOfDayEnabled: timeOfDayEnabled,
        detailsEnabled: detailsEnabled,
        setRepeatingScheduleEnabled: setRepeatingScheduleEnabled,
        setTimeOfDayEnabled: setTimeOfDayEnabled,
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
