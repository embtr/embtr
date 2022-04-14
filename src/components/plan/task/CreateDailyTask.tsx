import React from 'react';
import { Picker } from "@react-native-picker/picker";
import { View, Text } from "react-native";
import { EmbtrButton } from "src/components/common/button/EmbtrButton";
import { SelectableDaysOfWeek } from "src/components/plan/task/SelectableDaysOfWeek";
import { useTheme } from "src/components/theme/ThemeProvider";
import TaskController, { createDays, createTaskModel } from 'src/controller/planning/TaskController';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "src/navigation/RootStackParamList";

interface Props {
    name: string
}

export const CreateDailyTask = ({ name }: Props) => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [hour, setHour] = React.useState(1);
    const [minute, setMinute] = React.useState(0);
    const [AMPM, setAMPM] = React.useState("AM");

    const [durationHours, setDurationHours] = React.useState(0);
    const [durationMinutes, setDurationMinutes] = React.useState(0);

    const [selectedDaysOfWeek, setSelectedDaysOfWeek] = React.useState(createDays(false, false, false, false, false, false, false));

    let hourPickerItems: JSX.Element[] = [];
    for (let i = 1; i <= 12; i++) {
        hourPickerItems.push(<Picker.Item color={colors.text} label={"" + i} value={i} />);
    }

    let minutePickerItems: JSX.Element[] = [];
    for (let i = 0; i < 60; i += 5) {
        minutePickerItems.push(<Picker.Item color={colors.text} label={(i < 10 ? "0" : "") + i} value={i} />);
    }

    let durationHoursPickerItems: JSX.Element[] = [];
    for (let i = 0; i <= 23; i++) {
        durationHoursPickerItems.push(<Picker.Item color={colors.text} label={"" + i} value={i} />);
    }

    let durationMinutesPickerItems: JSX.Element[] = [];
    for (let i = 0; i < 60; i += 5) {
        durationMinutesPickerItems.push(<Picker.Item color={colors.text} label={"" + i} value={i} />);
    }

    const createTask = () => {
        const AMPMHour = AMPM == "AM" ? hour : 12 + hour;
        const startMinute = AMPMHour * 60 + minute;
        const duration = durationHours * 60 + durationMinutes;
        const task = createTaskModel(name, startMinute, duration, selectedDaysOfWeek);

        TaskController.createTask(task, () => { navigation.goBack() });
    };

    return (
        <View style={{ flex: 1 }} >

            <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", flex: 2 }}>
                <View>
                    <Text style={{ color: colors.text, textAlign: "center", fontSize: 20 }}>on the following days</Text>
                    <SelectableDaysOfWeek daysOfWeek={selectedDaysOfWeek} onDaysOfWeekUpdated={setSelectedDaysOfWeek} />
                </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center", flex: 2 }}>
                <Text style={{ color: colors.text, fontSize: 20, textAlign: "right", flex: 1 }}>with a start time of</Text>
                <View style={{ flexDirection: "row", flex: 1 }} >
                    <View style={{ flex: 1 }}>
                        <Picker
                            itemStyle={{ height: 120 }}
                            style={{ width: 70, color: colors.text }}
                            selectedValue={hour}
                            onValueChange={setHour}>
                            {hourPickerItems}
                        </Picker>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Picker
                            itemStyle={{ height: 120 }}
                            style={{ width: 70, color: colors.text }}
                            selectedValue={minute}
                            onValueChange={setMinute}>
                            {minutePickerItems}
                        </Picker>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Picker
                            itemStyle={{ height: 120 }}
                            style={{ width: 75, color: colors.text }}
                            selectedValue={AMPM}
                            onValueChange={setAMPM}>
                            <Picker.Item color={colors.text} label="AM" value="AM" />
                            <Picker.Item color={colors.text} label="PM" value="PM" />
                        </Picker>
                    </View>

                    <View style={{ flex: 1 }} />
                </View>
            </View>

            <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", flex: 2 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} >
                    <Text style={{ color: colors.text, fontSize: 20, textAlign: "right" }}>for</Text>
                    <View style={{ width: 60 }}>
                        <Picker
                            itemStyle={{ height: 120 }}
                            style={{ width: 60, color: colors.text }}
                            selectedValue={durationHours}
                            onValueChange={setDurationHours}>
                            {durationHoursPickerItems}
                        </Picker>
                    </View>
                    <Text style={{ color: colors.text, fontSize: 20 }}>{durationHours === 1 ? "hour and" : "hours and"}</Text>
                    <View style={{ width: 60 }}>
                        <Picker
                            itemStyle={{ height: 120 }}
                            style={{ width: 60, color: colors.text }}
                            selectedValue={durationMinutes}
                            onValueChange={setDurationMinutes}>
                            {durationMinutesPickerItems}
                        </Picker>
                    </View>
                    <Text style={{ color: colors.text, fontSize: 20 }}>minutes</Text>
                </View>
            </View>

            <View style={{ flex: 1 }} />

            <View style={{ alignItems: "center", justifyContent: "center", flex: 2 }}>
                <EmbtrButton buttonText={'create'} callback={createTask} />
            </View>

        </View>

    );
};