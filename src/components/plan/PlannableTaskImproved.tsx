import { View, Text, ViewStyle, TextStyle, Pressable } from 'react-native';
import { PlannedTask } from 'resources/schema';
import {
    CARD_SHADOW,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
    TIMELINE_CARD_PADDING,
} from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';
import { UnitUtility } from 'src/util/UnitUtility';
import React from 'react';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';
import { ProgressSvg } from './task/progress/ProgressSvg';
import { useAppDispatch } from 'src/redux/Hooks';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { setUpdateModalPlannedTask } from 'src/redux/user/GlobalState';
import { Image } from 'react-native';
import { OptimalImage, OptimalImageData } from '../common/images/OptimalImage';
import { PlanningService } from 'src/util/planning/PlanningService';
import { Constants } from 'resources/types/constants/constants';

interface Props {
    initialPlannedTask: PlannedTask;
    dayKey: string;
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
            padding: TIMELINE_CARD_PADDING / 2,
            width: '100%',
            flexDirection: 'row',
        },
        statusContainer: {
            width: '3%',
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
            paddingRight: TIMELINE_CARD_PADDING,
            flex: 1,
        },
        svgIcon: {
            height: 30,
            width: 30,
            right: TIMELINE_CARD_PADDING,
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
    ({ initialPlannedTask, dayKey, isGuest }: Props) => {
        return (
            <PlannableTaskImproved
                initialPlannedTask={initialPlannedTask}
                dayKey={dayKey}
                isGuest={isGuest}
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

export const PlannableTaskImproved = ({ initialPlannedTask, dayKey, isGuest }: Props) => {
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

    if (!plannedTask.active) {
        return <View />;
    }

    const habitIconImage: OptimalImageData = {
        remoteImageUrl: plannedTask.remoteImageUrl,
        localImage: plannedTask.localImage,
    };

    return (
        <TouchableOpacity
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
                        />

                        <View style={styles.svgProgress}>
                            <OptimalImage data={habitIconImage} style={{ height: 16, width: 16 }} />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
