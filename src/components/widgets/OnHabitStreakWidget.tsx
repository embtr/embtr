import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { PADDING_LARGE, POPPINS_MEDIUM } from 'src/util/constants';
import { User } from 'resources/schema';
import { HabitStreakUtil } from 'src/util/HabitStreakUtil';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { OptimalImage, OptimalImageData } from '../common/images/OptimalImage';
import { HabitStreakCustomHooks } from 'src/controller/habit_streak/HabitStreakController';
import { SimpleHabitStreak } from 'resources/types/dto/HabitStreak';

const optimalImageDataPurple: OptimalImageData = {
    localImage: 'PROFILE.HABIT_STREAK_PURPLE',
};

const optimalImageData: OptimalImageData = {
    localImage: 'PROFILE.HABIT_STREAK',
};

const optimalImageDataSmall: OptimalImageData = {
    localImage: 'PROFILE.HABIT_STREAK_SMALL',
};

const getTitle = (
    user: User,
    isCurrentUser: boolean,
    isOnHabitStreak: boolean,
    currentStreak: number
) => {
    let prefix = '';
    if (isCurrentUser) {
        prefix = "You're ";
    } else {
        prefix = ``;
    }

    let postfix = '';
    if (currentStreak < 4) {
        postfix = 'Close to a ';
    } else if (isOnHabitStreak) {
        postfix = `On a `;
    } else {
        postfix = 'On a ';
    }

    if (isCurrentUser) {
        postfix = postfix.toLowerCase();
    }

    if (isOnHabitStreak) {
        postfix += `record `;
    }

    return prefix + postfix;
};

const getBody = (
    user: User,
    isCurrentUser: boolean,
    isOnHabitStreak: boolean,
    currentStreak: number
) => {
    if (currentStreak < 4) {
        const daysLeft = 4 - currentStreak;
        if (daysLeft === 1) {
            return 'Just one more day to light the fire!';
        }

        return `Only ${daysLeft} days left to light the fire!`;
    }

    if (!isCurrentUser) {
        return `${user.displayName} is on a ${currentStreak} day streak!`;
    }

    return `Currently on a ${currentStreak} day streak!`;
};

const getIcon = (
    user: User,
    isCurrentUser: boolean,
    isOnHabitStreak: boolean,
    currentStreak: number
) => {
    if (currentStreak < 4) {
        return optimalImageDataSmall;
    }

    if (isOnHabitStreak) {
        return optimalImageData;
    }

    return optimalImageDataPurple;
};

const getBackgroundColor = (
    isCurrentUser: boolean,
    isOnRecordHabitStreak: boolean,
    currentStreak: number,
    colors: any
) => {
    if (currentStreak < 4) {
        return undefined;
    }

    if (isOnRecordHabitStreak) {
        return colors.habit_streak;
    }

    return colors.accent_color_dim;
};

interface Props {
    user: User;
    simpleHabitStreak: SimpleHabitStreak;
}

export const OnHabitStreakWidgetImpl = ({ user, simpleHabitStreak }: Props) => {
    const { colors } = useTheme();

    const isOnHabitStreak = HabitStreakUtil.isOnHabitStreak(simpleHabitStreak);
    const habitStreak = simpleHabitStreak.currentStreak;
    const isCurrentUser = getCurrentUid() === user.uid;
    const title = getTitle(user, isCurrentUser, isOnHabitStreak, habitStreak);
    const backgroundColor = getBackgroundColor(isCurrentUser, isOnHabitStreak, habitStreak, colors);
    const size = 40;

    return (
        <View>
            <WidgetBase backgroundColor={backgroundColor}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ paddingRight: PADDING_LARGE }}>
                        <View
                            style={{
                                height: size,
                                width: size,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <OptimalImage
                                data={getIcon(user, isCurrentUser, isOnHabitStreak, habitStreak)}
                                style={{ height: size / 1, width: size / 1 }}
                            />
                        </View>
                    </View>

                    <View>
                        <Text
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 16,
                            }}
                        >
                            {title}
                            <Text style={{ color: colors.accent_color_light }}>Habit Streak</Text>
                        </Text>

                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 12,
                            }}
                        >
                            {getBody(user, isCurrentUser, isOnHabitStreak, habitStreak)}
                        </Text>
                    </View>
                </View>
            </WidgetBase>
        </View>
    );
};

export const OnHabitStreakWidget = ({ user }: Props) => {
    const simpleHabitStreak = HabitStreakCustomHooks.useSimpleHabitStreak(user.id ?? 0);
    if (!simpleHabitStreak.data) {
        return null;
    }

    return <OnHabitStreakWidgetImpl user={user} simpleHabitStreak={simpleHabitStreak.data} />;
};
