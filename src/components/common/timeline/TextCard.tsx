import * as React from 'react';
import { Text, TextStyle, View, Image, ImageSourcePropType, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import { formatDistance } from 'date-fns';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { TIMELINE_CARD_ICON_COUNT_SIZE, TIMELINE_CARD_ICON_SIZE, TIMELINE_CARD_PADDING } from 'src/util/constants';

interface Props {
    staticImage?: ImageSourcePropType,
    userProfileModel?: UserProfileModel,

    added: Timestamp,
    name: string,
    title: string,
    body: string,

    likes: number,
    onLike: Function,
    isLiked: boolean

    comments: number,
    onCommented: Function,

    participants?: number,
    onAccepted?: Function,
    isAccepted?: boolean,
}

export const TextCard = ({ staticImage, userProfileModel, added, name, title, body, likes, comments, participants, onLike, onAccepted, onCommented, isLiked, isAccepted }: Props) => {
    const { colors } = useTheme();

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

    const [acceptedPressed, setAcceptedPressed] = React.useState(isAccepted);
    const [heartPressed, setHeartPressed] = React.useState(isLiked);

    const onAcceptedPressed = () => {
        if (acceptedPressed) {
            return;
        }

        setAcceptedPressed(true);
        onAccepted!();
    };

    const onHeartPressed = () => {
        if (heartPressed) {
            return;
        }

        setHeartPressed(true);
        onLike();
    };

    const onCommentPressed = () => {
        onCommented();
    };

    const time = formatDistance(added.toDate(), new Date(), { addSuffix: true });

    let bodyWithNewLines = body;

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_400Regular,
        Poppins_500Medium
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <TouchableWithoutFeedback onPress={onCommentPressed}>

            <View style={{ backgroundColor: colors.timeline_card_background, borderRadius: 15 }}>

                {/**********/}
                {/* HEADER */}
                {/**********/}
                <View style={{ width: "100%", flexDirection: "row" }}>
                    <View style={{ flex: 1, flexDirection: "row", paddingTop: TIMELINE_CARD_PADDING, paddingLeft: TIMELINE_CARD_PADDING }}>
                        <View>
                            {staticImage && <Image style={{ width: 45, height: 45 }} source={staticImage} />}
                            {userProfileModel && <NavigatableUserImage userProfileModel={userProfileModel} size={45} />}
                        </View>

                        <View style={{ paddingLeft: 10, flex: 1, alignSelf: 'stretch' }}>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                                    <Text style={{ fontFamily: "Poppins_600SemiBold", color: colors.timeline_card_header }}>{name}</Text>
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
                        <Text style={headerTextStyle}>{title}</Text>
                    </View>

                    <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingRight: TIMELINE_CARD_PADDING, paddingTop: 10 }}>
                        <Text style={[bodyTextStyle, { textAlign: "left" }]}>{bodyWithNewLines}</Text>
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
                                <Ionicons name={heartPressed ? 'heart' : 'heart-outline'} size={TIMELINE_CARD_ICON_SIZE} color={heartPressed ? "red" : colors.timeline_card_footer} onPress={isLiked ? undefined : onHeartPressed} />
                            </View>

                            <View style={{ justifyContent: "center", paddingLeft: 4 }}>
                                <Text style={{ color: colors.timeline_card_footer, fontSize: TIMELINE_CARD_ICON_COUNT_SIZE, fontFamily: "Poppins_500Medium" }}>{likes}</Text>
                            </View>

                            <View style={{ borderColor: colors.text, paddingLeft: 20 }}>
                                <Ionicons name={'chatbox-outline'} size={TIMELINE_CARD_ICON_SIZE} color={colors.timeline_card_footer} />
                            </View>

                            <View style={{ justifyContent: "center", paddingLeft: 4 }}>
                                <Text style={{ color: colors.timeline_card_footer, fontSize: TIMELINE_CARD_ICON_COUNT_SIZE, fontFamily: "Poppins_500Medium" }}>{comments}</Text>
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
    );
}