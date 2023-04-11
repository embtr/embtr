import * as React from 'react';
import { View } from 'react-native';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import { UserProfileModel } from 'src/model/OldModels';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';

interface Props {
    userProfileModel: UserProfileModel;
    onFollowUser: Function;
    onUnfollowUser: Function;
    following: boolean;
}

export const FollowUserButton = ({ userProfileModel, onFollowUser, onUnfollowUser, following }: Props) => {
    const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(undefined);
    React.useEffect(() => {
        getCurrentUserUid(setCurrentUserId);
    }, []);

    return <View>{following ? <EmbtrButton buttonText="Following" callback={() => {}} /> : <EmbtrButton buttonText="Follow" callback={() => {}} />}</View>;
};
