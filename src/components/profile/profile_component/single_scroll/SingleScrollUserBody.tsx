import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { User } from 'resources/schema';
import { DailyHistoryWidget } from 'src/components/widgets/daily_history/DailyHistoryWidget';
import { TodaysActivitiesWidget, WidgetSource } from 'src/components/widgets/TodaysTasksWidget';
import { HabitJourneyWidget } from 'src/components/widgets/habit_journey/HabitJourneyWidget';
import { UserPostsWidget } from 'src/components/widgets/daily_history/UserPostsWidget';
import { UserDailyResultsWidget } from 'src/components/widgets/daily_history/UserDailyResultsWidget';
import { ActiveChallengesWidget } from 'src/components/widgets/challenges/ActiveChallengesWidget';
import { TrophyCaseWidget } from 'src/components/widgets/trophy_case/TrophyCaseWidget';
import React from 'react';
import { Context, DEFAULT_CONTEXT, UserUtility } from 'src/util/user/UserUtility';

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

    const [context, setContext] = React.useState<Context>(DEFAULT_CONTEXT);
    React.useEffect(() => {
        const fetch = async () => {
            const context = await UserUtility.fetch(user.id!);
            setContext(context);
        };

        fetch();
    }, []);

    return (
        <Screen>
            <View style={{ height: '100%' }}>
                <View style={{ paddingTop: 6 }}>
                    <View style={{ width: '100%' }}>{<DailyHistoryWidget userId={user.id} />}</View>
                </View>

                {context.completedChallenges.length > 0 && (
                    <View style={{ paddingTop: 6 }}>
                        {<TrophyCaseWidget completedChallenges={context.completedChallenges} />}
                    </View>
                )}

                <View style={{ paddingTop: 6 }}>
                    <HabitJourneyWidget user={user} />
                </View>

                <View style={{ paddingTop: 6 }}>
                    <TodaysActivitiesWidget user={user} source={WidgetSource.PROFILE} />
                </View>

                {context.activeChallenges.length > 0 && (
                    <View style={{ paddingTop: 6 }}>
                        <ActiveChallengesWidget challengeParticipation={context.activeChallenges} />
                    </View>
                )}

                <View style={{ paddingTop: 6 }}>
                    <View style={{ width: '100%' }}>{<UserPostsWidget userId={user.id} />}</View>
                </View>

                <View style={{ paddingTop: 6 }}>
                    <UserDailyResultsWidget userId={user.id} />
                </View>

                <View style={{ height: 10 }} />
            </View>
        </Screen>
    );
};
