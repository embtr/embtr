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
import { isExtraWideDevice } from 'src/util/DeviceUtil';
import { User } from 'resources/schema';
import { HabitStreakCustomHooks } from 'src/controller/habit_streak/HabitStreakController';
import { PureDate } from 'resources/types/date/PureDate';
import { Constants } from 'resources/types/constants/constants';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { PremiumFeatureBadge } from 'src/components/common/PremiumFeatureBadge';

interface Props {
    user: User;
}

const getBackgroundColor = (completionState: Constants.CompletionState, colors: any) => {
    if (completionState === Constants.CompletionState.NO_SCHEDULE) {
        return colors.progress_bar_color;
    }

    if (completionState === Constants.CompletionState.COMPLETE) {
        return colors.progress_bar_complete;
    }

    if (completionState === Constants.CompletionState.FAILED) {
        return colors.progress_bar_failed;
    }

    if (completionState === Constants.CompletionState.SKIPPED) {
        return colors.progress_bar_skipped;
    }

    if (completionState === Constants.CompletionState.INCOMPLETE) {
        return colors.secondary_text;
    }

    return 'purple';
};

export const AdvancedHabitStreakWidget = ({ user }: Props) => {
    const { colors } = useTheme();
    const diameter = isExtraWideDevice() ? getWindowWidth() / 37.5 : 9;
    const padding = diameter / (isExtraWideDevice() ? 5 : 6);

    if (!user.id) {
        return <View />;
    }

    const habitStreak = HabitStreakCustomHooks.useAdvancedHabitStreak(user.id);

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
                        backgroundColor: getBackgroundColor(historyElement.result, colors),
                        height: diameter,
                        width: diameter,
                        borderRadius: 1,
                    }}
                />
            );
        }

        views.push(<View key={'group' + i}>{groupViews}</View>);
        if (i < 52) {
            views.push(<View key={'placeholder' + i} style={{ width: padding }} />);
        }
    }

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
                        {' '}
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
                        }}
                    >
                        {endDateFormatted}{' '}
                    </Text>
                </View>
            </View>
        </WidgetBase>
    );
};
