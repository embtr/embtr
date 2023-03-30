import * as React from 'react';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { PostDetails } from 'src/components/common/comments/PostDetails';
import { Alert, View } from 'react-native';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { DailyResultBody } from './DailyResultBody';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen } from '../Screen';
import { Comment, PlannedDayResult as PlannedDayResultModel } from 'resources/schema';
import { useAppDispatch } from 'src/redux/Hooks';
import { addTimelineCardRefreshRequest } from 'src/redux/user/GlobalState';

export const DailyResultDetails = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'DailyResultDetails'>>();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();
    const dispatch = useAppDispatch();

    const [plannedDayResult, setPlannedDayResult] = React.useState<PlannedDayResultModel | undefined>(undefined);

    const fetchData = async () => {
        const plannedDayResult = await DailyResultController.getViaApi(route.params.id);
        setPlannedDayResult(plannedDayResult);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const submitComment = async (text: string, taggedUsers: UserProfileModel[]) => {
        if (plannedDayResult?.id) {
            await DailyResultController.addCommentViaApi(plannedDayResult.id, text);
            fetchData();
        }

        //DailyResultController.addComment(dailyResult.id, user.uid, text, () => {
        // send notification to post owner
        //    NotificationController.addNotification(user.uid, dailyResult.uid, NotificationType.DAILY_RESULT_COMMENT, dailyResult!.id!);

        // send notification to tagged users
        //    NotificationController.addNotifications(getAuth().currentUser!.uid, taggedUsers, NotificationType.DAILY_RESULT_TAG, route.params.id);
        //    DailyResultController.get(route.params.id, setDailyResult);
        //});
    };

    const deleteComment = async (comment: Comment) => {
        await DailyResultController.deleteCommentViaApi(comment);
        fetchData();
    };

    const onEdit = () => {
        if (plannedDayResult?.id) {
            navigation.navigate('EditDailyResultDetails', { id: plannedDayResult.id });
        }
    };

    const onDelete = () => {
        Alert.alert('Delete Daily Result', 'Are you sure you want to delete this Daily Result? Any future modifications to this day will restore it..', [
            { text: 'Cancel', onPress: () => {}, style: 'cancel' },
            {
                text: 'I am sure. Delete it.',
                onPress: async () => {
                    const clone: PlannedDayResultModel = { ...plannedDayResult, active: false };
                    await DailyResultController.updateViaApi(clone);
                    setPlannedDayResult(clone);
                    navigation.goBack();
                },
            },
        ]);
    };

    const onLike = async () => {
        if (!plannedDayResult?.id) {
            return;
        }

        await DailyResultController.addLikeViaApi(plannedDayResult!.id);
        //dispatch(addTimelineCardRefreshRequest(dailyResult.id));
        dispatch(addTimelineCardRefreshRequest(plannedDayResult.id));
        fetchData();
    };

    if (!plannedDayResult) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const commentObjs: Comment[] = [];
    plannedDayResult.comments?.forEach((comment) => {
        if (comment.comment) {
            commentObjs.push(comment.comment);
        }
    });

    return (
        <View style={{ width: '100%', height: '100%' }}>
            <PostDetails
                type={'Daily Result'}
                author={plannedDayResult!.plannedDay?.user!}
                added={plannedDayResult!.plannedDay?.createdAt!}
                likes={plannedDayResult.plannedDayResultLikes || []}
                comments={commentObjs}
                onLike={onLike}
                submitComment={submitComment}
                deleteComment={deleteComment}
                onEdit={onEdit}
                onDelete={onDelete}
            >
                <View style={{ paddingLeft: 10 }}>
                    <DailyResultBody plannedDayResult={plannedDayResult} />
                </View>
            </PostDetails>
        </View>
    );
};
