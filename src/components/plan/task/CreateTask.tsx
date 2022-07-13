import React from 'react';
import { View, Text, TextInput, Keyboard } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CreateDailyTask } from 'src/components/plan/task/CreateDailyTask';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { PlanTabScreens, RootStackParamList } from 'src/navigation/RootStackParamList';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { StackNavigationProp } from '@react-navigation/stack';
import { CreateOneTimeTask } from 'src/components/plan/task/CreateOneTimeTask';
import PlannedDayController, { PlannedDay, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';

export const CreateTask = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<PlanTabScreens, 'CreateTask'>>();
    const dayKey = route.params.dayKey;

    const [name, setName] = React.useState("");

    const createTask = (task: TaskModel) => {
        TaskController.createTask(task, () => { navigation.goBack() });
    };

    const createPlannedTaskCallback = (plannedTask: PlannedTaskModel) => {
        if (dayKey) {
            PlannedDayController.get(dayKey, (plannedDay: PlannedDay) => {
                PlannedDayController.addTask(plannedDay, plannedTask, () => { navigation.goBack() });
            });
        }
    };

    return (
        <Screen>
            <Banner name={"Add Task"} leftIcon={"arrow-back"} leftRoute={"BACK"} />

            <View style={{ paddingTop: 10, alignItems: "center" }}>
                <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.text, paddingTop: 15, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Task</Text>
                <TextInput
                    style={{ padding: 15, fontFamily: "Poppins_400Regular", color: colors.text, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, width: "95%" }}
                    placeholder={"Enter your task"}
                    placeholderTextColor={colors.secondary_text}
                    onChangeText={setName}
                    //onChange={() => { setTitleError(false) }}
                    value={name}
                    autoCorrect={true}
                />

                <View style={{ flex: 5 }}>
                    {dayKey && <CreateOneTimeTask name={name} onCreateTask={createPlannedTaskCallback} />}
                </View>
            </View>
        </Screen>
    );
};