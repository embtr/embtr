import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { startMinuteToString, TaskModel } from 'src/controller/planning/TaskController';
import { plannedTaskIsComplete, plannedTaskIsFailed, plannedTaskIsIncomplete, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { CARD_SHADOW } from 'src/util/constants';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PillarModel } from 'src/model/PillarModel';
import { GoalModel } from 'src/controller/planning/GoalController';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { createEmbtrMenuOptions, EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import { getCloseMenu, getOpenMenu, setMenuOptions } from 'src/redux/user/GlobalState';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { TaskCompleteSymbol } from '../common/task_symbols/TaskCompleteSymbol';
import { TaskFailedSymbol } from '../common/task_symbols/TaskFailedSymbol';
import { TaskInProgressSymbol } from '../common/task_symbols/TaskInProgressSymbol';

interface Props {
    plannedTask?: PlannedTaskModel;
    task?: TaskModel;
    locked: boolean;
    onUpdateTask?: Function;
    isEnabled: boolean;
    goal: GoalModel;
    pillar: PillarModel;
}

export const PlannableTask = ({ plannedTask, task, locked, onUpdateTask, isEnabled, goal, pillar }: Props) => {
    const navigation = useNavigation<StackNavigationProp<TodayTab>>();

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

    const navigateToEditTask = () => {
        closeMenu();

        if (!plannedTask) {
            return;
        }

        if (plannedTask.dayKey && plannedTask.id) {
            navigation.navigate('EditOneTimeTask', { dayKey: plannedTask.dayKey, plannedTaskId: plannedTask.id });
        }
    };

    const updateMenuOptions = () => {
        if (!plannedTask || !onUpdateTask) {
            return;
        }

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

    return (
        <View style={{ width: '97%' }}>
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

                        <View style={{ width: '98%' }}>
                            <View style={{ paddingLeft: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>
                                        {plannedTask?.routine?.name ? plannedTask.routine.name : task?.name ? task.name : ''}
                                    </Text>
                                    <View
                                        style={{
                                            flex: 1,
                                            alignSelf: 'stretch',
                                            alignItems: 'flex-end',
                                            paddingRight: 8,
                                            paddingTop: 4
                                        }}
                                    >
                                        {plannedTask?.status === 'COMPLETE' ? (
                                            <TaskCompleteSymbol small={true} />
                                        ) : plannedTask?.status === 'FAILED' ? (
                                            <TaskFailedSymbol small={true} />
                                        ) : (
                                            <TaskInProgressSymbol small={true} />
                                        )}
                                    </View>
                                </View>
                                <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_400Regular', opacity: 0.75, fontSize: 10, paddingTop: 3 }}>
                                    {plannedTask?.routine?.description ? plannedTask?.routine?.description : task?.description}
                                </Text>
                            </View>

                            <View style={{ paddingTop: 8, marginLeft: 10, marginRight: 10 }}>
                                <HorizontalLine />
                            </View>

                            {locked ? (
                                <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 10, alignItems: 'center' }}>
                                        <Ionicons name={'time-outline'} size={14} color={colors.goal_secondary_font} />
                                        <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 12 }}>
                                            {startMinuteToString(plannedTask?.startMinute!)}
                                        </Text>
                                    </View>

                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 30 }}>
                                        <Ionicons name={'timer-outline'} size={14} color={colors.goal_secondary_font} />
                                        <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 12 }}>
                                            {plannedTask?.duration} minutes
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 10, alignItems: 'center' }}>
                                        <Ionicons name={'stats-chart-outline'} size={14} color={colors.goal_secondary_font} />
                                        <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 12 }}>
                                            {goal.name}
                                        </Text>
                                    </View>

                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 30 }}>
                                        <MaterialCommunityIcons name="pillar" size={14} color={colors.goal_secondary_font} />
                                        <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 12 }}>
                                            {pillar.name}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};
