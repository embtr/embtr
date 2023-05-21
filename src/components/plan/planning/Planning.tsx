import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import PlannedDayController, {
    getDayFromDayKey,
} from 'src/controller/planning/PlannedDayController';
import { DayPicker } from 'src/components/plan/planning/DayPicker';
import { AddHabitModal } from 'src/components/plan/planning/AddHabitModal';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { PlannedDay, PlannedDay as PlannedDayModel } from 'resources/schema';
import { PlannedTask } from './PlannedTask';
import { PlanDay } from './PlanDay';

interface Props {
    showSelectTaskModal: boolean;
    setShowSelectTaskModal: Function;
    dismissSelectTaskModal: Function;
    onDayChange: Function;
    useCalendarView: boolean;
    selectedDayKey: string;
    onCompleteDay: Function;
    onAllTasksComplete: Function;
}

export const Planning = ({
    showSelectTaskModal,
    setShowSelectTaskModal,
    dismissSelectTaskModal,
    onDayChange,
    selectedDayKey,
    onCompleteDay,
    onAllTasksComplete,
}: Props) => {
    const [plannedDay, setPlannedDay] = React.useState<PlannedDayModel>();

    useFocusEffect(
        React.useCallback(() => {
            refreshPlannedToday();
        }, [selectedDayKey])
    );

    const allTasksAreComplete = (plannedDay: PlannedDay) => {
        let allTasksAreComplete = true;
        plannedDay?.plannedTasks?.forEach((plannedTask) => {
            if (
                !(
                    plannedTask.count === plannedTask.completedCount &&
                    (plannedTask.count ?? 0) > 0 &&
                    plannedTask.status !== 'FAILED'
                )
            ) {
                allTasksAreComplete = false;
                return;
            }
        });

        return allTasksAreComplete;
    };

    const refreshPlannedToday = async () => {
        const allTasksAreCompleteBefore = plannedDay && allTasksAreComplete(plannedDay);
        const result = await PlannedDayController.getOrCreateViaApi(selectedDayKey);
        const allTasksAreCompleteAfter = result && allTasksAreComplete(result);

        if (!allTasksAreCompleteBefore && allTasksAreCompleteAfter) {
            onAllTasksComplete();
        }

        setPlannedDay(result);
    };

    const onDismissSelectTaskModal = () => {
        refreshPlannedToday();
        dismissSelectTaskModal();
    };

    const onCompleteDayInterceptor = async () => {
        await onCompleteDay();
        refreshPlannedToday();
    };

    let taskViews: JSX.Element[] = [];
    for (const task of plannedDay?.plannedTasks || []) {
        taskViews.push(<PlannedTask key={task.id} plannedTask={task} />);
    }

    return (
        <Screen>
            <EmbtrMenuCustom />
            {plannedDay?.id && (
                <AddHabitModal
                    visible={showSelectTaskModal}
                    plannedDay={plannedDay}
                    dismiss={onDismissSelectTaskModal}
                />
            )}

            <View style={{ flex: 1 }}>
                <View style={{ paddingTop: 20, paddingBottom: 25 }}>
                    <DayPicker day={getDayFromDayKey(selectedDayKey)} onDayChanged={onDayChange} />
                </View>
                {plannedDay && (
                    <PlanDay
                        plannedDay={plannedDay}
                        onTaskUpdated={refreshPlannedToday}
                        setShowSelectTaskModal={setShowSelectTaskModal}
                        onCompleteDay={onCompleteDayInterceptor}
                    />
                )}
            </View>
        </Screen>
    );
};
