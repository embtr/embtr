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
import { PlannedDayResultModel } from 'resources/models/PlannedDayResultModel';
import PostDetailsActionBar from '../comments/PostDetailsActionBar';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

type timelineCommentsScreenProp = StackNavigationProp<TimelineTabScreens, 'UserPostDetails'>;

interface Props {
    userProfileModel: UserProfileModel;
    dayResult: DayResultTimelinePost;
}

export const DailyResultCard = ({ userProfileModel, dayResult }: Props) => {
    const navigation = useNavigation<timelineCommentsScreenProp>();
    const dispatch = useAppDispatch();
    const { colors } = useTheme();

    const [updatedDayResult, setUpdatedDayResult] = React.useState<PlannedDayResultModel>();
    const timelineCardRefreshRequests: string[] = useAppSelector(getTimelineCardRefreshRequests);

    React.useEffect(() => {
        if (!dayResult.data.dayResult.id) {
            return;
        }

        const getAsync = async () => {
            if (timelineCardRefreshRequests.includes('' + dayResult.data.dayResult.id)) {
                const updatedDayResult = await DailyResultController.getViaApi(dayResult.data.dayResult.id!);
                if (updatedDayResult) {
                    setUpdatedDayResult(updatedDayResult);
                }
                //remove card from the refresh request list
                dispatch(removeTimelineCardRefreshRequest(dayResult.data.dayResult.id));
            }
        };
    }, [timelineCardRefreshRequests]);

    let plannedTaskViews: JSX.Element[] = [];

    dayResult.data.dayResult.plannedDay?.plannedTasks!.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} />
            </View>
        );
    });

    const navigateToDetails = () => {
        console.log('navigateToDetails');
        if (!dayResult.data.dayResult.id) {
            return;
        }

        navigation.navigate('DailyResultDetails', {
            id: dayResult.data.dayResult.id,
        });
    };

    const onLike = async () => {};

    return (
        <TouchableWithoutFeedback onPress={navigateToDetails}>
            <View style={{ backgroundColor: colors.timeline_card_background, borderRadius: 10 }}>
                {/**********/}
                {/* HEADER */}
                {/**********/}
                <DailyResultHeader userProfileModel={userProfileModel} date={dayResult.data.dayResult.plannedDay?.date!} />

                {/**********/}
                {/*  BODY  */}
                {/**********/}
                <DailyResultBody dayResult={dayResult.data.dayResult} navigateToDetails={navigateToDetails} />

                {/**********/}
                {/* FOOTER */}
                {/**********/}
                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingTop: 10, paddingBottom: TIMELINE_CARD_PADDING / 2 }}>
                    <PostDetailsActionBar likes={[]} comments={[]} onLike={onLike} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
