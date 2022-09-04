import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { timelineEntryWasLikedBy } from 'src/controller/timeline/story/StoryController';
import { getAuth } from 'firebase/auth';
import { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { TouchableWithoutFeedback, View, Text, TextStyle } from 'react-native';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { TIMELINE_CARD_PADDING, TIMELINE_CARD_ICON_SIZE, TIMELINE_CARD_ICON_COUNT_SIZE } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { formatDistance } from 'date-fns';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import PlannedDayController, { formatDayOfWeekFromDayKey, getDateFromDayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';
import { DailyResultCardElement } from './DailyResultCardElement';
import { getDayOfWeek } from 'src/controller/planning/TaskController';

type timelineCommentsScreenProp = StackNavigationProp<TimelineTabScreens, 'TimelineComments'>;

interface Props {
    userProfileModel: UserProfileModel;
    dailyResult: DailyResultModel;
}

export const DailyResultCard = ({ userProfileModel, dailyResult }: Props) => {
    const navigation = useNavigation<timelineCommentsScreenProp>();
    const { colors } = useTheme();

    const [likes, setLikes] = React.useState(dailyResult.public.likes.length);
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();

    const onLike = () => {
        //StoryController.likeStory(dailyResult, getAuth().currentUser!.uid);
        setLikes(likes + 1);
    };

    const onCommented = () => {
        navigation.navigate('TimelineComments', { id: dailyResult?.id ? dailyResult.id : '' });
    };
    const isLiked = timelineEntryWasLikedBy(dailyResult, getAuth().currentUser!.uid);

    React.useEffect(() => {
        if (dailyResult.data.plannedDayId) {
            PlannedDayController.get(dailyResult.uid, dailyResult.data.plannedDayId, setPlannedDay);
        }
    }, []);

    const headerTextStyle = {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: colors.timeline_card_body,
        paddingLeft: TIMELINE_CARD_PADDING,
    } as TextStyle;

    const bodyTextStyle = {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: colors.timeline_card_body,
    } as TextStyle;

    let completedCount = 0;
    plannedDay?.plannedTasks.forEach((plannedTask) => {
        if (plannedTask.status === 'COMPLETE') {
            completedCount += 1;
        }
    });

    const progress = plannedDay ? (completedCount / plannedDay.plannedTasks.length) * 100 : 100;

    const time = formatDistance(dailyResult.added.toDate(), new Date(), { addSuffix: true });
    const dayOfWeek = getDayOfWeek(getDateFromDayKey(plannedDay?.id ? plannedDay?.id : ''));

    let plannedTaskViews: JSX.Element[] = [];

    plannedDay?.plannedTasks.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} />
            </View>
        );
    });

    return (
        <TouchableWithoutFeedback>
            <View style={{ backgroundColor: colors.timeline_card_background, borderRadius: 15 }}>
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
                                        {time}
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
                <View style={{ paddingTop: 10 }}>
                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: '94%', alignItems: 'center', justifyContent: 'center' }}>
                            <ProgressBar progress={progress} success={dailyResult.data.status !== 'FAILED'} />
                        </View>
                    </View>

                    <View style={{ paddingTop: 5 }}>
                        <Text style={headerTextStyle}>
                            {dayOfWeek.substring(0, 1).toUpperCase() + dayOfWeek.substring(1)}{' '}
                            <Text style={{ color: plannedDay?.metadata?.status === 'FAILED' ? colors.progress_bar_failed : colors.progress_bar_complete }}>
                                {plannedDay?.metadata?.status === 'FAILED' ? 'Failed!' : 'Compete!'}
                            </Text>
                        </Text>
                    </View>

                    <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingRight: TIMELINE_CARD_PADDING, paddingTop: 5 }}>
                        {/*<Text style={[bodyTextStyle, { textAlign: 'left' }]}>man, I tried really hard on this one! I will get it next time.</Text>
                        <View style={{ paddingTop: 15 }}>{plannedTaskViews}</View>*/}
                        <View>{plannedTaskViews}</View>
                        {/* <Text style={[bodyTextStyle, { color: "gray", fontSize: 12, textAlign: "right", marginTop: 5, marginRight: 10 }]}>{"view more..."}</Text> */}
                    </View>
                </View>

                {/**********/}
                {/* FOOTER */}
                {/**********/}
                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingTop: 10, paddingBottom: TIMELINE_CARD_PADDING }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{ borderColor: colors.text }}>
                                <Ionicons name={'heart-outline'} size={TIMELINE_CARD_ICON_SIZE} color={colors.timeline_card_footer} onPress={undefined} />
                            </View>

                            <View style={{ justifyContent: 'center', paddingLeft: 4 }}>
                                <Text style={{ color: colors.timeline_card_footer, fontSize: TIMELINE_CARD_ICON_COUNT_SIZE, fontFamily: 'Poppins_500Medium' }}>
                                    {likes}
                                </Text>
                            </View>

                            <View style={{ borderColor: colors.text, paddingLeft: 20 }}>
                                <Ionicons name={'chatbox-outline'} size={TIMELINE_CARD_ICON_SIZE} color={colors.timeline_card_footer} />
                            </View>

                            <View style={{ justifyContent: 'center', paddingLeft: 4 }}>
                                <Text style={{ color: colors.timeline_card_footer, fontSize: TIMELINE_CARD_ICON_COUNT_SIZE, fontFamily: 'Poppins_500Medium' }}>
                                    {}
                                </Text>
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={{ borderColor: colors.text, alignItems: 'flex-end', paddingRight: TIMELINE_CARD_PADDING }}>
                                <Ionicons
                                    name={'share-outline'}
                                    size={TIMELINE_CARD_ICON_SIZE}
                                    color={colors.timeline_card_footer}
                                    onPress={() => {
                                        alert("I don't work yet :(");
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
