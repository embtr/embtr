import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View } from 'react-native';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';
import PlannedDayController, { getTodayKey, PlannedDay, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { PlannedTask } from 'src/components/today/PlannedTask';
import { CalendarView } from 'src/components/today/views/calendar/CalendarView';
import { Banner } from 'src/components/common/Banner';
import { Target } from 'src/components/plan/task/CreateTask';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { TodayPicker } from 'src/components/today/TodayPicker';

export const Today = () => {
    const navigation = useNavigation<StackNavigationProp<TodayTab>>();

    const [plannedToday, setPlannedToday] = React.useState<PlannedDay>();

    useFocusEffect(
        React.useCallback(() => {
            PlannedDayController.get(getTodayKey(), setPlannedToday);
        }, [])
    );

    const updateTask = (updatedPlannedTask: PlannedTaskModel) => {
        PlannedDayController.updateTask(plannedToday!, updatedPlannedTask, () => {
            PlannedDayController.get(getTodayKey(), setPlannedToday);
        });
    };

    let taskViews: JSX.Element[] = [];
    plannedToday?.plannedTasks.forEach(plannedTask => {
        taskViews.push(
            <PlannedTask key={plannedTask.id} plannedTask={plannedTask} />
        );
    });

    return (
        <Screen>
            <EmbtrMenuCustom />

            <View style={{ flex: 1 }}>
                <Banner name={"Today"} leftIcon={"add"} leftOnClick={() => { navigation.navigate('CreateTask', { target: Target.TODAY }) }} />
                <View style={{ paddingTop: 20, paddingBottom: 25 }}>
                <TodayPicker />
                </View>
                <CalendarView plannedToday={plannedToday} updateTask={updateTask} />
            </View>
        </Screen>
    );
};