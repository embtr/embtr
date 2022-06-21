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

export const FollowUserButton = ({ userProfileModel, onFollowUser, onUnfollowUser, following }: Props) => {
    const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(undefined);
    React.useEffect(() => {
        getCurrentUserUid(setCurrentUserId);
    }, []);

    return (
        <View>
            {following
                ? <EmbtrButton buttonText='Following' callback={() => {
                    FollowerController.unfollowUser(currentUserId!, userProfileModel.uid!, () => {
                        onUnfollowUser(userProfileModel.uid);
                    })
                }} />
                : <EmbtrButton buttonText='Follow' callback={() => {
                    FollowerController.followUser(currentUserId!, userProfileModel.uid!, () => {
                        onFollowUser(userProfileModel.uid);
                    })
                }} />}
        </View>
    );
}