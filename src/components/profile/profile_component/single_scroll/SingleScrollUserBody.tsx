import * as React from 'react';
import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { User } from 'resources/schema';
import { DailyHistoryWidget } from 'src/components/widgets/daily_history/DailyHistoryWidget';
import { TodaysActivitiesWidget, WidgetSource } from 'src/components/widgets/TodaysTasksWidget';
import { HabitJourneyWidget } from 'src/components/widgets/habit_journey/HabitJourneyWidget';

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
            <View style={{ height: '100%' }}>
                <View style={{ paddingTop: 5 }}>
                    <View style={{ width: '100%' }}>{<DailyHistoryWidget userId={user.id} />}</View>
                </View>

                <View style={{ paddingTop: 6 }}>
                    <TodaysActivitiesWidget user={user} source={WidgetSource.PROFILE} />
                </View>

                <View style={{ paddingTop: 6 }}>
                    <HabitJourneyWidget user={user} />
                </View>

                <View style={{ height: 10 }} />
            </View>
        </Screen>
    );
};
