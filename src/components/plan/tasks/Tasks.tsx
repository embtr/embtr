import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { Task } from 'src/components/plan/Task';
import { PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';

export const Tasks = () => {
    const [tasks, setTasks] = React.useState<TaskModel[]>([]);
    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

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

    let taskElements: { key: string, task: TaskModel }[] = []
    tasks.forEach(task => {
        taskElements.push({ key: `${task.id}`, task: task });
    });

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
        tasks.length > 0 ?
            <SwipeListView
                closeOnRowPress={true}
                closeOnRowBeginSwipe={true}
                closeOnRowOpen={true}
                closeOnScroll={true}
                data={taskElements}
                renderItem={(data, rowMap) => (
                    <View key={data.item.task.id} style={{ paddingBottom: 5, width: "100%", alignItems: "center" }} >
                        <Task task={data.item.task} pillars={pillars} />
                    </View>
                )}
                renderHiddenItem={(data, rowMap) => (
                    <View style={{ flexDirection: "row", height: "100%" }}>
                        <View style={{ flex: 1, backgroundColor: "red", marginLeft: 10, marginRight: 10, marginBottom: 5, borderRadius: 15, alignItems: "flex-end", justifyContent: 'center' }}>
                            <TouchableOpacity style={{ height: "100%", width: "100%", borderRadius: 15, alignItems: "flex-end", justifyContent: "center" }} onPress={() => { deleteTask(data.item.task) }}>
                                <Text style={{ paddingRight: 10, fontFamily: "Poppins_500Medium" }}>Delete</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}
                leftOpenValue={0}
                rightOpenValue={-75}
                disableRightSwipe={true}
            />
            :
            <View style={{ height: "97%", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: colors.secondary_text, paddingLeft: 40, paddingRight: 40 }} >
                    You have no habits... Let's change that!
                </Text>
                <Text onPress={() => { navigation.navigate("CreateDailyTask") }} style={{ color: colors.tab_selected, fontFamily: "Poppins_400Regular" }} > create a habit</Text>
            </View>
    )
};