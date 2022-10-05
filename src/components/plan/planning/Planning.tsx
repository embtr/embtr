import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import PlannedDayController, {
    createPlannedTask,
    getDayFromDayKey,
    getDayKey,
    getTodayKey,
    PlannedDay,
    PlannedTaskModel,
} from 'src/controller/planning/PlannedDayController';
import { PlannedTask } from 'src/components/plan/planning/PlannedTask';
import { CalendarView } from 'src/components/plan/planning/views/calendar/CalendarView';
import { DayPicker } from 'src/components/plan/planning/DayPicker';
import { getAuth } from 'firebase/auth';
import { UserType } from 'src/controller/profile/ProfileController';
import { AddHabitModal } from 'src/components/plan/planning/AddHabitModal';
import { TaskModel } from 'src/controller/planning/TaskController';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { PlanDay } from './PlanDay';

interface Props {
    showSelectTaskModal: boolean;
    dismissSelectTaskModal: Function;
    onDayChange: Function;
    useCalendarView: boolean;
}

export const Planning = ({ showSelectTaskModal, dismissSelectTaskModal, onDayChange, useCalendarView }: Props) => {
    const [plannedToday, setPlannedToday] = React.useState<PlannedDay>();
    const [selectedDayKey, setSelectedDayKey] = React.useState<string>(getTodayKey());

    useFocusEffect(
        React.useCallback(() => {
            PlannedDayController.get(getAuth().currentUser?.uid!, selectedDayKey, setPlannedToday);
        }, [selectedDayKey])
    );

    const onDayChanged = (day: number) => {
        const newDayKey = getDayKey(day);
        setSelectedDayKey(newDayKey);
        onDayChange(newDayKey);
        PlannedDayController.get(getAuth().currentUser?.uid!, newDayKey, setPlannedToday);
    };

    let taskViews: JSX.Element[] = [];
    plannedToday?.plannedTasks.forEach((plannedTask) => {
        taskViews.push(<PlannedTask key={plannedTask.id} plannedTask={plannedTask} />);
    });

    const addHabitFromModal = (habitToAdd: TaskModel | undefined) => {
        if (!habitToAdd || !plannedToday?.id) {
            return;
        }

        const plannedTask: PlannedTaskModel = createPlannedTask(habitToAdd, 360, 30);
        PlannedDayController.addTask(plannedToday, plannedTask, () => {
            PlannedDayController.get(getAuth().currentUser?.uid!, plannedToday!.id!, setPlannedToday);
            dismissSelectTaskModal();
        });
    };

    const updateTask = (updatedPlannedTask: PlannedTaskModel) => {
        PlannedDayController.updateTask(plannedToday!, updatedPlannedTask, () => {
            if (plannedToday?.id) {
                PlannedDayController.get(getAuth().currentUser?.uid!, plannedToday?.id, setPlannedToday);
            }
        });
    };

    return (
        <Screen>
            <EmbtrMenuCustom />
            {plannedToday?.id && (
                <AddHabitModal visible={showSelectTaskModal} dayKey={plannedToday?.id} confirm={addHabitFromModal} dismiss={dismissSelectTaskModal} />
            )}

            <View style={{ flex: 1 }}>
                <View style={{ paddingTop: 20, paddingBottom: 25 }}>
                    <DayPicker day={getDayFromDayKey(selectedDayKey)} onDayChanged={onDayChanged} />
                </View>
                {useCalendarView ? (
                    <CalendarView plannedToday={plannedToday} onTaskUpdated={updateTask} userType={UserType.USER} />
                ) : plannedToday ? (
                    <PlanDay plannedDay={plannedToday} onTaskUpdated={updateTask} />
                ) : (
                    <View />
                )}
            </View>
        </Screen>
    );
};
