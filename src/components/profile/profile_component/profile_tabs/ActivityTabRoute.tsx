import { View } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { DailyHistoryWidget } from 'src/components/widgets/daily_history/DailyHistoryWidget';
import { UpcomingGoalsWidget } from 'src/components/widgets/upcoming_goals/UpcomingGoalsWidget';
import { GoalModel } from 'src/controller/planning/GoalController';

interface Props {
    userProfileModel: UserProfileModel;
    history: string[];
    goals: GoalModel[];
}

export const ActivityTabRoute = ({ userProfileModel, history, goals }: Props) => {
    return (
        <View>
            <View style={{ width: '100%' }}>{userProfileModel?.uid && <DailyHistoryWidget history={history} uid={userProfileModel.uid} />}</View>

            <View style={{ width: '100%' }}>{userProfileModel?.uid && <UpcomingGoalsWidget goals={goals} />}</View>
        </View>
    );
};
