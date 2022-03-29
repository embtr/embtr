import React from "react";
import { View, Text, ColorValue } from "react-native";
import { HorizontalLine } from "src/components/common/HorizontalLine";
import { Plan } from "src/components/plan/Plan";
import { useTheme } from "src/components/theme/ThemeProvider";
import { RoutineModel } from "src/controller/planning/RoutineController";
import { Ionicons } from '@expo/vector-icons';

interface Props {
    routine: RoutineModel,
    isChecked: boolean,
    onCheckboxToggled: Function
}

export const PlanningTask = ({ routine, isChecked, onCheckboxToggled }: Props) => {
    const { colors } = useTheme();

    const backgroundColor: ColorValue = isChecked ? colors.card_background : "#302B2A";

    return (
        <View>
            <Plan routine={routine} backgroundColor={backgroundColor} />

            <HorizontalLine />

            <View style={{ backgroundColor: backgroundColor, flexDirection: "row" }} >
                <View style={{ flex: 1 }} >
                    <View style={{ alignItems: "center", paddingTop: 5, paddingBottom: 5 }}>
                        <Ionicons name={"checkbox"} size={20} color={isChecked ? "green" : colors.text} onPress={() => { onCheckboxToggled(routine.id, !isChecked); }} />
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