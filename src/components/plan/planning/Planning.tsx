import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import PlannedDayController, {
    getDayFromDayKey,
} from 'src/controller/planning/PlannedDayController';
import { DayPicker } from 'src/components/plan/planning/DayPicker';
import { AddHabitModal } from 'src/components/plan/planning/AddHabitModal';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { PlannedDay as PlannedDayModel } from 'resources/schema';
import { PlannedTask } from './PlannedTask';
import { PlanDay } from './PlanDay';
import { PlanningService } from 'src/util/planning/PlanningService';
import { useAppSelector } from 'src/redux/Hooks';
import { getRefreshActivitiesTimestamp } from 'src/redux/user/GlobalState';

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

    const activitiesUpdated = useAppSelector(getRefreshActivitiesTimestamp);
    React.useEffect(() => {
        refreshPlannedToday();
    }, [activitiesUpdated]);

    useFocusEffect(
        React.useCallback(() => {
            refreshPlannedToday();
        }, [selectedDayKey])
    );

    const refreshPlannedToday = async () => {
        const result = await PlannedDayController.getOrCreateViaApi(selectedDayKey);
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
        <View>
            <EmbtrMenuCustom />
            {plannedDay?.id && (
                <AddHabitModal
                    visible={showSelectTaskModal}
                    plannedDay={plannedDay}
                    dismiss={onDismissSelectTaskModal}
                />
            )}

            <View style={{ flex: 1 }}>
                <View style={{ paddingBottom: 25 }}>
                    <DayPicker day={getDayFromDayKey(selectedDayKey)} onDayChanged={onDayChange} />
                </View>

                {plannedDay && (
                    <PlanDay
                        plannedDay={plannedDay}
                        setShowSelectTaskModal={setShowSelectTaskModal}
                        onSharePlannedDayResults={onSharePlannedDayResults}
                        showCreatePlannedDayResultsRecommendation={true}
                    />
                )}
            </View>
        </View>
    );
};
