import * as React from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { CommentBoxComment } from 'src/components/common/textbox/CommentBoxComment';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    submitComment: Function
}

export const CommentsTextInput = ({ submitComment }: Props) => {
    const { colors } = useTheme();

    const [commentText, setCommentText] = React.useState("");

    const submitCommentPressed = () => {
        if (commentText === "") {
            return;
        }

        Keyboard.dismiss();
        submitComment(commentText);
        setCommentText("");
    };

    return (
        <View style={{ backgroundColor: "yellow", flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "flex-end" }}>
            <TextInput
                style={{ padding: 15, color: colors.text, backgroundColor: colors.background_secondary, width: "100%", paddingRight: 65 }}
                placeholder={"add a comment..."}
                onChangeText={text => setCommentText(text)}
                value={commentText}
                onSubmitEditing={() => { submitCommentPressed() }}
            />
            <View style={{ zIndex: 1, position: "absolute", paddingRight: 20 }}>
                <Text onPress={() => { submitCommentPressed() }} style={{ fontSize: 16, color: colors.primary_border }}>send</Text>
            </View>
        </View>
    );
}