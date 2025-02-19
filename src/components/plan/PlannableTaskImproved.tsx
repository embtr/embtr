import { View, Text, TextStyle, Pressable } from 'react-native';
import { PlannedDay, PlannedTask } from 'resources/schema';
import {
    CARD_SHADOW,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
    PADDING_LARGE,
    PADDING_SMALL,
} from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';
import { UnitUtility } from 'src/util/UnitUtility';
import React from 'react';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';
import { ProgressSvg } from './task/progress/ProgressSvg';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { Swipeable } from 'react-native-gesture-handler';
import {
    getFireConfetti,
    getFirePoints,
    setUpdateModalPlannedTask,
} from 'src/redux/user/GlobalState';
import { Image } from 'react-native';
import { PlanningService } from 'src/util/planning/PlanningService';
import { Constants } from 'resources/types/constants/constants';
import { SwipeableCard } from '../common/swipeable/SwipeableCard';
import { PlannedTaskService } from 'src/service/PlannedHabitService';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import * as Haptics from 'expo-haptics';
import {
    SwipeableCardElementData,
    SwipeableSnapOptionData,
} from '../common/swipeable/SwipeableCardElement';
import { HabitIcon } from './habit/HabitIcon';
import { ChallengeBadge } from '../common/comments/general/ChallengeBadge';
import { PointCustomHooks } from 'src/controller/PointController';
import { PureDate } from 'resources/types/date/PureDate';
import { WebSocketService } from 'src/service/WebSocketService';
import { PlannedTaskUtil } from 'src/util/PlannedTaskUtil';
import { PlannedDayUtil } from 'src/util/PlannedDayUtil';
import { LevelController } from 'src/controller/level/LevelController';

interface Props {
    initialPlannedTask: PlannedTask;
    dayKey: string;
    currentUserId: number;
    plannedDay: PlannedDay;
    isGuest?: boolean;
}

interface Styles {
    text: TextStyle;
    goalText: TextStyle;
    completedText: TextStyle;
}

const generateStyles = (colors: any): Styles => {
    return {
        text: {
            color: colors.goal_primary_font,
            fontFamily: POPPINS_SEMI_BOLD,
            fontSize: 14,
        },
        goalText: {
            color: colors.secondary_text,
            fontFamily: POPPINS_REGULAR,
            fontSize: 12,
            lineHeight: 15,
        },
        completedText: {
            color: colors.goal_primary_font,
            fontFamily: POPPINS_REGULAR,
            fontSize: 12,
            lineHeight: 15,
        },
    };
};

export const MemoizedPlannableTaskImproved = React.memo(
    ({ initialPlannedTask, plannedDay, dayKey, isGuest, currentUserId }: Props) => {
        return (
            <PlannableTaskImproved
                initialPlannedTask={initialPlannedTask}
                plannedDay={plannedDay}
                dayKey={dayKey}
                isGuest={isGuest}
                currentUserId={currentUserId}
            />
        );
    },
    (prevProps, nextProps) => {
        const prevKey = PlanningService.getPlannedHabitUniqueKey(prevProps.initialPlannedTask);
        const nextKey = PlanningService.getPlannedHabitUniqueKey(nextProps.initialPlannedTask);

        return prevKey === nextKey;
    }
);

const getStatusColor = (colors: any, status?: string) => {
    switch (status) {
        case Constants.CompletionState.FAILED:
            return colors.progress_bar_failed;
        case Constants.CompletionState.SKIPPED:
            return colors.progress_bar_skipped;
        case Constants.CompletionState.COMPLETE:
            return colors.progress_bar_complete;
        default:
            return 'gray';
    }
};

const conditionallyFirePoints = (
    userId: number,
    firePoints: Function,
    points: number,
    dayKey: string
) => {
    const habitPureDate = PureDate.fromString(dayKey);
    const cutoffDate = PureDate.fromString('2024-08-01');

    if (habitPureDate < cutoffDate) {
        return;
    }

    LevelController.clearDebounce();
    LevelController.addPointsToLevelDetails(userId, points);
    firePoints(points);
};

