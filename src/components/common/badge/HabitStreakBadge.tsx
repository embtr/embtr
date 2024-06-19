import { OptimalImage, OptimalImageData } from '../images/OptimalImage';

const badgeData: OptimalImageData = {
    localImage: 'PROFILE.HABIT_STREAK',
};

const badgeDataPurple: OptimalImageData = {
    localImage: 'PROFILE.HABIT_STREAK_PURPLE',
};

interface Props {
    size: number;
    isOnRecordHabitStreak: boolean;
}

export const HabitStreakBadge = ({ size, isOnRecordHabitStreak }: Props) => {
    return (
        <OptimalImage
            data={isOnRecordHabitStreak ? badgeData : badgeDataPurple}
            style={{
                left: 2,
                width: size,
                height: size,
                bottom: 0.5,
            }}
        />
    );
};
