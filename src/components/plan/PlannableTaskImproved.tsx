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
import { CachedImage } from '../common/images/CachedImage';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';
import { ProgressSvg } from './task/progress/ProgressSvg';
import { useAppDispatch } from 'src/redux/Hooks';
import { setGlobalPlannedTaskToUpdate } from 'src/redux/user/GlobalState';

interface Props {
    plannedTask: PlannedTask;
}

interface Styles {
    container: ViewStyle;
    innerContainer: ViewStyle;
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
    ({ plannedTask }: Props) => {
        return <PlannableTaskImproved plannedTask={plannedTask} />;
    },
    (prevProps, nextProps) => {
        const prevKey =
            'plannedDay' +
            prevProps.plannedTask.plannedDayId +
            '_plannedTask' +
            prevProps.plannedTask.id +
            '_scheduledHabit' +
            prevProps.plannedTask.scheduledHabitId +
            '_timeOfDay' +
            prevProps.plannedTask.timeOfDayId;
        const nextKey =
            'plannedDay' +
            nextProps.plannedTask.plannedDayId +
            '_plannedTask' +
            nextProps.plannedTask.id +
            '_scheduledHabit' +
            nextProps.plannedTask.scheduledHabitId +
            '_timeOfDay' +
            nextProps.plannedTask.timeOfDayId;

        return prevKey === nextKey;
    }
);

export const PlannableTaskImproved = ({ plannedTask }: Props) => {
    const { colors } = useTheme();
    const styles = generateStyles(colors);

    const unitPretty = plannedTask.unit
        ? UnitUtility.getReadableUnit(plannedTask.unit, plannedTask.quantity ?? 0)
        : '';

    const completedQuantity = plannedTask.completedQuantity ?? 0;
    const targetQuantity = plannedTask.quantity ?? 1;

    const dispatch = useAppDispatch();

    const memoizedTimeOfDayImage = React.useMemo(() => {
        return (
            <CachedImage
                uri={TimeOfDayUtility.getTimeOfDayIcon(plannedTask.timeOfDay)}
                style={styles.svgIcon}
            />
        );
    }, [plannedTask.timeOfDay]);

    const memoizedProgressSvg = React.useMemo(() => {
        return (
            <ProgressSvg
                targetQuantity={plannedTask.quantity ?? 1}
                completedQuantity={plannedTask.completedQuantity ?? 0}
            />
        );
    }, [plannedTask.quantity, plannedTask.completedQuantity]);

    const memoizedHabitIcon = React.useMemo(() => {
        return <CachedImage uri={plannedTask.iconUrl ?? ''} style={styles.svgIcon} />;
    }, [plannedTask.iconUrl]);

    return (
        <Pressable
            onPress={() => {
                dispatch(setGlobalPlannedTaskToUpdate(plannedTask));
            }}
        >
            <View style={styles.container}>
                <View
                    style={{
                        width: '3%',
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5,
                        backgroundColor:
                            plannedTask?.status === 'FAILED'
                                ? colors.progress_bar_failed
                                : 'SKIPPED'
                                  ? colors.trophy_icon
                                  : completedQuantity >= targetQuantity
                                    ? colors.progress_bar_complete
                                    : 'gray',
                    }}
                />

                <View style={styles.innerContainer}>
                    <View>
                        <Text style={styles.text} numberOfLines={1}>
                            {plannedTask.title}
                        </Text>
                        <View>
                            <Text style={styles.goalText} numberOfLines={1}>
                                goal: {plannedTask.quantity} {unitPretty}
                            </Text>
                            <Text style={styles.completedText} numberOfLines={1}>
                                completed: {plannedTask.completedQuantity} {unitPretty}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.timeIconContainer}>
                        {memoizedTimeOfDayImage}

                        <View>
                            {memoizedProgressSvg}

                            {/* SVG Icon */}
                            <View style={styles.svgProgress}>{memoizedHabitIcon}</View>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};