export const PlannableTaskImproved = ({
    initialPlannedTask,
    plannedDay,
    dayKey,
    isGuest,
    currentUserId,
}: Props) => {
    const { colors } = useTheme();
    const styles = generateStyles(colors);

    const [plannedTask, setPlannedTask] = React.useState<PlannedTask>(initialPlannedTask);

    const fireConfetti = useAppSelector(getFireConfetti);
    const firePoints = useAppSelector(getFirePoints);
    const pointDivisor = plannedTask.scheduledHabit?.timesOfDay?.length ?? 1;
    const habitCompletePoints = PointCustomHooks.useHabitCompletePoints() / pointDivisor;

    const unitPretty = plannedTask.unit
        ? UnitUtility.getReadableUnit(plannedTask.unit, plannedTask.quantity ?? 0)
        : '';

    const statusColor = getStatusColor(colors, plannedTask.status);
    const completedQuantity = plannedTask.completedQuantity ?? 0;
    const targetQuantity = plannedTask.quantity ?? 1;

    const dispatch = useAppDispatch();

    const habitIconImage = PlannedTaskUtil.getOptimalImage(plannedTask);

    const ref = React.useRef<Swipeable>(null);

    const showReset =
        (plannedTask.completedQuantity ?? 0) >= (plannedTask.quantity ?? 1) ||
        plannedTask.status === Constants.CompletionState.SKIPPED ||
        plannedTask.status === Constants.CompletionState.FAILED;

    const leftSnapOption: SwipeableSnapOptionData = {
        text: showReset ? 'Reset' : 'Done',
        color: showReset ? 'gray' : colors.progress_bar_complete,
        onAction: async () => {
            WebSocketService.connectIfNotConnected();

            const wasComplete = PlannedDayUtil.getAllHabitsAreCompleteOptimistic(plannedDay);

            const originalStatus = plannedTask.status;

            if (showReset) {
                plannedDay.plannedTasks?.forEach((task) => {
                    const isThePlannedTask = PlannedTaskUtil.isThePlannedTask(task, plannedTask);
                    if (isThePlannedTask) {
                        task.status = Constants.CompletionState.INCOMPLETE;
                        task.completedQuantity = 0;
                        return;
                    }
                });

                setPlannedTask({
                    ...plannedTask,
                    status: Constants.CompletionState.INCOMPLETE,
                    completedQuantity: 0,
                });

                const isComplete = PlannedDayUtil.getAllHabitsAreCompleteOptimistic(plannedDay);
                PlannedDayController.setPlannedDayIsComplete(currentUserId, dayKey, isComplete);

                if (wasComplete && !isComplete) {
                    setTimeout(() => {
                        conditionallyFirePoints(currentUserId, firePoints, -300, dayKey);
                    }, 250);
                }

                if (originalStatus === Constants.CompletionState.COMPLETE && habitCompletePoints) {
                    conditionallyFirePoints(
                        currentUserId,
                        firePoints,
                        -habitCompletePoints,
                        dayKey
                    );
                }

                PlannedTaskService.incomplete(plannedTask, dayKey);
            } else {
                plannedDay.plannedTasks?.forEach((task) => {
                    const isThePlannedTask = PlannedTaskUtil.isThePlannedTask(task, plannedTask);

                    if (
                        (task.id && plannedTask.id && task.id === plannedTask.id) ||
                        isThePlannedTask
                    ) {
                        task.status = Constants.CompletionState.COMPLETE;
                        task.completedQuantity = plannedTask.quantity;
                        return;
                    }
                });

                setPlannedTask({
                    ...plannedTask,
                    status: Constants.CompletionState.COMPLETE,
                    completedQuantity: plannedTask.quantity,
                });

                const isComplete = PlannedDayUtil.getAllHabitsAreCompleteOptimistic(
                    plannedDay,
                    plannedTask
                );
                PlannedDayController.setPlannedDayIsComplete(currentUserId, dayKey, isComplete);

                plannedDay.status = isComplete
                    ? Constants.CompletionState.COMPLETE
                    : Constants.CompletionState.INCOMPLETE;

                if (isComplete) {
                    fireConfetti();

                    setTimeout(() => {
                        conditionallyFirePoints(currentUserId, firePoints, 300, dayKey);
                    }, 250);
                }

                if (habitCompletePoints) {
                    conditionallyFirePoints(currentUserId, firePoints, habitCompletePoints, dayKey);
                }

                PlannedTaskService.complete(plannedTask, dayKey);
            }
        },
        snapPoint: 100,
    };

    const rightOptions: SwipeableCardElementData[] = [
        {
            text: 'Skip',
            color: colors.progress_bar_skipped,
            onAction: async () => {
                const wasComplete = PlannedDayUtil.getAllHabitsAreCompleteOptimistic(plannedDay);
                const originalStatus = plannedTask.status;

                setPlannedTask({
                    ...plannedTask,
                    status: Constants.CompletionState.SKIPPED,
                });
                ref.current?.close();

                if (originalStatus === Constants.CompletionState.COMPLETE && habitCompletePoints) {
                    conditionallyFirePoints(
                        currentUserId,
                        firePoints,
                        -habitCompletePoints,
                        dayKey
                    );
                }

                const isComplete = PlannedDayUtil.getAllHabitsAreCompleteOptimistic(
                    plannedDay,
                    plannedTask
                );

                PlannedDayController.setPlannedDayIsComplete(currentUserId, dayKey, isComplete);

                if (!wasComplete && isComplete) {
                    fireConfetti();

                    setTimeout(() => {
                        conditionallyFirePoints(currentUserId, firePoints, 300, dayKey);
                    }, 250);
                }

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                PlannedTaskService.skip(plannedTask, dayKey);

                plannedDay.plannedTasks?.forEach((task) => {
                    const isThePlannedTask = PlannedTaskUtil.isThePlannedTask(task, plannedTask);
                    if (isThePlannedTask) {
                        task.status = Constants.CompletionState.SKIPPED;
                        return;
                    }
                });
                //PlannedDayController.invalidatePlannedDay(currentUserId, dayKey);
            },
        },
        {
            text: 'Fail',
            color: colors.progress_bar_failed,
            onAction: async () => {
                const wasComplete = PlannedDayUtil.getAllHabitsAreCompleteOptimistic(plannedDay);
                const originalStatus = plannedTask.status;

                setPlannedTask({
                    ...plannedTask,
                    status: Constants.CompletionState.FAILED,
                });
                ref.current?.close();

                if (originalStatus === Constants.CompletionState.COMPLETE && habitCompletePoints) {
                    conditionallyFirePoints(
                        currentUserId,
                        firePoints,
                        -habitCompletePoints,
                        dayKey
                    );
                }

                if (wasComplete) {
                    setTimeout(() => {
                        conditionallyFirePoints(currentUserId, firePoints, -300, dayKey);
                    }, 250);
                }

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                PlannedTaskService.fail(plannedTask, dayKey);

                plannedDay.plannedTasks?.forEach((task) => {
                    const isThePlannedTask = PlannedTaskUtil.isThePlannedTask(task, plannedTask);
                    if (isThePlannedTask) {
                        task.status = Constants.CompletionState.FAILED;
                        return;
                    }
                });
                PlannedDayController.setPlannedDayIsComplete(currentUserId, dayKey, false);

                //PlannedDayController.invalidatePlannedDay(currentUserId, dayKey);
            },
        },
    ];

    if (!plannedTask.active) {
        return <View />;
    }

    const isChallenge = plannedTask.scheduledHabit?.task?.type === 'CHALLENGE';

    return (
        <SwipeableCard
            disabled={isGuest === true}
            leftSnapOption={leftSnapOption}
            rightOptions={rightOptions}
            ref={ref}
        >
            <Pressable
                disabled={isGuest === true}
                style={{
                    backgroundColor: colors.widget_element_background,
                    borderRadius: 5,
                    flexDirection: 'row',
                    ...CARD_SHADOW,
                }}
                onPress={() => {
                    dispatch(
                        setUpdateModalPlannedTask({
                            plannedTask: plannedTask,
                            callback: (plannedTask: PlannedTask) => {
                                setPlannedTask(plannedTask);
                            },
                            dayKey: dayKey,
                        })
                    );
                }}
            >
                {/* STATUS INDICATOR */}
                <View
                    style={[
                        {
                            paddingLeft: PADDING_LARGE,
                            borderTopLeftRadius: 5,
                            borderBottomLeftRadius: 5,
                            backgroundColor: statusColor,
                        },
                    ]}
                />
                <View
                    style={{
                        padding: PADDING_LARGE / 2,
                        flex: 1,
                        flexDirection: 'row',
                    }}
                >
                    <View>
                        <Text style={styles.text} numberOfLines={1}>
                            {plannedTask.title}
                        </Text>
                        <View>
                            <Text style={styles.goalText} numberOfLines={1}>
                                goal: {targetQuantity} {unitPretty}
                            </Text>
                            <Text style={styles.completedText} numberOfLines={1}>
                                completed: {completedQuantity} {unitPretty}
                            </Text>
                        </View>
                    </View>
                </View>
                <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingHorizontal: PADDING_LARGE,
                            flex: 1,
                        }}
                    >
                        {isChallenge && <ChallengeBadge size={28} />}

                        {plannedTask.timeOfDay?.id !== 5 && (
                            <View style={{ marginLeft: PADDING_SMALL }}>
                                <Image
                                    source={TimeOfDayUtility.getTimeOfDayIcon(
                                        plannedTask.timeOfDay
                                    )}
                                    style={{
                                        height: 30,
                                        width: 30,
                                    }}
                                />
                            </View>
                        )}

                        <View style={{ marginLeft: PADDING_SMALL }}>
                            <ProgressSvg
                                size={28}
                                strokeWidth={2}
                                targetQuantity={targetQuantity ?? 1}
                                completedQuantity={completedQuantity ?? 0}
                                isSkipped={plannedTask.status === Constants.CompletionState.SKIPPED}
                                isFailed={plannedTask.status === Constants.CompletionState.FAILED}
                            />

                            <View
                                style={{
                                    position: 'absolute',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 28,
                                    height: 28,
                                }}
                            >
                                <HabitIcon optimalImageData={habitIconImage} size={16} />
                            </View>
                        </View>
                    </View>
                </View>
            </Pressable>
        </SwipeableCard>
    );
};
