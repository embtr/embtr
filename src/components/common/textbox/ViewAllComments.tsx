import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import ProfileController from 'src/controller/profile/ProfileController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { CommentsScrollView } from '../comments/CommentsScrollView';
import { Screen } from '../Screen';
import { Banner } from '../Banner';
import ScrollableTextInputBox from './ScrollableTextInputBox';
import { Comment } from 'src/controller/timeline/TimelineController';

const ViewAllComments = () => {
    const route = useRoute<RouteProp<PlanTabScreens, 'ViewAllComments'>>();

    const [goal, setGoal] = React.useState<GoalModel>();
    const [postOwner, setPostOwner] = React.useState<UserProfileModel>();
    const [currentUser, setCurrentUser] = React.useState<UserProfileModel>();

    const uid = route.params.uid;
    const goalId = route.params.goalId;

    React.useEffect(() => {
        fetchGoal();
    }, []);

    React.useEffect(() => {
        ProfileController.getProfile(uid, setPostOwner);
    }, []);

    React.useEffect(() => {
        ProfileController.getProfile(getCurrentUid(), setCurrentUser);
    }, []);

    const fetchGoal = () => {
        GoalController.getGoal(uid, goalId, setGoal);
    };

    const onSubmitComment = async (comment: string) => {
        if (!goal) {
            return;
        }

        await GoalController.addComment(getCurrentUid(), goal, comment);
        fetchGoal();
    };

    const onDeleteComment = async (comment: Comment) => {
        if (!goal) {
            return;
        }
        await GoalController.deleteComment(goal, comment);
        fetchGoal();
    };

    return (
        <Screen>
            <Banner name={'Comments'} leftIcon={'arrow-back'} leftRoute="BACK" />

            {currentUser && postOwner && (
                <ScrollableTextInputBox currentUser={currentUser} postOwner={postOwner} submitComment={onSubmitComment}>
                    {goal?.public.comments && <CommentsScrollView comments={goal.public.comments} onDeleteComment={onDeleteComment} />}
                </ScrollableTextInputBox>
            )}
        </Screen>
    );
};

export default ViewAllComments;
