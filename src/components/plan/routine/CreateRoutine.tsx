import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, TextInput } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CreateDailyRoutine } from 'src/components/plan/routine/CreateDailyRoutine';

export const CreateRoutine = () => {
    const { colors } = useTheme();

    const [name, setName] = React.useState("");

    const [frequency, setFrequency] = React.useState("daily");

    return (
        <Screen>
            <Banner name={"Create Routine"} leftIcon={"arrow-back"} leftRoute={"BACK"} />

            <View style={{ flexDirection: "column", flex: 1 }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <TextInput
                        style={{ textAlign: "center", marginLeft: "10%", marginRight: "10%", paddingLeft: 10, height: 40, borderColor: colors.background_secondary, backgroundColor: colors.background_secondary, borderWidth: 1, borderRadius: 10, color: colors.text, fontSize: 20 }}
                        onChangeText={setName}
                        value={name}
                        placeholderTextColor={colors.secondary_text}
                        placeholder={"Routine Name"}
                    />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center", flex: 1 }}>
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

                <View style={{ flex: 5 }}>
                    {frequency === "daily" && <CreateDailyRoutine name={name} />}
                </View>
            </View>
        </Screen>
    );
};