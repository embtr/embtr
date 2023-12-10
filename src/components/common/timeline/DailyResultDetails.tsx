import * as React from 'react';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { PostDetails } from 'src/components/common/comments/PostDetails';
import { Alert, View } from 'react-native';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen } from '../Screen';
import { Comment, PlannedDayResult, User } from 'resources/schema';
import Toast from 'react-native-root-toast';
import { useAppDispatch } from 'src/redux/Hooks';
import { addTimelineCardRefreshRequest } from 'src/redux/user/GlobalState';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import { PostUtility } from 'src/util/post/PostUtility';

export const DailyResultDetails = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'DailyResultDetails'>>();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();
    const dispatch = useAppDispatch();

    const [plannedDayResult, setPlannedDayResult] = React.useState<PlannedDayResult | undefined>(
        undefined
    );

    const fetchData = async () => {
        const plannedDayResult = await DailyResultController.getViaApi(route.params.id);
        if (plannedDayResult) {
            setPlannedDayResult(plannedDayResult);
        } else {
            Toast.show('Post no longer exists!', {
                duration: Toast.durations.LONG,
                containerStyle: { backgroundColor: 'white', marginBottom: 80 },
                textStyle: { color: 'black' },
            });
            navigation.goBack();
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const submitComment = async (text: string, taggedUsers: User[]) => {
        if (plannedDayResult?.id) {
            await DailyResultController.addCommentViaApi(plannedDayResult.id, text);
            dispatch(addTimelineCardRefreshRequest('RESULT_' + plannedDayResult.id));
            fetchData();
        }
    };

    const deleteComment = async (comment: Comment) => {
        if (plannedDayResult?.id) {
            await DailyResultController.deleteCommentViaApi(comment);
            dispatch(addTimelineCardRefreshRequest('RESULT_' + plannedDayResult.id));
            fetchData();
        }
    };

    const onEdit = () => {
        if (plannedDayResult?.id) {
            navigation.navigate('EditDailyResultDetails', { id: plannedDayResult.id });
        }
    };

    const onDelete = () => {
        Alert.alert(
            'Delete Daily Result',
            'Are you sure you want to delete this Daily Result? Any future modifications to this day will restore it..',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                {
                    text: 'I am sure. Delete it.',
                    onPress: async () => {
                        const clone: PlannedDayResult = { ...plannedDayResult, active: false };
                        await DailyResultController.updateViaApi(clone);
                        setPlannedDayResult(clone);
                        if (plannedDayResult?.plannedDay?.dayKey) {
                            PlannedDayController.prefetchPlannedDayData(
                                plannedDayResult.plannedDay.dayKey
                            );
                        }
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const onLike = async () => {
        if (!plannedDayResult?.id) {
            return;
        }

        await DailyResultController.addLikeViaApi(plannedDayResult!.id);
        dispatch(addTimelineCardRefreshRequest('RESULT_' + plannedDayResult.id));
        fetchData();
    };

    if (!plannedDayResult) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const timelinePostModel = PostUtility.createDayResultTimelineModel(plannedDayResult);

    return (
        <View style={{ width: '100%', height: '100%' }}>
            <PostDetails
                timelinePostModel={timelinePostModel}
                onLike={onLike}
                submitComment={submitComment}
                deleteComment={deleteComment}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </View>
    );
};
