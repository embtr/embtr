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
import { getCurrentUser, getLevelDetails, setLevelDetails } from 'src/redux/user/GlobalState';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { LevelController, LevelCustomHooks } from 'src/controller/level/LevelController';
import { UserPropertyUtil } from 'src/util/UserPropertyUtil';

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

const startPositiveNotes = [
    'is grinding',
    'is focused',
    'is on a roll',
    'is on fire',
    'is determined',
    'is motivated',
    'is pushing',
    'is on the move',
    'is thriving',
    'is on track',
    'is climbing',
];

const getBody = (
    pointsRemaining: number,
    progress: number,
    nextLevel: number,
    displayName?: string
) => {
    const commaSeparatedPointsRemaining = pointsRemaining.toLocaleString();

    const positiveNotes = progress < 75 ? beginningPositiveNotes : endPositiveNotes;
    //random index based on day of the month
    const randomPositiveNoteIndex = new Date().getDate() % positiveNotes.length;
    const positiveNote = positiveNotes[randomPositiveNoteIndex];
    const randomStartPositiveNoteIndex = new Date().getDate() % startPositiveNotes.length;
    const startPositiveNote = startPositiveNotes[randomStartPositiveNoteIndex];
    const gritRemaining =
        pointsRemaining < 1 ? '1 more Grit' : `${commaSeparatedPointsRemaining} more Grit`;

    const isCurrentUser = displayName === undefined;

    let body = '';
    if (!isCurrentUser) {
        body += `${displayName} ${startPositiveNote}, ${gritRemaining} to level up!`;
    } else {
        body += `${gritRemaining} until Level ${nextLevel}, ${positiveNote}`;
    }

    return body;
};

const getTitlePrefix = (displayName?: string) => {
    return displayName ? `${displayName} is ` : 'You are ';
};

interface ImplProps {
    levelDetails: LevelDetails;
    isCurrentUser: boolean;
    user: User;
}
const PointsWidgetImpl = ({ levelDetails, isCurrentUser, user }: ImplProps) => {
    const navigation = useEmbtrNavigation();
    const colors = useTheme().colors;

    const userIsBlacklisted = UserPropertyUtil.isSocialBlacklisted(user);
    if (userIsBlacklisted) {
        return null;
    }

    const level = levelDetails.level;
    const minPoints = level.minPoints ?? 0;
    const maxPoints = level.maxPoints ?? 0;
    const pointsInLevel = maxPoints - minPoints;
    const progress = ((levelDetails.points - minPoints) / pointsInLevel) * 100;
    const displayName = isCurrentUser ? undefined : user.displayName;

    const body = getBody(
        maxPoints - levelDetails.points,
        progress,
        (levelDetails.level.level ?? 0) + 1,
        displayName
    );
    const titlePrefix = getTitlePrefix(displayName);

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
                        titlePrefix={titlePrefix}
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
    const dispatch = useAppDispatch();
    const levelDetails = useAppSelector(getLevelDetails);
    const currentUser = useAppSelector(getCurrentUser);

    const fetchLevelDetails = async () => {
        const updatedLevelDetails = await LevelController.getLevelDetailsForUser(
            currentUser.id ?? 0
        );

        dispatch(setLevelDetails(updatedLevelDetails));
    };

    if (!levelDetails.level.maxPoints) {
        fetchLevelDetails();
        return null;
    }

    return <PointsWidgetImpl user={currentUser} isCurrentUser={true} levelDetails={levelDetails} />;
};

const OtherUserPointsWidget = ({ user }: Props) => {
    const levelDetails = LevelCustomHooks.useLevelDetails(user.id);

    if (!levelDetails.data) {
        return null;
    }

    return <PointsWidgetImpl user={user} isCurrentUser={false} levelDetails={levelDetails.data} />;
};

export const PointsWidget = ({ user }: Props) => {
    const isCurrentUser = getCurrentUid() === user.uid;
    return isCurrentUser ? <CurrentUserPointsWidget /> : <OtherUserPointsWidget user={user} />;
};
