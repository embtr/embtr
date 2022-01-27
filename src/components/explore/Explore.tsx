import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { EmbtrTextCard } from 'src/components/common/timeline/EmbtrTextCard';
import { useFocusEffect } from '@react-navigation/native';
import ExploreController, { ChallengeModel } from 'src/controller/explore/ExploreController';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const Explore = () => {
    const { colors } = useTheme();

    const [challenges, setChallenges] = React.useState<ChallengeModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            ExploreController.getChallenges(setChallenges);
        }, [])
    );

    let challengeViews: JSX.Element[] = [];
    challenges.forEach(challenge => {
        challengeViews.push(
            <View key={challenge.title} style={{ marginBottom: 7.5, backgroundColor: colors.background }}>
                <EmbtrTextCard challengeModel={challenge} />
            </View>
        );
    });

    return (
        <Screen>
            <Banner name="Explore" />
            <ScrollView keyboardShouldPersistTaps={'handled'} style={{ backgroundColor: colors.background_secondary }}>
                <View style={{ flex: 1 }}>
                    {challengeViews}
                </View>
            </ScrollView>
        </Screen>
    );
}