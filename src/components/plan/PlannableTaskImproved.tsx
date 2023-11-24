import { View, Text, ViewStyle, TextStyle } from 'react-native';
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
import Svg, { Circle } from 'react-native-svg';

interface Props {
    plannedTask: PlannedTask;
}

interface Styles {
    container: ViewStyle;
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
            padding: TIMELINE_CARD_PADDING / 2,
            borderRadius: 5,
            width: '100%',
            flexDirection: 'row',
            ...CARD_SHADOW,
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
            flex: 1
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
        return prevProps.plannedTask.title === nextProps.plannedTask.title;
    }
);

export const PlannableTaskImproved = ({ plannedTask }: Props) => {
    const { colors } = useTheme();
    const styles = generateStyles(colors);

    // Calculate the circumference of the circle
    const radius = 13;
    const progress = ((plannedTask.completedQuantity ?? 0) / (plannedTask.quantity ?? 1)) * 100;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - progress / 100);

    const unitPretty = plannedTask.unit
        ? UnitUtility.getReadableUnit(plannedTask.unit, plannedTask.quantity ?? 0)
        : '';

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.text} numberOfLines={1}>
                    {plannedTask.title}
                </Text>
                <View>
                    <View style={styles.goalText}>
                        <Text numberOfLines={1}>
                            goal: {plannedTask.quantity} {unitPretty}
                        </Text>
                    </View>
                    <View style={styles.completedText}>
                        <Text numberOfLines={1}>
                            completed: {plannedTask.completedQuantity} {unitPretty}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.timeIconContainer}>
                <CachedImage
                    uri={TimeOfDayUtility.getTimeOfDayIcon(plannedTask.timeOfDay)}
                    style={styles.svgIcon}
                />

                <View>
                    <Svg width={28} height={28} transform={[{ rotate: '-90deg' }]}>
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
                    <View style={styles.svgProgress}>
                        <CachedImage
                            style={{
                                width: 15,
                                height: 15,
                            }}
                            uri={plannedTask.iconUrl ?? ''}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};
