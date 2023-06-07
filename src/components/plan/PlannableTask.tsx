import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR } from 'src/util/constants';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { createEmbtrMenuOptions, EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import {
    getCloseMenu,
    getFireConfetti,
    getOpenMenu,
    setMenuOptions,
} from 'src/redux/user/GlobalState';
import * as Haptics from 'expo-haptics';
import { TaskInProgressSymbol } from '../common/task_symbols/TaskInProgressSymbol';
import { PlannedTask, PlannedTask as PlannedTaskModel } from 'resources/schema';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import { TaskCompleteSymbol } from '../common/task_symbols/TaskCompleteSymbol';
import { TaskFailedSymbol } from '../common/task_symbols/TaskFailedSymbol';
import { ProgressBar } from './goals/ProgressBar';
import { HabitIcon } from './habit/HabitIcon';
import { UpdatePlannedTaskModal } from 'src/components/plan/UpdatePlannedTaskModal';
import { UnitUtility } from 'src/util/UnitUtility';
import { PlanningService } from 'src/util/planning/PlanningService';

interface Props {
    initialPlannedTask: PlannedTaskModel;
}

export const PlannableTask = ({ initialPlannedTask }: Props) => {
    const { colors } = useTheme();

    const [currentPlannedTask, setCurrentPlannedTask] =
        React.useState<PlannedTaskModel>(initialPlannedTask);
    const [showUpdatePlannedTaskModal, setShowUpdatePlannedTaskModal] =
        React.useState<boolean>(false);

    const dispatch = useAppDispatch();

    const taskIsComplete = false; // TODO
    const taskIsFailed = currentPlannedTask.status === 'FAILED';

    const fireConfetti = useAppSelector(getFireConfetti);

    const updatePlannedTaskCompletedQuantity = async (quantity: number) => {
        const clone = { ...currentPlannedTask };
        clone.completedQuantity = quantity;
        const updatedPlannedTask = await PlannedTaskController.update(clone);

        if (updatedPlannedTask) {
            if (currentPlannedTask.plannedDay) {
                await PlanningService.onTaskUpdated(currentPlannedTask.plannedDay, fireConfetti);
            }

            setCurrentPlannedTask(updatedPlannedTask);
        }
    };

    const updateMenuOptions = () => {
        if (!currentPlannedTask) {
            return;
        }

        let menuOptions: EmbtrMenuOption[] = [];
        if (!taskIsComplete && !taskIsFailed) {
            menuOptions.push({
                name: 'Complete Task',
                onPress: async () => {
                    closeMenu();
                    const updatedPlannedTask = await PlannedTaskController.complete(
                        currentPlannedTask
                    );

                    if (updatedPlannedTask) {
                        setCurrentPlannedTask(updatedPlannedTask);
                    }
                },
            });
        }

        menuOptions.push({
            name: 'Reset task',
            onPress: async () => {
                closeMenu();
                const updatedPlannedTask = await PlannedTaskController.reset(currentPlannedTask);

                if (updatedPlannedTask) {
                    setCurrentPlannedTask(updatedPlannedTask);
                }
            },
        });

        if (!taskIsComplete && !taskIsFailed) {
            menuOptions.push({
                name: 'Mark task as failed',
                onPress: async () => {
                    closeMenu();
                    const updatedPlannedTask = await PlannedTaskController.fail(currentPlannedTask);
                    if (updatedPlannedTask) {
                        setCurrentPlannedTask(updatedPlannedTask);
                    }
                },
            });
        }

        menuOptions.push({
            name: 'Delete',
            onPress: async () => {
                closeMenu();
                const updatedPlannedTask = await PlannedTaskController.delete(currentPlannedTask);
                if (updatedPlannedTask) {
                    setCurrentPlannedTask(updatedPlannedTask);
                }
            },
            destructive: true,
        });
        dispatch(setMenuOptions(createEmbtrMenuOptions(menuOptions)));
    };

    const openMenu = useAppSelector(getOpenMenu);
    const closeMenu = useAppSelector(getCloseMenu);

    const onShortPress = async () => {
        setShowUpdatePlannedTaskModal(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    };

    const onLongPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        updateMenuOptions();
        openMenu();
    };

    const getPercentageComplete = (plannedTask: PlannedTask) => {
        if (plannedTask.quantity) {
            const { completedQuantity, quantity } = plannedTask;
            const result = ((completedQuantity ?? 0) / quantity) * 100;

            return result;
        }

        return plannedTask.status === 'COMPLETE' ? 100 : 0;
    };

    return (
        <View>
            <UpdatePlannedTaskModal
                plannedTask={currentPlannedTask}
                visible={showUpdatePlannedTaskModal}
                confirm={(updatedValue: number) => {
                    updatePlannedTaskCompletedQuantity(updatedValue);
                    setShowUpdatePlannedTaskModal(false);
                }}
                dismiss={() => {
                    setShowUpdatePlannedTaskModal(false);
                }}
            />
            <TouchableOpacity
                onPress={onShortPress}
                onLongPress={onLongPress}
                style={{ width: '100%' }}
            >
                <View
                    style={[
                        {
                            backgroundColor: colors.button_background,
                            borderRadius: 5,
                            width: '100%',
                        },
                        CARD_SHADOW,
                    ]}
                >
                    <View style={{ borderRadius: 5, flexDirection: 'row', overflow: 'hidden' }}>
                        <View
                            style={{
                                width: '2%',
                                backgroundColor:
                                    currentPlannedTask.quantity ===
                                    currentPlannedTask.completedQuantity
                                        ? colors.progress_bar_complete
                                        : currentPlannedTask?.status === 'FAILED'
                                        ? colors.progress_bar_failed
                                        : 'gray',
                            }}
                        />

                        <View style={{ width: '98%' }}>
                            <View style={{ paddingLeft: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
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
                                            {currentPlannedTask?.task?.title}
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
                                        {currentPlannedTask.habit && (
                                            <View
                                                style={{ paddingRight: 10, flexDirection: 'row' }}
                                            >
                                                <HabitIcon
                                                    habit={currentPlannedTask.habit}
                                                    size={17}
                                                    color={colors.tab_selected}
                                                />
                                            </View>
                                        )}
                                        <View>
                                            {currentPlannedTask.quantity ===
                                            currentPlannedTask.completedQuantity ? (
                                                <TaskCompleteSymbol small={true} />
                                            ) : currentPlannedTask?.status === 'FAILED' ? (
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
                                        progress={getPercentageComplete(currentPlannedTask)}
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
                                        {`${currentPlannedTask.completedQuantity} / ${
                                            currentPlannedTask.quantity
                                        } ${
                                            currentPlannedTask.unit
                                                ? UnitUtility.getReadableUnit(
                                                      currentPlannedTask.unit
                                                  )
                                                : ''
                                        }`}
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
        </View>
    );
};
