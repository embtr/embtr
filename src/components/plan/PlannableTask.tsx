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
import { getDisplayDropDownAlert, getFireConfetti, getOpenMenu } from 'src/redux/user/GlobalState';
import * as Haptics from 'expo-haptics';
import { ChallengeReward, PlannedDay, PlannedTask as PlannedTaskModel } from 'resources/schema';
import { UpdatePlannedTaskModal } from 'src/components/plan/UpdatePlannedTaskModal';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { DropDownAlertModal } from 'src/model/DropDownAlertModel';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Routes } from 'src/navigation/RootStackParamList';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import { RemoveHabitModal } from './habit/RemoveHabitModal';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import { EditHabitModal } from './habit/EditHabitModal';
import { NewPlannedHabitData } from 'src/model/PlannedHabitModels';
import { UnitUtility } from 'src/util/UnitUtility';
import Svg, { Circle, SvgUri } from 'react-native-svg';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';

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
    const [editNewPlannedHabitCallbackData, setNewEditPlannedHabitCallbackData] = React.useState<
        NewPlannedHabitData | undefined
    >();
    useFocusEffect(
        React.useCallback(() => {
            if (editPlannedHabitCallbackId && !showUpdatePlannedTaskModal) {
                navigation.navigate(Routes.EDIT_PLANNED_HABIT, {
                    plannedTaskId: editPlannedHabitCallbackId,
                });
                setEditPlannedHabitCallbackId(undefined);
            } else if (editNewPlannedHabitCallbackData && !showUpdatePlannedTaskModal) {
                navigation.navigate(Routes.EDIT_PLANNED_HABIT, {
                    newPlannedHabitData: editNewPlannedHabitCallbackData,
                });
                setNewEditPlannedHabitCallbackData(undefined);
            }
        }, [
            editPlannedHabitCallbackId,
            editNewPlannedHabitCallbackData,
            showUpdatePlannedTaskModal,
        ])
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

    const refreshPlannedDay = async () => {
        if (!plannedDay?.dayKey) {
            return;
        }

        PlannedDayController.prefetchPlannedDayData(plannedDay.dayKey);
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
        refreshPlannedDay();
    };

    const edit = async () => {
        setShowUpdatePlannedTaskModal(false);
        setShowEditHabitModal(true);
        refreshPlannedDay();
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

    const editNewPlannedHabit = (newPlannedHabitData: NewPlannedHabitData) => {
        setNewEditPlannedHabitCallbackData(newPlannedHabitData);
        setShowEditHabitModal(false);
    };

    const unitPretty = initialPlannedTask.unit
        ? UnitUtility.getReadableUnit(initialPlannedTask.unit, initialPlannedTask.quantity ?? 0)
        : '';

    // Calculate the circumference of the circle
    const radius = 13;
    const progress =
        ((initialPlannedTask.completedQuantity ?? 0) / (initialPlannedTask.quantity ?? 1) * 100);
    const circumference = 2 * Math.PI * radius;

    // Calculate the dash offset to represent the progress
    const dashOffset = circumference * (1 - progress / 100);

    return (
        <View>
            <EditHabitModal
                visible={showEditHabitModal}
                editPlannedHabit={editPlannedHabit}
                editNewPlannedHabit={editNewPlannedHabit}
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
                                backgroundColor: '#404040',
                                borderRadius: 5,
                                width: '100%',
                            },
                            CARD_SHADOW,
                        ]}
                    >
                        <View style={{ borderRadius: 5, flexDirection: 'row', overflow: 'hidden' }}>
                            {/* LEFT COLOR PADDING */}
                            <View
                                style={{
                                    width: '3%',
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

                            <View style={{ width: '97%', flexDirection: 'row' }}>
                                {/* LEFT TEXT CONTENT */}
                                <View
                                    style={{
                                        flex: 1,
                                        paddingLeft: TIMELINE_CARD_PADDING / 2,
                                    }}
                                >
                                    {/* TITLE */}
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                color: colors.goal_primary_font,
                                                fontFamily: POPPINS_SEMI_BOLD,
                                                fontSize: 14,
                                            }}
                                        >
                                            {initialPlannedTask.title}
                                        </Text>
                                    </View>

                                    {/* GOAL/ COMPLETED */}
                                    <View>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    color: colors.secondary_text,
                                                    fontFamily: POPPINS_REGULAR,
                                                    fontSize: 12,
                                                }}
                                            >
                                                goal: {initialPlannedTask.quantity} {unitPretty}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    color: colors.goal_primary_font,
                                                    fontFamily: POPPINS_REGULAR,
                                                    fontSize: 12,
                                                }}
                                            >
                                                completed: {initialPlannedTask.completedQuantity}{' '}
                                                Miles
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* RIGHT SIDE ICONS */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ paddingRight: TIMELINE_CARD_PADDING }}>
                                        <SvgUri
                                            width={30}
                                            height={30}
                                            uri={TimeOfDayUtility.getTimeOfDayIcon(
                                                initialPlannedTask.timeOfDay
                                            )}
                                        />
                                    </View>

                                    <View style={{ paddingRight: TIMELINE_CARD_PADDING }}>
                                        <Svg width={28} height={28} transform={[{ rotate: '-90deg' }]} >
                                            {/* Background Circle */}
                                            <Circle
                                                cx={14}
                                                cy={14}
                                                r={radius}
                                                stroke={colors.secondary_text}
                                                strokeWidth={2}
                                                fill="transparent"
                                            />

                                            {/* Progress Circle */}
                                            <Circle
                                                cx={14}
                                                cy={14}
                                                r={radius}
                                                stroke={colors.progress_bar_complete}
                                                strokeWidth={2}
                                                fill="transparent"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={dashOffset}
                                                strokeLinecap="round"
                                            />
                                        </Svg>

                                        {/* SVG Icon */}
                                        <View
                                            style={{
                                                position: 'absolute',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 28,
                                                height: 28,
                                            }}
                                        >
                                            <SvgUri
                                                width={15}
                                                height={15}
                                                uri={initialPlannedTask.iconUrl ?? ''}
                                            />
                                        </View>
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
