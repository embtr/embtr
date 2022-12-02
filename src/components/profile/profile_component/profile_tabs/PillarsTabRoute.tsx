import { Pillars } from 'src/components/profile/profile_component/pillar/Pillars';
import { View } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

interface Props {
    userProfileModel: UserProfileModel;
}

function PillarsTabRoute({ userProfileModel }: Props) {
    return (
        <View>
            <Pillars userProfileModel={userProfileModel} />
        </View>
    );
}

export default PillarsTabRoute;
