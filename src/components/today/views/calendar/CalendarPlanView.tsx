import React from 'react';
import { View, Text, LayoutRectangle } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
        <View>
            <View style={{ marginTop: plannedTask.routine.startMinute }} />

            <TouchableOpacity onPress={() => { onCheck() }} onLongPress={() => { alert("display menu") }} style={{
                height: plannedTask.duration ? plannedTask.duration : plannedTask.routine.duration,
                width: parentLayout ? parentLayout.width - 50 : "85%",
                borderRadius: 5,
                backgroundColor: colors.background_light,
                borderColor: plannedTask.complete ? "green" : "red",
                borderWidth: .2,
            }}>
                <View style={{ flexDirection: "row", zIndex: zIndex, position: "absolute" }}>
                    <View style={{ flex: 1, paddingLeft: 5 }}>
                        <Text style={{ color: colors.text }}>{plannedTask.routine.name}</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 5 }}>
                        <Ionicons name={plannedTask.complete === true ? "checkmark-done" : "checkmark"} size={20} color={plannedTask.complete === true ? "green" : colors.secondary_text} onPress={() => { onCheck() }} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};