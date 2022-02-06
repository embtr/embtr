import * as React from 'react';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import ExploreController, { ChallengeModel as ChallengeModel } from 'src/controller/explore/ExploreController';
import { ExploreTabScreens } from 'src/navigation/RootStackParamList';
import { getAuth } from 'firebase/auth';
import { Comments } from 'src/components/common/comments/Comments';

export const ChallengeComments = () => {
    const route = useRoute<RouteProp<ExploreTabScreens, 'ChallengeComments'>>();

    const [challengeModel, setChallengeModel] = React.useState<ChallengeModel | undefined>(undefined);

    useFocusEffect(
        React.useCallback(() => {
            ExploreController.getChallenge(route.params.id, setChallengeModel);
        }, [])
    );

    const submitComment = (text: string) => {
        const user = getAuth().currentUser;
        if (challengeModel?.id && user?.uid) {
            ExploreController.addComment(challengeModel.id, user.uid, text, () => {
                ExploreController.getChallenge(route.params.id, setChallengeModel);
            });
        }
    };

    return (
        <Comments
            title={challengeModel?.title ? challengeModel.title : ""}
            comments={challengeModel?.comments ? challengeModel?.comments : []}
            submitComment={submitComment}
        />
    )
}