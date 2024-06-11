import React from 'react';
import { View } from 'react-native';
import { UpcomingChallenge } from 'src/components/challenge/UpcomingChallenge';
import { ChallengeCustomHooks } from 'src/controller/challenge/ChallengeController';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { PADDING_LARGE } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';

export const UpcomingChallenges = () => {
    const colors = useTheme().colors;
    const [refreshing, setRefreshing] = React.useState(false);

    const challengeSummaries = ChallengeCustomHooks.useAllChallengeSummaries();

    const onRefresh = async () => {
        setRefreshing(true);
        await challengeSummaries.refetch();
        setRefreshing(false);
    };

    const challengeElements: JSX.Element[] = [];
    for (const challengeSummary of challengeSummaries.data ?? []) {
        const challengeElement = (
            <UpcomingChallenge key={challengeSummary.id} challengeSummary={challengeSummary} />
        );
        challengeElements.push(challengeElement);
    }

    const challengeViews: JSX.Element[] = [];
    for (let i = 0; i < challengeElements.length; i++) {
        challengeViews.push(
            <View style={{ flex: 1, padding: PADDING_LARGE, paddingTop: 0 }}>
                {challengeElements[i]}
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        colors={[colors.accent_color_light]}
                        progressBackgroundColor={'white'}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={{ height: PADDING_LARGE }} />
                {challengeViews}
                <View style={{ height: PADDING_LARGE }} />
            </ScrollView>
        </View>
    );
};
