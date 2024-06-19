import { User } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';
import { SimpleHabitStreak } from 'resources/types/dto/HabitStreak';

export class HabitStreakUtil {
    public static isOnHabitStreak(simpleHabitStreak: SimpleHabitStreak): boolean {
        const longestStreak = simpleHabitStreak.longestStreak;
        const currentStreak = simpleHabitStreak.currentStreak;

        if (longestStreak === 0 && currentStreak === 0) {
            return false;
        }

        return currentStreak >= longestStreak;
    }

    public static getHabitStreak(user: User, habitId: number): number {
        return this.getStreak(user, Constants.HabitStreakType.CURRENT, habitId);
    }

    private static getStreak(user: User, type: Constants.HabitStreakType, habitId: number) {
        for (const streak of user.habitStreaks ?? []) {
            if (streak.taskId === habitId && streak.type === type) {
                return streak.streak ?? 0;
            }
        }

        return 0;
    }
}
