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
import { SchedulePlannableTaskModal } from 'src/components/plan/SchedulePlannableTaskModal';

interface Props {
    plannedTask: PlannedTaskModel;
    onUpdateTask: Function;
    parentLayout?: LayoutRectangle;
    rowIndex: number;
    totalInRow: number;
}

export const CalendarPlanView = ({ plannedTask, onUpdateTask, rowIndex, totalInRow, parentLayout }: Props) => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<TodayTab>>();

    const [editPlannedTaskIsVisible, setEditPlannedTaskIsVisible] = React.useState<boolean>(false);

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
            navigation.navigate('CreateEditHabit', { dayKey: plannedTask.dayKey, plannedTaskId: plannedTask.id });
        }
    };

    const updateMenuOptions = () => {
        let menuOptions: EmbtrMenuOption[] = [];
        if (plannedTaskIsComplete(plannedTask)) {
            menuOptions.push({
                name: 'Mark as Incomplete',
                onPress: () => {
                    closeMenu();
                    toggleComplete();
                },
            });
            menuOptions.push({
                name: 'Mark as Failed',
                onPress: () => {
                    closeMenu();
                    toggleFailure();
                },
            });
        }
        if (plannedTaskIsFailed(plannedTask)) {
            menuOptions.push({
                name: 'Mark as Incomplete',
                onPress: () => {
                    closeMenu();
                    toggleFailure();
                },
            });
            menuOptions.push({
                name: 'Mark as Complete',
                onPress: () => {
                    closeMenu();
                    toggleComplete();
                },
            });
        }
        if (plannedTaskIsIncomplete(plannedTask)) {
            menuOptions.push({
                name: 'Mark as Complete',
                onPress: () => {
                    closeMenu();
                    toggleComplete();
                },
            });
            menuOptions.push({
                name: 'Mark as Failed',
                onPress: () => {
                    closeMenu();
                    toggleFailure();
                },
            });
        }
        menuOptions.push({
            name: 'Schedule',
            onPress: () => {
                closeMenu();
                setEditPlannedTaskIsVisible(true);
            },
        });
        menuOptions.push({
            name: 'Edit',
            onPress: () => {
                if (plannedTask.id && plannedTask.dayKey) {
                    closeMenu();
                    navigation.navigate('CreateEditOneTimeTask', { dayKey: plannedTask.dayKey, id: plannedTask.id });
                }
            },
        });
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
        setEditPlannedTaskIsVisible(true);
    };

    let width = 0;
    if (parentLayout?.width) {
        width = parentLayout.width / totalInRow - 80 / totalInRow - 4;
    }
    let paddingRight = width * rowIndex + 80 + rowIndex * 4;

    return (
        <View style={[cardShadow, { marginLeft: paddingRight, top: plannedTask.startMinute! + CALENDAR_TIME_HEIGHT / 2, position: 'absolute' }]}>
            <SchedulePlannableTaskModal
                plannedTask={plannedTask!}
                visible={editPlannedTaskIsVisible}
                confirm={(startMinute: number, duration: number) => {
                    if (!plannedTask || !onUpdateTask) {
                        return;
                    }

                    plannedTask.startMinute = startMinute;
                    plannedTask.duration = duration;
                    onUpdateTask(plannedTask);
                    setEditPlannedTaskIsVisible(false);
                }}
                dismiss={() => {
                    setEditPlannedTaskIsVisible(false);
                }}
            />

            <TouchableOpacity
                onPress={() => {
                    onShortPress();
                }}
                onLongPress={() => {
                    onLongPress();
                }}
                style={{
                    minHeight: 25,
                    height: plannedTask.duration ? plannedTask.duration : plannedTask.duration,
                    width: totalInRow === 1 ? 225 : width,
                    borderRadius: 6,
                    backgroundColor: colors.timeline_card_background,
                    overflow: 'hidden',
                }}
            >
                <View style={{ flexDirection: 'row', width: '100%', paddingTop: 5, paddingLeft: 5 }}>
                    <View style={{ flex: 5 }}>
                        <Text style={{ color: colors.text, fontFamily: 'Poppins_600SemiBold', fontSize: 13 }}>{plannedTask.routine.name}</Text>
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
