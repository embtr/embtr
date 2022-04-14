import React from "react";
import { View, Text, ColorValue } from "react-native";
import { HorizontalLine } from "src/components/common/HorizontalLine";
import { Plan } from "src/components/plan/Plan";
import { useTheme } from "src/components/theme/ThemeProvider";
import { TaskModel } from "src/controller/planning/TaskController";
import { Ionicons } from '@expo/vector-icons';

interface Props {
    task: TaskModel,
    isChecked: boolean,
    onCheckboxToggled: Function
}

export const PlanningTask = ({ task, isChecked, onCheckboxToggled }: Props) => {
    const { colors } = useTheme();

    const backgroundColor: ColorValue = isChecked ? colors.card_background : "#302B2A";

    return (
        <View>
            <Plan task={task} backgroundColor={backgroundColor} />

            <HorizontalLine />

            <View style={{ backgroundColor: backgroundColor, flexDirection: "row" }} >
                <View style={{ flex: 1 }} >
                    <View style={{ alignItems: "center", paddingTop: 5, paddingBottom: 5 }}>
                        <Ionicons name={"checkbox"} size={20} color={isChecked ? "green" : colors.text} onPress={() => { onCheckboxToggled(task.id, !isChecked); }} />
                    </View>
                </View>

                <View style={{ flex: 1 }} >
                    <View style={{ alignItems: "center", paddingTop: 5, paddingBottom: 5 }}>
                        <Ionicons name={"pencil"} size={20} color={colors.text} onPress={() => { }} />
                    </View>
                </View>

                <View style={{ flex: 1 }} >
                    <View style={{ alignItems: "center", paddingTop: 5, paddingBottom: 5 }}>
                        <Ionicons name={"trash"} size={20} color={colors.text} onPress={() => { }} />
                    </View>
                </View>
            </View>
        </View>
    );
};