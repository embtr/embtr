import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import DailyResultController, { DayResultTimelinePost } from 'src/controller/timeline/daily_result/DailyResultController';
import { View } from 'react-native';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { DailyResultCardElement } from './DailyResultCardElement';
import { DailyResultBody } from './DailyResultBody';
import { DailyResultHeader } from './DailyResultHeader';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getTimelineCardRefreshRequests, removeTimelineCardRefreshRequest } from 'src/redux/user/GlobalState';
import { PlannedDayResult as PlannedDayResultModel } from 'resources/schema';
import PostDetailsActionBar from '../comments/PostDetailsActionBar';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

type timelineCommentsScreenProp = StackNavigationProp<TimelineTabScreens, 'UserPostDetails'>;

interface Props {
    userProfileModel: UserProfileModel;
    plannedDayResult: DayResultTimelinePost;
}

export const DailyResultCard = ({ userProfileModel, plannedDayResult }: Props) => {
    const navigation = useNavigation<timelineCommentsScreenProp>();
    const dispatch = useAppDispatch();
    const { colors } = useTheme();

    const [updatedDayResult, setUpdatedDayResult] = React.useState<PlannedDayResultModel>(plannedDayResult.data.dayResult);
    const timelineCardRefreshRequests: number[] = useAppSelector(getTimelineCardRefreshRequests);

    React.useEffect(() => {
        if (!updatedDayResult?.id) {
            return;
        }

        const getAsync = async () => {
            if (!updatedDayResult?.id) {
                return;
            }

            if (timelineCardRefreshRequests.includes(updatedDayResult.id)) {
                const refreshedDayResult = await DailyResultController.getViaApi(updatedDayResult.id!);
                if (refreshedDayResult) {
                    setUpdatedDayResult(refreshedDayResult);
                }
                //remove card from the refresh request list
                dispatch(removeTimelineCardRefreshRequest(refreshedDayResult.id));
            }
        };

        getAsync();
    }, [timelineCardRefreshRequests]);

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
    };

    return (
        <TouchableWithoutFeedback onPress={navigateToDetails}>
            <View style={{ backgroundColor: colors.timeline_card_background, borderRadius: 10 }}>
                {/**********/}
                {/* HEADER */}
                {/**********/}
                <DailyResultHeader userProfileModel={userProfileModel} date={updatedDayResult.plannedDay?.date!} />

                {/**********/}
                {/*  BODY  */}
                {/**********/}
                <DailyResultBody plannedDayResult={updatedDayResult} navigateToDetails={navigateToDetails} />

                {/**********/}
                {/* FOOTER */}
                {/**********/}
                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingTop: 10, paddingBottom: TIMELINE_CARD_PADDING / 2 }}>
                    <PostDetailsActionBar
                        likes={updatedDayResult?.plannedDayResultLikes || []}
                        commentCount={updatedDayResult.comments?.length ?? 0}
                        onLike={onLike}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
