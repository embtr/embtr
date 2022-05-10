import React from 'react';
import { View, Text, LayoutRectangle } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { plannedTaskIsComplete, plannedTaskIsIncomplete, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { EmbtrMenu } from 'src/components/common/menu/EmbtrMenu';
import { isDesktopBrowser } from 'src/util/DeviceUtil';

interface Props {
    plannedTask: PlannedTaskModel,
    onUpdateTask: Function,
    parentLayout?: LayoutRectangle
}

export const CalendarPlanView = ({ plannedTask, onUpdateTask, parentLayout }: Props) => {
    const { colors } = useTheme();

    const onPress = () => {
        if (isDesktopBrowser()) {
            return;
        }

        toggleComplete();
    };

    const toggleComplete = () => {
        if (plannedTaskIsComplete(plannedTask)) {
            plannedTask.status = "INCOMPLETE";
        } else {
            plannedTask.status = "COMPLETE";
        }

        onUpdateTask(plannedTask);
    };

    let menuItems = [
        { text: 'Actions', isTitle: true },
        { text: plannedTaskIsComplete(plannedTask) ? 'Incomplete' : 'Complete', onPress: toggleComplete },
    ];

    if (plannedTaskIsIncomplete(plannedTask)) {
        menuItems.push(
            { text: 'Complete & Post', onPress: toggleComplete },
            { text: 'Fail', onPress: toggleComplete },
            { text: 'Fail & Post', onPress: toggleComplete },
            { text: 'Edit', onPress: () => { } },
        );
    }

    return (
        <View style={{ top: plannedTask.routine.startMinute, position: "absolute" }} >
            <EmbtrMenu longPress={true} menuItems={menuItems} >
                <TouchableOpacity onPress={() => { onPress() }} style={{
                    height: plannedTask.duration ? plannedTask.duration : plannedTask.routine.duration,
                    width: parentLayout ? parentLayout.width - 50 : "85%",
                    borderRadius: 5,
                    backgroundColor: colors.background_light,
                    borderColor: plannedTaskIsComplete(plannedTask) ? "green" : colors.primary_border,
                    borderWidth: .2,
                }}>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                        <View style={{ flex: 1, paddingLeft: 5 }}>
                            <Text style={{ color: colors.text }}>{plannedTask.routine.name}</Text>
                        </View>

                        <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 5 }}>
                            <Ionicons name={plannedTaskIsComplete(plannedTask) ? "checkmark-done" : "checkmark"} size={20} color={plannedTaskIsComplete(plannedTask) ? "green" : colors.secondary_text} />
                        </View>
                    </View>
                </TouchableOpacity>
            </EmbtrMenu>
        </View>
    );
};