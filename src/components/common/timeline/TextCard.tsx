import * as React from 'react';
import { Text, TextStyle, View, Image, ImageSourcePropType, TouchableOpacity, ViewStyle } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { DropDownTextBox } from 'src/components/common/textbox/DropDownTextBox';

interface Props {
    staticImage?: ImageSourcePropType,
    httpImage?: string,
    onTouchImage?: Function
    name: string,
    title: string,
    body: string,
    likes: number,
    comments: number
    onLike: Function,
    onCommented: Function,
    isLiked: boolean
}

export const TextCard = ({ staticImage, httpImage, onTouchImage, name, title, body, likes, comments, onLike, onCommented, isLiked }: Props) => {
    const { colors } = useTheme();

    const headerTextStyle = {
        fontSize: 20,
        color: colors.text,
    } as TextStyle;

    const bodyTextStyle = {
        fontSize: 14,
        color: colors.text,
    } as TextStyle;

    const [heartPressed, setHeartPressed] = React.useState(isLiked);
    const [displayCommentBox, setDisplayCommentBox] = React.useState(false);
    const [commentText, setCommentText] = React.useState("");

    const onHeartPressed = () => {
        if (heartPressed) {
            return;
        }

        setHeartPressed(true);
        onLike();
    };

    const onSubmitText = () => {
        onCommented(commentText);
        setDisplayCommentBox(false);
        setCommentText("");
    }

    return (
        <View>
            <HorizontalLine />

            <View style={{ height: "auto", marginLeft: 10, marginRight: 10, alignItems: "center" }}>
                <View style={{ width: "100%" }}><Text style={[bodyTextStyle, { textAlign: "right", color: "gray", fontSize: 12 }]}>Jan 20, 2022</Text></View>
                {staticImage && <View><Image style={{ width: 45, height: 45 }} source={staticImage} /></View>}
                {httpImage && <View><TouchableOpacity disabled={!onTouchImage} onPress={() => { onTouchImage!() }} ><Image style={{ width: 45, height: 45, borderRadius: 50 }} source={{ uri: httpImage }} /></TouchableOpacity></View>}
                <View><Text style={[bodyTextStyle, { padding: 5 }]}>{name}</Text></View>
                <View>
                    <Text style={[headerTextStyle, { paddingTop: 5, textAlign: "center" }]}>{title}</Text>
                </View>

                <View style={{ marginTop: 15, marginBottom: 5 }}>
                    <Text style={[bodyTextStyle, { paddingLeft: "2.5%", paddingRight: "2.5%", textAlign: "left" }]}>{body}</Text>
                    <Text style={[bodyTextStyle, { color: "gray", fontSize: 12, textAlign: "right", marginTop: 5 }]}>view more...</Text>
                </View>
            </View>

            <View style={{ paddingRight: 15, height: "auto", marginTop: 5, marginBottom: 5, flexDirection: "row", justifyContent: "flex-end" }}>

                <View style={{ borderColor: colors.text, marginRight: 5, justifyContent: "center" }}>
                    <Text style={{ color: "grey", fontSize: 12 }}>{likes} likes</Text>
                </View>

                <View style={{ borderColor: colors.text, marginRight: 10, justifyContent: "center" }}>
                    <Text style={{ color: "grey", fontSize: 12 }}>{comments} comments</Text>
                </View>

                <View style={{ borderColor: colors.text, marginRight: 5 }}>
                    <Ionicons name={heartPressed ? 'heart' : 'heart-outline'} size={22} color={heartPressed ? "red" : colors.text} onPress={onHeartPressed} />
                </View>

                <View style={{ borderColor: colors.text, marginLeft: 5 }}>
                    <Ionicons name={'chatbox-outline'} size={22} color={colors.text} onPress={() => { setDisplayCommentBox(!displayCommentBox); }} />
                </View>
            </View>

            <DropDownTextBox text={commentText} textSize={14} onChangeText={setCommentText} placeholder='add a comment...' display={displayCommentBox} onSubmitText={onSubmitText} />

            <HorizontalLine />
        </View>
    );
}