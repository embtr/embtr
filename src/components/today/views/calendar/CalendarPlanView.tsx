import React from 'react';
import { View, Text, LayoutRectangle } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    plannedTask: PlannedTaskModel,
    onUpdateTask: Function,
    parentLayout?: LayoutRectangle,
    zIndex: number
}

export const CalendarPlanView = ({ plannedTask, onUpdateTask, parentLayout, zIndex }: Props) => {
    const { colors } = useTheme();

    const onCheck = () => {
        plannedTask.complete = plannedTask.complete ? !plannedTask.complete : true;
        onUpdateTask(plannedTask);
    };

    return (
        <View style={{
            flexDirection: "row",
            height: plannedTask.duration ? plannedTask.duration : plannedTask.routine.duration,
            width: parentLayout ? parentLayout.width - 50 : "85%",
            borderRadius: 5,
            backgroundColor: colors.background_light,
            paddingTop: 5,
            marginTop: plannedTask.routine.startMinute,
            borderColor: "red",
            borderWidth: .2,
            zIndex: zIndex,
            position: "absolute",
        }}>
            <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text style={{ color: colors.text }}>{plannedTask.routine.name}</Text>
            </View>

            <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 5 }}>
                <Ionicons name={"checkmark"} size={20} color={plannedTask.complete === true ? "green" : colors.secondary_text} onPress={() => { onCheck() }} />
            </View>
        </View>
    );
};