import React from 'react';
import { View, Text, LayoutRectangle } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { plannedTaskIsComplete, plannedTaskIsFailed, plannedTaskIsIncomplete } from 'src/controller/planning/PlannedDayController';
import { TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu, getOpenMenu, setMenuOptions } from 'src/redux/user/GlobalState';
import { createEmbtrMenuOptions, EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import * as Haptics from 'expo-haptics';
import { CALENDAR_TIME_HEIGHT } from 'src/util/constants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { TaskFailedSymbol } from 'src/components/common/task_symbols/TaskFailedSymbol';
import { TaskCompleteSymbol } from 'src/components/common/task_symbols/TaskCompleteSymbol';
import { TaskInProgressSymbol } from 'src/components/common/task_symbols/TaskInProgressSymbol';
import { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';

interface Props {
    plannedTask: PlannedTaskModel;
    onUpdateTask: Function;
    parentLayout?: LayoutRectangle;
    rowIndex: number;
    totalInRow: number;
}

export const CalendarPlanView = ({ plannedTask, onUpdateTask, rowIndex, totalInRow, parentLayout }: Props) => {
    const { colors } = useTheme();
    const { setScheme, isDark } = useTheme();
    const navigation = useNavigation<StackNavigationProp<TodayTab>>();

    const cardShadow = {
        shadowColor: '#000',
        shadowOffset: { width: 2.5, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    };

    useFocusEffect(
        React.useCallback(() => {
            updateMenuOptions();
        }, [])
    );

    const toggleCompletion = () => {
        toggleComplete();
        closeMenu();
    };

    const toggleFailure = () => {
        toggleFailed();
        closeMenu();
    };

    const deletePlan = () => {
        plannedTask.status = 'DELETED';

        onUpdateTask(plannedTask);
        closeMenu();
    };

    const dispatch = useAppDispatch();

    const toggleComplete = () => {
        if (plannedTaskIsComplete(plannedTask)) {
            plannedTask.status = 'INCOMPLETE';
        } else {
            plannedTask.status = 'COMPLETE';
        }

        onUpdateTask(plannedTask);
    };

    const toggleFailed = () => {
        if (plannedTaskIsFailed(plannedTask)) {
            plannedTask.status = 'INCOMPLETE';
        } else {
            plannedTask.status = 'FAILED';
        }

        onUpdateTask(plannedTask);
    };

    const navigateToEditTask = () => {
        closeMenu();
        if (plannedTask.dayKey && plannedTask.id) {
            navigation.navigate('EditOneTimeTask', { dayKey: plannedTask.dayKey, plannedTaskId: plannedTask.id });
        }
    };

    const updateMenuOptions = () => {
        let menuOptions: EmbtrMenuOption[] = [];
        if (plannedTaskIsComplete(plannedTask)) {
            menuOptions.push({ name: 'Incomplete', onPress: toggleCompletion });
        }

        if (plannedTaskIsFailed(plannedTask)) {
            menuOptions.push({ name: 'Incomplete', onPress: toggleFailure });
        }

        if (plannedTaskIsIncomplete(plannedTask)) {
            menuOptions.push({ name: 'Mark as Complete', onPress: toggleCompletion });
            menuOptions.push({ name: 'Mark as Failed', onPress: toggleFailure });
            menuOptions.push({ name: 'Edit', onPress: navigateToEditTask });
        }

        menuOptions.push({ name: 'Delete', onPress: deletePlan, destructive: true });
        dispatch(setMenuOptions(createEmbtrMenuOptions(menuOptions)));
    };

    const openMenu = useAppSelector(getOpenMenu);
    const closeMenu = useAppSelector(getCloseMenu);

    const onShortPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        updateMenuOptions();
        openMenu();
    };

    const onLongPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        toggleComplete();
    };

    let width = 0;
    if (parentLayout?.width) {
        width = parentLayout.width / totalInRow - 80 / totalInRow - 4;
    }
    let paddingRight = width * rowIndex + 80 + rowIndex * 4;

    return (
        <View style={{ marginLeft: paddingRight, top: plannedTask.startMinute! + CALENDAR_TIME_HEIGHT / 2, position: 'absolute' }}>
            <TouchableOpacity
                onPress={() => {
                    onShortPress();
                }}
                onLongPress={() => {
                    onLongPress();
                }}
                style={[
                    isDark ? {} : cardShadow,
                    {
                        minHeight: 50,
                        height: plannedTask.duration ? plannedTask.duration : plannedTask.duration,
                        width: totalInRow === 1 ? 225 : width,
                        borderRadius: 6,
                        backgroundColor: colors.timeline_card_background,
                        overflow: 'hidden',
                    },
                ]}
            >
                <View style={{ flexDirection: 'row', width: '100%', paddingTop: 5, paddingLeft: 5 }}>
                    <View style={{ flex: 5 }}>
                        <Text style={{ color: colors.text, fontFamily: 'Poppins_600SemiBold', fontSize: 13 }}>{plannedTask.routine.name}</Text>
                        <Text style={{ color: colors.text, fontFamily: 'Poppins_400Regular', fontSize: 9 }}>{plannedTask.routine.description}</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 5 }}>
                        {plannedTaskIsFailed(plannedTask) ? (
                            <TaskFailedSymbol small={true} />
                        ) : plannedTaskIsComplete(plannedTask) ? (
                            <TaskCompleteSymbol small={true} />
                        ) : (
                            <TaskInProgressSymbol small={true} />
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};
