import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import {
    CARD_SHADOW,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
    TIMELINE_CARD_PADDING,
} from 'src/util/constants';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import {
    getCloseMenu,
    getDisplayDropDownAlert,
    getFireConfetti,
    getOpenMenu,
    setCurrentlySelectedPlannedDay,
} from 'src/redux/user/GlobalState';
import * as Haptics from 'expo-haptics';
import { TaskInProgressSymbol } from '../common/task_symbols/TaskInProgressSymbol';
import { ChallengeReward, PlannedDay, PlannedTask as PlannedTaskModel } from 'resources/schema';
import { TaskCompleteSymbol } from '../common/task_symbols/TaskCompleteSymbol';
import { TaskFailedSymbol } from '../common/task_symbols/TaskFailedSymbol';
import { ProgressBar } from './goals/ProgressBar';
import { UpdatePlannedTaskModal } from 'src/components/plan/UpdatePlannedTaskModal';
import { UnitUtility } from 'src/util/UnitUtility';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { DropDownAlertModal } from 'src/model/DropDownAlertModel';
import { SvgUri } from 'react-native-svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Routes } from 'src/navigation/RootStackParamList';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import { RemoveHabitModal } from './habit/RemoveHabitModal';
import { HabitSkippedSymbol } from '../common/task_symbols/HabitSkippedSymbol';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';
import { EditHabitModal } from './habit/EditHabitModal';

interface Props {
    plannedDay: PlannedDay;
    initialPlannedTask: PlannedTaskModel;
    challengeRewards: ChallengeReward[];
}

