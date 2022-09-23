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

export const DailyResultDetails = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'DailyResultDetails'>>();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const [dailyResult, setDailyResult] = React.useState<DailyResultModel | undefined>(undefined);
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay | undefined>(undefined);

    useFocusEffect(
        React.useCallback(() => {
            DailyResultController.get(route.params.id, (dailyResult: DailyResultModel) => {
                setDailyResult(dailyResult);
                PlannedDayController.get(dailyResult.uid, dailyResult.data.plannedDayId, setPlannedDay);
            });
        }, [])
    );

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

    if (dailyResult === undefined || plannedDay === undefined) {
        return <Screen><View></View></Screen>;
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

    return (
        <View style={{ width: '100%', height: '100%' }}>
            <PostDetails
                type={'Daily Result'}
                authorUid={dailyResult.uid}
                added={dailyResult.added.toDate()}
                comments={dailyResult?.public.comments}
                submitComment={submitComment}
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
