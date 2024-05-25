import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import {
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
    PADDING_LARGE,
    CARD_SHADOW,
    POPPINS_MEDIUM,
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
import { PremiumBadge } from 'src/components/common/PremiumBadge';
import { UserService } from 'src/service/UserService';
import { PremiumController } from 'src/controller/PremiumController';
import UserController from 'src/controller/user/UserController';
import { HabitStreakWidget } from './HabitStreakWidget';

interface Props {
    user: User;
}

export const BasicHabitStreakWidget = ({ user }: Props) => {
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
                key={historyElement.dayKey + historyElement.result}
                style={{
                    backgroundColor:
                        historyElement.result === Constants.CompletionState.COMPLETE
                            ? colors.progress_bar_complete
                            : historyElement.result === Constants.CompletionState.NO_SCHEDULE
                                ? colors.progress_bar_color
                                : colors.progress_bar_failed,
                    height: diameter,
                    width: diameter,
                    borderRadius: 1,
                }}
            />
        );

        views.push(<View key={'placeholder' + i} style={{ flex: 1 }} />);
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

            <View
                style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: PADDING_LARGE,
                }}
            >
                <TouchableOpacity
                    onPress={async () => {
                        await UserController.runPremiumWorkflow(
                            'Reminder Notifications Settings Element'
                        );
                    }}
                    style={[
                        {
                            width: '65%',
                            flexDirection: 'row',
                            backgroundColor: colors.accent_color_light,
                            borderRadius: 5,
                            paddingHorizontal: 4,
                            paddingVertical: 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                        CARD_SHADOW,
                    ]}
                >
                    <View style={{ paddingRight: PADDING_SMALL / 2 }}>
                        <PremiumBadge size={18} white={true} />
                    </View>
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 12,
                            fontFamily: POPPINS_MEDIUM,
                            textAlign: 'center',
                            includeFontPadding: false,
                        }}
                    >
                        Unlock Premium Stats
                    </Text>
                </TouchableOpacity>
            </View>
        </WidgetBase>
    );
};
