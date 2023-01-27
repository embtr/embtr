import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import ProfileController from 'src/controller/profile/ProfileController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { CommentsScrollView } from '../comments/CommentsScrollView';
import { Screen } from '../Screen';
import { CommentsTextInput } from 'src/components/common/comments/CommentsTextInput';
import { Comment } from 'src/controller/timeline/TimelineController';
import { Timestamp } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAvoidingView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { isIosApp } from 'src/util/DeviceUtil';
import { Banner } from '../Banner';
import ScrollableTextInputBox from './ScrollableTextInputBox';

const ViewAllComments = () => {
    const route = useRoute<RouteProp<PlanTabScreens, 'ViewAllComments'>>();

    const [goal, setGoal] = React.useState<GoalModel>();
    const [postOwner, setPostOwner] = React.useState<UserProfileModel>();
    const [currentUser, setCurrentUser] = React.useState<UserProfileModel>();

    const uid = route.params.uid;
    const goalId = route.params.goalId;

    React.useEffect(() => {
        GoalController.getGoal(uid, goalId, setGoal);
    }, []);

    React.useEffect(() => {
        ProfileController.getProfile(uid, setPostOwner);
    }, []);

    React.useEffect(() => {
        ProfileController.getProfile(getCurrentUid(), setCurrentUser);
    }, []);

    const comments: Comment[] = [
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
        { comment: 'hello there', uid: getCurrentUid(), timestamp: Timestamp.now() },
    ];

    return (
        <Screen>
            <Banner name={'Comments'} leftIcon={'arrow-back'} leftRoute="BACK" />

            {currentUser && postOwner && (
                <ScrollableTextInputBox currentUser={currentUser} postOwner={postOwner}>
                    {goal?.public.comments && <CommentsScrollView comments={comments} onDeleteComment={() => {}} />}
                </ScrollableTextInputBox>
            )}
        </Screen>
    );
};

export default ViewAllComments;
