import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import PlannedDayController, { getDayFromDayKey, getDayKey, getTodayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';
import { PlannedTask } from 'src/components/plan/planning/PlannedTask';
import { CalendarView } from 'src/components/plan/planning/views/calendar/CalendarView';
import { DayPicker } from 'src/components/plan/planning/DayPicker';
import { AddHabitModal } from 'src/components/plan/planning/AddHabitModal';
import { TaskModel } from 'src/controller/planning/TaskController';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { PlanDay } from './PlanDay';
import PlannedTaskController, { createPlannedTaskModel, PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import { getCurrentUid } from 'src/session/CurrentUserProvider';

interface Props {
    showSelectTaskModal: boolean;
    openSelectTaskModal: Function;
    dismissSelectTaskModal: Function;
    onDayChange: Function;
    useCalendarView: boolean;
}

export const Planning = ({ showSelectTaskModal, openSelectTaskModal, dismissSelectTaskModal, onDayChange, useCalendarView }: Props) => {
    const [plannedToday, setPlannedToday] = React.useState<PlannedDay>();
    const [selectedDayKey, setSelectedDayKey] = React.useState<string>(getTodayKey());

    const currentUser = useAppSelector(getCurrentUser);

    useFocusEffect(
        React.useCallback(() => {
            refreshPlannedToday(selectedDayKey);
        }, [selectedDayKey])
    );

    const getGoal = (goals: GoalModel[], goalId: string) => {
        for (const goal of goals) {
            if (goal.id === goalId) {
                return goal;
            }
        }

        return undefined;
    };

    const onDayChanged = (day: number) => {
        const newDayKey = getDayKey(day);
        setSelectedDayKey(newDayKey);
        onDayChange(newDayKey);
    };

    const refreshPlannedToday = async (dayKey: string) => {
        const plannedDay = await PlannedDayController.getOrCreate(currentUser, dayKey);
        setPlannedToday(plannedDay);
    };

    const addHabitsFromModal = async (habits: TaskModel[]) => {
        if (!plannedToday?.id) {
            return;
        }

        const createdPlannedTasks: PlannedTaskModel[] = [];
        GoalController.getGoals(getCurrentUid(), (goals: GoalModel[]) => {
            for (let habit of habits) {
                let goal = undefined;
                if (habit.goalId) {
                    goal = getGoal(goals, habit.goalId);
                }

                const plannedTask: PlannedTaskModel = createPlannedTaskModel(plannedToday.dayKey, habit, 360, 30, goal);
                createdPlannedTasks.push(plannedTask);
            }

            PlannedTaskController.createTasks(createdPlannedTasks);
            refreshPlannedToday(selectedDayKey);
        });
    };

    const updateTask = async (updatedPlannedTask: PlannedTaskModel) => {
        await PlannedTaskController.update(currentUser, updatedPlannedTask);
        refreshPlannedToday(selectedDayKey);
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
                    <PlanDay plannedDay={plannedToday} onTaskUpdated={updateTask} onOpenHabitsModal={openSelectTaskModal} />
                ) : (
                    <View />
                )}
            </View>
        </Screen>
    );
};
