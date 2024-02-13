import { View, Text, ViewStyle, TextStyle, Pressable } from 'react-native';
import { PlannedTask } from 'resources/schema';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD, PADDING_LARGE } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';
import { UnitUtility } from 'src/util/UnitUtility';
import React from 'react';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';
import { ProgressSvg } from './task/progress/ProgressSvg';
import { useAppDispatch } from 'src/redux/Hooks';
import { Swipeable } from 'react-native-gesture-handler';
import { setUpdateModalPlannedTask } from 'src/redux/user/GlobalState';
import { Image } from 'react-native';
import { OptimalImage, OptimalImageData } from '../common/images/OptimalImage';
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

interface Props {
    initialPlannedTask: PlannedTask;
    dayKey: string;
    currentUserId: number;
    isGuest?: boolean;
}

interface Styles {
    container: ViewStyle;
    innerContainer: ViewStyle;
    statusContainer: ViewStyle;
    text: TextStyle;
    goalText: TextStyle;
    completedText: TextStyle;
    timeIconContainer: ViewStyle;
    svgIcon: any;
    svgProgress: ViewStyle;
}

const generateStyles = (colors: any): Styles => {
    return {
        container: {
            backgroundColor: '#404040',
            borderRadius: 5,
            flexDirection: 'row',
            ...CARD_SHADOW,
        },
        innerContainer: {
            padding: PADDING_LARGE / 2,
            flex: 1,
            flexDirection: 'row',
        },
        statusContainer: {
            paddingLeft: PADDING_LARGE,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
        },
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
        timeIconContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: PADDING_LARGE,
        },
        svgIcon: {
            height: 30,
            width: 30,
            right: PADDING_LARGE,
        },
        svgProgress: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
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
        case Constants.HabitStatus.FAILED:
            return colors.progress_bar_failed;
        case Constants.HabitStatus.SKIPPED:
            return colors.progress_bar_skipped;
        case Constants.HabitStatus.COMPLETE:
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

    const unitPretty = plannedTask.unit
        ? UnitUtility.getReadableUnit(plannedTask.unit, plannedTask.quantity ?? 0)
        : '';

    const statusColor = getStatusColor(colors, plannedTask.status);
    const completedQuantity = plannedTask.completedQuantity ?? 0;
    const targetQuantity = plannedTask.quantity ?? 1;

    const dispatch = useAppDispatch();

    const habitIconImage: OptimalImageData = {
        remoteImageUrl: plannedTask.remoteImageUrl,
        localImage: plannedTask.localImage,
    };

    const ref = React.useRef<Swipeable>(null);

    const showReset =
        (plannedTask.completedQuantity ?? 0) >= (plannedTask.quantity ?? 1) ||
        plannedTask.status === Constants.HabitStatus.SKIPPED ||
        plannedTask.status === Constants.HabitStatus.FAILED;

    const leftSnapOption: SwipeableSnapOptionData = {
        text: showReset ? 'Reset' : 'Done',
        color: showReset ? 'gray' : colors.progress_bar_complete,
        onAction: async () => {
            if (showReset) {
                setPlannedTask({
                    ...plannedTask,
                    status: Constants.HabitStatus.INCOMPLETE,
                    completedQuantity: 0,
                });
                await PlannedTaskService.incomplete(plannedTask, dayKey);
            } else {
                setPlannedTask({
                    ...plannedTask,
                    status: Constants.HabitStatus.COMPLETE,
                    completedQuantity: plannedTask.quantity,
                });
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
                setPlannedTask({
                    ...plannedTask,
                    status: Constants.HabitStatus.SKIPPED,
                });
                ref.current?.close();

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await PlannedTaskService.skip(plannedTask, dayKey);
                PlannedDayController.invalidatePlannedDay(currentUserId, dayKey);
            },
        },
        {
            text: 'Fail',
            color: colors.progress_bar_failed,
            onAction: async () => {
                setPlannedTask({
                    ...plannedTask,
                    status: Constants.HabitStatus.FAILED,
                });
                ref.current?.close();

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await PlannedTaskService.fail(plannedTask, dayKey);
                PlannedDayController.invalidatePlannedDay(currentUserId, dayKey);
            },
        },
    ];

    if (!plannedTask.active) {
        return <View />;
    }

    return (
        <SwipeableCard leftSnapOption={leftSnapOption} rightOptions={rightOptions} ref={ref}>
            <Pressable
                disabled={isGuest === true}
                style={styles.container}
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
                <View style={[styles.statusContainer, { backgroundColor: statusColor }]} />
                <View style={styles.innerContainer}>
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
                <View style={styles.timeIconContainer}>
                    <Image
                        source={TimeOfDayUtility.getTimeOfDayIcon(plannedTask.timeOfDay)}
                        style={styles.svgIcon}
                    />

                    <View>
                        <ProgressSvg
                            targetQuantity={targetQuantity ?? 1}
                            completedQuantity={completedQuantity ?? 0}
                            isSkipped={plannedTask.status === Constants.HabitStatus.SKIPPED}
                            isFailed={plannedTask.status === Constants.HabitStatus.FAILED}
                        />

                        <View style={styles.svgProgress}>
                            <OptimalImage data={habitIconImage} style={{ height: 16, width: 16 }} />
                        </View>
                    </View>
                </View>
            </Pressable>
        </SwipeableCard>
    );
};
