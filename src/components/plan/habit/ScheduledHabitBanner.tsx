import { Banner } from 'src/components/common/Banner';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';

interface Props {
    isCreateCustomHabit: boolean;
    isCreatedNewScheduledHabit: boolean;
    onArchiveSheduledHabit: () => void;
    onLeaveChallenge: () => void;
}

export const ScheduledHabitBanner = ({
    isCreateCustomHabit,
    isCreatedNewScheduledHabit,
    onArchiveSheduledHabit,
    onLeaveChallenge,
}: Props) => {
    const navigation = useEmbtrNavigation();
    const { colors } = useTheme();
    const { isChallenge } = useCreateEditScheduleHabit();

    const getRightText = () => {
        if (isChallenge) {
            return 'leave';
        }

        if (isCreateCustomHabit) {
            return 'discover';
        }

        if (!isCreatedNewScheduledHabit) {
            return 'archive';
        }

        return '';
    };

    const onRightClick = () => {
        if (isChallenge) {
            onLeaveChallenge();
        } else if (isCreateCustomHabit) {
            navigation.navigate(Routes.ADD_HABIT_CATEGORIES);
        } else if (!isCreatedNewScheduledHabit) {
            onArchiveSheduledHabit();
        }
    };

    const getBannerName = () => {
        if (isChallenge) {
            return 'Edit Challenge';
        }

        return 'Schedule Habit';
    };

    return (
        <Banner
            name={getBannerName()}
            leftRoute={'BACK'}
            leftIcon={'arrow-back'}
            rightText={getRightText()}
            rightColor={isCreateCustomHabit ? colors.link : colors.archive}
            rightOnClick={onRightClick}
        />
    );
};
