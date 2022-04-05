import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AddButton } from 'src/components/common/button/AddButton';
import { TasksSummaryHeader } from 'src/components/plan/tasks/TasksSummaryHeader';
import { useTheme } from 'src/components/theme/ThemeProvider';
import RoutineController, { createDays, RoutineModel, taskRunsOnSelectedDay } from 'src/controller/planning/RoutineController';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { Task } from 'src/components/plan/tasks/Task';

export const Tasks = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [routines, setRoutines] = React.useState<RoutineModel[]>([]);
    const [selectedDaysOfWeek, setSelectedDaysOfWeek] = React.useState(createDays(true, true, true, true, true, true, true));

    useFocusEffect(
        React.useCallback(() => {
            RoutineController.getRoutines(getAuth().currentUser!.uid, setRoutines);
        }, [])
    );

    const getVisibleRoutines = (): RoutineModel[] => {
        let visibleRoutines: RoutineModel[] = [];
        routines.forEach(routine => {
            if (taskRunsOnSelectedDay(routine, selectedDaysOfWeek)) {
                visibleRoutines.push(routine);
            }
        });

        return visibleRoutines;
    };

    const visibleRoutines = getVisibleRoutines();

    let routineViews: JSX.Element[] = [];
    visibleRoutines.forEach(routine => {
        if (taskRunsOnSelectedDay(routine, selectedDaysOfWeek)) {
            routineViews.push(
                <Task routine={routine} />
            );
        }
    });

    return (
        <View style={{ height: "100%" }}>
            <TasksSummaryHeader selectedDaysOfWeek={selectedDaysOfWeek} setSelectedDaysOfWeek={setSelectedDaysOfWeek} routines={visibleRoutines} />

            <ScrollView style={{ backgroundColor: colors.background_medium }}>
                {routineViews}
            </ScrollView>

            <View style={{ position: "absolute", right: 0, bottom: 0 }}>
                <AddButton onPress={() => { navigation.navigate('CreateRoutine') }} />
            </View>
        </View>
    );
};