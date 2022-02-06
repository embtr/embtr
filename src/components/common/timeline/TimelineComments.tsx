import * as React from 'react';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { KeyboardAvoidingView, Text, TextStyle, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import ExploreController, { ChallengeModel as ChallengeModel } from 'src/controller/explore/ExploreController';
import { ExploreTabScreens } from 'src/navigation/RootStackParamList';
import { Banner } from 'src/components/common/Banner';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { isIosApp } from 'src/util/DeviceUtil';
import { getAuth } from 'firebase/auth';
import { CommentsScrollView } from 'src/components/common/comments/CommentsScrollView';
import { CommentsTextInput } from 'src/components/common/comments/CommentsTextInput';

export const TimelineComments = () => {
    const { colors } = useTheme();

    const headerTextStyle = {
        fontSize: 20,
        color: colors.text,
    } as TextStyle;

    const route = useRoute<RouteProp<ExploreTabScreens, 'ChallengeComments'>>();

    const [challengeModel, setChallengeModel] = React.useState<ChallengeModel | undefined>(undefined);

    useFocusEffect(
        React.useCallback(() => {
            ExploreController.getChallenge(route.params.id, setChallengeModel);
        }, [])
    );

    const submitComment = (text: string) => {
        const user = getAuth().currentUser;
        if (challengeModel?.id && user?.uid) {
            ExploreController.addComment(challengeModel.id, user.uid, text, () => {
                ExploreController.getChallenge(route.params.id, setChallengeModel);
            });
        }
    };

    return (
        <Screen>
            <Banner name='Comments' leftIcon={"arrow-back"} leftRoute="BACK" />

            <View style={{ marginTop: 20 }}>
                <Text style={[headerTextStyle, { paddingTop: 5, textAlign: "center", fontWeight: "bold" }]}>{challengeModel?.title}</Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={isIosApp() ? 45 : 111} behavior={isIosApp() ? 'padding' : 'height'}>
                <CommentsScrollView comments={challengeModel?.comments ? challengeModel?.comments : []} />
                <CommentsTextInput submitComment={submitComment} />
            </KeyboardAvoidingView>
        </Screen>
    )
}