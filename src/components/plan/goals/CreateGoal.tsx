import React from 'react';
import { View, Text, TextInput, Keyboard, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import { isIosApp } from 'src/util/DeviceUtil';
import RNDateTimePicker from '@react-native-community/datetimepicker';

export const CreateGoal = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [goal, setGoal] = React.useState<string>("");
    const [details, setDetails] = React.useState<string>("");
    const [titleError, setTitleError] = React.useState(false);
    const [storyError, setStoryError] = React.useState(false);
    const [deadline, setDeadline] = React.useState<Date>(new Date());

    const { setScheme, isDark } = useTheme();

    const createTask = (task: TaskModel) => {
        TaskController.createTask(task, () => { navigation.goBack() });
    };

    const onDeadlineChange = (event: any, date: Date | undefined) => {
        if (date) {
            setDeadline(date);
        }
    };

    return (
        <Screen>
            <Banner name={"Create Goal"} leftIcon={"arrow-back"} leftRoute={"BACK"} />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{}}>
                <View style={{ height: "100%", width: "100%" }}>
                    <KeyboardAvoidingView style={{ height: "100%" }} keyboardVerticalOffset={isIosApp() ? -10 : 111} behavior={isIosApp() ? 'padding' : 'height'}>

                        <View style={{ paddingTop: 5 }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.text, fontFamily: "Poppins_600SemiBold", fontSize: 17, paddingTop: 10, paddingLeft: 15 }}>Bring it on!</Text>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.secondary_text, fontFamily: "Poppins_400Regular", paddingTop: 10, fontSize: 12, paddingLeft: 15, paddingRight: 15 }}>Your goal should be some objective achievable by a certain date with clear pass/ fail criteria. Make it happen!.</Text>
                        </View>

                        <View style={{ paddingTop: 10, alignItems: "center" }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.text, paddingTop: 15, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Goal</Text>
                            <TextInput
                                style={{ padding: 15, fontFamily: "Poppins_400Regular", color: colors.text, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, width: "95%" }}
                                placeholder={"Enter your goal"}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setGoal}
                                onChange={() => { setTitleError(false) }}
                                value={goal}
                            />
                        </View>

                        <View style={{ paddingTop: 10, alignItems: "center" }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.text, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Details</Text>
                            <TextInput
                                textAlignVertical='top'
                                style={{ width: "95%", fontFamily: "Poppins_400Regular", height: 200, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, color: colors.text, paddingTop: 10, paddingLeft: 10, paddingRight: 10 }}
                                multiline={true}
                                placeholder={"What are the details of this goal?"}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setDetails}
                                onChange={() => { setStoryError(false) }}
                                value={details}
                            />
                        </View>

                        <View style={{ paddingTop: 10, alignItems: "center" }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.text, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Deadline</Text>

                            <View style={{ height: 150, width: "95%", borderRadius: 12, borderColor: colors.text_input_border, borderWidth: 1, backgroundColor: colors.text_input_background }}>
                                <RNDateTimePicker onChange={onDeadlineChange} value={deadline} display={"spinner"} themeVariant={isDark ? "dark" : "light"} style={{ height: 150 }} />
                            </View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'stretch', margin: 5, paddingBottom: 15 }}>
                            <View style={{ width: "95%" }}>
                                <EmbtrButton buttonText={'Create'} callback={() => { }} />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </Screen>
    );
};