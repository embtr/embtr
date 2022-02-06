import * as React from 'react';
import { KeyboardAvoidingView, Text, TextStyle, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Comment } from 'src/controller/explore/ExploreController';
import { Banner } from 'src/components/common/Banner';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { isIosApp } from 'src/util/DeviceUtil';
import { CommentsScrollView } from 'src/components/common/comments/CommentsScrollView';
import { CommentsTextInput } from 'src/components/common/comments/CommentsTextInput';

interface Props {
    title: string,
    comments: Comment[],
    submitComment: Function
}

export const Comments = ( { title, comments, submitComment } : Props ) => {
    const { colors } = useTheme();

    const headerTextStyle = {
        fontSize: 20,
        color: colors.text,
    } as TextStyle;

    return (
        <Screen>
            <Banner name='Comments' leftIcon={"arrow-back"} leftRoute="BACK" />

            <View style={{ marginTop: 20 }}>
                <Text style={[headerTextStyle, { paddingTop: 5, textAlign: "center", fontWeight: "bold" }]}>{title}</Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={isIosApp() ? 45 : 111} behavior={isIosApp() ? 'padding' : 'height'}>
                <CommentsScrollView comments={comments} />
                <CommentsTextInput submitComment={submitComment} />
            </KeyboardAvoidingView>
        </Screen>
    )
}