import { View } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { DailyHistoryWidget } from 'src/components/widgets/daily_history/DailyHistoryWidget';
import { UpcomingGoalsWidget } from 'src/components/widgets/upcoming_goals/UpcomingGoalsWidget';
import { GoalModel } from 'src/controller/planning/GoalController';
import { PillarsWidget } from 'src/components/widgets/pillars/PillarsWidget';
import { PillarModel } from 'src/model/PillarModel';
import { UserModel } from 'src/controller/user/UserController';
import { User } from 'resources/schema';

interface Props {
    user: UserModel;
    userProfileModel: UserProfileModel;
    newUser: User;
    history: string[];
    goals: GoalModel[];
    pillars: PillarModel[];
}

export const ProfileTabRoute = ({ user, userProfileModel, newUser, goals, pillars }: Props) => {
    return (
        <View style={{ paddingBottom: 5 }}>
            {newUser.id && <View style={{ width: '100%' }}>{userProfileModel?.uid && <DailyHistoryWidget userId={newUser.id} />}</View>}
            <View style={{ width: '100%' }}>{userProfileModel?.uid && <UpcomingGoalsWidget user={user} goals={goals} />}</View>
            <View style={{ width: '100%' }}>{userProfileModel?.uid && <PillarsWidget user={user} pillars={pillars} />}</View>
        </View>
    );
};
