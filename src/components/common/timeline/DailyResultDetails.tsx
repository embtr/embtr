import * as React from 'react';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { Comments } from 'src/components/common/comments/Comments';
import { View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import DailyResultController, { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import PlannedDayController, { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { getAuth } from 'firebase/auth';
import { DailyResultBody } from './DailyResultBody';

export const DailyResultDetails = () => {
    const { colors } = useTheme();
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

    //  const submitComment = (text: string, taggedUsers: UserProfileModel[]) => {
    //      const user = getAuth().currentUser;
    //      if (storyModel?.id && user?.uid) {
    //          StoryController.addComment(storyModel.id, user.uid, text, () => {
    //              NotificationController.addNotifications(getAuth().currentUser!.uid, taggedUsers, NotificationType.TIMELINE_COMMENT, route.params.id);
    //              StoryController.getStory(route.params.id, setStoryModel);
    //          });
    //      }
    //  };

    if (dailyResult === undefined || plannedDay === undefined) {
        return <View></View>;
    }

    return (
        <View style={{ width: '100%', height: '100%'}}>
            <Comments
                type={'Daily Result'}
                authorUid={dailyResult.uid}
                added={dailyResult.added.toDate()}
                comments={dailyResult?.public.comments}
                submitComment={() => {}}
            >
            <View style={{paddingLeft: 10 }} >
                <DailyResultBody dailyResult={dailyResult} plannedDay={plannedDay} />
            </View>
            </Comments>
        </View>
    );
};
