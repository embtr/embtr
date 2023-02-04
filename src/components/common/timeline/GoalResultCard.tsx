import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { View, Text, TextStyle } from 'react-native';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PostDetailsActionBar from '../comments/PostDetailsActionBar';
import GoalResultController, { GoalResultModel } from 'src/controller/timeline/goals/GoalResultController';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { GoalResultElement } from './goal_result/GoalResultElement';
import React from 'react';
import PlannedTaskController, { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { getDatePretty } from 'src/util/DateUtility';
import { DailyResultHeader } from './DailyResultHeader';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { getTimelineCardRefreshRequests, removeTimelineCardRefreshRequest } from 'src/redux/user/GlobalState';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';

interface Props {
    userProfileModel: UserProfileModel;
    goalResult: GoalResultModel;
}

type timelineCommentsScreenProp = StackNavigationProp<TimelineTabScreens, 'UserPostDetails'>;

export const GoalResultCard = ({ userProfileModel, goalResult }: Props) => {
    const { colors } = useTheme();
    const navigation = useNavigation<timelineCommentsScreenProp>();
    const dispatch = useAppDispatch();

    const onLike = () => {};

    const [goalResultToUse, setGoalResultToUse] = React.useState<GoalResultModel>(goalResult);
    const [taskHistory, setTaskHistory] = React.useState<PlannedTaskModel[]>([]);

    const headerTextStyle = {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: colors.timeline_card_body,
        paddingLeft: TIMELINE_CARD_PADDING,
    } as TextStyle;

    const timelineCardRefreshRequests: string[] = useAppSelector(getTimelineCardRefreshRequests);
    React.useEffect(() => {
        if (timelineCardRefreshRequests.includes(goalResultToUse.data.goal.id)) {
            fetchGoalResult();

            //remove card from the refresh request list
            dispatch(removeTimelineCardRefreshRequest(goalResultToUse.data.goal.id));
        }
    }, [timelineCardRefreshRequests]);

    React.useEffect(() => {
        const fetch = async () => {
            if (!goalResult?.id) {
                return;
            }

            const tasks = await PlannedTaskController.getGoalHistory(goalResult.id);
            setTaskHistory(tasks);
        };

        fetch();
    }, []);

    const fetchGoalResult = async () => {
        const newGoalResultToUse = await GoalResultController.getByGoalId(goalResultToUse.data.goal.id);
        setGoalResultToUse(newGoalResultToUse);
    };

    const title = goalResultToUse.data.goal.goal?.name ?? '';
    const description = goalResultToUse.data.goal.goal?.description ?? '';
    const likes = goalResultToUse.data.goal.goal?.public.likes ?? [];
    const comments = goalResultToUse.data.goal.goal?.public.comments ?? [];

    const navigateToDetails = () => {
        if (!goalResult?.id) {
            return;
        }

        navigation.navigate('GoalDetails', {
            uid: goalResultToUse.uid,
            id: goalResultToUse.data.goal.id,
            source: 'timeline',
        });
    };

    return (
        <TouchableWithoutFeedback onPress={navigateToDetails}>
            <View style={{ backgroundColor: colors.timeline_card_background, borderRadius: 10 }}>
                {/**********/}
                {/* HEADER */}
                {/**********/}
                <DailyResultHeader userProfileModel={userProfileModel} date={goalResultToUse.data.completionDate.toDate()} />

                {/**********/}
                {/*  BODY  */}
                {/**********/}
                <View>
                    <View style={{ paddingTop: 10 }}>
                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ width: '94%', alignItems: 'center', justifyContent: 'center' }}></View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <View style={{ paddingTop: 5 }}>
                                    <Text style={[headerTextStyle, { flex: 1 }]}>
                                        It's a <Text style={{ color: colors.progress_bar_complete }}>{'Celebration!'} </Text>
                                    </Text>
                                </View>

                                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingRight: TIMELINE_CARD_PADDING, paddingBottom: 10 }}>
                                    <Text style={[{ textAlign: 'left', paddingTop: 5, color: colors.text }]}>{title}</Text>
                                    <Text style={[{ textAlign: 'left', paddingTop: 5, color: 'rgba(000,000,000,.6)', fontSize: 13 }]}>{description}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 20 }}>
                                <Ionicons name={'trophy'} size={40} color={colors.trophy_icon} />
                            </View>
                        </View>

                        <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingRight: TIMELINE_CARD_PADDING, paddingTop: 5 }}>
                            <GoalResultElement field="Date Complete" value={getDatePretty(goalResultToUse.data.completionDate.toDate())} />

                            <View style={{ paddingTop: 4 }}>
                                <GoalResultElement field="Total Tasks" value={'' + taskHistory.length} />
                            </View>

                            <View style={{ paddingTop: 4 }}></View>
                        </View>
                    </View>
                </View>

                {/**********/}
                {/* FOOTER */}
                {/**********/}
                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingTop: 15, paddingBottom: TIMELINE_CARD_PADDING }}>
                    <PostDetailsActionBar likes={likes} comments={comments} onLike={onLike} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
