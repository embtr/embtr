import React from 'react';
import { Picker } from "@react-native-picker/picker";
import { View, Text } from "react-native";
import { EmbtrButton } from "src/components/common/button/EmbtrButton";
import { SelectableDaysOfWeek } from "src/components/plan/routine/SelectableDaysOfWeek";
import { useTheme } from "src/components/theme/ThemeProvider";
import RoutineController, { createDays, createRoutineModel } from 'src/controller/planning/RoutineController';

interface Props {
    name: string
}

export const CreateDailyRoutine = ({ name }: Props) => {
    const { colors } = useTheme();

    const [hour, setHour] = React.useState(1);
    const [minute, setMinute] = React.useState(0);
    const [AMPM, setAMPM] = React.useState("");

    const [durationHours, setDurationHours] = React.useState(0);
    const [durationMinutes, setDurationMinutes] = React.useState(0);

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

    const createRoutine = () => {
        const startMinute = hour * 60 + minute;
        alert(startMinute);
        const duration = durationHours * 60 + durationMinutes;
        const days = createDays(true, true, true, true, true, true, true);
        const routineModel = createRoutineModel(name, startMinute, duration, days);

        RoutineController.createRoutine(routineModel, () => { });
    };

    return (
        <View>
            <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center", paddingBottom: 10 }}>
                <View>
                    <Text style={{ color: colors.text, textAlign: "center", fontSize: 20, paddingTop: 25, paddingBottom: 25 }}>on the following days</Text>
                    <SelectableDaysOfWeek />
                </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                <Text style={{ color: colors.text, fontSize: 20 }}>with a start time of</Text>
                <View style={{ flexDirection: "row" }} >
                    <View style={{ width: 45 }}>
                        <Picker
                            itemStyle={{ height: 120 }}
                            style={{ width: 60, color: colors.text }}
                            selectedValue={hour}
                            onValueChange={setHour}>
                            {hourPickerItems}
                        </Picker>
                    </View>

                    <View style={{ width: 45 }}>
                        <Picker
                            itemStyle={{ height: 120 }}
                            style={{ width: 60, color: colors.text }}
                            selectedValue={minute}
                            onValueChange={setMinute}>
                            {minutePickerItems}
                        </Picker>
                    </View>

                    <View style={{ width: 45 }}>
                        <Picker
                            itemStyle={{ height: 120 }}
                            style={{ width: 60, color: colors.text }}
                            selectedValue={AMPM}
                            onValueChange={setAMPM}>
                            <Picker.Item color={colors.text} label="AM" value="am" />
                            <Picker.Item color={colors.text} label="PM" value="pm" />
                        </Picker>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }} >
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

            <View style={{ paddingTop: 70, alignItems: "center" }}>
                <EmbtrButton buttonText={'create'} callback={createRoutine} />
            </View>
        </View>

    );
};