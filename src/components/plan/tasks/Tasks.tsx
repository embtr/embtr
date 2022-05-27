import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AddButton } from 'src/components/common/button/AddButton';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { Task } from 'src/components/plan/Task';
import { Target } from 'src/components/plan/task/CreateTask';
import { TasksSummaryHeader } from 'src/components/plan/tasks/TasksSummaryHeader';

export const Tasks = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [tasks, setTasks] = React.useState<TaskModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            TaskController.getTasks(getAuth().currentUser!.uid, setTasks);
        }, [])
    );

    let taskViews: JSX.Element[] = [];
    tasks.forEach(task => {
        taskViews.push(
            <View key={task.id} style={{ paddingBottom: 5 }} >
                <Task task={task} />
            </View>
        );
    });

    return (
        <View style={{ height: "100%" }}>

            <TasksSummaryHeader tasks={tasks} />

            <ScrollView style={{ backgroundColor: colors.background_medium }}>
                {taskViews}
            </ScrollView>

            <View style={{ position: "absolute", right: 0, bottom: 0 }}>
                <AddButton onPress={() => { navigation.navigate('CreateTask', { target: Target.PLAN }) }} />
            </View>
        </View>
    );
};