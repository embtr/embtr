import React from 'react';
import { View } from 'react-native';
import { WidgetBase } from './WidgetBase';
import { User } from 'resources/schema';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HabitStreakTierElement } from '../habit_streak/HabitStreakTierElement';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import { ProgressBar } from '../plan/goals/ProgressBar';
import { PADDING_LARGE } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';
import { LevelDetails } from 'resources/types/dto/Level';
import { getLevelDetails } from 'src/redux/user/GlobalState';
import { useAppSelector } from 'src/redux/Hooks';
import { LevelCustomHooks } from 'src/controller/level/LevelController';

const beginningPositiveNotes = [
    'keep grinding!',
    'you are doing great!',
    'stay strong!',
    'you got this!',
    'keep pushing!',
    'you are unstoppable!',
    'keep it up!',
    'don’t give up!',
    'stay focused!',
    'keep the momentum!',
    'you’re on fire!',
    'stay determined!',
    'keep your eyes on the prize!',
    'keep climbing!',
    'keep fighting!',
    'stay motivated!',
    'keep striving!',
    'stay on track!',
];

const endPositiveNotes = [
    "you're almost there!",
    'nearly there!',
    'so close!',
    'just a bit more!',
    'almost at the finish line!',
    'almost done!',
    'final push!',
    'almost complete!',
    'almost finished!',
    'almost leveled up!',
    'the end is in sight!',
    'just a little more!',
    'so close to the end!',
    'the finish line is near!',
    'almost there, keep going!',
    'final stretch!',
];

const getBody = (pointsRemaining: number, progress: number, nextLevel: number) => {
    const positiveNotes = progress < 75 ? beginningPositiveNotes : endPositiveNotes;
    //random index based on day of the month
    const randomIndex = new Date().getDate() % positiveNotes.length;
    const positiveNote = positiveNotes[randomIndex];

    return `${pointsRemaining} more Grit until Level ${nextLevel}, ${positiveNote}`;
};

interface ImplProps {
    levelDetails: LevelDetails;
}
const PointsWidgetImpl = ({ levelDetails }: ImplProps) => {
    const navigation = useEmbtrNavigation();

    const colors = useTheme().colors;
    const level = levelDetails.level;
    const minPoints = level.minPoints ?? 0;
    const maxPoints = level.maxPoints ?? 0;
    const pointsInLevel = maxPoints - minPoints;
    const progress = ((levelDetails.points - minPoints) / pointsInLevel) * 100;
    const body = getBody(
        maxPoints - levelDetails.points,
        progress,
        (levelDetails.level.level ?? 0) + 1
    );
    const icon = level.badge?.icon ?? { localImage: 'GENERAL.POINTS_LEVEL_1' };

    return (
        <View>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate(Routes.LEVEL_SUMMARY);
                }}
            >
                <WidgetBase>
                    <HabitStreakTierElement
                        titlePrefix={'You are '}
                        titlePostfix={`Level ${level.level}`}
                        note="learn more"
                        body={body}
                        icon={icon}
                    />

                    <View style={{ paddingTop: PADDING_LARGE }}>
                        <ProgressBar
                            progress={progress}
                            stage={level.level}
                            color={colors.accent_color}
                        />
                    </View>
                </WidgetBase>
            </TouchableOpacity>
        </View>
    );
};

interface Props {
    user: User;
}

const CurrentUserPointsWidget = () => {
    const levelDetails = useAppSelector(getLevelDetails);
    return <PointsWidgetImpl levelDetails={levelDetails} />;
};

const OtherUserPointsWidget = ({ user }: Props) => {
    const levelDetails = LevelCustomHooks.useLevelDetails(user.id);

    if (!levelDetails.data) {
        return null;
    }

    return <PointsWidgetImpl levelDetails={levelDetails.data} />;
};

export const PointsWidget = ({ user }: Props) => {
    const isCurrentUser = getCurrentUid() === user.uid;
    return isCurrentUser ? <CurrentUserPointsWidget /> : <OtherUserPointsWidget user={user} />;
};
