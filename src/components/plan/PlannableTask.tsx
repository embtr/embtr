import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, ColorValue, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TaskModel } from 'src/controller/planning/TaskController';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { Picker } from '@react-native-picker/picker';

interface Props {
    task: TaskModel,
    locked: boolean,
    onPress?: Function,
    onUpdate?: Function,
    backgroundColor?: ColorValue
}

const shadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: .5,
    elevation: 5
}

export const PlannableTask = ({ task, locked, onPress, onUpdate, backgroundColor }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [hour, setHour] = React.useState(1);
    const [minute, setMinute] = React.useState(0);
    const [AMPM, setAMPM] = React.useState("AM");
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
    for (let i = 15; i <= 180; i += 15) {
        durationMinutesPickerItems.push(<Picker.Item key={"durationminute_" + i} color={colors.text} label={"" + i} value={i} />);
    }

    let amPmPickerItems: JSX.Element[] = [
        <Picker.Item key={"am"} color={colors.text} label="AM" value="AM" />,
        <Picker.Item key={"pm"} color={colors.text} label="PM" value="PM" />
    ];


    const navigateToDetails = () => {
        navigation.navigate('TaskDetails', { id: task.id! })
    };

    const updateHour = (hour: number) => {
        setHour(hour);
        if (onUpdate) {
            onUpdate(task.id, hour, minute, AMPM, durationMinutes);
        }
    };

    const updateMinute = (minute: number) => {
        setMinute(minute);
        if (onUpdate) {
            onUpdate(task.id, hour, minute, AMPM, durationMinutes);
        }
    };

    const updateAMPM = (amPm: string) => {
        setAMPM(amPm);
        if (onUpdate) {
            onUpdate(task.id, hour, minute, AMPM, durationMinutes);
        }
    };

    const updateDuration = (duratiomn: number) => {
        setDurationMinutes(duratiomn);
        if (onUpdate) {
            onUpdate(task.id, hour, minute, AMPM, durationMinutes);
        }
    };

    return (
        <View key={task.id} >
            <View style={[{ height: 90, backgroundColor: backgroundColor || colors.card_background_active, borderRadius: 7.5, justifyContent: "center" }, shadow]}>
                <View style={{ flexDirection: "row", height: "auto", alignItems: "center", paddingTop: 5 }}>

                    {locked ?
                        <View style={{ paddingLeft: 10, flex: 3, height: "100%", justifyContent: "center" }}>
                            <Text style={{ color: colors.text, fontSize: 16 }}>
                                {task.name}
                            </Text>
                        </View>
                        :
                        <TouchableOpacity style={{ paddingLeft: 10, flex: 3, height: "100%", justifyContent: "center" }} onPress={() => { onPress ? onPress() : navigateToDetails() }}>
                            <View>
                                <Text style={{ color: colors.text, fontSize: 16 }}>
                                    {task.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    }


                    <View style={{ flex: 3.5, flexDirection: "column", alignContent: "center", alignItems: "center" }}>
                        <View>
                            <Text style={{ color: colors.secondary_text, fontSize: 10 }}>Start Time</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                            <View style={{ flex: 1, alignContent: "center", alignItems: "center" }}>
                                <View>
                                    <Picker
                                        itemStyle={{ height: 80 }}
                                        style={{ width: 75, color: colors.text }}
                                        selectedValue={hour}
                                        onValueChange={updateHour}>
                                        {locked ? <Picker.Item key={"hour_" + hour} color={colors.text} label={"" + hour} value={hour} /> : hourPickerItems}
                                    </Picker>
                                </View>
                            </View>

                            <View style={{ flex: 1, alignContent: "center", alignItems: "center" }}>
                                <View>
                                    <Picker
                                        itemStyle={{ height: 80 }}
                                        style={{ width: 75, color: colors.text }}
                                        selectedValue={minute}
                                        onValueChange={updateMinute}>
                                        {locked ? <Picker.Item key={"minute" + minute} color={colors.text} label={"" + minute} value={minute} /> : minutePickerItems}
                                    </Picker>
                                </View>
                            </View>

                            <View style={{ flex: 1, alignContent: "center", alignItems: "center" }}>
                                <View>
                                    <Picker
                                        itemStyle={{ height: 80 }}
                                        style={{ width: 75, color: colors.text }}
                                        selectedValue={AMPM}
                                        onValueChange={updateAMPM}>
                                        {locked ? <Picker.Item key={"ampm_" + AMPM} color={colors.text} label={"" + AMPM} value={AMPM} /> : amPmPickerItems}
                                    </Picker>
                                </View>
                            </View>
                        </View>
                    </View>

                    {locked ?
                        <View style={{ flex: .5, height: "100%" }} />
                        :
                        <TouchableOpacity style={{ flex: .5, height: "100%" }} onPress={() => { onPress ? onPress() : navigateToDetails() }} />
                    }


                    <View style={{ flex: 1, flexDirection: "column", alignContent: "center", alignItems: "center" }}>
                        <View>
                            <Text style={{ color: colors.secondary_text, fontSize: 10 }}>Minutes</Text>
                        </View>
                        <Picker
                            itemStyle={{ height: 80 }}
                            style={{ width: 75, color: colors.text }}
                            selectedValue={durationMinutes}
                            onValueChange={updateDuration}>
                            {locked ? <Picker.Item key={"duration_" + durationMinutes} color={colors.text} label={"" + durationMinutes} value={durationMinutes} /> : durationMinutesPickerItems}
                        </Picker>
                    </View>

                    {locked ?
                        <View style={{ flex: .5, height: "100%" }} />
                        :
                        <TouchableOpacity style={{ flex: .5, height: "100%" }} onPress={() => { onPress ? onPress() : navigateToDetails() }} />
                    }
                </View>
            </View>
        </View>
    );
};