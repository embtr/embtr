import { DayOfWeek, TimeOfDay, Unit } from 'resources/schema';
import React, { createContext, useContext } from 'react';
import { HabitCustomHooks } from 'src/controller/habit/HabitController';
import { PlannedHabitCustomHooks } from 'src/controller/habit/PlannedHabitController';

interface CreateEditScheduledHabitType {
    iconUrl: string;
    title: string;
    description: string;
    startDate?: Date;
    endDate?: Date;
    daysOfWeek: DayOfWeek[];
    timesOfDay: TimeOfDay[];
    quantity: number;
    unit?: Unit;

    setIcon: (iconUrl: string) => void;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setStartDate: (startDate: Date) => void;
    setEndDate: (endDate: Date) => void;
    setDaysOfWeek: (daysOfWeek: DayOfWeek[]) => void;
    setTimesOfDay: (timesOfDay: TimeOfDay[]) => void;
    setQuantity: (quantity: number) => void;
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
    scheduledHabitId?: number;
    plannedTaskId?: number;
}

export const CreateEditScheduledHabitProvider = ({
    children,
    habitId,
    scheduledHabitId,
    plannedTaskId,
}: Props) => {
    const habit = HabitCustomHooks.useHabit(Number(habitId));
    const plannedTask = PlannedHabitCustomHooks.usePlannedHabit(Number(plannedTaskId));
    const scheduledHabit = HabitCustomHooks.useScheduledHabit(Number(scheduledHabitId));

    const [icon, setIcon] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
    const [daysOfWeek, setDaysOfWeek] = React.useState<DayOfWeek[]>([]);
    const [timesOfDay, setTimesOfDay] = React.useState<TimeOfDay[]>([]);
    const [quantity, setQuantity] = React.useState(1);
    const [unit, setUnit] = React.useState<Unit | undefined>(undefined);

    const [repeatingScheduleEnabled, setRepeatingScheduleEnabled] = React.useState(false);
    const [detailsEnabled, setDetailsEnabled] = React.useState(false);

    const [startDateDatePickerModalVisible, setStartDateDatePickerModalVisible] =
        React.useState(false);
    const [endDateDatePickerModalVisible, setEndDateDatePickerModalVisible] = React.useState(false);
    const [timeOfDayEnabled, setTimeOfDayEnabled] = React.useState(false);

    React.useEffect(() => {
        if (habit.data) {
            setIcon(habit.data.iconUrl ?? '');
            setTitle(habit.data.title ?? '');
            setDescription(habit.data.description ?? '');
            setDaysOfWeek([]);
            setTimesOfDay([]);
            setQuantity(1);
            setUnit(undefined);
        }
    }, [habit.data]);

    React.useEffect(() => {
        if (plannedTask.data) {
            setIcon(plannedTask.data.iconUrl ?? '');
            setTitle(plannedTask.data.title ?? '');
            setDescription(plannedTask.data.description ?? '');
            setDaysOfWeek([]);
            setTimesOfDay([]);
            setQuantity(1);
            setUnit(undefined);
        }
    }, [plannedTask.data]);

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
            setUnit(scheduledHabit.data.unit ?? undefined);

            setRepeatingScheduleEnabled(scheduledHabit.data.daysOfWeek?.length !== 0);
            setTimeOfDayEnabled(scheduledHabit.data.timesOfDay?.length !== 0);
            setDetailsEnabled(scheduledHabit.data.quantity !== undefined || scheduledHabit.data.unit !== undefined);
        }
    }, [scheduledHabit.data]);

    const contextValue: CreateEditScheduledHabitType = {
        iconUrl: icon,
        title: title,
        description: description,
        startDate: startDate,
        endDate: endDate,
        daysOfWeek: daysOfWeek,
        timesOfDay: timesOfDay,
        quantity: quantity,
        unit: unit,
        setIcon: setIcon,
        setTitle: setTitle,
        setDescription: setDescription,
        setStartDate: setStartDate,
        setEndDate: setEndDate,
        setDaysOfWeek: setDaysOfWeek,
        setTimesOfDay: setTimesOfDay,
        setQuantity: setQuantity,
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

        loading: habit.isLoading || plannedTask.isLoading || scheduledHabit.isLoading,
    };
    return (
        <CreateEditScheduledHabitContext.Provider value={contextValue}>
            {children}
        </CreateEditScheduledHabitContext.Provider>
    );
};
