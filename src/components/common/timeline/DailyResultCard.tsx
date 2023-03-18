import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import DailyResultController, { DailyResultModel, DayResultTimelinePost } from 'src/controller/timeline/daily_result/DailyResultController';
import { View } from 'react-native';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import PlannedDayController, { getDateFromDayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';
import { DailyResultCardElement } from './DailyResultCardElement';
import { DailyResultBody } from './DailyResultBody';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import UserController from 'src/controller/user/UserController';
import PostDetailsActionBar from '../comments/PostDetailsActionBar';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { DailyResultHeader } from './DailyResultHeader';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getTimelineCardRefreshRequests, removeTimelineCardRefreshRequest } from 'src/redux/user/GlobalState';
import { DayResultModel } from 'resources/models/DayResultModel';

type timelineCommentsScreenProp = StackNavigationProp<TimelineTabScreens, 'UserPostDetails'>;

interface Props {
    userProfileModel: UserProfileModel;
    dayResult: DayResultTimelinePost;
}

export const DailyResultCard = ({ userProfileModel, dayResult }: Props) => {
    const navigation = useNavigation<timelineCommentsScreenProp>();
    const dispatch = useAppDispatch();
    const { colors } = useTheme();

    const [updatedDayResult, setUpdatedDayResult] = React.useState<DayResultModel>();
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

    const navigateToDetails = () => {};

    const onLike = async () => {};

    return (
        <TouchableWithoutFeedback onPress={navigateToDetails}>
            <View style={{ backgroundColor: colors.timeline_card_background, borderRadius: 10 }}>
                {/**********/}
                {/* HEADER */}
                {/**********/}
                <DailyResultHeader userProfileModel={userProfileModel} date={dayResult.added.toDate()} />

                {/**********/}
                {/*  BODY  */}
                {/**********/}
                <DailyResultBody dayResult={dayResult.data.dayResult} navigateToDetails={navigateToDetails} />

                {/**********/}
                {/* FOOTER */}
                {/**********/}
                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingTop: 10, paddingBottom: TIMELINE_CARD_PADDING }}></View>
            </View>
        </TouchableWithoutFeedback>
    );
};