export const PlannableTask = ({ plannedDay, initialPlannedTask, challengeRewards }: Props) => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [showRemoveHabitModal, setShowRemoveHabitModal] = React.useState<boolean>(false);
    const [showEditHabitModal, setShowEditHabitModal] = React.useState<boolean>(false);
    const [showUpdatePlannedTaskModal, setShowUpdatePlannedTaskModal] =
        React.useState<boolean>(false);
    const [optimisticallyUpdatedQuantity, setOptimisticallyUpdatedQuantity] =
        React.useState<number>(initialPlannedTask.completedQuantity ?? 0);
    const [optimisticallyUpdatedStatus, setOptimisticallyUpdatedStatus] = React.useState<string>(
        initialPlannedTask.status ?? 'INCOMPLETE'
    );
    const [optimisticallyRemovedPlannedHabit, setOptimisticallyRemovedPlannedHabit] =
        React.useState<boolean>(false);
    const [userId, setUserId] = React.useState<number | undefined>(undefined);

    React.useEffect(() => {
        const fetch = async () => {
            const userId = await getUserIdFromToken();
            setUserId(userId ?? 0);
        };

        fetch();
    }, [initialPlannedTask]);

    const skipped = optimisticallyUpdatedStatus === 'SKIPPED';

    //this entire section listens to the population of this callback id
    //if it is set, that means we want to edit a planned task. first we must
    //close the modal so we wait untilwe hit this useFocusEffect to know it's time
    const [editPlannedHabitCallbackId, setEditPlannedHabitCallbackId] = React.useState<
        number | undefined
    >();
    useFocusEffect(
        React.useCallback(() => {
            if (editPlannedHabitCallbackId && !showUpdatePlannedTaskModal) {
                navigation.navigate(Routes.EDIT_PLANNED_HABIT, {
                    plannedTaskId: editPlannedHabitCallbackId,
                });
                setEditPlannedHabitCallbackId(undefined);
            }
        }, [editPlannedHabitCallbackId, showUpdatePlannedTaskModal])
    );

    //this entire section listens to the population of this callback id
    //if it is set, that means we want to edit a planned task. first we must
    //close the modal so we wait untilwe hit this useFocusEffect to know it's time
    const [editScheduledHabitCallbackId, setEditScheduledHabitCallbackId] = React.useState<
        number | undefined
    >();
    useFocusEffect(
        React.useCallback(() => {
            if (editScheduledHabitCallbackId && !showUpdatePlannedTaskModal) {
                navigation.navigate(Routes.CREATE_EDIT_SCHEDULED_HABIT, {
                    scheduledHabitId: initialPlannedTask.scheduledHabitId,
                });
                setEditScheduledHabitCallbackId(undefined);
            }
        }, [editScheduledHabitCallbackId, showUpdatePlannedTaskModal])
    );

    React.useEffect(() => {
        setOptimisticallyUpdatedQuantity(initialPlannedTask.completedQuantity ?? 0);
    }, [initialPlannedTask.completedQuantity]);

    const dispatch = useAppDispatch();

    const fireConfetti = useAppSelector(getFireConfetti);
    const displayDropDownAlert = useAppSelector(getDisplayDropDownAlert);

    const createUpdatePlannedTask = async (clone: PlannedTaskModel) => {
        const updatedPlannedTask = clone.id
            ? await PlannedTaskController.update(clone)
            : await PlannedTaskController.create(plannedDay, clone);

        if (updatedPlannedTask?.plannedTask?.plannedDay) {
            //todo commented out because tempate tasks do not have a reference to the planned day so this is failing
            //await PlanningService.onTaskUpdated(initialPlannedTask.plannedDay!, fireConfetti);
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

    const openMenu = useAppSelector(getOpenMenu);
    const closeMenu = useAppSelector(getCloseMenu);

    const prettyTimeOfDay = TimeOfDayUtility.getTimeOfDayPretty(initialPlannedTask.timeOfDay);

    const onShortPress = async () => {
        setShowUpdatePlannedTaskModal(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    };

    const onLongPress = () => {
        if (initialPlannedTask.plannedDay?.userId !== userId) {
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        openMenu();
    };

    const getPercentageComplete = () => {
        if (initialPlannedTask.quantity) {
            return Math.min(
                100,
                ((optimisticallyUpdatedQuantity ?? 0) / initialPlannedTask.quantity) * 100
            );
        }

        return initialPlannedTask.status === 'COMPLETE' ? 100 : 0;
    };

    const refreshPlannedDay = async () => {
        if (!plannedDay?.dayKey) {
            return;
        }

        const updatedPlannedDay = await PlannedDayController.getForCurrentUserViaApi(
            plannedDay.dayKey
        );

        if (updatedPlannedDay) {
            dispatch(setCurrentlySelectedPlannedDay(updatedPlannedDay));
        }
    };

    const skip = async () => {
        setShowUpdatePlannedTaskModal(false);
        setOptimisticallyUpdatedStatus('SKIPPED');

        const clone = { ...initialPlannedTask };
        clone.status = 'SKIPPED';

        await createUpdatePlannedTask(clone);
        refreshPlannedDay();
    };

    const remove = async () => {
        setShowUpdatePlannedTaskModal(false);
        setShowRemoveHabitModal(true);
    };

    const edit = async () => {
        setShowUpdatePlannedTaskModal(false);
        setShowEditHabitModal(true);
    };

    const fail = async () => {
        setShowUpdatePlannedTaskModal(false);

        const clone = { ...initialPlannedTask };
        clone.status = 'FAILED';
        await PlannedTaskController.update(clone);
        refreshPlannedDay();
    };

    const complete = async () => {
        setShowUpdatePlannedTaskModal(false);

        const clone = { ...initialPlannedTask };
        clone.status = 'INCOMPLETE';

        setOptimisticallyUpdatedStatus('INCOMPLETE');
        setOptimisticallyUpdatedQuantity(clone.quantity ?? 0);

        clone.completedQuantity = clone.quantity ?? 0;

        await createUpdatePlannedTask(clone);
        refreshPlannedDay();
    };

    const update = async (updatedValue: number) => {
        setShowUpdatePlannedTaskModal(false);

        setOptimisticallyUpdatedStatus('INCOMPLETE');
        setOptimisticallyUpdatedQuantity(updatedValue);

        const clone = { ...initialPlannedTask };
        clone.status = 'INCOMPLETE';
        clone.completedQuantity = updatedValue;

        await createUpdatePlannedTask(clone);
        await refreshPlannedDay();
    };

    const dismiss = () => {
        setShowUpdatePlannedTaskModal(false);
    };

    const editScheduledHabit = (editScheduledHabitCallbackId: number) => {
        setEditScheduledHabitCallbackId(editScheduledHabitCallbackId);
        setShowEditHabitModal(false);
    };

    const editPlannedHabit = (editPlannedHabitCallbackId: number) => {
        setEditPlannedHabitCallbackId(editPlannedHabitCallbackId);
        setShowEditHabitModal(false);
    };

    return (
        <View>
            <EditHabitModal
                visible={showEditHabitModal}
                editPlannedHabit={editPlannedHabit}
                editScheduledHabit={editScheduledHabit}
                dismiss={() => {
                    setShowEditHabitModal(false);
                }}
                plannedDay={plannedDay}
                plannedHabit={initialPlannedTask}
            />
            <RemoveHabitModal
                visible={showRemoveHabitModal}
                onDismiss={async (removed: boolean) => {
                    setShowRemoveHabitModal(false);
                    setOptimisticallyRemovedPlannedHabit(removed);
                }}
                plannedHabit={initialPlannedTask}
                plannedDay={plannedDay}
            />
            <UpdatePlannedTaskModal
                plannedTask={initialPlannedTask}
                visible={showUpdatePlannedTaskModal}
                skip={skip}
                edit={edit}
                remove={remove}
                fail={fail}
                complete={complete}
                update={update}
                dismiss={dismiss}
            />

            {!optimisticallyRemovedPlannedHabit && (
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
                                            : skipped
                                            ? colors.trophy_icon
                                            : optimisticallyUpdatedQuantity >=
                                              (initialPlannedTask.quantity ?? 0)
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
                                                    style={{
                                                        paddingRight: 10,
                                                        flexDirection: 'row',
                                                    }}
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
                                                ) : skipped ? (
                                                    <HabitSkippedSymbol small={true} />
                                                ) : optimisticallyUpdatedQuantity >=
                                                  (initialPlannedTask.quantity ?? 0) ? (
                                                    <TaskCompleteSymbol small={true} />
                                                ) : (
                                                    <TaskInProgressSymbol small={true} />
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        paddingTop: 5,
                                        paddingBottom: 2,
                                    }}
                                >
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
                                            status={optimisticallyUpdatedStatus}
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
                                            {skipped
                                                ? 'skipped'
                                                : `${optimisticallyUpdatedQuantity} / ${
                                                      initialPlannedTask.quantity
                                                  } ${
                                                      initialPlannedTask.unit
                                                          ? UnitUtility.getReadableUnit(
                                                                initialPlannedTask.unit,
                                                                optimisticallyUpdatedQuantity
                                                            )
                                                          : ''
                                                  }`}
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
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
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                            paddingRight: TIMELINE_CARD_PADDING,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                paddingLeft: 5,
                                                color: colors.accent_color,
                                                fontFamily: 'Poppins_400Regular',
                                                textAlign: 'left',
                                                fontSize: 10,
                                            }}
                                        >
                                            {prettyTimeOfDay}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};
