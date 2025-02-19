import {
    DayOfWeek,
    Icon,
    PlannedTask,
    ScheduledHabit,
    Task,
    TimeOfDay,
    Unit,
} from 'resources/schema';
import React, { createContext, useContext } from 'react';
import { HabitCustomHooks } from 'src/controller/habit/HabitController';
import { PlannedHabitCustomHooks } from 'src/controller/habit/PlannedHabitController';
import { NewPlannedHabitData } from 'src/model/PlannedHabitModels';
import { ScheduledHabitCustomHooks } from 'src/controller/habit/ScheduledHabitController';
import { ScheduledHabitUtil } from 'src/util/ScheduledHabitUtil';
import { Constants } from 'resources/types/constants/constants';
import { PlannedTaskUtil } from 'src/util/PlannedTaskUtil';

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
    icon?: Icon;
    title: string;
    description: string;
    startDate?: Date;
    endDate?: Date;
    daysOfWeek: DayOfWeek[];
    timesOfDay: TimeOfDay[];
    quantity: number | null;
    completedQuantity?: number;
    unit?: Unit;
    isChallenge: boolean;
    challengeIds: number[];

    setRemoteImageUrl: (remoteImageUrl: string) => void;
    setLocalImage: (localImage: string) => void;
    setIcon: (icon: Icon) => void;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setStartDate: (startDate: Date) => void;
    setEndDate: (endDate: Date) => void;
    setDaysOfWeek: (daysOfWeek: DayOfWeek[]) => void;
    setTimesOfDay: (timesOfDay: TimeOfDay[]) => void;
    setQuantity: (quantity: number | null) => void;
    setCompletedQuantity: (completedQuantity: number) => void;
    setUnit: (unit: Unit) => void;
    setIsChallenge: (isChallenge: boolean) => void;

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
    const [icon, setIcon] = React.useState<Icon | undefined>(undefined);
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
    const [daysOfWeek, setDaysOfWeek] = React.useState<DayOfWeek[]>([]);
    const [timesOfDay, setTimesOfDay] = React.useState<TimeOfDay[]>([]);
    const [quantity, setQuantity] = React.useState<number | null>(1);
    const [completedQuantity, setCompletedQuantity] = React.useState(0);
    const [unit, setUnit] = React.useState<Unit | undefined>(undefined);
    const [isChallenge, setIsChallenge] = React.useState<boolean>(false);
    const [challengeIds, setChallengeIds] = React.useState<number[]>([]);

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
            setIcon(habit.data.icon ?? undefined);
            setTitle(habit.data.title ?? '');
            setDescription(habit.data.description ?? '');
            setDaysOfWeek([]);
            setTimesOfDay([]);
            setQuantity(1);
            setCompletedQuantity(0);
            setUnit(undefined);
            setIsChallenge(false);
            setChallengeIds([]);
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
            setIcon(scheduledHabit.data.icon ?? undefined);
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
            setIsChallenge(scheduledHabit.data.task?.type === Constants.TaskType.CHALLENGE);

            // make this work.
            scheduledHabit.data.task?.challengeRequirements?.forEach((requirement) => {
                requirement.challengeId;
            });
            setChallengeIds(
                scheduledHabit.data.task?.challengeRequirements?.map((r) => r.challengeId ?? 0) ??
                []
            );

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
            setTitle(ScheduledHabitUtil.getTitle(newPlannedHabitScheduledHabit.data));
            setDescription(ScheduledHabitUtil.getDescription(newPlannedHabitScheduledHabit.data));
            setIcon(ScheduledHabitUtil.getIcon(newPlannedHabitScheduledHabit.data));
            setTimesOfDay(newPlannedHabitData?.timeOfDay ? [newPlannedHabitData.timeOfDay] : []);
            setQuantity(ScheduledHabitUtil.getQuantity(newPlannedHabitScheduledHabit.data));
            setUnit(ScheduledHabitUtil.getUnit(newPlannedHabitScheduledHabit.data));
            setCompletedQuantity(0);
            setIsChallenge(
                (newPlannedHabitScheduledHabit.data.task?.challengeRequirements?.length ?? 0) > 0
            );
            setChallengeIds([]);

            setDaysOfWeekEnabled(newPlannedHabitScheduledHabit.data.daysOfWeekEnabled ?? false);
            setTimesOfDayEnabled(newPlannedHabitScheduledHabit.data.timesOfDayEnabled ?? false);
            setDetailsEnabled(newPlannedHabitScheduledHabit.data.detailsEnabled ?? false);
        }
    }, [newPlannedHabitScheduledHabit.data]);

    /*
     * editing existing planned habit
     */
    React.useEffect(() => {
        if (plannedHabit.data) {
            setIcon(PlannedTaskUtil.getIcon(plannedHabit.data));
            setTitle(PlannedTaskUtil.getTitle(plannedHabit.data));
            setDescription(PlannedTaskUtil.getDescription(plannedHabit.data));
            setDaysOfWeek([]);
            setTimesOfDay(plannedHabit.data.timeOfDay ? [plannedHabit.data.timeOfDay] : []);
            setQuantity(PlannedTaskUtil.getQuantity(plannedHabit.data));
            setCompletedQuantity(plannedHabit.data.completedQuantity ?? 0);
            setUnit(PlannedTaskUtil.getUnit(plannedHabit.data));
            setIsChallenge(
                plannedHabit.data.scheduledHabit?.task?.type === Constants.TaskType.CHALLENGE
            );
            setChallengeIds([]);

            setTimesOfDayEnabled(
                !!plannedHabit.data.timeOfDay && plannedHabit.data.timeOfDay.period !== 'DEFAULT'
            );
            setDetailsEnabled(
                plannedHabit.data.quantity !== undefined || plannedHabit.data.unit !== undefined
            );
        }
    }, [plannedHabit.data]);

    const contextValue: CreateEditScheduledHabitType = {
        remoteImageUrl: remoteImageUrl,
        localImage: localImage,
        icon: icon,
        title: title,
        description: description,
        startDate: startDate,
        endDate: endDate,
        daysOfWeek: daysOfWeek,
        timesOfDay: timesOfDay,
        quantity: quantity,
        completedQuantity: completedQuantity,
        unit: unit,
        isChallenge: isChallenge,
        challengeIds: challengeIds,

        setRemoteImageUrl: setRemoteImageUrl,
        setLocalImage: setLocalImage,
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
        setIsChallenge: setIsChallenge,

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
