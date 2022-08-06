import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';
import { Alert, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { Task } from 'src/components/plan/Task';
import { PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';

export const Tasks = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [tasks, setTasks] = React.useState<TaskModel[]>([]);
    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            TaskController.getTasks(getAuth().currentUser!.uid, setTasks);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            PillarController.getPillars(getAuth().currentUser!.uid, setPillars)
        }, [])
    );

    let taskViews: JSX.Element[] = [];
    tasks.forEach(task => {
        taskViews.push(
            <View key={task.id} style={{ paddingBottom: 5, width: "100%", alignItems: "center" }} >
                <Task task={task} pillars={pillars} />
            </View>
        );
    });

    //saving for later
    const deleteTask = (task: TaskModel) => {
        Alert.alert("Archive Task?", "Archive task '" + task.name + "'?", [
            { text: 'Cancel', onPress: () => { }, style: 'cancel', },
            {
                text: 'Archive', onPress: () => {
                    if (task) {
                        TaskController.archiveTask(task, () => { TaskController.getTasks(getAuth().currentUser!.uid, setTasks); });
                    }
                }
            },
        ]);
    }


    return (
        <View style={{ height: "100%" }}>
            <ScrollView style={{ backgroundColor: colors.background, paddingTop: 7 }}>
                {taskViews}
            </ScrollView>
        </View>
    );
};