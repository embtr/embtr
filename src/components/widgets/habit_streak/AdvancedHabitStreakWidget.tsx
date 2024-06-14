import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import {
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
    PADDING_LARGE,
    PADDING_SMALL,
} from 'src/util/constants';
import { getWindowWidth } from 'src/util/GeneralUtility';
import { Task, User } from 'resources/schema';
import { HabitStreakCustomHooks } from 'src/controller/habit_streak/HabitStreakController';
import { PureDate } from 'resources/types/date/PureDate';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { PremiumFeatureBadge } from 'src/components/common/PremiumFeatureBadge';
import { HabitStreak } from './HabitStreakWidget';

interface Props {
    user: User;
    habit?: Task;
}

export const AdvancedHabitStreakWidget = ({ user, habit }: Props) => {
    const { colors } = useTheme();
    const padding = (getWindowWidth() - PADDING_LARGE * 4) / 30 / 6;
    const diameter = padding * 5;

    if (!user.id) {
        return <View />;
    }

    const habitStreak = habit
        ? HabitStreakCustomHooks.useAdvancedHabitStreakForHabit(user.id, habit.id ?? 0)
        : HabitStreakCustomHooks.useAdvancedHabitStreak(user.id);

    useFocusEffect(
        React.useCallback(() => {
            habitStreak.refetch();
        }, [])
    );

    if (!habitStreak.data) {
        return <View />;
    }

    let views: JSX.Element[] = [];

    // group habitStreak.data.results groups of 7
    const groupedResults = [];
    let group = [];
    for (let i = 0; i < habitStreak.data.results.length; i++) {
        group.push(habitStreak.data.results[i]);
        if (group.length === 7) {
            groupedResults.push(group);
            group = [];
        }
    }
    groupedResults.push(group);

    for (let i = 0; i < groupedResults.length; i++) {
        const group = groupedResults[i];
        const groupViews: JSX.Element[] = [];
        for (let j = 0; j < group.length; j++) {
            const historyElement = group[j];

            groupViews.push(
                <View
                    key={historyElement.dayKey + historyElement.result}
                    style={{
                        marginTop: padding,
                        backgroundColor: HabitStreak.getBackgroundColor(historyElement.result),
                        height: diameter,
                        width: diameter,
                        borderRadius: 1,
                    }}
                />
            );
        }

        views.push(<View key={'group' + i}>{groupViews}</View>);
        views.push(<View key={'placeholder' + i} style={{ width: padding }} />);
    }

    // remove the last placeholder
    views.pop();

    const dayLabels = (
        <View>
            <View style={{ height: diameter + padding }}>
                <Text
                    style={{
                        fontSize: 8,
                        fontFamily: POPPINS_REGULAR,
                        color: colors.secondary_text,
                        paddingRight: PADDING_SMALL / 2,
                    }}
                >
                    Mon
                </Text>
            </View>

            <View style={{ height: diameter + padding }} />
            <View style={{ height: diameter + padding }}>
                <Text
                    style={{
                        fontSize: 8,
                        fontFamily: POPPINS_REGULAR,
                        color: colors.secondary_text,
                        paddingRight: PADDING_SMALL / 2,
                    }}
                >
                    Wed
                </Text>
            </View>

            <View style={{ height: diameter + padding }} />
            <View style={{ height: diameter + padding }}>
                <Text
                    style={{
                        fontSize: 8,
                        fontFamily: POPPINS_REGULAR,
                        color: colors.secondary_text,
                        paddingRight: PADDING_SMALL / 2,
                    }}
                >
                    Fri
                </Text>
            </View>

            <View style={{ height: diameter + padding }} />
            <View style={{ height: diameter + padding }}>
                <Text
                    style={{
                        fontSize: 8,
                        fontFamily: POPPINS_REGULAR,
                        color: colors.secondary_text,
                        paddingRight: PADDING_SMALL / 2,
                    }}
                >
                    Sun
                </Text>
            </View>
        </View>
    );

    views.unshift(dayLabels);

    const getPrettyDate = (pureDate: PureDate) => {
        if (!pureDate) {
            return '';
        }

        const month = pureDate.getMonth();
        const day = pureDate.getDay();
        return `${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`;
    };

    const currentStreak = habitStreak.data.currentStreak;
    const longestStreak = habitStreak.data.longestStreak;

    const startDateFormatted = getPrettyDate(habitStreak.data.startDate);
    const medianDateFormatted = getPrettyDate(habitStreak.data.medianDate);
    const endDateFormatted = getPrettyDate(habitStreak.data.endDate);

    return (
        <WidgetBase>
            <View
                style={{
                    bottom: PADDING_SMALL,
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                        color: colors.text,
                        fontFamily: POPPINS_SEMI_BOLD,
                        fontSize: 15,
                        includeFontPadding: false,
                        textAlign: 'center',
                    }}
                >
                    Habit Streak
                </Text>
                <View style={{ flex: 1 }} />
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <PremiumFeatureBadge />
                </View>
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    paddingTop: PADDING_SMALL,
                }}
            >
                <View>
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 12,
                            lineHeight: 14,
                            bottom: 3,
                        }}
                    >
                        longest streak:
                        <Text
                            style={{
                                color: colors.accent_color_light,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 12,
                            }}
                        >
                            {' '}
                            {longestStreak} {longestStreak == 1 ? 'day' : 'days'}
                        </Text>
                    </Text>
                </View>
                <View style={{ flex: 1 }} />
                <View>
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 12,
                            lineHeight: 14,
                            bottom: 3,
                        }}
                    >
                        current streak:
                        <Text
                            style={{
                                color: colors.accent_color_light,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 12,
                            }}
                        >
                            {' '}
                            {currentStreak} {currentStreak == 1 ? 'day' : 'days'}
                        </Text>
                    </Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', paddingTop: PADDING_LARGE / 4 }}>{views}</View>

            <View style={{ flexDirection: 'row', paddingTop: 1 }}>
                <View style={{ flex: 1, paddingTop: 2 }}>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 8,
                        }}
                    >
                        {/* using transparent color for text alignment */}
                        <Text
                            style={{
                                color: 'transparent',
                                paddingRight: padding,
                            }}
                        >
                            {' Wed'}
                        </Text>

                        {startDateFormatted}
                    </Text>
                </View>

                <View style={{ flex: 1, paddingTop: 2, alignItems: 'center' }}>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 8,
                        }}
                    >
                        {' '}
                        {medianDateFormatted}
                    </Text>
                </View>

                {/* date on the right */}
                <View style={{ flex: 1, paddingTop: 2, alignItems: 'flex-end' }}>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 8,
                            paddingRight: padding * 2.5,
                        }}
                    >
                        {endDateFormatted}
                    </Text>
                </View>
            </View>
        </WidgetBase>
    );
};
