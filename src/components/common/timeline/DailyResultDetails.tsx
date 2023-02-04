import * as React from 'react';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { PostDetails } from 'src/components/common/comments/PostDetails';
import { Alert, View } from 'react-native';
import DailyResultController, { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import PlannedDayController, { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { getAuth } from 'firebase/auth';
import { DailyResultBody } from './DailyResultBody';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import NotificationController, { NotificationType } from 'src/controller/notification/NotificationController';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen } from '../Screen';
import UserController from 'src/controller/user/UserController';
import { Comment } from 'src/controller/timeline/TimelineController';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { useAppDispatch } from 'src/redux/Hooks';
import { addTimelineCardRefreshRequest } from 'src/redux/user/GlobalState';

export const DailyResultDetails = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'DailyResultDetails'>>();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();
    const dispatch = useAppDispatch();

    const [dailyResult, setDailyResult] = React.useState<DailyResultModel | undefined>(undefined);
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay | undefined>(undefined);

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = () => {
        const fetchPlannedDay = async (dailyResult: DailyResultModel) => {
            const user = await UserController.get(dailyResult.uid);
            const plannedDay = await PlannedDayController.get(user, dailyResult.data.dayKey);
            setPlannedDay(plannedDay);
        };

        DailyResultController.get(route.params.id, (dailyResult: DailyResultModel) => {
            setDailyResult(dailyResult);
            fetchPlannedDay(dailyResult);
        });
    };

    const submitComment = (text: string, taggedUsers: UserProfileModel[]) => {
        const user = getAuth().currentUser;

        if (!user || !dailyResult || !dailyResult?.id || !plannedDay) {
            return;
        }

        DailyResultController.addComment(dailyResult.id, user.uid, text, () => {
            // send notification to post owner
            NotificationController.addNotification(user.uid, dailyResult.uid, NotificationType.DAILY_RESULT_COMMENT, dailyResult!.id!);

            // send notification to tagged users
            NotificationController.addNotifications(getAuth().currentUser!.uid, taggedUsers, NotificationType.DAILY_RESULT_TAG, route.params.id);
            DailyResultController.get(route.params.id, setDailyResult);
        });
    };

    const deleteComment = async (comment: Comment) => {
        if (!dailyResult || !comment) {
            return;
        }

        await DailyResultController.deleteComment(dailyResult, comment);
        DailyResultController.get(route.params.id, setDailyResult);
    };

    if (dailyResult === undefined || plannedDay === undefined) {
        return (
            <Screen>
                <View></View>
            </Screen>
        );
    }

    const onEdit = () => {
        if (!dailyResult.id) {
            return;
        }

        navigation.navigate('EditDailyResultDetails', { id: dailyResult.id });
    };

    const onDelete = () => {
        Alert.alert('Delete Daily Result', 'Are you sure you want to delete this Daily Result? Any future modifications to this day will restore it..', [
            { text: 'Cancel', onPress: () => {}, style: 'cancel' },
            {
                text: 'I am sure. Delete it.',
                onPress: async () => {
                    DailyResultController.delete(dailyResult);
                    navigation.goBack();
                },
            },
        ]);
    };

    const onLike = async () => {
        await DailyResultController.like(dailyResult, getCurrentUid());
        dispatch(addTimelineCardRefreshRequest(dailyResult.id));
        fetchData();
    };

    return (
        <View style={{ width: '100%', height: '100%' }}>
            <PostDetails
                type={'Daily Result'}
                authorUid={dailyResult.uid}
                added={dailyResult.added.toDate()}
                likes={dailyResult?.public.likes ? dailyResult.public.likes : []}
                comments={dailyResult?.public.comments ? dailyResult.public.comments : []}
                onLike={onLike}
                submitComment={submitComment}
                deleteComment={deleteComment}
                onEdit={onEdit}
                onDelete={onDelete}
            >
                <View style={{ paddingLeft: 10 }}>
                    <DailyResultBody dailyResult={dailyResult} plannedDay={plannedDay} />
                </View>
            </PostDetails>
        </View>
    );
};
