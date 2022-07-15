import React from 'react';
import { Picker } from "@react-native-picker/picker";
import { View, Text, Keyboard, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import { EmbtrButton } from "src/components/common/button/EmbtrButton";
import { useTheme } from "src/components/theme/ThemeProvider";
import TaskController, { createTaskModel } from 'src/controller/planning/TaskController';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { Banner } from 'src/components/common/Banner';
import { isIosApp } from 'src/util/DeviceUtil';
import { Screen } from 'src/components/common/Screen';
import DropDownPicker from 'react-native-dropdown-picker';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import { getAuth } from 'firebase/auth';


export const CreateDailyTask = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [name, setName] = React.useState("");
    const [details, setDetails] = React.useState("");

    const [goals, setGoals] = React.useState<GoalModel[]>([]);
    
    const [menuOpen, setMenuOption] = React.useState(false);
    const [selectedGoal, setSelectedGoal] = React.useState('');
    const [goalOptions, setGoalOptions] = React.useState([{ label: '', value: '' }]);

    useFocusEffect(
        React.useCallback(() => {
            GoalController.getGoals(getAuth().currentUser!.uid, setGoals);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            let initialItems: any = [];
            goals.forEach(goal => {
                initialItems.push({ label: goal.name, value: goal.id });
            });

            setGoalOptions(initialItems);
        }, [goals])
    );

    let hourPickerItems: JSX.Element[] = [];
    for (let i = 1; i <= 12; i++) {
        hourPickerItems.push(<Picker.Item key={"hour_" + i} color={colors.text} label={"" + i} value={i} />);
    }

    let minutePickerItems: JSX.Element[] = [];
    for (let i = 0; i < 60; i += 5) {
        minutePickerItems.push(<Picker.Item key={"minute_" + i} color={colors.text} label={(i < 10 ? "0" : "") + i} value={i} />);
    }

    let durationHoursPickerItems: JSX.Element[] = [];
    for (let i = 0; i <= 23; i++) {
        durationHoursPickerItems.push(<Picker.Item key={"durationhour_" + i} color={colors.text} label={"" + i} value={i} />);
    }

    let durationMinutesPickerItems: JSX.Element[] = [];
    for (let i = 0; i < 60; i += 5) {
        durationMinutesPickerItems.push(<Picker.Item key={"durationminute_" + i} color={colors.text} label={"" + i} value={i} />);
    }

    const createTask = () => {
        const task = createTaskModel(name, details, selectedGoal);
        TaskController.createTask(task, () => { navigation.goBack() });
    };

    return (
        <Screen>
            <Banner name={"Create Task"} leftIcon={"arrow-back"} leftRoute={"BACK"} />
            <ScrollView scrollEnabled={false} contentContainerStyle={{ flexGrow: 1 }} >

                <KeyboardAvoidingView style={{ height: "100%" }} keyboardVerticalOffset={isIosApp() ? -10 : 111} behavior={isIosApp() ? 'padding' : 'height'}>

                    <View style={{ paddingTop: 5 }}>
                        <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.text, fontFamily: "Poppins_600SemiBold", fontSize: 17, paddingTop: 10, paddingLeft: 15 }}>Achieve your goals!</Text>
                        <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.secondary_text, fontFamily: "Poppins_400Regular", paddingTop: 10, fontSize: 12, paddingLeft: 15, paddingRight: 15 }}>A task should help you make progess towards achieving your goals.</Text>
                    </View>

                    {/* Name */}
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
                    </View>

                    {/* Description */}
                    <View style={{ paddingTop: 10, alignItems: "center" }}>
                        <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.text, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Details</Text>
                        <TextInput
                            textAlignVertical='top'
                            style={{ width: "95%", fontFamily: "Poppins_400Regular", height: 200, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, color: colors.text, paddingTop: 10, paddingLeft: 10, paddingRight: 10 }}
                            multiline={true}
                            placeholder={"What are the details of this task?"}
                            placeholderTextColor={colors.secondary_text}
                            onChangeText={setDetails}
                            //onChange={() => { setStoryError(false) }}
                            value={details}
                            autoCorrect={true}
                        />
                    </View>

                    <View style={{ paddingTop: 10, alignItems: "center" }}>
                        <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.text, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Goal</Text>
                        <View style={{ width: "95%", borderRadius: 12, borderColor: colors.text_input_border, borderWidth: 1 }}>
                            <DropDownPicker
                                dropDownContainerStyle={{ borderWidth: 0, backgroundColor: colors.text_input_background }}
                                style={{ borderWidth: 0, backgroundColor: colors.text_input_background }}
                                textStyle={{fontFamily: "Poppins_400Regular", color: colors.goal_primary_font, fontSize: 15}}
                                open={menuOpen}
                                value={selectedGoal}
                                items={goalOptions}
                                setOpen={setMenuOption}
                                setValue={setSelectedGoal}
                                setItems={setGoalOptions}

                                multiple={false}
                                mode="BADGE"
                                badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'stretch', margin: 5, zIndex: -1, paddingBottom: 15 }}>
                        <EmbtrButton buttonText={'create'} callback={createTask} />
                    </View>

                </KeyboardAvoidingView>
            </ScrollView>

        </Screen>
    );
};