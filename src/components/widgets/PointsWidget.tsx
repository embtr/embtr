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

const getBody = (levelDetails: LevelDetails) => {
    const pointsRemaining = levelDetails.pointsToNextLevel;
    return `${pointsRemaining} more Grit until next level, keep grinding!`;
};

interface ImplProps {
    levelDetails: LevelDetails;
}

export const PointsWidgetImpl = ({ levelDetails }: ImplProps) => {
    console.log('levelDetails', levelDetails);
    const navigation = useEmbtrNavigation();

    const colors = useTheme().colors;
    const level = levelDetails.level;
    const body = getBody(levelDetails);
    const icon = levelDetails.icon ?? { localImage: 'GENERAL.POINTS_LEVEL_1' };

    return (
        <View>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate(Routes.HABIT_STREAK_TIER_SUMMARY);
                }}
            >
                <WidgetBase>
                    <HabitStreakTierElement
                        titlePrefix={'You are '}
                        titlePostfix={`Level ${level}`}
                        note="view leaderboard"
                        body={body}
                        icon={icon}
                    />

                    <View style={{ paddingTop: PADDING_LARGE }}>
                        <ProgressBar progress={80} color={colors.accent_color} />
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
