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
import { Task } from 'src/components/plan/tasks/Task';
import { Screen } from 'src/components/common/Screen';
import TodayController from 'src/controller/planning/TodayController';

export const Today = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [tasks, setTasks] = React.useState<TaskModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            TaskController.getTasks(getAuth().currentUser!.uid, setTasks);
        }, [])
    );

    const getVisibleTasks = (): TaskModel[] => {
        let visibleTasks: TaskModel[] = [];
        tasks.forEach(task => {
            visibleTasks.push(task);
        });

        return visibleTasks;
    };

    const visibleTasks = getVisibleTasks();

    let taskViews: JSX.Element[] = [];
    visibleTasks.forEach(task => {
        taskViews.push(
            <Task key={task.id} task={task} />
        );
    });

    return (
        <Screen>
            <View style={{ height: "100%" }}>
                <ScrollView style={{ backgroundColor: colors.background_medium }}>
                    {taskViews}
                </ScrollView>

                <View style={{ position: "absolute", right: 0, bottom: 0 }}>
                    <AddButton onPress={() => { navigation.navigate('CreateTask') }} />
                </View>
            </View>
        </Screen>
    );
};