import React, { useEffect } from 'react';
import { View, Text, LayoutRectangle } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { plannedTaskIsComplete, plannedTaskIsIncomplete, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu, getOpenMenu, setMenuOptions } from 'src/redux/user/GlobalState';
import { createEmbtrOptions as createEmbtrMenuOptions, EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import * as Haptics from 'expo-haptics';


interface Props {
    plannedTask: PlannedTaskModel,
    onUpdateTask: Function,
    parentLayout?: LayoutRectangle
}

export const CalendarPlanView = ({ plannedTask, onUpdateTask, parentLayout }: Props) => {
    const { colors } = useTheme();

    const onPress = () => {
        toggleComplete();
        closeMenu();
    };

    const dispatch = useAppDispatch();

    const toggleComplete = () => {
        if (plannedTaskIsComplete(plannedTask)) {
            plannedTask.status = "INCOMPLETE";
        } else {
            plannedTask.status = "COMPLETE";
        }

        onUpdateTask(plannedTask);
    };

    const updateMenuOptions = () => {
        let menuOptions: EmbtrMenuOption[] = [];
        if (plannedTaskIsComplete(plannedTask)) {
            menuOptions.push({ name: "Incomplete", onPress: onPress });
        }

        if (plannedTaskIsIncomplete(plannedTask)) {
            menuOptions.push({ name: "Complete", onPress: onPress });
        }
        dispatch(setMenuOptions(createEmbtrMenuOptions(menuOptions)));
    };

    const openMenu = useAppSelector(getOpenMenu);
    const closeMenu = useAppSelector(getCloseMenu);

    return (
        <View style={{ top: plannedTask.startMinute, position: "absolute" }} >
            <TouchableOpacity
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onPress();
                }}
                onLongPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    updateMenuOptions()
                    openMenu()
                }}
                style={{
                    height: plannedTask.duration ? plannedTask.duration : plannedTask.duration,
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
        </View>
    );
};