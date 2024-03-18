import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD, PADDING_LARGE } from 'src/util/constants';
import { getWindowWidth } from 'src/util/GeneralUtility';
import { isExtraWideDevice } from 'src/util/DeviceUtil';
import { User } from 'resources/schema';
import { HabitStreakCustomHooks } from 'src/controller/habit_streak/HabitStreakController';
import { PureDate } from 'resources/types/date/PureDate';
import { Constants } from 'resources/types/constants/constants';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

interface Props {
    user: User;
}

export const HabitStreakWidget = ({ user }: Props) => {
    const { colors } = useTheme();
    const diameter = isExtraWideDevice() ? getWindowWidth() / 37.5 : 9;

    if (!user.id) {
        return <View />;
    }

    const habitStreak = HabitStreakCustomHooks.useHabitStreak(user.id);

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
                key={i}
                style={{
                    backgroundColor:
                        historyElement.result === Constants.CompletionState.COMPLETE
                            ? colors.progress_bar_complete
                            : historyElement.result === Constants.CompletionState.INVALID
                                ? colors.progress_bar_color
                                : colors.progress_bar_failed,
                    height: diameter,
                    width: diameter,
                    borderRadius: 1,
                }}
            />
        );

        views.push(<View style={{ flex: 1 }} />);
    }
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
                        lineHeight: 17,
                        bottom: 2,
                    }}
                >
                    Habit Streak
                </Text>
            </View>

            <View
                style={{
                    flexDirection: 'row',
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
                                paddingTop: 5,
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
                                paddingTop: 5,
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
