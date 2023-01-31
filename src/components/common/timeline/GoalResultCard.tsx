import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { View, Text, TextStyle } from 'react-native';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PostDetailsActionBar from '../comments/PostDetailsActionBar';
import { GoalResultModel } from 'src/controller/timeline/goals/GoalResultController';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { GoalResultElement } from './goal_result/GoalResultElement';
import React from 'react';
import PlannedTaskController, { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { getDatePretty } from 'src/util/DateUtility';

interface Props {
    userProfileModel: UserProfileModel;
    goalResult: GoalResultModel;
}

export const GoalResultCard = ({ userProfileModel, goalResult }: Props) => {
    const { colors } = useTheme();

    const onLike = () => {};
    const onCommented = () => {};

    const [taskHistory, setTaskHistory] = React.useState<PlannedTaskModel[]>([]);

    const headerTextStyle = {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: colors.timeline_card_body,
        paddingLeft: TIMELINE_CARD_PADDING,
    } as TextStyle;

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

    const title = goalResult.data.goal.goal?.name ? goalResult.data.goal.goal?.name : '';
    const description = goalResult.data.goal.goal?.description ? goalResult.data.goal.goal?.description : '';
    const likes = goalResult.data.goal.goal?.public.likes ? goalResult.data.goal.goal.public.likes : [];
    const comments = goalResult.data.goal.goal?.public.comments ? goalResult.data.goal.goal.public.comments : [];

    return (
        <TouchableWithoutFeedback onPress={() => {}}>
            <View style={{ backgroundColor: colors.timeline_card_background, borderRadius: 10 }}>
                {/**********/}
                {/* HEADER */}
                {/**********/}
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ flex: 1, flexDirection: 'row', paddingTop: TIMELINE_CARD_PADDING, paddingLeft: TIMELINE_CARD_PADDING }}>
                        <View>{userProfileModel && <NavigatableUserImage userProfileModel={userProfileModel} size={45} />}</View>

                        <View style={{ paddingLeft: 10, flex: 1, alignSelf: 'stretch' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                    <Text style={{ fontFamily: 'Poppins_600SemiBold', color: colors.timeline_card_header }}>{userProfileModel.name}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: TIMELINE_CARD_PADDING }}>
                                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, opacity: 0.75, color: colors.timeline_card_header }}>
                                        {getDatePretty(goalResult.data.completionDate.toDate())}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 10, color: colors.timeline_card_header }}>
                                    {userProfileModel?.location}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

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
                                <Ionicons name={'trophy-outline'} size={40} color={'gold'} />
                            </View>
                        </View>

                        <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingRight: TIMELINE_CARD_PADDING, paddingTop: 5 }}>
                            <GoalResultElement field="Date Complete" value={getDatePretty(goalResult.data.completionDate.toDate())} />

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
