import React from 'react';
import { View, Text, TextInput, Keyboard, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import { isIosApp } from 'src/util/DeviceUtil';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import { Timestamp } from 'firebase/firestore';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import DropDownPicker from 'react-native-dropdown-picker';
import { PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';
import { getAuth } from 'firebase/auth';

export const CreateGoal = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [goal, setGoal] = React.useState<string>("");
    const [details, setDetails] = React.useState<string>("");
    const [titleError, setTitleError] = React.useState(false);
    const [storyError, setStoryError] = React.useState(false);
    const [deadline, setDeadline] = React.useState<Date>(Timestamp.now().toDate());
    const [calendarVisible, setCalendarVisible] = React.useState<boolean>(false);

    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    const [menuOpen, setMenuOption] = React.useState(false);
    const [selectedPillar, setSelectedPillar] = React.useState('');
    const [pillarOptions, setPillarOptions] = React.useState([{ label: '', value: '' }]);

    useFocusEffect(
        React.useCallback(() => {
            const uid = getAuth().currentUser?.uid;
            if (uid) {
                PillarController.getPillars(uid, setPillars);
            }
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            let initialItems: any = [];
            pillars.forEach(pillar => {
                initialItems.push({ label: pillar.name, value: pillar.id });
            });

            setPillarOptions(initialItems);
        }, [pillars])
    );

    const createGoal = () => {
        const newGoal: GoalModel = {
            name: goal,
            description: details,
            pillarId: selectedPillar,
            added: Timestamp.now(),
            deadline: Timestamp.fromDate(deadline)
        };

        GoalController.createGoal(newGoal, () => {
            navigation.goBack();
        });
    };

    const showCalendar = () => {
        setCalendarVisible(true);
    };

    const hideCalendar = () => {
        setCalendarVisible(false);
    };

    return (
        <Screen>
            <Banner name={"Create Goal"} leftIcon={"arrow-back"} leftRoute={"BACK"} />

            <DateTimePickerModal
                isVisible={calendarVisible}
                mode="date"
                onConfirm={(date) => { setDeadline(date); hideCalendar() }}
                onCancel={hideCalendar}
            />

            <ScrollView scrollEnabled={false} contentContainerStyle={{ flexGrow: 1 }} >
                <View style={{ height: "100%", width: "100%" }}>
                    <KeyboardAvoidingView style={{ height: "100%" }} keyboardVerticalOffset={isIosApp() ? -10 : 111} behavior={isIosApp() ? 'padding' : 'height'}>

                        <View style={{ paddingTop: 5 }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.goal_primary_font, fontFamily: "Poppins_600SemiBold", fontSize: 17, paddingTop: 10, paddingLeft: 15 }}>Bring it on!</Text>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.goal_secondary_font, fontFamily: "Poppins_400Regular", paddingTop: 10, fontSize: 12, paddingLeft: 15, paddingRight: 15 }}>Your goal should be some objective achievable by a certain date with clear pass/ fail criteria. Make it happen!.</Text>
                        </View>

                        {/* Goal/ Title */}
                        <View style={{ paddingTop: 10, alignItems: "center" }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.goal_primary_font, paddingTop: 15, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Goal</Text>
                            <TextInput
                                style={{ padding: 15, fontFamily: "Poppins_400Regular", color: colors.goal_primary_font, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, width: "95%" }}
                                placeholder={"Enter your goal"}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setGoal}
                                onChange={() => { setTitleError(false) }}
                                value={goal}
                                autoCorrect={true}
                            />
                        </View>

                        {/* Description */}
                        <View style={{ paddingTop: 15, alignItems: "center" }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.goal_primary_font, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Details</Text>
                            <TextInput
                                textAlignVertical='top'
                                style={{ width: "95%", fontFamily: "Poppins_400Regular", height: 200, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, color: colors.text, paddingTop: 10, paddingLeft: 10, paddingRight: 10 }}
                                multiline={true}
                                placeholder={"What are the details of this goal?"}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setDetails}
                                onChange={() => { setStoryError(false) }}
                                value={details}
                                autoCorrect={true}
                            />
                        </View>

                        <View style={{ paddingTop: 15, alignItems: "center" }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.text, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Pillar</Text>
                            <View style={{ width: "95%", borderRadius: 12, borderColor: colors.text_input_border, borderWidth: 1 }}>
                                <DropDownPicker
                                    dropDownContainerStyle={{ borderWidth: 0 }}
                                    style={{ borderWidth: 0, backgroundColor: colors.text_input_background }}
                                    open={menuOpen}
                                    value={selectedPillar}
                                    items={pillarOptions}
                                    setOpen={setMenuOption}
                                    setValue={setSelectedPillar}
                                    setItems={setPillarOptions}

                                    multiple={false}
                                    mode="BADGE"
                                    badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                                />
                            </View>
                        </View>

                        <View style={{ zIndex: -1, paddingTop: 15, alignItems: "center" }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.goal_primary_font, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Deadline</Text>

                            <View style={{ height: 50, width: "95%", borderRadius: 12, borderColor: colors.text_input_border, borderWidth: 1, backgroundColor: colors.text_input_background, justifyContent: "center", paddingLeft: 15, flexDirection: "row" }}>
                                <View style={{ flex: 1, justifyContent: "center" }}>
                                    <Text onPress={showCalendar} style={{ fontFamily: "Poppins_400Regular", color: colors.goal_primary_font, fontSize: 16 }} >{format(deadline, 'MMMM dd, yyyy')}</Text>
                                </View>

                                <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 15, justifyContent: "center" }}>
                                    <Ionicons name="calendar-outline" size={24} color={colors.goal_primary_font} onPress={showCalendar} />
                                </View>
                            </View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'stretch', margin: 5, paddingBottom: 15 }}>
                            <View style={{ width: "95%" }}>
                                <EmbtrButton buttonText={'Create'} callback={createGoal} />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </Screen>
    );
};