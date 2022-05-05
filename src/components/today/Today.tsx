import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';
import PlannedDayController, { getTodayKey, PlannedDay, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { PlannedTask } from 'src/components/today/PlannedTask';
import { CalendarView } from 'src/components/today/views/calendar/CalendarView';
import { TodayHeader } from 'src/components/today/TodayHeader';
import { Banner } from 'src/components/common/Banner';

export const Today = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

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
            <View style={{ flex: 1 }}>
                <Banner name={"Today"} />
                <TodayHeader plannedToday={plannedToday} />
                <CalendarView plannedToday={plannedToday} updateTask={updateTask} />
            </View>
        </Screen>
    );
};