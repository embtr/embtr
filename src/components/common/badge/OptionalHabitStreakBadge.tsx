import { User } from 'resources/schema';
import { HabitStreakBadge } from './HabitStreakBadge';
import { View } from 'react-native';
import { HabitStreakCustomHooks } from 'src/controller/habit_streak/HabitStreakController';

interface ImpleProps {
    size: number;
    isOnRecordHabitStreak: boolean;
}

export const OptionalHabitStreakBadgeImpl = ({ size, isOnRecordHabitStreak }: ImpleProps) => {
    return <HabitStreakBadge size={size} isOnRecordHabitStreak={isOnRecordHabitStreak} />;
};

interface Props {
    user: User;
    size: number;
    white?: boolean;
}

export const OptionalHabitStreakBadge = ({ user, size }: Props) => {
    const habitStreakSimple = HabitStreakCustomHooks.useSimpleHabitStreak(user.id ?? 0);

    if (!habitStreakSimple.data) {
        return <View />;
    }

    const isOnHabitStreak = habitStreakSimple.data.currentStreak > 3;
    if (!isOnHabitStreak) {
        return <View />;
    }

    const isOnRecordHabitStreak =
        habitStreakSimple.data.currentStreak === habitStreakSimple.data.longestStreak;

    return (
        <OptionalHabitStreakBadgeImpl size={size} isOnRecordHabitStreak={isOnRecordHabitStreak} />
    );
};
