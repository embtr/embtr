import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import DailyResultController, { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { View, Text } from 'react-native';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import PlannedDayController, { getDateFromDayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';
import { DailyResultCardElement } from './DailyResultCardElement';
import { DailyResultBody } from './DailyResultBody';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import UserController from 'src/controller/user/UserController';
import { getDatePretty } from 'src/util/DateUtility';
import PostDetailsActionBar from '../comments/PostDetailsActionBar';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { DailyResultHeader } from './DailyResultHeader';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getTimelineCardRefreshRequests, removeTimelineCardRefreshRequest } from 'src/redux/user/GlobalState';

type timelineCommentsScreenProp = StackNavigationProp<TimelineTabScreens, 'UserPostDetails'>;

interface Props {
    userProfileModel: UserProfileModel;
    dailyResult: DailyResultModel;
}

export const DailyResultCard = ({ userProfileModel, dailyResult }: Props) => {
    const navigation = useNavigation<timelineCommentsScreenProp>();
    const { colors } = useTheme();

    const [updatedDailyResult, setUpdatedDailyResult] = React.useState<DailyResultModel>();
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();

    const dailyResultToUse = updatedDailyResult ? updatedDailyResult : dailyResult;

    const timelineCardRefreshRequests: string[] = useAppSelector(getTimelineCardRefreshRequests);

    const dispatch = useAppDispatch();
    React.useEffect(() => {
        if (!dailyResult.id) {
            return;
        }

        if (timelineCardRefreshRequests.includes(dailyResult.id)) {
            DailyResultController.get(dailyResult.id, setUpdatedDailyResult);

            //remove card from the refresh request list
            dispatch(removeTimelineCardRefreshRequest(dailyResult.id));
        }
    }, [timelineCardRefreshRequests]);

    React.useEffect(() => {
        const fetchPlannedDay = async (dailyResult: DailyResultModel) => {
            const user = await UserController.get(dailyResult.uid);
            const plannedDay = await PlannedDayController.getOrCreate(user, dailyResult.data.dayKey);
            setPlannedDay(plannedDay);
        };

        fetchPlannedDay(dailyResultToUse);
    }, [dailyResult]);

    let plannedTaskViews: JSX.Element[] = [];

    plannedDay?.plannedTasks.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} />
            </View>
        );
    });

    const navigateToDetails = () => {
        navigation.navigate('DailyResultDetails', {
            id: dailyResultToUse.id ?? '',
        });
    };

    const onLike = async () => {
        if (!dailyResult.id) {
            return;
        }

        await DailyResultController.like(dailyResultToUse, getCurrentUid());
        DailyResultController.get(dailyResult.id, setUpdatedDailyResult);
    };

    return (
        <TouchableWithoutFeedback onPress={navigateToDetails}>
            <View style={{ backgroundColor: colors.timeline_card_background, borderRadius: 10 }}>
                {/**********/}
                {/* HEADER */}
                {/**********/}
                {plannedDay?.dayKey && <DailyResultHeader userProfileModel={userProfileModel} date={getDateFromDayKey(plannedDay?.dayKey)} />}

                {/**********/}
                {/*  BODY  */}
                {/**********/}
                {plannedDay && <DailyResultBody dailyResult={dailyResultToUse} plannedDay={plannedDay} navigateToDetails={navigateToDetails} />}

                {/**********/}
                {/* FOOTER */}
                {/**********/}
                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingTop: 10, paddingBottom: TIMELINE_CARD_PADDING }}>
                    <PostDetailsActionBar likes={dailyResultToUse.public.likes} comments={dailyResultToUse.public.comments} onLike={onLike} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
