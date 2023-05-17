import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, IoniconName, POPPINS_REGULAR } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { createEmbtrMenuOptions, EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import { getCloseMenu, getOpenMenu, setMenuOptions } from 'src/redux/user/GlobalState';
import * as Haptics from 'expo-haptics';
import { TaskInProgressSymbol } from '../common/task_symbols/TaskInProgressSymbol';
import { PlannedTask as PlannedTaskModel } from 'resources/schema';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import { TaskCompleteSymbol } from '../common/task_symbols/TaskCompleteSymbol';
import { TaskFailedSymbol } from '../common/task_symbols/TaskFailedSymbol';
import { ProgressBar } from './goals/ProgressBar';

interface Props {
    plannedTask: PlannedTaskModel;
    onUpdateTask: Function;
    isEnabled: boolean;
}

export const PlannableTask = ({ plannedTask, onUpdateTask, isEnabled }: Props) => {
    const { colors } = useTheme();

    const dispatch = useAppDispatch();

    const totalCount = plannedTask?.count ?? 1;
    const completedCount = plannedTask?.completedCount ?? 0;
    const taskIsComplete = completedCount === totalCount;
    const taskIsFailed = plannedTask.status === 'FAILED';

    const updateMenuOptions = () => {
        if (!plannedTask || !onUpdateTask) {
            return;
        }

        let menuOptions: EmbtrMenuOption[] = [];
        if (!taskIsComplete && !taskIsFailed && (plannedTask.count ?? 0) > 1) {
            menuOptions.push({
                name: 'Complete One',
                onPress: async () => {
                    closeMenu();
                    await PlannedTaskController.incrementCompletedCount(plannedTask);
                    onUpdateTask();
                },
            });
        }

        if (!taskIsComplete && !taskIsFailed) {
            menuOptions.push({
                name: 'Complete Task',
                onPress: async () => {
                    alert('PRESSED');
                    closeMenu();
                    await PlannedTaskController.complete(plannedTask);
                    onUpdateTask();
                },
            });
        }

        menuOptions.push({
            name: 'Reset task',
            onPress: async () => {
                closeMenu();
                await PlannedTaskController.reset(plannedTask);
                onUpdateTask();
            },
        });

        if (!taskIsComplete && !taskIsFailed) {
            menuOptions.push({
                name: 'Mark task as failed',
                onPress: async () => {
                    closeMenu();
                    await PlannedTaskController.fail(plannedTask);
                    onUpdateTask();
                },
            });
        }

        menuOptions.push({
            name: 'Delete',
            onPress: async () => {
                closeMenu();
                await PlannedTaskController.delete(plannedTask);
                onUpdateTask();
            },
            destructive: true,
        });
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
    };

    return (
        <TouchableOpacity
            onPress={onShortPress}
            onLongPress={onLongPress}
            style={{ width: '100%' }}
        >
            <View
                style={[
                    {
                        backgroundColor: colors.button_background,
                        borderRadius: 15,
                        width: '100%',
                    },
                    CARD_SHADOW,
                ]}
            >
                <View style={{ borderRadius: 15, flexDirection: 'row', overflow: 'hidden' }}>
                    <View
                        style={{
                            width: '2%',
                            height: '100%',
                            backgroundColor:
                                totalCount === completedCount
                                    ? colors.progress_bar_complete
                                    : plannedTask?.status === 'FAILED'
                                    ? colors.progress_bar_failed
                                    : 'gray',
                        }}
                    />

                    <View style={{ width: '98%', paddingTop: 5, paddingBottom: 5 }}>
                        <View style={{ paddingLeft: 10 }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: colors.goal_primary_font,
                                            fontFamily: 'Poppins_600SemiBold',
                                            fontSize: 14,
                                        }}
                                    >
                                        {plannedTask?.task?.title}
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
                                    {plannedTask.habit && (
                                        <View style={{ paddingRight: 10, flexDirection: 'row' }}>
                                            <Ionicons
                                                name={plannedTask.habit.iconName as IoniconName}
                                                size={17}
                                                color={colors.tab_selected}
                                            />
                                        </View>
                                    )}
                                    <View>
                                        {totalCount === completedCount ? (
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

                        <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 2 }}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingLeft: 10,
                                }}
                            >
                                <ProgressBar
                                    progress={(completedCount / totalCount) * 100}
                                    success={!taskIsFailed}
                                    showPercent={false}
                                />
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingLeft: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.secondary_text,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 10,
                                    }}
                                >
                                    {completedCount}
                                    {'/'}
                                    {totalCount}
                                    {' complete'}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingLeft: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        paddingLeft: 5,
                                        color: colors.goal_secondary_font,
                                        fontFamily: 'Poppins_400Regular',
                                        fontSize: 10,
                                    }}
                                ></Text>
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingLeft: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        paddingLeft: 5,
                                        color: colors.goal_secondary_font,
                                        fontFamily: 'Poppins_400Regular',
                                        fontSize: 10,
                                    }}
                                ></Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
