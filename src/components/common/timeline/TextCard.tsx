import * as React from 'react';
import { Text, TextStyle, View, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { DropDownCommentBox } from 'src/components/common/textbox/DropDownCommentBox';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Comment } from 'src/controller/explore/ExploreController';

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
    latestComment?: Comment
}

export const TextCard = ({ staticImage, httpImage, onTouchImage, name, title, body, likes, comments, onLike, onCommented, isLiked, latestComment }: Props) => {
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

    const onHeartPressed = () => {
        if (heartPressed) {
            return;
        }

        setHeartPressed(true);
        onLike();
    };

    const onSubmitText = (text: string) => {
        onCommented(text);
    }

    return (
        <View>
            <TouchableWithoutFeedback onPressIn={undefined} onPress={() => { alert("touch") }}>
                <View style={{ height: "auto", marginLeft: 10, marginRight: 10, alignItems: "center" }}>
                    <View style={{ width: "100%" }}><Text style={[bodyTextStyle, { textAlign: "right", color: "gray", fontSize: 12 }]}>Jan 20, 2022</Text></View>
                    {staticImage && <View><Image style={{ width: 45, height: 45 }} source={staticImage} /></View>}
                    {httpImage && <View><TouchableOpacity disabled={!onTouchImage} onPress={() => { onTouchImage!() }} ><Image style={{ width: 45, height: 45, borderRadius: 50 }} source={{ uri: httpImage }} /></TouchableOpacity></View>}
                    <View><Text style={[bodyTextStyle, { padding: 5 }]}>{name}</Text></View>
                </View>
                <View style={{ height: "auto", paddingLeft: "1%", paddingRight: "1%", }}>

                    <View>
                        <Text style={[headerTextStyle, { paddingTop: 5, textAlign: "center" }]}>{title}</Text>
                    </View>

                    <View style={{ marginTop: 15, marginBottom: 5 }}>
                        <Text style={[bodyTextStyle, { textAlign: "left" }]}>{body}</Text>
                        <Text style={[bodyTextStyle, { color: "gray", fontSize: 12, textAlign: "right", marginTop: 5, marginRight: 10 }]}>view more...</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>

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
                    <Ionicons name={displayCommentBox ? 'chatbox' : 'chatbox-outline'} size={22} color={colors.text} onPress={() => { setDisplayCommentBox(!displayCommentBox); }} />
                </View>
            </View>

            <DropDownCommentBox placeholder='add a comment...' display={displayCommentBox} onSubmitText={onSubmitText} displayComment={latestComment} />
        </View>
    );
}