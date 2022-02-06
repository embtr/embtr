import * as React from 'react';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { Keyboard, KeyboardAvoidingView, ScrollView, Text, TextInput, TextStyle, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import ExploreController, { ChallengeModel as ChallengeModel } from 'src/controller/explore/ExploreController';
import { ExploreTabScreens } from 'src/navigation/RootStackParamList';
import { Banner } from 'src/components/common/Banner';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Comment } from 'src/components/common/timeline/comments/Comment';
import { isIosApp } from 'src/util/DeviceUtil';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';

export const Comments = () => {
    const { colors } = useTheme();

    const headerTextStyle = {
        fontSize: 20,
        color: colors.text,
    } as TextStyle;

    const route = useRoute<RouteProp<ExploreTabScreens, 'ChallengeComments'>>();

    const [challengeModel, setChallengeModel] = React.useState<ChallengeModel | undefined>(undefined);
    const [commentText, setCommentText] = React.useState("");
    const [comments, setComments] = React.useState<JSX.Element[]>([]);
    const [commentAdded, setCommentAdded] = React.useState<boolean>(false);

    const scrollRef = React.useRef<ScrollView>(null);

    useFocusEffect(
        React.useCallback(() => {
            ExploreController.getChallenge(route.params.id, setChallengeModel);
        }, [])
    );

    const submitComment = () => {
        if (commentText === "") {
            return;
        }

        setCommentAdded(true);
        Keyboard.dismiss();

        const user = getAuth().currentUser;
        if (challengeModel?.id && user?.uid) {
            ExploreController.addComment(challengeModel.id, user.uid, commentText, () => {
                ExploreController.getChallenge(route.params.id, setChallengeModel);
            });
        }

        setCommentText("");
    };

    useEffect(() => {
        let challengeViews: JSX.Element[] = [];
        challengeModel?.comments.forEach(comment => {
            challengeViews.push(
                <View key={comment.uid + comment.comment + comment.timestamp} style={{ marginBottom: 7.5, backgroundColor: colors.background }}>
                    <Comment comment={comment} />
                </View>
            );
        });

        setComments(challengeViews);
    }, [challengeModel]);

    const onCommentCountChanged = () => {
        if (commentAdded) {
            scrollRef.current?.scrollToEnd();
        }
    }

    return (
        <Screen>
            <Banner name='Comments' leftIcon={"arrow-back"} leftRoute="BACK" />

            <View style={{ marginTop: 20 }}>
                <Text style={[headerTextStyle, { paddingTop: 5, textAlign: "center", fontWeight: "bold" }]}>{challengeModel?.title}</Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={isIosApp() ? 45 : 111} behavior={isIosApp() ? 'padding' : 'height'}>
                <ScrollView onContentSizeChange={onCommentCountChanged} ref={scrollRef}>
                    {comments}
                </ScrollView>

                <View style={{ backgroundColor: "yellow", flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "flex-end" }}>
                    <TextInput
                        style={{ padding: 15, color: colors.text, backgroundColor: colors.background_secondary, width: "100%", paddingRight: 65 }}
                        placeholder={"add a comment..."}
                        onChangeText={accText => setCommentText(accText)}
                        value={commentText}
                        onSubmitEditing={() => { submitComment() }}
                    />
                    <View style={{ zIndex: 1, position: "absolute", paddingRight: 20 }}>
                        <Text onPress={() => { submitComment() }} style={{ fontSize: 16, color: colors.primary_border }}>send</Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Screen>
    )
}