import React, { useEffect } from 'react';
import { View, Text, LayoutRectangle } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getTodayKey, plannedTaskIsComplete, plannedTaskIsIncomplete, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu, getOpenMenu, setMenuOptions } from 'src/redux/user/GlobalState';
import { createEmbtrOptions as createEmbtrMenuOptions, EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import * as Haptics from 'expo-haptics';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { CALENDAR_TIME_HEIGHT } from 'src/util/constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodayTab } from 'src/navigation/RootStackParamList';


interface Props {
    plannedTask: PlannedTaskModel,
    onUpdateTask: Function,
    parentLayout?: LayoutRectangle
}

export const CalendarPlanView = ({ plannedTask, onUpdateTask, parentLayout }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<TodayTab>>();

    const cardShadow = {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    }

    const toggleCompletion = () => {
        toggleComplete();
        closeMenu();
    };

    const deletePlan = () => {
        plannedTask.status = "DELETED";

        onUpdateTask(plannedTask);
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

    const navigateToEditTask = () => {
        closeMenu();
        if (plannedTask.id) {
            navigation.navigate("EditOneTimeTask", { dayKey: getTodayKey(), plannedTaskId: plannedTask.id })
        }
    };

    const updateMenuOptions = () => {
        let menuOptions: EmbtrMenuOption[] = [];
        if (plannedTaskIsComplete(plannedTask)) {
            menuOptions.push({ name: "Incomplete", onPress: toggleCompletion });
        }

        if (plannedTaskIsIncomplete(plannedTask)) {
            menuOptions.push({ name: "Complete", onPress: toggleCompletion });
            menuOptions.push({ name: "Edit", onPress: navigateToEditTask });
        }

        menuOptions.push({ name: "Delete", onPress: deletePlan });
        dispatch(setMenuOptions(createEmbtrMenuOptions(menuOptions)));
    };

    const openMenu = useAppSelector(getOpenMenu);
    const closeMenu = useAppSelector(getCloseMenu);

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_400Regular,
    });

    if (!fontsLoaded) {
        return <View />
    }

    const onShortPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toggleCompletion();
    };

    const onLongPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        updateMenuOptions()
        openMenu()
    };

    return (
        <View style={{ top: (plannedTask.startMinute! + (CALENDAR_TIME_HEIGHT / 2)), position: "absolute" }} >
            <TouchableOpacity
                onPress={() => {
                    onShortPress();
                }}
                onLongPress={() => {
                    onLongPress();
                }}
                style={[cardShadow, {
                    minHeight: 45,
                    height: plannedTask.duration ? plannedTask.duration : plannedTask.duration,
                    width: 225,
                    borderRadius: 6,
                    backgroundColor: colors.timeline_card_background
                }]}>

                <View style={{ flexDirection: "row", width: "100%", paddingTop: 5, paddingLeft: 5 }}>
                    <View style={{ flex: 5 }}>
                        <Text style={{ color: colors.text, fontFamily: "Poppins_600SemiBold", fontSize: 13 }}>{plannedTask.routine.name}</Text>
                        <Text style={{ color: colors.text, fontFamily: "Poppins_400Regular", fontSize: 9 }}>{plannedTask.routine.description}</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 5 }}>
                        <Ionicons name={plannedTaskIsComplete(plannedTask) ? "checkmark-done" : "checkmark"} size={20} color={plannedTaskIsComplete(plannedTask) ? "green" : colors.secondary_text} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};