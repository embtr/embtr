import * as React from 'react';
import { Text, TextStyle, View, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import { formatDistance } from 'date-fns';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

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

    return (
        <View>
            <View style={{ height: "auto", marginLeft: 10, marginRight: 10, alignItems: "center" }}>

                <View style={{ width: "100%", flexDirection: "row", flex: 1 }}>
                    <Text style={{ color: "orange", flex: 1, textAlign: "left" }}>{participants !== undefined ? "CHALLENGE" : ""}</Text>
                    <Text style={[bodyTextStyle, { flex: 1, textAlign: "right", color: "gray", fontSize: 12 }]}>{time}</Text>
                </View>

                <View style={{ position: "absolute", zIndex: 1, width: "100%", paddingTop: 12 }}>
                    <Text style={{ color: "green", textAlign: "left", fontSize: 12 }}>{participants !== undefined ? "accepted" : ""}</Text>
                </View>

                {staticImage && <View><Image style={{ width: 45, height: 45 }} source={staticImage} /></View>}
                {userProfileModel && <NavigatableUserImage userProfileModel={userProfileModel} size={45} />}

                <View><Text style={[bodyTextStyle, { padding: 5 }]}>{name}</Text></View>
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