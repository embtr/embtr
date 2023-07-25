import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import DailyResultController, {
    DayResultTimelinePost,
} from 'src/controller/timeline/daily_result/DailyResultController';
import { View } from 'react-native';
import { CARD_SHADOW, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { DailyResultCardElement } from './DailyResultCardElement';
import { DailyResultBody } from './DailyResultBody';
import { DailyResultHeader } from './DailyResultHeader';
import { PlannedDayResult as PlannedDayResultModel } from 'resources/schema';
import PostDetailsActionBar from '../comments/PostDetailsActionBar';
import { TouchableWithoutFeedback } from 'react-native';
import { ModelKeyGenerator } from 'src/util/model/ModelKeyGenerator';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import {
    getCurrentUser,
    getTimelineCardRefreshRequests,
    removeTimelineCardRefreshRequest,
} from 'src/redux/user/GlobalState';

type timelineCommentsScreenProp = StackNavigationProp<TimelineTabScreens, 'UserPostDetails'>;

interface Props {
    plannedDayResult: DayResultTimelinePost;
}

export const DailyResultCard = React.memo(({ plannedDayResult }: Props) => {
    const navigation = useNavigation<timelineCommentsScreenProp>();
    const { colors } = useTheme();
    const dispatch = useAppDispatch();

    const currentUser = useAppSelector(getCurrentUser);
    const timelineCardRefreshRequests: string[] = useAppSelector(getTimelineCardRefreshRequests);

    const [updatedDayResult, setUpdatedDayResult] = React.useState<PlannedDayResultModel>(
        plannedDayResult.data.dayResult
    );
    const [isLiked, setIsLiked] = React.useState(
        plannedDayResult.data.dayResult.likes?.some((like) => like.userId === currentUser.id) ||
            false
    );

    const refreshPlannedDayResult = async () => {
        const refreshedPlannedDayResult = await DailyResultController.getViaApi(
            updatedDayResult.id!
        );
        if (refreshedPlannedDayResult) {
            setUpdatedDayResult(refreshedPlannedDayResult);
        }
    };

    let plannedTaskViews: JSX.Element[] = [];

    updatedDayResult.plannedDay?.plannedTasks!.forEach((plannedTask) => {
        const key = ModelKeyGenerator.generatePlannedTaskKey(plannedTask);
        plannedTaskViews.push(
            <View key={key} style={{ paddingBottom: 5 }}>
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
        if (isLiked) {
            return;
        }

        if (!updatedDayResult.id) {
            return;
        }

        await DailyResultController.addLikeViaApi(updatedDayResult.id);
        setIsLiked(true);
        refreshPlannedDayResult();
    };

    React.useEffect(() => {
        if (!updatedDayResult.id) {
            return;
        }

        const key = 'RESULT_' + updatedDayResult.id;

        if (timelineCardRefreshRequests.includes(key)) {
            refreshPlannedDayResult();
            //remove card from the refresh request list
            dispatch(removeTimelineCardRefreshRequest(key));
        }
    }, [timelineCardRefreshRequests]);

    const user = plannedDayResult.data.dayResult.plannedDay!.user!;

    return (
        <TouchableWithoutFeedback onPress={navigateToDetails}>
            <View
                style={[
                    {
                        backgroundColor: colors.timeline_card_background,
                        borderRadius: 2.5,
                    },
                    CARD_SHADOW,
                ]}
            >
                {/**********/}
                {/* HEADER */}
                {/**********/}
                <DailyResultHeader user={user} date={updatedDayResult.createdAt!} />

                {/**********/}
                {/*  BODY  */}
                {/**********/}
                <DailyResultBody
                    plannedDayResult={updatedDayResult}
                    navigateToDetails={navigateToDetails}
                />

                {/**********/}
                {/* FOOTER */}
                {/**********/}
                <PostDetailsActionBar
                    likeCount={updatedDayResult?.likes?.length ?? 0}
                    isLiked={isLiked}
                    commentCount={updatedDayResult.comments?.length ?? 0}
                    onLike={onLike}
                />
            </View>
        </TouchableWithoutFeedback>
    );
});
