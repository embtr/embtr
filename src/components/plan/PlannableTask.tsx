import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { createEmbtrMenuOptions, EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import {
    getCloseMenu,
    getDisplayDropDownAlert,
    getFireConfetti,
    getOpenMenu,
    setMenuOptions,
} from 'src/redux/user/GlobalState';
import * as Haptics from 'expo-haptics';
import { TaskInProgressSymbol } from '../common/task_symbols/TaskInProgressSymbol';
import { ChallengeReward, PlannedDay, PlannedTask as PlannedTaskModel } from 'resources/schema';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import { TaskCompleteSymbol } from '../common/task_symbols/TaskCompleteSymbol';
import { TaskFailedSymbol } from '../common/task_symbols/TaskFailedSymbol';
import { ProgressBar } from './goals/ProgressBar';
import { UpdatePlannedTaskModal } from 'src/components/plan/UpdatePlannedTaskModal';
import { UnitUtility } from 'src/util/UnitUtility';
import { PlanningService } from 'src/util/planning/PlanningService';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { DropDownAlertModal } from 'src/model/DropDownAlertModel';
import { SvgUri } from 'react-native-svg';

interface Props {
    plannedDay: PlannedDay;
    initialPlannedTask: PlannedTaskModel;
    onPlannedTaskUpdated: Function;
    challengeRewards: ChallengeReward[];
}

export const PlannableTask = ({
    plannedDay,
    initialPlannedTask,
    onPlannedTaskUpdated,
    challengeRewards,
}: Props) => {
    const { colors } = useTheme();

    const [showUpdatePlannedTaskModal, setShowUpdatePlannedTaskModal] =
        React.useState<boolean>(false);
    const [completedQuantity, setCompletedQuantity] = React.useState<number>(
        initialPlannedTask.completedQuantity ?? 0
    );
    const [userId, setUserId] = React.useState<number | undefined>(undefined);
    React.useEffect(() => {
        const fetch = async () => {
            const userId = await getUserIdFromToken();
            setUserId(userId ?? 0);
        };

        fetch();
    }, [initialPlannedTask]);

    React.useEffect(() => {
        setCompletedQuantity(initialPlannedTask.completedQuantity ?? 0);
    }, [initialPlannedTask.completedQuantity]);

    const dispatch = useAppDispatch();

    const taskIsComplete = false;
    const taskIsFailed = initialPlannedTask.status === 'FAILED';

    const fireConfetti = useAppSelector(getFireConfetti);
    const displayDropDownAlert = useAppSelector(getDisplayDropDownAlert);

    const updatePlannedTaskCompletedQuantity = async (
        clone: PlannedTaskModel,
        quantity: number
    ) => {
        clone.completedQuantity = quantity;
        const updatedPlannedTask = clone.id
            ? await PlannedTaskController.update(clone)
            : await PlannedTaskController.create(plannedDay, clone);

        if (updatedPlannedTask?.plannedTask?.plannedDay) {
            onPlannedTaskUpdated(clone);
            await PlanningService.onTaskUpdated(initialPlannedTask.plannedDay!, fireConfetti);
        }

        if (
            updatedPlannedTask?.completedChallenges &&
            updatedPlannedTask.completedChallenges.length > 0
        ) {
            const completedChallenge = updatedPlannedTask.completedChallenges[0];
            let badgeUrl = completedChallenge.challengeRewards?.[0].imageUrl ?? '';

            const alert: DropDownAlertModal = {
                title: 'Challenge Complete!',
                body: `${completedChallenge.name}`,
                badgeUrl,
            };
            displayDropDownAlert(alert);
            fireConfetti();
        }
    };

    const updateMenuOptions = () => {
        if (!initialPlannedTask) {
            return;
        }

        let menuOptions: EmbtrMenuOption[] = [];
        if (!taskIsComplete && !taskIsFailed) {
            menuOptions.push({
                name: 'Complete Task',
                onPress: async () => {
                    closeMenu();
                    const result = await PlannedTaskController.complete(initialPlannedTask);
                },
            });
        }

        menuOptions.push({
            name: 'Reset task',
            onPress: async () => {
                closeMenu();

                const clone = { ...initialPlannedTask };
                clone.status = 'INCOMPLETE';
                onPlannedTaskUpdated(clone);

                await PlannedTaskController.update(clone);
            },
        });

        if (!taskIsComplete && !taskIsFailed) {
            menuOptions.push({
                name: 'Mark task as failed',
                onPress: async () => {
                    closeMenu();

                    const clone = { ...initialPlannedTask };
                    clone.status = 'FAILED';
                    onPlannedTaskUpdated(clone);

                    await PlannedTaskController.update(clone);
                },
            });
        }

        menuOptions.push({
            name: 'Delete',
            onPress: async () => {
                closeMenu();

                const clone = { ...initialPlannedTask };
                clone.active = false;
                onPlannedTaskUpdated(clone);

                await PlannedTaskController.update(clone);
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
        if (initialPlannedTask.plannedDay?.userId !== userId) {
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        updateMenuOptions();
        openMenu();
    };

    const getPercentageComplete = () => {
        if (initialPlannedTask.quantity) {
            return Math.min(100, ((completedQuantity ?? 0) / initialPlannedTask.quantity) * 100);
        }

        return initialPlannedTask.status === 'COMPLETE' ? 100 : 0;
    };

    return (
        <View>
            <UpdatePlannedTaskModal
                plannedTask={initialPlannedTask}
                visible={showUpdatePlannedTaskModal}
                fail={async () => {
                    setShowUpdatePlannedTaskModal(false);

                    const clone = { ...initialPlannedTask };
                    clone.status = 'FAILED';
                    onPlannedTaskUpdated(clone);

                    await PlannedTaskController.update(clone);
                }}
                complete={async () => {
                    setShowUpdatePlannedTaskModal(false);

                    const clone = { ...initialPlannedTask };
                    clone.status = 'INCOMPLETE';
                    setShowUpdatePlannedTaskModal(false);
                    setCompletedQuantity(clone.quantity ?? 0);
                    await updatePlannedTaskCompletedQuantity(clone, clone.quantity ?? 0);
                }}
                update={async (updatedValue: number) => {
                    setShowUpdatePlannedTaskModal(false);

                    const clone = { ...initialPlannedTask };

                    clone.status = 'INCOMPLETE';
                    setShowUpdatePlannedTaskModal(false);
                    setCompletedQuantity(updatedValue);
                    await updatePlannedTaskCompletedQuantity(clone, updatedValue);
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
                                    initialPlannedTask?.status === 'FAILED'
                                        ? colors.progress_bar_failed
                                        : completedQuantity >= (initialPlannedTask.quantity ?? 0)
                                        ? colors.progress_bar_complete
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
                                                fontFamily: POPPINS_SEMI_BOLD,
                                                fontSize: 14,
                                            }}
                                        >
                                            {initialPlannedTask.title}
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
                                        {challengeRewards.length > 0 && (
                                            <View
                                                style={{ paddingRight: 10, flexDirection: 'row' }}
                                            >
                                                <SvgUri
                                                    width={17}
                                                    height={17}
                                                    uri={challengeRewards[0].imageUrl ?? ''}
                                                />
                                            </View>
                                        )}
                                        <View>
                                            {initialPlannedTask?.status === 'FAILED' ? (
                                                <TaskFailedSymbol small={true} />
                                            ) : completedQuantity >=
                                              (initialPlannedTask.quantity ?? 0) ? (
                                                <TaskCompleteSymbol small={true} />
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
                                        progress={getPercentageComplete()}
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
                                        {`${completedQuantity} / ${initialPlannedTask.quantity} ${
                                            initialPlannedTask.unit
                                                ? UnitUtility.getReadableUnit(
                                                      initialPlannedTask.unit,
                                                      completedQuantity
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
