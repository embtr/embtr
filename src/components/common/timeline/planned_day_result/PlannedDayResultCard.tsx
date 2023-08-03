import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import DailyResultController, {
    DayResultTimelinePost,
} from 'src/controller/timeline/daily_result/DailyResultController';
import { Pressable, View } from 'react-native';
import { CARD_SHADOW } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import {
    getCurrentUser,
    getTimelineCardRefreshRequests,
    removeTimelineCardRefreshRequest,
} from 'src/redux/user/GlobalState';
import { DailyResultHeader } from '../DailyResultHeader';
import PostDetailsActionBar from '../../comments/PostDetailsActionBar';
import { PlannedDayResultBody } from './PlannedDayResultBody';
import { PlannedDayResultSummary } from 'resources/types/planned_day_result/PlannedDayResult';

type timelineCommentsScreenProp = StackNavigationProp<TimelineTabScreens, 'UserPostDetails'>;

interface Props {
    plannedDayResult: DayResultTimelinePost;
}

export const PlannedDayResultCard = ({ plannedDayResult }: Props) => {
    console.log(
        plannedDayResult.data.plannedDayResultSummary.plannedDayResult.id +
            ' ' +
            plannedDayResult.data.plannedDayResultSummary.plannedDayResult.plannedDay?.dayKey
    );
    const navigation = useNavigation<timelineCommentsScreenProp>();
    const { colors } = useTheme();
    const dispatch = useAppDispatch();

    const currentUser = useAppSelector(getCurrentUser);
    const timelineCardRefreshRequests: string[] = useAppSelector(getTimelineCardRefreshRequests);

    const [updatedDayResultSummary, setUpdatedDayResultSummary] =
        React.useState<PlannedDayResultSummary>(plannedDayResult.data.plannedDayResultSummary);
    const [isLiked, setIsLiked] = React.useState(
        plannedDayResult.data.plannedDayResultSummary.plannedDayResult.likes?.some(
            (like) => like.userId === currentUser.id
        ) || false
    );

    const refreshPlannedDayResult = async () => {
        const refreshedPlannedDayResult = await DailyResultController.getSummary(
            updatedDayResultSummary.plannedDayResult.id ?? 0
        );

        if (refreshedPlannedDayResult) {
            setUpdatedDayResultSummary(refreshedPlannedDayResult);
        }
    };

    const navigateToDetails = () => {
        if (!updatedDayResultSummary.plannedDayResult.id) {
            return;
        }

        navigation.navigate('DailyResultDetails', {
            id: updatedDayResultSummary.plannedDayResult.id,
        });
    };

    const onLike = async () => {
        if (isLiked) {
            return;
        }

        if (!updatedDayResultSummary.plannedDayResult.id) {
            return;
        }

        await DailyResultController.addLikeViaApi(updatedDayResultSummary.plannedDayResult.id);
        setIsLiked(true);
        refreshPlannedDayResult();
    };

    React.useEffect(() => {
        if (!updatedDayResultSummary.plannedDayResult.id) {
            return;
        }

        const key = 'RESULT_' + updatedDayResultSummary.plannedDayResult.id;

        if (timelineCardRefreshRequests.includes(key)) {
            refreshPlannedDayResult();
            //remove card from the refresh request list
            dispatch(removeTimelineCardRefreshRequest(key));
        }
    }, [timelineCardRefreshRequests]);

    const user = updatedDayResultSummary.plannedDayResult.plannedDay!.user!;

    return (
        <Pressable onPress={navigateToDetails}>
            <View
                style={[
                    {
                        backgroundColor: colors.timeline_card_background,
                        borderRadius: 9,
                    },
                    CARD_SHADOW,
                ]}
            >
                {/**********/}
                {/* HEADER */}
                {/**********/}
                <DailyResultHeader
                    user={user}
                    date={updatedDayResultSummary.plannedDayResult.createdAt!}
                />

                {/**********/}
                {/*  BODY  */}
                {/**********/}
                <View style={{ paddingVertical: 5 }}>
                    <PlannedDayResultBody
                        plannedDayResultSummary={updatedDayResultSummary}
                        navigateToDetails={navigateToDetails}
                    />
                </View>

                {/**********/}
                {/* FOOTER */}
                {/**********/}
                <PostDetailsActionBar
                    likeCount={updatedDayResultSummary.plannedDayResult?.likes?.length ?? 0}
                    isLiked={isLiked}
                    commentCount={updatedDayResultSummary.plannedDayResult.comments?.length ?? 0}
                    onLike={onLike}
                />
            </View>
        </Pressable>
    );
};
