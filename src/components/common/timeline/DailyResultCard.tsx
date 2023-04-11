import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import DailyResultController, { DayResultTimelinePost } from 'src/controller/timeline/daily_result/DailyResultController';
import { View } from 'react-native';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { DailyResultCardElement } from './DailyResultCardElement';
import { DailyResultBody } from './DailyResultBody';
import { DailyResultHeader } from './DailyResultHeader';
import { useAppDispatch } from 'src/redux/Hooks';
import { PlannedDayResult as PlannedDayResultModel } from 'resources/schema';
import PostDetailsActionBar from '../comments/PostDetailsActionBar';
import { TouchableWithoutFeedback } from 'react-native';

type timelineCommentsScreenProp = StackNavigationProp<TimelineTabScreens, 'UserPostDetails'>;

interface Props {
    plannedDayResult: DayResultTimelinePost;
}

export const DailyResultCard = ({ plannedDayResult }: Props) => {
    const navigation = useNavigation<timelineCommentsScreenProp>();
    const dispatch = useAppDispatch();
    const { colors } = useTheme();

    const [updatedDayResult, setUpdatedDayResult] = React.useState<PlannedDayResultModel>(plannedDayResult.data.dayResult);

    const refreshPlannedDayResult = async (): Promise<PlannedDayResultModel> => {
        const refreshedPlannedDayResult: PlannedDayResultModel = await DailyResultController.getViaApi(updatedDayResult.id!);
        if (refreshedPlannedDayResult) {
            setUpdatedDayResult(refreshedPlannedDayResult);
        }
        return refreshedPlannedDayResult;
    };

    let plannedTaskViews: JSX.Element[] = [];

    updatedDayResult.plannedDay?.plannedTasks!.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} />
            </View>
        );
    });

    const navigateToDetails = () => {
        if (!updatedDayResult.id) {
            return;
        }

        navigation.navigate('DailyResultDetails', {
            id: updatedDayResult.id,
        });
    };

    const onLike = async () => {
        if (!updatedDayResult.id) {
            return;
        }
        await DailyResultController.addLikeViaApi(updatedDayResult.id);
        refreshPlannedDayResult();
    };

    const user = plannedDayResult.data.dayResult.plannedDay!.user!;

    return (
        <TouchableWithoutFeedback onPress={navigateToDetails}>
            <View style={{ backgroundColor: colors.timeline_card_background, borderRadius: 10 }}>
                {/**********/}
                {/* HEADER */}
                {/**********/}
                <DailyResultHeader user={user} date={updatedDayResult.plannedDay?.date!} />

                {/**********/}
                {/*  BODY  */}
                {/**********/}
                <DailyResultBody plannedDayResult={updatedDayResult} navigateToDetails={navigateToDetails} />

                {/**********/}
                {/* FOOTER */}
                {/**********/}
                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingTop: 10, paddingBottom: TIMELINE_CARD_PADDING / 2 }}>
                    <PostDetailsActionBar likes={updatedDayResult?.likes || []} commentCount={updatedDayResult.comments?.length ?? 0} onLike={onLike} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
