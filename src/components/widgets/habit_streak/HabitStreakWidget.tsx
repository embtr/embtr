import { User } from 'resources/schema';
import { UserCustomHooks } from 'src/controller/user/UserController';
import { AdvancedHabitStreakWidget } from './AdvancedHabitStreakWidget';
import { BasicHabitStreakWidget } from './BasicHabitStreakWidget';

interface Props {
    user: User;
}

export const HabitStreakWidget = ({ user }: Props) => {
    const userIsPremium = UserCustomHooks.useUserIsPremium();

    if (userIsPremium) {
        return <AdvancedHabitStreakWidget user={user} />;
    }

    return <BasicHabitStreakWidget user={user} />;
};
