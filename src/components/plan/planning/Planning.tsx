import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import PlannedDayController, {
    getDayFromDayKey,
    getDayKey,
    getTodayKey,
} from 'src/controller/planning/PlannedDayController';
import { DayPicker } from 'src/components/plan/planning/DayPicker';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { PlannedTask } from './PlannedTask';
import { PlanDay } from './PlanDay';
import { PlanningService } from 'src/util/planning/PlanningService';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import {
    getCurrentlySelectedPlannedDay,
    setCurrentlySelectedPlannedDay,
} from 'src/redux/user/GlobalState';
import { PlannedDay } from 'resources/schema';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';

export const Planning = () => {
    const [selectedDayKey, setSelectedDayKey] = React.useState<string>(getTodayKey());

    const dispatch = useAppDispatch();
    const selectedPlannedDay = useAppSelector(getCurrentlySelectedPlannedDay);

    const updateSelectedPlannedDay = (plannedDay: PlannedDay) => {
        dispatch(setCurrentlySelectedPlannedDay(plannedDay));
    };

    useFocusEffect(
        React.useCallback(() => {
            refreshPlannedToday();
        }, [selectedDayKey])
    );

    const refreshPlannedToday = async () => {
        const result = await PlannedDayController.getOrCreateViaApi(selectedDayKey);
        if (result) {
            updateSelectedPlannedDay(result);
        }
    };

    const onSharePlannedDayResults = async () => {
        if (selectedPlannedDay) {
            await PlanningService.sharePlannedDayResults(selectedPlannedDay!);
        }

        refreshPlannedToday();
    };

    let taskViews: JSX.Element[] = [];
    for (const task of selectedPlannedDay?.plannedTasks || []) {
        taskViews.push(<PlannedTask key={task.id} plannedTask={task} />);
    }

    const onDayChanged = (day: number) => {
        const newDayKey = getDayKey(day);
        setSelectedDayKey(newDayKey);
    };

    return (
        <View>
            <EmbtrMenuCustom />

            <View style={{ flex: 1 }}>
                <View style={{ paddingBottom: TIMELINE_CARD_PADDING }}>
                    <DayPicker day={getDayFromDayKey(selectedDayKey)} onDayChanged={onDayChanged} />
                </View>

                {selectedPlannedDay && (
                    <PlanDay
                        onPlannedDayUpdated={updateSelectedPlannedDay}
                        navigateToAddTasks={() => {}}
                        onSharePlannedDayResults={onSharePlannedDayResults}
                        showCreatePlannedDayResultsRecommendation={true}
                    />
                )}
            </View>
        </View>
    );
};
