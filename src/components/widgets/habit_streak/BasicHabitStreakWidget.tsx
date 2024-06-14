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
import { HabitStreak } from './HabitStreakWidget';
import { UpgradeToPremiumButton } from 'src/components/common/button/UpgradeToPremiumButton';
import { UserCustomHooks } from 'src/controller/user/UserController';

interface Props {
    user: User;
    habit?: Task;
}

export const BasicHabitStreakWidget = ({ user, habit }: Props) => {
    const { colors } = useTheme();
    const padding = (getWindowWidth() - PADDING_LARGE * 4) / 30 / 6;
    const diameter = padding * 5;

    if (!user.id) {
        return null;
    }

    const isCurrentUser = UserCustomHooks.useIsCurrentUser(user);

    const habitStreak = habit
        ? HabitStreakCustomHooks.useHabitStreakForHabit(user.id, habit.id ?? 0)
        : HabitStreakCustomHooks.useHabitStreak(user.id);

    useFocusEffect(
        React.useCallback(() => {
            habitStreak.refetch();
        }, [])
    );

    if (!habitStreak.data) {
        return <View />;
    }

    let views: JSX.Element[] = [];
    for (let i = 0; i < habitStreak.data.results.length; i++) {
        const historyElement = habitStreak.data.results[i];

        views.push(
            <View
                key={historyElement.dayKey + historyElement.result}
                style={{
                    backgroundColor: HabitStreak.getBackgroundColor(historyElement.result),
                    height: diameter,
                    width: diameter,
                    borderRadius: 1,
                }}
            />
        );

        views.push(<View key={'placeholder' + i} style={{ width: padding }} />);
    }

    // remove the last placeholder
    views.pop();

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
            <View style={{ flexDirection: 'row' }}>
                <Text
                    style={{
                        color: colors.text,
                        fontFamily: POPPINS_SEMI_BOLD,
                        fontSize: 15,
                        includeFontPadding: false,
                        textAlign: 'center',
                        lineHeight: 17,
                    }}
                >
                    Habit Streak
                </Text>
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    paddingTop: PADDING_LARGE,
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

            {isCurrentUser && (
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: PADDING_LARGE,
                        paddingBottom: PADDING_SMALL / 2,
                    }}
                >
                    <UpgradeToPremiumButton source="Basic Habit Streak" />
                </View>
            )}
        </WidgetBase>
    );
};
