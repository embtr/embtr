import { View } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { DailyHistoryWidget } from 'src/components/widgets/daily_history/DailyHistoryWidget';
import { UpcomingGoalsWidget } from 'src/components/widgets/upcoming_goals/UpcomingGoalsWidget';

interface Props {
    userProfileModel: UserProfileModel;
    refreshedTimestamp: Date;
}

export const ActivityTabRoute = ({ userProfileModel, refreshedTimestamp }: Props) => {
    return (
        <View>
            <View style={{ width: '100%' }}>{userProfileModel?.uid && <DailyHistoryWidget uid={userProfileModel.uid} />}</View>

            <View style={{ width: '100%' }}>
                {userProfileModel?.uid && <UpcomingGoalsWidget uid={userProfileModel.uid} refreshedTimestamp={refreshedTimestamp} />}
            </View>
        </View>
    );
};
