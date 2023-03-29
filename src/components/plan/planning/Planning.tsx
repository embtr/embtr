import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import PlannedDayController, { getDayFromDayKey, getDayKey, getTodayKey } from 'src/controller/planning/PlannedDayController';
import { DayPicker } from 'src/components/plan/planning/DayPicker';
import { AddHabitModal } from 'src/components/plan/planning/AddHabitModal';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { PlannedDay as PlannedDayModel } from 'resources/schema';
import { PlannedTask } from './PlannedTask';
import { PlanDay } from './PlanDay';

interface Props {
    showSelectTaskModal: boolean;
    openSelectTaskModal: Function;
    dismissSelectTaskModal: Function;
    onDayChange: Function;
    useCalendarView: boolean;
}

export const Planning = ({ showSelectTaskModal, openSelectTaskModal, dismissSelectTaskModal, onDayChange, useCalendarView }: Props) => {
    const [plannedDay, setPlannedDay] = React.useState<PlannedDayModel>();
    const [selectedDayKey, setSelectedDayKey] = React.useState<string>(getTodayKey());

    useFocusEffect(
        React.useCallback(() => {
            refreshPlannedToday();
        }, [selectedDayKey])
    );

    const onDayChanged = (day: number) => {
        const newDayKey = getDayKey(day);
        setSelectedDayKey(newDayKey);
        onDayChange(newDayKey);
    };

    const refreshPlannedToday = async () => {
        const result = await PlannedDayController.getOrCreateViaApi(selectedDayKey);
        setPlannedDay(result);
    };

    const onDismissSelectTaskModal = () => {
        refreshPlannedToday();
        dismissSelectTaskModal();
    };

    let taskViews: JSX.Element[] = [];
    for (const task of plannedDay?.plannedTasks || []) {
        taskViews.push(<PlannedTask key={task.id} plannedTask={task} />);
    }

    return (
        <Screen>
            <EmbtrMenuCustom />
            {plannedDay?.id && <AddHabitModal visible={showSelectTaskModal} plannedDay={plannedDay} dismiss={onDismissSelectTaskModal} />}

            <View style={{ flex: 1 }}>
                <View style={{ paddingTop: 20, paddingBottom: 25 }}>
                    <DayPicker day={getDayFromDayKey(selectedDayKey)} onDayChanged={onDayChanged} />
                </View>
                {plannedDay && <PlanDay plannedDay={plannedDay} onTaskUpdated={refreshPlannedToday} onOpenHabitsModal={openSelectTaskModal} />}
                {/* useCalendarView ? (
                    <CalendarView plannedToday={plannedToday} onTaskUpdated={updateTask} />
                ) : plannedToday ? (
                    <PlanDay plannedDay={plannedToday} onTaskUpdated={updateTask} onOpenHabitsModal={openSelectTaskModal} />
                ) : (
                    <View />
                )*/}
            </View>
        </Screen>
    );
};
