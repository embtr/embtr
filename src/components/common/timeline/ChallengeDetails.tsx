import * as React from 'react';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { getAuth } from 'firebase/auth';
import { Comments } from 'src/components/common/comments/Comments';
import ChallengeController, { ChallengeModel1 } from 'src/controller/timeline/challenge/ChallengeController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import NotificationController, { NotificationType } from 'src/controller/notification/NotificationController';

export const ChallengeDetails = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'ChallengeDetails'>>();

    const [challengeModel, setChallengeModel] = React.useState<ChallengeModel1 | undefined>(undefined);

    useFocusEffect(
        React.useCallback(() => {
            ChallengeController.getChallenge(route.params.id, setChallengeModel);
        }, [])
    );

    const submitComment = (text: string, taggedUsers: UserProfileModel[]) => {
        const user = getAuth().currentUser;
        if (challengeModel?.id && user?.uid) {
            ChallengeController.addComment(challengeModel.id, user.uid, text, () => {
                NotificationController.addNotifications(getAuth().currentUser!.uid, taggedUsers, NotificationType.CHALLENGE_COMMENT, route.params.id);
                ChallengeController.getChallenge(route.params.id, setChallengeModel);
            });
        }
    };

    return (
        <Comments
            title={challengeModel?.data.title ? challengeModel.data.title : ""}
            comments={challengeModel?.public.comments ? challengeModel?.public.comments : []}
            submitComment={submitComment}
        />
    )
}
