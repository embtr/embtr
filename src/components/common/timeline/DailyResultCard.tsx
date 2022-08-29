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

type timelineCommentsScreenProp = StackNavigationProp<TimelineTabScreens, 'TimelineComments'>;

interface Props {
    userProfileModel: UserProfileModel,
    dailyResult: DailyResultModel
}

export const DailyResultCard = ({ userProfileModel, dailyResult }: Props) => {
    const navigation = useNavigation<timelineCommentsScreenProp>();
    const { colors } = useTheme();

    const [likes, setLikes] = React.useState(dailyResult.public.likes.length);

    const onLike = () => {
        //StoryController.likeStory(dailyResult, getAuth().currentUser!.uid);
        setLikes(likes + 1);
    }

    const onCommented = () => {
        navigation.navigate('TimelineComments', { id: dailyResult?.id ? dailyResult.id : "" })
    };

    const isLiked = timelineEntryWasLikedBy(dailyResult, getAuth().currentUser!.uid);

    const headerTextStyle = {
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
        color: colors.timeline_card_body,
        paddingLeft: TIMELINE_CARD_PADDING,
    } as TextStyle;

    const bodyTextStyle = {
        fontSize: 12,
        fontFamily: "Poppins_400Regular",
        color: colors.timeline_card_body,
    } as TextStyle;

    const time = formatDistance(dailyResult.added.toDate(), new Date(), { addSuffix: true });

    let summary = "Day " + dailyResult.data.day + " " + (dailyResult.data.status === "FAILED" ? "Failed!" : "Completed!")

    return (
        <TouchableWithoutFeedback>

            <View style={{ backgroundColor: colors.timeline_card_background, borderRadius: 15 }}>

                {/**********/}
                {/* HEADER */}
                {/**********/}
                <View style={{ width: "100%", flexDirection: "row" }}>
                    <View style={{ flex: 1, flexDirection: "row", paddingTop: TIMELINE_CARD_PADDING, paddingLeft: TIMELINE_CARD_PADDING }}>
                        <View>
                            {userProfileModel && <NavigatableUserImage userProfileModel={userProfileModel} size={45} />}
                        </View>

                        <View style={{ paddingLeft: 10, flex: 1, alignSelf: 'stretch' }}>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                                    <Text style={{ fontFamily: "Poppins_600SemiBold", color: colors.timeline_card_header }}>{userProfileModel.name}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", paddingRight: TIMELINE_CARD_PADDING }}>
                                    <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 12, opacity: .75, color: colors.timeline_card_header }}>{time}</Text>
                                </View>
                            </View>

                            <View style={{ flex: 1, justifyContent: "flex-start" }}>
                                <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 10, color: colors.timeline_card_header }}>{userProfileModel?.location}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/**********/}
                {/*  BODY  */}
                {/**********/}
                <View style={{ paddingTop: 10 }}>
                    <View>
                        <Text style={headerTextStyle}>{summary}</Text>
                    </View>

                    <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingRight: TIMELINE_CARD_PADDING, paddingTop: 10 }}>
                        <Text style={[bodyTextStyle, { textAlign: "left" }]}>hello there</Text>
                        {/* <Text style={[bodyTextStyle, { color: "gray", fontSize: 12, textAlign: "right", marginTop: 5, marginRight: 10 }]}>{"view more..."}</Text> */}
                    </View>
                </View>

                {/**********/}
                {/* FOOTER */}
                {/**********/}
                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingTop: 10, paddingBottom: TIMELINE_CARD_PADDING }}>
                    <View style={{ flexDirection: "row", }}>
                        <View style={{ flexDirection: "row", flex: 1 }}>
                            <View style={{ borderColor: colors.text }}>
                                <Ionicons name={'heart-outline'} size={TIMELINE_CARD_ICON_SIZE} color={colors.timeline_card_footer} onPress={undefined } />
                            </View>

                            <View style={{ justifyContent: "center", paddingLeft: 4 }}>
                                <Text style={{ color: colors.timeline_card_footer, fontSize: TIMELINE_CARD_ICON_COUNT_SIZE, fontFamily: "Poppins_500Medium" }}>{likes}</Text>
                            </View>

                            <View style={{ borderColor: colors.text, paddingLeft: 20 }}>
                                <Ionicons name={'chatbox-outline'} size={TIMELINE_CARD_ICON_SIZE} color={colors.timeline_card_footer} />
                            </View>

                            <View style={{ justifyContent: "center", paddingLeft: 4 }}>
                                <Text style={{ color: colors.timeline_card_footer, fontSize: TIMELINE_CARD_ICON_COUNT_SIZE, fontFamily: "Poppins_500Medium" }}>{}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={{ borderColor: colors.text, alignItems: "flex-end", paddingRight: TIMELINE_CARD_PADDING }}>
                                <Ionicons name={'share-outline'} size={TIMELINE_CARD_ICON_SIZE} color={colors.timeline_card_footer} onPress={() => { alert("I don't work yet :(") }} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}
