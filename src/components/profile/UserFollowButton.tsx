import * as React from 'react';
import { View } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import FollowerController from 'src/controller/follower/FollowerController';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';

interface Props {
    userProfileModel: UserProfileModel,
    onFollowUser: Function,
    onUnfollowUser: Function,
    following: boolean
}

export const UserFollowButton = ({ userProfileModel, onFollowUser, onUnfollowUser, following }: Props) => {
    const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        getCurrentUserUid(setCurrentUserId);
    }, []);
    
    if (currentUserId === undefined || currentUserId === userProfileModel.uid) {
        return <View />
    }

    return (
        <View>
            {following
                ? <EmbtrButton buttonText='following' size='small' callback={() => {
                    FollowerController.unfollowUser(currentUserId!, userProfileModel.uid!, () => {
                        onUnfollowUser(userProfileModel.uid);
                    })
                }} />
                : <EmbtrButton buttonText='follow' size='small' callback={() => {
                    FollowerController.followUser(currentUserId!, userProfileModel.uid!, () => {
                        onFollowUser(userProfileModel.uid);
                    })
                }} />}
        </View>
    );
}