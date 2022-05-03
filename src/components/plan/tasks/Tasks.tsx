import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AddButton } from 'src/components/common/button/AddButton';
import { TasksSummaryHeader } from 'src/components/plan/tasks/TasksSummaryHeader';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { createDays, TaskModel, taskRunsOnSelectedDay } from 'src/controller/planning/TaskController';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { Task } from 'src/components/plan/Task';

export const Tasks = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [tasks, setTasks] = React.useState<TaskModel[]>([]);
    const [selectedDaysOfWeek, setSelectedDaysOfWeek] = React.useState(createDays(true, true, true, true, true, true, true));

    useFocusEffect(
        React.useCallback(() => {
            TaskController.getTasks(getAuth().currentUser!.uid, setTasks);
        }, [])
    );

    const getVisibleTasks = (): TaskModel[] => {
        let visibleTasks: TaskModel[] = [];
        tasks.forEach(task => {
            if (taskRunsOnSelectedDay(task, selectedDaysOfWeek)) {
                visibleTasks.push(task);
            }
        });

        return visibleTasks;
    };

    const visibleTasks = getVisibleTasks();

    let taskViews: JSX.Element[] = [];
    visibleTasks.forEach(task => {
        if (taskRunsOnSelectedDay(task, selectedDaysOfWeek)) {
            taskViews.push(
                <View key={task.id} style={{ paddingBottom: 5 }} >
                    <Task task={task} />
                </View>
            );
        }
    });

    return (
        <View style={{ height: "100%" }}>
            <TasksSummaryHeader selectedDaysOfWeek={selectedDaysOfWeek} setSelectedDaysOfWeek={setSelectedDaysOfWeek} tasks={visibleTasks} />

            <ScrollView style={{ backgroundColor: colors.background_medium }}>
                {taskViews}
            </ScrollView>

            <View style={{ position: "absolute", right: 0, bottom: 0 }}>
                <AddButton onPress={() => { navigation.navigate('CreateTask') }} />
            </View>
        </View>
    );
};