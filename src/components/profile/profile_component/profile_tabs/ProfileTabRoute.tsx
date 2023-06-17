import { View } from 'react-native';
import { DailyHistoryWidget } from 'src/components/widgets/daily_history/DailyHistoryWidget';
import { User } from 'resources/schema';
import { TodaysActivitiesWidget, WidgetSource } from 'src/components/widgets/TodaysTasksWidget';
import { HabitJourneyWidget } from 'src/components/widgets/habit_journey/HabitJourneyWidget';

interface Props {
    newUser: User;
}

export const ProfileTabRoute = ({ newUser }: Props) => {
    return (
        <View style={{ paddingBottom: 5 }}>
            <View style={{ paddingTop: 5 }}>
                {newUser.id && (
                    <View style={{ width: '100%' }}>
                        {<DailyHistoryWidget userId={newUser.id} />}
                    </View>
                )}
            </View>
            <View style={{ paddingTop: 6 }}>
                <TodaysActivitiesWidget user={newUser} source={WidgetSource.PROFILE} />
            </View>
            <View style={{ paddingTop: 6 }}>
                <HabitJourneyWidget user={newUser} />
            </View>
        </View>
    );
};
