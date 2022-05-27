import React from 'react';
import { Picker } from "@react-native-picker/picker";
import { View, Text } from "react-native";
import { EmbtrButton } from "src/components/common/button/EmbtrButton";
import { useTheme } from "src/components/theme/ThemeProvider";
import { createTaskModel } from 'src/controller/planning/TaskController';

interface Props {
    name: string,
    onCreateTask: Function
}

export const CreateOneTimeTask = ({ name, onCreateTask }: Props) => {
    const { colors } = useTheme();

    const [hour, setHour] = React.useState(1);
    const [minute, setMinute] = React.useState(0);
    const [AMPM, setAMPM] = React.useState("AM");

    const [durationHours, setDurationHours] = React.useState(0);
    const [durationMinutes, setDurationMinutes] = React.useState(0);

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
        const task = createTaskModel(name);

        onCreateTask(task);
    };

    return (
        <View style={{ flex: 1 }} >
            <View style={{ flex: 6 }} />

            <View style={{ alignItems: "center", justifyContent: "center", flex: 2 }}>
                <EmbtrButton buttonText={'create'} callback={createTask} />
            </View>

        </View>

    );
};