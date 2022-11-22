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

    const [habits, setHabits] = React.useState<TaskModel[]>([]);
    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            TaskController.getTasks(getAuth().currentUser!.uid, setHabits);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            PillarController.getPillars(getAuth().currentUser!.uid, setPillars);
        }, [])
    );

    let taskViews: JSX.Element[] = [];
    habits.forEach((habit) => {
        taskViews.push(
            <View key={habit.id} style={{ paddingBottom: 5, width: '100%', alignItems: 'center' }}>
                <Task task={habit} pillars={pillars} />
            </View>
        );
    });

    //saving for later
    const deleteTask = (task: TaskModel) => {
        Alert.alert('Archive Task?', "Archive task '" + task.name + "'?", [
            { text: 'Cancel', onPress: () => {}, style: 'cancel' },
            {
                text: 'Archive',
                onPress: () => {
                    if (task) {
                        TaskController.archiveTask(task, () => {
                            TaskController.getTasks(getAuth().currentUser!.uid, setHabits);
                        });
                    }
                },
            },
        ]);
    };

    return (
        <View style={{ height: '100%' }}>
            <ScrollView style={{ backgroundColor: colors.background, paddingTop: 7 }}>{taskViews}</ScrollView>
        </View>
    );
};
