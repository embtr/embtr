import React from 'react';
import { View } from 'react-native';
import { WidgetBase } from './WidgetBase';
import { User } from 'resources/schema';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { OptimalImageData } from '../common/images/OptimalImage';
import { UserHabitStreakTier } from 'resources/types/dto/HabitStreak';
import { UserCustomHooks } from 'src/controller/user/UserController';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HabitStreakTierElement } from '../habit_streak/HabitStreakTierElement';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';

const getTitle = (isCurrentUser: boolean, isOnHabitStreak: boolean, currentStreak: number) => {
    let prefix = '';
    if (isCurrentUser) {
        prefix = "You're ";
    } else {
        prefix = ``;
    }

    const notOnStreakYet = currentStreak < 4;

    let postfix = '';
    if (notOnStreakYet) {
        postfix = 'Close to a ';
    } else {
        postfix = 'On a ';
    }

    if (isCurrentUser) {
        postfix = postfix.toLowerCase();
    }

    if (isOnHabitStreak && !notOnStreakYet) {
        postfix += `record `;
    }

    return prefix + postfix;
};

const getBody = (user: User, isCurrentUser: boolean, currentStreak: number) => {
    const notOnStreakYet = currentStreak < 4;

    if (notOnStreakYet) {
        const daysLeft = 4 - currentStreak;
        if (daysLeft === 1) {
            return 'Just one day away from lighting the fire!';
        }

        return `Only ${daysLeft} days away from lighting the fire!`;
    }

    if (!isCurrentUser) {
        return `${user.displayName} is on a ${currentStreak} day streak!`;
    }

    return `Currently on a ${currentStreak} day streak!`;
};

interface ImplProps {
    user: User;
    userHabitStreakTier: UserHabitStreakTier;
}

export const OnHabitStreakWidgetImpl = ({ user, userHabitStreakTier }: ImplProps) => {
    const navigation = useEmbtrNavigation();

    const isCurrentUser = getCurrentUid() === user.uid;
    const isOnHabitStreak =
        userHabitStreakTier.simpleHabitStreak.currentStreak ===
        userHabitStreakTier.simpleHabitStreak.longestStreak;
    const title = getTitle(
        isCurrentUser,
        isOnHabitStreak,
        userHabitStreakTier.simpleHabitStreak.currentStreak
    );
    const icon: OptimalImageData = {
        ...(userHabitStreakTier.habitStreakTier.badge?.icon ??
            userHabitStreakTier.habitStreakTier.icon),
    };

    const backgroundColor = userHabitStreakTier.habitStreakTier.backgroundColor ?? 'purple';

    return (
        <View>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate(Routes.HABIT_STREAK_TIER_SUMMARY);
                }}
            >
                <WidgetBase backgroundColor={backgroundColor}>
                    <HabitStreakTierElement
                        titlePrefix={title}
                        titlePostfix={'Habit Streak'}
                        note="learn more"
                        body={getBody(
                            user,
                            isCurrentUser,
                            userHabitStreakTier.simpleHabitStreak.currentStreak
                        )}
                        icon={icon}
                    />
                </WidgetBase>
            </TouchableOpacity>
        </View>
    );
};

interface Props {
    user: User;
}

export const OnHabitStreakWidget = ({ user }: Props) => {
    const userHabitStreakTier = UserCustomHooks.useUserHabitSreakTier(user.id ?? 0);
    if (!userHabitStreakTier.data) {
        return null;
    }

    return <OnHabitStreakWidgetImpl user={user} userHabitStreakTier={userHabitStreakTier.data} />;
};
