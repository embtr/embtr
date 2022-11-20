import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { durationToString, startMinuteToString, TaskModel } from 'src/controller/planning/TaskController';
import { plannedTaskIsComplete, plannedTaskIsFailed, plannedTaskIsIncomplete } from 'src/controller/planning/PlannedDayController';
import { CARD_SHADOW } from 'src/util/constants';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PillarModel } from 'src/model/PillarModel';
import { GoalModel } from 'src/controller/planning/GoalController';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { createEmbtrMenuOptions, EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import { getCloseMenu, getOpenMenu, setMenuOptions } from 'src/redux/user/GlobalState';
import * as Haptics from 'expo-haptics';
import { TaskCompleteSymbol } from '../common/task_symbols/TaskCompleteSymbol';
import { TaskFailedSymbol } from '../common/task_symbols/TaskFailedSymbol';
import { TaskInProgressSymbol } from '../common/task_symbols/TaskInProgressSymbol';
import { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { SchedulePlannableTaskModal } from './SchedulePlannableTaskModal';
import React from 'react';

interface Props {
    plannedTask?: PlannedTaskModel;
    task?: TaskModel;
    onUpdateTask?: Function;
    isEnabled: boolean;
    goal: GoalModel;
    pillar: PillarModel;
}

export const PlannableTask = ({ plannedTask, task, onUpdateTask, isEnabled, goal, pillar }: Props) => {
    const [editPlannedTaskIsVisible, setEditPlannedTaskIsVisible] = React.useState<boolean>(false);

    const { colors } = useTheme();

    const toggleCompletion = () => {
        toggleComplete();
        closeMenu();
    };

    const toggleFailure = () => {
        toggleFailed();
        closeMenu();
    };

    const deletePlan = () => {
        if (!plannedTask || !onUpdateTask) {
            return;
        }

        plannedTask.status = 'DELETED';

        onUpdateTask(plannedTask);
        closeMenu();
    };

    const dispatch = useAppDispatch();

    const toggleComplete = () => {
        if (!plannedTask || !onUpdateTask) {
            return;
        }

        if (plannedTaskIsComplete(plannedTask)) {
            plannedTask.status = 'INCOMPLETE';
        } else {
            plannedTask.status = 'COMPLETE';
        }

        onUpdateTask(plannedTask);
    };

    const toggleFailed = () => {
        if (!plannedTask || !onUpdateTask) {
            return;
        }

        if (plannedTaskIsFailed(plannedTask)) {
            plannedTask.status = 'INCOMPLETE';
        } else {
            plannedTask.status = 'FAILED';
        }

        onUpdateTask(plannedTask);
    };

    const updateMenuOptions = () => {
        if (!plannedTask || !onUpdateTask) {
            return;
        }

        let menuOptions: EmbtrMenuOption[] = [];
        if (plannedTaskIsComplete(plannedTask)) {
            menuOptions.push({ name: 'Mark as Incomplete', onPress: toggleCompletion });
            menuOptions.push({ name: 'Mark as Failed', onPress: toggleFailure });
            menuOptions.push({
                name: 'Schedule',
                onPress: () => {
                    closeMenu();
                    setEditPlannedTaskIsVisible(true);
                },
            });
        }

        if (plannedTaskIsFailed(plannedTask)) {
            menuOptions.push({ name: 'Mark as Incomplete', onPress: toggleFailure });
            menuOptions.push({ name: 'Mark as Complete', onPress: toggleCompletion });
            menuOptions.push({
                name: 'Schedule',
                onPress: () => {
                    closeMenu();
                    setEditPlannedTaskIsVisible(true);
                },
            });
        }

        if (plannedTaskIsIncomplete(plannedTask)) {
            menuOptions.push({ name: 'Mark as Complete', onPress: toggleCompletion });
            menuOptions.push({ name: 'Mark as Failed', onPress: toggleFailure });
            menuOptions.push({
                name: 'Schedule',
                onPress: () => {
                    closeMenu();
                    setEditPlannedTaskIsVisible(true);
                },
            });
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
        setEditPlannedTaskIsVisible(true);
    };

    let durationString = '';
    if (plannedTask?.duration && plannedTask.duration > 59) {
        durationString += Math.floor(plannedTask.duration / 60) + 'h ';
    }

    if (plannedTask?.duration) {
        durationString += (plannedTask.duration % 60) + 'm';
    }

    return (
        <View style={{ width: '97%' }}>
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

            <TouchableOpacity onPress={onShortPress} onLongPress={onLongPress}>
                <View style={[{ backgroundColor: isEnabled ? colors.button_background : colors.tomorrow_unselected, borderRadius: 15 }, CARD_SHADOW]}>
                    <View style={{ borderRadius: 15, flexDirection: 'row', overflow: 'hidden' }}>
                        <View
                            style={{
                                width: '2%',
                                height: '100%',
                                backgroundColor:
                                    plannedTask?.status === 'COMPLETE'
                                        ? colors.progress_bar_complete
                                        : plannedTask?.status === 'FAILED'
                                        ? colors.progress_bar_failed
                                        : 'gray',
                            }}
                        />

                        <View style={{ width: '98%', paddingTop: 5, paddingBottom: 5 }}>
                            <View style={{ paddingLeft: 10 }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text
                                            style={{
                                                color: colors.goal_primary_font,
                                                fontFamily: 'Poppins_600SemiBold',
                                                fontSize: 14,
                                            }}
                                        >
                                            {plannedTask?.routine?.name ? plannedTask.routine.name : task?.name ? task.name : ''}
                                        </Text>
                                        <Text
                                            style={{
                                                color: colors.tab_selected,
                                                fontFamily: 'Poppins_400Regular',
                                                fontSize: 9,
                                                paddingStart: 5,
                                            }}
                                        >
                                            {plannedTask?.routine.id ? 'habit' : ''}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            paddingRight: 10,
                                        }}
                                    >
                                        <View>
                                            {plannedTask?.status === 'COMPLETE' ? (
                                                <TaskCompleteSymbol small={true} />
                                            ) : plannedTask?.status === 'FAILED' ? (
                                                <TaskFailedSymbol small={true} />
                                            ) : (
                                                <TaskInProgressSymbol small={true} />
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{ paddingTop: 8, marginLeft: 10, marginRight: 10 }}>
                                <HorizontalLine />
                            </View>

                            <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 2 }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <Ionicons name={'time'} size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        {startMinuteToString(plannedTask?.startMinute ? plannedTask.startMinute : 0)}
                                    </Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <MaterialCommunityIcons name="timer" size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        {durationString}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <Ionicons name={'stats-chart-outline'} size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        {goal.name}
                                    </Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <MaterialCommunityIcons name="pillar" size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        {pillar.name}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};
