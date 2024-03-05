import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { User } from 'resources/schema';
import { DailyHistoryWidget } from 'src/components/widgets/daily_history/DailyHistoryWidget';
import { TodaysActivitiesWidget, WidgetSource } from 'src/components/widgets/TodaysTasksWidget';
import { UserPostsWidget } from 'src/components/widgets/daily_history/UserPostsWidget';
import { UserDailyResultsWidget } from 'src/components/widgets/daily_history/UserDailyResultsWidget';
import React from 'react';
import { PADDING_LARGE } from 'src/util/constants';

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
                <View style={{ paddingTop: 6 }}>
                    <DailyHistoryWidget userId={user.id} />
                </View>

                <View style={{ paddingTop: PADDING_LARGE / 2 }}>
                    <TodaysActivitiesWidget user={user} source={WidgetSource.PROFILE} />
                </View>

                <View style={{ paddingTop: PADDING_LARGE / 2 }}>
                    <UserPostsWidget userId={user.id} />
                </View>

                <View style={{ paddingTop: PADDING_LARGE / 2 }}>
                    <UserDailyResultsWidget userId={user.id} />
                </View>

                <View style={{ height: PADDING_LARGE }} />
            </View>
        </Screen>
    );
};

{
    /* {context.completedChallenges.length > 0 && (
                    <View style={{ paddingTop: 6, paddingHorizontal: 12 }}>
                        {<TrophyCaseWidget completedChallenges={context.completedChallenges} />}
                    </View>
                )} */
}

{
    /* <View style={{ paddingTop: 12, paddingHorizontal: 12 }}>
                    <HabitJourneyWidget user={user} />
                </View> */
}

{
    /* {context.activeChallenges.length > 0 && (
                    <View style={{ paddingTop: TIMELINE_CARD_PADDING }}>
                        <ActiveChallengesWidget challengeParticipation={context.activeChallenges} />
                    </View>
                )} */
}
