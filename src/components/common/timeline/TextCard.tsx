import * as React from 'react';
import { Text, TextStyle, View, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import { formatDistance } from 'date-fns';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { HorizontalLine } from 'src/components/common/HorizontalLine';

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
        fontSize: 20,
        color: colors.text,
    } as TextStyle;

    const bodyTextStyle = {
        fontSize: 14,
        color: colors.text,
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
        Poppins_400Regular
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <View style={{ backgroundColor: colors.timeline_card_background, borderRadius: 15 }}>
            <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={{ flex: 1, flexDirection: "row", paddingTop: 12, paddingLeft: 12 }}>
                    <View>
                        {staticImage && <Image style={{ width: 45, height: 45 }} source={staticImage} />}
                        {userProfileModel && <NavigatableUserImage userProfileModel={userProfileModel} size={45} />}
                    </View>

                    <View style={{ paddingLeft: 10, flex: 1, alignSelf: 'stretch' }}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                                <Text style={{ fontFamily: "Poppins_600SemiBold", color: colors.timeline_card_header }}>{name}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", paddingRight: 12 }}>
                                <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 12, opacity: .75, color: colors.timeline_card_header }}>{time}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, justifyContent: "flex-start" }}>
                            <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 10, color: colors.timeline_card_header }}>Glen Burnie, MD</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ flex: 1, flexDirection: "row", paddingLeft: 10 }}>
            </View>

            <View style={{ height: "auto", paddingLeft: "1%", paddingRight: "1%", }}>
                <View>
                    <Text style={[headerTextStyle, { paddingTop: 5, textAlign: "center" }]}>{title}</Text>
                </View>

                <View style={{ marginTop: 15, marginBottom: 5 }}>
                    <Text style={[bodyTextStyle, { textAlign: "left" }]}>{bodyWithNewLines}</Text>
                    <Text style={[bodyTextStyle, { color: "gray", fontSize: 12, textAlign: "right", marginTop: 5, marginRight: 10 }]}>{/*"view more..."*/}</Text>
                </View>
            </View>

            <View style={{ paddingRight: 15, height: "auto", marginTop: 5, marginBottom: 5, flexDirection: "row", justifyContent: "flex-end" }}>
                {participants !== undefined && <View style={{ marginRight: 5, justifyContent: "flex-end" }}>
                    <Text style={{ color: "grey", fontSize: 12 }}>{participants} {participants === 1 ? "participant" : "participants"}</Text>
                </View>}

                <View style={{ marginRight: 5, justifyContent: "flex-end" }}>
                    <Text style={{ color: "grey", fontSize: 12 }}>{likes} {likes === 1 ? "like" : "likes"}</Text>
                </View>

                <View style={{ marginRight: 10, justifyContent: "flex-end" }}>
                    <Text style={{ color: "grey", fontSize: 12 }}>{comments} {comments === 1 ? "comment" : "comments"}</Text>
                </View>

                {participants !== undefined && <View style={{ borderColor: colors.text, marginRight: 5 }}>
                    <Ionicons name={acceptedPressed ? 'checkmark-circle-outline' : 'checkmark-circle-outline'} size={22} color={acceptedPressed ? "green" : colors.text} onPress={isAccepted ? undefined : onAcceptedPressed} />
                </View>}

                <View style={{ borderColor: colors.text, marginRight: 2.5 }}>
                    <Ionicons name={heartPressed ? 'heart' : 'heart-outline'} size={22} color={heartPressed ? "red" : colors.text} onPress={isLiked ? undefined : onHeartPressed} />
                </View>

                <View style={{ borderColor: colors.text, marginLeft: 5 }}>
                    <Ionicons name={'chatbox-outline'} size={22} color={colors.text} onPress={onCommentPressed} />
                </View>
            </View>

        </View>
    );
}