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
import { PlannedTask } from 'src/components/today/PlannedTask';
import { CalendarView } from 'src/components/today/views/calendar/CalendarView';
import { TodayPicker } from 'src/components/today/TodayPicker';
import { getAuth } from 'firebase/auth';
import { UserType } from 'src/controller/profile/ProfileController';
import { AddHabitModal } from 'src/components/today/AddHabitModal';
import { TaskModel } from 'src/controller/planning/TaskController';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';

interface Props {
    showSelectTaskModal: boolean;
    dismissSelectTaskModal: Function;
    onDayChange: Function;
}

export const Today = ({ showSelectTaskModal, dismissSelectTaskModal, onDayChange }: Props) => {
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

    return (
        <Screen>
            <EmbtrMenuCustom />
            {plannedToday?.id && (
                <AddHabitModal visible={showSelectTaskModal} dayKey={plannedToday?.id} confirm={addHabitFromModal} dismiss={dismissSelectTaskModal} />
            )}

            <View style={{ flex: 1 }}>
                <View style={{ paddingTop: 20, paddingBottom: 25 }}>
                    <TodayPicker day={getDayFromDayKey(selectedDayKey)} onDayChanged={onDayChanged} />
                </View>
                <CalendarView plannedToday={plannedToday} onPlanTodayUpdated={setPlannedToday} userType={UserType.USER} />
            </View>
        </Screen>
    );
};
