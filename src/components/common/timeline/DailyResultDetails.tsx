import * as React from 'react';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { Comments } from 'src/components/common/comments/Comments';
import { View } from 'react-native';
import DailyResultController, { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import PlannedDayController, { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { getAuth } from 'firebase/auth';
import { DailyResultBody } from './DailyResultBody';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import NotificationController, { NotificationType } from 'src/controller/notification/NotificationController';

export const DailyResultDetails = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'DailyResultDetails'>>();

    const [dailyResult, setDailyResult] = React.useState<DailyResultModel | undefined>(undefined);
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay | undefined>(undefined);

    useFocusEffect(
        React.useCallback(() => {
            DailyResultController.get(route.params.id, (dailyResult: DailyResultModel) => {
                setDailyResult(dailyResult);
                PlannedDayController.get(getAuth().currentUser!.uid, dailyResult.data.plannedDayId, setPlannedDay);
            });
        }, [])
    );

    const submitComment = (text: string, taggedUsers: UserProfileModel[]) => {
        const user = getAuth().currentUser;

        if (!user || !dailyResult || !dailyResult?.id || !plannedDay) {
            return;
        }

        DailyResultController.addComment(dailyResult.id, user.uid, text, () => {
            NotificationController.addNotifications(
                getAuth().currentUser!.uid,
                taggedUsers,
                NotificationType.DAILY_RESULT_COMMENT,
                route.params.id
            );
            DailyResultController.get(route.params.id, setDailyResult);
        });
    };

    if (dailyResult === undefined || plannedDay === undefined) {
        return <View></View>;
    }

    return (
        <View style={{ width: '100%', height: '100%' }}>
            <Comments
                type={'Daily Result'}
                authorUid={dailyResult.uid}
                added={dailyResult.added.toDate()}
                comments={dailyResult?.public.comments}
                submitComment={submitComment}
            >
                <View style={{ paddingLeft: 10 }}>
                    <DailyResultBody dailyResult={dailyResult} plannedDay={plannedDay} />
                </View>
            </Comments>
        </View>
    );
};
