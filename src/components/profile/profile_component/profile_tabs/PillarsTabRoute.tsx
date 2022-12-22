import { View } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { ProfilePillars } from '../pillar/ProfilePillars';

interface Props {
    userProfileModel: UserProfileModel;
}

function PillarsTabRoute({ userProfileModel }: Props) {
    return (
        <View>
            <ProfilePillars userProfileModel={userProfileModel} />
        </View>
    );
}

export default PillarsTabRoute;
