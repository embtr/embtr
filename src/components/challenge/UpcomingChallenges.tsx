import React from 'react';
import { View, RefreshControl } from 'react-native';
import { UpcomingChallenge } from 'src/components/challenge/UpcomingChallenge';
import { ChallengeCustomHooks } from 'src/controller/challenge/ChallengeController';
import { ScrollView } from 'react-native-gesture-handler';

export const UpcomingChallenges = () => {
    const [refreshing, setRefreshing] = React.useState(false);

    const challengeSummaries = ChallengeCustomHooks.useAllChallengeSummaries();

    const onRefresh = async () => {
        setRefreshing(true);
        await challengeSummaries.refetch();
        setRefreshing(false);
    };

    const challengeElements: JSX.Element[] = [];
    for (const challengeSummary of challengeSummaries.data ?? []) {
        const challengeElement = <UpcomingChallenge challengeSummary={challengeSummary} />;
        challengeElements.push(challengeElement);
    }

    const pairViews: JSX.Element[] = [];
    for (let i = 0; i < challengeElements.length; i += 2) {
        const pairView = (
            <View
                key={i}
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginBottom: 10, // Adjust the margin between rows as needed
                }}
            >
                <View style={{ flex: 1, paddingLeft: 5, paddingRight: 3.5 }}>
                    {challengeElements[i]}
                </View>
                <View style={{ flex: 1, paddingLeft: 3.5, paddingRight: 5 }}>
                    {challengeElements[i + 1]}
                </View>
            </View>
        );

        pairViews.push(pairView);
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={{ height: '100%' }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={{ height: 5 }} />
                {pairViews}
            </ScrollView>
        </View>
    );
};
