import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { timelineEntryWasLikedBy } from 'src/controller/timeline/story/StoryController';
import { getAuth } from 'firebase/auth';
import DailyResultController, { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { View, Text } from 'react-native';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { TIMELINE_CARD_PADDING, TIMELINE_CARD_ICON_SIZE, TIMELINE_CARD_ICON_COUNT_SIZE } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import PlannedDayController, { getDateFromDayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';
import { DailyResultCardElement } from './DailyResultCardElement';
import { DailyResultBody } from './DailyResultBody';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import UserController from 'src/controller/user/UserController';
import { getDatePretty } from 'src/util/DateUtility';

type timelineCommentsScreenProp = StackNavigationProp<TimelineTabScreens, 'UserPostDetails'>;

interface Props {
    userProfileModel: UserProfileModel;
    dailyResult: DailyResultModel;
}

export const DailyResultCard = ({ userProfileModel, dailyResult }: Props) => {
    const navigation = useNavigation<timelineCommentsScreenProp>();
    const { colors } = useTheme();

    const [likes, setLikes] = React.useState(dailyResult.public.likes.length);
    const [commentCount, setCommentCount] = React.useState(dailyResult.public.comments.length);
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();
    const [isLiked, setIsLiked] = React.useState<boolean>(timelineEntryWasLikedBy(dailyResult, getAuth().currentUser!.uid));

    const onLike = () => {
        DailyResultController.like(dailyResult, getAuth().currentUser!.uid);
        setLikes(likes + 1);
        setIsLiked(true);
    };

    React.useEffect(() => {
        const fetchPlannedDay = async (dailyResult: DailyResultModel) => {
            const user = await UserController.get(dailyResult.uid);
            const plannedDay = await PlannedDayController.getOrCreate(user, dailyResult.data.dayKey);
            setPlannedDay(plannedDay);
        };

        fetchPlannedDay(dailyResult);
    }, [dailyResult]);

    React.useEffect(() => {
        setLikes(dailyResult.public.likes.length);
        setCommentCount(dailyResult.public.comments.length);
    }, [dailyResult]);

    const datePretty = getDatePretty(getDateFromDayKey(dailyResult.data.dayKey));

    let plannedTaskViews: JSX.Element[] = [];

    plannedDay?.plannedTasks.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} />
            </View>
        );
    });

    const navigateToDetails = () => {
        navigation.navigate('DailyResultDetails', { id: dailyResult.id ? dailyResult.id : '' });
    };

    return (
        <TouchableWithoutFeedback onPress={navigateToDetails}>
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
                                        {datePretty}
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
                {plannedDay && <DailyResultBody dailyResult={dailyResult} plannedDay={plannedDay} navigateToDetails={navigateToDetails} />}

                {/**********/}
                {/* FOOTER */}
                {/**********/}
                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingTop: 10, paddingBottom: TIMELINE_CARD_PADDING }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <TouchableOpacity style={{ borderColor: colors.text }} onPress={isLiked ? undefined : onLike}>
                                <Ionicons
                                    name={isLiked ? 'heart' : 'heart-outline'}
                                    size={TIMELINE_CARD_ICON_SIZE}
                                    color={isLiked ? 'red' : colors.timeline_card_footer}
                                    onPress={isLiked ? undefined : onLike}
                                />
                            </TouchableOpacity>

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
                                    {commentCount}
                                </Text>
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                style={{ borderColor: colors.text, alignItems: 'flex-end', paddingRight: TIMELINE_CARD_PADDING }}
                                onPress={() => {
                                    alert("I don't work yet :(");
                                }}
                            >
                                <Ionicons name={'share-outline'} size={TIMELINE_CARD_ICON_SIZE} color={colors.timeline_card_footer} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
