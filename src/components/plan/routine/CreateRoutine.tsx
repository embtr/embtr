import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { View, Text } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const CreateRoutine = () => {
    const { colors } = useTheme();

    const [frequency, setFrequency] = React.useState("daily");

    const [dailyHour, setDailyHour] = React.useState("");
    const [dailyMinute, setDailyMinute] = React.useState("");
    const [dailyAMPM, setDailyAMPM] = React.useState("");

    const [dailyDurationHours, setDailyDurationHours] = React.useState("0");
    const [dailyDurationMinutes, setDailyDurationMinutes] = React.useState("15");

    let dailyHourPickerItems: JSX.Element[] = [];
    for (let i = 1; i <= 12; i++) {
        dailyHourPickerItems.push(<Picker.Item color={colors.text} label={"" + i} value={i} />);
    }

    let dailyMinutePickerItems: JSX.Element[] = [];
    for (let i = 1; i <= 60; i++) {
        dailyMinutePickerItems.push(<Picker.Item color={colors.text} label={"" + i} value={i} />);
    }

    let dailyDurationHoursPickerItems: JSX.Element[] = [];
    for (let i = 0; i <= 23; i++) {
        dailyDurationHoursPickerItems.push(<Picker.Item color={colors.text} label={"" + i} value={i} />);
    }

    let dailyDurationMinutesPickerItems: JSX.Element[] = [
        <Picker.Item color={colors.text} label={"0"} value={0} />,
        <Picker.Item color={colors.text} label={"15"} value={15} />,
        <Picker.Item color={colors.text} label={"30"} value={30} />,
        <Picker.Item color={colors.text} label={"45"} value={45} />
    ];

    return (
        <Screen>
            <Banner name={"Create Routine"} leftIcon={"arrow-back"} leftRoute={"BACK"} />
            <View>
                <View>
                    <Text style={{ color: colors.text }}>Add a new routine to your life.</Text>
                </View>

                { /*************/}
                { /* FREQUENCY */}
                { /*************/}
                <View style={{ paddingTop: 20, flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                    <Text style={{ color: colors.text, fontSize: 20, textAlign: "right" }}>I will run this routine</Text>
                    <View style={{ alignItems: "flex-start" }}>
                        <Picker
                            itemStyle={{ height: 120 }}
                            style={{ width: 100, color: colors.text }}

                            selectedValue={frequency}
                            onValueChange={(itemValue) => setFrequency(itemValue)}>
                            <Picker.Item color={colors.text} label="Daily" value="daily" />
                            <Picker.Item color={colors.text} label="Weekly" value="Weekly" />
                            <Picker.Item color={colors.text} label="Monthly" value="monthly" />
                            <Picker.Item color={colors.text} label="Yearly" value="yearly" />
                        </Picker>
                    </View>
                </View>

                {frequency === "yearly" &&
                    <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                        <Text style={{ color: colors.text, fontSize: 20, flex: 1, textAlign: "right" }}>On Day</Text>
                        <View style={{ flex: 1, alignItems: "flex-start" }}>
                            <Picker
                                style={{ width: 100, color: colors.text }}

                                selectedValue={frequency}
                                onValueChange={(itemValue) => setFrequency(itemValue)}>
                                <Picker.Item color={colors.text} label="Daily" value="daily" />
                                <Picker.Item color={colors.text} label="Weekly" value="Weekly" />
                                <Picker.Item color={colors.text} label="Monthly" value="monthly" />
                                <Picker.Item color={colors.text} label="Yearly" value="yearly" />
                            </Picker>
                        </View>
                    </View>
                }

                {frequency === "monthly" &&
                    <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                        <Text style={{ color: colors.text, fontSize: 20, flex: 1, textAlign: "right" }}>I will run this routine</Text>
                        <View style={{ flex: 1, alignItems: "flex-start" }}>
                            <Picker
                                style={{ width: 100, color: colors.text }}

                                selectedValue={frequency}
                                onValueChange={(itemValue) => setFrequency(itemValue)}>
                                <Picker.Item color={colors.text} label="Daily" value="daily" />
                                <Picker.Item color={colors.text} label="Weekly" value="Weekly" />
                                <Picker.Item color={colors.text} label="Monthly" value="monthly" />
                                <Picker.Item color={colors.text} label="Yearly" value="yearly" />
                            </Picker>
                        </View>
                    </View>
                }

                {frequency === "weekly" &&
                    <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                        <Text style={{ color: colors.text, fontSize: 20, flex: 1, textAlign: "right" }}>I will run this routine</Text>
                        <View style={{ flex: 1, alignItems: "flex-start" }}>
                            <Picker
                                style={{ width: 100, color: colors.text }}

                                selectedValue={frequency}
                                onValueChange={(itemValue) => setFrequency(itemValue)}>
                                <Picker.Item color={colors.text} label="Daily" value="daily" />
                                <Picker.Item color={colors.text} label="Weekly" value="Weekly" />
                                <Picker.Item color={colors.text} label="Monthly" value="monthly" />
                                <Picker.Item color={colors.text} label="Yearly" value="yearly" />
                            </Picker>
                        </View>
                    </View>
                }

                { /*************/}
                { /*   DAILY   */}
                { /*************/}

                {frequency === "daily" &&
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                            <Text style={{ color: colors.text, fontSize: 20 }}>with a start time of</Text>
                            <View style={{ flexDirection: "row" }} >
                                <View style={{ width: 45 }}>
                                    <Picker
                                        itemStyle={{ height: 120 }}
                                        style={{ width: 60, color: colors.text }}
                                        selectedValue={dailyHour}
                                        onValueChange={setDailyHour}>
                                        {dailyHourPickerItems}
                                    </Picker>
                                </View>

                                <View style={{ width: 45 }}>
                                    <Picker
                                        itemStyle={{ height: 120 }}
                                        style={{ width: 60, color: colors.text }}
                                        selectedValue={dailyMinute}
                                        onValueChange={setDailyMinute}>
                                        {dailyMinutePickerItems}
                                    </Picker>
                                </View>

                                <View style={{ width: 45 }}>
                                    <Picker
                                        itemStyle={{ height: 120 }}
                                        style={{ width: 60, color: colors.text }}
                                        selectedValue={dailyAMPM}
                                        onValueChange={setDailyAMPM}>
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
                                        selectedValue={dailyDurationHours}
                                        onValueChange={setDailyDurationHours}>
                                        {dailyDurationHoursPickerItems}
                                    </Picker>
                                </View>
                                <Text style={{ color: colors.text, fontSize: 20 }}>hours and</Text>
                                <View style={{ width: 60 }}>
                                    <Picker
                                        itemStyle={{ height: 120 }}
                                        style={{ width: 60, color: colors.text }}
                                        selectedValue={dailyDurationMinutes}
                                        onValueChange={setDailyDurationMinutes}>
                                        {dailyDurationMinutesPickerItems}
                                    </Picker>
                                </View>
                                <Text style={{ color: colors.text, fontSize: 20 }}>minutes</Text>

                            </View>
                        </View>
                    </View>


                }
            </View>
        </Screen>
    );
};