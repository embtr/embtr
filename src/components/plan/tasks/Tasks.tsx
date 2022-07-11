import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { Task } from 'src/components/plan/Task';

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
            <View key={task.id} style={{ paddingBottom: 5, width: "100%", alignItems: "center" }} >
                <Task task={task} />
            </View>
        );
    });

    return (
        <View style={{ height: "100%" }}>
            <ScrollView style={{ backgroundColor: colors.background, paddingTop: 7 }}>
                {taskViews}
            </ScrollView>
        </View>
    );
};