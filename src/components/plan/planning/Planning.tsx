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
import { AddHabitModal } from 'src/components/plan/planning/AddHabitModal';
import { TaskModel } from 'src/controller/planning/TaskController';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { PlanDay } from './PlanDay';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';

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
            refreshPlannedToday(selectedDayKey);
        }, [selectedDayKey])
    );

    const onDayChanged = (day: number) => {
        const newDayKey = getDayKey(day);
        setSelectedDayKey(newDayKey);
        onDayChange(newDayKey);
        refreshPlannedToday(newDayKey);
    };

    const refreshPlannedToday = (dayKey: string) => {
        PlannedDayController.get(getAuth().currentUser?.uid!, dayKey, setPlannedToday);
    };

    const addHabitsFromModal = async (habits: TaskModel[]) => {
        if (!plannedToday) {
            return;
        }

        let createdPlannedTasks: PlannedTaskModel[] = [];

        for (let habit of habits) {
            const plannedTask: PlannedTaskModel = createPlannedTask(habit, 360, 30);
            createdPlannedTasks.push(plannedTask);
        }

        await PlannedTaskController.addTasks(plannedToday, createdPlannedTasks);
        refreshPlannedToday(selectedDayKey);
    };

    const updateTask = (updatedPlannedTask: PlannedTaskModel) => {
        PlannedTaskController.update(plannedToday!, updatedPlannedTask, () => {
            if (plannedToday?.id) {
                PlannedDayController.get(getAuth().currentUser?.uid!, plannedToday?.id, setPlannedToday);
            }
        });
    };

    let taskViews: JSX.Element[] = [];
    plannedToday?.plannedTasks.forEach((plannedTask) => {
        taskViews.push(<PlannedTask key={plannedTask.id} plannedTask={plannedTask} />);
    });

    return (
        <Screen>
            <EmbtrMenuCustom />
            {plannedToday?.id && (
                <AddHabitModal visible={showSelectTaskModal} plannedDay={plannedToday} confirm={addHabitsFromModal} dismiss={dismissSelectTaskModal} />
            )}

            <View style={{ flex: 1 }}>
                <View style={{ paddingTop: 20, paddingBottom: 25 }}>
                    <DayPicker day={getDayFromDayKey(selectedDayKey)} onDayChanged={onDayChanged} />
                </View>
                {useCalendarView ? (
                    <CalendarView plannedToday={plannedToday} onTaskUpdated={updateTask} />
                ) : plannedToday ? (
                    <PlanDay plannedDay={plannedToday} onTaskUpdated={updateTask} />
                ) : (
                    <View />
                )}
            </View>
        </Screen>
    );
};
