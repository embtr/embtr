import { View, Text, TextStyle, Pressable } from 'react-native';
import { PlannedTask } from 'resources/schema';
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
import { getFirePoints, setUpdateModalPlannedTask } from 'src/redux/user/GlobalState';
import { Image } from 'react-native';
import { OptimalImageData } from '../common/images/OptimalImage';
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

interface Props {
    initialPlannedTask: PlannedTask;
    dayKey: string;
    currentUserId: number;
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
    ({ initialPlannedTask, dayKey, isGuest, currentUserId }: Props) => {
        return (
            <PlannableTaskImproved
                initialPlannedTask={initialPlannedTask}
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

export const PlannableTaskImproved = ({
    initialPlannedTask,
    dayKey,
    isGuest,
    currentUserId,
}: Props) => {
    const { colors } = useTheme();
    const styles = generateStyles(colors);

    const [plannedTask, setPlannedTask] = React.useState<PlannedTask>(initialPlannedTask);

    const firePoints = useAppSelector(getFirePoints);
    const pointDivisor = plannedTask.scheduledHabit?.timesOfDay?.length ?? 1;
    const habitCompletePoints = PointCustomHooks.useHabitCompletePoints() / pointDivisor;
    console.log(habitCompletePoints);

    const unitPretty = plannedTask.unit
        ? UnitUtility.getReadableUnit(plannedTask.unit, plannedTask.quantity ?? 0)
        : '';

    const statusColor = getStatusColor(colors, plannedTask.status);
    const completedQuantity = plannedTask.completedQuantity ?? 0;
    const targetQuantity = plannedTask.quantity ?? 1;

    const dispatch = useAppDispatch();

    const habitIconImage: OptimalImageData = {
        icon: plannedTask.icon,
        remoteImageUrl: plannedTask.remoteImageUrl,
        localImage: plannedTask.localImage,
    };

    const ref = React.useRef<Swipeable>(null);

    const showReset =
        (plannedTask.completedQuantity ?? 0) >= (plannedTask.quantity ?? 1) ||
        plannedTask.status === Constants.CompletionState.SKIPPED ||
        plannedTask.status === Constants.CompletionState.FAILED;

    const leftSnapOption: SwipeableSnapOptionData = {
        text: showReset ? 'Reset' : 'Done',
        color: showReset ? 'gray' : colors.progress_bar_complete,
        onAction: async () => {
            const originalStatus = plannedTask.status;

            if (showReset) {
                setPlannedTask({
                    ...plannedTask,
                    status: Constants.CompletionState.INCOMPLETE,
                    completedQuantity: 0,
                });
                if (originalStatus === Constants.CompletionState.COMPLETE && habitCompletePoints) {
                    firePoints(-habitCompletePoints);
                }
                await PlannedTaskService.incomplete(plannedTask, dayKey);
            } else {
                setPlannedTask({
                    ...plannedTask,
                    status: Constants.CompletionState.COMPLETE,
                    completedQuantity: plannedTask.quantity,
                });
                if (habitCompletePoints) {
                    firePoints(habitCompletePoints);
                }
                await PlannedTaskService.complete(plannedTask, dayKey);
            }

            PlannedDayController.invalidatePlannedDay(currentUserId, dayKey);
        },
        snapPoint: 100,
    };

    const rightOptions: SwipeableCardElementData[] = [
        {
            text: 'Skip',
            color: colors.progress_bar_skipped,
            onAction: async () => {
                const originalStatus = plannedTask.status;

                setPlannedTask({
                    ...plannedTask,
                    status: Constants.CompletionState.SKIPPED,
                });
                ref.current?.close();

                if (originalStatus === Constants.CompletionState.COMPLETE && habitCompletePoints) {
                    firePoints(-habitCompletePoints);
                }

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await PlannedTaskService.skip(plannedTask, dayKey);
                PlannedDayController.invalidatePlannedDay(currentUserId, dayKey);
            },
        },
        {
            text: 'Fail',
            color: colors.progress_bar_failed,
            onAction: async () => {
                const originalStatus = plannedTask.status;

                setPlannedTask({
                    ...plannedTask,
                    status: Constants.CompletionState.FAILED,
                });
                ref.current?.close();

                if (originalStatus === Constants.CompletionState.COMPLETE && habitCompletePoints) {
                    firePoints(-habitCompletePoints);
                }

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await PlannedTaskService.fail(plannedTask, dayKey);
                PlannedDayController.invalidatePlannedDay(currentUserId, dayKey);
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
