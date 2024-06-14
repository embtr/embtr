import { User } from 'resources/schema';
import { AdvancedHabitStreakWidget } from './AdvancedHabitStreakWidget';
import { BasicHabitStreakWidget } from './BasicHabitStreakWidget';
import { UserService } from 'src/service/UserService';
import { Constants } from 'resources/types/constants/constants';
import { darkColors } from 'src/theme/ColorThemes';
import { HabitCustomHooks } from 'src/controller/habit/HabitController';
import { View } from 'react-native';

export namespace HabitStreak {
    export const getBackgroundColor = (completionState: Constants.CompletionState) => {
        const colors = darkColors;

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
            return 'rgba(223,223,223,.75)';
        }

        if (completionState === Constants.CompletionState.AWAY) {
            return colors.link;
        }

        return colors.progress_bar_color;
    };
}

interface Props {
    user: User;
    taskId?: number;
}

export const HabitStreakWidget = ({ user, taskId }: Props) => {
    const userIsPremium = UserService.userHasPremiumRole(user);

    const habit = HabitCustomHooks.useHabit(taskId ?? 0);
    if (taskId && !habit.data) {
        return <View />;
    }

    if (userIsPremium) {
        return <AdvancedHabitStreakWidget user={user} habit={habit.data} />;
    }

    return <BasicHabitStreakWidget user={user} habit={habit.data} />;
};
