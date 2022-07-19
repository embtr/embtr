import { Picker } from '@react-native-picker/picker';
import * as React from 'react';
import { View, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';


interface Props {
    plannedTask: PlannedTaskModel,
    visible: boolean,
    confirm: Function,
    dismiss: Function
}

export const SchedulePlannableTaskModal = ({ plannedTask, visible, confirm, dismiss }: Props) => {
    const { colors } = useTheme();
    const [hour, setHour] = React.useState(plannedTask?.startMinute ? Math.floor(plannedTask.startMinute / 60) : 1);
    const [minute, setMinute] = React.useState(plannedTask?.startMinute ?  Math.floor(plannedTask.startMinute % 60) : 1)
    const [amPm, setAmPm] = React.useState(plannedTask?.startMinute && plannedTask.startMinute > (60 * 12) ? "PM" : "AM");
    const [duration, setDuration] = React.useState(plannedTask?.duration ? plannedTask.duration : 0);

    let hourPickerItems: JSX.Element[] = [];
    for (let i = 1; i <= 12; i++) {
        hourPickerItems.push(<Picker.Item key={"hour_" + i} color={colors.text} label={"" + i} value={i} />);
    }

    let minutePickerItems: JSX.Element[] = [];
    for (let i = 0; i <= 59; i += 15) {
        let val = "" + i;
        if (i < 10) {
            val = "0" + i;
        }
        minutePickerItems.push(<Picker.Item key={"minute_" + val} color={colors.text} label={"" + val} value={i} />);
    }

    let amPmPickerItems: JSX.Element[] = [];
    amPmPickerItems.push(<Picker.Item key={"amPm_am"} color={colors.text} label={"AM"} value={"am"} />);
    amPmPickerItems.push(<Picker.Item key={"amPm_pm"} color={colors.text} label={"PM"} value={"pm"} />);

    let durationPickerItems: JSX.Element[] = [];
    for (let i = 5; i <= 180; i += 5) {
        durationPickerItems.push(<Picker.Item key={"duration_" + i} color={colors.text} label={"" + i} value={i} />);
    }

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_400Regular,
        Poppins_500Medium
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <View>
            <Modal visible={visible} transparent={true} >
                <View style={{ position: "absolute", zIndex: 1, height: "100%", width: "100%", alignItems: "center", justifyContent: "flex-end", backgroundColor: "rgba(000,000,000,.6)" }}>
                    <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                        <View>
                            <View style={{ width: 300, backgroundColor: colors.modal_background, borderRadius: 12, justifyContent: "space-around" }}>
                                <Text style={{ color: colors.text, fontSize: 16, paddingTop: 10, paddingLeft: 10, fontFamily: "Poppins_500Medium" }}>
                                    {plannedTask.routine.name}
                                </Text>

                                <Text style={{ color: colors.text, fontSize: 10, paddingTop: 5, paddingLeft: 10, opacity: .75, fontFamily: "Poppins_400Regular" }}>
                                    {plannedTask.routine.description}
                                </Text>

                                <View style={{ width: "100%", alignItems: "center", paddingTop: 10 }}>
                                    <View style={{ width: "90%" }}>
                                        <HorizontalLine />
                                    </View>
                                </View>

                                <View style={{ alignItems: "center" }}>
                                    <Text style={{ color: colors.text, fontSize: 12, paddingTop: 10, fontFamily: "Poppins_400Regular" }}>
                                        Start Time
                                    </Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <Picker
                                            style={{ width: 85, color: colors.text }}
                                            selectedValue={hour}
                                            onValueChange={setHour}>
                                            {hourPickerItems}
                                        </Picker>
                                        <Picker
                                            style={{ width: 85, color: colors.text }}
                                            selectedValue={minute}
                                            onValueChange={setMinute}>
                                            {minutePickerItems}
                                        </Picker>
                                        <Picker
                                            style={{ width: 95, color: colors.text, borderRadius: 0 }}
                                            selectedValue={amPm}
                                            onValueChange={setAmPm}>
                                            {amPmPickerItems}
                                        </Picker>
                                    </View>
                                </View>

                                <View style={{ alignItems: "center" }}>
                                    <Text style={{ color: colors.text, fontSize: 12, paddingTop: 10, fontFamily: "Poppins_400Regular" }}>
                                        Duration (minutes)
                                    </Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <Picker
                                            style={{ width: 85, color: colors.text }}
                                            selectedValue={duration}
                                            onValueChange={setDuration}>
                                            {durationPickerItems}
                                        </Picker>
                                    </View>
                                </View>

                                <HorizontalLine />


                                <View style={{ backgroundColor: colors.modal_background, borderRadius: 12, paddingTop: 2.5, paddingBottom: 2.5 }}>
                                    <Button title='Confirm' onPress={() => { confirm((hour * 60) + (amPm === "pm" ? 720 : 0) + minute, duration) }} />
                                </View>
                            </View>

                            <View style={{ height: 5 }} />

                            <View style={{ backgroundColor: colors.modal_background, borderRadius: 12, paddingTop: 2.5, paddingBottom: 2.5 }}>
                                <Button title='Cancel' onPress={() => { dismiss() }} />
                            </View>

                        </View>
                        <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                    </View>
                    <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                </View>
            </Modal>
        </View>
    )
}