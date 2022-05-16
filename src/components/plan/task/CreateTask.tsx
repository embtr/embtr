import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, TextInput, Modal, StyleSheet } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CreateDailyTask } from 'src/components/plan/task/CreateDailyTask';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { PlanTabScreens, RootStackParamList } from 'src/navigation/RootStackParamList';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { StackNavigationProp } from '@react-navigation/stack';
import { CreateOneTimeTask } from 'src/components/plan/task/CreateOneTimeTask';
import PlannedDayController, { createPlannedTask, getTodayKey, PlannedDay, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { MaterialIcons } from '@expo/vector-icons';
import { FadeIn } from 'react-native-reanimated';

export const enum Target {
    PLAN,
    TODAY
}

export const CreateTask = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<PlanTabScreens, 'CreateTask'>>();
    const target: Target = route.params.target;

    const [name, setName] = React.useState("");
    const [frequency, setFrequency] = React.useState(target == Target.PLAN ? "daily" : "today");
    const [errorModal, setErrorModal] = React.useState(false);

    const createTask = (task: TaskModel) => {
        if (task.days.sunday === true || task.days.monday === true || task.days.tuesday === true || task.days.wednesday === true || task.days.thursday === true || task.days.friday === true || task.days.saturday === true) {
        TaskController.createTask(task, () => { navigation.goBack() });
        } else {
            setErrorModal(true);
        }
    };

    const createPlannedTaskCallback = (task: TaskModel) => {
        PlannedDayController.get(getTodayKey(), (plannedDay: PlannedDay) => {
            const plannedTask: PlannedTaskModel = createPlannedTask(task);
            PlannedDayController.addTask(plannedDay, plannedTask, () => { navigation.goBack() });
        });
    };

    return (
        <Screen>
            <View style={{backgroundColor: errorModal === false ? 'transparent' : 'rgba(0,0,0,0.5)'}}>
            <Banner name={"Create Task"} leftIcon={"arrow-back"} leftRoute={"BACK"} />

            <View style={{ flexDirection: "column", flex: 1 }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <TextInput
                        style={{ textAlign: "center", marginLeft: "10%", marginRight: "10%", paddingLeft: 10, height: 40, borderColor: colors.background_medium, backgroundColor: colors.background_medium, borderWidth: 1, borderRadius: 10, color: colors.text, fontSize: 20 }}
                        onChangeText={setName}
                        value={name}
                        placeholderTextColor={colors.secondary_text}
                        placeholder={"Task Name"}
                    />
                </View>

                {target === Target.PLAN &&
                    <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center", flex: 1 }}>
                        <Text style={{ color: colors.text, fontSize: 20, textAlign: "right" }}>I will run this task</Text>
                        <View style={{ alignItems: "flex-start" }}>
                            <Picker
                                itemStyle={{ height: 120 }}
                                style={{ width: 150, color: colors.text }}

                                selectedValue={frequency}
                                onValueChange={(itemValue) => setFrequency(itemValue)}
                            >
                                <Picker.Item color={colors.text} label="Today" value="today" />
                                <Picker.Item color={colors.text} label="Daily" value="daily" />
                                <Picker.Item color={colors.text} label="Weekly" value="Weekly" />
                                <Picker.Item color={colors.text} label="Monthly" value="monthly" />
                                <Picker.Item color={colors.text} label="Yearly" value="yearly" />
                            </Picker>
                        </View>
                    </View>
                }

                <View style={{ flex: 5 }}>
                    {frequency === "today" && <CreateOneTimeTask name={name} onCreateTask={createPlannedTaskCallback} />}
                    {frequency === "daily" && <CreateDailyTask name={name} onCreateTask={createTask} />}
                </View>

                <Modal visible={errorModal} transparent={true} animationType='slide'>
                    <View style={styles.modalView}>
                        <MaterialIcons
                            name='close'
                            size={24}
                            style={styles.modalToggle}
                            onPress={() => setErrorModal(false)}
                        />
                        <Text style={styles.modalText}>Please Select a Day</Text>
                    </View>
                </Modal>
            </View>
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: 'white',
        marginTop: '50%',
        marginRight: 20,
        marginLeft: 20,
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 10
    },
    modalToggle: {
        marginTop: 50,
        borderWidth: 1,
        borderColor: '#f2f2f2',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center'
        
    },
    modalText: {
        marginTop: 30,
        marginBottom: 40,
        alignSelf: 'center'
    }
})