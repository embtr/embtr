import * as React from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { EmbtrTextCard } from 'src/components/common/timeline/EmbtrTextCard';
import { useFocusEffect } from '@react-navigation/native';
import ExploreController, { ChallangeModel } from 'src/controller/explore/ExploreController';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export const Explore = () => {
    const { colors } = useTheme();

    const [challenges, setChallenges] = React.useState<ChallangeModel[]>([]);

    const scrollRef = React.useRef<ScrollView>(null);
    const scrollToEnd = () => {
        scrollRef.current?.scrollToEnd({animated: true});
    };

    useFocusEffect(
        React.useCallback(() => {
            ExploreController.getChallenges(setChallenges);
        }, [])
    );

    let challengeViews: JSX.Element[] = [];
    challenges.forEach((challenge, key, arr) => {
        let scrollDown: Function | undefined = undefined;
        if (Object.is(arr.length - 1, key)) {
            scrollDown = scrollToEnd;
        }
        challengeViews.push(
            <View key={challenge.title} style={{ marginBottom: 7.5, backgroundColor: colors.background }}>
                <EmbtrTextCard challengeModel={challenge} scrollToEnd={scrollDown} />
            </View>
        );
    });

    return (
        <Screen>
            <Banner name="Explore" />
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled keyboardVerticalOffset={20}>
                <ScrollView ref={scrollRef} keyboardShouldPersistTaps={'handled'} style={{ backgroundColor: colors.background_secondary }}>
                    <View style={{ flex: 1 }}>
                        {challengeViews}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    );
}