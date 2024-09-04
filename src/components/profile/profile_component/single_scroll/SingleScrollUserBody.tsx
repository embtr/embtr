import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { User } from 'resources/schema';
import { UserPostsWidget } from 'src/components/widgets/daily_history/UserPostsWidget';
import { UserDailyResultsWidget } from 'src/components/widgets/daily_history/UserDailyResultsWidget';
import React from 'react';
import { PADDING_LARGE, PADDING_MEDIUM } from 'src/util/constants';
import { ActiveChallengesWidget } from 'src/components/widgets/challenges/ActiveChallengesWidget';
import { TrophyCaseWidget } from 'src/components/widgets/trophy_case/TrophyCaseWidget';
import { HabitStreakWidget } from 'src/components/widgets/habit_streak/HabitStreakWidget';
import { AwayModeWidget } from 'src/components/widgets/AwayModeWidget';
import { OnHabitStreakWidget } from 'src/components/widgets/OnHabitStreakWidget';
import { PointsWidget } from 'src/components/widgets/PointsWidget';
import { SocialBlacklistWidget } from 'src/components/widgets/SocialBlacklistWidget';

interface Props {
    user: User;
    setHeight: Function;
}

export const SingleScrollUserBody = ({ user, setHeight }: Props) => {
    if (!user.id) {
        return (
            <Screen>
                <View style={{ height: '100%' }} />
            </Screen>
        );
    }

    return (
        <Screen>
            <View style={{ height: '100%', paddingHorizontal: PADDING_LARGE }}>
                <View style={{ height: PADDING_MEDIUM }} />
                <SocialBlacklistWidget user={user} />
                <AwayModeWidget user={user} />
                <PointsWidget user={user} />
                <OnHabitStreakWidget user={user} />
                <HabitStreakWidget user={user} />
                <TrophyCaseWidget userId={user.id} />
                <ActiveChallengesWidget userId={user.id ?? 0} />
                <UserPostsWidget userId={user.id} />
                <UserDailyResultsWidget userId={user.id} />
            </View>
        </Screen>
    );
};
