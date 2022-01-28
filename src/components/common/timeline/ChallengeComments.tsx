import * as React from 'react';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { InputAccessoryView, KeyboardAvoidingView, ScrollView, Text, TextInput, TextStyle, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import ExploreController, { ChallengeModel as ChallengeModel } from 'src/controller/explore/ExploreController';
import { ExploreTabScreens } from 'src/navigation/RootStackParamList';
import { Banner } from 'src/components/common/Banner';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CommentBoxComment } from 'src/components/common/textbox/CommentBoxComment';
import { isIosApp } from 'src/util/DeviceUtil';

export const ChallengeComments = () => {
    const { colors } = useTheme();

    const headerTextStyle = {
        fontSize: 20,
        color: colors.text,
    } as TextStyle;

    const route = useRoute<RouteProp<ExploreTabScreens, 'ChallengeComments'>>();

    const [challengeModel, setChallengeModel] = React.useState<ChallengeModel | undefined>(undefined);
    const [commentText, setCommentText] = React.useState("");

    let challengeViews: JSX.Element[] = [];
    challengeModel?.comments.forEach(comment => {
        challengeViews.push(
            <View key={comment.uid + comment.comment} style={{ marginBottom: 7.5, backgroundColor: colors.background }}>
                <CommentBoxComment comment={comment} />
            </View>
        );
    });

    useFocusEffect(
        React.useCallback(() => {
            ExploreController.getChallenge(route.params.id, setChallengeModel);
        }, [])
    );

    return (
        <Screen>
            <Banner name='Comments' leftIcon={"arrow-back"} leftRoute="BACK" />

            <View style={{ marginTop: 20 }}>
                <Text style={[headerTextStyle, { paddingTop: 5, textAlign: "center", fontWeight: "bold" }]}>{challengeModel?.title}</Text>
            </View>
            <ScrollView style={{ marginTop: 20 }}>
                <View>
                    {challengeViews}
                </View>
            </ScrollView>

            {isIosApp() && 
                <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "flex-end" }}>
                    <TextInput
                        style={{
                            padding: 15,
                            color: colors.text,
                            backgroundColor: colors.background_secondary,
                            width: "100%",
                            paddingRight: 65
                        }}
                        placeholder={"add a comment..."}
                        onChangeText={accText => setCommentText(accText)}
                        value={commentText}
                    />
                    <View style={{ zIndex: 1, position: "absolute", paddingRight: 20 }}>
                        <Text onPress={() => { }} style={{ fontSize: 16, color: colors.primary_border }}>send</Text>
                    </View>
                </View>}

            { !isIosApp() && <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "flex-end" }}>
                <TextInput
                    style={{
                        padding: 15,
                        color: colors.text,
                        backgroundColor: colors.background_secondary,
                        width: "100%",
                        paddingRight: 65
                    }}
                    placeholder={"add a comment..."}
                    onChangeText={accText => setCommentText(accText)}
                    value={commentText}
                />
                <View style={{ zIndex: 1, position: "absolute", paddingRight: 20 }}>
                    <Text onPress={() => { }} style={{ fontSize: 16, color: colors.primary_border }}>send</Text>
                </View>
            </View> }


        </Screen>
    )
}