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
import { PlannedDay as PlannedDayModel } from 'resources/schema';
import { PlannedTask } from './PlannedTask';
import { PlanDay } from './PlanDay';
import { useAppSelector } from 'src/redux/Hooks';
import { getFireConfetti } from 'src/redux/user/GlobalState';
import { PlanningService } from 'src/util/planning/PlanningService';

interface Props {
    showSelectTaskModal: boolean;
    setShowSelectTaskModal: Function;
    dismissSelectTaskModal: Function;
    onDayChange: Function;
    useCalendarView: boolean;
    selectedDayKey: string;
}

export const Planning = ({
    showSelectTaskModal,
    setShowSelectTaskModal,
    dismissSelectTaskModal,
    onDayChange,
    selectedDayKey,
}: Props) => {
    const [plannedDay, setPlannedDay] = React.useState<PlannedDayModel>();

    useFocusEffect(
        React.useCallback(() => {
            refreshPlannedToday();
        }, [selectedDayKey])
    );

    const fireConfetti = useAppSelector(getFireConfetti);

    const refreshPlannedToday = async () => {
        const result = await PlannedDayController.getOrCreateViaApi(selectedDayKey);
        setPlannedDay(result);
    };

    const onTaskUpdated = async () => {
        if (!plannedDay) {
            return;
        }

        const result = await PlanningService.onTaskUpdated(plannedDay, fireConfetti);
        setPlannedDay(result);
    };

    const onDismissSelectTaskModal = () => {
        refreshPlannedToday();
        dismissSelectTaskModal();
    };

    const onSharePlannedDayResults = async () => {
        if (plannedDay) {
            await PlanningService.sharePlannedDayResults(plannedDay!);
        }

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
                        onTaskUpdated={onTaskUpdated}
                        setShowSelectTaskModal={setShowSelectTaskModal}
                        onSharePlannedDayResults={onSharePlannedDayResults}
                    />
                )}
            </View>
        </Screen>
    );
};
