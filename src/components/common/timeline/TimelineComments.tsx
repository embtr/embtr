import * as React from 'react';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import ExploreController, { ChallengeModel as ChallengeModel } from 'src/controller/explore/ExploreController';
import { ExploreTabScreens } from 'src/navigation/RootStackParamList';
import { getAuth } from 'firebase/auth';
import { Comments } from 'src/components/common/comments/Comments';
import StoryController, { StoryModel } from 'src/controller/story/StoryController';

export const TimelineComments = () => {
    const route = useRoute<RouteProp<ExploreTabScreens, 'ChallengeComments'>>();

    const [storyModel, setStoryModel] = React.useState<StoryModel | undefined>(undefined);

    useFocusEffect(
        React.useCallback(() => {
            StoryController.getStory(route.params.id, setStoryModel);
        }, [])
    );

    const submitComment = (text: string) => {
        const user = getAuth().currentUser;
        alert("sending: " + text);
        //if (challengeModel?.id && user?.uid) {
        //    ExploreController.addComment(challengeModel.id, user.uid, text, () => {
        //        ExploreController.getChallenge(route.params.id, setChallengeModel);
        //    });
        //}
    };

    return (
        <Comments
            title={storyModel?.data.title ? storyModel?.data.title : ""}
            comments={storyModel?.public.comments ? storyModel?.public.comments : []}
            submitComment={submitComment}
        />
    )
}