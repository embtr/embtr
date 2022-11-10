import { View } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { DailyHistoryWidget } from 'src/components/widgets/daily_history/DailyHistoryWidget';
import { UpcomingGoalsWidget } from 'src/components/widgets/upcoming_goals/UpcomingGoalsWidget';
import { GoalModel } from 'src/controller/planning/GoalController';
import { PillarsWidget } from 'src/components/widgets/pillars/PillarsWidget';
import { PillarModel } from 'src/model/PillarModel';

interface Props {
    userProfileModel: UserProfileModel;
    history: string[];
    goals: GoalModel[];
    pillars: PillarModel[];
}

export const ActivityTabRoute = ({ userProfileModel, history, goals, pillars }: Props) => {
    return (
        <View>
            <View style={{ width: '100%' }}>{userProfileModel?.uid && <DailyHistoryWidget history={history} />}</View>
            <View style={{ width: '100%' }}>{userProfileModel?.uid && <UpcomingGoalsWidget goals={goals} />}</View>
            <View style={{ width: '100%' }}>{userProfileModel?.uid && <PillarsWidget pillars={pillars} />}</View>
        </View>
    );
};
